import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Navigation, Loader2, AlertCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link, useLocation } from 'react-router-dom';

const ResponderMap = () => {
  const location = useLocation();
  const destinationCoords = location.state || { latitude: 0, longitude: 0 };
  
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const mapRef = useRef(null);
  
  const apiKey = "AlzaSyFRuu5m-z8UklOGolpZEzJpks2KjqjLJiL"
  // Get user's current location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting current location:', error);
          setError('Unable to access your location. Please enable location services.');
          setIsLoading(false);
          
          // Set a default location if user location is not available
          setUserLocation({
            lat: 20.5937, // Default location (India center)
            lng: 78.9629,
          });
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      
      // Set a default location if geolocation is not supported
      setUserLocation({
        lat: 20.5937,
        lng: 78.9629,
      });
    }
  }, []);






  // const apiKey = "AlzaSyer2UO06OFz_n9yPRrSeMHUxovH-YzbO4z"
  
  // Load Google Maps API with error handling
  useEffect(() => {
    // Check if Google Maps is already loaded
    console.log(window.google?.maps || "kshitij")
    if (window.google && window.google.maps) {
      console.log("andar he rh gya")
      setApiLoaded(true);
      return;
    }
    console.log("Bhaar agya")
    
    // If not loaded, attempt to load it
    const loadGoogleMapsAPI = () => {
      // Use a callback function name that's unlikely to conflict
      const callbackName = 'initGoogleMapsCallback_' + Math.random().toString(36).substr(2, 9);
      
      // Create global callback function
      window[callbackName] = () => {
        setApiLoaded(true);
        // Clean up
        delete window[callbackName];
      };

      
      const script = document.createElement('script');
      // Replace this with your actual API key
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      
      // Error handling for script loading
      script.onerror = () => {
        setError('Failed to load Google Maps API. Using fallback map display.');
        setApiLoaded(false);
        setIsLoading(false);
        // Clean up
        delete window[callbackName];
      };
      
      document.head.appendChild(script);
      
      // Set a timeout to ensure we don't wait forever
      setTimeout(() => {
        if (!window.google || !window.google.maps) {
          setError('Google Maps API did not load in time. Using fallback map display.');
          setApiLoaded(false);
          setIsLoading(false);
        }
      }, 10000); // 10 second timeout
      
      return () => {
        if (script.parentNode) {
          document.head.removeChild(script);
        }
        delete window[callbackName];
      };
    };
    
    loadGoogleMapsAPI();
  }, []);

  // Initialize map once we have both the API loaded and user location
  useEffect(() => {
    if (!userLocation || !apiLoaded || !window.google || !window.google.maps) return;
    
    try {
      // Initialize the map
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 14,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });
      
      // Create a marker for user's location
      new window.google.maps.Marker({
        position: userLocation,
        map: newMap,
        title: "Your Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
      
      setMap(newMap);
      
      // If we have valid destination coordinates, show those too
      if (destinationCoords && 
          destinationCoords.latitude && 
          destinationCoords.longitude && 
          destinationCoords.latitude !== 0 && 
          destinationCoords.longitude !== 0) {
        
        const destination = {
          lat: parseFloat(destinationCoords.latitude),
          lng: parseFloat(destinationCoords.longitude)
        };
        
        // Create a marker for the destination
        new window.google.maps.Marker({
          position: destination,
          map: newMap,
          title: "Destination",
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });
        
        // Calculate route
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: newMap,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#4285F4',
            strokeWeight: 5,
          }
        });
        
        directionsService.route(
          {
            origin: userLocation,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
              
              // Extract route information
              const route = result.routes[0];
              const legs = route.legs[0];
              
              setRouteInfo({
                distance: legs.distance.text,
                duration: legs.duration.text,
                startAddress: legs.start_address,
                endAddress: legs.end_address,
              });
              
              // Fit map to show the entire route
              const bounds = new window.google.maps.LatLngBounds();
              bounds.extend(userLocation);
              bounds.extend(destination);
              newMap.fitBounds(bounds);
            } else {
              console.error('Directions request failed:', status);
              setError('Unable to calculate route. Please try again.');
            }
          }
        );
      }
    } catch (e) {
      console.error('Error initializing Google Maps:', e);
      setError('Error initializing map. Using fallback display.');
      setApiLoaded(false);
    }
  }, [userLocation, apiLoaded, destinationCoords]);

  // Render a simple fallback map if Google Maps API fails to load
  const renderFallbackMap = () => {
    return (
      <div className="relative bg-gray-100 rounded-lg shadow-md overflow-hidden" style={{ minHeight: '70vh' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <MapPin size={48} className="text-primary mb-4" />
          <h3 className="text-lg font-medium mb-2">Map Display Unavailable</h3>
          <p className="text-gray-600 mb-4 max-w-md">
            Unable to load interactive map. Your location and destination are shown below.
          </p>
          
          <Card className="w-full max-w-md shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MapPin size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Your Location</h4>
                    <p className="text-sm text-gray-500">
                      {userLocation ? `${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}` : 'Unknown'}
                    </p>
                  </div>
                </div>
                
                {destinationCoords && destinationCoords.latitude && destinationCoords.longitude && 
                 destinationCoords.latitude !== 0 && destinationCoords.longitude !== 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <MapPin size={20} className="text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Destination</h4>
                      <p className="text-sm text-gray-500">
                        {`${parseFloat(destinationCoords.latitude).toFixed(6)}, ${parseFloat(destinationCoords.longitude).toFixed(6)}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm z-10 p-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link to="/responder/dashboard" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Navigation
          </h1>
        </div>
      </header>
      
      <main className="flex-1 p-4 overflow-hidden flex flex-col space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading map...</span>
          </div>
        ) : (
          <>
            {/* Route information card - shown only when we have valid route info */}
            {routeInfo && (
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Navigation className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-medium">Route Information</h3>
                      <p className="text-sm text-gray-500">
                        Distance: {routeInfo.distance} • Estimated time: {routeInfo.duration}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Show error message if there was one */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Map container or fallback */}
            {apiLoaded ? (
              <div 
                ref={mapRef} 
                className="flex-1 rounded-lg shadow-md overflow-hidden"
                style={{ minHeight: '70vh' }}
              ></div>
            ) : (
              renderFallbackMap()
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ResponderMap;