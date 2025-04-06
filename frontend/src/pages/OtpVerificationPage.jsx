import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const OtpVerificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120); // 2 minutes countdown
  const [resendDisabled, setResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email || '';

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input field
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Focus on first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  // Format timer to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle OTP verification
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all digits of the OTP');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to verify OTP
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, let's consider OTP "123456" as valid
      if (otpValue === '123456') {
        setIsVerified(true);
        
        // Redirect to dashboard after successful verification
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    }, 1500);
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    setResendDisabled(true);
    setTimer(120); // Reset timer to 2 minutes
    
    // Simulate resending OTP
    setTimeout(() => {
      // Here you would make your actual API call to resend OTP
      console.log('Resending OTP to:', userEmail);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100/50 p-6">
      <div className="max-w-md w-full">
        {/* Mobile Logo - Only visible on small screens */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 2c1 0 3 2 3 4v1a3 3 0 1 1-6 0V6c0-2 2-4 3-4Z" />
              <path d="M10 5c1 0 3 2 3 4v1a3 3 0 1 1-6 0V9c0-2 2-4 3-4Z" />
              <path d="M4 8c1 0 3 2 3 4v1a3 3 0 1 1-6 0v-1c0-2 2-4 3-4Z" />
              <path d="M22 19c0-3-2.5-5-5-5-2 0-3.5 1.5-4 2-1.5-2-3-2-4-2-2.5 0-5 2-5 5 0 3 3 6 9 6 6 0 9-3 9-6Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-blue-800">PralaySetu</h1>
          <p className="text-gray-600">Bridging Crisis to Safety</p>
        </div>

        {/* OTP Verification Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleVerifyOtp}>
            <CardHeader>
              <div className="flex items-center mb-4">
                <Link to="/signup" className="mr-4 text-gray-500 hover:text-blue-600 transition">
                  <ArrowLeft size={20} />
                </Link>
                <div>
                  <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
                  <CardDescription>
                    Enter the 6-digit code sent to {userEmail || 'your email'}
                  </CardDescription>
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {isVerified && (
                <Alert className="mt-4 bg-green-50 border-green-200 text-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>Email verified successfully! Redirecting...</AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="w-12 h-12 text-center text-xl font-semibold border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading || isVerified}
                    />
                  ))}
                </div>
                
                <div className="text-center text-sm text-gray-600">
                  <p>Didn't receive the code?</p>
                  <div className="mt-2">
                    {resendDisabled ? (
                      <p>Resend code in <span className="font-medium text-blue-600">{formatTime(timer)}</span></p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        disabled={isLoading || isVerified}
                      >
                        Resend code
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6" 
                disabled={isLoading || isVerified}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : isVerified ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Verified
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>
              <div className="text-center text-sm text-gray-600">
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Back to Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 PralaySetu. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;