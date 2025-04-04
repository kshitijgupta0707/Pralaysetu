import { useState } from "react";
import axios from "axios";
const OtpVerification = () => {
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState(localStorage.getItem("email"));
  
    const handleVerifyOtp = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
        alert(res.data.message);
        window.location.href = "/dashboard";
      } catch (error) {
        alert(error.response?.data?.message || "OTP Verification failed");
      }
    };
  
    return (
      <div>
        <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
        <button onClick={handleVerifyOtp}>Verify OTP</button>
      </div>
    );
  };
  
  export default OtpVerification;
  