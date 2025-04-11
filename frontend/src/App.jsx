import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import ResponderDashboard from "./pages/ResponderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import ResponderMap from "./pages/ResponderMap"
import { useAuthStore } from "./store/useAuthstore";
import { useEffect, useState } from "react";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const [actingAs, setActingAs] = useState(localStorage.getItem("loggedInAs"));
  const location = useLocation(); // detects route changes

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Sync `loggedInAs` whenever route changes
  useEffect(() => {
    const storedRole = localStorage.getItem("loggedInAs");
    setActingAs(storedRole);
    console.log("Updated actingAs:", storedRole);
  }, [location.pathname]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
           path="/login" 
           element={
             !actingAs ?
                  <LoginPage />
                  :
                  <Navigate to="/" />
                  
                  } />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route path="/otp-verification" element={<OtpVerificationPage />} />
        <Route
          path="/responder-dashboard"
          element={
            authUser &&
            authUser?.registerAs === "None" &&
            actingAs === "Responder" ? (
              <ResponderDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            authUser?.registerAs === "Admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/user-dashboard"
          element={
            authUser &&
            authUser.registerAs === "None" &&
            actingAs === "User" ? (
              <UserDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

       <Route 
  path="/responder/map" 
  element={
    <ResponderMap 
      destinationCoords={location.state || { latitude: 0, longitude: 0 }} 
    />
  } 
/>       
   

      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
