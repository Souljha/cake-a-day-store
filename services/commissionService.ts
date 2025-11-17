import { db } from './firebaseService';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, orderBy } from 'firebase/firestore';

export interface CommissionData {
  id: string;
  month: string; // Format: "2025-09"
  monthName: string; // Format: "September 2025"
  retainer: number; // Fixed monthly retainer
  commissionRate: number; // Commission percentage (0.02 = 2%)
  totalOrders: number;
  totalRevenue: number;
  commissionEarned: number;
  totalDue: number; // retainer + commission
  status: 'pending' | 'paid';
  dateCreated: Date;
  datePaid?: Date;
  orders: string[]; // Array of order IDs included in this month
}

// Commission configuration
const MONTHLY_RETAINER = 500; // R500 per month
const COMMISSION_RATE = 0.02; // 2%
const DEVELOPER_NAME = "Claude Code Developer";
const DEVELOPER_EMAIL = "developer@claudecode.ai"; // Replace with your email

export const calculateCommission = (orderAmount: number): number => {
  return orderAmount * COMMISSION_RATE;
};

export const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

export const getMonthName = (monthString: string): string => {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

// Track commission for a completed order
export const trackCommission = async (orderId: string, orderAmount: number) => {
  try {
    const currentMonth = getCurrentMonth();
    const commissionRef = doc(db, 'commissions', currentMonth);
    
    // Get existing commission data or create new
    const commissionSnap = await getDoc(commissionRef);
    
    if (commissionSnap.exists()) {
      // Update existing commission record
      const existingData = commissionSnap.data() as CommissionData;
      
      // Don't double-count if order already included
      if (existingData.orders.includes(orderId)) {
        return;
      }
      
      const newTotalOrders = existingData.totalOrders + 1;
      const newTotalRevenue = existingData.totalRevenue + orderAmount;
      const newCommissionEarned = newTotalRevenue * COMMISSION_RATE;
      const newTotalDue = MONTHLY_RETAINER + newCommissionEarned;
      
      await updateDoc(commissionRef, {
        totalOrders: newTotalOrders,
        totalRevenue: newTotalRevenue,
        commissionEarned: newCommissionEarned,
        totalDue: newTotalDue,
        orders: [...existingData.orders, orderId]
      });
      
    } else {
      // Create new commission record for the month
      const commissionEarned = orderAmount * COMMISSION_RATE;
      const totalDue = MONTHLY_RETAINER + commissionEarned;
      
      const newCommissionData: CommissionData = {
        id: currentMonth,
        month: currentMonth,
        monthName: getMonthName(currentMonth),
        retainer: MONTHLY_RETAINER,
        commissionRate: COMMISSION_RATE,
        totalOrders: 1,
        totalRevenue: orderAmount,
        commissionEarned: commissionEarned,
        totalDue: totalDue,
        status: 'pending',
        dateCreated: new Date(),
        orders: [orderId]
      };
      
      await setDoc(commissionRef, newCommissionData);
    }
    
    console.log(`Commission tracked for order ${orderId}: R${orderAmount * COMMISSION_RATE}`);
    
  } catch (error) {
    console.error('Error tracking commission:', error);
  }
};

// Get commission data for a specific month
export const getCommissionForMonth = async (month: string): Promise<CommissionData | null> => {
  try {
    const commissionRef = doc(db, 'commissions', month);
    const commissionSnap = await getDoc(commissionRef);
    
    if (commissionSnap.exists()) {
      return commissionSnap.data() as CommissionData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting commission data:', error);
    return null;
  }
};

// Get all commission records
export const getAllCommissions = async (): Promise<CommissionData[]> => {
  try {
    const commissionsRef = collection(db, 'commissions');
    const q = query(commissionsRef, orderBy('month', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const commissions: CommissionData[] = [];
    querySnapshot.forEach((doc) => {
      commissions.push(doc.data() as CommissionData);
    });
    
    return commissions;
  } catch (error) {
    console.error('Error getting all commissions:', error);
    return [];
  }
};

// Mark commission as paid
export const markCommissionPaid = async (month: string): Promise<boolean> => {
  try {
    const commissionRef = doc(db, 'commissions', month);
    await updateDoc(commissionRef, {
      status: 'paid',
      datePaid: new Date()
    });
    
    console.log(`Commission for ${month} marked as paid`);
    return true;
  } catch (error) {
    console.error('Error marking commission as paid:', error);
    return false;
  }
};

// Get current month's commission summary
export const getCurrentMonthSummary = async () => {
  const currentMonth = getCurrentMonth();
  const commissionData = await getCommissionForMonth(currentMonth);
  
  if (!commissionData) {
    return {
      month: getMonthName(currentMonth),
      retainer: MONTHLY_RETAINER,
      totalOrders: 0,
      totalRevenue: 0,
      commissionEarned: 0,
      totalDue: MONTHLY_RETAINER,
      status: 'pending' as const
    };
  }
  
  return {
    month: commissionData.monthName,
    retainer: commissionData.retainer,
    totalOrders: commissionData.totalOrders,
    totalRevenue: commissionData.totalRevenue,
    commissionEarned: commissionData.commissionEarned,
    totalDue: commissionData.totalDue,
    status: commissionData.status
  };
};

export const COMMISSION_CONFIG = {
  retainer: MONTHLY_RETAINER,
  rate: COMMISSION_RATE,
  developer: DEVELOPER_NAME,
  email: DEVELOPER_EMAIL
};