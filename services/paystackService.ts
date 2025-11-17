import { PastOrder } from '../types';

// Extend Window interface to include PaystackPop
declare global {
  interface Window {
    PaystackPop?: any;
  }
}

export interface PaystackConfig {
  key: string; // Public key
  reference: string;
  email: string;
  amount: number; // Amount in kobo (ZAR cents)
  currency: 'ZAR';
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
  callback?: (response: any) => void;
  onClose?: () => void;
}

// Load Paystack inline script
export const loadPaystackScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.body.appendChild(script);
  });
};

export const createPaystackPayment = async (
  order: PastOrder,
  onSuccess: (response: any) => void,
  onCancel: () => void
): Promise<void> => {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  console.log('Paystack Public Key:', publicKey ? 'Key found' : 'KEY MISSING!');
  console.log('Environment check:', import.meta.env);

  if (!publicKey) {
    throw new Error('Paystack public key not configured. Please check your .env.local file.');
  }

  // Ensure Paystack script is loaded
  await loadPaystackScript();

  if (!window.PaystackPop) {
    throw new Error('Paystack library failed to load');
  }

  // Convert amount to kobo (Paystack requires amount in kobo for ZAR)
  const amountInKobo = Math.round(order.total * 100);

  console.log('Payment details:', {
    reference: order.id,
    amount: amountInKobo,
    currency: 'ZAR',
    publicKey: publicKey.substring(0, 10) + '...'
  });

  // Generate customer email
  const customerEmail = order.customerInfo.contact.includes('@')
    ? order.customerInfo.contact
    : `${order.customerInfo.contact.replace(/\s/g, '')}@customer.cakeaday.store`;

  console.log('Setting up Paystack with:', {
    key: publicKey,
    reference: order.id,
    email: customerEmail,
    amount: amountInKobo
  });

  const config: PaystackConfig = {
    key: publicKey, // Paystack uses 'key' not 'publicKey'
    reference: order.id,
    email: customerEmail,
    amount: amountInKobo,
    currency: 'ZAR',
    metadata: {
      custom_fields: [
        {
          display_name: 'Customer Name',
          variable_name: 'customer_name',
          value: order.customerInfo.name
        },
        {
          display_name: 'Contact Number',
          variable_name: 'contact_number',
          value: order.customerInfo.contact
        },
        {
          display_name: 'Delivery Address',
          variable_name: 'delivery_address',
          value: order.customerInfo.address
        },
        {
          display_name: 'Order ID',
          variable_name: 'order_id',
          value: order.id
        }
      ]
    },
    callback: onSuccess,
    onClose: onCancel
  };

  console.log('Full config object:', config);

  // Initialize Paystack popup
  const handler = window.PaystackPop.setup(config);
  handler.openIframe();
};

export const verifyPaystackPayment = async (reference: string): Promise<boolean> => {
  // In a production app, you would verify this on your backend
  // For now, we'll trust the client-side callback
  console.log('Payment reference:', reference);
  return true;
};
