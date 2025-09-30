# Kader Project

<p align="center">
   <img src="./images/logo.png" alt="Kader Logo" width="280" />
</p>

A React + TypeScript single-page app (Vite) using Firebase for authentication, data storage and file storage.

This repository is a working prototype for an online store + support/community dashboard for the Kader wheelchair project.

## Table of contents

- Overview
- Tech stack
- Quick start (local)
- Firebase setup (detailed)
- Admin configuration
- Developer notes
- File layout
- TODOs & next steps
- Troubleshooting


## Overview

Key features:
- User authentication (Firebase Auth)
- Product store with cart and order creation
- Cart persistence (localStorage + Firestore)
- Community messages and contact form
- Support tickets with admin status updates
- Admin dashboard for managing products, tickets, orders, and messages


## Tech stack
- Frontend: React + TypeScript + Vite
- Styling: Tailwind (via CDN)
- Backend: Firebase (Auth, Firestore, Storage) using the compat SDK


## Quick start (local)

1. Install dependencies

```bash
npm install
```

2. Configure Firebase
- Open `firebase.ts` and replace the firebaseConfig entries with your project's values (or set up an env-based loader if you prefer).
- Ensure `storageBucket` is set correctly in the config.

3. Start the dev server

```bash
npm run dev
```

Open the site at the address Vite prints (default: http://localhost:5173)


## Firebase setup (detailed)

The app expects the following Firestore collections and storage usage:

- `products` — product docs (title, description, price, image (URL), stock, createdAt)
- `tickets` — support tickets (userEmail, subject, message, status, createdAt, updatedAt)
- `messages` — community posts (userEmail, text, createdAt)
- `contact_messages` — contact form submissions (userEmail, text, createdAt)
- `orders` — orders (userEmail, items, total, status, createdAt)
- `users` — optional admin flag for per-user admin control (e.g., `{ admin: true }`)
- `carts` — per-user cart docs stored at `carts/{uid}`
- `admin_pass` — single-document collection used by the client to quick-unlock the admin UI (field: `password`) — dev convenience only

Storage:
- Default storage bucket (from firebase config) is used to store product images. The helper `services/storage.ts` contains `uploadFile(path, file, onProgress)` to upload and retrieve a download URL.


## Admin configuration

Two admin approaches are supported in the app:

1) Quick password unlock (development convenience)
- The client reads the first document from `admin_pass` collection and compares the provided password to unlock admin controls. To set this:
   - In Firebase Console → Firestore → Add collection `admin_pass` → add a document with field `password` (string).

2) Per-user admin flag (recommended for local testing)
- The repo includes `setUserAdmin(uid, true)` helper which writes `{ admin: true }` to `users/{uid}`. The Admin UI has a "Make me admin" button which calls this helper for the signed-in user.

Recommended production approach: use Firebase Admin SDK to set custom claims (e.g., `admin: true`) and enforce admin-only operations in Firestore security rules by checking `request.auth.token.admin == true`.


## Developer notes

- The app currently uses the Firebase compat SDK; migrating to the modular SDK is possible but requires refactoring `services/*` helpers.
- `components/Toast.tsx` provides a lightweight toast system. The app root is wrapped with `ToastProvider` so use `useToast()` anywhere.
- Cart syncing is implemented with localStorage and Firestore persistence when the user is signed in.
- Image handling: store product image URLs in the product document's `image` field. The `ProductCard` uses `object-contain` so full images are visible; swap to `object-cover` if you prefer cropped thumbnails.


## File layout

- `App.tsx` — main router and provider wiring
- `firebase.ts` — Firebase initialization (auth, firestore, storage)
- `services/firestore.ts` — Firestore helpers
- `services/storage.ts` — Storage upload helper
- `auth/AuthContext.tsx` — auth provider and hook
- `components/` — UI components (AdminPage, StorePage, CartPage, etc.)
- `images/` — assets (logo, favicon, slider images)


## TODOs & next steps

- Wire product image upload in the Admin form (uses `services/storage.uploadFile`)
- Replace Flame-in-Firestore admin password with custom claims or a server-side flow
- Add confirmation modals for deletes
- Harden Firestore rules to restrict admin operations


## Troubleshooting

- Admin unlock says "No admin password set": create a doc in `admin_pass` collection with field `password` in Firestore Console.
- If client writes are rejected: check Firestore security rules, or use Console/Admin SDK to seed data.
- Favicon didn't update: clear cache or open in incognito/private window.
