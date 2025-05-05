import React from 'react'
import { useAuthStore } from '@/store/useAuthstore';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useLocation } from 'react-router-dom';
import { Button } from './ui/button';

const Header = ({ language, setLanguage }) => {
    const { authUser, logout , actingAs } = useAuthStore()
    const [isOpen, setIsOpen] = useState(false);
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth'     });
      };
      
 


    const location = useLocation();
    const isHomePage = location.pathname === "/";


    return (
        <header className="sticky top-0 sm:z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200 w-[100%] ">
            {<Sidebar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                authUser={authUser}
                actingAs={actingAs}
                language={language}
                setLanguage={setLanguage}
                logout={logout}
            />}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div onClick={scrollToTop} className="flex items-center">
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
                        {isHomePage && (
                            <>
                                <a href="#features" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block">
                                    Features
                                </a>
                                <a href="#how-it-works" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block">
                                    How It Works
                                </a>
                                <a href="#about" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block">
                                    About
                                </a>
                                <a href="#contact" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block">
                                    Contact
                                </a>
                                <div className="relative group hidden lg:block">
                                    <button className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                                        Epicentra
                                    </button>
                                    <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 z-50">
                                        <Link to="/earthquake" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Earthquake
                                        </Link>
                                        <Link to="/flood" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Flood
                                        </Link>
                                        <Link to="/tsunami" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Tsunami
                                        </Link>
                                    </div>
                                </div>
                                {authUser && authUser.registerAs == "None" && actingAs == "User" && <Link to="/user-dashboard" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block ">
                                    User Portal
                                </Link>}
                                {authUser && authUser.registerAs == "None" && actingAs == "Responder" && <Link to="/responder-dashboard" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block">
                                    Responder Portal
                                </Link>}
                                {authUser && authUser.registerAs == "Admin" && <Link to="/admin-dashboard" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block ">
                                    Admin Portal
                                </Link>}
                                {authUser && authUser.registerAs == "NGO" && <Link to="/ngo-dashboard" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors hidden lg:block ">
                                    NGO Portal
                                </Link>}
                            </>
                        )}



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
    )
}

export default Header