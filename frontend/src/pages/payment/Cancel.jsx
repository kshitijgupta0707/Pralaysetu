import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, Home } from 'lucide-react';

const Cancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Donation Canceled</CardTitle>
          <CardDescription>
            Your donation process has been canceled.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            No charges have been made to your account. If you have any questions or encountered any issues, please feel free to contact our support team.
          </p>
          {sessionId && (
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <p className="text-sm text-gray-500">Session Reference:</p>
              <p className="text-xs font-mono break-all">{sessionId}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" /> Return to Home
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/user-dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Cancel;