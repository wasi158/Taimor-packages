import customersData from '../../data/json/customers.json';
import { CUSTOMER_FIELDS, CUSTOMER_FILTERS } from '../config/entityFields';
import { useErp } from '../context/ErpContext';
import { Column } from '../components/DataTable';
import GenericListScreen from './GenericListScreen';
import { formatPkr } from '../utils/currency';

const columns: Column<Record<string, unknown>>[] = [
  { key: 'name', header: 'Customer', render: (r) => <span className="erp-strong">{String(r.name)}</span> },
  { key: 'contact', header: 'Contact', render: (r) => String(r.contact) },
  { key: 'email', header: 'Email', render: (r) => String(r.email) },
  { key: 'city', header: 'City', render: (r) => String(r.city) },
  { key: 'totalOrders', header: 'Orders', render: (r) => String(r.totalOrders) },
  { key: 'outstanding', header: 'Outstanding', render: (r) => formatPkr(Number(r.outstanding)) },
];

export default function CustomersScreen({ searchQuery }: { searchQuery: string }) {
  const { customers, customerCrud } = useErp();
  return (
    <GenericListScreen
      title={customersData.title}
      subtitle={customersData.subtitle}
      entityName="Customer"
      columns={columns}
      data={customers}
      searchQuery={searchQuery}
      fields={CUSTOMER_FIELDS}
      filters={CUSTOMER_FILTERS}
      addLabel="+ Add Customer"
      onAdd={customerCrud.add}
      onEdit={customerCrud.update}
      onDelete={customerCrud.remove}
    />
  );
}
