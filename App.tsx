
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import CustomCakeDesigner from './components/CustomCakeDesigner';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Modal from './components/Modal';
import OrderHistory from './components/OrderHistory';
import AdminDashboard from './components/AdminDashboard';
import { OrderItem } from './types';

const App: React.FC = () => {
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
    const [cartItems, setCartItems] = useState<OrderItem[]>([]);
    const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancelled' | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);
    const designerRef = useRef<HTMLDivElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);

    // Check for payment status and admin access in URL parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const payment = urlParams.get('payment');
        const orderId = urlParams.get('order_id');
        const admin = urlParams.get('admin');
        
        // Check for admin access
        if (admin === 'brendon2025') {
            setIsAdminDashboardOpen(true);
            // Clean up URL but keep admin access
            window.history.replaceState({}, document.title, window.location.pathname + '?admin=brendon2025');
        }
        
        if (payment && orderId) {
            if (payment === 'success') {
                setPaymentStatus('success');
                setCartItems([]); // Clear cart on successful payment
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } else if (payment === 'cancelled') {
                setPaymentStatus('cancelled');
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, []);

    const handleNavigate = (section: 'home' | 'menu' | 'designer' | 'contact') => {
        let ref;
        switch(section) {
            case 'menu': ref = menuRef; break;
            case 'designer': ref = designerRef; break;
            case 'contact': ref = contactRef; break;
            default:
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
        }
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAddToCart = (itemToAdd: OrderItem) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.name === itemToAdd.name);
            if (existingItem) {
                return prevItems.map(item =>
                    item.name === itemToAdd.name
                        ? { ...item, quantity: item.quantity + itemToAdd.quantity }
                        : item
                );
            } else {
                return [...prevItems, itemToAdd];
            }
        });
    };
    
    const handleClearCart = () => {
        setCartItems([]);
    };

    const handleCloseModal = () => {
        setIsCheckoutModalOpen(false);
    };

    const handleCheckoutSuccess = () => {
        setCartItems([]);
        handleCloseModal();
    };
    
    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="bg-white">
            <Header 
                onNavigate={handleNavigate} 
                cartItemCount={cartItemCount}
                onCartClick={() => setIsCheckoutModalOpen(true)}
                onHistoryClick={() => setIsHistoryModalOpen(true)}
            />
            <main>
                <Hero onCTAClick={() => handleNavigate('designer')} />
                <div ref={menuRef}>
                    <Menu onAddToCart={handleAddToCart} />
                </div>
                <div ref={designerRef}>
                    <CustomCakeDesigner onAddToCart={handleAddToCart} />
                </div>
                <div ref={contactRef}>
                    <Contact />
                </div>
            </main>
            <Footer onAdminAccess={() => setIsAdminDashboardOpen(true)} />
            <Modal 
                isOpen={isCheckoutModalOpen}
                onClose={handleCloseModal}
                items={cartItems}
                onCheckoutSuccess={handleCheckoutSuccess}
                onClearCart={handleClearCart}
            />
            <OrderHistory
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
            />
            
            {/* Payment Status Notifications */}
            {paymentStatus === 'success' && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
                        <p className="text-gray-600 mb-6">Thank you for your order! We will contact you shortly to confirm delivery details.</p>
                        <button 
                            onClick={() => setPaymentStatus(null)} 
                            className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-300"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}
            
            {paymentStatus === 'cancelled' && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h3>
                        <p className="text-gray-600 mb-6">Your payment was cancelled. Your items are still in your cart if you'd like to try again.</p>
                        <div className="space-y-3">
                            <button 
                                onClick={() => {
                                    setPaymentStatus(null);
                                    setIsCheckoutModalOpen(true);
                                }} 
                                className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-300"
                            >
                                Try Payment Again
                            </button>
                            <button 
                                onClick={() => setPaymentStatus(null)} 
                                className="w-full text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Admin Dashboard */}
            {isAdminDashboardOpen && (
                <AdminDashboard onClose={() => setIsAdminDashboardOpen(false)} />
            )}
        </div>
    );
};

export default App;
