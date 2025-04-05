# PralaySetu API Routes Documentation

This document contains all available routes in the PralaySetu project, categorized by user roles and their functionalities.

---

## 🌐 Public Routes

### 1. User Registration
- **Route**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourPassword",
  "role": "user"
}
```
- **Response**: Success message and user data

### 2. User Login
- **Route**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "yourPassword"
}
```
- **Response**: JWT token and user info

---

## 👤 User Functionality

### 1. Create Help Request
- **Route**: `/api/help/request`
- **Method**: `POST`
- **Body**:
```json
{
  "disasterType": "flood",
  "location": {
    "latitude": 28.7041,
    "longitude": 77.1025,
    "address": "Some Location"
  },
  "description": "Trapped in house, need help"
}
```
- **Response**: Help request created

### 2. View Verified Help Requests
- **Route**: `/api/help/verified`
- **Method**: `GET`
- **Response**: List of all verified help requests

---

## 🧑‍💼 Admin Functionality

### 1. View All Help Requests
- **Route**: `/api/help/all`
- **Method**: `GET`
- **Response**: All help requests

### 2. Verify or Reject Help Request
- **Route**: `/api/help/verify/:id`
- **Method**: `PUT`
- **Body**:
```json
{
  "status": "verified" // or "rejected"
}
```
- **Response**: Updated help request

### 3. View All Incident Reports
- **Route**: `/api/report/all`
- **Method**: `GET`

---

## 🧑‍🚒 Government / Responder Functionality

### 1. View Assigned Requests
- **Route**: `/api/help/assigned`
- **Method**: `GET`
- **Response**: All help requests assigned to this responder

### 2. Accept / Reject / Complete Request
- **Route**: `/api/help/update-status/:id`
- **Method**: `PUT`
- **Body**:
```json
{
  "status": "accepted" // or "rejected" or "completed"
}
```
- **Response**: Status updated

---

## 🏥 NGO Functionality (if applicable)

- Future implementation for donation & help tracking.

---

Let me know if you want Swagger/OpenAPI documentation, Postman collection, or frontend integration guidance.