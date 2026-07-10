import { useMemo } from 'react';
import dashboardData from '../../data/json/dashboard.json';
import StatCard from '../components/StatCard';
import ScreenFrame from '../components/ScreenFrame';
import { useErp } from '../context/ErpContext';
import { matchesSearch } from '../utils/filter';
import { Star } from 'lucide-react';
import { formatPkr } from '../utils/currency';

function Panel({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-[var(--color-erp-border)] ${className}`}>
      <div className="erp-titlebar text-xs">{title}</div>
      <div className="erp-form-panel">{children}</div>
    </div>
  );
}

export default function DashboardScreen({ searchQuery }: { searchQuery: string }) {
  const { inventory } = useErp();
  const { stats, recentTransactions, salesChart, topProducts, vendorPerformance } = dashboardData;

  const lowStockAlerts = useMemo(() =>
    inventory
      .filter((item) => item.stockLevel <= item.minStock)
      .map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        stock: item.stockLevel,
        minStock: item.minStock,
        category: item.category,
      })),
  [inventory]);

  const filteredTransactions = useMemo(() =>
    recentTransactions.filter((tx) => matchesSearch(tx as unknown as Record<string, unknown>, searchQuery)),
  [recentTransactions, searchQuery]);

  const filteredProducts = useMemo(() =>
    topProducts.filter((p) => matchesSearch(p as unknown as Record<string, unknown>, searchQuery)),
  [topProducts, searchQuery]);

  const maxVal = Math.max(...salesChart.sales, ...salesChart.purchases);

  return (
    <ScreenFrame
      title={dashboardData.title}
      subtitle={dashboardData.subtitle}
      formPanel={
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s, i) => (
            <StatCard key={s.id} label={s.label} value={s.value} change={s.change} trend={s.trend as 'up' | 'down'} highlight={i === 0} />
          ))}
        </div>
      }
    >
      {searchQuery && (
        <p className="erp-muted border-b border-[var(--color-erp-border)] px-3 py-2 text-xs">
          Filtering dashboard data for &quot;{searchQuery}&quot;
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-3">
        <Panel title="Sales & Purchase Analytics" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <div className="flex h-40 min-w-[280px] items-end gap-2">
              {salesChart.labels.map((label, i) => (
                <div key={label} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full items-end justify-center gap-1" style={{ height: 120 }}>
                    <div className="w-4 border border-[var(--color-erp-border)] bg-[var(--color-erp-titlebar)]" style={{ height: `${(salesChart.sales[i] / maxVal) * 100}%` }} />
                    <div className="w-4 border border-[var(--color-erp-border)] bg-[var(--color-erp-table-head)]" style={{ height: `${(salesChart.purchases[i] / maxVal) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-bold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title={`Low Stock Alerts (${lowStockAlerts.length})`}>
          <div className="space-y-2">
            {lowStockAlerts.length === 0 ? (
              <p className="erp-muted text-xs">All items above minimum stock.</p>
            ) : lowStockAlerts.map((item) => (
              <div key={item.id} className="erp-stat-box border-amber-600 bg-[var(--color-erp-status-active)]">
                <p className="erp-strong text-xs">{item.name}</p>
                <p className="erp-muted text-[10px]">{item.sku} · {item.category}</p>
                <p className="mt-1 text-[10px] font-bold">{item.stock} / {item.minStock} min stock</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-3 p-3 pt-0 lg:grid-cols-2">
        <Panel title="Recent Transactions">
          <table className="erp-classic-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Party</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr><td colSpan={4} className="erp-muted text-center">No transactions match your search.</td></tr>
              ) : filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="erp-strong">{tx.reference}</td>
                  <td>{tx.party}</td>
                  <td>{tx.date}</td>
                  <td className="erp-strong">{formatPkr(tx.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Top Selling Products">
          <table className="erp-classic-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Units</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, i) => (
                <tr key={p.id}>
                  <td className="erp-cell-highlight font-bold">{i + 1}</td>
                  <td className="erp-strong">{p.name}</td>
                  <td>{p.unitsSold}</td>
                  <td className="erp-strong">{formatPkr(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <div className="p-3 pt-0">
        <Panel title="Vendor Performance Overview">
          <table className="erp-classic-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Quality</th>
                <th>On-time %</th>
                <th>Total Orders</th>
              </tr>
            </thead>
            <tbody>
              {vendorPerformance.map((v) => (
                <tr key={v.id}>
                  <td className="erp-strong">{v.name}</td>
                  <td><Star size={12} className="inline text-amber-600" fill="currentColor" /> {v.qualityScore}</td>
                  <td className="erp-cell-highlight">{v.onTimeDelivery}%</td>
                  <td>{v.totalOrders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </ScreenFrame>
  );
}
