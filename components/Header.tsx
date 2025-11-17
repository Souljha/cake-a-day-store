
import React, { useState } from 'react';
import { PHONE_NUMBER } from '../constants';

interface HeaderProps {
    onNavigate: (section: 'home' | 'menu' | 'designer' | 'contact') => void;
    cartItemCount: number;
    onCartClick: () => void;
    onHistoryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, cartItemCount, onCartClick, onHistoryClick }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleMobileNavAction = (action: () => void) => {
        action();
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="cursor-pointer" onClick={() => handleMobileNavAction(() => onNavigate('home'))}>
                    <img src="/logo.png" alt="Cake A Day Logo" className="h-12 w-auto" />
                </div>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <button onClick={() => onNavigate('menu')} className="text-gray-600 hover:text-pink-600 transition-colors duration-300 font-medium">Menu</button>
                    <button onClick={() => onNavigate('designer')} className="text-gray-600 hover:text-pink-600 transition-colors duration-300 font-medium">Design a Cake</button>
                    <button onClick={onHistoryClick} className="text-gray-600 hover:text-pink-600 transition-colors duration-300 font-medium">Order History</button>
                    <button onClick={() => onNavigate('contact')} className="text-gray-600 hover:text-pink-600 transition-colors duration-300 font-medium">Contact</button>
                </nav>

                <div className="flex items-center space-x-2 md:space-x-4">
                    <a href={`tel:${PHONE_NUMBER}`} className="hidden md:inline-block bg-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-700 transition-transform duration-300 hover:scale-105">
                        Order Now
                    </a>
                    <button onClick={onCartClick} className="relative text-gray-600 hover:text-pink-600 transition-colors duration-300 p-2" aria-label={`View cart with ${cartItemCount} items`}>
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        {cartItemCount > 0 && (
                            <span className="absolute top-0 right-0 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                    
                    {/* Hamburger Menu Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-600 hover:text-pink-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Panel */}
            <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
                <nav className="px-4 pt-2 pb-4 space-y-2 bg-white border-t border-gray-200">
                    <button onClick={() => handleMobileNavAction(() => onNavigate('menu'))} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50">Menu</button>
                    <button onClick={() => handleMobileNavAction(() => onNavigate('designer'))} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50">Design a Cake</button>
                    <button onClick={() => handleMobileNavAction(onHistoryClick)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50">Order History</button>
                    <button onClick={() => handleMobileNavAction(() => onNavigate('contact'))} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50">Contact</button>
                    <a href={`tel:${PHONE_NUMBER}`} className="block w-full text-center mt-2 bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition-transform duration-300 hover:scale-105">
                        Order Now
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Header;