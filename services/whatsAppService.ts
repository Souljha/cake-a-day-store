import { PastOrder } from '../types';

const WHATSAPP_BUSINESS_NUMBER = '+27683007158';

// Format order details for WhatsApp message
const formatOrderForWhatsApp = (order: PastOrder): string => {
  const orderItems = order.items.map(item => 
    `• ${item.quantity}x ${item.name} - R${(typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^\d.]/g, ''))).toFixed(2)}`
  ).join('\n');

  const message = `🎂 *NEW CAKE ORDER* 🎂

*Order ID:* ${order.id}
*Date:* ${order.date}

*Customer Details:*
👤 Name: ${order.customerInfo.name}
📱 Contact: ${order.customerInfo.contact}
📍 Address: ${order.customerInfo.address}

*Order Items:*
${orderItems}

💰 *Total: R${order.total.toFixed(2)}*

*Status:* Payment Pending via PayFast

---
Please confirm this order and contact the customer to arrange delivery.`;

  return message;
};

// Send WhatsApp message via web.whatsapp.com
export const sendWhatsAppNotification = (order: PastOrder): void => {
  try {
    const message = formatOrderForWhatsApp(order);
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${WHATSAPP_BUSINESS_NUMBER.replace('+', '')}&text=${encodedMessage}`;
    
    // Open WhatsApp in new tab (will work on desktop with WhatsApp Web)
    window.open(whatsappUrl, '_blank');
    
    console.log('WhatsApp notification sent for order:', order.id);
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
  }
};

// Alternative: Send via mobile WhatsApp (better for mobile users)
export const sendWhatsAppNotificationMobile = (order: PastOrder): void => {
  try {
    const message = formatOrderForWhatsApp(order);
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp mobile URL
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_BUSINESS_NUMBER.replace('+', '')}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    console.log('Mobile WhatsApp notification sent for order:', order.id);
  } catch (error) {
    console.error('Error sending mobile WhatsApp notification:', error);
  }
};

// Send via both methods for maximum compatibility
export const notifyViaWhatsApp = (order: PastOrder): void => {
  // For desktop users (WhatsApp Web)
  sendWhatsAppNotification(order);
  
  // Also provide mobile option
  setTimeout(() => {
    if (confirm('Click OK to also open mobile WhatsApp, or Cancel if desktop WhatsApp worked')) {
      sendWhatsAppNotificationMobile(order);
    }
  }, 2000);
};

// Simpler version: Just copy message to clipboard
export const copyOrderToClipboard = async (order: PastOrder): Promise<void> => {
  try {
    const message = formatOrderForWhatsApp(order);
    await navigator.clipboard.writeText(message);
    alert('Order details copied to clipboard! You can paste this into WhatsApp manually.');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    // Fallback: show message in alert
    const message = formatOrderForWhatsApp(order);
    alert(`Order details (copy this to WhatsApp):\n\n${message}`);
  }
};