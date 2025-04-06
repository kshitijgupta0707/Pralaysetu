import React, { useState } from 'react';
import { Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    location: '',
    role: 'User' // Default role
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Register data:', registerData);
      // Here you would make your actual API call to register the user
      // The API should handle setting isVerified: false by default
      // And should initialize resetPasswordToken and resetPasswordExpires as needed
    }, 1500);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/waves-pattern.svg')] opacity-10"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
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
              Join our network of citizens, responders, and organizations working together for a safer tomorrow.
            </p>
            <div className="space-y-4 mb-12">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm text-left flex items-start">
                <div className="bg-blue-500/70 p-2 rounded-full mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Real-time Alerts</h3>
                  <p className="text-sm opacity-90">Receive immediate notifications about potential disasters in your area</p>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm text-left flex items-start">
                <div className="bg-blue-500/70 p-2 rounded-full mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
                    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Community Reports</h3>
                  <p className="text-sm opacity-90">Report unusual activities and help your community stay informed</p>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm text-left flex items-start">
                <div className="bg-blue-500/70 p-2 rounded-full mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.5 21h-10a2 2 0 0 1-2-2V7h14v12a2 2 0 0 1-2 2Z"/>
                    <path d="M12.5 3h-6l-1 4h14l-1-4h-6Z"/>
                    <path d="M9.5 7v14"/>
                    <path d="M15.5 7v14"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Disaster Relief</h3>
                  <p className="text-sm opacity-90">Connect with NGOs and contribute to relief efforts</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-auto text-sm opacity-80">
            © 2025 PralaySetu. All rights reserved.
          </div>
        </div>
      </div>
      
      {/* Right side - Signup Form */}
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

          {/* Signup Card */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <form onSubmit={handleRegisterSubmit}>
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Link to="/login" className="mr-4 text-gray-500 hover:text-blue-600 transition">
                    <ArrowLeft size={20} />
                  </Link>
                  <div>
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                      Join PralaySetu's disaster management network
                    </CardDescription>
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                    <Input 
                      id="firstName" 
                      type="text" 
                      placeholder="First name" 
                      value={registerData.firstName}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                    <Input 
                      id="lastName" 
                      type="text" 
                      placeholder="Last name" 
                      value={registerData.lastName}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@example.com" 
                    value={registerData.email}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-gray-700">Phone Number</Label>
                  <Input 
                    id="phoneNumber" 
                    type="tel" 
                    placeholder="+91 9876543210" 
                    value={registerData.phoneNumber}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700">Location</Label>
                  <Input 
                    id="location" 
                    type="text" 
                    placeholder="City, State" 
                    value={registerData.location}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-700">I am registering as</Label>
                  <Select 
                    value={registerData.role} 
                    onValueChange={(value) => setRegisterData({...registerData, role: value})}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User">Citizen</SelectItem>
                      <SelectItem value="NGO">NGO Representative</SelectItem>
                      <SelectItem value="Government">Government Authority</SelectItem>
                      <SelectItem value="Responder">Emergency Responder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={registerData.password}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    value={registerData.confirmPassword}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={setAcceptTerms}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the <Link className="text-blue-600 hover:underline" to="/terms">Terms of Service</Link> and <Link className="text-blue-600 hover:underline" to="/privacy">Privacy Policy</Link>
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Log in
                  </Link>
                </div>
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

export default SignupPage;