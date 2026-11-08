import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initialCompanySettings, initialProducts, initialPricingPackages } from './src/data/initialData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

function getPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = Number(process.argv[portArgIndex + 1]);
    if (!isNaN(parsed)) return parsed;
  }
  if (process.env.NODE_ENV !== 'production') {
    return 3000;
  }
  return Number(process.env.PORT) || 3000;
}

const PORT = getPort();

app.use(express.json());

// Persistent database file
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  settings: typeof initialCompanySettings;
  products: typeof initialProducts;
  packages: typeof initialPricingPackages;
  auth: {
    username: string;
    password: string;
  };
  inquiries: Array<{
    id: string;
    customerName: string;
    businessName: string;
    phoneNumber: string;
    whatsappNumber: string;
    email: string;
    softwareInterestedIn: string;
    businessType: string;
    message: string;
    createdAt: string;
    status: 'new' | 'contacted' | 'in_progress' | 'closed';
    notes?: string;
  }>;
}

function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      const data = JSON.parse(content);
      return {
        settings: { ...initialCompanySettings, ...(data.settings || {}) },
        products: data.products && data.products.length ? data.products : initialProducts,
        packages: data.packages && data.packages.length ? data.packages : initialPricingPackages,
        auth: data.auth || {
          username: 'admin',
          password: process.env.ADMIN_PASSWORD || 'AadiAdmin2026!',
        },
        inquiries: data.inquiries || []
      };
    }
  } catch (err) {
    console.error('Error loading database, falling back to defaults:', err);
  }

  const initialDb: DatabaseSchema = {
    settings: initialCompanySettings,
    products: initialProducts,
    packages: initialPricingPackages,
    auth: {
      username: 'admin',
      password: process.env.ADMIN_PASSWORD || 'AadiAdmin2026!',
    },
    inquiries: [
      {
        id: 'inq-demo-1',
        customerName: 'Mohsin Khan',
        businessName: 'Royal Spice Restaurant & Cafe',
        phoneNumber: '+92 321 9876543',
        whatsappNumber: '923219876543',
        email: 'mohsin@royalspice.pk',
        softwareInterestedIn: 'Restaurant POS Software',
        businessType: 'Restaurant / Cafe',
        message: 'Looking for a touch POS system with 2 kitchen printers and Android waiter tablets for a 24-table dine-in restaurant.',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        status: 'new',
        notes: 'Requested urgent quotation.'
      },
      {
        id: 'inq-demo-2',
        customerName: 'Tariq Mehmood',
        businessName: 'Metro General Mart & Wholesale',
        phoneNumber: '+92 333 4567890',
        whatsappNumber: '923334567890',
        email: 'tariq@metromart.com',
        softwareInterestedIn: 'Retail POS Software',
        businessType: 'Supermarket / Retail',
        message: 'Need POS software for 3 barcode checkout lanes with weighing scale integration and daily Z-reports.',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: 'contacted',
        notes: 'Sent WhatsApp brochure and preliminary quotation.'
      }
    ]
  };
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}

let db = loadDatabase();

// Admin Authentication Token
const ADMIN_TOKEN = 'aadi-auth-token-session-sec-2026';

function verifyAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.replace('Bearer ', '') === ADMIN_TOKEN) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
}

// ================= API ROUTES =================

// Auth
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === db.auth.username && password === db.auth.password) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      user: { name: db.auth.username, role: 'admin' }
    });
  }
  return res.status(401).json({ error: 'Invalid admin username or password' });
});

app.get('/api/admin/verify', verifyAdmin, (_req, res) => {
  res.json({ valid: true, user: { name: db.auth.username, role: 'admin' } });
});

app.get('/api/admin/credentials-info', verifyAdmin, (_req, res) => {
  res.json({ username: db.auth.username });
});

app.post('/api/admin/change-password', verifyAdmin, (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required.' });
  }

  if (currentPassword !== db.auth.password) {
    return res.status(400).json({ error: 'Current password does not match.' });
  }

  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ error: 'New password must be at least 4 characters.' });
  }

  if (newUsername && newUsername.trim()) {
    db.auth.username = newUsername.trim();
  }
  db.auth.password = newPassword.trim();
  saveDatabase(db);

  return res.json({
    success: true,
    message: 'Password and credentials updated successfully.',
    username: db.auth.username
  });
});

// Settings
app.get('/api/settings', (_req, res) => {
  res.json(db.settings);
});

app.put('/api/settings', verifyAdmin, (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  saveDatabase(db);
  res.json({ success: true, settings: db.settings });
});

// Products
app.get('/api/products', (_req, res) => {
  res.json(db.products);
});

app.post('/api/products', verifyAdmin, (req, res) => {
  const newProduct = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}`,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true,
    order: db.products.length + 1
  };
  db.products.push(newProduct);
  saveDatabase(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  db.products[index] = { ...db.products[index], ...req.body };
  saveDatabase(db);
  res.json(db.products[index]);
});

app.delete('/api/products/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  db.products = db.products.filter(p => p.id !== id);
  saveDatabase(db);
  res.json({ success: true, id });
});

// Packages
app.get('/api/packages', (_req, res) => {
  res.json(db.packages);
});

app.put('/api/packages/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.packages.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Package not found' });
  }
  db.packages[index] = { ...db.packages[index], ...req.body };
  saveDatabase(db);
  res.json(db.packages[index]);
});

// Inquiries
app.get('/api/inquiries', verifyAdmin, (_req, res) => {
  res.json(db.inquiries);
});

app.post('/api/inquiries', (req, res) => {
  const {
    customerName,
    businessName,
    phoneNumber,
    whatsappNumber,
    email,
    softwareInterestedIn,
    businessType,
    message
  } = req.body;

  if (!customerName || !phoneNumber || !message) {
    return res.status(400).json({ error: 'Name, phone number, and message are required.' });
  }

  const newInquiry = {
    id: `inq-${Date.now()}`,
    customerName: customerName.trim(),
    businessName: (businessName || '').trim(),
    phoneNumber: phoneNumber.trim(),
    whatsappNumber: (whatsappNumber || phoneNumber).trim(),
    email: (email || '').trim(),
    softwareInterestedIn: softwareInterestedIn || 'General Software Inquiry',
    businessType: (businessType || '').trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
    status: 'new' as const
  };

  db.inquiries.unshift(newInquiry);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been submitted successfully! Our team will contact you shortly.',
    inquiry: newInquiry
  });
});

app.patch('/api/inquiries/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.inquiries.findIndex(i => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }
  db.inquiries[index] = { ...db.inquiries[index], ...req.body };
  saveDatabase(db);
  res.json(db.inquiries[index]);
});

app.delete('/api/inquiries/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  db.inquiries = db.inquiries.filter(i => i.id !== id);
  saveDatabase(db);
  res.json({ success: true, id });
});

// Vite Integration for dev & prod
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AADI Software Solutions server running at http://localhost:${PORT}`);
  });
}

startServer();
