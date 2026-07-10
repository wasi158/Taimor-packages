import React, { useEffect, useState } from 'react';
import ErpSidebar from './erp/components/ErpSidebar';
import ErpTopBar from './erp/components/ErpTopBar';
import ItemFormPage from './erp/components/ItemFormPage';
import RecordFormPage from './erp/components/RecordFormPage';
import { ErpProvider, useErp } from './erp/context/ErpContext';
import { ThemeProvider } from './erp/context/ThemeContext';
import { PURCHASE_FIELDS, SALES_FIELDS } from './erp/config/entityFields';
import { useErpRoute } from './erp/hooks/useErpRoute';
import inventoryData from './data/json/inventory.json';
import purchaseData from './data/json/purchase-orders.json';
import salesData from './data/json/sales.json';
import DashboardScreen from './erp/screens/DashboardScreen';
import InventoryScreen from './erp/screens/InventoryScreen';
import StockDetailsScreen from './erp/screens/StockDetailsScreen';
import PurchaseScreen from './erp/screens/PurchaseScreen';
import SalesScreen from './erp/screens/SalesScreen';
import GatePassScreen from './erp/screens/GatePassScreen';
import AccountsScreen from './erp/screens/AccountsScreen';
import ExpensesScreen from './erp/screens/ExpensesScreen';
import VendorsScreen from './erp/screens/VendorsScreen';
import ReportsScreen from './erp/screens/ReportsScreen';
import SettingsScreen from './erp/screens/SettingsScreen';
import SupportScreen from './erp/screens/SupportScreen';
import InvoicesScreen from './erp/screens/InvoicesScreen';
import ReviewedInvoicesScreen from './erp/screens/ReviewedInvoicesScreen';
import PaymentsScreen from './erp/screens/PaymentsScreen';
import CustomersScreen from './erp/screens/CustomersScreen';
import UsersAccessScreen from './erp/screens/UsersAccessScreen';

function ErpApp() {
  const {
    purchaseOrders,
    salesOrders,
    getInventoryById,
    addInventory,
    updateInventory,
    purchaseCrud,
    salesCrud,
  } = useErp();

  const { screen, recordId, formAction, gatePassTab, navigate, openForm, closeForm, setGatePassTab } = useErpRoute();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    if (screen === 'stock-details' && recordId && !getInventoryById(recordId)) {
      navigate('inventory');
      return;
    }
    if (screen === 'inventory' && formAction === 'edit' && recordId && !getInventoryById(recordId)) {
      closeForm('inventory');
      return;
    }
    if (screen === 'purchase-orders' && formAction === 'edit' && recordId
      && !purchaseOrders.find((r) => r.id === recordId)) {
      closeForm('purchase-orders');
      return;
    }
    if (screen === 'sales' && formAction === 'edit' && recordId
      && !salesOrders.find((r) => r.id === recordId)) {
      closeForm('sales');
    }
  }, [
    screen,
    recordId,
    formAction,
    getInventoryById,
    navigate,
    closeForm,
    purchaseOrders,
    salesOrders,
  ]);

  const handleScreenChange = (next: typeof screen) => {
    setMobileSidebarOpen(false);
    navigate(next);
  };

  const searchProps = { searchQuery: '' };

  const renderScreen = () => {
    if (screen === 'stock-details') {
      const item = recordId ? getInventoryById(recordId) : undefined;
      if (!item) return null;
      return <StockDetailsScreen item={item} onBack={() => navigate('inventory')} />;
    }

    if (screen === 'inventory' && formAction) {
      const editItem = formAction === 'edit' && recordId ? getInventoryById(recordId) : undefined;
      if (formAction === 'edit' && recordId && !editItem) return null;
      return (
        <ItemFormPage
          mode={formAction}
          item={editItem}
          categories={inventoryData.categories}
          units={inventoryData.units}
          warehouses={inventoryData.warehouses}
          onBack={() => closeForm('inventory')}
          onSave={(data) => {
            if (formAction === 'edit' && recordId) updateInventory(recordId, data);
            else addInventory(data);
            closeForm('inventory');
          }}
        />
      );
    }

    if (screen === 'purchase-orders' && formAction) {
      const record = formAction === 'edit' && recordId
        ? purchaseOrders.find((r) => r.id === recordId)
        : undefined;
      if (formAction === 'edit' && recordId && !record) return null;
      return (
        <RecordFormPage
          mode={formAction}
          title="Purchase Order"
          subtitle={purchaseData.subtitle}
          fields={PURCHASE_FIELDS}
          record={record}
          onBack={() => closeForm('purchase-orders')}
          onSave={(data) => {
            if (formAction === 'edit' && recordId) purchaseCrud.update(recordId, data);
            else purchaseCrud.add(data);
            closeForm('purchase-orders');
          }}
        />
      );
    }

    if (screen === 'sales' && formAction) {
      const record = formAction === 'edit' && recordId
        ? salesOrders.find((r) => r.id === recordId)
        : undefined;
      if (formAction === 'edit' && recordId && !record) return null;
      return (
        <RecordFormPage
          mode={formAction}
          title="Sales Order"
          subtitle={salesData.subtitle}
          fields={SALES_FIELDS}
          record={record}
          onBack={() => closeForm('sales')}
          onSave={(data) => {
            if (formAction === 'edit' && recordId) salesCrud.update(recordId, data);
            else salesCrud.add(data);
            closeForm('sales');
          }}
        />
      );
    }

    switch (screen) {
      case 'dashboard':
        return <DashboardScreen {...searchProps} />;
      case 'inventory':
        return (
          <InventoryScreen
            {...searchProps}
            onViewStock={(item) => navigate('stock-details', { recordId: item.id })}
            onAdd={() => openForm('inventory', 'add')}
            onEdit={(item) => openForm('inventory', 'edit', item.id)}
          />
        );
      case 'purchase-orders':
        return (
          <PurchaseScreen
            {...searchProps}
            onOpenAdd={() => openForm('purchase-orders', 'add')}
            onOpenEdit={(row) => openForm('purchase-orders', 'edit', String(row.id))}
          />
        );
      case 'sales':
        return (
          <SalesScreen
            {...searchProps}
            onOpenAdd={() => openForm('sales', 'add')}
            onOpenEdit={(row) => openForm('sales', 'edit', String(row.id))}
          />
        );
      case 'users-access':
        return <UsersAccessScreen {...searchProps} />;
      case 'invoices':
        return <InvoicesScreen {...searchProps} />;
      case 'reviewed-invoices':
        return <ReviewedInvoicesScreen {...searchProps} />;
      case 'payments':
        return <PaymentsScreen {...searchProps} />;
      case 'customers':
        return <CustomersScreen {...searchProps} />;
      case 'vendors':
        return <VendorsScreen {...searchProps} />;
      case 'gate-pass':
        return (
          <GatePassScreen
            {...searchProps}
            tab={gatePassTab}
            onTabChange={setGatePassTab}
          />
        );
      case 'accounts':
        return <AccountsScreen {...searchProps} />;
      case 'expenses':
        return <ExpensesScreen {...searchProps} />;
      case 'reports':
        return <ReportsScreen {...searchProps} />;
      case 'settings':
        return <SettingsScreen {...searchProps} />;
      case 'support':
        return <SupportScreen />;
      default:
        return <DashboardScreen {...searchProps} />;
    }
  };

  return (
    <div className="erp-shell min-h-screen overflow-x-hidden transition-colors">
      <ErpSidebar
        activeScreen={screen === 'stock-details' ? 'inventory' : screen}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onScreenChange={handleScreenChange}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div
        className={`min-w-0 px-2 transition-all duration-300 sm:px-3 ${
          sidebarCollapsed ? 'lg:ml-[56px]' : 'lg:ml-[220px]'
        }`}
      >
        <ErpTopBar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="p-2 sm:p-3">{renderScreen()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ErpProvider>
        <ErpApp />
      </ErpProvider>
    </ThemeProvider>
  );
}
