import React, { useState } from 'react';
import { MapPin, Clock, AlertCircle, CheckCircle, Loader2, User, Calendar, Navigation, BarChart4, List, Filter, Map, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
// Mock data - Would be fetched from API in production
const MOCK_REQUESTS = [
  {
    _id: '1',
    user: {
      _id: 'u1',
      firstName: 'Rahul',
      lastName: 'Sharma',
      phoneNumber: '+91 9876543210',
    },
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Connaught Place, New Delhi'
    },
    reason: 'Trapped in building after earthquake, need immediate evacuation',
    urgency: 'critical',
    photo: '/api/placeholder/400/300',
    status: 'pending',
    createdAt: '2025-04-07T10:30:00.000Z'
  },
  {
    _id: '2',
    user: {
      _id: 'u2',
      firstName: 'Priya',
      lastName: 'Patel',
      phoneNumber: '+91 8765432109',
    },
    location: {
      lat: 28.6229,
      lng: 77.2100,
      address: 'Paharganj, New Delhi'
    },
    reason: 'Water flooding in basement, family trapped',
    urgency: 'high',
    photo: '/api/placeholder/400/300',
    status: 'accepted',
    assignedTo: 'currentUser',
    createdAt: '2025-04-07T09:15:00.000Z'
  },
  {
    _id: '3',
    user: {
      _id: 'u3',
      firstName: 'Amit',
      lastName: 'Kumar',
      phoneNumber: '+91 7654321098',
    },
    location: {
      lat: 28.6129,
      lng: 77.2295,
      address: 'Mandi House, New Delhi'
    },
    reason: 'Gas leak detected, need evacuation assistance',
    urgency: 'high',
    photo: '/api/placeholder/400/300',
    status: 'completed',
    assignedTo: 'currentUser',
    createdAt: '2025-04-06T16:45:00.000Z',
    completedAt: '2025-04-06T18:30:00.000Z'
  },
  {
    _id: '4',
    user: {
      _id: 'u4',
      firstName: 'Neha',
      lastName: 'Gupta',
      phoneNumber: '+91 9876543211',
    },
    location: {
      lat: 28.5621,
      lng: 77.2340,
      address: 'Lajpat Nagar, New Delhi'
    },
    reason: 'Elderly person needs medical evacuation during flood',
    urgency: 'medium',
    photo: '/api/placeholder/400/300',
    status: 'pending',
    createdAt: '2025-04-07T11:20:00.000Z'
  },
  {
    _id: '5',
    user: {
      _id: 'u5',
      firstName: 'Suresh',
      lastName: 'Yadav',
      phoneNumber: '+91 8765432108',
    },
    location: {
      lat: 28.5710,
      lng: 77.2110,
      address: 'Defence Colony, New Delhi'
    },
    reason: 'Collapsed wall structure, people trapped underneath',
    urgency: 'critical',
    photo: '/api/placeholder/400/300',
    status: 'verified',
    createdAt: '2025-04-07T10:50:00.000Z'
  }
];

// Mock responder data
const RESPONDER_DATA = {
  _id: 'resp1',
  firstName: 'Vikram',
  lastName: 'Singh',
  role: 'Responder',
  team: 'NDRF Team 5',
  location: 'New Delhi',
  phoneNumber: '+91 9988776655',
  email: 'vikram.singh@ndrf.gov.in',
  avatar: '/api/placeholder/100/100',
  specialization: 'Urban Search & Rescue',
  completedMissions: 47
};

const ResponderDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestDetail, setShowRequestDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  
  // Mock function to accept a request
  const handleAcceptRequest = (requestId) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Update local state to reflect accepted request
      MOCK_REQUESTS.forEach(req => {
        if (req._id === requestId) {
          req.status = 'accepted';
          req.assignedTo = 'currentUser';
        }
      });
      setShowRequestDetail(false);
      setSelectedTab('active');
    }, 1500);
  };
  
  // Mock function to complete a request
  const handleCompleteRequest = (requestId) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Update local state to reflect completed request
      MOCK_REQUESTS.forEach(req => {
        if (req._id === requestId) {
          req.status = 'completed';
          req.completedAt = new Date().toISOString();
        }
      });
      setShowRequestDetail(false);
      setSelectedTab('completed');
    }, 1500);
  };
  
  // Filter requests based on selected tab and filters
  const getFilteredRequests = () => {
    // First filter by tab selection
    let filteredRequests = MOCK_REQUESTS.filter(req => {
      if (selectedTab === 'pending') return ['pending', 'verified'].includes(req.status);
      if (selectedTab === 'active') return req.status === 'accepted' && req.assignedTo === 'currentUser';
      if (selectedTab === 'completed') return req.status === 'completed' && req.assignedTo === 'currentUser';
      return true;
    });
    
    // Then apply status filter if not 'all'
    if (statusFilter !== 'all') {
      filteredRequests = filteredRequests.filter(req => req.status === statusFilter);
    }
    
    // Then apply urgency filter if not 'all'
    if (urgencyFilter !== 'all') {
      filteredRequests = filteredRequests.filter(req => req.urgency === urgencyFilter);
    }
    
    return filteredRequests;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };
  
  // Get urgency badge color
  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get status badge properties
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return { color: 'bg-gray-500', icon: <Clock className="h-3 w-3 mr-1" /> };
      case 'verified':
        return { color: 'bg-blue-500', icon: <AlertCircle className="h-3 w-3 mr-1" /> };
      case 'accepted':
        return { color: 'bg-orange-500', icon: <Navigation className="h-3 w-3 mr-1" /> };
      case 'completed':
        return { color: 'bg-green-500', icon: <CheckCircle className="h-3 w-3 mr-1" /> };
      case 'rejected':
        return { color: 'bg-red-500', icon: <AlertCircle className="h-3 w-3 mr-1" /> };
      default:
        return { color: 'bg-gray-500', icon: <Clock className="h-3 w-3 mr-1" /> };
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100/50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 flex items-center space-x-3 border-b">
          <div className="bg-blue-600 p-2 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 2c1 0 3 2 3 4v1a3 3 0 1 1-6 0V6c0-2 2-4 3-4Z" />
              <path d="M10 5c1 0 3 2 3 4v1a3 3 0 1 1-6 0V9c0-2 2-4 3-4Z" />
              <path d="M4 8c1 0 3 2 3 4v1a3 3 0 1 1-6 0v-1c0-2 2-4 3-4Z" />
              <path d="M22 19c0-3-2.5-5-5-5-2 0-3.5 1.5-4 2-1.5-2-3-2-4-2-2.5 0-5 2-5 5 0 3 3 6 9 6 6 0 9-3 9-6Z" />
            </svg>
          </div>
          <div>
            <Link to={"/"} >
            <h1 className="font-bold text-blue-800">PralaySetu</h1>
            <p className="text-xs text-gray-500">Responder Portal</p>
            </Link>
          </div>
        </div>
        
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={RESPONDER_DATA.avatar} alt={`${RESPONDER_DATA.firstName} ${RESPONDER_DATA.lastName}`} />
              <AvatarFallback className="bg-blue-600 text-white">
                {RESPONDER_DATA.firstName.charAt(0)}{RESPONDER_DATA.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-800">{RESPONDER_DATA.firstName} {RESPONDER_DATA.lastName}</p>
              <p className="text-xs text-gray-500">{RESPONDER_DATA.team}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <div className="bg-blue-50 p-2 rounded">
              <p className="text-xs text-gray-500">Missions</p>
              <p className="font-bold text-blue-700">{RESPONDER_DATA.completedMissions}</p>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <p className="text-xs text-gray-500">Status</p>
              <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start font-normal" active={true}>
              <List className="h-4 w-4 mr-2" />
              Help Requests
            </Button>
            <Button variant="ghost" className="w-full justify-start font-normal">
              <Map className="h-4 w-4 mr-2" />
              Map View
            </Button>
            <Button variant="ghost" className="w-full justify-start font-normal">
              <BarChart4 className="h-4 w-4 mr-2" />
              Statistics
            </Button>
            <Button variant="ghost" className="w-full justify-start font-normal">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </nav>
        
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-gray-500">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Help Requests Dashboard</h1>
            <div className="flex space-x-2">
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter by urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgencies</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="pending" className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Pending Requests
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center">
                <Navigation className="h-4 w-4 mr-2" />
                Active Missions
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed Missions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredRequests().length > 0 ? (
                  getFilteredRequests().map((request) => (
                    <Card key={request._id} 
                      className="shadow-md hover:shadow-lg transition-shadow cursor-pointer" 
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowRequestDetail(true);
                      }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                              {request.location.address}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(request.createdAt)}
                              </span>
                            </CardDescription>
                          </div>
                          <Badge className={`${getUrgencyColor(request.urgency)} hover:${getUrgencyColor(request.urgency)}`}>
                            {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm line-clamp-2 text-gray-700">{request.reason}</p>
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          {request.user.firstName} {request.user.lastName}
                        </div>
                        <Badge className={`${getStatusBadge(request.status).color} hover:${getStatusBadge(request.status).color} flex items-center`}>
                          {getStatusBadge(request.status).icon}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 flex justify-center items-center p-12">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        There are no requests matching your current filters.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Request detail dialog */}
      <Dialog open={showRequestDetail} onOpenChange={setShowRequestDetail}>
        <DialogContent className="max-w-3xl">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <AlertCircle className={`h-5 w-5 mr-2 ${selectedRequest.urgency === 'critical' ? 'text-red-500' : 
                    selectedRequest.urgency === 'high' ? 'text-orange-500' : 
                    selectedRequest.urgency === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                  {selectedRequest.urgency.charAt(0).toUpperCase() + selectedRequest.urgency.slice(1)} Request
                </DialogTitle>
                <DialogDescription>
                  Submitted on {formatDate(selectedRequest.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Request Details</h3>
                  <p className="text-gray-900 mb-4">{selectedRequest.reason}</p>
                  
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                  <div className="bg-gray-100 rounded-lg p-3 mb-4">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-blue-600 mt-1 mr-2" />
                      <div>
                        <p className="font-medium">{selectedRequest.location.address}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Coordinates: {selectedRequest.location.lat.toFixed(4)}, {selectedRequest.location.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Requester Information</h3>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback className="bg-blue-600 text-white">
                          {selectedRequest.user.firstName.charAt(0)}{selectedRequest.user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedRequest.user.firstName} {selectedRequest.user.lastName}</p>
                        <p className="text-sm text-gray-500">{selectedRequest.user.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Situation Photo</h3>
                  <div className="bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={selectedRequest.photo} 
                      alt="Emergency situation" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                  <Alert className={`mb-4 ${
                    selectedRequest.status === 'pending' ? 'bg-gray-100' :
                    selectedRequest.status === 'verified' ? 'bg-blue-50' :
                    selectedRequest.status === 'accepted' ? 'bg-orange-50' :
                    selectedRequest.status === 'completed' ? 'bg-green-50' :
                    'bg-red-50'
                  }`}>
                    <div className={`
                      p-1 rounded-full mr-2 
                      ${selectedRequest.status === 'pending' ? 'bg-gray-500' :
                        selectedRequest.status === 'verified' ? 'bg-blue-500' :
                        selectedRequest.status === 'accepted' ? 'bg-orange-500' :
                        selectedRequest.status === 'completed' ? 'bg-green-500' :
                        'bg-red-500'}
                    `}>
                      {selectedRequest.status === 'pending' && <Clock className="h-4 w-4 text-white" />}
                      {selectedRequest.status === 'verified' && <AlertCircle className="h-4 w-4 text-white" />}
                      {selectedRequest.status === 'accepted' && <Navigation className="h-4 w-4 text-white" />}
                      {selectedRequest.status === 'completed' && <CheckCircle className="h-4 w-4 text-white" />}
                    </div>
                    <AlertTitle>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </AlertTitle>
                    <AlertDescription>
                      {selectedRequest.status === 'pending' && "This request is awaiting verification."}
                      {selectedRequest.status === 'verified' && "This request has been verified and needs assistance."}
                      {selectedRequest.status === 'accepted' && "You have accepted this request and are en route to provide assistance."}
                      {selectedRequest.status === 'completed' && "This request has been completed successfully."}
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
              
              <DialogFooter className="flex-col sm:flex-row gap-2">
                {['pending', 'verified'].includes(selectedRequest.status) && (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto" 
                    disabled={isLoading}
                    onClick={() => handleAcceptRequest(selectedRequest._id)}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Navigation className="mr-2 h-4 w-4" />
                        Accept Request
                      </>
                    )}
                  </Button>
                )}
                
                {selectedRequest.status === 'accepted' && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto" 
                    disabled={isLoading}
                    onClick={() => handleCompleteRequest(selectedRequest._id)}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Completed
                      </>
                    )}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowRequestDetail(false)}
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResponderDashboard;