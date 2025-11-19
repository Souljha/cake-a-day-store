
import React, { useState, useEffect } from 'react';
import { OrderItem, PastOrder } from '../types';
import Spinner from './Spinner';
import { createPaystackPayment } from '../services/paystackService';
import { notifyViaWhatsApp } from '../services/whatsAppService';
import { saveOrderToFirebase } from '../services/firebaseService';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onCheckoutSuccess: () => void;
  onClearCart: () => void;
}

type ModalStep = 'details' | 'payment' | 'success';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, items, onCheckoutSuccess, onClearCart }) => {
  const [step, setStep] = useState<ModalStep>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [errors, setErrors] = useState({ name: '', contact: '', address: '' });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    // Reset to details step whenever the modal is opened
    if (isOpen) {
      setStep('details');
      setIsProcessing(false);
      setShowClearConfirm(false);
      // Don't clear customer details if they are just going back and forth
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (step === 'success') {
      onCheckoutSuccess();
    } else {
      onClose();
    }
  };

  const getPriceAsNumber = (price: string | number): number => {
    if (typeof price === 'number') {
        return price;
    }
    // Handle price ranges like "R250 - R500" by taking the lower bound
    const match = price.match(/R(\d+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const subtotal = items.reduce((acc, item) => acc + getPriceAsNumber(item.price) * item.quantity, 0);
  const baseDeliveryFee = 80.00;
  const freeDeliveryThreshold = 500.00;
  const deliveryFee = subtotal >= freeDeliveryThreshold ? 0.00 : baseDeliveryFee;
  const total = subtotal + deliveryFee;
  
  const handleProceedToPayment = () => {
    const newErrors = { name: '', contact: '', address: '' };
    let isValid = true;

    if (!customerName.trim()) {
        newErrors.name = 'Full name is required.';
        isValid = false;
    }
    if (!contactNumber.trim()) {
        newErrors.contact = 'Contact number is required.';
        isValid = false;
    }
    if (!deliveryAddress.trim()) {
        newErrors.address = 'Delivery address is required.';
        isValid = false;
    }
    
    setErrors(newErrors);

    if (isValid) {
        setStep('payment');
    }
  };

  const handlePaystackPayment = async () => {
    setIsProcessing(true);

    try {
      // Create the order object
      const newOrder: PastOrder = {
          id: `CKD-${Date.now()}`, // More readable order ID
          date: new Date().toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' }),
          items: items,
          customerInfo: {
              name: customerName,
              contact: contactNumber,
              address: deliveryAddress
          },
          total: total,
      };

      // Save order to localStorage for customer tracking
      const existingOrders: PastOrder[] = JSON.parse(localStorage.getItem('cakeADayOrders') || '[]');
      localStorage.setItem('cakeADayOrders', JSON.stringify([...existingOrders, newOrder]));

      // Save order to Firebase for business tracking
      await saveOrderToFirebase(newOrder);

      // Send WhatsApp notification to business owner
      notifyViaWhatsApp(newOrder);

      // Initialize Paystack payment
      await createPaystackPayment(
        newOrder,
        (response) => {
          // Payment successful
          console.log('Payment successful:', response);
          setIsProcessing(false);
          setStep('success');
        },
        () => {
          // Payment cancelled
          console.log('Payment cancelled by user');
          setIsProcessing(false);
          alert('Payment was cancelled. Your order has been saved and you can pay on delivery.');
        }
      );

    } catch (error) {
      console.error('Paystack payment error:', error);
      setIsProcessing(false);

      // Show error message or fallback to phone order
      alert('Payment system temporarily unavailable. Please call us to complete your order: +27 73 599 9972');
    }
  };

  const handleManualOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Create the order object
      const newOrder: PastOrder = {
          id: `CKD-${Date.now()}`, 
          date: new Date().toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' }),
          items: items,
          customerInfo: {
              name: customerName,
              contact: contactNumber,
              address: deliveryAddress
          },
          total: total,
          status: 'pending' // Manual orders start as pending
      };

      // Save order to localStorage for customer tracking
      const existingOrders: PastOrder[] = JSON.parse(localStorage.getItem('cakeADayOrders') || '[]');
      localStorage.setItem('cakeADayOrders', JSON.stringify([...existingOrders, newOrder]));

      // Save order to Firebase for business tracking
      await saveOrderToFirebase(newOrder);

      // Send WhatsApp notification to business owner
      notifyViaWhatsApp(newOrder);
      
      // Show success message
      setStep('success');
      
    } catch (error) {
      console.error('Order creation error:', error);
      setIsProcessing(false);
      alert('Order creation failed. Please call us directly: +27 73 599 9972');
    }
  };

  const renderContent = () => {
    if (items.length === 0 && step !== 'success') {
        return (
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h3>
                <p className="text-gray-600 mb-6">Browse our menu to add some delicious treats!</p>
                <button onClick={onClose} className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-300">
                    Continue Shopping
                </button>
            </div>
        )
    }

    const inputClasses = "block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-gray-900";
    const errorInputClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";

    switch (step) {
      case 'details':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Your Order Summary</h3>
              {items.length > 0 && (
                <button onClick={() => setShowClearConfirm(true)} className="text-gray-500 hover:text-red-600 transition-colors p-1" title="Clear Cart">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              )}
            </div>
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2 mb-4">
              {items.map(item => (
                <div key={item.name} className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">{item.quantity} &times; {item.name}</span>
                    <span className="text-gray-900 font-semibold">R{(getPriceAsNumber(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>R{subtotal.toFixed(2)}</span>
                </div>
                {subtotal < freeDeliveryThreshold && subtotal > 0 && (
                    <div className="text-center bg-pink-100 text-pink-800 text-xs font-medium py-2 px-3 rounded-md">
                        Add R{(freeDeliveryThreshold - subtotal).toFixed(2)} more for FREE delivery!
                    </div>
                )}
                <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    {subtotal >= freeDeliveryThreshold ? (
                        <span className="font-semibold text-green-600">Free</span>
                    ) : (
                        <span>R{deliveryFee.toFixed(2)}</span>
                    )}
                </div>
                <div className="flex justify-between font-bold text-xl text-gray-800">
                    <span>Total</span>
                    <span>R{total.toFixed(2)}</span>
                </div>
            </div>
             <div className="mt-6 space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" id="name" value={customerName} onChange={e => setCustomerName(e.target.value)} className={`${inputClasses} ${errors.name && errorInputClasses}`} placeholder="e.g., Jane Doe" required />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                 <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input type="tel" id="contact" value={contactNumber} onChange={e => setContactNumber(e.target.value)} className={`${inputClasses} ${errors.contact && errorInputClasses}`} placeholder="e.g., 082 123 4567" required />
                    {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                    <input type="text" id="address" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className={`${inputClasses} ${errors.address && errorInputClasses}`} placeholder="e.g., 508 Sarnia Road, Seaview" required />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
              </div>
            <button onClick={handleProceedToPayment} className="mt-6 w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-300">
                Proceed to Payment
            </button>
          </>
        );
      case 'payment':
        return (
          <div>
            <div className="flex items-center justify-center mb-4">
              <svg className="h-12" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
                <text x="10" y="35" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#00C3F7">Paystack</text>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Secure Payment Gateway</h3>
            {isProcessing ? (
               <div className="my-8 text-center">
                 <Spinner />
                 <p className="text-gray-600 mt-4 animate-pulse">Opening Paystack secure payment...</p>
               </div>
            ) : (
                <>
                    <p className="text-gray-600 mb-4 text-center">You are about to pay for your delicious order.</p>
                    <div className="bg-gray-100 p-4 rounded-lg mb-6 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>R{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                           <span>Delivery Fee</span>
                            {subtotal >= freeDeliveryThreshold ? (
                                <span className="font-semibold text-green-600">Free</span>
                            ) : (
                                <span>R{deliveryFee.toFixed(2)}</span>
                            )}
                        </div>
                        <div className="border-t border-gray-300 my-2"></div>
                        <div className="flex justify-between font-bold text-xl text-gray-800">
                            <span>Total Amount</span>
                            <span>R{total.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <button onClick={handlePaystackPayment} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-colors duration-300 flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span>Pay with Card - R{total.toFixed(2)}</span>
                        </button>

                        <div className="text-center text-sm text-gray-500">
                            or
                        </div>

                        <button onClick={handleManualOrder} className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300">
                          Order Now - Pay on Delivery
                        </button>

                        <p className="text-xs text-center text-gray-500 mt-2">
                            We accept cash or EFT on delivery
                        </p>
                    </div>
                     <button onClick={() => setStep('details')} className="mt-2 w-full text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300">
                      Back to Summary
                    </button>
                </>
            )}
          </div>
        );
      case 'success':
        return (
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h3>
                <p className="text-gray-600 mb-6">Thank you for your order, {customerName.split(' ')[0]}! We will WhatsApp you shortly to confirm delivery details and payment method.</p>
                <button onClick={handleClose} className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-300">
                    Close
                </button>
            </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all duration-300 scale-100 relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        {renderContent()}

        {showClearConfirm && (
          <div className="absolute inset-0 bg-white bg-opacity-95 z-20 flex flex-col justify-center items-center p-8 rounded-2xl">
            <h4 className="text-xl font-bold text-gray-800 text-center mb-4">Clear Cart?</h4>
            <p className="text-gray-600 text-center mb-6">Are you sure you want to remove all items from your cart?</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowClearConfirm(false)} 
                className="px-8 py-2 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onClearCart();
                  setShowClearConfirm(false);
                }} 
                className="px-8 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
