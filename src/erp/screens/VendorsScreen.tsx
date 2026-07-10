import vendorsData from '../../data/json/vendors.json';
import { VENDOR_FIELDS, VENDOR_FILTERS } from '../config/entityFields';
import { useErp } from '../context/ErpContext';
import { Column } from '../components/DataTable';
import GenericListScreen from './GenericListScreen';
import { Star } from 'lucide-react';

const columns: Column<Record<string, unknown>>[] = [
  { key: 'name', header: 'Vendor', render: (r) => <span className="erp-strong">{String(r.name)}</span> },
  { key: 'code', header: 'Code', render: (r) => <span className="font-mono text-xs">{String(r.code)}</span> },
  { key: 'category', header: 'Category', render: (r) => String(r.category) },
  { key: 'onTimeDelivery', header: 'On-time %', render: (r) => `${r.onTimeDelivery}%` },
  { key: 'rating', header: 'Rating', render: (r) => <span className="flex items-center gap-1 text-amber-500"><Star size={12} fill="currentColor" />{String(r.rating)}</span> },
  { key: 'status', header: 'Status', render: (r) => <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">{String(r.status)}</span> },
];

export default function VendorsScreen({ searchQuery }: { searchQuery: string }) {
  const { vendors, vendorCrud } = useErp();
  return (
    <GenericListScreen
      title={vendorsData.title}
      subtitle={vendorsData.subtitle}
      entityName="Vendor"
      columns={columns}
      data={vendors}
      searchQuery={searchQuery}
      fields={VENDOR_FIELDS}
      filters={VENDOR_FILTERS}
      addLabel="+ Add Vendor"
      onAdd={vendorCrud.add}
      onEdit={vendorCrud.update}
      onDelete={vendorCrud.remove}
    />
  );
}
