import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, AlertCircle, Check, MapPin, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AlertNotifications = ({ userLocation }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const alertsPerPage = 5;

  // Demo alerts for testing
  const demoAlerts = [
    {
      id: 1,
      title: 'Flood Warning',
      description: 'Heavy rainfall expected. Potential for flash flooding in low-lying areas.',
      details: 'The meteorological department has issued a flood warning due to expected heavy rainfall over the next 48 hours. Residents in low-lying areas should take necessary precautions and be prepared for possible evacuation.',
      severity: 'high',
      type: 'weather',
      source: 'Meteorological Department',
      location: 'City-wide',
      time: '2025-04-07T08:00:00Z',
      expiresAt: '2025-04-09T08:00:00Z',
      read: false,
    },
   
       {
      id: 2,
      title: 'Earthquake Aftershock Warning',
      description: 'Possibility of aftershocks over the next 48 hours. Take necessary precautions.',
      details: 'Seismologists warn that aftershocks ranging from 3.0 to 4.5 magnitude are possible over the next 48 hours following yesterday\'s earthquake. Residents should secure heavy furniture and be prepared for additional shaking.',
      severity: 'critical',
      type: 'seismic',
      source: 'National Seismic Authority',
      location: 'City-wide',
      time: '2025-04-06T09:30:00Z',
      expiresAt: '2025-04-08T09:30:00Z',
      read: false,
     
    }
  ];

  useEffect(() => {
    // Simulate API fetch
    const fetchAlerts = async () => {
      try {
        // In a real implementation, you would fetch from your API
        // const response = await fetch('/api/alerts');
        // const data = await response.json();
        
        // Using demo data instead
        setTimeout(() => {
          setAlerts(demoAlerts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

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

  const getAlertIcon = (type) => {
    switch (type) {
      case 'weather':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'health':
        return <Info className="h-5 w-5 text-green-500" />;
      case 'seismic':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'infrastructure':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAsRead = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !alert.read;
    if (activeTab === 'critical') return alert.severity === 'critical';
    if (activeTab === 'high') return alert.severity === 'high';
    return alert.type === activeTab;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);
  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = filteredAlerts.slice(indexOfFirstAlert, indexOfLastAlert);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading alerts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[95%] sm:w-full m-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center`">
            <Bell className="h-5 w-5 mr-2" />
            Alert Notifications
          </CardTitle>
          {alerts.some(alert => !alert.read) && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <CardDescription>
          Stay informed about emergencies and important updates in your area
        </CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <CardContent>
            {selectedAlert ? (
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedAlert(null)}
                  className="mb-2"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to list
                </Button>
                
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className={`w-3 h-3 rounded-full mt-2 mr-3 ${getAlertSeverityColor(selectedAlert.severity)}`} />
                      <div>
                        <h3 className="text-lg font-medium">{selectedAlert.title}</h3>
                        <div className="flex items-center mt-1 space-x-2">
                          <Badge variant={selectedAlert.severity === 'critical' ? 'destructive' : 'outline'}>
                            {selectedAlert.severity}
                          </Badge>
                          <Badge variant="outline">{selectedAlert.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSelectedAlert(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-700">{selectedAlert.details}</p>
                  </div>
                  
                  <div className="mt-4 space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {selectedAlert.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Issued: {formatDate(selectedAlert.time)}
                    </div>
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      Source: {selectedAlert.source}
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Expires: {formatDate(selectedAlert.expiresAt)}
                    </div>
                  </div>
                  
                  {selectedAlert.actions && selectedAlert.actions.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {selectedAlert.actions.map(action => (
                        <Button 
                          key={action.id} 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.location.href = action.link}
                        >
                          {action.text}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {currentAlerts.length > 0 ? (
                  <div className="space-y-4">
                    {currentAlerts.map((alert) => (
                      <div 
                        key={alert.id}
                        className={`flex items-start p-4 rounded-lg bg-white shadow-sm border border-gray-100 cursor-pointer 
                          ${!alert.read ? 'border-l-4 border-l-blue-500' : ''}`}
                        onClick={() => {
                          setSelectedAlert(alert);
                          if (!alert.read) markAsRead(alert.id);
                        }}
                      >
                        <div className={`w-3 h-3 rounded-full mt-1.5 mr-3 ${getAlertSeverityColor(alert.severity)}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium flex items-center">
                              {getAlertIcon(alert.type)}
                              <span className="ml-2">{alert.title}</span>
                              {!alert.read && (
                                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </h4>
                            <Badge variant={alert.severity === 'critical' ? 'destructive' : 'outline'}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" /> 
                            {alert.location}
                            <span className="mx-2">•</span>
                            {formatDate(alert.time)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Bell className="h-12 w-12 mb-2 opacity-30" />
                    <p>No alerts found for the selected filter</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between border-t">
        <div className="text-sm text-gray-500">
          {filteredAlerts.length} {filteredAlerts.length === 1 ? 'alert' : 'alerts'} found
        </div>
       
      </CardFooter>
    </Card>
  );
};

export default AlertNotifications;