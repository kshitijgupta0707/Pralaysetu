import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Clock, Star, Info, Loader } from 'lucide-react';

const GoMapsComponent = () => {
  
  const apiKey = 'AlzaSyjhZhqjrJkRFyIXOpoF4DqRRyrUd6195KB'; // Replace with your GoMaps API key
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Detecting your location...");

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
          setLoadingText("Could not detect location. Please try again.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsLoading(false);
      setLoadingText("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (!userLocation.lat) return;

    // Load the GoMaps script
    const script = document.createElement('script');
    script.src = `https://maps.gomaps.pro/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error("Failed to load GoMaps script");
      setLoadingText("Failed to load maps. Please check your API key.");
    };

    script.onload = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 10,
      });
      setMap(map);

      // Add user location marker
      new window.google.maps.Marker({
        position: userLocation,
        map,
        title: 'Your Location',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(40, 40),
        }
      });

      // Fetch places after map is loaded
      fetchNearbyPlaces(selectedCategory, radiusKm * 1000);
    };

    document.head.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [userLocation]);

  const [selectedCategory, setSelectedCategory] = useState('hospital');
  const [radiusKm, setRadiusKm] = useState(5);
  const [places, setPlaces] = useState([]);

  const [markers, setMarkers] = useState([]);

  const [map, setMap] = useState(null);
  const clearMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchNearbyPlaces(category, radiusKm * 1000);
  };

  const handleRadiusChange = (radius) => {
    setRadiusKm(radius);
    fetchNearbyPlaces(selectedCategory, radius * 1000);
  };

  const fetchNearbyPlaces = (type = 'hospital', radius = 5000) => {
    setIsLoading(true);
    setSelectedCategory(type);
    setRadiusKm(radius / 1000);

    if (!map) {
      console.log("Map not initialized yet");
      setIsLoading(false);
      return;
    }

    // Clear existing markers
    clearMarkers();

    const { lat, lng } = userLocation;
    console.log(`Fetching ${type} within ${radius}m of ${lat},${lng}`);

    // Using the same URL structure as in original code
    const url = `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.results);
        setPlaces(data.results || []);

        if (map) {
          const newMarkers = [];
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(userLocation);

          if (data.results && data.results.length > 0) {
            data.results.forEach((place) => {
              const placePosition = new window.google.maps.LatLng(
                place.geometry.location.lat,
                place.geometry.location.lng
              );

              const marker = new window.google.maps.Marker({
                position: placePosition,
                map,
                title: place.name,
                icon: {
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  scaledSize: new window.google.maps.Size(30, 30),
                }
              });

              bounds.extend(placePosition);
              newMarkers.push(marker);

              // Create info window for the place
              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                njnknk
                  <div style="padding: 10px; max-width: 200px;">
                    <h3 style="margin-top: 0; font-weight: bold;">${place.name}</h3>
                    <p>${place.vicinity}</p>
                    ${place.rating ? `<p>Rating: ${place.rating} ⭐</p>` : ''}
                     <button 
        style="background: #4285F4; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;"
        onClick="window.open('https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${place?.geometry?.location?.lat},${place?.geometry?.location?.lng}&travelmode=driving', '_blank')"
      >
        Get Directions
      </button>

                    </div>
                `
              });

              // Add click listener to show info window
              marker.addListener('click', () => {
                infoWindow.open(map, marker);
              });
            });

            setMarkers(newMarkers);
            map.fitBounds(bounds);
          }
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching nearby places:", error);
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      

      {/* Control panel */}
      <div className="control-panel p-2 md:p-4 bg-gray-100 border-b border-gray-300 sticky top-0 z-10">
        <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4">
          {/* Categories */}
          <div className="categories flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => handleCategoryChange('hospital')}
              className={`px-3 py-2 rounded-md ${selectedCategory === 'hospital' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-100'} text-sm md:text-base font-medium shadow-sm transition-colors`}
            >
              Hospitals
            </button>
            <button
              onClick={() => handleCategoryChange('pharmacy')}
              className={`px-3 py-2 rounded-md ${selectedCategory === 'pharmacy' ? 'bg-green-600 text-white' : 'bg-white hover:bg-green-100'} text-sm md:text-base font-medium shadow-sm transition-colors`}
            >
              Pharmacies
            </button>
            <button
              onClick={() => handleCategoryChange('doctor')}
              className={`px-3 py-2 rounded-md ${selectedCategory === 'doctor' ? 'bg-yellow-600 text-white' : 'bg-white hover:bg-yellow-100'} text-sm md:text-base font-medium shadow-sm transition-colors`}
            >
              Doctors
            </button>
            <button
              onClick={() => handleCategoryChange('police')}
              className={`px-3 py-2 rounded-md ${selectedCategory === 'police' ? 'bg-purple-600 text-white' : 'bg-white hover:bg-purple-100'} text-sm md:text-base font-medium shadow-sm transition-colors`}
            >
              Police
            </button>
          </div>

          {/* Radius slider - desktop */}
          <div className="radius-container hidden md:flex items-center gap-2 ml-2">
            <span className="text-sm whitespace-nowrap">Radius: {radiusKm}km</span>
            <input
              type="range"
              min="1"
              max="20"
              value={radiusKm}
              onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
              className="w-24"
            />
          </div>
        </div>

        {/* Mobile-only radius selector */}
        <div className="radius-container flex md:hidden items-center justify-center mt-2">
          <span className="text-sm mr-2">Radius: {radiusKm}km</span>
          <input
            type="range"
            min="1"
            max="20"
            value={radiusKm}
            onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
            className="w-32"
          />
        </div>
      </div>

      {/* Map container */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-10">
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <Loader className="animate-spin h-5 w-5 mr-2 text-blue-500" />
              <span>{loadingText}</span>
            </div>
          </div>
        )}
        <div
          ref={mapRef}
          className="h-96 md:h-[60vh] w-full border-2 border-gray-300"
        />
      </div>

      {/* Places list */}
      <div className="max-w-6xl mx-auto p-4 flex-grow">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">{`Nearby ${selectedCategory} Facilities`}</h1>

        {places && places.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <div key={place.place_id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Header with shadow */}
                <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">{place.name}</h2>
                </div>

                {/* Facility Information */}
                <div className="p-6">
                  <div className="flex items-center mb-4 flex-wrap">
                    {place.rating && (
                      <div className="flex items-center mr-4 mb-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="ml-1 font-semibold">{place.rating}</span>
                        <span className="text-gray-500 ml-1">({place.user_ratings_total} reviews)</span>
                      </div>
                    )}
                    {place.opening_hours && (
                      <div className={`flex items-center ${place.opening_hours.open_now ? 'text-green-600' : 'text-red-500'} mb-2`}>
                        <Clock className="w-5 h-5 mr-1" />
                        <span>{place.opening_hours.open_now ? 'Open Now' : 'Closed'}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-start mb-2">
                      <MapPin className="w-5 h-5 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-gray-600">{place.vicinity}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Info className="w-5 h-5 mr-2" />
                      <span>{place.vicinity.split(',').slice(-2)[0]}</span>
                    </div>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                      onClick={() => {
                        const { lat, lng } = userLocation;
                        const destinationLat = place.geometry.location.lat;
                        const destinationLng = place.geometry.location.lng;

                        // Open Google Maps with the directions from user's location to the place's location
                        window.open(`https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${destinationLat},${destinationLng}&travelmode=driving`, '_blank');
                      }}
                    >
                      Get Directions
                    </button>


                  </div>
                </div>

                {/* Map Coordinates */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <span>Coordinates: {place.geometry.location.lat.toFixed(5)}, {place.geometry.location.lng.toFixed(5)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader className="animate-spin h-8 w-8 text-blue-500 mb-2" />
                <p>Searching for places...</p>
              </div>
            ) : (
              <p className="text-gray-500">No {selectedCategory} facilities found in this area. Try increasing the radius or selecting a different category.</p>
            )}
          </div>
        )}
      </div>


    </div>
  );
};

export default GoMapsComponent;