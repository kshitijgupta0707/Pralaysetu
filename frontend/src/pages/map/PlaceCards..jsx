import { useState } from 'react';
import { Star, Clock, MapPin, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function PlaceCards({ places, userLocation }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <PlaceCard 
          key={place.place_id} 
          place={place} 
          userLocation={userLocation} 
        />
      ))}
    </div>
  );
}

function PlaceCard({ place, userLocation }) {
  const [expanded, setExpanded] = useState(false);
  
  // Extract address parts for better display
  const addressParts = place.vicinity ? place.vicinity.split(',') : [];
  const mainAddress = addressParts[0] || '';
  const area = addressParts.length > 1 ? addressParts.slice(-2)[0].trim() : '';
  
  // Limit the address length for uniform display
  const MAX_ADDRESS_LENGTH = 50;
  const isAddressTooLong = mainAddress.length > MAX_ADDRESS_LENGTH;
  const truncatedAddress = isAddressTooLong 
    ? mainAddress.substring(0, MAX_ADDRESS_LENGTH) + '...' 
    : mainAddress;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
      {/* Header with shadow */}
      <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 truncate" title={place.name}>
          {place.name}
        </h2>
      </div>

      {/* Facility Information */}
      <div className="p-6 flex-grow flex flex-col">
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

        <div className="mb-4 flex-grow">
          <div className="flex items-start mb-2">
            <MapPin className="w-5 h-5 text-blue-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              {isAddressTooLong && !expanded ? (
                <p className="text-gray-600">{truncatedAddress}</p>
              ) : (
                <p className="text-gray-600">{mainAddress}</p>
              )}
              
              {isAddressTooLong && (
                <button 
                  className="text-blue-500 text-sm flex items-center mt-1"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <>
                      Show less <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center text-gray-600">
            <Info className="w-5 h-5 mr-2" />
            <span className="truncate max-w-xs" title={area}>{area}</span>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
            onClick={() => {
              if (!userLocation) return;
              const { lat, lng } = userLocation;
              const destinationLat = place.geometry.location.lat;
              const destinationLng = place.geometry.location.lng;

              // Open Google Maps with directions
              window.open(
                `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${destinationLat},${destinationLng}&travelmode=driving`, 
                '_blank'
              );
            }}
          >
            Get Directions
          </button>
        </div>
      </div>

      {/* Map Coordinates */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <span>
            Coordinates: {place.geometry?.location?.lat.toFixed(5) || 'N/A'}, 
            {place.geometry?.location?.lng.toFixed(5) || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}