
import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useHelpStore } from '@/store/useHelpStore';


import { useLocationValidation } from '@/hooks/useLocationValidation';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { StatusAlert } from '@/components/shared/StatusAlert';

const RequestHelp = ({ userLocation }) => {
  const { location, validateLocation } = useLocationValidation(userLocation);
  const { imagePreview, imageFile, handleImageUpload, clearImage } = useImageUpload();
  
  const [formData, setFormData] = useState({
    reason: '',
    urgency: 'medium',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const { loading, createHelpRequest } = useHelpStore();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleUrgencyChange = (value) => {
    setFormData({ ...formData, urgency: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validatedLocation = await validateLocation();
    if (!validatedLocation) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('reason', formData.reason);
      formDataToSend.append('urgency', formData.urgency);
      formDataToSend.append('latitude', validatedLocation.latitude);
      formDataToSend.append('longitude', validatedLocation.longitude);
  
      if (imageFile) {
        formDataToSend.append('photo', imageFile);
      }
  
      await createHelpRequest(formDataToSend);
  
      // Reset form on success
      setFormData({
        reason: '',
        urgency: 'medium',
      });
      clearImage();
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error submitting help request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  return (
    <Card>
      <CardHeader className="bg-red-50 border-b border-red-100">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <CardTitle>Emergency Help Request</CardTitle>
        </div>
        <CardDescription className="text-red-700">
          Use this form to request immediate assistance. Your request will be reviewed and assigned
          to nearby emergency responders.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <StatusAlert 
          status={submitStatus}
          successTitle="Help Request Submitted"
          successMessage="Your emergency help request has been submitted and is being processed. Responders will be assigned as soon as possible."
          errorTitle="Submission Failed"
          errorMessage="There was an error submitting your help request. Please try again or call emergency services directly."
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reason" className="font-medium">What type of help do you need? *</Label>
            <Textarea 
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Please describe your emergency situation in detail..."
              rows={4}
              required
              className="resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="urgency" className="font-medium">How urgent is your situation? *</Label>
            <RadioGroup 
              value={formData.urgency} 
              onValueChange={handleUrgencyChange}
              className="grid grid-cols-2 gap-4"
            >
              <Label
                htmlFor="urgency-low"
                className={`flex items-center justify-between rounded-md border p-4 cursor-pointer ${formData.urgency === 'low' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="low" id="urgency-low" />
                  <div>
                    <p className="font-medium">Low</p>
                    <p className="text-sm text-gray-500">Not immediate danger</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getUrgencyColor('low')}`}>Low</span>
              </Label>
              
              <Label
                htmlFor="urgency-medium"
                className={`flex items-center justify-between rounded-md border p-4 cursor-pointer ${formData.urgency === 'medium' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="medium" id="urgency-medium" />
                  <div>
                    <p className="font-medium">Medium</p>
                    <p className="text-sm text-gray-500">Assistance needed soon</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getUrgencyColor('medium')}`}>Medium</span>
              </Label>
              
              <Label
                htmlFor="urgency-high"
                className={`flex items-center justify-between rounded-md border p-4 cursor-pointer ${formData.urgency === 'high' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="high" id="urgency-high" />
                  <div>
                    <p className="font-medium">High</p>
                    <p className="text-sm text-gray-500">Urgent assistance needed</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getUrgencyColor('high')}`}>High</span>
              </Label>
              
              <Label
                htmlFor="urgency-critical"
                className={`flex items-center justify-between rounded-md border p-4 cursor-pointer ${formData.urgency === 'critical' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="critical" id="urgency-critical" />
                  <div>
                    <p className="font-medium">Critical</p>
                    <p className="text-sm text-gray-500">Life-threatening emergency</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getUrgencyColor('critical')}`}>Critical</span>
              </Label>
            </RadioGroup>
          </div>

          <ImageUploader 
            imagePreview={imagePreview}
            onUpload={handleImageUpload}
            onClear={clearImage}
            placeholder="Click to upload a photo of your situation"
            subtext="This helps responders better understand your emergency"
          />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
       
          <Button
              type="submit"
              disabled={isSubmitting ||!formData.reason || submitStatus !== null}
          className={`w-full py-6 ${formData.urgency === 'critical' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}

             onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Submitting...
                </>
              ) :
              <>
              Submit Help Request
            </> }
            </Button>
        
        <div className="w-full text-center text-sm text-gray-500">
          <p>In case of extreme emergency, please also call:</p>
          <p className="font-bold text-red-600 text-lg">112 or 108</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RequestHelp;