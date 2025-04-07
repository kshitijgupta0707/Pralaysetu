import React, { useState } from 'react';
import { AlertCircle, Camera, MapPin, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const RequestHelp = ({ userLocation }) => {
  const [formData, setFormData] = useState({
    reason: '',
    urgency: 'medium',
    location: userLocation || { lat: 0, lng: 0 },
    photo: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUrgencyChange = (value) => {
    setFormData({ ...formData, urgency: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // In a real app, you would upload to Cloudinary or similar service
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // In a real app, you would send to your API
      const response = await fetch('/api/help-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setFormData({
          reason: '',
          urgency: 'medium',
          location: userLocation || { lat: 0, lng: 0 },
          photo: ''
        });
        setImagePreview(null);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting help request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentLocationString = () => {
    if (formData.location && formData.location.lat && formData.location.lng) {
      return `${formData.location.lat.toFixed(6)}, ${formData.location.lng.toFixed(6)}`;
    }
    return 'Location not available';
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
        {submitStatus === 'success' && (
          <Alert className="mb-6 bg-green-50 border-green-500 text-green-700">
            <Check className="h-4 w-4" />
            <AlertTitle>Help Request Submitted</AlertTitle>
            <AlertDescription>
              Your emergency help request has been submitted and is being processed. 
              Responders will be assigned as soon as possible.
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Submission Failed</AlertTitle>
            <AlertDescription>
              There was an error submitting your help request. Please try again or call emergency services directly.
            </AlertDescription>
          </Alert>
        )}

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

          <div className="space-y-2">
            <Label htmlFor="location" className="font-medium">Your Current Location *</Label>
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
                          lat: position.coords.latitude,
                          lng: position.coords.longitude
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
            <p className="text-xs text-gray-500">
              Your precise location helps responders reach you quickly.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="font-medium">Upload Photo (Optional)</Label>
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
                          setFormData({ ...formData, photo: '' });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Camera className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to upload a photo of your situation
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        This helps responders better understand your emergency
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.reason}
          className={`w-full py-6 ${formData.urgency === 'critical' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Submitting...
            </>
          ) : formData.urgency === 'critical' ? 'Request Emergency Help Now' : 'Submit Help Request'}
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