import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OtpVerificationPage from "./pages/auth/OtpVerificationPage";
import ResponderDashboard from "./pages/dashboards/ResponderDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import UserDashboard from "./pages/dashboards/UserDashboard";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import ResponderMap from "./pages/map/ResponderMap"
import { useAuthStore } from "./store/useAuthstore";
import { useEffect, useState } from "react";
import NotificationBanner from "./pages/notifications/NotificationBanner";
// import Notification from "./Notification";
import NotificationSetup from "./pages/notifications/NotificationSetup";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { useNotificationStore } from "./store/useNotificationStore";
import { PralaySetuLoader } from "./components/PralaysetuLoader";
import Success from "./pages/payment/Success";
import Cancel from "./pages/payment/Cancel";
// import DonationPage from "./pages/Donation";
// import NGODashboard from "./pages/Ngo";
import { NGODashboard } from "./pages/dashboards/NGODashboard";
// import { Header } from "@radix-ui/react-accordion";
import Header from "./components/Header";

function App() {

  const { socket, authUser, checkAuth, isCheckingAuth, actingAs, setActingAs } = useAuthStore();

  useEffect(() => {
    if (!socket) return;
    //  Assigned help request (for responder)
    socket.on("assignedHelpRequest", (payload) => {
      const { title, message, purpose, request } = payload;
      console.log("Real time Assigned to responder:", request);
      useNotificationStore.getState().showNotification(title, message, purpose);
    });

    //  Request status changed (for user)
    socket.on("helpRequestStatusChanged", (payload) => {

      const { title, message, purpose, request } = payload;
      console.log("Request status update:", request);
      useNotificationStore.getState().showNotification(title, message, purpose);
    });

    //  Request status changed (for user)
    socket.on("reportStatusUpdate", (payload) => {
      const { title, message, purpose, report } = payload;
      console.log("(real time)Report status update:", report);
      useNotificationStore.getState().showNotification(title, message, purpose);
    });
    //  Request status changed (for user)
    socket.on("moneyRecieved", (payload) => {
      const { title, message, purpose } = payload;
      console.log("money recieved");
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


  const [language, setLanguage] = useState('en');






  useEffect(() => {
    setActingAs(localStorage.getItem("loggedInAs"))
  }, [])
  const location = useLocation(); // detects route changes

  // useEffect(() => {
  //   console.log("from app.jsx")
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
    let storedRole = localStorage.getItem("loggedInAs");
    if (storedRole == null) {
      storedRole = "User"
    }
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
      <NotificationSetup />

      <Header language={language} setLanguage={setLanguage} />

      <Routes>
        <Route path="/" element={<HomePage language={language} />} />
        <Route
          path="/login"
          element={
            !actingAs || authUser?.workAsResponder || (!authUser) ?
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
        {/* <Route path="/donate" element={<DonationPage />} /> */}
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        {/* <Route path="/ngo" element={<NGODashboard />} /> */}
        <Route
          path="/ngo-dashboard"
          element={
            authUser?.registerAs === "NGO" ? (
              <NGODashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />



      </Routes>


      <Toaster />


    </div>
  );
}

export default App
