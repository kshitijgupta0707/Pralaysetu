import React, { useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthstore';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { sendResetLink, isSendingLink } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email format");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (!success) return;
    
    sendResetLink({ email }, navigate);
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
      
      {/* Right side - Forgot Password Form */}
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

          {/* Forgot Password Card */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                <CardDescription className="text-center mb-3">
                  Enter your email address and we'll send you a link to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 mb-3"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6" 
                  disabled={isSendingLink}
                >
                  {isSendingLink ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
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