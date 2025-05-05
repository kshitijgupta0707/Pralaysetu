import React, { useState } from 'react';
import { AlertTriangle, Info, Map, Activity, ArrowRight } from 'lucide-react';
import { axiosInstance } from "@/lib/axios";

const Earthquake = () => {
  const [formData, setFormData] = useState({
    significance: '',
    longitude: '',
    latitude: '',
    depth: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await axiosInstance.post('/predict_earthquake', formData);
      setResult(response.data.prediction);
    } catch (error) {
      console.error("Prediction error:", error);
      setErrorMsg("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-500 to-blue-800 py-16">
      <div className="container mx-auto px-4">
        {/* Page Title Section */}
        <div className="flex flex-col items-center text-white mb-12">
          <div className="bg-blue-600 p-2 rounded-full mb-4">
            <Activity size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Earthquake Risk Predictor</h1>
          <p className="text-lg max-w-2xl text-center">
            Analyze seismic data to predict potential earthquake risks in your area.
            Enter the parameters below to get your assessment.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-blue-700 py-4 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Map className="mr-2" /> Enter Seismic Parameters
              </h2>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Significance (relative importance of the event)
                </label>
                <input
                  type="number"
                  name="significance"
                  placeholder="Enter significance value (0-1000)"
                  value={formData.significance}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    placeholder="e.g., 19.0760"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    placeholder="e.g., 72.8777"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Depth (km below surface)
                </label>
                <input
                  type="number"
                  step="any"
                  name="depth"
                  placeholder="Depth in kilometers"
                  value={formData.depth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md"
                />
              </div>
              
              <button 
                onClick={handleSubmit} 
                className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-colors duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Predict Earthquake Risk <ArrowRight className="ml-2" />
                  </span>
                )}
              </button>
              
              {errorMsg && (
                <div className="mt-2 text-center text-red-600 text-sm font-medium bg-red-50 p-2 rounded-md">
                  <AlertTriangle className="inline-block mr-1 h-4 w-4" /> {errorMsg}
                </div>
              )}
            </div>
          </div>
          
          {/* Results and Info Section */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            {/* Result Card */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-blue-700 py-4 px-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Activity className="mr-2" /> Prediction Results
                </h2>
              </div>
              
              <div className="p-6 min-h-32 flex items-center justify-center">
                {result ? (
                  <div className={`text-center p-6 rounded-lg w-full ${
                    result === "Yes" ? "bg-red-50" : "bg-green-50"
                  }`}>
                    <div className={`text-4xl font-bold mb-2 ${
                      result === "Yes" ? "text-red-600" : "text-green-600"
                    }`}>
                      {result === "Yes" ? "HIGH RISK" : "LOW RISK"}
                    </div>
                    <p className="text-gray-700">
                      {result === "Yes" 
                        ? "Significant earthquake activity is likely in this region. Take necessary precautions." 
                        : "No significant earthquake activity is expected in this region."}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 p-6">
                    <Info className="mx-auto h-12 w-12 mb-3 text-blue-400" />
                    <p>Enter seismic parameters and submit to see prediction results</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Information Cards */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-blue-700 py-4 px-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Info className="mr-2" /> Earthquake Safety Tips
                </h2>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Drop to your hands and knees to avoid falling</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Cover your head and neck with your arms for protection</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Hold on to sturdy furniture until shaking stops</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Stay away from windows, outside walls and hanging objects</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earthquake;