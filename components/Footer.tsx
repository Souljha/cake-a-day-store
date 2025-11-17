
import React, { useState } from 'react';
import { ADDRESS } from '../constants';
import AdminLogin from './AdminLogin';

interface FooterProps {
    onAdminAccess: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminAccess }) => {
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    const handleLogoClick = () => {
        setClickCount(prev => prev + 1);
        
        // Reset counter after 3 seconds
        setTimeout(() => setClickCount(0), 3000);
        
        // If clicked 5 times quickly, show admin login
        if (clickCount >= 4) {
            setShowAdminLogin(true);
            setClickCount(0);
        }
    };

    const handleAdminLogin = () => {
        setShowAdminLogin(false);
        onAdminAccess();
    };

    return (
        <>
            <footer className="bg-gray-800 text-white">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                        <div>
                            <div className="flex justify-center md:justify-start mb-2">
                                <img 
                                    src="/logo.png" 
                                    alt="Cake A Day Logo" 
                                    className="h-10 w-auto cursor-pointer" 
                                    onClick={handleLogoClick}
                                    title={clickCount > 2 ? `${5 - clickCount} more clicks for admin` : ''}
                                />
                            </div>
                            <p className="text-gray-400">Bringing sweetness to Durban, one slice at a time.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Quick Links</h4>
                            <ul>
                                <li><a href="#menu" className="text-gray-400 hover:text-pink-400">Menu</a></li>
                                <li><a href="#designer" className="text-gray-400 hover:text-pink-400">AI Designer</a></li>
                                <li><a href="#contact" className="text-gray-400 hover:text-pink-400">Contact Us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Visit Us</h4>
                            <p className="text-gray-400">{ADDRESS}</p>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500">
                        <p>&copy; {new Date().getFullYear()} Cake A Day. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>

            {showAdminLogin && (
                <AdminLogin 
                    onLogin={handleAdminLogin}
                    onClose={() => setShowAdminLogin(false)}
                />
            )}
        </>
    );
};

export default Footer;
