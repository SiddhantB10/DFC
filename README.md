# DFC: Health & Harmony 🏋️‍♂️🧘‍♀️🥗

A personalized fitness and wellness platform where users get customized gym workouts, yoga sessions, and diet plans with dedicated WhatsApp coaching support.

## Tech Stack

- **Frontend:** React 18, Vite, TailwindCSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt

## Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### 1. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Seed Database (Plans)
```bash
cd backend && npm run seed
```

### 3. Start Backend Server
```bash
cd backend && npm run dev
```

### 3.1 Create Admin User (one time)
```bash
cd backend && npm run seed:admin
```

Use `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `backend/.env`.

### 4. Start Frontend (in new terminal)
```bash
cd frontend && npm run dev
```

### 5. Open in Browser
Visit **http://localhost:5173**

## Vercel Deployment

This repo is configured for a **single Vercel project**:
- React frontend is built from `frontend/`
- Express backend runs as a Vercel serverless function from `backend/api/index.js`
- Frontend calls backend through `/api`

### 1. Prepare environment variables

Use these example files:
- `backend/.env.example`
- `frontend/.env.example`

In Vercel Project Settings -> Environment Variables, add:
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `FRONTEND_URL` (for example: `https://your-project.vercel.app`)
- `ALLOW_VERCEL_PREVIEW` (`true` recommended)
- `VITE_RAZORPAY_KEY_ID`
- `VITE_API_BASE_URL` (set to `/api`)

### 2. MongoDB Atlas requirements

- Use an Atlas connection string in `MONGO_URI`
- Ensure database user credentials are correct
- In Atlas Network Access, allow Vercel access (for quick setup: `0.0.0.0/0`, then tighten later)

### 3. Deploy

From repo root:

```bash
vercel
```

For production:

```bash
vercel --prod
```

### 4. Verify after deploy

- Frontend loads at your Vercel domain
- API health check responds at `/api/health`
- Login/register and plans pages load without CORS or API errors

## Features

- User registration with fitness metrics (age, height, weight, goal weight)
- Browse plans: Gym, Yoga, Diet, Combo, Complete Transformation
- Flexible durations: Monthly, Quarterly, Half Yearly, Yearly
- Optional personal trainer add-on
- User dashboard with BMI, progress, subscription info
- Profile management with fitness tracking
- Contact form with WhatsApp integration
- Cart module for pre-checkout plan selection
- Wishlist module for saving plans
- Admin dashboard with orders, support inbox, and sales report
- Inventory slots for plans and trainer availability tracking
- Recommended plans based on user fitness profile
- Liquid glass UI with 3D animations
- Fully responsive design

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/plans | Get all plans |
| GET | /api/plans/:slug | Get plan details |
| POST | /api/orders | Create order |
| GET | /api/orders | Get user orders |
| GET | /api/orders/active | Get active subscription |
| GET | /api/cart | Get current user cart |
| POST | /api/cart | Add plan to cart |
| DELETE | /api/cart/:itemId | Remove cart item |
| DELETE | /api/cart | Clear cart |
| GET | /api/wishlist | Get wishlist plans |
| POST | /api/wishlist | Add plan to wishlist |
| DELETE | /api/wishlist/:planId | Remove from wishlist |
| GET | /api/plans/recommended/me | Get recommended plans |
| GET | /api/users/profile | Get profile |
| PUT | /api/users/profile | Update profile |
| PUT | /api/users/change-password | Change password |
| GET | /api/users/stats | Get dashboard stats |
| POST | /api/contact | Submit contact form |
| GET | /api/admin/dashboard | Admin summary dashboard |
| GET | /api/admin/orders | Admin order list |
| GET | /api/admin/reports/sales | Admin sales report |
| GET | /api/admin/contacts | Admin contact inbox |
| PUT | /api/admin/contacts/:id/status | Update contact status |
