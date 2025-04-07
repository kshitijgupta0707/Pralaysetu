import React, { useState } from 'react';
import { Camera, Upload, MapPin, AlertTriangle, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useReportStore } from '@/store/useReportStore'; // Update path as needed

const ReportIncident = ({ userLocation }) => {
  const { createReport, isCreatingReport } = useReportStore();
  const [formData, setFormData] = useState({
    disasterType: '',
    description: '',
    location: userLocation || { latitude: 0, longitude: 0 },
    imageFile: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const disasterTypes = [
    'Flood',
    'Earthquake',
    'Fire',
    'Cyclone',
    'Landslide',
    'Tsunami',
    'Building Collapse',
    'Traffic Accident',
    'Gas Leak',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, disasterType: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, imageFile: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    try {
      // Create FormData object for multipart/form-data submission
      const reportFormData = new FormData();
      reportFormData.append('disasterType', formData.disasterType);
      reportFormData.append('description', formData.description);
      reportFormData.append('latitude', formData.location.latitude);
      reportFormData.append('longitude', formData.location.longitude);
      
      if (formData.imageFile) {
        reportFormData.append('media', formData.imageFile);
      }

      // Use the Zustand store's createReport function
      const result = await createReport(reportFormData);
      
      if (result) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setFormData({
          disasterType: '',
          description: '',
          location: userLocation || { latitude: 0, longitude: 0 },
          imageFile: null
        });
        setImagePreview(null);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmitStatus('error');
    }
  };

  const getCurrentLocationString = () => {
    if (formData.location && formData.location.latitude && formData.location.longitude) {
      return `${formData.location.latitude.toFixed(6)}, ${formData.location.longitude.toFixed(6)}`;
    }
    return 'Location not available';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an Incident</CardTitle>
        <CardDescription>
          Your reports help us identify and respond to disasters more effectively. 
          All reports are reviewed by our team before being shared.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitStatus === 'success' && (
          <Alert className="mb-6 bg-green-50 border-green-500 text-green-700">
            <Check className="h-4 w-4" />
            <AlertTitle>Report Submitted Successfully</AlertTitle>
            <AlertDescription>
              Thank you for your report. It has been submitted for review by our team.
              You will be notified once it's verified.
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert className="mb-6" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Submission Failed</AlertTitle>
            <AlertDescription>
              There was an error submitting your report. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="disasterType">Type of Incident *</Label>
            <Select 
              value={formData.disasterType} 
              onValueChange={handleSelectChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                {disasterTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Please provide details about the incident..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="location"
                value={getCurrentLocationString()}
                readOnly
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setFormData({
                        ...formData,
                        location: {
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude
                        }
                      });
                    },
                    (error) => {
                      console.error('Error getting location:', error);
                    }
                  );
                }}
              >
                <MapPin className="h-4 w-4" />
                Update
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Upload Photo (Optional)</Label>
            <div className="grid grid-cols-1 gap-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label 
                  htmlFor="image" 
                  className="flex flex-col items-center justify-center cursor-pointer h-40"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded" 
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setImagePreview(null);
                          setFormData({ ...formData, imageFile: null });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Camera className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to upload an image of the incident
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        Supported: JPG, PNG, GIF (max 5MB)
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isCreatingReport || !formData.disasterType || !formData.description}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isCreatingReport ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Submitting...
            </>
          ) : 'Submit Report'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportIncident;