import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowLeft, Home } from 'lucide-react';
import { useDonationStore } from '@/store/useDonationStore';

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { verifyPaymentStatus, loading } = useDonationStore();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (sessionId) {
        const status = await verifyPaymentStatus(sessionId);
        console.log('Payment status:', status);
        setVerified(status === 'success');
      }
      console.log("sessionId is ", sessionId)
    };

    checkPaymentStatus();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Thank You For Your Donation!</CardTitle>
          <CardDescription>
            Your contribution will help those affected by disasters.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            We've sent a receipt to your email. Your support makes a significant difference in helping communities rebuild.
          </p>
          {sessionId && (
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <p className="text-sm text-gray-500">Transaction Reference:</p>
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
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Fundraisers
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Success;