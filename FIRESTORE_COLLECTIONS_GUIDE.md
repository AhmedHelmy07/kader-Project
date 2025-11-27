# Firestore Collections - Visual Reference

## What You Need to Create in Firebase Console

### Two Collections Required:

```
Firestore Database
├── medical_records/          ← CREATE THIS COLLECTION
│   ├── doc1 {
│   │   uid: "user123"
│   │   userEmail: "user@example.com"
│   │   title: "Checkup"
│   │   description: "..."
│   │   medicalCase: "Routine"
│   │   severity: "Low"
│   │   createdAt: timestamp
│   │   updatedAt: timestamp
│   └── }
│
└── sos_records/             ← CREATE THIS COLLECTION
    ├── doc1 {
    │   uid: "user123"
    │   userEmail: "user@example.com"
    │   message: "Emergency"
    │   priority: "Critical"
    │   status: "Pending"
    │   createdAt: timestamp
    │   updatedAt: timestamp
    │   respondedBy: "admin@example.com" (optional)
    │   resolvedAt: timestamp (optional)
    └── }
```

---

## How to Create Collections in Firebase Console

### Step 1: Open Firestore
```
1. Go to https://console.firebase.google.com
2. Select your project
3. Click "Firestore Database" (left sidebar)
4. You should see existing collections
```

### Step 2: Create `medical_records` Collection
```
1. Click "Create Collection" button
2. Enter: medical_records
3. Click "Next"
4. Leave first document empty (or create test data)
5. Click "Save"
```

### Step 3: Create `sos_records` Collection  
```
1. Click "Create Collection" button again
2. Enter: sos_records
3. Click "Next"
4. Leave first document empty (or create test data)
5. Click "Save"
```

### Step 4: Verify Creation
```
You should now see in Firestore:
✓ medical_records (empty or with test data)
✓ sos_records (empty or with test data)
```

---

## Complete List of Collections

Your app now has these collections:

```
Database Collections:
├── products (E-commerce)
├── tickets (Support)
├── messages (Community)
├── contact_messages (Contact form)
├── orders (Orders)
├── users (User profiles)
├── carts (Shopping)
├── courses (Learning)
├── jobs (Careers)
├── medical_records ← NEW ✅
├── sos_records ← NEW ✅
└── admin_pass (Admin)
```

---

## Data Types Guide

### Severity Levels (Medical Records)
```
"Low"      → Green indicator, routine care
"Medium"   → Yellow indicator, needs attention
"High"     → Orange indicator, urgent
"Critical" → Red indicator, emergency
```

### Priority Levels (SOS Records)
```
"Low"      → Green, standard response
"Medium"   → Yellow, moderate urgency
"High"     → Orange, urgent response
"Critical" → Red, immediate response
```

### Status Levels (SOS Records)
```
"Pending"   → 🚨 Red, waiting for response
"Responded" → ✓ Blue, admin acknowledged
"Resolved"  → ✓✓ Green, issue handled
```

---

## Firebase Console Navigation

### Location of Collections Tab
```
Firebase Console
└── Your Project
    └── Build (left sidebar)
        └── Firestore Database
            └── Data Tab (where you create collections)
```

### Step-by-Step Screenshot Guide

**Screenshot 1: Main Dashboard**
```
firebase.google.com → Select Project → Firestore Database
```

**Screenshot 2: Collections View**
```
Shows existing: products, tickets, messages, etc.
```

**Screenshot 3: Create Collection**
```
Click "Create Collection" button → Enter name → Create
```

---

## Document Structure Examples

### Example Medical Record Document
```
Collection: medical_records
Document ID: abc123def456

{
  uid: "user_firebase_uid_here",
  userEmail: "patient@gmail.com",
  title: "Annual Physical",
  description: "Annual physical examination completed. All vital signs normal.",
  medicalCase: "Preventive Care",
  severity: "Low",
  createdAt: November 27, 2025, 10:30:00 AM,
  updatedAt: November 27, 2025, 10:30:00 AM,
  recordDate: November 27, 2025, 10:00:00 AM
}
```

### Example SOS Record Document
```
Collection: sos_records
Document ID: xyz789abc123

{
  uid: "user_firebase_uid_here",
  userEmail: "patient@gmail.com",
  message: "Emergency - cannot move wheelchair, need assistance",
  priority: "Critical",
  status: "Pending",
  createdAt: November 27, 2025, 3:15:00 PM,
  updatedAt: November 27, 2025, 3:15:00 PM,
  respondedBy: null,
  resolvedAt: null,
  location: null
}
```

---

## Security Rules to Add

Go to **Firestore Database → Rules** and add:

```javascript
// Medical Records - User can see their own, admin sees all
match /medical_records/{document=**} {
  allow read: if request.auth.uid == resource.data.uid || request.auth.token.admin == true;
  allow create: if request.auth.uid == request.resource.data.uid;
  allow update: if request.auth.uid == resource.data.uid;
  allow delete: if false;
}

// SOS Records - User can see/edit their own, admin sees all
match /sos_records/{document=**} {
  allow read: if request.auth.uid == resource.data.uid || request.auth.token.admin == true;
  allow create: if request.auth.uid == request.resource.data.uid;
  allow update: if request.auth.uid == resource.data.uid || request.auth.token.admin == true;
  allow delete: if false;
}
```

---

## Admin Custom Claims Setup

For admin features:

```
1. Firebase Console → Authentication
2. Find: kaderwheelchair@gmail.com
3. Click three dots → Edit user
4. Scroll to "Custom claims"
5. Paste: {"admin": true}
6. Click Save
```

---

## Verification Checklist

After creating collections:

- [ ] I can see `medical_records` collection in Firestore
- [ ] I can see `sos_records` collection in Firestore
- [ ] Both collections show as empty (ready for data)
- [ ] I updated Firestore security rules
- [ ] I set admin custom claims for kaderwheelchair@gmail.com
- [ ] App still builds successfully
- [ ] Medical Records button visible in navbar
- [ ] SOS button visible in navbar

---

## Common Issues & Fixes

### Issue: Can't create collection
**Fix:** Make sure Firestore is in "Native mode" not "Datastore mode"

### Issue: Collections not showing
**Fix:** Refresh browser or clear browser cache

### Issue: "Permission denied" errors
**Fix:** Check Firestore rules - add the rules from this guide

### Issue: Admin tab not working
**Fix:** Verify custom claims are set to `{"admin": true}`

### Issue: Real-time updates not working
**Fix:** Check internet connection and Firestore status page

---

## Field Types Reference

When creating test documents manually:

| Field | Type | Example |
|-------|------|---------|
| uid | String | "user_firebase_id_123" |
| userEmail | String | "user@example.com" |
| title | String | "Checkup" |
| message | String | "Emergency text" |
| description | String | "Long description..." |
| severity/priority | String | "High" (must match enum) |
| status | String | "Pending" |
| createdAt | Timestamp | Server Timestamp |
| updatedAt | Timestamp | Server Timestamp |
| respondedBy | String | "admin@example.com" |
| location | Map | {x: 40.7, y: -74.0} |

---

## Quick Commands

### Firebase CLI (Optional)
```bash
# If using Firebase CLI
firebase firestore:rules:publish /path/to/rules.txt
firebase auth:import users.json
```

---

## Next Steps

1. ✅ Create the two collections
2. ✅ Add security rules
3. ✅ Set admin custom claims
4. ✅ Test by creating a medical record
5. ✅ Test by creating an SOS alert
6. ✅ Verify real-time sync works
7. ✅ Deploy to production

---

**That's it! You now have everything you need to set up Firestore for the Healthcare Features.**

For detailed setup guide, see: `FIRESTORE_COMPLETE_SETUP.md`

**Last Updated:** November 27, 2025
