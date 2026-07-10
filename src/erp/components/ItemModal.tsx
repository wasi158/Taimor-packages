import { X } from 'lucide-react';
import { InventoryFormData, InventoryItem } from '../types';

interface ItemModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  item?: InventoryItem;
  categories: string[];
  units: string[];
  warehouses: string[];
  onClose: () => void;
  onSave: (data: InventoryFormData) => void;
}

const EMPTY_FORM: InventoryFormData = {
  name: '',
  sku: '',
  type: 'Raw',
  category: 'Ink',
  costPrice: 0,
  sellingPrice: 0,
  stockLevel: 0,
  minStock: 0,
  unit: 'KG',
  warehouse: 'East Wing',
  barcode: '',
};

export default function ItemModal({
  isOpen,
  mode,
  item,
  categories,
  units,
  warehouses,
  onClose,
  onSave,
}: ItemModalProps) {
  if (!isOpen) return null;

  const initial: InventoryFormData = item
    ? {
        name: item.name,
        sku: item.sku,
        type: item.type,
        category: item.category === '—' ? 'Finished Products' : item.category,
        costPrice: item.costPrice,
        sellingPrice: item.sellingPrice,
        stockLevel: item.stockLevel,
        minStock: item.minStock,
        unit: item.unit,
        warehouse: item.warehouse,
        barcode: item.barcode,
      }
    : EMPTY_FORM;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSave({
      name: fd.get('name') as string,
      sku: fd.get('sku') as string,
      type: fd.get('type') as 'Raw' | 'Finished',
      category: fd.get('category') as string,
      costPrice: Number(fd.get('costPrice')),
      sellingPrice: Number(fd.get('sellingPrice')),
      stockLevel: Number(fd.get('stockLevel')),
      minStock: Number(fd.get('minStock')),
      unit: fd.get('unit') as string,
      warehouse: fd.get('warehouse') as string,
      barcode: fd.get('barcode') as string,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="erp-card relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="erp-text text-lg font-bold">
            {mode === 'add' ? 'Add Inventory Item' : 'Edit Inventory Item'}
          </h2>
          <button onClick={onClose} className="erp-btn-ghost rounded-lg p-1.5">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Item Name" name="name" defaultValue={initial.name} required />
            <Field label="SKU" name="sku" defaultValue={initial.sku} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Type" name="type" defaultValue={initial.type} options={['Raw', 'Finished']} />
            <SelectField label="Category" name="category" defaultValue={initial.category} options={categories} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Cost Price" name="costPrice" type="number" defaultValue={initial.costPrice} step="0.01" />
            <Field label="Selling Price" name="sellingPrice" type="number" defaultValue={initial.sellingPrice} step="0.01" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stock Level" name="stockLevel" type="number" defaultValue={initial.stockLevel} />
            <Field label="Min Stock" name="minStock" type="number" defaultValue={initial.minStock} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Unit" name="unit" defaultValue={initial.unit} options={units} />
            <SelectField label="Warehouse" name="warehouse" defaultValue={initial.warehouse} options={warehouses} />
          </div>
          <Field label="Barcode" name="barcode" defaultValue={initial.barcode} />

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="erp-btn-ghost erp-card rounded-lg border px-4 py-2 text-sm font-medium">
              Cancel
            </button>
            <button type="submit" className="erp-btn-primary rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              {mode === 'add' ? 'Add Item' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  required,
  step,
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  type?: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <div>
      <label className="erp-muted mb-1 block text-xs font-medium">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        step={step}
        className="erp-input w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <div>
      <label className="erp-muted mb-1 block text-xs font-medium">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="erp-input w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
