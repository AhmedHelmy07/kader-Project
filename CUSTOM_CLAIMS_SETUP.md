# Firebase Custom Claims Setup

This document explains how to migrate from the in-Firestore admin password approach to Firebase Auth custom claims.

## Why Custom Claims?

✅ **Benefits:**
- More secure than storing passwords in Firestore
- Enforced at the authentication layer
- Can be verified server-side without Firestore calls
- Enables role-based access control (RBAC)
- Scales better for complex permissions

## Implementation

### Step 1: Set Custom Claims via Admin SDK

Use the Firebase Admin SDK (backend/Cloud Functions) to set custom claims:

```typescript
// backend/setAdminClaim.ts
import * as admin from 'firebase-admin';

export async function setUserAdmin(uid: string, isAdmin: boolean) {
  await admin.auth().setCustomUserClaims(uid, { admin: isAdmin });
}
```

Deploy as a Cloud Function or backend endpoint:

```bash
firebase deploy --only functions:setUserAdmin
```

### Step 2: Update Client Code

Replace Firestore admin checks with token claims:

**Old approach (in `AdminPage.tsx` currently):**
```typescript
const isAdmin = userRecord.admin === true; // Reads from Firestore
```

**New approach:**
```typescript
// In auth/AuthContext.tsx
const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      setIsAdmin(idTokenResult.claims.admin === true);
    } else {
      setIsAdmin(false);
    }
  });
}, []);
```

### Step 3: Update Firestore Rules

Replace the Firestore admin check:

```javascript
// OLD
function isAdmin() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
}

// NEW
function isAdmin() {
  return request.auth.token.admin == true;
}
```

### Step 4: Update Admin Page

Simplify the admin unlock flow:

**Current flow (password-based):**
- User enters password
- Client reads admin_pass collection
- Compare strings

**New flow (custom claims):**
- User logs in → Firebase Auth → Custom claims in token
- No password needed
- Admin status determined automatically

### Step 5: Create Admin Management UI

Add an admin management section in the dashboard:

```typescript
// In AdminPage.tsx - replace "Make Me Admin" button
const handleSetAdminFromAPI = async () => {
  if (!user?.email) return;
  
  try {
    // Call your backend endpoint
    const response = await fetch('/api/admin/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        uid: user.uid,
        email: user.email,
        isAdmin: true 
      })
    });
    
    if (response.ok) {
      // Refresh token
      await user.getIdTokenResult(true);
      window.location.reload();
    }
  } catch (err) {
    console.error('Failed to set admin:', err);
  }
};
```

## Migration Path

### Phase 1: Parallel Systems (Current)
- Keep admin_pass collection
- Add custom claims in parallel
- UI checks both sources

### Phase 2: Transition
- Update all admin checks to custom claims
- Remove admin_pass from Firestore rules
- Keep admin_pass as fallback

### Phase 3: Cleanup
- Remove admin_pass collection entirely
- Remove fallback logic from code
- Update documentation

## Cloud Function Example

Deploy this function to set admin claims:

```typescript
// functions/src/admin.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const setAdmin = functions.https.onCall(async (data, context) => {
  // Check if caller is already admin
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can set admin status'
    );
  }

  const { uid, isAdmin } = data;

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: isAdmin });
    return { success: true, message: `User ${uid} admin status set to ${isAdmin}` };
  } catch (err) {
    throw new functions.https.HttpsError('internal', 'Failed to set admin status');
  }
});
```

## Testing Custom Claims

```typescript
// Test in console
const user = auth.currentUser;
const idTokenResult = await user?.getIdTokenResult();
console.log(idTokenResult?.claims);
// Output: { admin: true, ... }
```

## Security Considerations

1. **Always verify on backend** - Custom claims can be forged in older clients
2. **Refresh tokens periodically** - Claims changes take ~1 hour to propagate
3. **Use HTTPS only** - Tokens transmitted must be encrypted
4. **Rotate admin access** - Revoke claims when needed
5. **Log admin actions** - Audit trail for compliance

## Troubleshooting

**Custom claims not appearing in token:**
- Call `user.getIdTokenResult(true)` to force refresh
- Wait up to 1 hour for propagation
- Check user hasn't been deleted/recreated

**Admin actions still failing:**
- Verify Firestore rules reference `request.auth.token.admin`
- Check user has custom claims set
- Review Cloud Functions logs

## Resources

- [Firebase Custom Claims Documentation](https://firebase.google.com/docs/auth/admin-setup)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/start)
- [Cloud Functions for Firebase](https://firebase.google.com/docs/functions)

