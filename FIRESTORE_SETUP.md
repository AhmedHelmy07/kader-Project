# Firestore Collections & Setup Guide

## Collections You Need to Create

### 1. **medical_records** (Already implemented)
Create a collection named `medical_records` in Firestore with the following structure:

**Documents Structure:**
```
medical_records/
├── {docId}/
│   ├── uid: string (user's unique ID from Firebase Auth)
│   ├── userEmail: string (user's email address)
│   ├── title: string (record title, e.g., "Annual Checkup")
│   ├── description: string (detailed description)
│   ├── medicalCase: string (diagnosis or condition)
│   ├── severity: string ("Low" | "Medium" | "High" | "Critical")
│   ├── createdAt: timestamp (server timestamp)
│   ├── updatedAt: timestamp (server timestamp)
│   └── recordDate: timestamp (optional - date of the medical event)
```

**Index:** Create a composite index on:
- `uid` (Ascending)
- `createdAt` (Descending)

---

### 2. **sos_records** (Already implemented)
Create a collection named `sos_records` in Firestore with the following structure:

**Documents Structure:**
```
sos_records/
├── {docId}/
│   ├── uid: string (user's unique ID from Firebase Auth)
│   ├── userEmail: string (user's email address)
│   ├── message: string (emergency message)
│   ├── priority: string ("Low" | "Medium" | "High" | "Critical")
│   ├── status: string ("Pending" | "Responded" | "Resolved")
│   ├── respondedBy: string (optional - admin email who responded)
│   ├── location: object (optional)
│   │   ├── x: number
│   │   └── y: number
│   ├── createdAt: timestamp (server timestamp)
│   ├── updatedAt: timestamp (server timestamp)
│   └── resolvedAt: timestamp (optional - when resolved)
```

**Index:** Create a composite index on:
- `uid` (Ascending)
- `createdAt` (Descending)

**Additional Index:**
- `status` (Ascending)
- `priority` (Ascending)

---

## Firestore Security Rules

### Recommended Rules for Production

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Medical Records Security
    match /medical_records/{document=**} {
      // Users can read their own records
      allow read: if request.auth.uid == resource.data.uid;
      
      // Users can create records
      allow create: if request.auth.uid == request.resource.data.uid &&
                       request.resource.data.uid == request.auth.uid;
      
      // Users can update their own records
      allow update: if request.auth.uid == resource.data.uid;
      
      // Users cannot delete, only admins can
      allow delete: if false;
      
      // Admins can read all records
      allow read: if request.auth.token.admin == true;
      allow delete: if request.auth.token.admin == true;
    }
    
    // SOS Records Security
    match /sos_records/{document=**} {
      // Users can read their own records
      allow read: if request.auth.uid == resource.data.uid;
      
      // Users can create SOS records
      allow create: if request.auth.uid == request.resource.data.uid &&
                       request.resource.data.status == "Pending";
      
      // Users can update their own records (status changes)
      allow update: if request.auth.uid == resource.data.uid;
      
      // Users cannot delete
      allow delete: if false;
      
      // Admins can read and update all records
      allow read: if request.auth.token.admin == true;
      allow update: if request.auth.token.admin == true;
      allow delete: if request.auth.token.admin == true;
    }
    
    // Existing collections...
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth.token.admin == true;
    }
    
    // Other collections remain as before
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## Step-by-Step Setup Instructions

### Step 1: Create Collections in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Click **Create Collection**
5. Enter collection name: `medical_records`
6. Click **Next**
7. Click **Add document** or leave empty (documents created programmatically)
8. Repeat for `sos_records` collection

### Step 2: Create Indexes (Recommended)

1. In Firestore console, go to **Indexes** tab
2. Click **Create Index**
3. Create indexes as specified above (Firestore will prompt you when needed)

### Step 3: Update Security Rules

1. In Firestore console, go to **Rules** tab
2. Replace the default rules with the recommended rules above
3. Click **Publish**

### Step 4: Enable Custom Claims for Admin

1. Go to Firebase Console → **Authentication**
2. Find admin user (kaderwheelchair@gmail.com)
3. Click the three dots → **Edit user**
4. Scroll down to **Custom claims**
5. Add: `{"admin": true}`
6. Click **Save**

---

## All Firestore Collections in Your App

| Collection | Purpose | Documents | Indexed Fields |
|------------|---------|-----------|-----------------|
| `products` | E-commerce products | Product details | title, price, stock |
| `tickets` | Support tickets | Support requests | uid, status, createdAt |
| `messages` | Community messages | Posts/comments | uid, createdAt |
| `contact_messages` | Contact form submissions | Contact inquiries | email, createdAt |
| `orders` | Purchase orders | Order details | uid, status, createdAt |
| `users` | User profiles | User data | uid, email, admin |
| `carts` | Shopping carts | Cart items | uid, updatedAt |
| `courses` | Online courses | Course details | category, level |
| `jobs` | Job postings | Job listings | location, type |
| **`medical_records`** | **Medical records** | **User medical history** | **uid, severity, createdAt** |
| **`sos_records`** | **Emergency alerts** | **SOS alerts** | **uid, status, priority, createdAt** |
| `admin_pass` | Admin password hash | Security | - |

---

## Data Types Reference

### Timestamp
Firestore serverTimestamp():
- In TypeScript: `firebase.firestore.FieldValue`
- In JavaScript: `.toDate()` converts to JS Date
- In Console: Shows as milliseconds

### String Fields (Enums)

**Medical Record Severity:**
```
"Low" | "Medium" | "High" | "Critical"
```

**SOS Record Priority:**
```
"Low" | "Medium" | "High" | "Critical"
```

**SOS Record Status:**
```
"Pending" | "Responded" | "Resolved"
```

---

## Functions Already Available (services/firestore.ts)

### Medical Records CRUD
```typescript
createMedicalRecord(data)        // Create new record
getMedicalRecordsByUser(uid)     // Get user's records
onMedicalRecordsChanged(uid, cb) // Listen for real-time updates
updateMedicalRecord(id, data)    // Update record
deleteMedicalRecord(id)          // Delete record
```

### SOS Records CRUD
```typescript
createSOSRecord(data)            // Create new alert
getSOSRecordsByUser(uid)         // Get user's alerts
onSOSRecordsChanged(uid, cb)     // Listen for real-time updates
updateSOSRecord(id, data)        // Update alert status
deleteSOSRecord(id)              // Delete alert
```

---

## Firestore Usage Examples

### Creating a Medical Record
```typescript
await createMedicalRecord({
  uid: user.uid,
  userEmail: user.email,
  title: "Annual Checkup",
  description: "Routine checkup with no issues",
  medicalCase: "General Health",
  severity: "Low"
})
```

### Creating an SOS Alert
```typescript
await createSOSRecord({
  uid: user.uid,
  userEmail: user.email,
  message: "Emergency - need assistance",
  priority: "Critical",
  status: "Pending"
})
```

### Updating SOS Status (by Admin)
```typescript
await updateSOSRecord(recordId, {
  status: "Responded",
  respondedBy: "admin@example.com"
})
```

### Listening for Real-time Updates
```typescript
const unsubscribe = onMedicalRecordsChanged(userId, (records) => {
  console.log("Records updated:", records);
  setRecords(records);
});

// Cleanup when component unmounts
return () => unsubscribe?.();
```

---

## Important Notes

1. **UID Requirement:** All medical and SOS records MUST include the user's UID for security
2. **Timestamps:** Always use Firestore serverTimestamp() for createdAt/updatedAt
3. **Admin Access:** Admin users need custom claim `{"admin": true}` set in Firebase Console
4. **Real-time Listeners:** Each user connection creates a real-time listener - be aware of Firestore costs
5. **Data Validation:** Frontend validates data, but Firestore rules enforce security
6. **Indexing:** Firestore automatically creates indexes on first query, but explicit indexes improve performance

---

## Troubleshooting Firestore Issues

| Issue | Solution |
|-------|----------|
| "Permission denied" errors | Check security rules and user authentication |
| Records not appearing | Verify UID matches `request.auth.uid` in rules |
| Slow queries | Create composite indexes on uid + timestamp fields |
| Real-time updates not working | Check network connection and Firestore status |
| Admin features not working | Verify custom claim `{"admin": true}` is set |

---

## Cost Optimization Tips

1. **Use indexes wisely** - Don't over-index
2. **Limit real-time listeners** - Only listen on current user's data
3. **Paginate results** - Don't fetch all records at once
4. **Clean old data** - Archive or delete resolved SOS records after period
5. **Batch operations** - Use batch writes for multiple documents

---

**Last Updated:** November 27, 2025
**Status:** Production Ready
**Firebase SDK:** compat (v9)
