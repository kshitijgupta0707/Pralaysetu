import React, { useEffect, useState } from 'react';
import {
  MapPin, Clock, AlertCircle, CheckCircle, Loader2, User,
  Calendar, Navigation, BarChart4, List, Filter, Map, LogOut, Menu, X
} from 'lucide-react';
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
  const [activeLocationCoords, setActiveLocationCoords] = useState(null);

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
        setActiveLocationCoords(null);
        setShowRequestDetail(false);
        setSelectedTab('completed');
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error completing request:", error);
        setIsLoading(false);
      });
  };

  // Handle navigation to map
  // Handle navigation to map
  const handleNavigateToMap = (latitude, longitude) => {
    // Save coordinates to state
    setActiveLocationCoords({ latitude, longitude });
    // Navigate to map view with state
    navigate('/responder/map', { state: { latitude, longitude } });
  };
  // Filter requests based on selected tab and filters
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
        return { color: 'bg-gray-500 text-white', icon: <AlertCircle size={16} /> };
      case 'verified':
        return { color: 'bg-blue-500 text-white', icon: <CheckCircle size={16} /> };
      case 'accepted':
        return { color: 'bg-orange-500 text-white', icon: <Loader2 size={16} /> };
      case 'completed':
        return { color: 'bg-green-500 text-white', icon: <CheckCircle size={16} /> };
      case 'rejected':
        return { color: 'bg-red-500 text-white', icon: <AlertCircle size={16} /> };
      default:
        return { color: 'bg-gray-500 text-white', icon: <AlertCircle size={16} /> };
    }
  };

  const filteredRequests = getFilteredRequests();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md rounded-full"
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-40 transition duration-200 ease-in-out lg:static lg:inset-0 bg-white shadow-lg w-64 flex flex-col`}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 bg-primary text-white">
              <AvatarFallback>PS</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">PralaySetu</h1>
              <p className="text-sm text-gray-500">Responder Portal</p>
            </div>
          </div>
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
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            <Link to="/responder-dashboard" className="flex items-center space-x-3 p-2 rounded-lg bg-gray-100 text-primary font-medium">
              <List size={20} />
              <span>Help Requests</span>
            </Link>
            <Link to="/responder/map" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <Map size={20} />
              <span>Map View</span>
            </Link>
            <Link to="/responder/statistics" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <BarChart4 size={20} />
              <span>Statistics</span>
            </Link>
            <Link to="/responder/profile" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <User size={20} />
              <span>Profile</span>
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* Close button for mobile menu */}
        <div className="lg:hidden p-4 border-t">
          <Button variant="ghost" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
            Close Menu
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
              Help Requests Dashboard
            </h1>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
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
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="mb-6 bg-white p-1 shadow-sm">
              <TabsTrigger value="pending" className="flex items-center space-x-2">
                <AlertCircle size={16} />
                <span>Pending Requests</span>
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center space-x-2">
                <Loader2 size={16} />
                <span>Active Missions</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center space-x-2">
                <CheckCircle size={16} />
                <span>Completed Missions</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              {filteredRequests.length === 0 ? (
                <Card className="border-dashed border-2">
                  <CardContent className="flex flex-col items-center justify-center text-center py-12">
                    <AlertCircle size={48} className="text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      No requests found
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      {selectedTab === 'pending' ? "There are no pending requests at the moment." :
                        selectedTab === 'active' ? "You have no active missions currently." :
                          "You haven't completed any missions yet."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRequests.map((request) => (
                    <Card
                      key={request._id}
                      className="hover:shadow-md transition-shadow cursor-pointer border-l-4"
                      style={{
                        borderLeftColor: request.urgency === 'critical' ? '#ef4444' :
                          request.urgency === 'high' ? '#f97316' :
                            request.urgency === 'medium' ? '#eab308' : '#3b82f6'
                      }}
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowRequestDetail(true);
                      }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center text-gray-500 text-sm">
                            <MapPin size={16} className="mr-1" />
                            {request.latitude || "Location"},
                            {request.longitude}
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock size={16} className="mr-1" />
                            {formatDate(request.createdAt)}
                          </div>
                        </div>
                        <Badge className={`mt-2 ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency?.charAt(0).toUpperCase() + request.urgency?.slice(1) || "Unknown"}
                        </Badge>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-gray-700 font-medium line-clamp-2">
                          {request.reason || "No description provided"}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center pt-0">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="bg-primary text-white text-xs">
                              {request.user?.firstName?.charAt(0) || "U"}{request.user?.lastName?.charAt(0) || ""}
                            </AvatarFallback>
                          </Avatar>
                          {request.user?.firstName || "User"} {request.user?.lastName || ""}
                        </div>
                        <Badge variant="outline" className={`flex items-center ${getStatusBadge(request.status).color}`}>
                          {getStatusBadge(request.status).icon}
                          <span className="ml-1">{request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || "Unknown"}</span>
                        </Badge>
                      </CardFooter>
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
                  <div>
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
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Status
                    </h3>
                    <Alert className={getStatusBadge(selectedRequest.status).color}>
                      <div className="flex items-center mb-2">
                        {selectedRequest.status === 'pending' && <AlertCircle className="mr-2" size={20} />}
                        {selectedRequest.status === 'verified' && <CheckCircle className="mr-2" size={20} />}
                        {selectedRequest.status === 'accepted' && <Loader2 className="mr-2 animate-spin" size={20} />}
                        {selectedRequest.status === 'completed' && <CheckCircle className="mr-2" size={20} />}
                      </div>
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
                    className="w-full sm:w-auto bg-primary"
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
                    onClick={() => handleNavigateToMap(selectedRequest.latitude, selectedRequest.longitude)}
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