# Mobile SIM Recharge Portal

A full-stack MERN application for managing mobile SIM recharges with Role-Based Access Control (Admin, Company, User).

## Features
- **Admin**: System-wide control, analytics, user/company management.
- **Company**: Manage recharge plans, view sales history.
- **User**: Search plans, verify profile (OTP), secure dummy checkout.
- **Security**: JWT Auth, Google OAuth 2.0, OTP Verification.

## Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or Atlas)

## Setup Instructions

### 1. Backend
```bash
cd backend
npm install
# Update .env with your credentials
node seed.js # To populate initial data
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Dummy Test Data

### Admin Login
- **Email**: `admin@portal.com`
- **Password**: `admin123`

### Company Login
- **Email**: `manager@airtel.com`
- **Password**: `password123`

### Payment Gateway
- **Success Card**: `4111111111111111`
- **Failure Card**: `4000000000000000`
- **OTP**: Mocked in console (Backend) and emailed (if configured). 
  - *Note: For testing payment without email, check backend logs or use the prompt in frontend if mocked.*
