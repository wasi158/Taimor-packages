import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import inventoryData from '../../data/json/inventory.json';
import purchaseData from '../../data/json/purchase-orders.json';
import salesData from '../../data/json/sales.json';
import usersData from '../../data/json/users-access.json';
import invoicesData from '../../data/json/invoices.json';
import paymentsData from '../../data/json/payments.json';
import customersData from '../../data/json/customers.json';
import vendorsData from '../../data/json/vendors.json';
import gatePassData from '../../data/json/gate-pass.json';
import accountsData from '../../data/json/accounts.json';
import expensesData from '../../data/json/expenses.json';
import { InventoryFormData, InventoryItem } from '../types';

type Row = Record<string, unknown> & { id: string };

function makeCrud<T extends Row>(
  setter: Dispatch<SetStateAction<T[]>>,
  prefix: string
) {
  return {
    add: (data: Record<string, unknown>) =>
      setter((prev) => [...prev, { ...data, id: `${prefix}-${Date.now()}` } as T]),
    update: (id: string, data: Record<string, unknown>) =>
      setter((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item))),
    remove: (id: string) => setter((prev) => prev.filter((item) => item.id !== id)),
  };
}

export interface ErpStore {
  inventory: InventoryItem[];
  purchaseOrders: Row[];
  salesOrders: Row[];
  users: Row[];
  invoices: Row[];
  reviewedInvoices: Row[];
  payments: Row[];
  customers: Row[];
  vendors: Row[];
  inwardGatePasses: Row[];
  outwardGatePasses: Row[];
  chartOfAccounts: Row[];
  expenses: Row[];
  purchaseCrud: ReturnType<typeof makeCrud<Row>>;
  salesCrud: ReturnType<typeof makeCrud<Row>>;
  userCrud: ReturnType<typeof makeCrud<Row>>;
  invoiceCrud: ReturnType<typeof makeCrud<Row>>;
  reviewedInvoiceCrud: ReturnType<typeof makeCrud<Row>>;
  paymentCrud: ReturnType<typeof makeCrud<Row>>;
  customerCrud: ReturnType<typeof makeCrud<Row>>;
  vendorCrud: ReturnType<typeof makeCrud<Row>>;
  inwardGatePassCrud: ReturnType<typeof makeCrud<Row>>;
  outwardGatePassCrud: ReturnType<typeof makeCrud<Row>>;
  accountCrud: ReturnType<typeof makeCrud<Row>>;
  expenseCrud: ReturnType<typeof makeCrud<Row>>;
  addInventory: (data: InventoryFormData) => void;
  updateInventory: (id: string, data: InventoryFormData) => void;
  deleteInventory: (id: string) => void;
  getInventoryById: (id: string) => InventoryItem | undefined;
}

export function useErpStore(): ErpStore {
  const [inventory, setInventory] = useState<InventoryItem[]>(() =>
    inventoryData.items.map((item) => ({ ...item, type: item.type as 'Raw' | 'Finished' }))
  );
  const [purchaseOrders, setPurchaseOrders] = useState<Row[]>(purchaseData.orders as Row[]);
  const [salesOrders, setSalesOrders] = useState<Row[]>(salesData.orders as Row[]);
  const [users, setUsers] = useState<Row[]>(usersData.users as Row[]);
  const [invoices, setInvoices] = useState<Row[]>(invoicesData.invoices as Row[]);
  const [reviewedInvoices, setReviewedInvoices] = useState<Row[]>(invoicesData.reviewedInvoices as Row[]);
  const [payments, setPayments] = useState<Row[]>(paymentsData.payments as Row[]);
  const [customers, setCustomers] = useState<Row[]>(customersData.customers as Row[]);
  const [vendors, setVendors] = useState<Row[]>(vendorsData.vendors as Row[]);
  const [inwardGatePasses, setInwardGatePasses] = useState<Row[]>(gatePassData.inwardPasses as Row[]);
  const [outwardGatePasses, setOutwardGatePasses] = useState<Row[]>(gatePassData.outwardPasses as Row[]);
  const [chartOfAccounts, setChartOfAccounts] = useState<Row[]>(accountsData.chartOfAccounts as Row[]);
  const [expenses, setExpenses] = useState<Row[]>(expensesData.expenses as Row[]);

  const addInventory = useCallback((data: InventoryFormData) => {
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      ...data,
      category: data.type === 'Finished' && data.category === 'Finished Products' ? '—' : data.category,
      maxStock: Math.max(data.stockLevel * 2, 100),
    };
    setInventory((prev) => [...prev, newItem]);
  }, []);

  const updateInventory = useCallback((id: string, data: InventoryFormData) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data,
              category: data.type === 'Finished' && data.category === 'Finished Products' ? '—' : data.category,
            }
          : item
      )
    );
  }, []);

  const deleteInventory = useCallback((id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getInventoryById = useCallback(
    (id: string) => inventory.find((item) => item.id === id),
    [inventory]
  );

  return {
    inventory,
    purchaseOrders,
    salesOrders,
    users,
    invoices,
    reviewedInvoices,
    payments,
    customers,
    vendors,
    inwardGatePasses,
    outwardGatePasses,
    chartOfAccounts,
    expenses,
    purchaseCrud: makeCrud(setPurchaseOrders, 'po'),
    salesCrud: makeCrud(setSalesOrders, 'so'),
    userCrud: makeCrud(setUsers, 'u'),
    invoiceCrud: makeCrud(setInvoices, 'inv-doc'),
    reviewedInvoiceCrud: makeCrud(setReviewedInvoices, 'rinv'),
    paymentCrud: makeCrud(setPayments, 'pay'),
    customerCrud: makeCrud(setCustomers, 'c'),
    vendorCrud: makeCrud(setVendors, 'v'),
    inwardGatePassCrud: makeCrud(setInwardGatePasses, 'gp-in'),
    outwardGatePassCrud: makeCrud(setOutwardGatePasses, 'gp-out'),
    accountCrud: makeCrud(setChartOfAccounts, 'coa'),
    expenseCrud: makeCrud(setExpenses, 'exp'),
    addInventory,
    updateInventory,
    deleteInventory,
    getInventoryById,
  };
}
