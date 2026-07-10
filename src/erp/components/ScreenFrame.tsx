import { ReactNode } from 'react';

interface ScreenFrameProps {
  title: string;
  subtitle?: string;
  toolbar?: ReactNode;
  formPanel?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}

export default function ScreenFrame({ title, subtitle, toolbar, formPanel, children, footer }: ScreenFrameProps) {
  return (
    <div className="erp-document">
      <div className="erp-titlebar">{title}</div>

      <div className="erp-statusbar">
        <div className="erp-statusbar-field">
          <label>Status</label>
          <span className="erp-statusbar-value erp-status-active">Created</span>
        </div>
        <div className="erp-statusbar-field">
          <label>Company</label>
          <span className="erp-statusbar-value">Taimor Packages</span>
        </div>
        <div className="erp-statusbar-field">
          <label>Type</label>
          <span className="erp-statusbar-value">Local</span>
        </div>
        <div className="erp-statusbar-field">
          <label>Branch</label>
          <span className="erp-statusbar-value">Main Branch</span>
        </div>
        {subtitle && (
          <div className="erp-statusbar-field ml-auto hidden sm:flex">
            <label>Module</label>
            <span className="erp-statusbar-value">{subtitle}</span>
          </div>
        )}
      </div>

      {toolbar && <div className="erp-toolbar">{toolbar}</div>}
      {formPanel && <div className="erp-form-panel">{formPanel}</div>}

      <div className="erp-document-body">{children ?? null}</div>

      {footer && (
        <div className="erp-toolbar border-t border-b-0">
          {footer}
        </div>
      )}
    </div>
  );
}
