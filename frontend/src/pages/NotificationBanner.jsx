import { useNotificationStore } from "../store/useNotificationStore";
import { useState, useEffect } from "react";
import { X, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";

export default function NotificationBanner() {
  const { purpose, title, message, show, hideNotification } = useNotificationStore();
  const [progress, setProgress] = useState(100);
  const [timeLeft, setTimeLeft] = useState(5); // 5 seconds notification display

  useEffect(() => {
    if (show) {
      // Reset progress when notification appears
      setProgress(0);
      setTimeLeft(5);
      
      // Start countdown timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            hideNotification();
            return 0;
          }
          return prev - 0.1;
        });
        
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 2; // increase by 2% every 100ms
        });
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [show, hideNotification]);

  if (!show) return null;
  
  // Configure styles based on notification type
  const styleConfig = {
    report: {
      bg: "bg-gray-900", // Dark blackish-gray background
      text: "text-gray-100", // Light gray text for contrast
      iconBg: "bg-gray-800", // Slightly lighter gray for icon background
      icon: <AlertCircle className="h-6 w-6 text-gray-300" />, // Light gray icon
      progressBg: "bg-gray-950", // Very dark gray for progress bg
      progressFill: "bg-gray-500" // Medium gray for progress fill
    },
    request: {
      bg: "bg-green-800",
      text: "text-white",
      iconBg: "bg-green-700",
      icon: <CheckCircle className="h-6 w-6 text-green-200" />,
      progressBg: "bg-green-900",
      progressFill: "bg-green-400"
    },
    warning: {
      bg: "bg-yellow-800",
      text: "text-white",
      iconBg: "bg-yellow-700",
      icon: <AlertTriangle className="h-6 w-6 text-yellow-200" />,
      progressBg: "bg-yellow-900",
      progressFill: "bg-yellow-400"
    },
    error: {
      bg: "bg-red-800",
      text: "text-white",
      iconBg: "bg-red-700",
      icon: <AlertCircle className="h-6 w-6 text-red-200" />,
      progressBg: "bg-red-900",
      progressFill: "bg-red-400"
    },
    // Default style
    info: {
      bg: "bg-indigo-800",
      text: "text-white",
      iconBg: "bg-indigo-700",
      icon: <Info className="h-6 w-6 text-indigo-200" />,
      progressBg: "bg-indigo-900",
      progressFill: "bg-indigo-400"
    }
  };

  // Default to info if type is not specified
  const styles = styleConfig[purpose] || styleConfig.info;

  return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-4/5 md:w-2/3 lg:w-1/2 z-50 overflow-hidden">
      <div className={`rounded-lg shadow-lg p-4 flex flex-col relative ${styles.bg} ${styles.text}`}>
        {/* Header with title and close button */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-full ${styles.iconBg}`}>
              {styles.icon}
            </div>
            <h3 className="font-semibold text-lg">{title}</h3>
          </div>
          <button 
            onClick={hideNotification}
            className={`rounded-full p-1 hover:bg-opacity-80 transition-colors ${styles.iconBg}`}
            aria-label="Close notification"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
        
        {/* Message content */}
        <div className="text-sm mb-3 opacity-90">{message}</div>
        
        {/* Progress bar at bottom */}
        <div className={`h-1 w-full mt-4 rounded-full overflow-hidden absolute bottom-0 left-0 ${styles.progressBg}`}>
          <div 
            className={`h-full transition-all duration-100 ease-linear ${styles.progressFill}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>


          
     
  );
}