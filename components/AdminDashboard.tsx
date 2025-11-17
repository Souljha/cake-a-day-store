import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, getOrdersByStatus, type FirebaseOrder, type OrderStatus } from '../services/firebaseService';
import { getCurrentMonthSummary, COMMISSION_CONFIG } from '../services/commissionService';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [orders, setOrders] = useState<FirebaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [commissionData, setCommissionData] = useState<any>(null);
  const [showCommissions, setShowCommissions] = useState(false);

  // Load orders and commission data from Firebase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [allOrders, commissionSummary] = await Promise.all([
          getAllOrders(),
          getCurrentMonthSummary()
        ]);
        setOrders(allOrders);
        setCommissionData(commissionSummary);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [refreshKey]);

  // Filter orders based on status
  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  // Update order status
  const handleStatusUpdate = async (firestoreId: string, newStatus: OrderStatus) => {
    try {
      const success = await updateOrderStatus(firestoreId, newStatus);
      if (success) {
        // Refresh orders after update
        setRefreshKey(prev => prev + 1);
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating order status');
    }
  };

  // Get status color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'ready': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Calculate summary stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="Cake A Day" className="h-8 w-auto" />
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">📊</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">⏳</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.pending}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">👨‍🍳</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Preparing</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.preparing}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Delivered</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.delivered}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-pink-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">💰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                      <dd className="text-lg font-medium text-gray-900">R{stats.totalRevenue.toFixed(2)}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Commission Section */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Developer Commission</h3>
                  <p className="text-sm text-gray-500">Monthly maintenance & development fees</p>
                </div>
                <button
                  onClick={() => setShowCommissions(!showCommissions)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showCommissions ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            </div>
            
            {showCommissions && commissionData && (
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Monthly Retainer</dt>
                    <dd className="text-xl font-bold text-gray-900">R{commissionData.retainer.toFixed(2)}</dd>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Commission Rate</dt>
                    <dd className="text-xl font-bold text-gray-900">{(COMMISSION_CONFIG.rate * 100).toFixed(1)}%</dd>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Commission Earned</dt>
                    <dd className="text-xl font-bold text-green-600">R{commissionData.commissionEarned.toFixed(2)}</dd>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <dt className="text-sm font-medium text-blue-700">Total Due ({commissionData.month})</dt>
                    <dd className="text-xl font-bold text-blue-900">R{commissionData.totalDue.toFixed(2)}</dd>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Based on:</span> {commissionData.totalOrders} delivered orders totaling R{commissionData.totalRevenue.toFixed(2)}</p>
                  <p><span className="font-medium">Developer:</span> {COMMISSION_CONFIG.developer}</p>
                  <p><span className="font-medium">Payment Status:</span> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                      commissionData.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {commissionData.status === 'paid' ? 'Paid' : 'Pending Payment'}
                    </span>
                  </p>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Note:</strong> Commission is automatically calculated when orders are marked as "Delivered". 
                    Payment is due monthly for maintenance and ongoing support.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium ${filterStatus === 'all' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All Orders ({orders.length})
              </button>
              {(['pending', 'confirmed', 'preparing', 'ready', 'delivered'] as OrderStatus[]).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize ${
                    filterStatus === status 
                      ? 'bg-pink-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status} ({orders.filter(o => o.status === status).length})
                </button>
              ))}
            </div>

            <button
              onClick={() => setRefreshKey(prev => prev + 1)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              🔄 Refresh Orders
            </button>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">
                  {filterStatus === 'all' ? 'No orders have been placed yet.' : `No ${filterStatus} orders found.`}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.firestoreId} className="bg-white rounded-lg shadow p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-center space-x-3 mb-2 lg:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Customer Info */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Name:</strong> {order.customerInfo.name}</p>
                        <p><strong>Contact:</strong> 
                          <a href={`tel:${order.customerInfo.contact}`} className="text-pink-600 hover:underline ml-1">
                            {order.customerInfo.contact}
                          </a>
                        </p>
                        <p><strong>Address:</strong> {order.customerInfo.address}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        {order.items.map((item, index) => (
                          <p key={index}>
                            {item.quantity}x {item.name} - R{(typeof item.price === 'number' ? item.price : parseFloat(item.price.toString().replace(/[^\d.]/g, ''))).toFixed(2)}
                          </p>
                        ))}
                        <p className="font-semibold text-gray-900 pt-2 border-t">
                          Total: R{order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(order.firestoreId!, 'confirmed')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        ✅ Confirm Order
                      </button>
                    )}
                    
                    {(order.status === 'confirmed' || order.status === 'pending') && (
                      <button
                        onClick={() => handleStatusUpdate(order.firestoreId!, 'preparing')}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700"
                      >
                        👨‍🍳 Start Preparing
                      </button>
                    )}
                    
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusUpdate(order.firestoreId!, 'ready')}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
                      >
                        🎂 Ready for Pickup/Delivery
                      </button>
                    )}
                    
                    {(order.status === 'ready' || order.status === 'preparing') && (
                      <button
                        onClick={() => handleStatusUpdate(order.firestoreId!, 'delivered')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        🚚 Mark as Delivered
                      </button>
                    )}

                    <a
                      href={`https://api.whatsapp.com/send?phone=${order.customerInfo.contact.replace(/[^\d]/g, '')}&text=Hi ${order.customerInfo.name}! Your cake order ${order.id} is ${order.status}. Thank you for choosing Cake A Day! 🎂`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600"
                    >
                      💬 WhatsApp Customer
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;