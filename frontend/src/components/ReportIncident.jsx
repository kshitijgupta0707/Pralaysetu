// src/components/reports/ReportIncident.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useReportStore } from '@/store/useReportStore';

// Import our shared components and hooks
import { useLocationValidation } from '@/hooks/useLocationValidation';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { StatusAlert } from '@/components/shared/StatusAlert';

const ReportIncident = ({ userLocation }) => {
  const { location, validateLocation } = useLocationValidation(userLocation);
  const { imagePreview, imageFile, handleImageUpload, clearImage } = useImageUpload();
  
  const { createReport, isCreatingReport } = useReportStore();
  
  const [formData, setFormData] = useState({
    disasterType: '',
    description: '',
  });

  const [submitStatus, setSubmitStatus] = useState(null);

  const disasterTypes = [
    'Flood',
    'Earthquake',
    'Cyclone',
    'Tsunami',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, disasterType: value });
  };

  const handleSubmit = async (e) => {
    console.log('Submitting report with formData:', formData);
    e.preventDefault();
    setSubmitStatus(null);
    
    const validatedLocation = await validateLocation();
    console.log('Validated Location:', validatedLocation);
    if (!validatedLocation) {
      return;
    }

    try {
      // Create FormData object for multipart/form-data submission
      const reportFormData = new FormData();
      reportFormData.append('disasterType', formData.disasterType);
      reportFormData.append('description', formData.description);
      reportFormData.append('latitude', validatedLocation.latitude);
      reportFormData.append('longitude', validatedLocation.longitude);

      if (imageFile) {
        reportFormData.append('media', imageFile);
      }

      // Use the Zustand store's createReport function
      const result = await createReport(reportFormData);

      if (result) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setFormData({
          disasterType: '',
          description: '',
        });
        clearImage();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmitStatus('error');
    }
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
        <StatusAlert 
          status={submitStatus}
          successTitle="Report Submitted Successfully"
          successMessage="Thank you for your report. It has been submitted for review by our team. You will be notified once it's verified."
          errorTitle="Submission Failed"
          errorMessage="There was an error submitting your report. Please try again."
        />

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

          <ImageUploader 
            imagePreview={imagePreview}
            onUpload={handleImageUpload}
            onClear={clearImage}
            placeholder="Click to upload an image of the incident"
            subtext="Supported: JPG, PNG, GIF (max 5MB)"
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" >
          Cancel
        </Button>
        <Button
              type="submit"
              disabled={isCreatingReport || !formData.disasterType || !formData.description || submitStatus !== null}
             onClick={handleSubmit}
            >
              {isCreatingReport ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Submitting...
                </>
              ) :
              <>
              Submit Report
            </> }
            </Button>
       
      </CardFooter>
    </Card>
  );
};

export default ReportIncident;