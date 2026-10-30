# Billore

> Modern GST Billing, Invoicing & Financial Operations Platform for India.

Billore is an invoicing and financial management application built with React, Vite, and Express. Designed for Indian businesses, freelancing, agencies, and retail enterprises with support for GST calculations, e-Way bills, multi-currency invoicing, expense tracking, and inventory management.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
This runs both the backend Express API server and the Vite development server with HMR.

- **Web App**: `http://localhost:5173`
- **Backend API**: `http://localhost:47371`

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
Billore/
├── billora-landing/     # Marketing & SaaS landing page
├── public/              # Static assets, fonts, icons, PWA manifest
├── src/                 # Frontend React source code
│   ├── components/      # UI components (Invoices, Clients, GST, Settings, etc.)
│   ├── utils/           # Business logic, tax calculations, helpers
│   ├── App.jsx          # Main application router and state
│   └── main.jsx         # React application entry point
├── scripts/             # Build scripts and unit test suites
├── server.js            # Express API server for local/cloud operations
└── tests/               # Smoke test suites
```

---

## 🛠 Available Scripts

- `npm run dev`: Start backend server and Vite frontend concurrently.
- `npm run build`: Compile and optimize frontend production bundle.
- `npm run start`: Build frontend and run the production Express server.
- `npm run server`: Run the Express API server only.
- `npm run test:unit`: Execute tax calculation, CSV import/export, and discount mode test suites.
- `npm run test`: Run complete unit and smoke tests.
- `npm run lint`: Run ESLint checks across the codebase.

---

## 📖 Documentation

*Add your custom product guides, API documentation, and deployment guides here.*
