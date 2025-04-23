import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import ResponderDashboard from "./pages/ResponderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import ResponderMap from "./pages/ResponderMap"
import { useAuthStore } from "./store/useAuthstore";
import { useEffect, useState } from "react";
import NotificationBanner from "./pages/NotificationBanner";
import { messaging, onMessage } from "./firebase";
// import Notification from "./Notification";
import NotificationSetup from "./pages/NotificationSetup";
import { ResetPassword } from "./pages/ResetPassword";
import { useNotificationStore } from "./store/useNotificationStore";
import { PralaySetuLoader } from "./pages/PralaysetuLoader";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import DonationPage from "./pages/Donation";
function App() {
  // In your App.jsx or main.jsx




  const { socket, authUser, checkAuth, isCheckingAuth, actingAs, setActingAs } = useAuthStore();

  useEffect(() => {
    if (!socket) return;
    console.log("socket = ", socket)
    //  Assigned help request (for responder)
    socket.on("assignedHelpRequest", (payload) => {
      const { title, message, purpose, request } = payload;
      console.log("Real time Assigned to responder:", request);
      useNotificationStore.getState().showNotification(title, message, purpose);
    });

    // 🆕 Request status changed (for user)
    socket.on("helpRequestStatusChanged", (payload) => {

      const { title, message, purpose, request } = payload;
      console.log("Request status update:", request);
      useNotificationStore.getState().showNotification(title, message, purpose);
    });

    // 🆕 Request status changed (for user)
    socket.on("reportStatusUpdate", (payload) => {
      const { title, message, purpose, report } = payload;
      console.log("(real time)Report status update:", report);
      useNotificationStore.getState().showNotification(title, message, purpose);
    });


    return () => {
      socket.off("assignedHelpRequest");
      socket.off("helpRequestStatusChanged");
      socket.off("newHelpRequest");
      socket.off("newDisasterReport");
      socket.off("reportStatusUpdate")
    };
  }, [socket]);









  useEffect(() => {
    setActingAs(localStorage.getItem("loggedInAs"))
  }, [])
  const location = useLocation(); // detects route changes

  // useEffect(() => {
  //   onMessage(messaging, (payload) => {
  //     console.log("Foreground Notification:", payload);
  //     alert(payload.notification.title + ": " + payload.notification.body);
  //   });
  // }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Sync `loggedInAs` whenever route changes
  useEffect(() => {
    const storedRole = localStorage.getItem("loggedInAs");
    setActingAs(storedRole);
    // console.log("Updated actingAs:", storedRole);
  }, [location.pathname]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* <Loader className="size-10 animate-spin" /> */}
        <PralaySetuLoader />
      </div>
    );
  }

  return (
    <div>
      <NotificationBanner />
      {/* <Notification /> */}
      <NotificationSetup />

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
          path="/forgot-password"
          element={
            !authUser ?
              <ForgotPassword />
              :
              <Navigate to="/" />

          } />
        <Route
          path="/reset-password"
          element={
            !authUser ?
              <ResetPassword />
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
        <Route path="/donate" element={<DonationPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />



      </Routes>


      <Toaster />
    </div>
  );
}

export default App
