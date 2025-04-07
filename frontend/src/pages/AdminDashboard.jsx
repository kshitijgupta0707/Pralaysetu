import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, FileText, Users, Settings, LogOut, Search, Filter, X, Check, MapPin, Clock, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [responders, setResponders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedResponder, setSelectedResponder] = useState('');
  const [showBroadcastDialog, setShowBroadcastDialog] = useState(false);
  const [broadcastType, setBroadcastType] = useState('alert');
  const [broadcastRegion, setBroadcastRegion] = useState('all');
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  
  useEffect(() => {
    // Simulate API calls
    fetchReports();
    fetchHelpRequests();
    fetchResponders();
    fetchPendingRegistrations();
  }, []);
  
  const fetchReports = () => {
    setIsLoading(true);
    // Simulated API call
    setTimeout(() => {
      const mockReports = [
        {
          _id: 'rep1',
          user: { _id: 'user1', name: 'Rahul Sharma', email: 'rahul@example.com', photo: '/placeholder-user.jpg' },
          disasterType: 'Flood',
          description: 'Water level rising rapidly near Ganges river, multiple houses affected in the area.',
          imageUrl: '/api/placeholder/400/300',
          location: { latitude: 25.3176, longitude: 82.9739 },
          status: 'pending',
          createdAt: '2025-04-06T10:30:00Z'
        },
        {
          _id: 'rep2',
          user: { _id: 'user2', name: 'Priya Singh', email: 'priya@example.com', photo: '/placeholder-user.jpg' },
          disasterType: 'Fire',
          description: 'Fire spotted in the industrial area, smoke rising from chemical factory.',
          imageUrl: '/api/placeholder/400/300',
          location: { latitude: 28.7041, longitude: 77.1025 },
          status: 'pending',
          createdAt: '2025-04-06T09:15:00Z'
        },
        {
          _id: 'rep3',
          user: { _id: 'user3', name: 'Ankit Patel', email: 'ankit@example.com', photo: '/placeholder-user.jpg' },
          disasterType: 'Landslide',
          description: 'Mountain road blocked by fallen rocks after heavy rainfall. Route to Shimla affected.',
          imageUrl: '/api/placeholder/400/300',
          location: { latitude: 31.1048, longitude: 77.1734 },
          status: 'verified',
          createdAt: '2025-04-05T15:45:00Z'
        },
        {
          _id: 'rep4',
          user: { _id: 'user4', name: 'Meena Kumari', email: 'meena@example.com', photo: '/placeholder-user.jpg' },
          disasterType: 'Earthquake',
          description: 'Mild tremors felt in southern region, no visible damage but people evacuated buildings.',
          imageUrl: '/api/placeholder/400/300',
          location: { latitude: 13.0827, longitude: 80.2707 },
          status: 'rejected',
          createdAt: '2025-04-04T18:20:00Z'
        }
      ];
      setReports(mockReports);
      setIsLoading(false);
    }, 1000);
  };
  
  const fetchHelpRequests = () => {
    setIsLoading(true);
    // Simulated API call
    setTimeout(() => {
      const mockHelpRequests = [
        {
          _id: 'help1',
          user: { _id: 'user5', name: 'Vikram Rathore', email: 'vikram@example.com', photo: '/placeholder-user.jpg' },
          location: { lat: 19.0760, lng: 72.8777 },
          reason: 'Trapped in building due to flooding, water level rising, need immediate evacuation.',
          urgency: 'critical',
          photo: '/api/placeholder/400/300',
          status: 'pending',
          createdAt: '2025-04-07T08:10:00Z'
        },
        {
          _id: 'help2',
          user: { _id: 'user6', name: 'Deepa Mehta', email: 'deepa@example.com', photo: '/placeholder-user.jpg' },
          location: { lat: 22.5726, lng: 88.3639 },
          reason: 'Medical supplies needed for community shelter, multiple children with fever.',
          urgency: 'high',
          photo: '/api/placeholder/400/300',
          status: 'verified',
          createdAt: '2025-04-06T14:30:00Z'
        },
        {
          _id: 'help3',
          user: { _id: 'user7', name: 'Suresh Kumar', email: 'suresh@example.com', photo: '/placeholder-user.jpg' },
          location: { lat: 17.3850, lng: 78.4867 },
          reason: 'Elderly parents stranded, need food and water, area inaccessible by road.',
          urgency: 'high',
          photo: '/api/placeholder/400/300',
          status: 'assigned',
          assignedTo: { _id: 'resp2', name: 'NDRF Team B' },
          createdAt: '2025-04-05T11:45:00Z'
        },
        {
          _id: 'help4',
          user: { _id: 'user8', name: 'Arjun Nair', email: 'arjun@example.com', photo: '/placeholder-user.jpg' },
          location: { lat: 12.9716, lng: 77.5946 },
          reason: 'Roof collapsed, family of 5 needs temporary shelter urgently.',
          urgency: 'medium',
          photo: '/api/placeholder/400/300',
          status: 'completed',
          assignedTo: { _id: 'resp1', name: 'NDRF Team A' },
          createdAt: '2025-04-04T09:20:00Z'
        }
      ];
      setHelpRequests(mockHelpRequests);
      setIsLoading(false);
    }, 1000);
  };
  
  const fetchResponders = () => {
    // Simulated API call
    setTimeout(() => {
      const mockResponders = [
        { _id: 'resp1', name: 'NDRF Team A', type: 'Government', status: 'available' },
        { _id: 'resp2', name: 'NDRF Team B', type: 'Government', status: 'assigned' },
        { _id: 'resp3', name: 'State Fire Department', type: 'Government', status: 'available' },
        { _id: 'resp4', name: 'Medical Response Unit', type: 'Government', status: 'available' },
        { _id: 'resp5', name: 'Red Cross Volunteers', type: 'NGO', status: 'available' }
      ];
      setResponders(mockResponders);
    }, 1200);
  };
  
  const fetchPendingRegistrations = () => {
    // Simulated API call
    setTimeout(() => {
      const mockPendingRegistrations = [
        { 
          _id: 'reg1', 
          name: 'Delhi Fire Services', 
          type: 'Government', 
          email: 'dfs-admin@delhi.gov.in',
          contactPerson: 'Rajesh Mishra',
          phone: '+91-9876543210',
          idProof: '/api/placeholder/400/300',
          createdAt: '2025-04-06T15:20:00Z'
        },
        { 
          _id: 'reg2', 
          name: 'Maharashtra SDRF Team C', 
          type: 'Government', 
          email: 'sdrf-c@maharashtra.gov.in',
          contactPerson: 'Priyanka Deshmukh',
          phone: '+91-9876123450',
          idProof: '/api/placeholder/400/300',
          createdAt: '2025-04-05T11:15:00Z'
        },
        { 
          _id: 'reg3', 
          name: 'Goonj Relief NGO', 
          type: 'NGO', 
          email: 'operations@goonj.org',
          contactPerson: 'Amit Singh',
          phone: '+91-9856743210',
          idProof: '/api/placeholder/400/300',
          createdAt: '2025-04-07T09:30:00Z'
        }
      ];
      setPendingRegistrations(mockPendingRegistrations);
    }, 1500);
  };
  
  const handleVerifyReport = (id) => {
    setReports(reports.map(report => 
      report._id === id ? {...report, status: 'verified'} : report
    ));
  };
  
  const handleRejectReport = (id) => {
    setReports(reports.map(report => 
      report._id === id ? {...report, status: 'rejected'} : report
    ));
  };
  
  const handleVerifyHelpRequest = (id) => {
    setHelpRequests(helpRequests.map(request => 
      request._id === id ? {...request, status: 'verified'} : request
    ));
  };
  
  const handleRejectHelpRequest = (id) => {
    setHelpRequests(helpRequests.map(request => 
      request._id === id ? {...request, status: 'rejected'} : request
    ));
  };
  
  const handleAssignHelpRequest = (id) => {
    if (!selectedResponder) return;
    
    const responder = responders.find(r => r._id === selectedResponder);
    setHelpRequests(helpRequests.map(request => 
      request._id === id ? {
        ...request, 
        status: 'assigned',
        assignedTo: { _id: responder._id, name: responder.name }
      } : request
    ));
    setSelectedResponder('');
  };
  
  const handleApproveResponder = (id) => {
    setPendingRegistrations(pendingRegistrations.filter(reg => reg._id !== id));
    // Here you would typically make an API call to approve the responder
    // and then update the responders list
    
    const approved = pendingRegistrations.find(reg => reg._id === id);
    if (approved) {
      setResponders([...responders, {
        _id: approved._id,
        name: approved.name,
        type: approved.type,
        status: 'available'
      }]);
    }
  };
  
  const handleRejectResponder = (id) => {
    setPendingRegistrations(pendingRegistrations.filter(reg => reg._id !== id));
    // Here you would typically make an API call to reject the responder
  };
  
  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    
    // Simulate sending broadcast
    console.log('Broadcasting message:', broadcastMessage);
    console.log('Broadcast type:', broadcastType);
    console.log('Broadcast region:', broadcastRegion);
    
    alert(`${broadcastType.toUpperCase()} broadcast sent successfully to ${broadcastRegion === 'all' ? 'all regions' : broadcastRegion}!`);
    setBroadcastMessage('');
    setShowBroadcastDialog(false);
  };
  
  // Filter functions
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          report.disasterType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  const filteredHelpRequests = helpRequests.filter(request => {
    const matchesSearch = request.reason.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          request.urgency.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : request.status === filterStatus;
    return matchesSearch && matchesStatus;
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
    switch(urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'verified':
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">PralaySetu Admin</h2>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <Button 
                variant={activeTab === 'reports' ? "default" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('reports')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </li>
            <li>
              <Button 
                variant={activeTab === 'help' ? "default" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('help')}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Help Requests
              </Button>
            </li>
            <li>
              <Button 
                variant={activeTab === 'responders' ? "default" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('responders')}
              >
                <Users className="mr-2 h-4 w-4" />
                Responders
              </Button>
            </li>
            <li>
              <Button 
                variant={activeTab === 'settings' ? "default" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </li>
          </ul>
        </nav>
      </div>
  
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">{activeTab === 'reports' ? 'Disaster Reports' : 
                                                 activeTab === 'help' ? 'Help Requests' :
                                                 activeTab === 'responders' ? 'Responders' : 'Settings'}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowBroadcastDialog(true)} 
              className="flex items-center"
            >
              <Bell className="h-4 w-4 mr-2" />
              Broadcast Alert
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>
  
        {/* Content Area */}
        <main className="p-6">
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {/* Filter and Search */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search reports..."
                      className="pl-8 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
  
              {/* Reports Grid */}
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <p>Loading reports...</p>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg border">
                  <p className="text-gray-500">No reports match your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredReports.map(report => (
                    <Card key={report._id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              <Badge className="mr-2">{report.disasterType}</Badge>
                              {getStatusBadge(report.status)}
                            </CardTitle>
                            <CardDescription className="pt-1">
                              Reported by {report.user.name}
                            </CardDescription>
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
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>Lat: {report.location.latitude.toFixed(4)}, Long: {report.location.longitude.toFixed(4)}</span>
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
              {/* Filter and Search */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search help requests..."
                      className="pl-8 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
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
  
              {/* Help Requests List */}
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <p>Loading help requests...</p>
                </div>
              ) : filteredHelpRequests.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg border">
                  <p className="text-gray-500">No help requests match your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredHelpRequests.map(request => (
                    <Card key={request._id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <Badge className={`${getUrgencyColor(request.urgency)} text-white`}>
                                {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                              </Badge>
                              {getStatusBadge(request.status)}
                            </CardTitle>
                            <CardDescription className="pt-1">
                              From {request.user.name}
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
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>Lat: {request.location.lat.toFixed(4)}, Long: {request.location.lng.toFixed(4)}</span>
                        </div>
                        {request.status === 'assigned' && (
                          <div className="flex items-center text-xs text-blue-500 mt-1">
                            <User className="h-3 w-3 mr-1" />
                            <span>Assigned to: {request.assignedTo.name}</span>
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
                          <Select value={selectedResponder} onValueChange={setSelectedResponder}>
                            <SelectTrigger className="w-full text-xs">
                              <SelectValue placeholder="Assign to responder" />
                            </SelectTrigger>
                            <SelectContent>
                              {responders
                                .filter(r => r.status === 'available')
                                .map(responder => (
                                  <SelectItem key={responder._id} value={responder._id}>
                                    {responder.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            size="sm" 
                            className="w-full" 
                            disabled={!selectedResponder}
                            onClick={() => handleAssignHelpRequest(request._id)}
                          >
                            Assign Help
                          </Button>
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
              <Tabs defaultValue="active">
                <TabsList>
                  <TabsTrigger value="active">Active Responders</TabsTrigger>
                  <TabsTrigger value="pending">Pending Registrations</TabsTrigger>
                </TabsList>
                
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
                              <td className="px-4 py-3">{responder.name}</td>
                              <td className="px-4 py-3">{responder.type}</td>
                              <td className="px-4 py-3">
                                <Badge variant={responder.status === 'available' ? 'outline' : 'secondary'}>
                                  {responder.status}
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
                    {pendingRegistrations.map(registration => (
                      <Card key={registration._id}>
                        <CardHeader>
                          <CardTitle>{registration.name}</CardTitle>
                          <CardDescription>
                            <span className="font-semibold">Type:</span> {registration.type} | 
                            <span className="font-semibold ml-2">Applied on:</span> {formatDate(registration.createdAt)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm font-medium">Contact Person:</span>
                                <p>{registration.contactPerson}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium">Email:</span>
                                <p>{registration.email}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium">Phone:</span>
                                <p>{registration.phone}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm font-medium">ID Proof:</span>
                                <div className="mt-1">
                                  <img 
                                    src={registration.idProof} 
                                    alt="ID Proof" 
                                    className="w-full max-w-xs rounded border"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            className="border-green-500 text-green-500 hover:bg-green-50"
                            onClick={() => handleApproveResponder(registration._id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => handleRejectResponder(registration._id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    
                    {pendingRegistrations.length === 0 && (
                      <div className="text-center p-8 bg-white rounded-lg border">
                        <p className="text-gray-500">No pending registration requests</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
  
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure your disaster management system settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Alert Settings</h3>
                      <p className="text-sm text-gray-500">Configure how alerts are sent and received in the system</p>
                    </div>
                    <Button onClick={() => setShowBroadcastDialog(true)}>
                      <Bell className="h-4 w-4 mr-2" />
                      Send New Broadcast Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
  
      {/* Broadcast Dialog */}
      <Dialog open={showBroadcastDialog} onOpenChange={setShowBroadcastDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Broadcast Alert</DialogTitle>
            <DialogDescription>
              Send an important alert to all users in the selected region
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Select value={broadcastType} onValueChange={setBroadcastType}>
                <SelectTrigger>
                  <SelectValue placeholder="Alert Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alert">Emergency Alert</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="update">Situation Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Select value={broadcastRegion} onValueChange={setBroadcastRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="north">North India</SelectItem>
                  <SelectItem value="south">South India</SelectItem>
                  <SelectItem value="east">East India</SelectItem>
                  <SelectItem value="west">West India</SelectItem>
                  <SelectItem value="central">Central India</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Textarea 
                placeholder="Enter your alert message here..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setShowBroadcastDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleBroadcast} disabled={!broadcastMessage.trim()}>
              Broadcast Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminDashboard;
