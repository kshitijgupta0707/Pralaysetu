import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
   AlertTriangle, MapPin, MessageSquare, 
  HelpCircle, ChevronRight, DollarSign, Calendar 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'react-hot-toast';

// Component imports
import EmergencyMap from '../map/EmergencyMap';
import AlertNotifications from '../../components/AlertNotifications';
import ReportIncident from '../../components/ReportIncident';
import RequestHelp from '../../components/RequestHelp';

// Store imports
import { useAuthStore } from '@/store/useAuthstore';
import { useNgoStore } from '@/store/useNgoStore';
import { useDonationStore } from '@/store/useDonationStore';
import { userimage } from '../../assets/index.js';

// FundraiserCard component for Donate tab
const FundraiserCard = ({ fundraiser, onDonate, isProcessing }) => {
  const [donationAmount, setDonationAmount] = useState('');
  
  const calculateProgress = (raised, goal) => {
    if (!goal) return 0;
    const percentage = (raised / goal) * 100;
    return Math.min(percentage, 100);
  };
  
  const getDaysRemaining = (deadlineString) => {
    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl">{fundraiser.title}</CardTitle>
          <Badge variant={fundraiser.isActive ? "default" : "secondary"}>
            {fundraiser.isActive ? "Active" : "Ended"}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-sm text-gray-500">
          <span className="flex items-center mr-4">
            <Calendar className="h-3 w-3 mr-1" />
            {getDaysRemaining(fundraiser.deadline)} days left
          </span>
          By {fundraiser.ngoId?.name || "Unknown NGO"}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">
          {fundraiser.description}
        </p>

        <div className="mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>
              <span className="font-medium">₹{fundraiser.raisedAmount?.toLocaleString() || 0}</span> raised
            </span>
            <span className="text-gray-500">
              Goal: ₹{fundraiser.goalAmount?.toLocaleString() || 0}
            </span>
          </div>
          <Progress value={calculateProgress(fundraiser.raisedAmount, fundraiser.goalAmount)} className="h-2" />
        </div>

        <div className="mt-4">
          <div className="flex items-center mb-2">
            <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm font-medium">Enter donation amount (₹)</span>
          </div>
          <Input
            type="number"
            min="1"
            placeholder="Amount in INR"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="mb-2"
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onDonate(fundraiser, donationAmount)}
          disabled={isProcessing || !fundraiser.isActive}
        >
          {isProcessing ? 'Processing...' : 'Donate Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};

// RecentReports component for Overview tab
const RecentReports = ({ reports }) => {
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-20">
        <MessageSquare className="h-12 w-12 mb-2 opacity-30" />
        <p>No recent reports</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div
          key={report.id}
          className="p-3 rounded-lg bg-white shadow-sm"
        >
          <div className="flex justify-between items-start">
            <h4 className="font-medium">{report.disasterType}</h4>
            <Badge variant="outline">{report.status}</Badge>
          </div>
          <p className="text-sm text-gray-600 mt-1">{report.description}</p>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            {report.location?.latitude.toFixed(2)}, {report.location?.longitude.toFixed(2)}
            <span className="mx-2">•</span>
            {new Date(report.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

// Main UserDashboard component
const UserDashboard = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { 
    fundraisers, 
    loading: ngoLoading, 
    error: ngoError, 
    fetchFundraisers 
  } = useNgoStore();
  const { 
    processPayment 
  } = useDonationStore();

  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [userLocation, setUserLocation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Critical alert for banner
  const criticalAlert = useMemo(() => {
    return alerts.find(alert => alert.severity === 'critical');
  }, [alerts]);

  useEffect(() => {
    // Fetch fundraisers
    fetchFundraisers();

    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );

    // Fetch alerts for the user's location
    const fetchAlerts = async () => {
      try {
        // Replace with actual API call in production
        const response = await fetch('/api/alerts');
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        // Fallback to empty array
        setAlerts([]);
      }
    };

    // Fetch recent verified reports
    const fetchRecentReports = async () => {
      try {
        // Replace with actual API call in production
        const response = await fetch('/api/reports/verified');
        const data = await response.json();
        setRecentReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        // Fallback to empty array
        setRecentReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    fetchRecentReports();

    // Cleanup function
    return () => {
      // Cancel any pending requests if needed
    };
  }, [fetchFundraisers]);

  const handleDonate = async (fundraiser, amount) => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    if (!authUser?.email) {
      toast.error('Please log in to donate');
      return;
    }

    setIsProcessing(true);

    try {
      await processPayment({
        amount: Number(amount),
        ngoId: fundraiser.ngoId._id,
        fundraiserId: fundraiser._id,
        donorEmail: authUser.email
      });
      
      toast.success('Donation successful! Thank you for your contribution.');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100/50">
      <div className="container mx-auto px-4 py-8 pt-4">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage src={userimage} alt={authUser?.name} />
                <AvatarFallback>{authUser?.firstName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Hello, {authUser?.firstName} {authUser?.lastName}</p>
              </div>
            </a>
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="lg"
              className="gap-2"
              onClick={() => setActiveTab('help')}
            >
              <HelpCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Emergency Help</span>
            </Button>
          </div>
        </div>

        {/* Critical Alert Banner */}
        {criticalAlert && (
          <Card className="mb-6 border-red-500 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                <div>
                  <h3 className="font-bold text-red-700">{criticalAlert.title}</h3>
                  <p className="text-red-600">{criticalAlert.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
            <TabsTrigger value="fundraisers">Donate</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className='flex flex-col gap-6'>
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Alerts Section */}
                <AlertNotifications />
                
                {/* Recent Reports */}
                <Card>
                  <CardHeader className="pb-2 w-[400px]">
                    <CardTitle className="text-lg flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Recent Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[250px] pr-4">
                      <RecentReports reports={recentReports} />
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
              
              {/* Quick Map Preview */}
              <Card className="md:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Emergency Resources Map
                  </CardTitle>
                  <CardDescription>
                    Nearby emergency services and safe zones
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] p-0 rounded-b-lg overflow-hidden">
                  {userLocation && <EmergencyMap location={userLocation} height="300px" />}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveTab('map')}
                  >
                    Open Full Map
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Resources Map</CardTitle>
                <CardDescription>
                  Find critical services including hospitals, police stations,
                  fire departments, and shelters in your area
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {userLocation && <EmergencyMap location={userLocation} height="600px" />}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report Incident Tab */}
          <TabsContent value="report">
            <ReportIncident userLocation={userLocation} />
          </TabsContent>

          {/* Request Help Tab */}
          <TabsContent value="help">
            <RequestHelp userLocation={userLocation} />
          </TabsContent>

          {/* Fundraisers Tab */}
          <TabsContent value="fundraisers">
            <div className="mb-6 flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2 text-center">Support Disaster Relief Fundraisers</h2>
              <p className="text-gray-600 text-center">
                Help communities recover from disasters by contributing to these ongoing fundraisers.
              </p>
            </div>

            {ngoLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : ngoError ? (
              <Card className="bg-red-50 border border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-red-700">Failed to load fundraisers. Please try again later.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fundraisers.length > 0 ? (
                  fundraisers.map((fundraiser) => (
                    <FundraiserCard 
                      key={fundraiser._id}
                      fundraiser={fundraiser}
                      onDonate={handleDonate}
                      isProcessing={isProcessing}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-gray-500">
                    <DollarSign className="h-12 w-12 mb-2 opacity-30" />
                    <p className="text-lg">No active fundraisers found</p>
                    <p className="text-sm mt-1">Check back later for new fundraising campaigns</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;