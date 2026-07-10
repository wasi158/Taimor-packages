export type ErpScreen =
  | 'dashboard'
  | 'inventory'
  | 'stock-details'
  | 'purchase-orders'
  | 'sales'
  | 'users-access'
  | 'invoices'
  | 'reviewed-invoices'
  | 'payments'
  | 'customers'
  | 'vendors'
  | 'gate-pass'
  | 'accounts'
  | 'expenses'
  | 'reports'
  | 'settings'
  | 'support';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  type: 'Raw' | 'Finished';
  category: string;
  costPrice: number;
  sellingPrice: number;
  stockLevel: number;
  minStock: number;
  maxStock: number;
  unit: string;
  warehouse: string;
  barcode: string;
}

export interface InventoryFormData {
  name: string;
  sku: string;
  type: 'Raw' | 'Finished';
  category: string;
  costPrice: number;
  sellingPrice: number;
  stockLevel: number;
  minStock: number;
  unit: string;
  warehouse: string;
  barcode: string;
}
