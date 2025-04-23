import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Label,
} from "your-ui-library"; // Replace with your actual UI library
import { AlertTriangle, Upload, Info, FileCheck, Calendar } from "lucide-react";

const NGOFundraisingPortal = () => {
  const [disasterType, setDisasterType] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // This would be replaced with actual image upload functionality
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      preview: URL.createObjectURL(file),
      size: (file.size / 1024).toFixed(1) + " KB",
    }));
    
    setUploadedImages([...uploadedImages, ...newImages]);
  };

  const removeImage = (id) => {
    setUploadedImages(uploadedImages.filter(img => img.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Handle submission success
      setIsSubmitting(false);
      alert("Fundraising campaign created successfully!");
      // Reset form or redirect
    }, 1500);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header would be included here */}
      
      {/* Campaign Creation Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2 mb-6">
            <Link to="/ngo-dashboard" className="text-blue-600 hover:text-blue-800">
              Dashboard
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Create Fundraising Campaign</span>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <h1 className="text-2xl font-bold">Create Disaster Relief Campaign</h1>
              <p className="opacity-90 mt-2">Raise funds for immediate disaster relief and recovery efforts</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="E.g., Emergency Flood Relief in Kerala"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="disasterType" className="block text-sm font-medium text-gray-700 mb-1">
                      Disaster Type
                    </Label>
                    <Select value={disasterType} onValueChange={setDisasterType} required>
                      <SelectTrigger id="disasterType" className="w-full">
                        <SelectValue placeholder="Select disaster type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flood">Flood</SelectItem>
                        <SelectItem value="earthquake">Earthquake</SelectItem>
                        <SelectItem value="cyclone">Cyclone</SelectItem>
                        <SelectItem value="drought">Drought</SelectItem>
                        <SelectItem value="landslide">Landslide</SelectItem>
                        <SelectItem value="wildfire">Wildfire</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Affected Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="City, State, Country"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Target Amount (₹)
                    </Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      placeholder="500000"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the disaster situation, the impact, and how the funds will be used..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full min-h-[150px]"
                    />
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Images
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="images"
                        className="cursor-pointer flex flex-col items-center justify-center gap-2"
                      >
                        <Upload className="h-8 w-8 text-blue-500" />
                        <span className="text-sm text-gray-600">Click to upload disaster images</span>
                        <span className="text-xs text-gray-500">(Maximum 5 images, up to 5MB each)</span>
                      </label>
                    </div>
                    
                    {uploadedImages.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {uploadedImages.map((img) => (
                          <div key={img.id} className="relative rounded border p-2 flex items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center mr-2">
                              <FileCheck className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="overflow-hidden flex-grow">
                              <p className="text-xs truncate font-medium">{img.name}</p>
                              <p className="text-xs text-gray-500">{img.size}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(img.id)}
                              className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 mt-6 flex items-start border border-blue-100">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>All campaigns are reviewed before approval.</strong> Our team verifies the accuracy 
                    of disaster details and your NGO's credentials before the campaign goes live.
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    Funds raised will be transferred to your registered bank account after a standard verification period.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <Button variant="outline" type="button" className="border-gray-300 text-gray-700">
                  Save as Draft
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Create Campaign"}
                </Button>
              </div>
            </form>
          </div>
          
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg">Campaign Guidelines</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Provide accurate and verified information about the disaster</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Include specific details on how funds will be utilized</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Maintain transparency by sharing regular updates after campaign approval</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Ensure compliance with all disaster relief regulations</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <div className="text-center text-sm text-gray-500">
            <p>Need help setting up your campaign? Contact our support team at <span className="text-blue-600">support@pralaysetu.org</span></p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NGOFundraisingPortal;