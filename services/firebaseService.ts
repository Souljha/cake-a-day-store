import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { PastOrder } from '../types';
import { trackCommission } from './commissionService';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Order status types for business tracking
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Enhanced order interface for Firebase
export interface FirebaseOrder extends PastOrder {
  firestoreId?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  estimatedDelivery?: string;
}

/**
 * Save order to Firebase for business tracking
 * This allows you to see all orders in your Firebase console and admin dashboard
 */
export const saveOrderToFirebase = async (order: PastOrder): Promise<string | null> => {
  try {
    const firebaseOrder: Omit<FirebaseOrder, 'firestoreId'> = {
      ...order,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: 'Order placed via website'
    };

    const docRef = await addDoc(collection(db, 'orders'), firebaseOrder);
    console.log('✅ Order saved to Firebase with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving order to Firebase:', error);
    
    // Don't block the customer's order if Firebase fails
    // The order is still saved locally and sent via WhatsApp
    return null;
  }
};

/**
 * Get all orders (for your admin dashboard)
 * You can use this to build a simple admin interface
 */
export const getAllOrders = async (): Promise<FirebaseOrder[]> => {
  try {
    const q = query(
      collection(db, 'orders'), 
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const orders: FirebaseOrder[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        ...data,
        firestoreId: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as FirebaseOrder);
    });

    return orders;
  } catch (error) {
    console.error('❌ Error getting orders from Firebase:', error);
    return [];
  }
};

/**
 * Update order status (for when you start preparing, complete delivery, etc.)
 */
export const updateOrderStatus = async (
  firestoreId: string, 
  status: OrderStatus, 
  paymentStatus?: PaymentStatus,
  notes?: string
): Promise<boolean> => {
  try {
    const orderRef = doc(db, 'orders', firestoreId);
    
    const updateData: any = {
      status,
      updatedAt: new Date()
    };
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    
    if (notes) {
      updateData.notes = notes;
    }

    await updateDoc(orderRef, updateData);
    console.log('✅ Order status updated:', status);
    
    // Track commission when order is delivered
    if (status === 'delivered') {
      // Get the order to track commission
      const orders = await getAllOrders();
      const order = orders.find(o => o.firestoreId === firestoreId);
      if (order) {
        await trackCommission(order.id, order.total);
        console.log('✅ Commission tracked for delivered order:', order.id);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    return false;
  }
};

/**
 * Get orders by status (e.g., all pending orders)
 */
export const getOrdersByStatus = async (status: OrderStatus): Promise<FirebaseOrder[]> => {
  try {
    const orders = await getAllOrders();
    return orders.filter(order => order.status === status);
  } catch (error) {
    console.error('❌ Error filtering orders by status:', error);
    return [];
  }
};

// Test Firebase connection
export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Firebase connection test',
      timestamp: new Date()
    });
    console.log('✅ Firebase connection successful, test doc ID:', testDoc.id);
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};