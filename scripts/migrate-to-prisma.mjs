import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

const prisma = new PrismaClient();

function readJSON(p, fallback = null) {
  try {
    if (!fs.existsSync(p)) return fallback;
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch (err) {
    console.warn(`Could not read ${p}:`, err.message);
    return fallback;
  }
}

function readAllDir(dirName) {
  const targetDir = path.join(DATA_DIR, dirName);
  if (!fs.existsSync(targetDir)) return [];
  const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.json'));
  const results = [];
  for (const f of files) {
    const item = readJSON(path.join(targetDir, f));
    if (item) results.push(item);
  }
  return results;
}

async function migrate() {
  console.log('--- Starting Data Migration to Prisma SQLite ---');

  // 1. Templates
  const templates = readAllDir('templates');
  for (const t of templates) {
    if (!t.id) continue;
    await prisma.termsTemplate.upsert({
      where: { id: String(t.id) },
      update: { name: t.name || 'Terms', content: t.content || '' },
      create: { id: String(t.id), name: t.name || 'Terms', content: t.content || '' },
    });
  }
  console.log(`Migrated ${templates.length} templates.`);

  // 2. Clients
  const clients = readAllDir('clients');
  for (const c of clients) {
    if (!c.id) continue;
    await prisma.client.upsert({
      where: { id: String(c.id) },
      update: {
        name: c.name || '',
        gstin: c.gstin || null,
        pan: c.pan || null,
        email: c.email || null,
        phone: c.phone || null,
        billingAddress: c.billingAddress || c.address || null,
        shippingAddress: c.shippingAddress || null,
        state: c.state || null,
        stateCode: c.stateCode ? String(c.stateCode) : null,
        creditLimit: c.creditLimit ? Number(c.creditLimit) : null,
        openingBalance: c.openingBalance ? Number(c.openingBalance) : null,
        notes: c.notes || null,
        rawData: JSON.stringify(c),
      },
      create: {
        id: String(c.id),
        name: c.name || '',
        gstin: c.gstin || null,
        pan: c.pan || null,
        email: c.email || null,
        phone: c.phone || null,
        billingAddress: c.billingAddress || c.address || null,
        shippingAddress: c.shippingAddress || null,
        state: c.state || null,
        stateCode: c.stateCode ? String(c.stateCode) : null,
        creditLimit: c.creditLimit ? Number(c.creditLimit) : null,
        openingBalance: c.openingBalance ? Number(c.openingBalance) : null,
        notes: c.notes || null,
        rawData: JSON.stringify(c),
      },
    });
  }
  console.log(`Migrated ${clients.length} clients.`);

  // 3. Products
  const products = readAllDir('products');
  for (const p of products) {
    if (!p.id) continue;
    await prisma.product.upsert({
      where: { id: String(p.id) },
      update: {
        name: p.name || '',
        hsn: p.hsn || null,
        unit: p.unit || null,
        price: Number(p.price || p.rate || 0),
        purchasePrice: p.purchasePrice ? Number(p.purchasePrice) : null,
        taxRate: Number(p.taxRate || p.gst || 0),
        stock: p.stock !== undefined ? Number(p.stock) : null,
        lowStockAlert: p.lowStockAlert !== undefined ? Number(p.lowStockAlert) : null,
        cess: p.cess !== undefined ? Number(p.cess) : null,
        cessType: p.cessType || null,
        category: p.category || null,
        rawData: JSON.stringify(p),
      },
      create: {
        id: String(p.id),
        name: p.name || '',
        hsn: p.hsn || null,
        unit: p.unit || null,
        price: Number(p.price || p.rate || 0),
        purchasePrice: p.purchasePrice ? Number(p.purchasePrice) : null,
        taxRate: Number(p.taxRate || p.gst || 0),
        stock: p.stock !== undefined ? Number(p.stock) : null,
        lowStockAlert: p.lowStockAlert !== undefined ? Number(p.lowStockAlert) : null,
        cess: p.cess !== undefined ? Number(p.cess) : null,
        cessType: p.cessType || null,
        category: p.category || null,
        rawData: JSON.stringify(p),
      },
    });
  }
  console.log(`Migrated ${products.length} products.`);

  // 4. Bills / Invoices
  const bills = readAllDir('bills');
  for (const b of bills) {
    if (!b.id) continue;
    const invDate = b.invoiceDate ? new Date(b.invoiceDate) : new Date();
    await prisma.invoice.upsert({
      where: { id: String(b.id) },
      update: {
        invoiceNumber: String(b.invoiceNumber || b.id),
        type: b.type || 'tax-invoice',
        invoiceDate: isNaN(invDate.getTime()) ? new Date() : invDate,
        dueDate: b.dueDate && !isNaN(new Date(b.dueDate).getTime()) ? new Date(b.dueDate) : null,
        clientId: b.clientId || null,
        clientName: b.clientName || null,
        clientGstin: b.clientGstin || null,
        placeOfSupply: b.placeOfSupply || null,
        subtotal: Number(b.subtotal || 0),
        taxTotal: Number(b.taxTotal || 0),
        total: Number(b.total || 0),
        balanceDue: Number(b.balanceDue || 0),
        status: b.status || 'unpaid',
        payments: JSON.stringify(b.payments || []),
        items: JSON.stringify(b.items || []),
        metadata: JSON.stringify(b),
        isDeleted: false,
      },
      create: {
        id: String(b.id),
        invoiceNumber: String(b.invoiceNumber || b.id),
        type: b.type || 'tax-invoice',
        invoiceDate: isNaN(invDate.getTime()) ? new Date() : invDate,
        dueDate: b.dueDate && !isNaN(new Date(b.dueDate).getTime()) ? new Date(b.dueDate) : null,
        clientId: b.clientId || null,
        clientName: b.clientName || null,
        clientGstin: b.clientGstin || null,
        placeOfSupply: b.placeOfSupply || null,
        subtotal: Number(b.subtotal || 0),
        taxTotal: Number(b.taxTotal || 0),
        total: Number(b.total || 0),
        balanceDue: Number(b.balanceDue || 0),
        status: b.status || 'unpaid',
        payments: JSON.stringify(b.payments || []),
        items: JSON.stringify(b.items || []),
        metadata: JSON.stringify(b),
        isDeleted: false,
      },
    });
  }
  console.log(`Migrated ${bills.length} bills.`);

  // 5. Expenses
  const expenses = readAllDir('expenses');
  for (const e of expenses) {
    if (!e.id) continue;
    const expDate = e.date ? new Date(e.date) : new Date();
    await prisma.expense.upsert({
      where: { id: String(e.id) },
      update: {
        date: isNaN(expDate.getTime()) ? new Date() : expDate,
        category: e.category || 'General',
        description: e.description || '',
        amount: Number(e.amount || 0),
        paymentMode: e.paymentMode || null,
        vendor: e.vendor || null,
        gstin: e.gstin || null,
        itcEligible: Boolean(e.itcEligible),
        rawData: JSON.stringify(e),
      },
      create: {
        id: String(e.id),
        date: isNaN(expDate.getTime()) ? new Date() : expDate,
        category: e.category || 'General',
        description: e.description || '',
        amount: Number(e.amount || 0),
        paymentMode: e.paymentMode || null,
        vendor: e.vendor || null,
        gstin: e.gstin || null,
        itcEligible: Boolean(e.itcEligible),
        rawData: JSON.stringify(e),
      },
    });
  }
  console.log(`Migrated ${expenses.length} expenses.`);

  // 6. Profiles
  const profiles = readAllDir('profiles');
  const mainProfile = readJSON(path.join(DATA_DIR, 'profile.json'));
  if (mainProfile) {
    await prisma.profile.upsert({
      where: { id: 'default' },
      update: {
        name: mainProfile.name || 'My Business',
        gstin: mainProfile.gstin || null,
        rawData: JSON.stringify(mainProfile),
      },
      create: {
        id: 'default',
        name: mainProfile.name || 'My Business',
        gstin: mainProfile.gstin || null,
        rawData: JSON.stringify(mainProfile),
      },
    });
  }
  for (const prof of profiles) {
    if (!prof.id) continue;
    await prisma.profile.upsert({
      where: { id: String(prof.id) },
      update: {
        name: prof.name || 'Business',
        gstin: prof.gstin || null,
        rawData: JSON.stringify(prof),
      },
      create: {
        id: String(prof.id),
        name: prof.name || 'Business',
        gstin: prof.gstin || null,
        rawData: JSON.stringify(prof),
      },
    });
  }
  console.log(`Migrated profiles.`);

  // 7. Local Prefs
  const prefs = readJSON(path.join(DATA_DIR, 'local-prefs.json'), {});
  for (const [k, v] of Object.entries(prefs)) {
    await prisma.localPref.upsert({
      where: { key: k },
      update: { value: String(v) },
      create: { key: k, value: String(v) },
    });
  }
  console.log(`Migrated local preferences.`);

  console.log('--- Migration completed successfully! ---');
}

migrate()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
