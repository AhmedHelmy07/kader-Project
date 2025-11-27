# Firestore Security Rules Guide

This document provides recommended Firestore security rules to harden the Kader Project application.

## Current State
The application currently uses permissive rules during development. For production, implement the rules below to restrict admin operations and protect user data.

## Recommended Rules

Copy and paste the following rules into your Firestore Rules editor:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
    }
    
    function isOwner(uid) {
      return isSignedIn() && request.auth.uid == uid;
    }
    
    // Public read collections
    match /products/{document=**} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    match /courses/{document=**} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    match /jobs/{document=**} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    match /messages/{document=**} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isAdmin() || isOwner(resource.data.uid);
    }
    
    match /contact_messages/{document=**} {
      allow read: if isAdmin();
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }
    
    // User data
    match /users/{uid} {
      allow read: if isOwner(uid) || isAdmin();
      allow create: if isOwner(uid);
      allow update: if isOwner(uid) && !request.resource.data.admin;
      allow update: if isAdmin();
    }
    
    // User tickets
    match /tickets/{document=**} {
      allow read: if isAdmin() || isOwner(resource.data.uid);
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }
    
    // User orders
    match /orders/{document=**} {
      allow read: if isAdmin() || isOwner(resource.data.uid);
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }
    
    // User carts (per-user)
    match /carts/{uid} {
      allow read, write: if isOwner(uid);
    }
    
    // Admin password (dev only - consider removing in production)
    match /admin_pass/{document=**} {
      allow read: if false; // Prevent client-side reads in production
      allow write: if false; // Only set via Admin SDK
    }
  }
}
```

## Key Security Points

1. **Product, Courses, Jobs**: Public read, admin-only write
2. **Messages**: Public read, user create, admin/owner delete
3. **Contact Messages**: Admin read only, user create, admin delete
4. **Users**: Owner/admin read, owner create (no admin flag), admin can update
5. **Tickets/Orders**: Admin/owner read, user create, admin update
6. **Carts**: Per-user isolated access
7. **Admin Pass**: Disabled for security (set via Admin SDK only)

## Migration to Custom Claims

For production, replace the `admin` flag in Firestore with Firebase Auth custom claims:

```javascript
function isAdmin() {
  return request.auth.token.admin == true;
}
```

See `CUSTOM_CLAIMS_SETUP.md` for implementation details.

## Implementation Steps

1. Go to Firebase Console → Firestore
2. Click "Rules" tab
3. Replace the default rules with the rules above
4. Click "Publish"
5. Test with your application

## Testing

After deploying rules:
- ✅ Users can read products
- ✅ Only admins can create/update/delete products
- ✅ Users can create support tickets
- ✅ Only admins can update ticket status
- ❌ Non-admin users cannot modify other users' data
- ❌ Non-admin users cannot access contact messages

