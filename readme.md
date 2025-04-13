# 🌪️ PralaySetu – Bridging Crisis to Safety

## 🌐 Project Purpose

PralaySetu is a comprehensive disaster management platform designed to operate in **three critical phases**: **Prior**, **During**, and **After** disasters. It provides timely alerts, enables users to request emergency assistance, facilitates response efforts, and supports relief operations using real-time communication and AI-driven predictions.

---

## 👥 User Roles and Responsibilities

### 1. Normal User / Responder

> A single user account can choose to act as a **Normal User** or a **Responder** during login.

#### As Normal User:
- **Report Incidents**
  - Submit details about a disaster (e.g., fire, flood).
  - Sent to **admin** for verification.
  - Once verified, it's shown to all users on the platform.
  
- **Request Emergency Help**
  - Request help with location and description.
  - Admin verifies request → assigned to a **Responder**.
  - Shared location & map route shown to both user and responder.

- **Access Nearby Emergency Services**
  - View nearby **hospitals**, **police stations**, etc. on map.

- **Receive Alerts**
  - From **government**, **NGOs**, and **admin**.

- **View ML-Based Disaster Predictions**
  - Early warnings for disasters like earthquakes, floods, etc.

#### As Responder:
- **Receive Help Requests**
  - Verified and assigned by admin in real-time.
  
- **Accept or Reject Requests**

- **Navigation and Help**
  - View user location & get route via map.
  - **Mark request as completed** once help is provided.

---

### 2. Admin (Superuser)

- **Verify Incident Reports** from normal users.
- **Verify Emergency Help Requests** and assign **Responders**.
- **Issue Daily Alerts** based on ML model predictions.
- **Manage Users and Roles** (CRUD operations).
- **Propagate Verified Reports** to all users.
- **Access Dashboard** for analytics and control.

---

### 3. Government Authority

- **Send Mass Alerts** to all users.
- **View ML Prediction Maps** (e.g., disaster-prone areas).
- **Access Dashboard** with global system activity.

---

### 4. NGO

- **Raise Disaster Relief Funds**
  - Post donation causes with target amount.
  - Integration with UPI/Payment gateway.

- **Send Help Alerts**
  - E.g., food/water distribution locations.

- **Track Requests Needing Support**

---

## 🧠 AI/ML Integration

### Disaster Lifecycle Coverage

| Phase       | Functionality                                              |
|-------------|------------------------------------------------------------|
| **Prior**   | ML model predicts possible disasters. Alerts users early.  |
| **During**  | Real-time help request system. Live incident reporting.    |
| **After**   | Relief fundraisers by NGOs. Impact reports and aid tracking. |

---

## 🧩 Key Features

- ✅ **Role-Based Access Control** (User, Responder, Admin, Government, NGO)
- 🌐 **Real-Time Communication** using Socket.IO
- 📍 **Map Integration** (Google Maps or Mapbox)
- 🧠 **Disaster Prediction** using ML models
- 📢 **Alert System** from Admin, Government, NGOs
- 🌎 **Multi-language Support**
- 📩 **Email OTP Verification** during registration
- 💳 **NGO Fundraising & Payments** (optional)
- 📊 **Dashboards** for each role with stats and activity

---

## 🛠️ Tech Stack

| Layer         | Technology |
|---------------|------------|
| Frontend      | React (Vite), Redux, Tailwind CSS |
| Backend       | Node.js, Express.js, MongoDB |
| ML Backend    | Flask (Python) |
| Real-Time     | Socket.IO |
| Maps          | Google Maps API / Mapbox |
| ML Model      | Random Forest / Other disaster prediction models |
| Deployment    | Docker, Docker-Compose |
| Email OTP     | Nodemailer / External API |
| Payment       | Razorpay / Stripe (for NGO fundraising) |

---

## 📂 Project Modules

