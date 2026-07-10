import { ArrowLeft } from 'lucide-react';
import ScreenFrame from './ScreenFrame';
import { InventoryFormData, InventoryItem } from '../types';

interface ItemFormPageProps {
  mode: 'add' | 'edit';
  item?: InventoryItem;
  categories: string[];
  units: string[];
  warehouses: string[];
  onBack: () => void;
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

export default function ItemFormPage({
  mode,
  item,
  categories,
  units,
  warehouses,
  onBack,
  onSave,
}: ItemFormPageProps) {
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

  const title = mode === 'add' ? 'Add Inventory Item' : 'Edit Inventory Item';

  return (
    <ScreenFrame
      title={title}
      subtitle="Inventory Management"
      toolbar={
        <button type="button" onClick={onBack} className="erp-btn-ghost flex items-center gap-1">
          <ArrowLeft size={14} />
          Back
        </button>
      }
      formPanel={
        <form id="inventory-form" onSubmit={handleSubmit}>
          <div className="mb-2 flex flex-wrap items-center gap-4">
            <span className="erp-accent-red text-sm">LOCAL</span>
            <span className="erp-field-label">Party Type</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Item Name" name="name" defaultValue={initial.name} required />
            <Field label="Item Code (SKU)" name="sku" defaultValue={initial.sku} required />
            <SelectField label="Type" name="type" defaultValue={initial.type} options={['Raw', 'Finished']} />
            <SelectField label="Category" name="category" defaultValue={initial.category} options={categories} />
            <Field label="Cost Price" name="costPrice" type="number" defaultValue={initial.costPrice} step="0.01" />
            <Field label="Selling Price" name="sellingPrice" type="number" defaultValue={initial.sellingPrice} step="0.01" />
            <Field label="Stock Qty" name="stockLevel" type="number" defaultValue={initial.stockLevel} highlight />
            <Field label="Demand Qty (Min Stock)" name="minStock" type="number" defaultValue={initial.minStock} highlight />
            <SelectField label="UOM" name="unit" defaultValue={initial.unit} options={units} />
            <SelectField label="Warehouse" name="warehouse" defaultValue={initial.warehouse} options={warehouses} />
            <Field label="Barcode" name="barcode" defaultValue={initial.barcode} />
          </div>
        </form>
      }
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <button type="button" onClick={onBack} className="erp-btn-ghost">Cancel</button>
          <button type="submit" form="inventory-form" className="erp-btn-primary erp-btn-save">Save</button>
        </div>
      }
    />
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  required,
  step,
  highlight,
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  type?: string;
  required?: boolean;
  step?: string;
  highlight?: boolean;
}) {
  return (
    <div className="erp-field-row">
      <label className="erp-field-label">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        step={step}
        className={`erp-input w-full ${highlight ? 'erp-cell-highlight' : ''}`}
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
    <div className="erp-field-row">
      <label className="erp-field-label">{label}</label>
      <select name={name} defaultValue={defaultValue} className="erp-classic-select w-full">
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
