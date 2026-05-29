export interface VehicleFitment {
  yearStart: number;
  yearEnd: number;
  make: string;
  models: string[];
  engines?: string[];
}

export interface Part {
  id: string;
  sku: string;
  name: string;
  category: string;
  condition: 'New' | 'OEM Remanufactured' | 'Used - Grade A' | 'Used - Grade B';
  price: number;
  cost: number; // For ROI/expense calculations
  stock: number;
  warehouseLocation: string; // e.g. "Aisle 4, Shelf C"
  fitment: VehicleFitment;
  description: string;
  image: string;
  oemNumber: string;
  brand: string;
  weightLbs: number;
}

export type LeadStatus =
  | 'Fresh Lead'
  | 'Follow Up'
  | 'Quotation Given'
  | 'Sold'
  | 'Bad Number'
  | 'Need More Info'
  | 'Not Interested';

export type LeadType = 'Web Query' | 'Phone Call' | 'Live Chat';

export interface LeadNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isSystem?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  partRequested: string;
  vehicle: {
    year: number;
    make: string;
    model: string;
    engineSize?: string;
  };
  status: LeadStatus;
  type: LeadType;
  owner: string;
  soldAmount?: number;
  loanAmount?: number;
  cardAmount?: number;
  refundAmount?: number;
  chargebackAmount?: number;
  createdAt: string;
  notes: LeadNote[];
}

export interface PaymentTransaction {
  id: string;
  leadId?: string;
  customerName: string;
  amount: number;
  status: 'Success' | 'Pending' | 'Failed';
  source: 'Card' | 'Loan/Financing' | 'PayPal' | 'Bank Wire';
  date: string;
  reference: string;
  receiptUrl?: string;
}

export interface PhoneLog {
  id: string;
  agentName: string;
  customerName: string;
  phoneNumber: string;
  durationSeconds: number;
  direction: 'Inbound' | 'Outbound';
  timestamp: string;
  recordingUrl?: string;
  transcription?: string;
}

export interface PurchaseOffer {
  id: string;
  supplierName: string;
  partDetails: string;
  priceRequested: number;
  status: 'Pending' | 'Approved' | 'Declined' | 'Received';
  createdAt: string;
}

export interface UserAgent {
  id: string;
  name: string;
  role: 'Agent' | 'Sales Manager' | 'Inventory Specialist' | 'Administrator';
  email: string;
  commissionRate: number; // e.g. 0.05 for 5%
  status: 'Active' | 'Offline';
}

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
}

export interface CrmMail {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  folder: 'Inbox' | 'Sent' | 'Drafts';
}

export interface SupportTicket {
  id: string;
  customerName: string;
  email: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  chatHistory?: { sender: 'customer' | 'agent'; message: string; timestamp: string }[];
}

export interface PartOrder {
  id: string;
  partId: string;
  partName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  paymentStatus: 'Success' | 'Pending' | 'Failed';
  orderDate: string;
  logistics: {
    provider: 'FedEx SuperSaver' | 'UPS Ground' | 'Freight Express' | 'DHL Worldwide';
    rate: number;
    trackingNumber: string;
    status: 'Order Placed' | 'Warehouse Picked' | 'In Transit' | 'Delivered';
    logs: { status: string; timestamp: string; location: string }[];
  };
}

export interface TrainingMaterial {
  id: string;
  title: string;
  category: 'Sales Scripts' | 'Objection Handling' | 'Technical Parts Info';
  content: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  partName: string;
  rating: number; // 1-5
  comment: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  replyContent?: string;
  createdAt: string;
}
