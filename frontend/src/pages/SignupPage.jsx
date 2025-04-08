import React, { useState } from 'react';
import { Loader2, ArrowLeft, ArrowRight, Check, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthstore';

const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    registerAs: 'None', // Default: None
    workAsResponder: false, // Default: No
    governmentDocument: null
  });

  const { isSigningUp, sendOtp, isSendingOtp } = useAuthStore();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [documentFileName, setDocumentFileName] = useState(''); // To display file name
  
  // Step validation functions
  const validateStep1 = () => {
    if (!registerData.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!registerData.lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!registerData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    
    console.log("validated 1");
    return true;
  };
  const validateStep2 = () => {
    if (!registerData.location.trim()) {
      toast.error("Location is required");
      return false;
    }
    
    if (
      (registerData.registerAs === 'Government' || registerData.registerAs === 'NGO') &&
      !registerData.governmentDocument
    ) {
      toast.error(`Please upload an identification document for ${registerData.registerAs} verification`);
      return false;
    }
    
    console.log("validated 2");
    return true;
  };
  const validateStep3 = () => {
    if (!registerData.password) {
      toast.error("Password is required");
      return false;
    }
    if (!registerData.confirmPassword) {
      toast.error("Confirm Password is required");
      return false;
    }
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Both passwords should be same");
      return false;
    }
    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions");
      return false;
    }
    
    return true;
  };
  
  const nextStep = () => {
    let isValid = false;
    
    switch(currentStep) {
      case 1:
        isValid = validateStep1();
        break;
        case 2: 
        isValid = validateStep2();
        break;
        default:
        isValid = true;
      }
      
      
      if (isValid) {
        console.log("Go ahead");
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        return;
      }
      
      
      console.log("NOt go ahead")
    };
    
    const prevStep = () => {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    };
    
    const navigate = useNavigate();
    const handleRegisterSubmit = (e) => {
      e.preventDefault();
    
      const isValid = validateStep3();
      if (!isValid) return;
    
      console.log('Form is valid, preparing FormData...');
    
      const formData = new FormData();
      formData.append("firstName", registerData.firstName);
      formData.append("lastName", registerData.lastName);
      formData.append("email", registerData.email);
      formData.append("password", registerData.password);
      formData.append("confirmPassword", registerData.confirmPassword);
      formData.append("location", registerData.location);
      formData.append("registerAs", registerData.registerAs);
      formData.append("workAsResponder", registerData.workAsResponder);
      
      if (registerData.governmentDocument) {
        formData.append("governmentDocument", registerData.governmentDocument);
      }
    
      // Optionally add OTP here if needed
      // formData.append("otp", otp);
    
      // Pass FormData instead of plain JSON
      sendOtp(formData, navigate); // Make sure sendOtp handles FormData now
    };
    

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle document file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRegisterData(prev => ({
        ...prev,
        governmentDocument: file
      }));
      setDocumentFileName(file.name);
    }
  };

  // Render progress indicators
  const renderStepIndicators = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        {[...Array(totalSteps)].map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          
          return (
            <div key={stepNum} className="flex items-center">
              {/* Step circle */}
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors
                  ${isActive ? 'bg-blue-600 text-white' : 
                    isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                {isCompleted ? <Check size={16} /> : stepNum}
              </div>
              
              {/* Connecting line */}
              {stepNum < totalSteps && (
                <div 
                  className={`w-12 h-1 mx-1 
                    ${stepNum < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Left side - Image/Illustration - Fixed, no scrolling */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 relative">
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
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
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
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
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
                    <path d="M17.5 21h-10a2 2 0 0 1-2-2V7h14v12a2 2 0 0 1-2 2Z" />
                    <path d="M12.5 3h-6l-1 4h14l-1-4h-6Z" />
                    <path d="M9.5 7v14" />
                    <path d="M15.5 7v14" />
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

      {/* Right side - Signup Form - Scrollable */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100/50 overflow-y-auto">
        <div className="flex items-center justify-center p-6 min-h-full">
          <div className="max-w-md w-full my-6">
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
                  {/* Step indicators */}
                  {renderStepIndicators()}
                </CardHeader>
                
                <CardContent>
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
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
                      <div className="space-y-2 mb-4">
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
                    </div>
                  )}

                  {/* Step 2: Location and Roles */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
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
                      
                      {/* Organization Type */}
                      <div className="space-y-2">
                        <Label htmlFor="registerAs" className="text-gray-700">Are you registering as</Label>
                        <Select
                          value={registerData.registerAs}
                          onValueChange={(value) => {
                            setRegisterData(prev => ({
                              ...prev, 
                              registerAs: value,
                              // Reset document when changing type
                              governmentDocument: null
                            }));
                            setDocumentFileName('');
                          }}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Select organization type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Government">Government Authority</SelectItem>
                            <SelectItem value="NGO">NGO</SelectItem>
                            <SelectItem value="None">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Conditional Document Upload for Government/NGO */}
                      {(registerData.registerAs === 'Government' || registerData.registerAs === 'NGO') && (
                        <div className="space-y-2">
                          <Label htmlFor="documentUpload" className="text-gray-700">
                            {registerData.registerAs === 'Government' 
                              ? 'Upload Government ID or Authorization Letter' 
                              : 'Upload NGO Registration Certificate'}
                          </Label>
                          <div className="mt-1 flex items-center">
                            <label htmlFor="documentUpload" className="flex cursor-pointer items-center justify-center w-full rounded-md border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 transition-colors">
                              <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                  <span className="relative font-medium text-blue-600 hover:underline">
                                    Upload a file
                                    <input
                                      id="documentUpload"
                                      name="documentUpload"
                                      type="file"
                                      className="sr-only"
                                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                      onChange={handleFileChange}
                                    />
                                  </span>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, PDF up to 10MB
                                </p>
                              </div>
                            </label>
                          </div>
                          {documentFileName && (
                            <div className="mt-2 flex items-center text-sm text-gray-600">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span>{documentFileName}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Emergency Responder Availability */}
                      <div className="space-y-2 mb-6">
                        <Label className="text-gray-700">Would you like to work as a responder in case of emergency/disaster?</Label>
                        <RadioGroup 
                          defaultValue="no"
                          onValueChange={(value) => setRegisterData(prev => ({
                            ...prev, 
                            workAsResponder: value === "yes"
                          }))}
                          className="flex space-x-4 pt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="respond-yes" />
                            <Label htmlFor="respond-yes" className="text-gray-700">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="respond-no" />
                            <Label htmlFor="respond-no" className="text-gray-700">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Password and Terms */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
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
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <div className="flex w-full justify-between">
                    {/* Back button - Only show if not on first step */}
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="px-4 flex items-center"
                      >
                        <ArrowLeft size={16} className="mr-2" />
                        Back
                      </Button>
                    )}
                    
                    {/* Spacer if back button isn't shown */}
                    {currentStep === 1 && <div></div>}
                    
                    {/* Next/Submit button */}
                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 flex items-center"
                      >
                        Next
                        <ArrowRight size={16} className="ml-2"/>
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                        disabled={isSigningUp}
                      >
                        {isSendingOtp ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create account"
                        )}
                      </Button>
                    )}
                  </div>
                  
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
    </div>
  );
};

export default SignupPage;