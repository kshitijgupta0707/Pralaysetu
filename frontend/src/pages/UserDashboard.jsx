// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Bell, AlertTriangle, MapPin, MessageSquare, HelpCircle, ChevronRight } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import EmergencyMap from './EmergencyMap';
// import AlertNotifications from './AlertNotifications';
// import ReportIncident from './ReportIncident';
// import RequestHelp from './RequestHelp';
// import { useAuthStore } from '@/store/useAuthstore';
// import { userimage } from '../assets/index.js'
// import { Alert } from '@/components/ui/alert';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, MapPin, MessageSquare, HelpCircle, ChevronRight, DollarSign, CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import EmergencyMap from './EmergencyMap';
import AlertNotifications from './AlertNotifications';
import ReportIncident from './ReportIncident';
import RequestHelp from './RequestHelp';
import { useAuthStore } from '@/store/useAuthstore';
import { useNgoStore } from '@/store/useNgoStore';
import { axiosInstance } from '@/lib/axios';
import { userimage } from '../assets/index.js';
import { Alert } from '@/components/ui/alert';
import { toast } from 'react-hot-toast';
import { useDonationStore } from '@/store/useDonationStore';

const UserDashboard = () => {
  const {donations , loading , error , success , setLoading , setError , processPayment} = useDonationStore()
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { authUser } = useAuthStore();
  const { fundraisers, loading: ngoLoading, error: ngoError, fetchFundraisers } = useNgoStore();
  // const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [userLocation, setUserLocation] = useState(null);
  const [donationAmounts, setDonationAmounts] = useState({});
  const [donorEmail, setDonorEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  console.log("user", authUser);

  useEffect(() => {
    // Fetch fundraisers
    fetchFundraisers();
    
    // Fetch user data
    const fetchUserData = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

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
        // Replace with actual API call
        const response = await fetch('/api/alerts');
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    // Fetch recent verified reports
    const fetchRecentReports = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/reports/verified');
        const data = await response.json();
        setRecentReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchAlerts();
    fetchRecentReports();
  }, []);

  const handleAmountChange = (fundraiserId, value) => {
    setDonationAmounts({
      ...donationAmounts,
      [fundraiserId]: value
    });
  };

  const calculateProgress = (raised, goal) => {
    if (!goal) return 0;
    const percentage = (raised / goal) * 100;
    return Math.min(percentage, 100);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (deadlineString) => {
    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleDonate = async (fundraiser) => {
    const amount = donationAmounts[fundraiser._id];
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }
    
    if (!donorEmail) {
      toast.error('Please enter your email');
      return;
    }

    setIsProcessing(true);
    
    try {
       response = await processPayment({
        amount: Number(amount),
        ngoId: fundraiser.ngoId._id,
        fundraiserId: fundraiser._id,
        donorEmail
      })
     
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
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
      <div className="container mx-auto px-4 py-8">
        {/* Emergency Action Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage src={userimage} alt={authUser?.name} />
                <AvatarFallback>{authUser?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Hello, {authUser?.firstName + " " + authUser.lastName}</p>
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

        {/* Latest Alert Banner (if any critical alerts) */}
        {alerts.some(alert => alert.severity === 'critical') && (
          <Card className="mb-6 border-red-500 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                <div>
                  <h3 className="font-bold text-red-700">
                    {alerts.find(alert => alert.severity === 'critical').title}
                  </h3>
                  <p className="text-red-600">
                    {alerts.find(alert => alert.severity === 'critical').description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 gap-1 ml01">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
            <TabsTrigger value="fundraisers">Fundraisers</TabsTrigger>
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
                      {recentReports.length > 0 ? (
                        <div className="space-y-4">
                          {recentReports.map((report) => (
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
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-20">
                          <MessageSquare className="h-12 w-12 mb-2 opacity-30" />
                          <p>No recent reports</p>
                        </div>
                      )}
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
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Support Disaster Relief Fundraisers</h2>
              <p className="text-gray-600">
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
                    <Card key={fundraiser._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-xl">{fundraiser.title}</CardTitle>
                          <Badge variant={fundraiser.isActive ? "default" : "secondary"}>
                            {fundraiser.isActive ? "Active" : "Ended"}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center text-sm text-gray-500">
                          <span className="flex items-center mr-4">
                            <CalendarIcon className="h-3 w-3 mr-1" />
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
                            value={donationAmounts[fundraiser._id] || ''}
                            onChange={(e) => handleAmountChange(fundraiser._id, e.target.value)}
                            className="mb-2"
                          />
                          <Input
                            type="email"
                            placeholder="Your email"
                            value={donorEmail}
                            onChange={(e) => setDonorEmail(e.target.value)}
                          />
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => handleDonate(fundraiser)}
                          disabled={isProcessing || !fundraiser.isActive}
                        >
                          {isProcessing ? 'Processing...' : 'Donate Now'}
                        </Button>
                      </CardFooter>
                    </Card>
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






















// const UserDashboard = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const { authUser } = useAuthStore()
//   const [loading, setLoading] = useState(true);
//   const [alerts, setAlerts] = useState([]);
//   const [recentReports, setRecentReports] = useState([]);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [userLocation, setUserLocation] = useState(null);
//   console.log("user", authUser)
//   useEffect(() => {
//     // Fetch user data
//     const fetchUserData = async () => {
//       try {
//         // Replace with actual API call
//         const response = await fetch('/api/user/profile');
//         const data = await response.json();
//         setUser(data);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     // Get user's current location
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude
//         });
//       },
//       (error) => {
//         console.error('Error getting location:', error);
//       }
//     );

//     // Fetch alerts for the user's location
//     const fetchAlerts = async () => {
//       try {
//         // Replace with actual API call
//         const response = await fetch('/api/alerts');
//         const data = await response.json();
//         setAlerts(data);
//       } catch (error) {
//         console.error('Error fetching alerts:', error);
//       }
//     };

//     // Fetch recent verified reports
//     const fetchRecentReports = async () => {
//       try {
//         // Replace with actual API call
//         const response = await fetch('/api/reports/verified');
//         const data = await response.json();
//         setRecentReports(data);
//       } catch (error) {
//         console.error('Error fetching reports:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//     fetchAlerts();
//     fetchRecentReports();
//   }, []);

//   const getAlertSeverityColor = (severity) => {
//     switch (severity) {
//       case 'critical':
//         return 'bg-red-500';
//       case 'high':
//         return 'bg-orange-500';
//       case 'medium':
//         return 'bg-yellow-500';
//       case 'low':
//         return 'bg-blue-500';
//       default:
//         return 'bg-gray-500';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100/50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Emergency Action Bar */}
//         <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
//   <div className="flex items-center">
//     <a href="/" className="flex items-center">
//       <Avatar className="h-10 w-10 mr-2">
//         <AvatarImage src={userimage} alt={authUser?.name} />
//         <AvatarFallback>{authUser?.name?.charAt(0)}</AvatarFallback>
//       </Avatar>
//       <div>
//         <p className="font-medium">Hello, {authUser?.firstName + " " + authUser.lastName}</p>
//       </div>
//     </a>
//   </div>
//   <div className="flex gap-2">
//     <Button
//       variant="destructive"
//       size="lg"
//       className="gap-2"
//       onClick={() => setActiveTab('help')}
//     >
//       <HelpCircle className="h-5 w-5" />
//       <span className="hidden sm:inline">Emergency Help</span>
//     </Button>
//   </div>
// </div>

//         {/* Latest Alert Banner (if any critical alerts) */}
//         {alerts.some(alert => alert.severity === 'critical') && (
//           <Card className="mb-6 border-red-500 bg-red-50">
//             <CardContent className="p-4">
//               <div className="flex items-center">
//                 <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
//                 <div>
//                   <h3 className="font-bold text-red-700">
//                     {alerts.find(alert => alert.severity === 'critical').title}
//                   </h3>
//                   <p className="text-red-600">
//                     {alerts.find(alert => alert.severity === 'critical').description}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Main Dashboard Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-4 mb-6 gap-1 ml01">
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="map">Map</TabsTrigger>
//             <TabsTrigger value="report">Report</TabsTrigger>
//             <TabsTrigger value="help">Help</TabsTrigger>
//           </TabsList>

//           {/* Overview Tab */}
//           <TabsContent value="overview">
//             <div className='flex flex-col gap-6'>
//             <div className=" flex flex-col lg:flex-row gap-10">
//               {/* Alerts Section */}
//               <AlertNotifications />
//               {/* Recent Reports */}
//               <Card >
//                 <CardHeader className="pb-2 w-[400px]">
//                   <CardTitle className="text-lg flex items-center">
//                     <MessageSquare className="h-5 w-5 mr-2" />
//                     Recent Reports
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <ScrollArea className="h-[250px]  pr-4">
//                     {recentReports.length > 0 ? (
//                       <div className="space-y-4">
//                         {recentReports.map((report) => (
//                           <div
//                             key={report.id}
//                             className="p-3 rounded-lg bg-white shadow-sm"
//                           >
//                             <div className="flex justify-between items-start">
//                               <h4 className="font-medium">{report.disasterType}</h4>
//                               <Badge variant="outline">{report.status}</Badge>
//                             </div>
//                             <p className="text-sm text-gray-600 mt-1">{report.description}</p>
//                             <div className="flex items-center mt-2 text-xs text-gray-500">
//                               <MapPin className="h-3 w-3 mr-1" />
//                               {report.location?.latitude.toFixed(2)}, {report.location?.longitude.toFixed(2)}
//                               <span className="mx-2">•</span>
//                               {new Date(report.createdAt).toLocaleString()}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-20">
//                         <MessageSquare className="h-12 w-12 mb-2 opacity-30" />
//                         <p>No recent reports</p>
//                       </div>
//                     )}
//                   </ScrollArea>
//                 </CardContent>
//                 {/* <CardFooter>
//                   <Button
//                     variant="outline"
//                     className="w-full"
//                     onClick={() => setActiveTab('report')}
//                   >
//                     Report an Incident
//                     <ChevronRight className="h-4 w-4 ml-1" />
//                   </Button>
//                 </CardFooter> */}
//               </Card>              
//             </div>
//             {/* Quick Map Preview */}
//             <Card className="md:col-span-3">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg flex items-center">
//                     <MapPin className="h-5 w-5 mr-2" />
//                     Emergency Resources Map
//                   </CardTitle>
//                   <CardDescription>
//                     Nearby emergency services and safe zones
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="h-[300px] p-0 rounded-b-lg overflow-hidden">
//                   {userLocation && <EmergencyMap location={userLocation} height="300px" />}
//                 </CardContent>
//                 <CardFooter>
//                   <Button
//                     variant="outline"
//                     className="w-full"
//                     onClick={() => setActiveTab('map')}
//                   >
//                     Open Full Map
//                     <ChevronRight className="h-4 w-4 ml-1" />
//                   </Button>
//                 </CardFooter>
//               </Card>

//             </div>
//           </TabsContent>

//           {/* Map Tab */}
//           <TabsContent value="map">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Emergency Resources Map</CardTitle>
//                 <CardDescription>
//                   Find critical services including hospitals, police stations,
//                   fire departments, and shelters in your area
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="p-0">
//                 {userLocation && <EmergencyMap location={userLocation} height="600px" />}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Report Incident Tab */}
//           <TabsContent value="report">
//             <ReportIncident userLocation={userLocation} />
//           </TabsContent>

//           {/* Request Help Tab */}
//           <TabsContent value="help">
//             <RequestHelp userLocation={userLocation} />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;