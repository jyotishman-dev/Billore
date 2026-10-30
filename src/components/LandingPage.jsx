import React, { useState } from 'react';
import './LandingPage.css';
import BilloreLogo from './BilloreLogo';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Menu,
  X,
  FileText,
  BarChart3,
  Package,
  CreditCard,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Layers,
  ChevronDown,
  User,
  Lock,
  Building,
  Mail,
  Zap,
  Sun,
  Moon
} from 'lucide-react';

export default function LandingPage({
  currentUser,
  theme = 'dark',
  onToggleTheme,
  onSignUp,
  onLogin,
  onStartFree,
  onTryDemoInvoice
}) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Auth modal states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'login'
  const [authPlan, setAuthPlan] = useState('Free');
  const [authForm, setAuthForm] = useState({
    name: '',
    businessName: '',
    email: '',
    password: ''
  });
  const [authError, setAuthError] = useState('');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      badge: 'Starter',
      desc: 'Ideal for solo entrepreneurs and new businesses getting started.',
      priceMonthly: 0,
      priceYearly: 0,
      periodLabel: 'forever',
      note: 'No credit card required',
      cta: 'Start Free',
      ctaType: 'primary',
      features: [
        'Unlimited GST invoices & proformas',
        'Offline-first data storage',
        'Custom invoice PDF templates',
        'Basic inventory & stock tracking',
        'GSTR-1 data summary exports'
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      badge: 'Most Flexible',
      desc: 'For growing businesses needing faster billing and multi-profile control.',
      priceMonthly: 799,
      priceYearly: 639,
      periodLabel: '/ month',
      note: billingCycle === 'yearly' ? 'Billed annually (Save 20%)' : 'Billed monthly',
      cta: 'Choose Growth',
      ctaType: 'secondary',
      features: [
        'Everything in Free',
        'Up to 3 business profiles & logos',
        'Recurring invoices & automated reminders',
        'Advanced payment tracking & aging',
        'Custom PDF colour themes & fonts',
        'Priority email assistance'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      popular: true,
      badge: 'Most Popular',
      desc: 'Complete power suite for active sellers, agencies, and high-volume billing.',
      priceMonthly: 1499,
      priceYearly: 1199,
      periodLabel: '/ month',
      note: billingCycle === 'yearly' ? 'Billed annually (Save 20%)' : 'Billed monthly',
      cta: 'Choose Pro',
      ctaType: 'primary',
      features: [
        'Everything in Growth',
        'Unlimited business profiles & clients',
        'Automated GSTR-1 / 3B Excel and JSON prep',
        'Multi-currency & international billing',
        'Barcode scanner integration',
        'Automated WhatsApp payment nudges',
        'Custom signature & stamp upload'
      ]
    },
    {
      id: 'scale',
      name: 'Scale',
      badge: 'Enterprise',
      desc: 'For multi-entity teams, high-volume catalogs, and custom integrations.',
      priceMonthly: null,
      priceYearly: null,
      periodLabel: 'custom',
      note: 'Tailored to your workflow',
      cta: 'Talk to us',
      ctaType: 'secondary',
      features: [
        'Everything in Pro',
        'Dedicated onboarding & migration support',
        'Advanced multi-user roles & permissions',
        'Custom API & ERP webhook integrations',
        'Custom service level agreement (SLA)',
        'Quarterly compliance review'
      ]
    }
  ];

  const faqs = [
    {
      q: 'Can I start using Billore completely free?',
      a: 'Yes! You can sign up in seconds without a credit card. You can create invoices, manage clients, record payments, and download polished PDFs instantly.'
    },
    {
      q: 'Where is my business and customer data stored?',
      a: 'Billore is built with an offline-first privacy architecture. Your data is saved securely in your browser and local storage. You can backup, import, or export your JSON and CSV records at any time.'
    },
    {
      q: 'Does Billore calculate GST and support HSN/SAC codes?',
      a: 'Yes. Billore automatically splits CGST, SGST, and IGST based on the client state, handles reverse charge, calculates line discounts, and provides HSN code lookup.'
    },
    {
      q: 'Can I use Billore on mobile devices and tablets?',
      a: 'Yes! Billore is a progressive web app (PWA) with a responsive design that works seamlessly on desktop, iPad, tablet, and mobile browsers.'
    },
    {
      q: 'How does signing up and choosing a plan work?',
      a: 'Simply create your account with your business name. You can start on the Free tier or activate Growth/Pro whenever your business needs more profiles and automated tools.'
    }
  ];

  const openAuth = (mode = 'signup', planName = 'Free') => {
    if (currentUser) {
      onStartFree?.();
      return;
    }
    setAuthMode(mode);
    setAuthPlan(planName);
    setAuthError('');
    setIsAuthOpen(true);
  };

  const handlePlanClick = (plan) => {
    if (currentUser) {
      onStartFree?.();
    } else {
      setSelectedPlan(plan);
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'signup') {
      if (!authForm.name.trim()) {
        setAuthError('Please enter your full name');
        return;
      }
      if (!authForm.businessName.trim()) {
        setAuthError('Please enter your company / business name');
        return;
      }
      if (!authForm.email.trim() || !authForm.email.includes('@')) {
        setAuthError('Please enter a valid work email address');
        return;
      }
      if (!authForm.password || authForm.password.length < 4) {
        setAuthError('Please choose a password with at least 4 characters');
        return;
      }

      onSignUp?.({
        name: authForm.name.trim(),
        businessName: authForm.businessName.trim(),
        email: authForm.email.trim(),
        plan: authPlan || 'Free',
        signedUpAt: new Date().toISOString()
      });
      setIsAuthOpen(false);
    } else {
      // login
      if (!authForm.email.trim() || !authForm.email.includes('@')) {
        setAuthError('Please enter your email address');
        return;
      }
      if (!authForm.password) {
        setAuthError('Please enter your password');
        return;
      }

      onLogin?.({
        email: authForm.email.trim(),
        name: authForm.name || authForm.email.split('@')[0],
        businessName: authForm.businessName || 'My Business'
      });
      setIsAuthOpen(false);
    }
  };

  const handleFillDemoUser = () => {
    setAuthForm({
      name: 'Vikram Singh',
      businessName: 'Singh Electronics Pvt Ltd',
      email: 'vikram@singhelectronics.com',
      password: 'demoPassword123'
    });
    setAuthError('');
  };

  return (
    <div className={`billore-landing theme-${theme}`}>
      {/* Top Navigation */}
      <header className="nav-shell" id="top">
        <div className="wrap">
          <nav aria-label="Main navigation">
            <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <BilloreLogo size="md" />
            </div>

            <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQs</a>
            </div>

            <div className="nav-actions">
              {onToggleTheme && (
                <button
                  type="button"
                  className="billore-theme-toggle-btn"
                  onClick={onToggleTheme}
                  title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onTryDemoInvoice}
                title="Create a sample invoice right away"
              >
                Try Demo Invoice
                <ArrowUpRight size={15} />
              </button>

              {currentUser ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onStartFree}
                >
                  Go to Dashboard ({currentUser.name?.split(' ')[0] || 'App'})
                  <ArrowRight size={15} />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => openAuth('login')}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => openAuth('signup', 'Free')}
                  >
                    Sign Up Free
                    <ArrowRight size={15} />
                  </button>
                </>
              )}

              <button
                type="button"
                className="menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="announcement">
              <span className="pulse" />
              <span>Billore Suite 2026 · Simple & Compliant GST Invoicing</span>
            </div>
            <h1>
              GST billing, <br />
              <span className="gradient-text">minus the busywork.</span>
            </h1>
            <p className="hero-copy">
              Create compliant tax invoices in seconds, track inventory, reconcile payments, and export GSTR summaries effortlessly. Clean, fast, and crafted for modern Indian business.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '14px 24px', fontSize: '15px' }}
                onClick={() => currentUser ? onStartFree() : openAuth('signup', 'Free')}
              >
                {currentUser ? 'Go to Dashboard' : 'Sign Up Free — Instant Setup'}
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '14px 22px', fontSize: '15px' }}
                onClick={onTryDemoInvoice}
              >
                Try Live Invoice Demo
                <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="hero-proof">
              <div className="proof-item">
                <Check size={14} />
                <span>GST & E-Way Ready</span>
              </div>
              <div className="proof-divider" />
              <div className="proof-item">
                <Check size={14} />
                <span>Offline-First & Private</span>
              </div>
              <div className="proof-divider" />
              <div className="proof-item">
                <Check size={14} />
                <span>No Credit Card Needed</span>
              </div>
            </div>
          </div>

          {/* Hero Visual / Dashboard Preview */}
          <div className="hero-visual" aria-label="Illustration of billing dashboard">
            <div className="orb" />
            
            <div className="float-chip chip-two">
              <CreditCard size={18} />
              <div>
                <strong>Invoice ₹18,500 Paid</strong>
                <span>Instant payment recorded</span>
              </div>
            </div>

            <div className="dashboard-mock">
              <div className="dash-top">
                <div className="dash-logo">
                  <BilloreLogo size="sm" />
                  <span style={{ fontWeight: 400, color: '#83907f', marginLeft: '2px' }}>/ Overview</span>
                </div>
                <div className="dots">
                  <i /><i /><i />
                </div>
              </div>

              <div className="dash-body">
                <div className="dash-greeting">
                  <div>
                    <strong>Good morning 👋</strong>
                    <span>Here is how your business is doing today.</span>
                  </div>
                  <div className="period">This month ▾</div>
                </div>

                <div className="stats">
                  <div className="stat">
                    <div className="stat-label">
                      <TrendingUp size={12} />
                      Revenue
                    </div>
                    <strong>₹2,48,560</strong>
                    <small>↗ 12.8% this month</small>
                  </div>
                  <div className="stat">
                    <div className="stat-label">
                      <FileText size={12} />
                      Invoices
                    </div>
                    <strong>128</strong>
                    <small className="neutral">Across 42 clients</small>
                  </div>
                  <div className="stat">
                    <div className="stat-label">
                      <CreditCard size={12} />
                      Outstanding
                    </div>
                    <strong>₹34,200</strong>
                    <small style={{ color: '#ffb26b' }}>8 due invoices</small>
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-head">
                    <strong>Revenue trend</strong>
                    <span>Jan — Jun <span style={{ color: 'var(--bl-green)' }}>↗</span></span>
                  </div>
                  <div className="chart">
                    <svg viewBox="0 0 460 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="landingAreaFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#c6f36a" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#c6f36a" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path className="chart-grid" d="M0 20H460M0 48H460M0 76H460" />
                      <path
                        style={{ fill: 'url(#landingAreaFill)' }}
                        d="M0 80 C30 75 60 85 90 60 S160 70 200 45 S280 50 320 25 S390 40 460 10 V100 H0 Z"
                      />
                      <path
                        className="chart-line"
                        d="M0 80 C30 75 60 85 90 60 S160 70 200 45 S280 50 320 25 S390 40 460 10"
                      />
                      <circle className="chart-dot" cx="460" cy="10" r="4" />
                    </svg>
                  </div>
                </div>

                <div className="recent">
                  <div className="recent-card">
                    <div className="recent-title">
                      <span>Recent Invoices</span>
                      <button
                        type="button"
                        onClick={onStartFree}
                        style={{ background: 'transparent', border: 0, color: 'var(--bl-green)', fontSize: '10px', cursor: 'pointer' }}
                      >
                        Open Dashboard ↗
                      </button>
                    </div>
                    <div className="invoice-row">
                      <div className="invoice-name">
                        Apex Dynamics Pvt Ltd
                        <span className="invoice-sub">INV-2026-0142 · Today</span>
                      </div>
                      <div className="amount">
                        ₹18,500
                        <span className="status">PAID</span>
                      </div>
                    </div>
                    <div className="invoice-row">
                      <div className="invoice-name">
                        Urban Goods Co.
                        <span className="invoice-sub">INV-2026-0141 · Yesterday</span>
                      </div>
                      <div className="amount">
                        ₹8,240
                        <span className="status" style={{ background: 'rgba(255,178,107,0.1)', color: '#ffb26b' }}>PENDING</span>
                      </div>
                    </div>
                  </div>

                  <div className="recent-card activity-card">
                    <div>
                      <div className="recent-title">Growth</div>
                      <div className="activity-number">+24%</div>
                      <div className="activity-note">vs. last month</div>
                    </div>
                    <div className="activity-bars">
                      <i /><i /><i /><i /><i /><i />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="float-chip chip-one">
              <ShieldCheck size={18} />
              <div>
                <strong>GST Summary Ready</strong>
                <span>All calculations verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="ticker-wrap" aria-label="Product capabilities">
        <div className="ticker">
          <span><b>✳</b> GST Invoices</span>
          <span><b>✳</b> Inventory Control</span>
          <span><b>✳</b> Smart Financial Reports</span>
          <span><b>✳</b> GSTR-1 & 3B Summary</span>
          <span><b>✳</b> Payment Tracking</span>
          <span><b>✳</b> Custom PDF Templates</span>
          <span><b>✳</b> Client Ledger</span>
          <span><b>✳</b> Multiple Business Profiles</span>
          <span><b>✳</b> GST Invoices</span>
          <span><b>✳</b> Inventory Control</span>
          <span><b>✳</b> Smart Financial Reports</span>
          <span><b>✳</b> GSTR-1 & 3B Summary</span>
        </div>
      </div>

      {/* Features Grid */}
      <section className="section" id="features">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">One workspace, zero clutter</span>
            <h2>
              The tools you need.<br />
              <span className="gradient-text">None of the headaches.</span>
            </h2>
            <p>From the initial quotation to month-end tax filing, keep your daily business operations organized and beautiful.</p>
          </div>

          <div className="features-grid">
            <article className="feature-card">
              <span className="feature-index">01 / BILLING</span>
              <div className="feature-icon">
                <FileText size={20} />
              </div>
              <h3>Invoices that impress</h3>
              <p>Create professional GST invoices, proforma bills, credit notes, and delivery challans with custom branding and QR codes.</p>
            </article>

            <article className="feature-card">
              <span className="feature-index">02 / TAX COMPLIANCE</span>
              <div className="feature-icon">
                <ShieldCheck size={20} />
              </div>
              <h3>GST workflows simplified</h3>
              <p>Automatic interstate IGST vs. intrastate CGST/SGST split, HSN code lookups, and clear summaries ready for return filing.</p>
            </article>

            <article className="feature-card">
              <span className="feature-index">03 / INVENTORY</span>
              <div className="feature-icon">
                <Package size={20} />
              </div>
              <h3>Stock without spreadsheets</h3>
              <p>Manage items, units, pricing, barcodes, and low-stock threshold alerts that update as sales and purchases happen.</p>
            </article>

            <article className="feature-card">
              <span className="feature-index">04 / COLLECTIONS</span>
              <div className="feature-icon">
                <CreditCard size={20} />
              </div>
              <h3>Know what is paid & pending</h3>
              <p>Record partial payments, track aging balances, send friendly payment reminders, and keep accounts receivable clear.</p>
            </article>

            <article className="feature-card">
              <span className="feature-index">05 / INSIGHTS</span>
              <div className="feature-icon">
                <BarChart3 size={20} />
              </div>
              <h3>Numbers you can act on</h3>
              <p>Track revenue, profit margins, top-selling items, client trends, and expense breakdowns at a single glance.</p>
            </article>

            <article className="feature-card">
              <span className="feature-index">06 / FLEXIBILITY</span>
              <div className="feature-icon">
                <Layers size={20} />
              </div>
              <h3>Made for how you scale</h3>
              <p>Support for multiple business entities, recurring subscriptions, custom units, and flexible PDF customization.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="section" id="how-it-works" style={{ paddingTop: '20px' }}>
        <div className="wrap workflow">
          <div className="workflow-copy">
            <div className="section-head" style={{ marginBottom: '28px' }}>
              <span className="eyebrow">How it works</span>
              <h2>
                Billing that takes <br />
                <span className="gradient-text">60 seconds or less.</span>
              </h2>
              <p>Say goodbye to complex clunky desktop software. Billore gives you speed and precision on any device.</p>
            </div>

            <div className="workflow-steps">
              <div className="step">
                <div className="step-num">1</div>
                <div>
                  <h3>Select or add your client</h3>
                  <p>Choose from your saved address book or add a client with automated GSTIN verification.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">2</div>
                <div>
                  <h3>Add items & automated tax</h3>
                  <p>Pick items from your inventory; rates, discounts, HSN codes, and GST rates calculate instantly.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">3</div>
                <div>
                  <h3>Download, print, or share</h3>
                  <p>Generate clean, professional PDFs with your company stamp, bank details, and UPI payment QR code.</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '28px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onTryDemoInvoice}
              >
                Try creating an invoice now
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Workflow Preview */}
          <div className="workflow-panel">
            <div className="panel-top">
              <strong>Preview: Clean GST Invoice</strong>
              <span>Live Render</span>
            </div>

            <div className="workflow-tag tag-a">
              <Sparkles size={16} />
              <span>Auto GST & HSN calculation</span>
            </div>

            <div className="invoice-paper">
              <div className="paper-brand">
                <div>
                  <h4>BILLORE TECH</h4>
                  <p>GSTIN: 07AAAAA0000A1Z5</p>
                </div>
                <div className="paper-stamp">ORIGINAL FOR RECIPIENT</div>
              </div>

              <div className="paper-billto">
                <div>
                  <span>Billed to:</span>
                  <strong>Horizon Design Works</strong>
                  <span>Delhi, India · GSTIN: 07BBBBB1111B1Z2</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span>Invoice No: <b>INV-2026-089</b></span>
                  <span>Date: 29 Oct 2026</span>
                </div>
              </div>

              <table className="paper-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>HSN</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Enterprise Cloud Subscription</td>
                    <td>998313</td>
                    <td>1</td>
                    <td>₹15,000</td>
                    <td>₹15,000</td>
                  </tr>
                  <tr>
                    <td>GST Setup & Customization</td>
                    <td>998314</td>
                    <td>1</td>
                    <td>₹5,000</td>
                    <td>₹5,000</td>
                  </tr>
                </tbody>
              </table>

              <div className="paper-total">
                <div>
                  <div>Subtotal: ₹20,000</div>
                  <div>IGST (18%): ₹3,600</div>
                  <div style={{ marginTop: '4px' }}>
                    <strong>Total: ₹23,600</strong>
                  </div>
                </div>
              </div>

              <div className="paper-foot">
                <span>Scan with any UPI app to pay instantly</span>
                <div className="paper-qr" />
              </div>
            </div>

            <div className="workflow-tag tag-b">
              <CheckCircle2 size={16} />
              <span>UPI QR Code & Bank Details embedded</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section className="privacy-band">
        <div className="wrap">
          <div className="privacy-card">
            <div>
              <span className="eyebrow">Your business, your data</span>
              <h2>
                Trust starts with <br />
                <span className="gradient-text">complete privacy.</span>
              </h2>
              <p>
                Your customer contacts, pricing, and revenue records belong entirely to you. Billore keeps your data secure with offline capability, full backup exports, and zero lock-in.
              </p>
            </div>
            <div className="privacy-list">
              <div className="privacy-point">
                <span className="check-circle"><Check size={14} /></span>
                Offline-First Data Storage
              </div>
              <div className="privacy-point">
                <span className="check-circle"><Check size={14} /></span>
                1-Click JSON & CSV Backups
              </div>
              <div className="privacy-point">
                <span className="check-circle"><Check size={14} /></span>
                Client-Side PIN App Lock
              </div>
              <div className="privacy-point">
                <span className="check-circle"><Check size={14} /></span>
                No Vendor Lock-in
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section" id="pricing">
        <div className="wrap">
          <div className="pricing-top">
            <div className="section-head" style={{ margin: 0 }}>
              <span className="eyebrow">Straightforward pricing</span>
              <h2>
                Start free. <br />
                <span className="gradient-text">Upgrade when you scale.</span>
              </h2>
              <p>Everything you need to bill clients today, with flexible options to support your expansion.</p>
            </div>

            <div className="billing-toggle" role="group" aria-label="Billing interval">
              <button
                type="button"
                className={billingCycle === 'monthly' ? 'active' : ''}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                type="button"
                className={billingCycle === 'yearly' ? 'active' : ''}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly <span className="save-pill">SAVE 20%</span>
              </button>
            </div>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => {
              const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
              return (
                <article key={plan.id} className={`price-card ${plan.popular ? 'popular' : ''}`}>
                  {plan.popular && <div className="popular-label">Popular Choice</div>}
                  <div className="plan-name">{plan.name}</div>
                  <p className="plan-desc">{plan.desc}</p>
                  
                  <div className="price">
                    {price !== null ? (
                      <>
                        <span className="currency">₹</span>
                        <strong>{price}</strong>
                        <span className="period">{plan.periodLabel}</span>
                      </>
                    ) : (
                      <strong style={{ fontSize: '28px', letterSpacing: '-0.06em' }}>Let’s talk</strong>
                    )}
                  </div>
                  
                  <div className="price-note">{plan.note}</div>

                  <button
                    type="button"
                    className={`btn plan-cta ${plan.ctaType === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handlePlanClick(plan)}
                  >
                    {plan.cta}
                    {plan.id !== 'free' && <ArrowUpRight size={14} />}
                  </button>

                  <div className="plan-divider">{plan.name} includes:</div>
                  <ul className="plan-features">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <Check size={14} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <p className="pricing-note">
            Transparent pricing tailored for Indian small & medium businesses. Have questions? <a href="#faq">Check our FAQs</a> or launch the app to explore.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section" id="faq" style={{ paddingTop: '20px' }}>
        <div className="wrap faq-layout">
          <div className="faq-intro">
            <span className="eyebrow">Questions, answered</span>
            <h2 style={{ font: "800 clamp(32px, 4.3vw, 48px)/1.08 'Manrope', sans-serif", letterSpacing: '-0.055em', margin: '16px 0' }}>
              Frequently asked <span className="gradient-text">questions.</span>
            </h2>
            <p>Everything you need to know about getting started, GST compliance, and data storage.</p>
            <button
              type="button"
              onClick={() => currentUser ? onStartFree() : openAuth('signup', 'Free')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                color: 'var(--bl-green)',
                fontSize: '13px',
                fontWeight: 700,
                marginTop: '16px',
                background: 'transparent',
                border: 0,
                cursor: 'pointer'
              }}
            >
              Get started right now →
            </button>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item ${openFaq === idx ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} />
                </button>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="final-cta" id="get-started">
        <div className="wrap">
          <div className="cta-panel">
            <span className="eyebrow">Ready to upgrade your workflow?</span>
            <h2>
              Make room for the <br />
              <span className="gradient-text">work that actually matters.</span>
            </h2>
            <p>Experience hassle-free GST billing that respects your time and makes your business look professional.</p>
            <div className="cta-actions">
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '14px 26px', fontSize: '15px' }}
                onClick={() => currentUser ? onStartFree() : openAuth('signup', 'Free')}
              >
                {currentUser ? 'Open App Dashboard' : 'Sign Up Free — Start Invoicing'}
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '14px 26px', fontSize: '15px' }}
                onClick={onTryDemoInvoice}
              >
                Try Interactive Demo
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-top">
            <div>
              <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <BilloreLogo size="md" />
              </div>
              <p className="footer-blurb">
                GST billing, inventory management, and business operations crafted for growing businesses across India.
              </p>
            </div>

            <div className="footer-links">
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQs</a>
              {currentUser ? (
                <button
                  type="button"
                  onClick={onStartFree}
                  style={{ background: 'transparent', border: 0, color: 'var(--bl-green)', fontSize: '12px', cursor: 'pointer', padding: 0 }}
                >
                  Dashboard ↗
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  style={{ background: 'transparent', border: 0, color: '#aab4a7', fontSize: '12px', cursor: 'pointer', padding: 0 }}
                >
                  Log In
                </button>
              )}
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Billore. All rights reserved.</span>
            <span>
              Crafted for modern businesses · <a href="#top">Back to top ↑</a>
            </span>
          </div>
        </div>
      </footer>

      {/* Selected Plan Details Modal */}
      {selectedPlan && (
        <div className="billore-modal-overlay" onClick={() => setSelectedPlan(null)}>
          <div className="billore-modal" onClick={(e) => e.stopPropagation()}>
            <div className="billore-modal-header">
              <div>
                <span className="billore-modal-badge">{selectedPlan.name} Plan</span>
                <h3 style={{ margin: '4px 0', fontSize: '22px' }}>
                  {selectedPlan.id === 'scale' ? 'Custom Enterprise Setup' : `${selectedPlan.name} Subscription`}
                </h3>
              </div>
              <button
                type="button"
                className="billore-modal-close"
                onClick={() => setSelectedPlan(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: '#9ba696', fontSize: '13px', margin: '0 0 16px' }}>
              {selectedPlan.desc}
            </p>

            <div className="billore-modal-price">
              {selectedPlan.id === 'scale' ? (
                <span>Custom Enterprise</span>
              ) : (
                <>
                  ₹{billingCycle === 'yearly' ? selectedPlan.priceYearly : selectedPlan.priceMonthly}
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#8d998a', marginLeft: '6px' }}>
                    {selectedPlan.periodLabel} ({billingCycle})
                  </span>
                </>
              )}
            </div>

            <ul className="billore-modal-features">
              {selectedPlan.features.map((item, idx) => (
                <li key={idx}>
                  <Check size={16} color="var(--bl-green)" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="billore-modal-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSelectedPlan(null);
                  openAuth('signup', selectedPlan.name);
                }}
              >
                {selectedPlan.id === 'scale' ? 'Contact for Setup' : `Continue with ${selectedPlan.name}`}
                <ArrowRight size={15} />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedPlan(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Authentication & Sign Up Modal */}
      {isAuthOpen && (
        <div className="billore-modal-overlay" onClick={() => setIsAuthOpen(false)}>
          <div className="billore-modal billore-auth-card" onClick={(e) => e.stopPropagation()}>
            <div className="billore-modal-header">
              <div>
                <span className="billore-modal-badge">
                  {authMode === 'signup' ? `Plan: ${authPlan}` : 'Welcome Back'}
                </span>
                <h3 style={{ margin: '4px 0', fontSize: '24px' }}>
                  {authMode === 'signup' ? 'Create your Billore account' : 'Log in to Billore'}
                </h3>
              </div>
              <button
                type="button"
                className="billore-modal-close"
                onClick={() => setIsAuthOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="billore-auth-tabs">
              <button
                type="button"
                className={`billore-auth-tab ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => { setAuthMode('signup'); setAuthError(''); }}
              >
                Sign Up
              </button>
              <button
                type="button"
                className={`billore-auth-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
              >
                Log In
              </button>
            </div>

            {authError && (
              <div className="billore-auth-error">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="billore-auth-form">
              {authMode === 'signup' && (
                <>
                  <div className="billore-field">
                    <label>
                      <User size={13} /> Your Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      autoFocus
                    />
                  </div>

                  <div className="billore-field">
                    <label>
                      <Building size={13} /> Business / Store Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sharma Tech & Retail"
                      value={authForm.businessName}
                      onChange={(e) => setAuthForm({ ...authForm, businessName: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="billore-field">
                <label>
                  <Mail size={13} /> Work Email
                </label>
                <input
                  type="email"
                  placeholder="name@business.in"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  autoFocus={authMode === 'login'}
                />
              </div>

              <div className="billore-field">
                <label>
                  <Lock size={13} /> Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />
              </div>

              <div style={{ marginTop: '8px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '13px', fontSize: '14px' }}
                >
                  {authMode === 'signup' ? 'Create Account & Open Dashboard' : 'Log In to Workspace'}
                  <ArrowRight size={16} />
                </button>
              </div>

              <button
                type="button"
                className="billore-quick-demo-btn"
                onClick={handleFillDemoUser}
              >
                <Zap size={14} /> Auto-fill Demo Account
              </button>
            </form>

            <div className="billore-auth-footer">
              {authMode === 'signup' ? (
                <span>
                  Already have an account?{' '}
                  <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }}>
                    Log in
                  </button>
                </span>
              ) : (
                <span>
                  Don’t have an account yet?{' '}
                  <button type="button" onClick={() => { setAuthMode('signup'); setAuthError(''); }}>
                    Sign up free
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
