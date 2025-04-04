import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OtpVerification from "./pages/OtpVerification";
import Dashboard from "./pages/Dashboard"; // Placeholder for now
import Signup from "./pages/Signup"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
