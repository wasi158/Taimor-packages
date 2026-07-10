import paymentsData from '../../data/json/payments.json';
import { PAYMENT_FIELDS, PAYMENT_FILTERS } from '../config/entityFields';
import { useErp } from '../context/ErpContext';
import { Column } from '../components/DataTable';
import GenericListScreen from './GenericListScreen';
import { formatPkr } from '../utils/currency';

const columns: Column<Record<string, unknown>>[] = [
  { key: 'reference', header: 'Reference', render: (r) => <span className="erp-strong">{String(r.reference)}</span> },
  { key: 'party', header: 'Party', render: (r) => String(r.party) },
  { key: 'type', header: 'Type', render: (r) => String(r.type) },
  { key: 'amount', header: 'Amount', render: (r) => formatPkr(Number(r.amount)) },
  { key: 'method', header: 'Method', render: (r) => String(r.method) },
  { key: 'status', header: 'Status', render: (r) => (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${r.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{String(r.status)}</span>
  )},
];

export default function PaymentsScreen({ searchQuery }: { searchQuery: string }) {
  const { payments, paymentCrud } = useErp();
  return (
    <GenericListScreen
      title={paymentsData.title}
      subtitle={paymentsData.subtitle}
      entityName="Payment"
      columns={columns}
      data={payments}
      searchQuery={searchQuery}
      fields={PAYMENT_FIELDS}
      filters={PAYMENT_FILTERS}
      addLabel="+ Record Payment"
      onAdd={paymentCrud.add}
      onEdit={paymentCrud.update}
      onDelete={paymentCrud.remove}
      deleteConfirmField="reference"
    />
  );
}
