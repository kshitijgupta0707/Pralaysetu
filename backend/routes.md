# PralaySetu API Routes Documentation

This document contains all available routes in the PralaySetu project, categorized by user roles and their functionalities.

---

## 🌐 Public Routes
### 1. User will recieve otp on email
- **Route**: `/api/auth/sendOtp`
- **Method**: `POST`
- **Body**:
```json
{

  "email": "dummy@example.com",

}
```
- **Response**: 
```json
{
    "success": true,
    "message": "Otp sent successfully",
    "otp": "392399"
}
```

### 2. User Registration
- **Route**: `/api/auth/signup`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "r1@gmail.com",
  "otp": "392399",
  "firstName": "John",
  "lastName" : "Singh",
  "password": "123456",
  "role": "Responder",
  "location": "New Delhi, India"
}

```
- **Response**: 
```json
{
    "success": true,
    "message": "User created successfully",
    "user": { 

    }
}
```

### 3. User Login
- **Route**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "yourPassword"
}
```
- **Response**: Recieved JWT token as cookie

---
### 3. User Login
- **Route**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "yourPassword"
}
```
- **Response**: Recieved JWT token as cookie

---
### 4. forgot password
- **Route**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "john@example.com",
}
```
- **Response**: 
```json
{
    "success": true,
    "message": "Reset password link sent to email"
}
```

---
### 5. Reset password
- **Route**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
    "token": "",
    "email": "",
    "newPassword": ""
}
```
- **Response**: 
```json
{ 
    "success": true,
    "message": "Password reset successful" 
 }
```

---


## 👤 User Functionality

### 1. Create Help Request
- **Route**: `/api/help/request`
- **Method**: `POST`
- **Body**:
```json
{
  "disasterType": "",
  "location": {
    
  },
  "description": ""
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