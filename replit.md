# Kader Project - Replit Setup

## Overview
A React + TypeScript smart wheelchair dashboard application using Vite and Firebase for authentication, data storage, and file storage. This is a working prototype for an online store + support/community dashboard for the Kader wheelchair project.

## Current State
- **Last Updated:** October 17, 2025
- **Status:** Configured for Replit environment
- **Framework:** React 19.1.1 + TypeScript + Vite 6.2.0
- **Backend:** Firebase (Auth, Firestore, Storage)

## Key Features
- User authentication (Firebase Auth)
- Product store with cart and order creation
- Cart persistence (localStorage + Firestore)
- Community messages and contact form
- Support tickets with admin status updates
- Admin dashboard for managing products, tickets, orders, and messages

## Project Architecture

### Tech Stack
- **Frontend:** React 19.1.1, TypeScript 5.8.2, Vite 6.2.0
- **Styling:** Tailwind CSS (via CDN)
- **Backend:** Firebase compat SDK
  - Authentication
  - Firestore database
  - Cloud Storage

### Directory Structure
- `components/` - React UI components (pages, modals, controls)
- `components/icons/` - SVG icon components
- `auth/` - Authentication context and providers
- `services/` - Firebase service helpers (firestore, storage)
- `hooks/` - Custom React hooks (simulation)
- `images/` - Static assets (logo, favicon, hospital floor, product images)
- `firebase.ts` - Firebase initialization and config
- `App.tsx` - Main router and provider setup
- `types.ts` - TypeScript type definitions
- `constants.ts` - App constants

### Firebase Collections
- `products` - Product catalog (title, description, price, image, stock)
- `tickets` - Support tickets with status tracking
- `messages` - Community posts
- `contact_messages` - Contact form submissions
- `orders` - User orders with items and status
- `users` - User data with optional admin flag
- `carts` - Per-user cart persistence (carts/{uid})
- `admin_pass` - Admin password for quick unlock (dev only)

## Replit Configuration

### Development Server
- **Port:** 5000 (required for Replit)
- **Host:** 0.0.0.0 (configured)
- **HMR:** Configured for Replit proxy (clientPort: 443)
- **Command:** `npm run dev`

### Workflow
- **Name:** Server
- **Type:** webview (displays frontend)
- **Auto-restart:** Yes (after package changes)

## Recent Changes
- **October 17, 2025:** 
  - Configured Vite server to use port 5000 for Replit
  - Added HMR configuration for Replit proxy support
  - Created workflow for frontend development
  - Updated .gitignore to exclude Replit config files

## Firebase Setup Notes
The application is already configured with a Firebase project:
- **Project ID:** kader-91ca2
- **Auth Domain:** kader-91ca2.firebaseapp.com
- **Storage Bucket:** kader-91ca2.firebasestorage.app

To fully use the app, you'll need to:
1. Ensure the Firebase project has Auth, Firestore, and Storage enabled
2. Create the required Firestore collections (see Firebase Collections above)
3. Set up admin access via `admin_pass` collection or user admin flag

## Developer Notes
- Uses Firebase compat SDK (not modular)
- Cart syncs with localStorage and Firestore when user is signed in
- Toast notifications available via `useToast()` hook
- Admin access via password unlock or per-user admin flag
- Product images stored in Firebase Storage

## TODOs & Next Steps
- Wire product image upload in Admin form
- Replace in-Firestore admin password with custom claims
- Add confirmation modals for delete operations
- Harden Firestore security rules for admin operations
- Consider migrating to modular Firebase SDK

## User Preferences
(None set yet)
