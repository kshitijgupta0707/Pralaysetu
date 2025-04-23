import React, { useEffect, useState } from 'react';
import { BellRing, AlertTriangle, Map, Users, Heart, Phone, Star, ArrowRight, LifeBuoy, Shield, Globe, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthstore';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin } from 'lucide-react'
import Sidebar from './Sidebar';
const HomePage = () => {
  const [language, setLanguage] = useState('en');
  const {authUser , logout} = useAuthStore()
  const [isOpen, setIsOpen] = useState(false);
  const actingAs = localStorage.getItem("loggedInAs");
  useEffect(()=>{
     console.log(authUser)
     console.log("loggedInAs" , actingAs)
  }, [])


  const translations = {
    en: {
      heroTitle: "PralaySetu: Bridging Crisis to Safety",
      heroSubtitle: "A comprehensive disaster management system for early warnings, real-time reporting, and rapid response coordination.",
      getStarted: "Get Started",
      learnMore: "Learn More",
      joinAsResponder: "Join as Responder",
      alertsSection: "Real-time Disaster Alerts",
      alertsDescription: "Receive location-based alerts for potential disasters in your area, giving you precious time to prepare and respond.",
      reportingSection: "Community Incident Reporting",
      reportingDescription: "Report unusual activities or emergencies in your area. Verified reports are shared with nearby users to enhance community safety.",
      responseSection: "Emergency Response Coordination",
      responseDescription: "Request immediate help during emergencies. Your location is shared with verified responders who can navigate directly to you.",
      featuresTitle: "Key Features",
      userDashboard: "User Dashboard",
      userDashboardDesc: "Access personalized alerts, report incidents, and request help",
      responderDashboard: "Responder Dashboard",
      responderDashboardDesc: "View assigned emergency requests and navigate to help locations",
      adminDashboard: "Admin Dashboard",
      adminDashboardDesc: "Verify reports, manage users, and send critical alerts",
      multiLanguage: "Multi-language Support",
      multiLanguageDesc: "Available in Hindi, English, Tamil, Punjabi, and more",
      mapIntegration: "Interactive Maps",
      mapIntegrationDesc: "Locate emergency services and get navigation assistance",
      aiAssistance: "AI Knowledge Base",
      aiAssistanceDesc: "Get disaster information and safety tips powered by Gemini AI",
      ngoSection: "NGO Fundraising Platform",
      ngoSectionDesc: "Support disaster relief efforts through verified fundraising campaigns",
      howItWorks: "How It Works",
      testimonials: "Testimonials",
      aboutUs: "About PralaySetu",
      aboutText: "PralaySetu is a comprehensive disaster management platform designed to connect those in need with those who can help during emergencies. Our mission is to build resilient communities through better preparation, communication, and coordination during disasters.",
      contactUs: "Contact Us",
      joinOurMission: "Join Our Mission"
    },
    hi: {
      heroTitle: "प्रलयसेतु: आपदा से सुरक्षा का सेतु",
      heroSubtitle: "प्रारंभिक चेतावनी, वास्तविक-समय रिपोर्टिंग और त्वरित प्रतिक्रिया समन्वय के लिए एक व्यापक आपदा प्रबंधन प्रणाली।",
      getStarted: "शुरू करें",
      learnMore: "अधिक जानें",
      joinAsResponder: "प्रतिक्रिया देने वाले के रूप में शामिल हों",
      alertsSection: "वास्तविक-समय आपदा अलर्ट",
      alertsDescription: "अपने क्षेत्र में संभावित आपदाओं के लिए स्थान-आधारित अलर्ट प्राप्त करें, जो आपको तैयारी और प्रतिक्रिया देने के लिए महत्वपूर्ण समय देता है।",
      reportingSection: "सामुदायिक घटना रिपोर्टिंग",
      reportingDescription: "अपने क्षेत्र में असामान्य गतिविधियों या आपात स्थिति की रिपोर्ट करें। सत्यापित रिपोर्ट सामुदायिक सुरक्षा बढ़ाने के लिए आस-पास के उपयोगकर्ताओं के साथ साझा की जाती हैं।",
      responseSection: "आपातकालीन प्रतिक्रिया समन्वय",
      responseDescription: "आपात स्थिति के दौरान तत्काल सहायता का अनुरोध करें। आपका स्थान सत्यापित प्रतिक्रिया देने वालों के साथ साझा किया जाता है जो सीधे आप तक नेविगेट कर सकते हैं।",
      featuresTitle: "प्रमुख विशेषताएँ",
      userDashboard: "उपयोगकर्ता डैशबोर्ड",
      userDashboardDesc: "व्यक्तिगत अलर्ट तक पहुंचें, घटनाओं की रिपोर्ट करें और सहायता का अनुरोध करें",
      responderDashboard: "प्रतिक्रिया देने वाला डैशबोर्ड",
      responderDashboardDesc: "असाइन किए गए आपातकालीन अनुरोधों को देखें और सहायता स्थानों तक नेविगेट करें",
      adminDashboard: "व्यवस्थापक डैशबोर्ड",
      adminDashboardDesc: "रिपोर्ट सत्यापित करें, उपयोगकर्ताओं का प्रबंधन करें और महत्वपूर्ण अलर्ट भेजें",
      multiLanguage: "बहु-भाषा समर्थन",
      multiLanguageDesc: "हिंदी, अंग्रेजी, तमिल, पंजाबी और अधिक में उपलब्ध",
      mapIntegration: "इंटरैक्टिव मानचित्र",
      mapIntegrationDesc: "आपातकालीन सेवाओं का पता लगाएं और नेविगेशन सहायता प्राप्त करें",
      aiAssistance: "AI ज्ञान आधार",
      aiAssistanceDesc: "जेमिनी AI द्वारा संचालित आपदा जानकारी और सुरक्षा टिप्स प्राप्त करें",
      ngoSection: "NGO धन उगाहने का प्लेटफॉर्म",
      ngoSectionDesc: "सत्यापित धन उगाही अभियानों के माध्यम से आपदा राहत प्रयासों का समर्थन करें",
      howItWorks: "यह कैसे काम करता है",
      testimonials: "प्रशंसापत्र",
      aboutUs: "प्रलयसेतु के बारे में",
      aboutText: "प्रलयसेतु एक व्यापक आपदा प्रबंधन प्लेटफॉर्म है जिसे आपात स्थिति के दौरान जरूरतमंदों को मदद कर सकने वालों से जोड़ने के लिए डिज़ाइन किया गया है। हमारा मिशन आपदाओं के दौरान बेहतर तैयारी, संचार और समन्वय के माध्यम से लचीला समुदायों का निर्माण करना है।",
      contactUs: "संपर्क करें",
      joinOurMission: "हमारे मिशन से जुड़ें"
    }
  };

  const t = translations[language];

   useEffect(()=>{
      console.log("Auth user" , authUser) 
   })
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 w-full">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        authUser={authUser}
        actingAs={actingAs}
        language={language}
        setLanguage={setLanguage}
        logout={logout}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 2c1 0 3 2 3 4v1a3 3 0 1 1-6 0V6c0-2 2-4 3-4Z" />
                  <path d="M10 5c1 0 3 2 3 4v1a3 3 0 1 1-6 0V9c0-2 2-4 3-4Z" />
                  <path d="M4 8c1 0 3 2 3 4v1a3 3 0 1 1-6 0v-1c0-2 2-4 3-4Z" />
                  <path d="M22 19c0-3-2.5-5-5-5-2 0-3.5 1.5-4 2-1.5-2-3-2-4-2-2.5 0-5 2-5 5 0 3 3 6 9 6 6 0 9-3 9-6Z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-blue-800">PralaySetu</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <a href="#features" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block">Features</a>
            <a href="#how-it-works" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block">How It Works</a>
            <a href="#about" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block">About</a>
            <a href="#contact" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block">Contact</a>
            { authUser && authUser.registerAs == "None" && actingAs == "User" &&  <Link to="/user-dashboard" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block ">
              User Portal
            </Link> }
            { authUser && authUser.registerAs == "None" && actingAs == "Responder" &&  <Link to="/responder-dashboard" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block">
              Responder Portal
            </Link>}
            { authUser && authUser.registerAs == "Admin" && <Link to="/admin-dashboard" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block ">
              Admin Portal
            </Link>}
            { authUser && authUser.registerAs == "NGO" && <Link to="/ngo-dashboard" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block ">
              NGO Portal
            </Link>}
          
          </nav>

          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hidden sm:block"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              {/* Add more language options as needed */}
            </select>

            {!authUser && <div className="hidden sm:flex items-center space-x-2">
              <Link to="/login" className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium hidden lg:block ">
                Log in
              </Link>
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 hidden lg:block ">
                  Sign up
                </Button>
              </Link>
            </div>}

            {/* Logout button - shows only when user is logged in */}
            {authUser && <div className="flex items-center">
              <button 
                onClick={() => logout()} 
                className="flex items-center px-3 py-2 text-red-600 hover:text-red-800 font-medium"
              >
                <span className='hidden sm:block' >Logout</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>}

            {/* Mobile menu button */}
            <button 
          className="lg:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100 mobile-menu-button"
          onClick={() => setIsOpen(true)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
          </div>
        </div>

        {/* Mobile menu - You can expand this with state management */}
      </div>
</header>

      <main >
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-500 to-indigo-800 text-white overflow-hidden">
          {/* <div className="absolute inset-0 bg-[url('/images/waves-pattern.svg')] opacity-10"></div> */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 max-w-lg">
                <Badge className="bg-blue-700 hover:bg-blue-800">Disaster Management</Badge>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                  {t.heroTitle}
                </h1>
                <p className="text-xl opacity-90">
                  {t.heroSubtitle}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/signup">
                    <Button className="bg-white text-blue-700 hover:bg-blue-50">
                      {t.getStarted} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                      {t.joinAsResponder}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="text-yellow-300 mr-2" />
                    <div className="animate-pulse h-3 w-3 bg-red-500 rounded-full"></div>
                    <span className="ml-2 font-semibold">ALERT</span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/20 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">Flood Warning</span>
                        <Badge className="bg-yellow-500">High Risk</Badge>
                      </div>
                      <p className="text-sm">Heavy rainfall expected in Mumbai region. Prepare for potential flooding in low-lying areas.</p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">Cyclone Advisory</span>
                        <Badge className="bg-orange-500">Moderate</Badge>
                      </div>
                      <p className="text-sm">Cyclone forming in Bay of Bengal. Coastal areas should be on alert.</p>
                    </div>
                    <Button className="w-full bg-white/30 hover:bg-white/40 backdrop-blur-sm">
                      View All Alerts
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-30 left-0 right-0  ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,117.3C672,107,768,117,864,128C960,139,1056,149,1152,144C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Life-Saving Core Capabilities</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Our platform offers three essential services to keep communities safe during disasters.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Alert Feature */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <BellRing className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t.alertsSection}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{t.alertsDescription}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {t.learnMore} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Report Feature */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">{t.reportingSection}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{t.reportingDescription}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {t.learnMore} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Response Feature */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="bg-red-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <LifeBuoy className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">{t.responseSection}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{t.responseDescription}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {t.learnMore} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Integration Preview */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Interactive Map</Badge>
                <h2 className="text-3xl font-bold text-gray-900">Real-time Location Intelligence</h2>
                <p className="text-lg text-gray-600">
                  Our interactive map shows you nearby emergency services, safe zones, and danger areas during disasters. Responders get navigation assistance to reach those in need quickly.
                </p>
                <ul className="space-y-3">
                  {[
                    "View nearby hospitals, police stations, and fire stations",
                    "Get turn-by-turn navigation to safety",
                    "Monitor disaster-affected areas in real-time",
                    "See the location of emergency responders",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="bg-blue-600 hover:bg-blue-700">Explore Maps</Button>
              </div>

              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  {/* This would be your actual map integration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Map className="h-12 w-12 text-blue-600 opacity-30" />
                    <p className="absolute text-blue-800 font-medium">Interactive Map Preview</p>
                  </div>
                  {/* Sample markers */}
                  <div className="absolute top-1/4 left-1/4 bg-red-500 h-3 w-3 rounded-full animate-pulse"></div>
                  <div className="absolute top-1/3 right-1/3 bg-blue-500 h-3 w-3 rounded-full"></div>
                  <div className="absolute bottom-1/4 right-1/4 bg-green-500 h-3 w-3 rounded-full"></div>
                </div>
                <div className="p-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Emergency Services Nearby</span>
                    <Badge className="bg-green-100 text-green-800">4 Available</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Tabs */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">{t.featuresTitle}</h2>
              <p className="text-lg text-gray-600 mt-4">
                PralaySetu offers a comprehensive suite of features designed for different user types.
              </p>
            </div>

            <Tabs defaultValue="users" className="max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="users" className="text-center py-3">
                  <Users className="h-5 w-5 mr-2" />
                  <span>For Users</span>
                </TabsTrigger>
                <TabsTrigger value="responders" className="text-center py-3">
                  <Shield className="h-5 w-5 mr-2" />
                  <span>For Responders</span>
                </TabsTrigger>
                <TabsTrigger value="ngos" className="text-center py-3">
                  <Heart className="h-5 w-5 mr-2" />
                  <span>For NGOs</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="border rounded-lg p-6 shadow-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-blue-800">{t.userDashboard}</h3>
                    <p className="text-gray-600">{t.userDashboardDesc}</p>
                    <ul className="space-y-2">
                      {[
                        "Personalized alert notifications",
                        "Report unusual activities",
                        "Request emergency assistance",
                        "Access to emergency contacts",
                        "View safe locations map",
                        "Real-time disaster updates"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-red-100 p-1 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          </div>
                          <span className="font-medium">Emergency Alert</span>
                        </div>
                        <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                      </div>
                      <p className="text-sm text-gray-700">Flash flood warning issued for your area. Move to higher ground immediately.</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        <Phone className="h-4 w-4 mr-2" />
                        Request Emergency Help
                      </Button>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <Button variant="outline" className="text-blue-600 border-blue-200">
                          View Map
                        </Button>
                        <Button variant="outline" className="text-blue-600 border-blue-200">
                          Report Incident
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="responders" className="border rounded-lg p-6 shadow-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-green-800">{t.responderDashboard}</h3>
                    <p className="text-gray-600">{t.responderDashboardDesc}</p>
                    <ul className="space-y-2">
                      {[
                        "View and accept help requests",
                        "Real-time navigation to victims",
                        "Coordination with other responders",
                        "Status updates for emergency management",
                        "Resource allocation visibility",
                        "Communication with affected individuals"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-1 rounded-full">
                            <LifeBuoy className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">Help Request #4872</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                      </div>
                      <p className="text-sm text-gray-700">Family of 4 stranded on roof in Alkapuri area. Water level rising. Immediate evacuation needed.</p>
                      <div className="mt-3 text-sm text-gray-500 flex items-center">
                        <Map className="h-3 w-3 mr-1" /> 3.2 km away • ETA: 8 mins
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Accept & Navigate
                      </Button>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <Button variant="outline" className="text-green-600 border-green-200">
                          Request Backup
                        </Button>
                        <Button variant="outline" className="text-green-600 border-green-200">
                          Call Affected Party
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ngos" className="border rounded-lg p-6 shadow-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-purple-800">{t.ngoSection}</h3>
                    <p className="text-gray-600">{t.ngoSectionDesc}</p>
                    <ul className="space-y-2">
                      {[
                        "Create verified fundraising campaigns",
                        "Track donation progress transparently",
                        "Coordinate with government authorities",
                        "Manage volunteer registrations",
                        "Access affected area analytics",
                        "Distribute aid efficiently"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-purple-100 p-1 rounded-full">
                            <Heart className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="font-medium">Kerala Flood Relief</span>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-700">Emergency supplies needed for 500+ families. Food, medicine, and clean water are priorities.</p>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '67%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>₹6,70,000 raised</span>
                          <span>₹10,00,000 goal</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Manage Campaign
                      </Button>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <Button variant="outline" className="text-purple-600 border-purple-200">
                          Update Status
                        </Button>
                        <Button variant="outline" className="text-purple-600 border-purple-200">
                          Volunteer Management
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">{t.howItWorks}</h2>
              <p className="text-lg text-gray-600 mt-4">
                PralaySetu works seamlessly to connect those in need with those who can help.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="absolute top-1/4 w-full h-0.5 bg-blue-200 hidden md:block" style={{ zIndex: 0 }}></div>
                <div className="relative w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4 z-10">
                  <Volume2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Early Warning</h3>
                <p className="text-gray-600">ML-powered alerts predict potential disasters and notify users in affected areas.</p>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="absolute top-1/4 w-full h-0.5 bg-blue-200 hidden md:block" style={{ zIndex: 0 }}></div>
                <div className="relative w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4 z-10">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Incident Reporting</h3>
                <p className="text-gray-600">Users report incidents which are verified by admins and shared with the community.</p>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="absolute top-1/4 w-full h-0.5 bg-blue-200 hidden md:block" style={{ zIndex: 0 }}></div>
                <div className="relative w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4 z-10">
                  <LifeBuoy className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Emergency Response</h3>
                <p className="text-gray-600">Help requests are routed to nearby verified responders with navigation support.</p>
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="relative w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4 z-10">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Recovery Support</h3>
                <p className="text-gray-600">NGOs provide resources and fundraising for long-term disaster recovery efforts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">{t.testimonials}</h2>
              <p className="text-lg text-gray-600 mt-4">
                See how PralaySetu has helped communities across India.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="mt-2 font-semibold">Resident</h3>
                  </div>
                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-center italic">
                    "PralaySetu's early warning system gave us crucial time to evacuate before the flood hit our village. The app's simple interface made it easy to find safe routes and shelter."
                  </p>
                  <div className="mt-4 text-center">
                    <p className="font-medium">Rajesh Kumar</p>
                    <p className="text-sm text-gray-500">Kerala</p>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="mt-2 font-semibold">Emergency Responder</h3>
                  </div>
                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-center italic">
                    "As part of the NDRF team, PralaySetu has revolutionized how we locate and help people during disasters. The mapping and navigation features are invaluable in our operations."
                  </p>
                  <div className="mt-4 text-center">
                    <p className="font-medium">Captain Anand Singh</p>
                    <p className="text-sm text-gray-500">NDRF, Gujarat</p>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="mt-2 font-semibold">NGO Director</h3>
                  </div>
                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-center italic">
                    "The fundraising platform helped us raise critical funds during the Chennai floods. The transparency features built trust with donors and the coordination tools streamlined our relief distribution."
                  </p>
                  <div className="mt-4 text-center">
                    <p className="font-medium">Priya Sharma</p>
                    <p className="text-sm text-gray-500">Hope Foundation</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About & Contact */}
        <section id="about" className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* About */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.aboutUs}</h2>
                <p className="text-lg text-gray-700 mb-6">
                  {t.aboutText}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">National Coverage</h4>
                      <p className="text-sm text-gray-600">Operating across India</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">10,000+ Users</h4>
                      <p className="text-sm text-gray-600">And growing rapidly</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">1,500+ Responders</h4>
                      <p className="text-sm text-gray-600">Verified professionals</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Heart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">200+ NGO Partners</h4>
                      <p className="text-sm text-gray-600">Working together</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div id="contact">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.contactUs}</h2>
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium" htmlFor="name">Name</label>
                          <input
                            id="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            type="text"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium" htmlFor="email">Email</label>
                          <input
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            type="email"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="subject">Subject</label>
                        <input
                          id="subject"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          type="text"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="message">Message</label>
                        <textarea
                          id="message"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          rows="4"
                          required
                        ></textarea>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">

                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">{t.joinOurMission}</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Be part of a network that's saving lives and building resilient communities across India.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-6 text-lg">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/responder/signup">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-6 py-6 text-lg">
                  Join as Responder
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-6 py-12">
          {/* Top section with logo and description */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Logo and about */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 2c1 0 3 2 3 4v1a3 3 0 1 1-6 0V6c0-2 2-4 3-4Z" />
                    <path d="M10 5c1 0 3 2 3 4v1a3 3 0 1 1-6 0V9c0-2 2-4 3-4Z" />
                    <path d="M4 8c1 0 3 2 3 4v1a3 3 0 1 1-6 0v-1c0-2 2-4 3-4Z" />
                    <path d="M22 19c0-3-2.5-5-5-5-2 0-3.5 1.5-4 2-1.5-2-3-2-4-2-2.5 0-5 2-5 5 0 3 3 6 9 6 6 0 9-3 9-6Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">PralaySetu</h3>
              </div>
              <p className="text-gray-300">
                Bridging Crisis to Safety - Your reliable partner in disaster management and emergency response.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-300 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="hover:text-blue-300 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="hover:text-blue-300 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="hover:text-blue-300 transition-colors">
                  <Youtube size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Our Services</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Responder Network</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Disaster Resources</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Latest Updates</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Safety Tips</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Training Resources</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin size={20} className="flex-shrink-0 mt-1 text-blue-300" />
                  <span className="text-gray-300">123 Emergency Avenue, Safety District, India</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone size={20} className="flex-shrink-0 text-blue-300" />
                  <span className="text-gray-300">Emergency: 1800-HELP-NOW</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail size={20} className="flex-shrink-0 text-blue-300" />
                  <span className="text-gray-300">info@pralaysetu.org</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Middle section with download app buttons */}
          {/* <div className="py-8 border-t border-b border-blue-800/50"> */}
            {/* <div className="flex flex-col md:flex-row justify-between items-center gap-6"> */}
              {/* <div>
                <h4 className="text-lg font-medium mb-2">Download Our Mobile App</h4>
                <p className="text-gray-300 text-sm">Stay prepared with real-time alerts and emergency assistance on your phone.</p>
              </div> */}
              {/* <div className="flex flex-wrap gap-4">
                <a href="#" className="bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors flex items-center space-x-3 rounded-lg px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5 12c0 .3-.2.5-.5.5h-10c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h10c.3 0 .5.2.5.5zm-5-4c0 .3-.2.5-.5.5h-5c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h5c.3 0 .5.2.5.5zm5 8c0 .3-.2.5-.5.5h-10c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h10c.3 0 .5.2.5.5zm1.7-12h-14.4c-.7 0-1.3.6-1.3 1.3v13.4c0 .7.6 1.3 1.3 1.3h14.4c.7 0 1.3-.6 1.3-1.3v-13.4c0-.7-.6-1.3-1.3-1.3zm-14.4 1h14.4c.2 0 .3.1.3.3v13.4c0 .2-.1.3-.3.3h-14.4c-.2 0-.3-.1-.3-.3v-13.4c0-.2.1-.3.3-.3z" />
                  </svg>
                  <div>
                    <div className="text-xs">Get it on</div>
                    <div className="font-medium">Google Play</div>
                  </div>
                </a>
                <a href="#" className="bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors flex items-center space-x-3 rounded-lg px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53-1.71-2.52-3.03-7.02-1.27-10.14.87-1.5 2.43-2.45 4.12-2.48 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83l.01.03zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="font-medium">App Store</div>
                  </div>
                </a>
              </div> */}
            {/* </div> */}
          {/* </div> */}

          {/* Bottom section with copyright and additional links */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="text-sm text-gray-300 mb-4 md:mb-0">
              © 2025 PralaySetu. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-gray-300 justify-start md:justify-end">
              <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/" className="hover:text-white transition-colors">Cookie Policy</Link>
              <Link to="/" className="hover:text-white transition-colors">Disclaimer</Link>
              <Link to="/" className="hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );

}

export default HomePage;