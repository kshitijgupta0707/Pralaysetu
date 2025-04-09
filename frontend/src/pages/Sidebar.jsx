import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar = ({ 
  isOpen, 
  setIsOpen, 
  authUser, 
  actingAs, 
  language, 
  setLanguage,
  logout 
}) => {
  const closeSheet = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="p-0 w-72">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 2c1 0 3 2 3 4v1a3 3 0 1 1-6 0V6c0-2 2-4 3-4Z" />
                <path d="M10 5c1 0 3 2 3 4v1a3 3 0 1 1-6 0V9c0-2 2-4 3-4Z" />
                <path d="M4 8c1 0 3 2 3 4v1a3 3 0 1 1-6 0v-1c0-2 2-4 3-4Z" />
                <path d="M22 19c0-3-2.5-5-5-5-2 0-3.5 1.5-4 2-1.5-2-3-2-4-2-2.5 0-5 2-5 5 0 3 3 6 9 6 6 0 9-3 9-6Z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-800">PralaySetu</span>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="py-4">
            {/* Navigation Links */}
            <div className="px-3 py-2">
              <h3 className="mb-2 px-4 text-sm font-semibold text-gray-500">Navigation</h3>
              <nav className="space-y-1">
                <a 
                  href="#features" 
                  onClick={closeSheet}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 3-8 5v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path>
                  </svg>
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  onClick={closeSheet}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20v-6M6 20V10M18 20V4"></path>
                  </svg>
                  How It Works
                </a>
                <a 
                  href="/#about" 
                  onClick={closeSheet}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                  About
                </a>
                <a 
                  href="/#contact" 
                  onClick={closeSheet}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  Contact
                </a>
              </nav>
            </div>
            
            <Separator className="my-4" />
            
            {/* Portal Access Section - Conditional based on user role */}
            {authUser && (
              <div className="px-3 py-2">
                <h3 className="mb-2 px-4 text-sm font-semibold text-gray-500">Portal Access</h3>
                <nav className="space-y-1">
                  {authUser && authUser.registerAs === "None" && actingAs === "User" && (
                    <Link 
                      to="/user-dashboard" 
                      onClick={closeSheet}
                      className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      User Portal
                    </Link>
                  )}
                  
                  {authUser && authUser.registerAs === "None" && actingAs === "Responder" && (
                    <Link 
                      to="/responder-dashboard" 
                      onClick={closeSheet}
                      className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m18 16 4-4-4-4"></path>
                        <path d="m6 8-4 4 4 4"></path>
                        <path d="m14.5 4-5 16"></path>
                      </svg>
                      Responder Portal
                    </Link>
                  )}
                  
                  {authUser && authUser.registerAs === "Admin" && (
                    <Link 
                      to="/admin-dashboard" 
                      onClick={closeSheet}
                      className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 3.32 3.32 2.5 2.5 0 0 0 3.62-5.86Z"></path>
                        <path d="m8 8 2.5 2.5"></path>
                        <path d="M19.5 9.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 3.32 3.32 2.5 2.5 0 0 0 3.62-5.86Z"></path>
                        <path d="m15.5 15.5 2.5 2.5"></path>
                        <path d="M12 19.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 3.32 3.32 2.5 2.5 0 0 0 3.62-5.86Z"></path>
                        <path d="m8 22 2.5-2.5"></path>
                      </svg>
                      Admin Portal
                    </Link>
                  )}
                </nav>
                
                <Separator className="my-4" />
              </div>
            )}
            
            {/* Settings Section */}
            <div className="px-3 py-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="settings" className="border-none">
                  <AccordionTrigger className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      Settings
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-12 pr-4 py-2 space-y-4">
                      {/* Language Selector */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white"
                        >
                          <option value="en">English</option>
                          <option value="hi">हिंदी</option>
                          {/* Add more language options as needed */}
                        </select>
                      </div>
                      
                      {/* Theme or other settings could go here */}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          {/* Account Actions at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 border-t p-4 bg-white">
            {!authUser ? (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/login" 
                  onClick={closeSheet}
                  className="flex justify-center items-center px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-600 rounded-md font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  onClick={closeSheet}
                  className="w-full"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Sign up
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <Button 
                  onClick={() => {
                    logout();
                    closeSheet();
                  }} 
                  variant="destructive" 
                  className="w-full"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="mr-2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;