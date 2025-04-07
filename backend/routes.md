# PralaySetu API Documentation

## 🔐 Authorization & Authentication

### 1. Send OTP to Email
- **Route**: `/api/auth/sendOtp`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "dummy@example.com"
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
  "lastName": "Singh",
  "password": "123456",
  "confirmPassword": "123456",
  "role": "Responder",
  "location": "New Delhi, India"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "User created successfully",
  "user": { }
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
- **Response**: JWT token is received as cookie.

### 4. Forgot Password
- **Route**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "john@example.com"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Reset password link sent to email"
}
```

### 5. Reset Password
- **Route**: `/api/auth/reset-password`
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


## 📢 Reports

### 1.  Create Report (By any User)
- **Route**: `/api/reports/createReport`
- **Method**: `POST`
- **Body**:
```json
{
  "disasterType": "fire",
    "location" : {
        "latitude": 43,
        "longitude": 1,
        "address": "Tamil Naidu"
    },
    "description" : "everywher fllod",
    "media": "" //image file // optional

}
```
- **Response**: Report object with success message.
```json
{
  "success": true,
    "message": "Disaster report submitted",
    "report": {}
  }
```


### 2. Get All Reports (Admin)
- **Route**: `/api/reports/getAllReports`
- **Method**: `GET`
- **Response**: Array of Report object with success message

### 3. Get All Verified Reports (All Users)
- **Route**: `/api/reports/getVerifiedReports`
- **Method**: `GET`
- **Response**: Array of Report object with success message

### 4. Verify a Report (Admin)
- **Route**: `/api/reports/verifyReport`
- **Method**: `PUT`
- **Body**:
```json
{
  "reportId": "67f0eaed6c711a3547ab9f25",
  "status": "verified"
}
```
- **Response**: Updated report object with success message.

---

## 🆘 Help Requests

### 1. Create Help Request (User)
- **Route**: `/api/help/request`
- **Method**: `POST`
- **Body**:
```json
{
  "location": {
    "lat": 28.6139,
    "lng": 77.2090
  },
  "reason": "",
  "urgency": "critical"
}
```
- **Response**: Created help request object.

### 2.  Show All Pending Requests (Admin)
- **Route**: `/api/help/pending`
- **Method**: `GET`

### 3. Verify Request (Admin)
- **Route**: `/api/help/verify/:id`
- **Method**: `PUT`
- **Body**:
```json
{
  "status": "rejected"
}
```
- **Response**: Updated help request object.

### 4.  Assigning Verified Request to Responder (admin)
- **Route**: `/api/help/assign/:id`
- **Method**: `PUT`
- **Body**:
```json
{
  "responderId": "67f0f23a4bf4b22548b68c88"
}
```
- **Response**: Assigned help request.

### 5. Get All Verified Requests (admin)
- **Route**: `/api/help/verified`
- **Method**: `GET`

### 6. Get All Rejected Requests (admin)
- **Route**: `/api/help/rejected`
- **Method**: `GET`

### 7. Accept Request (Responder) 
- **Route**: `/api/help/accept/:id`
- **Method**: `PUT`
- **Response**: Help request marked as accepted.

### 8. Complete Request (Responder)
- **Route**: `/api/help/complete/:id`
- **Method**: `PUT`
- **Response**: Help request marked as completed.

### 9. Get assigned requests for responder (Responder)
- **Route**: `/api/help/assigned`
- **Method**: `PUT`
- **Response**: Help request marked as completed.

---

  ## 📊 Dashboards
  
  ### User Dashboard
  - **Route**: `/api/dashboard/user`
  - **Method**: `GET`
  
  ### Admin Dashboard
  - **Route**: `/api/dashboard/admin`
  - **Method**: `GET`
  
  ### Government Dashboard
  - **Route**: `/api/dashboard/government`
  - **Method**: `GET`
  
  ---
