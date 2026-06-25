export interface Product {
  id?: string;
  name: string;
  image: string;
  price: number;
  category: string;
  rating: number;
  description: string;
  stock: boolean; // true = Available, false = Unavailable
}

export interface Offer {
  id?: string;
  code: string;
  description: string;
  discount: string;
  expiry: string;
}

export interface SalesStats {
  totalStock: number;
  totalServices: number;
  todaySales: number;
  monthSales: number;
  yearSales: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'customer';
}

export interface OrderRegistration {
  name: string;
  contact: string;
  address: string;
  age: number;
  productDetails: string;
}
