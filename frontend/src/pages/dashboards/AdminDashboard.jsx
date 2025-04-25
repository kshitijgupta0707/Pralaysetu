import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, FileText, Users, Search, Filter, X, Check, MapPin, User, Menu } from 'lucide-react';
// ui components
import { Button, Input, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Avatar, AvatarFallback, AvatarImage, Popover, PopoverContent, PopoverTrigger, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, }
  from '@/components/ui-kit';

//store
import { useAdminStore } from '@/store/useAdminStore';
import { useReportStore } from '@/store/useReportStore';
import { useHelpStore } from '@/store/useHelpStore';
import { useAuthStore } from '@/store/useAuthstore';
import { useNotificationStore } from "../../store/useNotificationStore";


const AdminDashboard = () => {
  const { socket } = useAuthStore()
  const [activeTab, setActiveTab] = useState('reports');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [showSidebar, setShowSidebar] = useState(false);
  const [confirmAssignmentId, setConfirmAssignmentId] = useState(null);
  const {
    pendingUsers,
    responders,
    verifiedEntities,
    loading,
    fetchPendingUsers,
    approveUser,
    rejectUser,
    fetchAllResponders,
    fetchAllVerifiedEntities
  } = useAdminStore();
  // Add this to extract methods from reportStore
  const {
    reports,
    // verifiedReports, 
    isFetchingReports,
    getAllReports,
    verifyReport,
    addNewReport

    // real time functions 
  } = useReportStore();

  const {
    loading: helpLoading,
    requests: helpRequests,
    fetchHelpRequests,
    verifyOrRejectRequest,
    assignHelpRequest,
    addNewRequest

  } = useHelpStore();
  const [selectedResponderForAssignment, setSelectedResponderForAssignment] = useState(null);
  // Extract data and functions from adminStore


  useEffect(() => {
    if (!socket) return;
    socket.on("newHelpRequest", (newRequest) => {
      addNewRequest(newRequest);
      useNotificationStore.getState().showNotification(
        "New Help Request",
        `From ${newRequest.user?.firstName + " " + newRequest.user?.lastName} --> ${newRequest.reason.slice(0, 30)}`,
        'request'
      );
    });
    socket.on("newDisasterReport", (newReport) => {
      addNewReport(newReport);
      useNotificationStore.getState().showNotification(
        "New Disaster Report",
        `Reported disaster: ${newReport.disasterType
        }`,
        'report'
      );
    });

    return () => {
      socket.off("newHelpRequest");
      socket.off("newDisasterReport");
    };
  }, [socket, addNewRequest, addNewReport]);

  useEffect(() => {
    // Fetch data from store
    fetchPendingUsers();
    fetchAllResponders();
    fetchAllVerifiedEntities();
    getAllReports();
    fetchHelpRequests();
  }, [fetchPendingUsers, fetchAllResponders, fetchAllVerifiedEntities, getAllReports, fetchHelpRequests]);
  // Set the loading state based on the store
  useEffect(() => {
    setIsLoading(isFetchingReports);
    setIsLoading(helpLoading);
  }, [isFetchingReports, helpLoading])

  const handleStatusChange = (status) => {
    setFilterStatus(status);
    // console.log(`Status filtered to: ${status}`);
  };

  const handleVerifyReport = (id) => {
    verifyReport(id, 'verified');
  };

  const handleRejectReport = (id) => {
    verifyReport(id, 'rejected');
  };
  const handleVerifyHelpRequest = (id) => {
    verifyOrRejectRequest(id, 'verified');
  };

  const handleRejectHelpRequest = (id) => {
    verifyOrRejectRequest(id, 'rejected');
  };

  const handleApproveRegistration = async (id) => {
    try {
      await approveUser(id);
      // Refresh data after approval
      // fetchPendingUsers();
      // fetchAllVerifiedEntities();
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleRejectRegistration = async (id) => {
    try {
      await rejectUser(id);
      // Refresh pending users after rejection
      // fetchPendingUsers();
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };



  const filteredReports = reports.filter(report => {
    const matchesSearch =
      (report.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.disasterType?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' ? true : report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });


  const filteredHelpRequests = helpRequests.filter(request => {
    request.urgency?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.user && (request.user.firstName + " " + request.user.lastName).toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' ? true : request.status === filterStatus;
    return matchesStatus;
  });
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="outline" className="bg-blue-300 text-blue-800 border-blue-300">Accepted</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'verified':
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Assigned</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 relative ">


      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0    bg-opacity-50  backdrop-blur-xs  z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      <div
        className={`${showSidebar ? 'fixed' : 'hidden'} lg:flex lg:static inset-y-0 z-50 w-64 bg-white shadow-lg transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
  lg:translate-x-0 transition-transform duration-300 ease-in-out 
   overflow-hidden lg:absolute top-0`}
      >
        <div className="h-full flex flex-col lg:overflow-hidden overflow-y-auto w-full">

          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 border-1 border-blue-600 text-black">
                <AvatarFallback>PS</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">PralaySetu</h1>
                <p className="text-sm text-gray-600">Admin Portal</p>
              </div>
            </div>
          </div>

          <nav className="p-2 flex-1 lg:h-[calc(100%-64px)]">
            <ul className="space-y-1">
              <li>
                <Button
                  variant={activeTab === 'reports' ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab('reports');
                    setShowSidebar(false);
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Reports
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === 'help' ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab('help');
                    setShowSidebar(false);
                  }}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Help Requests
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === 'responders' ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab('responders');
                    setShowSidebar(false);
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Responders
                </Button>
              </li>

            </ul>
          </nav>
        </div>

        {showSidebar && (
          <div className="lg:hidden fixed top-2 left-52 -right-6 z-50">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSidebar(false)}
              className="rounded-full shadow-md bg-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>


      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowSidebar(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold truncate">
              {activeTab === 'reports' ? 'Disaster Reports' :
                activeTab === 'help' ? 'Help Requests' :
                  activeTab === 'responders' ? 'Responders' : 'Settings'}
            </h1>
          </div>
        </header>

        {/* Content Area with Scroll */}
        <main className="p-3 md:p-6 overflow-auto flex-1">
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {/* Filter and Search - Responsive */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ml-8 mr-8">
                <div className="w-full sm:w-auto relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search reports..."
                    className="pl-8 w-full sm:w-64  "
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0 items-center justify-center text-xs-mobile  ">
                  <button
                    className={`px-3 py-1 rounded-md border text-sm ${filterStatus === 'all'
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    onClick={() => handleStatusChange('all')}
                  >
                    All
                  </button>

                  <button
                    className={`px-3 py-1 rounded-md border text-sm ${filterStatus === 'pending'
                      ? 'bg-yellow-500 text-white border-yellow-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    onClick={() => handleStatusChange('pending')}
                  >
                    Pending
                  </button>

                  <button
                    className={`px-3 py-1 rounded-md border text-sm ${filterStatus === 'verified'
                      ? 'bg-green-500 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    onClick={() => handleStatusChange('verified')}
                  >
                    Verified
                  </button>

                  <button
                    className={`px-3 py-1 rounded-md border text-sm ${filterStatus === 'rejected'
                      ? 'bg-red-500 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    onClick={() => handleStatusChange('rejected')}
                  >
                    Rejected
                  </button>
                </div>
              </div>

              {/* Reports Grid - Responsive */}
              {isLoading ? (
                <div className="flex justify-center p-8 ">
                  <p>Loading reports...</p>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg border">
                  <p className="text-gray-500">No reports match your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredReports.map(report => (
                    <Card key={report._id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center flex-wrap gap-1">
                              <Badge className="mr-2">{report.disasterType}</Badge>
                              {getStatusBadge(report.status)}
                            </CardTitle>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(report.createdAt)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <img
                          src={report.imageUrl}
                          alt={report.disasterType}
                          className="w-full h-40 object-cover rounded-md mb-2"
                        />
                        <p className="text-sm">{report.description}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">Lat: {report.latitude?.toFixed(4)}, Long: {report.longitude?.toFixed(4)}</span>
                        </div>
                      </CardContent>
                      {report.status === 'pending' && (
                        <CardFooter className="flex justify-between pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500 text-green-500 hover:bg-green-50"
                            onClick={() => handleVerifyReport(report._id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => handleRejectReport(report._id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-4">
              {/* Filter and Search - Responsive */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="w-full sm:w-auto relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search help requests..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Help Requests - Responsive Grid */}
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <p>Loading help requests...</p>
                </div>
              ) : filteredHelpRequests.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg border">
                  <p className="text-gray-500">No help requests match your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredHelpRequests.map(request => (
                    <Card key={request._id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center flex-wrap gap-1">
                              <Badge className={`${getUrgencyColor(request.urgency)} text-white`}>
                                {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
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
                        <p className="text-sm">{request.reason}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            Lat: {request.latitude?.toFixed(4)}, Long: {request.longitude?.toFixed(4)}
                          </span>
                        </div>
                        {request.status === 'assigned' && (
                          <div className="flex items-center text-xs text-blue-500 mt-1">
                            <User className="h-3 w-3 mr-1" />
                            <span>Assigned to: {request.assignedTo.firstName + " " + request.assignedTo.lastName}</span>
                          </div>
                        )}
                      </CardContent>
                      {request.status === 'pending' && (
                        <CardFooter className="flex justify-between pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500 text-green-500 hover:bg-green-50"
                            onClick={() => handleVerifyHelpRequest(request._id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => handleRejectHelpRequest(request._id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </CardFooter>
                      )}
                      {request.status === 'verified' && (
                        <CardFooter className="flex-col space-y-2 pt-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full">
                                <User className="h-4 w-4 mr-2" />
                                Assign to responder
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 max-h-60 overflow-y-auto">
                              <div className="py-2">
                                {responders.length === 0 ? (
                                  <div className="px-4 py-2 text-sm text-gray-500">No available responders</div>
                                ) : (
                                  responders
                                    .map(responder => (
                                      <button
                                        key={responder._id}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                                        onClick={() => {
                                          setSelectedResponderForAssignment(responder);
                                          setConfirmAssignmentId(request._id);
                                        }}
                                      >
                                        <Avatar className="h-6 w-6 mr-2">
                                          <AvatarFallback>{responder.firstName?.charAt(0) || 'R'}</AvatarFallback>
                                        </Avatar>
                                        <span>{responder.firstName + " " + responder.lastName}</span>
                                        {/* <span>{"     " + responder.email}</span> */}
                                      </button>
                                    ))
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'responders' && (
            <div className="space-y-6">
              <Tabs defaultValue="active" className="w-full">
                <div className="overflow-x-auto">
                  <TabsList className="mb-2">
                    <TabsTrigger value="active">Active Responders</TabsTrigger>
                    <TabsTrigger value="responders">Responders</TabsTrigger>
                    <TabsTrigger value="pending">Pending Registrations</TabsTrigger>
                    <TabsTrigger value="entities">Registered Entities</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="active" className="mt-4">
                  <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b">
                      <h2 className="text-lg font-semibold">Registered Responders</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {responders.map(responder => (
                            <tr key={responder._id} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-3">{responder.firstName}</td>
                              <td className="px-4 py-3">{responder.registerAs == "None" ? "User" : responder.registerAs}</td>
                              <td className="px-4 py-3">
                                <Badge variant={responder.Verified === 'available' ? 'outline' : 'secondary'}>
                                  {responder.registerAs}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pending" className="mt-4">
                  <div className="space-y-4">
                    {pendingUsers.map(registration => (
                      <Card key={registration._id}>
                        <CardHeader>
                          <CardTitle>{registration.registerAs}</CardTitle>
                          <CardDescription className="text-sm">
                            <span className="font-semibold">Type:</span> {registration.type} |
                            <span className="font-semibold ml-2">Applied on:</span> {formatDate(registration.createdAt)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm font-medium">Contact Person:</span>
                                <p>{registration.firstName + " " + registration.lastName}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium">Email:</span>
                                <p className="break-words">{registration.email}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium">Phone:</span>
                                <p>{"95555XXXX8"}</p>
                              </div>

                              {/* NGO Specific Details */}
                              {registration.registerAs === 'NGO' && (
                                <div >

                                  <div className="mt-4 pt-3 border-t">
                                    <span className="text-sm font-medium text-blue-600">NGO Details</span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">NGO Name:</span>
                                    <p>{registration.ngoId?.name}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">NGO Phone:</span>
                                    <p>{registration.ngoId?.phone}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">NGO Address:</span>
                                    <p className="text-sm">{registration.ngoId?.address}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            {/* Description section for NGO */}
                            {registration.registerAs === 'NGO' && (
                              <div className="space-y-2 mb-4">
                                <span className="text-sm font-medium">NGO Description:</span>
                                <p className="text-sm bg-gray-50 p-3 rounded border">{registration.ngoId?.description}</p>
                              </div>
                            )}

                            <div className="space-y-2">
                              <div>
                                <span className="text-sm font-medium">ID Proof:</span>
                                <div className="mt-1">
                                  <img
                                    src={registration.governmentDocument}
                                    alt="ID Proof"
                                    className="w-full max-w-xs rounded border"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                          <Button
                            variant="outline"
                            className="border-green-500 text-green-500 hover:bg-green-50 w-full sm:w-auto"
                            onClick={() => handleApproveRegistration(registration._id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50 w-full sm:w-auto"
                            onClick={() => handleRejectRegistration(registration._id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}

                    {pendingUsers.length === 0 && (
                      <div className="text-center p-8 bg-white rounded-lg border">
                        <p className="text-gray-500">No pending registration requests</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="responders">
                  {loading ? (
                    <div className="text-center py-10">Loading responders...</div>
                  ) : responders.length === 0 ? (
                    <div className="text-center py-10">No responders found.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {responders.map(responder => (
                        <div key={responder._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={responder.profilePic || "/placeholder-user.jpg"}
                              alt={`${responder.firstName} ${responder.lastName}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="overflow-hidden">
                              <h3 className="font-semibold truncate">
                                {responder.firstName} {responder.lastName}
                              </h3>
                              <p className="text-sm text-gray-600 truncate">{responder.email}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 mb-2 flex-wrap">
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                              {responder.registerAs || "Responder"}
                            </Badge>
                          </div>

                          <div className="mt-3 flex justify-end">
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="entities">
                  {loading ? (
                    <div className="text-center py-10">Loading verified entities...</div>
                  ) : verifiedEntities.length === 0 ? (
                    <div className="text-center py-10">No verified entities found.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {verifiedEntities.map(entity => (
                        <div key={entity._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={entity.profilePic || "/placeholder-user.jpg"}
                              alt={`${entity.firstName} ${entity.lastName}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="overflow-hidden">
                              <h3 className="font-semibold truncate">
                                {entity.firstName} {entity.lastName}
                              </h3>
                              <p className="text-sm text-gray-600 truncate">{entity.email}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 mb-2 flex-wrap">
                            <Badge variant="outline" className={`${entity.registerAs === 'Government'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : 'bg-green-100 text-green-800 border-green-200'
                              }`}>
                              {entity.registerAs}
                            </Badge>
                            {entity.workAsResponder && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                Responder
                              </Badge>
                            )}
                          </div>

                          <div className="mt-3 flex justify-end">
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
      </div>



      {/* Confirmation Alert Dialog */}
      <AlertDialog open={confirmAssignmentId !== null} onOpenChange={() => setConfirmAssignmentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Assignment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to assign this help request to {selectedResponderForAssignment?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (confirmAssignmentId && selectedResponderForAssignment) {
                console.log("i am caleed at alert dialog action")
                assignHelpRequest(confirmAssignmentId, selectedResponderForAssignment._id);
                setConfirmAssignmentId(null);
                setSelectedResponderForAssignment(null);
              }
            }}>
              Confirm Assignment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

export default AdminDashboard;