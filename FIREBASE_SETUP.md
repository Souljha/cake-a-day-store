# Firebase Order Tracking Setup

## Step 1: Firebase Project Setup

1. Go to https://console.firebase.google.com/
2. Create new project "cake-a-day"
3. Enable Firestore Database
4. Get your config keys

## Step 2: Install Firebase

```bash
npm install firebase
```

## Step 3: Environment Variables

Add to `.env.local`:
```bash
# Existing variables...
GEMINI_API_KEY=...
PAYFAST_MERCHANT_ID=...

# Add Firebase config
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=cake-a-day.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cake-a-day
VITE_FIREBASE_STORAGE_BUCKET=cake-a-day.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Step 4: Firebase Service

Create `services/firebaseService.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { PastOrder } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save order to Firebase (you can see these!)
export const saveOrderToFirebase = async (order: PastOrder) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      status: 'pending',
      createdAt: new Date(),
      paymentStatus: 'pending'
    });
    console.log('Order saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving order: ', error);
    throw error;
  }
};

// Get all orders (for admin dashboard)
export const getAllOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      firestoreId: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting orders: ', error);
    return [];
  }
};
```

## Step 5: Update Payment Flow

In `components/Modal.tsx`, add Firebase saving:

```typescript
import { saveOrderToFirebase } from '../services/firebaseService';

// In handlePayFastPayment function, after localStorage:
localStorage.setItem('cakeADayOrders', JSON.stringify([...existingOrders, newOrder]));

// Add this line:
await saveOrderToFirebase(newOrder);
```

## Step 6: Admin Dashboard (Simple)

Create `admin.html` (separate page for you):

```html
<!DOCTYPE html>
<html>
<head>
    <title>Cake A Day - Orders</title>
    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js"></script>
</head>
<body>
    <h1>Incoming Orders</h1>
    <div id="orders"></div>
    
    <script>
        // Your Firebase config here
        // Load and display orders
        // Add buttons to mark orders as "preparing", "delivered"
    </script>
</body>
</html>
```

## Benefits:

✅ **You See All Orders**: Real-time order notifications
✅ **Customer History**: Track repeat customers  
✅ **Order Status**: Update progress (pending → preparing → delivered)
✅ **Sales Analytics**: Revenue tracking, popular items
✅ **PayFast Verification**: Webhook integration possible
✅ **Mobile Friendly**: Check orders on phone
✅ **Backup**: Never lose order data
✅ **Growth Ready**: Scales with your business

## Next Steps:

1. Set up Firebase project (15 minutes)
2. Install and configure (30 minutes)  
3. Test with sample order (15 minutes)
4. Create admin dashboard (2 hours)
5. Add PayFast webhook (1 hour)

Total setup: Half a day, lifetime of order management!