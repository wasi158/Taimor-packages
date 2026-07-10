import salesData from '../../data/json/sales.json';
import { SALES_FIELDS, SALES_FILTERS } from '../config/entityFields';
import { useErp } from '../context/ErpContext';
import { Column } from '../components/DataTable';
import GenericListScreen from './GenericListScreen';
import { formatPkr } from '../utils/currency';
import { formatTaxPercent } from '../utils/displayFormat';
import { PdfColumn } from '../utils/pdfExport';

const columns: Column<Record<string, unknown>>[] = [
  { key: 'orderNumber', header: 'Order #', render: (r) => <span className="erp-strong">{String(r.orderNumber)}</span> },
  { key: 'customer', header: 'Customer', render: (r) => String(r.customer) },
  { key: 'items', header: 'Items', render: (r) => String(r.items) },
  { key: 'totalAmount', header: 'Amount', render: (r) => formatPkr(Number(r.totalAmount)) },
  { key: 'tax', header: 'Tax', render: (r) => formatTaxPercent(r.tax) },
  { key: 'orderDate', header: 'Date', render: (r) => String(r.orderDate) },
  { key: 'status', header: 'Status', render: (r) => <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">{String(r.status)}</span> },
];

const pdfColumns: PdfColumn[] = [
  { key: 'orderNumber', header: 'Order #' },
  { key: 'customer', header: 'Customer' },
  { key: 'items', header: 'Items' },
  { key: 'totalAmount', header: 'Amount' },
  { key: 'tax', header: 'Tax' },
  { key: 'orderDate', header: 'Date' },
  { key: 'deliveryDate', header: 'Delivery' },
  { key: 'status', header: 'Status' },
];

interface SalesScreenProps {
  searchQuery: string;
  onOpenAdd: () => void;
  onOpenEdit: (record: Record<string, unknown>) => void;
}

export default function SalesScreen({ searchQuery, onOpenAdd, onOpenEdit }: SalesScreenProps) {
  const { salesOrders, salesCrud } = useErp();
  return (
    <GenericListScreen
      title={salesData.title}
      subtitle={salesData.subtitle}
      entityName="Sales Order"
      stats={salesData.stats}
      columns={columns}
      data={salesOrders}
      searchQuery={searchQuery}
      fields={SALES_FIELDS}
      filters={SALES_FILTERS}
      addLabel="+ New Sales Order"
      onAdd={salesCrud.add}
      onEdit={salesCrud.update}
      onDelete={salesCrud.remove}
      deleteConfirmField="orderNumber"
      pdfColumns={pdfColumns}
      pdfFilename="sales-orders"
      onOpenAdd={onOpenAdd}
      onOpenEdit={onOpenEdit}
    />
  );
}
