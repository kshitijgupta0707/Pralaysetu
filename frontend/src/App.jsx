
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import ResponderDashboard from "./pages/ResponderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import { Toaster } from "react-hot-toast";
import { Home , Loader } from "lucide-react";
import {Navigate} from "react-router-dom";

import { useAuthStore } from "./store/useAuthstore";
import { useEffect } from "react";
function App() {
  const { authUser , checkAuth , isCheckingAuth } = useAuthStore();
  const isAdmin = authUser?.role === "admin";
  const isResponder = authUser?.role === "responder";
  const isUser = authUser?.role === "user";
  const isAuthenticated = authUser !== null;

  useEffect(() => {
    console.log("Checking authentication status...");
    checkAuth()
  }
,[checkAuth])

if (isCheckingAuth && !authUser)
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  );
   


  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!authUser ? <LoginPage />: <Navigate to="/"/>}  />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/"/>} />
        <Route path="/otp-verification" element={<OtpVerificationPage />} />
        <Route path="/responder-dashboard" element={<ResponderDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard/>}/>
        
      </Routes>     
      <Toaster/>
    </div>
  );
}

export default App;
