
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import ResponderDashboard from "./pages/ResponderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import { Home } from "lucide-react";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/otp-verification" element={<OtpVerificationPage />} />
      <Route path="/responder-dashboard" element={<ResponderDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/user-dashboard" element={<UserDashboard/>}/>
    </Routes>     
  );
}

export default App;
