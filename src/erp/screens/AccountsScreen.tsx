import { useEffect, useMemo, useState } from 'react';
import accountsData from '../../data/json/accounts.json';
import PageToolbar from '../components/PageToolbar';
import ScreenFrame from '../components/ScreenFrame';
import RecordModal from '../components/RecordModal';
import StatCard from '../components/StatCard';
import DataTable, { Column } from '../components/DataTable';
import { ACCOUNT_FIELDS, ACCOUNT_FILTERS } from '../config/entityFields';
import { useErp } from '../context/ErpContext';
import { useConfirmDelete } from '../context/ThemeContext';
import { useListExport } from '../hooks/useListExport';
import FilterPanel from '../components/FilterPanel';
import { applyFilters, hasActiveFilters, matchesSearch } from '../utils/filter';
import { formatPkr } from '../utils/currency';

const coaColumns: Column<Record<string, unknown>>[] = [
  { key: 'code', header: 'Code', render: (r) => <span className="font-mono text-xs">{String(r.code)}</span> },
  { key: 'name', header: 'Account Name', render: (r) => <span className="erp-strong">{String(r.name)}</span> },
  { key: 'type', header: 'Type', render: (r) => String(r.type) },
  { key: 'balance', header: 'Balance', highlight: true, render: (r) => formatPkr(Number(r.balance)) },
];

export default function AccountsScreen({ searchQuery }: { searchQuery: string }) {
  const { chartOfAccounts, accountCrud } = useErp();
  const confirmDelete = useConfirmDelete();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Record<string, unknown> | undefined>();
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const { stats, profitLoss, trialBalance } = accountsData;

  useEffect(() => { setPage(1); }, [searchQuery, activeFilters]);

  const filtered = useMemo(() =>
    chartOfAccounts.filter((row) => {
      if (!matchesSearch(row, searchQuery)) return false;
      return applyFilters(row, ACCOUNT_FILTERS, activeFilters);
    }),
  [chartOfAccounts, searchQuery, activeFilters]);

  const { handleExportPdf, handlePrint, hasData } = useListExport({
    title: accountsData.title,
    subtitle: 'Chart of Accounts',
    filename: 'chart-of-accounts',
    columns: [
      { key: 'code', header: 'Code' },
      { key: 'name', header: 'Account Name' },
      { key: 'type', header: 'Type' },
      { key: 'balance', header: 'Balance' },
    ],
    data: filtered,
  });

  return (
    <>
      <ScreenFrame
        title={accountsData.title}
        subtitle={accountsData.subtitle}
        toolbar={
          <PageToolbar
            onFilter={() => setFilterOpen(!filterOpen)}
            onAdd={() => { setEditRecord(undefined); setModalOpen(true); }}
            addLabel="+ Add Account"
            onExportPdf={handleExportPdf}
            onPrint={handlePrint}
            exportDisabled={!hasData}
          />
        }
        formPanel={
          <>
            <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} />)}
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              <div className="border border-[var(--color-erp-border)] bg-[var(--color-erp-input-bg)] p-3 lg:col-span-2">
                <p className="erp-titlebar mb-2 px-2 py-1 text-xs">Profit & Loss — {profitLoss.period}</p>
                <table className="erp-classic-table">
                  <tbody>
                    {[
                      { label: 'Revenue', value: profitLoss.revenue },
                      { label: 'Cost of Goods Sold', value: -profitLoss.cogs },
                      { label: 'Gross Profit', value: profitLoss.grossProfit, bold: true },
                      { label: 'Expenses', value: -profitLoss.expenses },
                      { label: 'Net Profit', value: profitLoss.netProfit, bold: true },
                    ].map((row) => (
                      <tr key={row.label}>
                        <td className={row.bold ? 'erp-strong' : ''}>{row.label}</td>
                        <td className={`text-right erp-cell-highlight ${row.bold ? 'erp-strong' : ''}`}>{formatPkr(Math.abs(row.value))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="erp-stat-box erp-stat-box-highlight">
                <p className="mb-2 text-xs font-bold">Trial Balance</p>
                <p className="mb-2 text-[10px] opacity-80">As of {trialBalance.asOf}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span>Total Debit</span><span className="font-bold">{formatPkr(trialBalance.totalDebit)}</span></div>
                  <div className="flex justify-between"><span>Total Credit</span><span className="font-bold">{formatPkr(trialBalance.totalCredit)}</span></div>
                </div>
              </div>
            </div>
            {filterOpen && (
              <div className="mt-2">
                <FilterPanel
                  filters={ACCOUNT_FILTERS}
                  values={activeFilters}
                  onChange={(key, value) => setActiveFilters((prev) => ({ ...prev, [key]: value }))}
                  onClear={() => setActiveFilters({})}
                />
              </div>
            )}
          </>
        }
      >
        {(searchQuery || hasActiveFilters(ACCOUNT_FILTERS, activeFilters)) && (
          <p className="erp-muted border-b border-[var(--color-erp-border)] px-3 py-2 text-xs">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            {searchQuery ? ` for "${searchQuery}"` : ''}
            {hasActiveFilters(ACCOUNT_FILTERS, activeFilters) ? ' (filtered)' : ''}
          </p>
        )}

        <DataTable
          columns={coaColumns}
          data={filtered}
          page={page}
          pageSize={6}
          onPageChange={setPage}
          keyExtractor={(r) => String(r.id)}
          onEdit={(row) => { setEditRecord(row); setModalOpen(true); }}
          onDelete={(row) => confirmDelete(String(row.name), 'Account', () => accountCrud.remove(String(row.id)))}
        />
      </ScreenFrame>

      <RecordModal
        isOpen={modalOpen}
        mode={editRecord ? 'edit' : 'add'}
        title="Account"
        fields={ACCOUNT_FIELDS}
        record={editRecord}
        onClose={() => { setModalOpen(false); setEditRecord(undefined); }}
        onSave={(data) => {
          if (editRecord?.id) accountCrud.update(String(editRecord.id), data);
          else accountCrud.add(data);
          setModalOpen(false);
          setEditRecord(undefined);
        }}
      />
    </>
  );
}
