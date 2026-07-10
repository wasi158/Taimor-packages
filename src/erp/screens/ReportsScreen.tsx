import { useMemo } from 'react';
import reportsData from '../../data/json/reports.json';
import PageToolbar from '../components/PageToolbar';
import ScreenFrame from '../components/ScreenFrame';
import StatCard from '../components/StatCard';
import { useListExport } from '../hooks/useListExport';
import { matchesSearch } from '../utils/filter';
import { FileSpreadsheet } from 'lucide-react';

export default function ReportsScreen({ searchQuery }: { searchQuery: string }) {
  const { analytics, reportCategories } = reportsData;

  const allReports = useMemo(() => {
    return reportCategories.flatMap((cat) =>
      cat.reports.map((r) => ({
        id: r.id,
        category: cat.name,
        name: r.name,
        description: r.description,
        lastGenerated: r.lastGenerated,
      }))
    );
  }, [reportCategories]);

  const filteredReports = useMemo(() =>
    allReports.filter((r) => matchesSearch(r as unknown as Record<string, unknown>, searchQuery)),
  [allReports, searchQuery]);

  const { handleExportPdf, handlePrint, hasData } = useListExport({
    title: reportsData.title,
    subtitle: reportsData.subtitle,
    filename: 'reports-analytics',
    columns: [
      { key: 'category', header: 'Category' },
      { key: 'name', header: 'Report' },
      { key: 'description', header: 'Description' },
      { key: 'lastGenerated', header: 'Last Generated' },
    ],
    data: filteredReports as unknown as Record<string, unknown>[],
  });

  const filteredCategories = useMemo(() =>
    reportCategories
      .map((cat) => ({
        ...cat,
        reports: cat.reports.filter((r) => matchesSearch(r as unknown as Record<string, unknown>, searchQuery)),
      }))
      .filter((cat) => cat.reports.length > 0 || !searchQuery),
  [reportCategories, searchQuery]);

  return (
    <ScreenFrame
      title={reportsData.title}
      subtitle={reportsData.subtitle}
      toolbar={
        <PageToolbar
          onExportPdf={handleExportPdf}
          onPrint={handlePrint}
          exportDisabled={!hasData}
        />
      }
      formPanel={
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Inventory Turnover" value={`${analytics.inventoryTurnover}x`} />
          <StatCard label="Gross Margin" value={`${analytics.grossMargin}%`} />
          <StatCard label="Order Fulfillment" value={`${analytics.orderFulfillmentRate}%`} />
          <StatCard label="Vendor On-time Rate" value={`${analytics.vendorOnTimeRate}%`} highlight />
        </div>
      }
    >
      {searchQuery && (
        <p className="erp-muted border-b border-[var(--color-erp-border)] px-3 py-2 text-xs">
          Filtering reports for &quot;{searchQuery}&quot;
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="border border-[var(--color-erp-border)]">
            <div className="erp-titlebar text-xs">{cat.name}</div>
            <table className="erp-classic-table">
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cat.reports.length === 0 ? (
                  <tr><td colSpan={3} className="erp-muted text-center">No reports match your search.</td></tr>
                ) : cat.reports.map((r) => (
                  <tr key={r.id}>
                    <td className="erp-strong">{r.name}</td>
                    <td className="erp-muted text-xs">{r.description}</td>
                    <td>
                      <button type="button" onClick={handleExportPdf} className="erp-btn-ghost p-1" title="Export PDF">
                        <FileSpreadsheet size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </ScreenFrame>
  );
}
