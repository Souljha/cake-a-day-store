
import React, { useState, useEffect } from 'react';
import { PastOrder } from '../types';

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<PastOrder[]>([]);

  useEffect(() => {
    if (isOpen) {
      const storedOrders = JSON.parse(localStorage.getItem('cakeADayOrders') || '[]');
      // Sort orders by date descending (most recent first)
      storedOrders.sort((a: PastOrder, b: PastOrder) => new Date(b.id).getTime() - new Date(a.id).getTime());
      setOrders(storedOrders);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl m-4 transform transition-all duration-300 scale-100 relative max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Order History</h3>
        <div className="overflow-y-auto pr-4 -mr-4">
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-pink-50 p-6 rounded-lg shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 border-b border-pink-200 pb-3">
                    <div className="mb-2 sm:mb-0">
                      <p className="font-semibold text-lg text-gray-800">Order from {order.date}</p>
                      <p className="text-sm text-gray-500">ID: #{order.id.slice(-6).toUpperCase()}</p>
                    </div>
                    <p className="font-bold text-2xl text-pink-600">R{order.total.toFixed(2)}</p>
                  </div>
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-gray-700">Items:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-gray-700 ml-2">
                        <span>{item.quantity} &times; {item.name}</span>
                        {typeof item.price === 'number' && 
                          <span>R{(item.quantity * item.price).toFixed(2)}</span>
                        }
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-pink-200">
                    <p className="font-semibold text-gray-700">Delivered to: {order.customerInfo.name}</p>
                    <p className="text-sm text-gray-600">{order.customerInfo.address}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-gray-900">No past orders</h3>
              <p className="mt-1 text-gray-500">You haven't placed any orders yet. Time to treat yourself!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
