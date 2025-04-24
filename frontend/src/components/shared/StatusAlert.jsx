import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const StatusAlert = ({ 
  status, 
  successTitle = 'Success', 
  successMessage = 'Operation completed successfully.',
  errorTitle = 'Error', 
  errorMessage = 'An error occurred. Please try again.' 
}) => {
  if (status === 'success') {
    return (
      <Alert className="mb-6 bg-green-50 border-green-500 text-green-700">
        <Check className="h-4 w-4" />
        <AlertTitle>{successTitle}</AlertTitle>
        <AlertDescription>{successMessage}</AlertDescription>
      </Alert>
    );
  }
  
  if (status === 'error') {
    return (
      <Alert className="mb-6" variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{errorTitle}</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
  }
  
  return null;
};  