import React, { useEffect, useState } from 'react';
import {
  MapPin, Clock, AlertCircle, CheckCircle, Loader2, User,
  Calendar, Navigation, BarChart4, List, Filter, Map, LogOut, Menu, X, FileText, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import { useHelpStore } from '@/store/useHelpStore';
import { useAuthStore } from '@/store/useAuthstore';

const ResponderDashboard = () => {
  const { requestsAssigned, acceptHelpRequest, getAllHelpRequest, completeHelpRequest } = useHelpStore();
  const [selectedTab, setSelectedTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestDetail, setShowRequestDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [userLocation, setUserLocation] = useState({ lat: 28.630151, lng: 77.371149 });
  
  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("Got user location:", newLocation);
          setUserLocation(newLocation);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error fetching user location:', error);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }
  }, []);
  
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all help requests when component mounts
    getAllHelpRequest();
  }, [getAllHelpRequest]);

  // Check if responder has any active missions
  const hasActiveMission = requestsAssigned.some(req =>
    req.status === 'accepted' && req.assignedTo?._id === authUser?._id
  );

  // Handle accepting a request
  const handleAcceptRequest = (requestId) => {
    // Prevent accepting new requests if responder already has an active mission
    if (hasActiveMission) {
      alert("You already have an active mission. Please complete it before accepting a new one.");
      return;
    }

    setIsLoading(true);
    acceptHelpRequest(requestId)
      .then(() => {
        // Update local state immediately without waiting for a refetch
        const updatedRequests = requestsAssigned.map(req =>
          req._id === requestId
            ? {
              ...req,
              status: 'accepted',
            }
            : req
        );

        // Update the store or state directly - depending on how your Zustand store is set up
        // This is the critical part that's likely missing in your code
        useHelpStore.setState({ requestsAssigned: updatedRequests });

        setShowRequestDetail(false);
        setSelectedTab('active');
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error accepting request:", error);
        setIsLoading(false);
      });
  };

  // Handle completing a request
  const handleCompleteRequest = (requestId) => {
    setIsLoading(true);
    completeHelpRequest(requestId)
      .then(() => {
        // Update local state immediately
        const updatedRequests = requestsAssigned.map(req =>
          req._id === requestId
            ? {
              ...req,
              status: 'completed',
              completedAt: new Date().toISOString()
            }
            : req
        );

        // Update the store directly
        useHelpStore.setState({ requestsAssigned: updatedRequests });

        // Clear active location coordinates
        setShowRequestDetail(false);
        setSelectedTab('completed');
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error completing request:", error);
        setIsLoading(false);
      });
  };

  const getFilteredRequests = () => {
    // First filter by tab selection
    let filteredRequests = requestsAssigned.filter(req => {
      if (selectedTab === 'pending') return ['assigned'].includes(req.status);
      if (selectedTab === 'active') return req.status === 'accepted';
      if (selectedTab === 'completed') return req.status === 'completed';
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

    // Apply search filter if there's a search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filteredRequests = filteredRequests.filter(req => 
        (req.reason && req.reason.toLowerCase().includes(query)) ||
        (req.user?.firstName && req.user.firstName.toLowerCase().includes(query)) ||
        (req.user?.lastName && req.user.lastName.toLowerCase().includes(query))
      );
    }

    return filteredRequests;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Date unavailable";

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
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Get status badge properties
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'verified':
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-blue-300 text-blue-800 border-blue-300">Accepted</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Completed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Assigned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredRequests = getFilteredRequests();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`${isMobileMenuOpen ? 'fixed' : 'hidden'} lg:flex lg:static inset-y-0 z-50 lg:z-30  w-64 bg-white shadow-lg transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out 
        overflow-hidden lg:absolute top-0`}>
        <div className="h-full flex flex-col lg:overflow-hidden overflow-y-auto w-full">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 bg-primary text-black border-1 border-blue-800">
                <AvatarFallback>PS</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-blue-800">PralaySetu</h2>
                <p className="text-sm text-gray-500">Responder Portal</p>
              </div>
            </div>
            {/* <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </Button> */}
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-white">
                  {authUser?.firstName?.charAt(0) || "R"}{authUser?.lastName?.charAt(0) || "S"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium">
                  {authUser?.firstName || "Responder"} {authUser?.lastName || "Name"}
                </h2>
                <p className="text-sm text-gray-500">
                  {authUser?.team || "NDRF Team"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-gray-100 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500 mb-1">
                  Missions
                </p>
                <p className="font-bold">{authUser?.completedMissions || 0}</p>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500 mb-1">
                  Status
                </p>
                <p className="font-bold text-green-500">Active</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 flex-1 overflow-y-auto">
            <ul className="space-y-1">
              <li>
                <Button 
                  variant="ghost"
                  className="w-full justify-start bg-gray-100 text-blue-800 font-medium"
                >
                  <List size={20} className="mr-2" />
                  <span>Help Requests</span>
                </Button>
              </li>
            </ul>
          </nav>

        
        </div>

        {/* Close button for mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed top-2 left-52 -right-6 z-50">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-full shadow-md bg-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold truncate">
              Help Requests Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>
                {authUser?.firstName?.charAt(0) || "R"}{authUser?.lastName?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content Area with Scroll */}
        <main className="p-3 md:p-6 overflow-auto flex-1">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full mr-2">
            <TabsList className="mb-6  p-1 shadow-sm flex sm:gap-5 md:gap-3 lg:gap-5 flex-wrap sm:m-auto lg:mb-6 lg:mt-0 lg:ml-0">
              <TabsTrigger value="pending" className="flex items-center space-x-2 bg-[#FBFBFB] m-1">
                <AlertCircle size={16} />
                <span  className=' ' >Pending Requests</span>
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center space-x-2 bg-[#FBFBFB] m-1">
                <Loader2 size={16} />
                <span>Active Missions</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center space-x-2 bg-[#FBFBFB] m-1">
                <CheckCircle size={16} />
                <span>Completed Missions</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <div className="w-full sm:w-auto relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search requests..."
                  className="pl-8 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger className="w-full sm:w-40">
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
                  <SelectTrigger className="w-full sm:w-40">
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

            <TabsContent value={selectedTab} className="mt-0">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <p>Loading requests...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg border">
                  <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {selectedTab === 'pending' ? "There are no pending requests at the moment." :
                      selectedTab === 'active' ? "You have no active missions currently." :
                        "You haven't completed any missions yet."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRequests.map((request) => (
                    <Card
                      key={request._id}
                      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowRequestDetail(true);
                      }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center flex-wrap gap-1">
                              <Badge className={getUrgencyColor(request.urgency)}>
                                {request.urgency?.charAt(0).toUpperCase() + request.urgency?.slice(1) || "Unknown"}
                              </Badge>
                              {getStatusBadge(request.status)}
                            </CardTitle>
                            <CardDescription className="pt-1">
                              From {request.user?.firstName + " " + request.user?.lastName || "Unknown User"}
                            </CardDescription>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(request.createdAt)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        {request.photo && (
                          <img
                            src={request.photo}
                            alt="Help request"
                            className="w-full h-40 object-cover rounded-md mb-2"
                          />
                        )}
                        <p className="text-sm line-clamp-2">
                          {request.reason || "No description provided"}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            Lat: {request.latitude?.toFixed(4)}, Long: {request.longitude?.toFixed(4)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Request detail dialog */}
      <Dialog open={showRequestDetail} onOpenChange={setShowRequestDetail}>
        <DialogContent className="sm:max-w-lg">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <Badge className={getUrgencyColor(selectedRequest.urgency)}>
                    {selectedRequest.urgency?.charAt(0).toUpperCase() + selectedRequest.urgency?.slice(1) || "Unknown"} Request
                  </Badge>
                  <span className="text-sm text-gray-500 font-normal">
                    Submitted on {formatDate(selectedRequest.createdAt)}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="mt-4 max-h-[60vh]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Request Details
                    </h3>
                    <p className="text-gray-700">
                      {selectedRequest.reason || "No description provided"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Location
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex items-center">
                        <MapPin className="text-primary mr-2" size={20} />
                        <div className="text-sm">
                          <p>
                            Coordinates: {selectedRequest.latitude || "N/A"}, {selectedRequest.longitude || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Requester Information
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-primary text-white">
                            {selectedRequest.user?.firstName?.charAt(0) || "U"}{selectedRequest.user?.lastName?.charAt(0) || ""}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {selectedRequest.user?.firstName || "User"} {selectedRequest.user?.lastName || ""}
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedRequest.user?.phoneNumber || "Phone not available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mt-6">
                {selectedRequest.photo &&<div>
                    <h3 className="text-lg font-medium mb-2">
                      Situation Photo
                    </h3>
                    <div className="bg-gray-50 rounded-lg border h-40 flex items-center justify-center">
                      {selectedRequest.photo ? (
                        <img src={selectedRequest.photo} alt="Situation" className="max-h-full object-contain" />
                      ) : (
                        <div className="text-gray-500 text-center p-4">
                          No photo available
                        </div>
                      )}
                    </div>
                  </div>}

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Status
                    </h3>
                    <Alert className={selectedRequest.status === 'accepted' ? "bg-blue-100 border-blue-300" : 
                                      selectedRequest.status === 'completed' ? "bg-purple-100 border-purple-300" : 
                                      "bg-gray-100 border-gray-300"}>
                      <AlertTitle>
                        {selectedRequest.status?.charAt(0).toUpperCase() + selectedRequest.status?.slice(1) || "Unknown"}
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
              </ScrollArea>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {/* Show accept button only for pending/verified requests */}
                {['assigned'].includes(selectedRequest.status) && (
                  <Button
                    disabled={hasActiveMission || isLoading}
                    className="w-full sm:w-auto border-green-500 bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleAcceptRequest(selectedRequest._id)}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept Request
                      </>
                    )}
                  </Button>
                )}
               
                {/* Show navigate button for accepted requests */}
                {selectedRequest.status === 'accepted' && selectedRequest.assignedTo?._id === authUser?._id && (
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      const { lat, lng } = userLocation;
                      const destinationLat = selectedRequest.latitude;
                      const destinationLng = selectedRequest.longitude;
  
                      // Open Google Maps with the directions from user's location to the place's location
                      window.open(`https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${destinationLat},${destinationLng}&travelmode=driving`, '_blank');
                    }}

                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Navigate
                  </Button>
                )}

                {/* Show complete button only for accepted requests assigned to current user */}
                {selectedRequest.status === 'accepted' && selectedRequest.assignedTo?._id === authUser?._id && (
                  <Button
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
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
                  variant="ghost"
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