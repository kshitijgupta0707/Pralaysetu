import React, { useState } from 'react';
import { axiosInstance } from "@/lib/axios";

const Flood = () => {
  const [formData, setFormData] = useState({
    TopographyDrainage: '',
    RiverManagement: '',
    DamsQuality: '',
    Encroachments: '',
    Landslides: '',
    DeterioratingInfrastructure: '',
    PopulationScore: ''
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
      const response = await axiosInstance.post('/predict_flood', formData);
      console.log("response : ", response);
      
      // Updated to handle the response structure you showed
      // Extract the prediction value from response.data.prediction or response.data.data.prediction
      let predictionValue;
      
      if (response.data && response.data.data && response.data.data.prediction) {
        predictionValue = response.data.data.prediction;
      } else if (response.data && response.data.prediction) {
        predictionValue = response.data.prediction;
      }
      
      // If we see "Predicted Flood Severity: X.XX" format, extract the number
      if (typeof predictionValue === 'string' && predictionValue.includes('Flood Severity:')) {
        const match = predictionValue.match(/[\d.]+/);
        if (match) {
          predictionValue = parseFloat(match[0]);
        }
      }
      
      setResult(predictionValue);
    } catch (error) {
      console.error("Error predicting flood risk:", error);
      setErrorMsg("Failed to get flood probability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format field name to be more readable
  const formatFieldName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Function to get field description
  const getFieldDescription = (field) => {
    const descriptions = {
      TopographyDrainage: "Rate the area's natural drainage (1-10)",
      RiverManagement: "Rate management of nearby rivers/waterways (1-10)",
      DamsQuality: "Rate the quality of nearby dams (1-10)",
      Encroachments: "Rate level of natural waterway encroachments (1-10)",
      Landslides: "Rate risk of landslides in the area (1-10)",
      DeterioratingInfrastructure: "Rate infrastructure deterioration (1-10)",
      PopulationScore: "Rate population density of the area (1-10)"
    };
    return descriptions[field] || "";
  };

  // Get risk level based on probability
  const getRiskLevel = (probability) => {
    if (probability > 0.7) return { text: "High Risk", color: "bg-red-500" };
    if (probability > 0.4) return { text: "Moderate Risk", color: "bg-orange-500" };
    return { text: "Low Risk", color: "bg-green-500" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Flood Risk Assessment</h1>
          <p className="text-xl text-blue-100">
            Predict flood probability in your area based on environmental factors
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Main content area */}
          <div className="md:flex">
            {/* Left column - Form */}
            <div className="md:w-2/3 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Input Assessment Factors</h2>
              
              <div className="space-y-5">
                {Object.keys(formData).map((key) => (
                  <div key={key} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {formatFieldName(key)}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500">{getFieldDescription(key)}</p>
                  </div>
                ))}

                <button 
                  onClick={handleSubmit} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : "Calculate Flood Risk"}
                </button>
              </div>

              {errorMsg && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errorMsg}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right column - Results and Info */}
            <div className="bg-blue-50 md:w-1/3 p-6 md:p-8 border-l border-blue-100">
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Flood Risk Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Our advanced algorithm analyzes multiple environmental and infrastructure factors to predict potential flood risk.
                </p>
              </div>
              
              {result !== null && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Assessment Result</h3>
                  
                  <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="mb-4">
                      <div className="inline-block rounded-full p-3 bg-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="text-3xl font-bold text-gray-800">
                      {typeof result === 'number' ? `${(result * 100).toFixed(1)}%` : '—'}
                    </div>
                    
                    <p className="text-gray-600 mt-1">Flood Probability</p>
                    
                    {typeof result === 'number' && (
                      <div className="mt-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getRiskLevel(result).color}`}>
                          {getRiskLevel(result).text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="bg-blue-100 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">PralaySetu Safety Tips</h4>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-1.5 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Know your area's flood risk level
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-1.5 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Prepare an emergency kit
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-1.5 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Sign up for local alerts
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 md:px-8">
            <p className="text-sm text-gray-500 text-center">
              This tool provides an estimation based on provided inputs. For critical decisions, consult with local authorities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flood;