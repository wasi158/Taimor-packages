import expensesData from '../../data/json/expenses.json';
import { EXPENSE_FIELDS, EXPENSE_FILTERS } from '../config/entityFields';
import { useErp } from '../context/ErpContext';
import { Column } from '../components/DataTable';
import GenericListScreen from './GenericListScreen';
import { formatPkr } from '../utils/currency';

const statusColor: Record<string, string> = {
  Paid: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Approved: 'bg-blue-50 text-blue-700',
  Rejected: 'bg-red-50 text-red-600',
};

const columns: Column<Record<string, unknown>>[] = [
  { key: 'expenseNumber', header: 'Expense #', render: (r) => <span className="erp-strong">{String(r.expenseNumber)}</span> },
  { key: 'title', header: 'Title', render: (r) => String(r.title) },
  { key: 'category', header: 'Category', render: (r) => String(r.category) },
  { key: 'paidTo', header: 'Paid To', render: (r) => String(r.paidTo) },
  { key: 'amount', header: 'Amount', render: (r) => formatPkr(Number(r.amount)) },
  { key: 'date', header: 'Date', render: (r) => String(r.date) },
  {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusColor[String(r.status)] ?? 'bg-slate-100 text-slate-600'}`}>
        {String(r.status)}
      </span>
    ),
  },
];

export default function ExpensesScreen({ searchQuery }: { searchQuery: string }) {
  const { expenses, expenseCrud } = useErp();

  return (
    <GenericListScreen
      title={expensesData.title}
      subtitle={expensesData.subtitle}
      entityName="Expense"
      stats={expensesData.stats}
      columns={columns}
      data={expenses}
      searchQuery={searchQuery}
      fields={EXPENSE_FIELDS}
      filters={EXPENSE_FILTERS}
      addLabel="+ Add Expense"
      onAdd={expenseCrud.add}
      onEdit={expenseCrud.update}
      onDelete={expenseCrud.remove}
      deleteConfirmField="expenseNumber"
      pdfFilename="expenses"
    />
  );
}
