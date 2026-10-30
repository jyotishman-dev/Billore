export interface LineItem {
  id?: string;
  name: string;
  description?: string;
  hsn?: string;
  sac?: string;
  qty: number;
  unit?: string;
  rate: number;
  discount?: number;
  discountType?: 'percent' | 'unit' | 'with-tax';
  taxRate: number; // e.g. 18 for 18%
  cessRate?: number;
  cessAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  taxAmount?: number;
  total: number;
}

export interface PaymentRecord {
  id?: string;
  date: string;
  amount: number;
  mode: 'cash' | 'bank' | 'upi' | 'cheque' | 'credit-applied' | 'other';
  reference?: string;
  notes?: string;
  creditSourceBillIds?: string[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: string; // 'tax-invoice' | 'quotation' | 'proforma' | 'delivery-challan' | 'credit-note' | 'bill-of-supply'
  invoiceDate: string;
  dueDate?: string;
  clientId?: string;
  clientName?: string;
  clientGstin?: string;
  clientAddress?: string;
  clientState?: string;
  clientStateCode?: string;
  placeOfSupply?: string;
  items: LineItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  balanceDue: number;
  status: 'paid' | 'partial' | 'unpaid' | 'cancelled';
  payments?: PaymentRecord[];
  notes?: string;
  terms?: string;
  bankDetails?: Record<string, any>;
  ewayBillNo?: string;
  transportMode?: string;
  vehicleNo?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  [key: string]: any;
}

export interface Client {
  id: string;
  name: string;
  gstin?: string;
  pan?: string;
  email?: string;
  phone?: string;
  billingAddress?: string;
  shippingAddress?: string;
  state?: string;
  stateCode?: string;
  creditLimit?: number;
  openingBalance?: number;
  notes?: string;
  [key: string]: any;
}

export interface Product {
  id: string;
  name: string;
  hsn?: string;
  unit?: string;
  price: number;
  purchasePrice?: number;
  taxRate: number;
  stock?: number;
  lowStockAlert?: number;
  cess?: number;
  cessType?: string;
  category?: string;
  [key: string]: any;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  description?: string;
  amount: number;
  paymentMode?: string;
  vendor?: string;
  gstin?: string;
  itcEligible?: boolean;
  [key: string]: any;
}

export interface Profile {
  id: string;
  name: string;
  gstin?: string;
  pan?: string;
  email?: string;
  phone?: string;
  address?: string;
  state?: string;
  stateCode?: string;
  bankName?: string;
  accountNo?: string;
  ifsc?: string;
  branch?: string;
  upiId?: string;
  logo?: string;
  signature?: string;
  composition?: boolean;
  [key: string]: any;
}
