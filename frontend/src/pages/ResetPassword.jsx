import React, { useState, useEffect } from 'react';
import { Loader2, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthstore';
import toast from 'react-hot-toast';

export const ResetPassword = () => {
  const [resetData, setResetData] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { resetPassword, isResettingPassword } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(location)

  useEffect(() => {
    // Extract token and email from URL parameters
    //this fetch the all the things send as formdata to the url or say 
    // http://localhost:5173/reset-password?token=dfdfd?time=44
    // so searchParams is a object that have two property token and time
    const searchParams = new URLSearchParams(location.search);
    console.log(searchParams)
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    console.log(token )
    console.log(email)
    console.log(decodeURIComponent(email))

    if (token && email) {
      setResetData(prev => ({
        ...prev,
        token,
        email: decodeURIComponent(email)
      }));
    } else {
      toast.error("Missing reset information. Please use the link from your email.");
      setTimeout(() => navigate('/forgot-password'), 3000);
    }
  }, [location, navigate]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!resetData.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (resetData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!resetData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (resetData.newPassword !== resetData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    
    if (isValid) {
      // Only send email, token and newPassword to the backend
      const dataToSend = {
        email: resetData.email,
        token: resetData.token,
        newPassword: resetData.newPassword
      };
      
      resetPassword(dataToSend, navigate);
    } else {
      // Show form validation errors
      Object.values(errors).forEach(error => {
        if (error) toast.error(error);
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/waves-pattern.svg')] opacity-10"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white m-auto">
          <div className="mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 2c1 0 3 2 3 4v1a3 3 0 1 1-6 0V6c0-2 2-4 3-4Z" />
              <path d="M10 5c1 0 3 2 3 4v1a3 3 0 1 1-6 0V9c0-2 2-4 3-4Z" />
              <path d="M4 8c1 0 3 2 3 4v1a3 3 0 1 1-6 0v-1c0-2 2-4 3-4Z" />
              <path d="M22 19c0-3-2.5-5-5-5-2 0-3.5 1.5-4 2-1.5-2-3-2-4-2-2.5 0-5 2-5 5 0 3 3 6 9 6 6 0 9-3 9-6Z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-4">PralaySetu</h1>
          <p className="text-xl mb-8">Bridging Crisis to Safety</p>
          
          <div className="max-w-md text-center">
            <p className="text-lg mb-6">
              Your reliable partner in disaster management and emergency response.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-bold text-xl mb-1">Alert</h3>
                <p className="text-sm">Real-time disaster alerts</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-bold text-xl mb-1">Report</h3>
                <p className="text-sm">Community reporting system</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-bold text-xl mb-1">Respond</h3>
                <p className="text-sm">Rapid emergency response</p>
              </div>
            </div>
          </div>
          
          <div className="mt-auto text-sm opacity-80">
            © 2025 PralaySetu. All rights reserved.
          </div>
        </div>
      </div>
      
      {/* Right side - Reset Password Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100/50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Mobile Logo - Only visible on small screens */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
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

          {/* Reset Password Card */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-bold text-center">Create New Password</CardTitle>
                <CardDescription className="text-center hidden sm:block">
                  Enter your new password below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={resetData.email}
                    disabled
                    className="border-gray-300 bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-700">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    value={resetData.newPassword}
                    onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                    className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.newPassword ? 'border-red-500' : ''} mb-2`}
                    required
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    value={resetData.confirmPassword}
                    onChange={(e) => setResetData({...resetData, confirmPassword: e.target.value})}
                    className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : ''} mb-2`}
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6" 
                  disabled={isResettingPassword}
                >
                  {isResettingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Reset password
                    </>
                  )}
                </Button>
                
                <Link to="/login" className="w-full">
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Button>
                </Link>
              </CardFooter>
            </form>
          </Card>

          {/* Footer - Mobile only */}
          <div className="mt-8 text-center text-sm text-gray-500 lg:hidden">
            <p>© 2025 PralaySetu. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
