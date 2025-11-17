
export interface MenuItem {
  name: string;
  price: string;
  description?: string;
  imageUrl: string;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface CustomCakeDetails {
  name: string;
  description: string;
  price: number;
}

export interface OrderItem {
    name: string;
    price: string | number;
    quantity: number;
}

export interface CustomerInfo {
    name: string;
    contact: string;
    address: string;
}

export interface PastOrder {
    id: string;
    date: string;
    items: OrderItem[];
    customerInfo: CustomerInfo;
    total: number;
}