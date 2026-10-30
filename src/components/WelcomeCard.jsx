// v1.10.81 - a welcome for new users at the top of the Dashboard (asked for by
// the maintainer): thanks them, and whoever told them about the app, says it
// is free for good, and that support of any amount is welcome but never
// needed. On the page, not a popup; shown until closed and only while the
// business has fewer than 10 invoices (from 10 the daily support card takes
// over, so the two never show together).
import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import BilloreLogo from './BilloreLogo';

const KEY = 'billore_welcomeCard';

const isClosed = () => { try { return localStorage.getItem(KEY) === 'closed'; } catch { return false; } };

export default function WelcomeCard({ invoiceCount }) {
  const [closed, setClosed] = useState(isClosed);
  if (closed || invoiceCount >= 10) return null;
  const close = () => {
    try { localStorage.setItem(KEY, 'closed'); } catch { /* private mode */ }
    setClosed(true);
  };
  return (
    <section className="welcome-card" aria-labelledby="welcome-card-title">
      <button type="button" className="welcome-card-close" onClick={close} aria-label="Close welcome note">
        <X size={18} />
      </button>
      <div style={{ marginBottom: '12px' }}>
        <BilloreLogo size="md" />
      </div>
      <p className="welcome-card-lead">
        Your modern GST invoicing and billing workspace.
      </p>
      <ul className="welcome-card-points">
        <li><strong>Compliant &amp; Complete:</strong> Tax Invoices, Proforma, Delivery Challans, Credit Notes and E-Way Bills.</li>
        <li><strong>GST Reports:</strong> GSTR-1 &amp; GSTR-3B JSON exports, GSTR-2B reconciliation and TDS/TCS.</li>
        <li><strong>Fast &amp; Reliable:</strong> Instant PDF generation, inventory tracking, and payment status updates.</li>
      </ul>
      <div className="welcome-card-actions">
        <button type="button" className="welcome-card-btn welcome-card-btn-primary" onClick={close}>
          Start billing <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
