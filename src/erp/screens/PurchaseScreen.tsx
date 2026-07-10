import purchaseData from '../../data/json/purchase-orders.json';
import { PURCHASE_FIELDS, PURCHASE_FILTERS } from '../config/entityFields';
import { useErp } from '../context/ErpContext';
import { Column } from '../components/DataTable';
import GenericListScreen from './GenericListScreen';
import { formatPkr } from '../utils/currency';
import { formatSizeWithUnit } from '../utils/displayFormat';
import { PdfColumn } from '../utils/pdfExport';

const statusColor: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700',
  Approved: 'bg-blue-50 text-blue-700',
  Received: 'bg-emerald-50 text-emerald-700',
};

const columns: Column<Record<string, unknown>>[] = [
  { key: 'poNumber', header: 'PO Number', render: (r) => <span className="erp-strong">{String(r.poNumber)}</span> },
  { key: 'vendor', header: 'Vendor', render: (r) => String(r.vendor) },
  { key: 'gsm', header: 'GSM', render: (r) => String(r.gsm) },
  { key: 'sizeDisplay', header: 'Size', render: (r) => formatSizeWithUnit(r) },
  { key: 'totalAmount', header: 'Amount', render: (r) => formatPkr(Number(r.totalAmount)) },
  { key: 'deliveryDate', header: 'Delivery', render: (r) => String(r.deliveryDate) },
  { key: 'status', header: 'Status', render: (r) => (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusColor[String(r.status)] ?? 'bg-slate-100 text-slate-600'}`}>{String(r.status)}</span>
  )},
];

const pdfColumns: PdfColumn[] = [
  { key: 'poNumber', header: 'PO Number' },
  { key: 'vendor', header: 'Vendor' },
  { key: 'gsm', header: 'GSM' },
  { key: 'sizeDisplay', header: 'Size' },
  { key: 'items', header: 'Items' },
  { key: 'totalAmount', header: 'Amount' },
  { key: 'deliveryDate', header: 'Delivery' },
  { key: 'status', header: 'Status' },
];

interface PurchaseScreenProps {
  searchQuery: string;
  onOpenAdd: () => void;
  onOpenEdit: (record: Record<string, unknown>) => void;
}

export default function PurchaseScreen({ searchQuery, onOpenAdd, onOpenEdit }: PurchaseScreenProps) {
  const { purchaseOrders, purchaseCrud } = useErp();
  return (
    <GenericListScreen
      title={purchaseData.title}
      subtitle={purchaseData.subtitle}
      entityName="Purchase Order"
      stats={purchaseData.stats}
      columns={columns}
      data={purchaseOrders}
      searchQuery={searchQuery}
      fields={PURCHASE_FIELDS}
      filters={PURCHASE_FILTERS}
      addLabel="+ New Purchase Order"
      onAdd={purchaseCrud.add}
      onEdit={purchaseCrud.update}
      onDelete={purchaseCrud.remove}
      deleteConfirmField="poNumber"
      pdfColumns={pdfColumns}
      pdfFilename="purchase-orders"
      onOpenAdd={onOpenAdd}
      onOpenEdit={onOpenEdit}
    />
  );
}
