import { useNotificationStore } from "../store/useNotificationStore";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function NotificationBanner() {
  const { title, message, show, hideNotification } = useNotificationStore();
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
          return prev + 2; // decrease by 2% every 100ms
        });
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [show, hideNotification]);

  if (!show) return null;
  
 

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-4/5 md:w-2/3 z-50 overflow-hidden pb-0">
      <div className="bg-blue-100 rounded-lg border-l-4 border-blue-500 text-blue-900 shadow-lg p-4 flex flex-col relative pb-0">
        {/* Header with title and close button */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-blue-500 h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="font-bold text-lg">{title}</h3>
          </div>
          <button 
            onClick={hideNotification}
            className="rounded-full p-1 hover:bg-blue-200 transition-colors"
            aria-label="Close notification"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Message content */}
        <div className="text-sm mb-3">{message}</div>
        
        {/* Time display */}
        {/* <div className="text-xs text-right text-blue-700 font-mono">
          {formattedTime}
        </div> */}
        
        {/* Progress bar */}
        <div className="h-1 w-full bg-blue-200 mt-2 rounded-full overflow-hidden bottom-0">
          <div 
            className="h-full bg-blue-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}