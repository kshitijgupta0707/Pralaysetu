import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Home, Building, PlusCircle, MinusCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Note: In a real implementation, you would use a library like react-leaflet, 
// Google Maps React, or MapBox. This is a simplified version for demonstration.

const EmergencyMap = ({ location, height = "400px" }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [mapZoom, setMapZoom] = useState(14);
  const [activePoint, setActivePoint] = useState(null);
  const [emergencyPoints, setEmergencyPoints] = useState([]);
  const [incidentReports, setIncidentReports] = useState([]);

  // For demo purposes - in a real app, these would come from your API
  const demoEmergencyPoints = [
    { 
      id: 1, 
      type: 'hospital',
      name: 'General Hospital',
      address: '123 Healthcare Ave',
      lat: location.lat + 0.01,
      lng: location.lng + 0.01,
      phone: '123-456-7890',
      distance: '1.2 km'
    },
    { 
      id: 2, 
      type: 'hospital',
      name: 'Medical Center',
      address: '456 Doctor St',
      lat: location.lat - 0.008,
      lng: location.lng + 0.015,
      phone: '123-456-7891',
      distance: '1.8 km'
    },
    { 
      id: 3, 
      type: 'police',
      name: 'Central Police Station',
      address: '789 Law Enforcement Rd',
      lat: location.lat + 0.015,
      lng: location.lng - 0.01,
      phone: '123-456-7892',
      distance: '2.3 km'
    },
    { 
      id: 4, 
      type: 'fire',
      name: 'Fire Station #5',
      address: '101 Firefighter Blvd',
      lat: location.lat - 0.012,
      lng: location.lng - 0.008,
      phone: '123-456-7893',
      distance: '1.5 km'
    },
    { 
      id: 5, 
      type: 'shelter',
      name: 'Community Shelter',
      address: '202 Safe Haven St',
      lat: location.lat + 0.005,
      lng: location.lng - 0.018,
      phone: '123-456-7894',
      distance: '2.1 km'
    }
  ];

  const demoIncidentReports = [
    {
      id: 101,
      type: 'flood',
      description: 'Street flooding, approximately 2 feet deep',
      lat: location.lat + 0.02,
      lng: location.lng + 0.005,
      timestamp: '2025-04-07T08:30:00Z',
      verified: true
    },
    {
      id: 102,
      type: 'fire',
      description: 'Building fire on the 3rd floor',
      lat: location.lat - 0.018,
      lng: location.lng + 0.008,
      timestamp: '2025-04-07T07:45:00Z',
      verified: true
    }
  ];

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // based on the user's current location
    setEmergencyPoints(demoEmergencyPoints);
    setIncidentReports(demoIncidentReports);
  }, [location]);

  const getFilteredPoints = () => {
    if (selectedFilter === 'all') {
      return emergencyPoints;
    }
    return emergencyPoints.filter(point => point.type === selectedFilter);
  };

  const getMarkerColor = (type) => {
    switch (type) {
      case 'hospital':
        return 'bg-green-500';
      case 'police':
        return 'bg-blue-500';
      case 'fire':
        return 'bg-red-500';
      case 'shelter':
        return 'bg-orange-500';
      case 'flood':
        return 'bg-cyan-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMarkerIcon = (type) => {
    switch (type) {
      case 'hospital':
        return <Building className="h-4 w-4" />;
      case 'police':
        return <Building className="h-4 w-4" />;
      case 'fire':
        return <Building className="h-4 w-4" />;
      case 'shelter':
        return <Home className="h-4 w-4" />;
      case 'flood':
      case 'fire':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Map Filters */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 bg-white p-2 rounded-lg shadow-md">
        <Button 
          variant={selectedFilter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedFilter('all')}
          className="text-xs"
        >
          All
        </Button>
        <Button 
          variant={selectedFilter === 'hospital' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedFilter('hospital')}
          className="text-xs text-green-600"
        >
          Hospitals
        </Button>
        <Button 
          variant={selectedFilter === 'police' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedFilter('police')}
          className="text-xs text-blue-600"
        >
          Police
        </Button>
        <Button 
          variant={selectedFilter === 'fire' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedFilter('fire')}
          className="text-xs text-red-600"
        >
          Fire Stations
        </Button>
        <Button 
          variant={selectedFilter === 'shelter' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedFilter('shelter')}
          className="text-xs text-orange-600"
        >
          Shelters
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white rounded-lg shadow-md">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMapZoom(mapZoom + 1)}
          className="rounded-b-none"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMapZoom(Math.max(mapZoom - 1, 10))}
          className="rounded-t-none"
        >
          <MinusCircle className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Location Button */}
      <div className="absolute bottom-4 right-4 z-10">
        <Button 
          variant="default" 
          size="icon"
          className="bg-blue-600 hover:bg-blue-700 rounded-full h-12 w-12 shadow-lg"
        >
          <Navigation className="h-6 w-6" />
        </Button>
      </div>

      {/* Map Background (Placeholder - in real app, use actual map library) */}
      <div 
        className="w-full h-full bg-blue-100 rounded-lg relative overflow-hidden"
        style={{ 
          backgroundImage: "url('/api/placeholder/1000/800')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* User's current location marker */}
        <div 
          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2" 
          style={{ 
            left: '50%', 
            top: '50%',
          }}
        >
          <div className="relative">
            <div className="h-4 w-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
            <div className="h-12 w-12 bg-blue-500 rounded-full opacity-20 absolute -top-4 -left-4 animate-ping"></div>
            <div className="h-4 w-4 rounded-full absolute top-0 left-0 border-2 border-blue-500 animate-pulse"></div>
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
            Your Location
          </div>
        </div>

        {/* Emergency Points Markers */}
        {getFilteredPoints().map((point) => (
          <div 
            key={point.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" 
            style={{ 
              left: `${50 + (point.lng - location.lng) * 500}%`, 
              top: `${50 - (point.lat - location.lat) * 500}%`,
              zIndex: activePoint === point.id ? 30 : 10
            }}
            onClick={() => setActivePoint(activePoint === point.id ? null : point.id)}
          >
            <div className="flex flex-col items-center">
              <div className={`h-5 w-5 ${getMarkerColor(point.type)} rounded-full flex items-center justify-center text-white shadow-md`}>
                {getMarkerIcon(point.type)}
              </div>
              {activePoint === point.id && (
                <Card className="absolute mt-2 w-64 z-40 transform -translate-x-1/2 shadow-lg animate-fadeIn">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{point.name}</h4>
                        <p className="text-xs text-gray-500">{point.address}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {point.type}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-col gap-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Phone:</span>
                        <span className="font-medium">{point.phone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Distance:</span>
                        <span className="font-medium">{point.distance}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <Button size="sm" variant="outline" className="text-xs">
                        Call
                      </Button>
                      <Button size="sm" className="text-xs bg-blue-600">
                        Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}

        {/* Incident Report Markers */}
        {incidentReports.map((incident) => (
          <div 
            key={incident.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" 
            style={{ 
              left: `${50 + (incident.lng - location.lng) * 500}%`, 
              top: `${50 - (incident.lat - location.lat) * 500}%`,
              zIndex: activePoint === `incident-${incident.id}` ? 30 : 10
            }}
            onClick={() => setActivePoint(activePoint === `incident-${incident.id}` ? null : `incident-${incident.id}`)}
          >
            <div className="flex flex-col items-center">
              <div className={`h-6 w-6 ${getMarkerColor(incident.type)} rounded-full border-2 border-white flex items-center justify-center text-white shadow-md`}>
                {getMarkerIcon(incident.type)}
              </div>
              {activePoint === `incident-${incident.id}` && (
                <Card className="absolute mt-2 w-64 z-40 transform -translate-x-1/2 shadow-lg">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium capitalize">{incident.type} Reported</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(incident.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className={`ml-2 ${incident.verified ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}>
                        {incident.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm">{incident.description}</p>
                    <div className="mt-3">
                      <Button size="sm" className="text-xs w-full bg-blue-600">
                        Directions to Safe Area
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}

        {/* Map Attribution */}
        <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs text-gray-500">
          Map data © 2025 PralaySetu
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;