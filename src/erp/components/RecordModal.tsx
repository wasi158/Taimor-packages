import { X } from 'lucide-react';
import { FieldDef } from '../config/entityFields';

interface RecordModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  title: string;
  fields: FieldDef[];
  record?: Record<string, unknown>;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
}

function parseValue(field: FieldDef, raw: FormDataEntryValue | null): string | number {
  if (field.type === 'number') return Number(raw) || 0;
  return String(raw ?? '');
}

const FORM_ID = 'record-modal-form';

export default function RecordModal({
  isOpen,
  mode,
  title,
  fields,
  record,
  onClose,
  onSave,
}: RecordModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};
    fields.forEach((field) => {
      data[field.key] = parseValue(field, fd.get(field.key));
    });
    onSave(data);
  };

  const modalTitle = mode === 'add' ? `Add ${title}` : `Edit ${title}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="erp-document relative max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <div className="erp-titlebar flex items-center justify-between pr-2">
          <span>{modalTitle}</span>
          <button type="button" onClick={onClose} className="p-0.5"><X size={16} /></button>
        </div>

        <form id={FORM_ID} onSubmit={handleSubmit} className="erp-form-panel space-y-3">
          {fields.map((field) => {
            const defaultVal = record?.[field.key] ?? (field.type === 'number' ? 0 : '');
            return (
              <div key={field.key} className="erp-field-row">
                <label className="erp-field-label">{field.label}</label>
                {field.type === 'select' ? (
                  <select name={field.key} defaultValue={String(defaultVal)} required={field.required} className="erp-classic-select w-full">
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field.key}
                    type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : 'text'}
                    defaultValue={String(defaultVal)}
                    required={field.required}
                    step={field.type === 'number' ? 'any' : undefined}
                    className="erp-input w-full"
                  />
                )}
              </div>
            );
          })}
        </form>

        <div className="erp-toolbar flex justify-between">
          <button type="button" onClick={onClose} className="erp-btn-ghost">Cancel</button>
          <button type="submit" form={FORM_ID} className="erp-btn-primary erp-btn-save">
            {mode === 'add' ? 'Add' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
