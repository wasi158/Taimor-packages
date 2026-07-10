import stockData from '../../data/json/stock-details.json';
import { InventoryItem } from '../types';
import { ArrowLeft } from 'lucide-react';
import ScreenFrame from '../components/ScreenFrame';
import PageToolbar from '../components/PageToolbar';
import { formatPkrPrice } from '../utils/currency';

interface StockDetailsScreenProps {
  item: InventoryItem;
  onBack: () => void;
}

export default function StockDetailsScreen({ item, onBack }: StockDetailsScreenProps) {
  const { batches, stockHistory, warehouseStock } = stockData;

  return (
    <ScreenFrame
      title={stockData.title}
      subtitle={`${item.name} — ${item.sku}`}
      toolbar={
        <PageToolbar
          extra={
            <button type="button" onClick={onBack} className="erp-btn-ghost flex items-center gap-1">
              <ArrowLeft size={14} />
              Back to Inventory
            </button>
          }
        />
      }
      formPanel={
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Current Stock', value: `${item.stockLevel} ${item.unit}` },
            { label: 'Cost Price', value: formatPkrPrice(item.costPrice) },
            { label: 'Selling Price', value: formatPkrPrice(item.sellingPrice) },
            { label: 'Barcode', value: item.barcode },
          ].map((stat) => (
            <div key={stat.label} className="erp-stat-box">
              <p className="erp-field-label">{stat.label}</p>
              <p className="erp-strong text-sm">{stat.value}</p>
            </div>
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-2">
        <div className="border border-[var(--color-erp-border)]">
          <div className="erp-titlebar text-xs">Batch Tracking</div>
          <table className="erp-classic-table">
            <thead>
              <tr>
                <th>Batch No</th>
                <th>Qty</th>
                <th>Mfg / Exp</th>
                <th>Warehouse</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id}>
                  <td className="erp-strong">{b.batchNo}</td>
                  <td className="erp-cell-highlight">{b.quantity} {b.unit}</td>
                  <td className="text-xs">{b.mfgDate} / {b.expiryDate}</td>
                  <td>{b.warehouse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-[var(--color-erp-border)]">
          <div className="erp-titlebar text-xs">Warehouse Stock</div>
          <table className="erp-classic-table">
            <thead>
              <tr>
                <th>Warehouse</th>
                <th>Qty</th>
                <th>Capacity</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {warehouseStock.map((wh) => {
                const pct = Math.min(100, Math.round((wh.quantity / wh.capacity) * 100));
                return (
                  <tr key={wh.warehouse}>
                    <td className="erp-strong">{wh.warehouse}</td>
                    <td className="erp-cell-highlight">{wh.quantity}</td>
                    <td>{wh.capacity}</td>
                    <td>{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t border-[var(--color-erp-border)] p-3">
        <div className="erp-titlebar mb-0 text-xs">Inventory History Log</div>
        <div className="overflow-x-auto">
          <table className="erp-classic-table min-w-[560px]">
            <thead>
              <tr>
                {['Date', 'Type', 'Quantity', 'Reference', 'User', 'Balance'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stockHistory.map((h) => (
                <tr key={h.id}>
                  <td>{h.date}</td>
                  <td>
                    <span className={`erp-badge ${
                      h.type === 'Stock In' ? 'erp-badge-green' :
                      h.type === 'Stock Out' ? 'erp-badge-red' : ''
                    }`}>{h.type}</span>
                  </td>
                  <td className={`erp-cell-highlight font-bold ${h.quantity > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {h.quantity > 0 ? '+' : ''}{h.quantity}
                  </td>
                  <td>{h.reference}</td>
                  <td>{h.user}</td>
                  <td className="erp-strong">{h.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ScreenFrame>
  );
}
