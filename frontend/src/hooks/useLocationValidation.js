import { useState } from 'react';
import toast from 'react-hot-toast';

export const useLocationValidation = (initialLocation = { lat: 0, lng: 0 }) => {
  const [location, setLocation] = useState({
    latitude: initialLocation?.lat || 0,
    longitude: initialLocation?.lng || 0
  });

  const validateLocation = async () => {
    if (location.latitude === 0 || location.longitude === 0) {
      try {
        const position = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          })
        );

        const { latitude, longitude } = position.coords;
        
        setLocation({ latitude, longitude });
        toast.success("Location fetched successfully!");
        return { latitude, longitude };
      } catch (err) {
        console.error("Error getting location: ", err);
        if (err.code === 1) {
          toast.error("Location permission denied. Please allow it from browser settings.");
        } else if (err.code === 2) {
          toast.error("Location unavailable. Try again.");
        } else {
          toast.error("Location request timed out.");
        }
        return null;
      }
    }
    return location;
  };

  return { location, setLocation, validateLocation };
};
