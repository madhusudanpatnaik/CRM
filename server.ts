import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// Import initial data to seed the persistent database
import {
  INITIAL_PARTS,
  INITIAL_LEADS,
  INITIAL_PAYMENTS,
  INITIAL_PHONE_LOGS,
  INITIAL_PURCHASES,
  INITIAL_AGENTS,
  INITIAL_TASKS,
  INITIAL_MAILS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_ORDERS,
  INITIAL_TRAINING,
  INITIAL_REVIEWS
} from './src/data';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'database.json');

app.use(express.json({ limit: '50mb' }));

// Helper function to read database state
function readDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading database file, using fallback:', error);
  }

  // Seed default data if file is missing or corrupted
  const defaultDb = {
    parts: INITIAL_PARTS,
    leads: INITIAL_LEADS,
    payments: INITIAL_PAYMENTS,
    phoneLogs: INITIAL_PHONE_LOGS,
    purchases: INITIAL_PURCHASES,
    agents: INITIAL_AGENTS,
    tasks: INITIAL_TASKS,
    mails: INITIAL_MAILS,
    tickets: INITIAL_SUPPORT_TICKETS,
    orders: INITIAL_ORDERS,
    training: INITIAL_TRAINING,
    reviews: INITIAL_REVIEWS
  };
  writeDatabase(defaultDb);
  return defaultDb;
}

// Helper function to write database state
function writeDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing database file:', error);
  }
}

// API ROUTE: Fetch Entire Unified Database State
app.get('/api/db', (req, res) => {
  const db = readDatabase();
  res.json(db);
});

// API ROUTE: Synchronize full state from administrative controls
app.post('/api/db', (req, res) => {
  const newDb = req.body;
  if (!newDb || typeof newDb !== 'object') {
    return res.status(400).json({ error: 'Invalid database payload' });
  }
  writeDatabase(newDb);
  res.json({ success: true, message: 'Database state updated from client' });
});

// API ROUTE: Direct order placing endpoint to trigger real-time multi-module updates
app.post('/api/orders', (req, res) => {
  const { newOrder } = req.body;
  if (!newOrder || !newOrder.id) {
    return res.status(400).json({ error: 'Invalid order structure' });
  }

  const db = readDatabase();

  // 1. Add order to listing
  db.orders = [newOrder, ...db.orders];

  // 2. Decrement inventory stock securely
  db.parts = db.parts.map((p: any) => {
    if (p.id === newOrder.partId) {
      return { ...p, stock: Math.max(0, p.stock - 1) };
    }
    return p;
  });

  // 3. Document Payment Gateway Ledger
  const transactionRecord = {
    id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: newOrder.customerName,
    amount: newOrder.totalAmount,
    status: 'Success',
    source: 'Card',
    date: new Date().toISOString(),
    reference: `Direct E-commerce Credit Gateway #${newOrder.id}`,
  };
  db.payments = [transactionRecord, ...db.payments];

  // 4. Trace CRM Sales pipeline Lead automatically
  const randomLeadId = `L-${Math.floor(100 + Math.random() * 900)}`;
  const vehicle = newOrder.vehicleSelected || { year: 2020, make: 'Subaru', model: 'Outback', engineSize: '2.5L' };
  
  const newLead = {
    id: randomLeadId,
    name: newOrder.customerName,
    email: newOrder.customerEmail,
    phone: newOrder.customerPhone || '',
    partRequested: newOrder.partName,
    vehicle: {
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      engineSize: vehicle.engineSize || '',
    },
    status: 'Sold',
    type: 'Web Query',
    owner: 'Joe Miller',
    soldAmount: newOrder.totalAmount,
    cardAmount: newOrder.totalAmount,
    loanAmount: 0,
    refundAmount: 0,
    chargebackAmount: 0,
    createdAt: new Date().toISOString(),
    notes: [
      {
        id: `n-gen-${Math.floor(Math.random() * 1000)}`,
        author: 'System',
        content: `Web checkout completed. Secure checkout cleared. Part allocated from inventory. CRM lead allocated status mapped to Joe Miller.`,
        createdAt: new Date().toISOString(),
        isSystem: true,
      },
    ],
  };
  db.leads = [newLead, ...db.leads];

  // 5. Add operational validation task inside workspace
  const followUpTask = {
    id: `KT-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `Authorize Courier Dispatch for: ${newOrder.customerName}`,
    description: `Double check warehouse locations to bundle ${newOrder.partName} configuration list.`,
    assignedTo: 'Joe Miller',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    status: 'Pending',
    priority: 'High',
  };
  db.tasks = [followUpTask, ...db.tasks];

  writeDatabase(db);

  res.json({
    success: true,
    message: 'E-commerce order captured on server, state fully synchronized across all panels.',
    db,
  });
});

// API ROUTE: Post customer support tickets to sync with backoffice CRM
app.post('/api/tickets', (req, res) => {
  const { newTicket } = req.body;
  if (!newTicket || !newTicket.id) {
    return res.status(400).json({ error: 'Invalid support ticket structure' });
  }

  const db = readDatabase();
  db.tickets = [newTicket, ...db.tickets];
  writeDatabase(db);

  res.json({
    success: true,
    message: 'Support ticket published, CRM hotlines notified.',
    db,
  });
});

// API ROUTE: Supply-chain Parts Purchase interactive workflow & Warehouse piping
app.post('/api/purchases/pipe', (req, res) => {
  const { offerId, status, newPart } = req.body;
  if (!offerId) {
    return res.status(400).json({ error: 'Missing offerId identifier' });
  }

  const db = readDatabase();
  
  // Find and update the purchase offer
  let targetOffer = db.purchases.find((p: any) => p.id === offerId);
  if (targetOffer) {
    targetOffer.status = status;
  } else {
    // If it doesn't exist, we can create one dynamically (useful for adding new broker offers directly)
    if (newPart && status === 'Approved') {
      const mockOffer = {
        id: offerId,
        supplierName: 'Copart Scrap Broker',
        partDetails: newPart.name,
        priceRequested: newPart.cost,
        status: status,
        createdAt: new Date().toISOString()
      };
      db.purchases = [mockOffer, ...db.purchases];
      targetOffer = mockOffer;
    }
  }

  // If a part is supplied for warehouse piping and row allocation, append to parts database
  if (newPart) {
    // Ensure unique ID
    const exists = db.parts.some((p: any) => p.id === newPart.id || p.sku === newPart.sku);
    if (!exists) {
      db.parts = [newPart, ...db.parts];
      
      // Auto-schedule an inspector task for Brenda Wu to check in the yard salvage on arrival
      const inspectionTask = {
        id: `KT-${Math.floor(1000 + Math.random() * 9000)}`,
        title: `Pallet Inspection: ${newPart.sku}`,
        description: `Verify scrap components for ${newPart.name} sourced from salvage offer ${offerId}. Allocate securely to ${newPart.warehouseLocation}.`,
        assignedTo: 'Brenda Wu',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
        status: 'Pending',
        priority: 'Medium'
      };
      db.tasks = [inspectionTask, ...db.tasks];
    }
  }

  writeDatabase(db);

  res.json({
    success: true,
    message: `Salvage offer ${offerId} transitioned to ${status}. Warehouse allocations synchronized.`,
    db
  });
});

// Start integration server middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TURBOPARTS] Backend dynamic syncing database online at http://localhost:${PORT}`);
  });
}

startServer();
