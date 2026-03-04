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

### 4. Start Frontend (in new terminal)
```bash
cd frontend && npm run dev
```

### 5. Open in Browser
Visit **http://localhost:5173**

## Features

- User registration with fitness metrics (age, height, weight, goal weight)
- Browse plans: Gym, Yoga, Diet, Combo, Complete Transformation
- Flexible durations: Monthly, Quarterly, Half Yearly, Yearly
- Optional personal trainer add-on
- User dashboard with BMI, progress, subscription info
- Profile management with fitness tracking
- Contact form with WhatsApp integration
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
| GET | /api/users/profile | Get profile |
| PUT | /api/users/profile | Update profile |
| PUT | /api/users/change-password | Change password |
| GET | /api/users/stats | Get dashboard stats |
| POST | /api/contact | Submit contact form |
