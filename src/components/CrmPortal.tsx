import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Users2,
  PackageCheck,
  UserCheck,
  CheckSquare,
  Mail,
  HelpCircle,
  ShoppingBag,
  GraduationCap,
  Star,
  Layers,
  Wrench,
  Search,
  Plus,
  ArrowUpDown,
  Phone,
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  Filter,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  Send,
  Trash2,
  ChevronLeft,
} from 'lucide-react';
import {
  Part,
  Lead,
  PaymentTransaction,
  PhoneLog,
  PurchaseOffer,
  UserAgent,
  AgentTask,
  CrmMail,
  SupportTicket,
  PartOrder,
  TrainingMaterial,
  CustomerReview,
  LeadStatus,
  LeadType,
} from '../types';

interface CrmPortalProps {
  parts: Part[];
  leads: Lead[];
  payments: PaymentTransaction[];
  phoneLogs: PhoneLog[];
  purchases: PurchaseOffer[];
  agents: UserAgent[];
  tasks: AgentTask[];
  mails: CrmMail[];
  tickets: SupportTicket[];
  orders: PartOrder[];
  training: TrainingMaterial[];
  reviews: CustomerReview[];

  onAddPart: (part: Part) => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onAddLeadNote: (leadId: string, noteText: string, author: string) => void;
  onUpdateLeadFinances: (
    leadId: string,
    sold: number,
    card: number,
    loan: number,
    refund: number,
    chargeback: number
  ) => void;
  onAddPayment: (payment: PaymentTransaction) => void;
  onAddPurchase: (offer: PurchaseOffer) => void;
  onAddTask: (task: AgentTask) => void;
  onSendMail: (mail: CrmMail) => void;
  onAddSupportReply: (ticketId: string, messageText: string, sender: 'agent' | 'customer') => void;
  onUpdateOrderStatus: (orderId: string, status: 'Order Placed' | 'Warehouse Picked' | 'In Transit' | 'Delivered', logEntry: string) => void;
  onReviewModerate: (reviewId: string, action: 'Approved' | 'Rejected', reply?: string) => void;
  onDeleteLead: (leadId: string) => void;
  onAddLeads: (leads: Lead[]) => void;
  onAddPhoneLogs: (logs: PhoneLog[]) => void;
  onChangeViewMode: (mode: 'catalog' | 'crm') => void;
}

export default function CrmPortal({
  parts,
  leads,
  payments,
  phoneLogs,
  purchases,
  agents,
  tasks,
  mails,
  tickets,
  orders,
  training,
  reviews,

  onAddPart,
  onUpdateLeadStatus,
  onAddLeadNote,
  onUpdateLeadFinances,
  onAddPayment,
  onAddPurchase,
  onAddTask,
  onSendMail,
  onAddSupportReply,
  onUpdateOrderStatus,
  onReviewModerate,
  onDeleteLead,
  onAddLeads,
  onAddPhoneLogs,
  onChangeViewMode,
}: CrmPortalProps) {
  // Navigation Menu Active Tab
  const [activeMenu, setActiveMenu] = useState<string>('Dashboard');

  // Submenus for Lead module
  const [activeLeadSubmenu, setActiveLeadSubmenu] = useState<'LeadList' | 'PhoneLogs'>('LeadList');

  // General Filter Parameters
  const [timeframe, setTimeframe] = useState<string>('Last 28 days'); // Today, Yesterday, Last 7 days, Last 28 days, Last 3 months, Custom
  const [filterAgent, setFilterAgent] = useState<string>('All');
  const [filterPartType, setFilterPartType] = useState<string>('All');

  // Lead List Pagination & Search Settings
  const [leadPageSize, setLeadPageSize] = useState<number>(25);
  const [leadCurrentPage, setLeadCurrentPage] = useState<number>(1);
  const [leadSearchQuery, setLeadSearchQuery] = useState<string>('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('All');

  // Selected Lead Profile Mode (Full Tracking Profile Detailed view)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // New Note composition
  const [newNoteAuthor, setNewNoteAuthor] = useState<string>('Joe Miller');
  const [newNoteText, setNewNoteText] = useState<string>('');

  // Financial Edit Form Mode for active lead detail
  const [isEditingFinances, setIsEditingFinances] = useState<boolean>(false);
  const [formSoldAmount, setFormSoldAmount] = useState<number>(0);
  const [formCardAmount, setFormCardAmount] = useState<number>(0);
  const [formLoanAmount, setFormLoanAmount] = useState<number>(0);
  const [formRefundAmount, setFormRefundAmount] = useState<number>(0);
  const [formChargebackAmount, setFormChargebackAmount] = useState<number>(0);

  // Compose Quick Actions (SMS / Mail Trigger Simulator inside Profile page)
  const [quickActionType, setQuickActionType] = useState<'Email' | 'SMS' | 'Task' | 'Payment' | null>(null);
  const [quickActionText, setQuickActionText] = useState<string>('');

  // Add parts state validation
  const [isAddPartModalOpen, setIsAddPartModalOpen] = useState<boolean>(false);
  const [newPartName, setNewPartName] = useState('');
  const [newPartCategory, setNewPartCategory] = useState('Engine');
  const [newPartCondition, setNewPartCondition] = useState<'New' | 'OEM Remanufactured' | 'Used - Grade A' | 'Used - Grade B'>('New');
  const [newPartPrice, setNewPartPrice] = useState(0);
  const [newPartCost, setNewPartCost] = useState(0);
  const [newPartStock, setNewPartStock] = useState(1);
  const [newPartBrand, setNewPartBrand] = useState('');
  const [newPartOem, setNewPartOem] = useState('');
  const [newPartLocation, setNewPartLocation] = useState('');
  const [newPartWeight, setNewPartWeight] = useState(10);
  const [newPartFitMake, setNewPartFitMake] = useState('');
  const [newPartFitModels, setNewPartFitModels] = useState('');
  const [newPartFitYearStart, setNewPartFitYearStart] = useState(2015);
  const [newPartFitYearEnd, setNewPartFitYearEnd] = useState(2025);

  // Support Inbox Interactive Active Ticket
  const [activeTicketId, setActiveTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [supportAgentReply, setSupportAgentReply] = useState<string>('');

  // Mail Client Inbox view states
  const [mailFolder, setMailFolder] = useState<'Inbox' | 'Sent' | 'Drafts'>('Inbox');
  const [selectedMailId, setSelectedMailId] = useState<string | null>(mails[0]?.id || null);
  const [isComposingMail, setIsComposingMail] = useState<boolean>(false);
  const [mailTo, setMailTo] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailBody, setMailBody] = useState('');

  // Add Task inline helper state
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAgent, setTaskAgent] = useState('Joe Miller');
  const [taskDueDate, setTaskDueDate] = useState('2026-05-30');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [taskSearchQuery, setTaskSearchQuery] = useState<string>('');

  // Inventory search Query helper
  const [inventorySearch, setInventorySearch] = useState('');

  // Moderate review state reply helper
  const [reviewReplyText, setReviewReplyText] = useState<{ [key: string]: string }>({});

  // Lead upload & manual options states
  const [isAddingLeadManual, setIsAddingLeadManual] = useState<boolean>(false);
  const [isUploadingLeads, setIsUploadingLeads] = useState<boolean>(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadPart, setNewLeadPart] = useState('');
  const [newLeadYear, setNewLeadYear] = useState('');
  const [newLeadMake, setNewLeadMake] = useState('');
  const [newLeadModel, setNewLeadModel] = useState('');
  const [newLeadEngine, setNewLeadEngine] = useState('');
  const [newLeadStatus, setNewLeadStatus] = useState<LeadStatus>('Fresh Lead');
  const [newLeadType, setNewLeadType] = useState<LeadType>('Phone Call');
  const [newLeadOwner, setNewLeadOwner] = useState('');
  const [leadUploadError, setLeadUploadError] = useState<string | null>(null);
  const [leadUploadPreview, setLeadUploadPreview] = useState<Lead[]>([]);

  // Phone log upload & manual options states
  const [isAddingPhoneManual, setIsAddingPhoneManual] = useState<boolean>(false);
  const [isUploadingPhone, setIsUploadingPhone] = useState<boolean>(false);
  const [newLogAgent, setNewLogAgent] = useState('');
  const [newLogCustomer, setNewLogCustomer] = useState('');
  const [newLogPhone, setNewLogPhone] = useState('');
  const [newLogDuration, setNewLogDuration] = useState('');
  const [newLogDirection, setNewLogDirection] = useState<'Inbound' | 'Outbound'>('Inbound');
  const [newLogRecording, setNewLogRecording] = useState('');
  const [newLogTranscription, setNewLogTranscription] = useState('');
  const [phoneUploadError, setPhoneUploadError] = useState<string | null>(null);
  const [phoneUploadPreview, setPhoneUploadPreview] = useState<PhoneLog[]>([]);

  // Submit manual Lead
  const handleManualLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) return;

    const newLead: Lead = {
      id: `L-${Math.floor(10000 + Math.random() * 90000)}`,
      name: newLeadName,
      email: newLeadEmail || `${newLeadName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: newLeadPhone || '(555) 000-0000',
      partRequested: newLeadPart || 'Alternator OEM',
      vehicle: {
        year: parseInt(newLeadYear) || 2020,
        make: newLeadMake || 'Toyota',
        model: newLeadModel || 'Camry',
        engineSize: newLeadEngine || '2.5L L4'
      },
      status: newLeadStatus,
      type: newLeadType,
      owner: newLeadOwner || (agents[0]?.name || 'Joe Miller'),
      createdAt: new Date().toISOString(),
      notes: [
        {
          id: `n-${Date.now()}`,
          author: 'System',
          content: 'Lead registered through Admin panel manually.',
          createdAt: new Date().toISOString(),
          isSystem: true
        }
      ]
    };

    onAddLeads([newLead]);

    // reset fields
    setNewLeadName('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setNewLeadPart('');
    setNewLeadYear('');
    setNewLeadMake('');
    setNewLeadModel('');
    setNewLeadEngine('');
    setNewLeadStatus('Fresh Lead');
    setIsAddingLeadManual(false);
  };

  // CSV Lead Upload parses text client-side
  const handleLeadCSVUpload = (text: string) => {
    try {
      const lines = text.split('\n');
      const parsed: Lead[] = [];
      
      const isJson = text.trim().startsWith('[') || text.trim().startsWith('{');
      if (isJson) {
        const data = JSON.parse(text);
        const list = Array.isArray(data) ? data : [data];
        list.forEach((item: any, i: number) => {
          parsed.push({
            id: item.id || `L-UL-${Math.floor(1000 + Math.random() * 9000)}-${i}`,
            name: item.name || 'Anonymous Upload',
            email: item.email || 'upload@example.com',
            phone: item.phone || '(555) 000-0000',
            partRequested: item.partRequested || item.part || 'Core Component',
            vehicle: {
              year: parseInt(item.vehicle?.year || item.year) || 2018,
              make: item.vehicle?.make || item.make || 'Ford',
              model: item.vehicle?.model || item.model || 'F-150',
              engineSize: item.vehicle?.engineSize || item.engine || '3.5L V6'
            },
            status: (item.status as LeadStatus) || 'Fresh Lead',
            type: (item.type as LeadType) || 'Phone Call',
            owner: item.owner || (agents[0]?.name || 'Joe Miller'),
            createdAt: item.createdAt || new Date().toISOString(),
            notes: item.notes || [
              {
                id: `n-${Date.now()}-${i}`,
                author: 'System',
                content: 'Lead added via Bulk Upload.',
                createdAt: new Date().toISOString(),
                isSystem: true
              }
            ]
          });
        });
      } else {
        // CSV parsing
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].trim();
          if (!row) continue;
          
          const cols = row.split(',').map(s => s.replace(/^"|"$/g, '').trim());
          if (cols.length < 1 || !cols[0]) continue;
          
          parsed.push({
            id: `L-UL-${Math.floor(1000 + Math.random() * 9000)}-${i}`,
            name: cols[0],
            email: cols[1] || `${cols[0].toLowerCase().replace(/\s+/g, '')}@example.com`,
            phone: cols[2] || '(555) 000-0000',
            partRequested: cols[3] || 'Engine Gasket Set',
            vehicle: {
              year: parseInt(cols[4]) || 2015,
              make: cols[5] || 'Honda',
              model: cols[6] || 'Civic',
              engineSize: cols[7] || '1.8L L4'
            },
            status: (cols[8] as LeadStatus) || 'Fresh Lead',
            type: (cols[9] as LeadType) || 'Phone Call',
            owner: cols[10] || (agents[0]?.name || 'Joe Miller'),
            createdAt: new Date().toISOString(),
            notes: [
              {
                id: `n-${Date.now()}-${i}`,
                author: 'System',
                content: 'Lead loaded from bulk CSV list.',
                createdAt: new Date().toISOString(),
                isSystem: true
              }
            ]
          });
        }
      }

      if (parsed.length === 0) {
        setLeadUploadError('No valid leads identified in standard template structures.');
      } else {
        setLeadUploadPreview(parsed);
        setLeadUploadError(null);
      }
    } catch (err: any) {
      setLeadUploadError(`Parsing error: ${err.message || err}`);
    }
  };

  // Submit manual Phone Log
  const handleManualPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogCustomer.trim() || !newLogPhone.trim()) return;

    const newLog: PhoneLog = {
      id: `PL-${Math.floor(10000 + Math.random() * 90000)}`,
      agentName: newLogAgent || (agents[0]?.name || 'Joe Miller'),
      customerName: newLogCustomer,
      phoneNumber: newLogPhone,
      durationSeconds: parseInt(newLogDuration) || 120,
      direction: newLogDirection,
      timestamp: new Date().toISOString(),
      recordingUrl: newLogRecording || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      transcription: newLogTranscription || 'No transcription parsed.'
    };

    onAddPhoneLogs([newLog]);

    // reset fields
    setNewLogCustomer('');
    setNewLogPhone('');
    setNewLogDuration('');
    setNewLogDirection('Inbound');
    setNewLogRecording('');
    setNewLogTranscription('');
    setIsAddingPhoneManual(false);
  };

  // CSV/JSON Phone Logs Upload
  const handlePhoneCSVUpload = (text: string) => {
    try {
      const lines = text.split('\n');
      const parsed: PhoneLog[] = [];
      const isJson = text.trim().startsWith('[') || text.trim().startsWith('{');

      if (isJson) {
        const data = JSON.parse(text);
        const list = Array.isArray(data) ? data : [data];
        list.forEach((item: any, i: number) => {
          parsed.push({
            id: item.id || `PL-UL-${Math.floor(1000 + Math.random() * 9000)}-${i}`,
            agentName: item.agentName || (agents[0]?.name || 'Joe Miller'),
            customerName: item.customerName || 'Anonymous Call',
            phoneNumber: item.phoneNumber || '(555) 123-4567',
            durationSeconds: parseInt(item.durationSeconds || item.duration) || 95,
            direction: (item.direction as 'Inbound' | 'Outbound') || 'Inbound',
            timestamp: item.timestamp || new Date().toISOString(),
            recordingUrl: item.recordingUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            transcription: item.transcription || 'No transcription logged.'
          });
        });
      } else {
        // CSV format: AgentName, CustomerName, PhoneNumber, DurationSeconds, Direction, Transcription
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].trim();
          if (!row) continue;
          const cols = row.split(',').map(s => s.replace(/^"|"$/g, '').trim());
          if (cols.length < 3) continue;

          parsed.push({
            id: `PL-UL-${Math.floor(1000 + Math.random() * 9000)}-${i}`,
            agentName: cols[0] || (agents[0]?.name || 'Joe Miller'),
            customerName: cols[1],
            phoneNumber: cols[2],
            durationSeconds: parseInt(cols[3]) || 120,
            direction: (cols[4] as 'Inbound' | 'Outbound') || 'Inbound',
            timestamp: new Date().toISOString(),
            recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            transcription: cols[5] || 'Bulk loaded speech record.'
          });
        }
      }

      if (parsed.length === 0) {
        setPhoneUploadError('No valid phone logs mapped.');
      } else {
        setPhoneUploadPreview(parsed);
        setPhoneUploadError(null);
      }
    } catch (err: any) {
      setPhoneUploadError(`Parsing error: ${err.message || err}`);
    }
  };

  // 1. Dashboard Filters & Logic
  const filteredDashboardDataByTimeframe = useMemo(() => {
    // Return mock values scaled by active timeframe representation to simulate live databases
    let scaleFactor = 1.0;
    if (timeframe === 'Today') scaleFactor = 0.12;
    else if (timeframe === 'Yesterday') scaleFactor = 0.15;
    else if (timeframe === 'Last 7 days') scaleFactor = 0.45;
    else if (timeframe === 'Last 3 months') scaleFactor = 2.4;

    // Direct stats computed from leads & orders
    const rawSales = leads.filter(l => l.status === 'Sold');
    const totalRevenue = Math.round(rawSales.reduce((acc, curr) => acc + (curr.soldAmount || 0), 0) * scaleFactor);
    const totalExpenses = Math.round(rawSales.reduce((acc, curr) => acc + 1200, 0) * scaleFactor); // mock cost of manufacturing
    const netROI = totalExpenses > 0 ? Math.round(((totalRevenue - totalExpenses) / totalExpenses) * 100) : 105;

    // Web vs Call Source splits
    const webSalesCount = leads.filter(l => l.status === 'Sold' && l.type === 'Web Query').length;
    const callSalesCount = leads.filter(l => l.status === 'Sold' && l.type === 'Phone Call').length;

    // Normalize for displays
    const webSalesAmt = Math.round(totalRevenue * (webSalesCount / (webSalesCount + callSalesCount || 1) || 0.65));
    const callSalesAmt = totalRevenue - webSalesAmt;

    return {
      totalSales: Math.round(rawSales.length * scaleFactor) || 5,
      revenue: totalRevenue || 12500,
      expenses: totalExpenses || 6000,
      roi: netROI,
      webSalesAmt,
      callSalesAmt,
      webSalesCount: Math.round(webSalesCount * scaleFactor) || 3,
      callSalesCount: Math.round(callSalesCount * scaleFactor) || 2,
    };
  }, [leads, timeframe, filterAgent, filterPartType]);

  // Lead Count distribution for beautiful Donut chart presentation
  const leadStatusCounts = useMemo(() => {
    const statuses: LeadStatus[] = ['Fresh Lead', 'Follow Up', 'Quotation Given', 'Sold', 'Bad Number', 'Need More Info', 'Not Interested'];
    return statuses.map(st => {
      const count = leads.filter(l => l.status === st).length;
      return { status: st, count };
    });
  }, [leads]);

  // Agent Lead Conversion statistics for performance leaderboard
  const agentConversionStats = useMemo(() => {
    const statsMap: Record<string, { name: string; total: number; converted: number; role?: string; status?: string }> = {};

    // Initialize with known agents first to ensure staff members are represented
    agents.forEach(agent => {
      statsMap[agent.name] = {
        name: agent.name,
        total: 0,
        converted: 0,
        role: agent.role,
        status: agent.status,
      };
    });

    // Accumulate total and converted (Sold) quantities from actual leads state
    leads.forEach(lead => {
      const owner = lead.owner || 'Unassigned';
      if (!statsMap[owner]) {
        statsMap[owner] = {
          name: owner,
          total: 0,
          converted: 0,
          role: owner === 'Unassigned' ? 'System Pool' : 'Agent',
          status: 'Active',
        };
      }
      statsMap[owner].total += 1;
      if (lead.status === 'Sold') {
        statsMap[owner].converted += 1;
      }
    });

    // Compute final rates and sort descending
    return Object.values(statsMap)
      .map(item => {
        const rate = item.total > 0 ? Math.round((item.converted / item.total) * 100) : 0;
        return {
          ...item,
          rate,
        };
      })
      .sort((a, b) => b.rate - a.rate || b.total - a.total);
  }, [leads, agents]);

  // Lead selection filtering logic
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      // 1. Search Query Box
      if (leadSearchQuery) {
        const query = leadSearchQuery.toLowerCase();
        const matchesName = l.name.toLowerCase().includes(query);
        const matchesPhone = l.phone.toLowerCase().includes(query);
        const matchesPart = l.partRequested.toLowerCase().includes(query);
        const matchesMake = l.vehicle.make.toLowerCase().includes(query);
        const matchesModel = l.vehicle.model.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesPart && !matchesMake && !matchesModel) {
          return false;
        }
      }

      // 2. Dropdown Status Filter matches
      if (leadStatusFilter !== 'All' && l.status !== leadStatusFilter) {
        return false;
      }

      // 3. Agent filtering criteria in Header
      if (filterAgent !== 'All' && l.owner !== filterAgent) {
        return false;
      }

      // 4. Part Category fitment rules
      if (filterPartType !== 'All') {
        const matchingPart = parts.find(p => p.name === l.partRequested);
        if (matchingPart && matchingPart.category !== filterPartType) {
          return false;
        }
      }

      return true;
    });
  }, [leads, parts, leadSearchQuery, leadStatusFilter, filterAgent, filterPartType]);

  // Slice paginated Leads
  const paginatedLeads = useMemo(() => {
    const startIdx = (leadCurrentPage - 1) * leadPageSize;
    return filteredLeads.slice(startIdx, startIdx + leadPageSize);
  }, [filteredLeads, leadCurrentPage, leadPageSize]);

  const maxLeadPages = Math.ceil(filteredLeads.length / leadPageSize) || 1;

  // Selected Lead matching fields
  const currentLeadProfile = useMemo(() => {
    return leads.find(l => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  // Submit dynamic notes inside Lead profiles
  const triggerSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !newNoteText.trim()) return;

    onAddLeadNote(selectedLeadId, newNoteText.trim(), newNoteAuthor);
    setNewNoteText('');
  };

  // Launch editing form values
  const startEditingFinances = (lead: Lead) => {
    setFormSoldAmount(lead.soldAmount || 0);
    setFormCardAmount(lead.cardAmount || 0);
    setFormLoanAmount(lead.loanAmount || 0);
    setFormRefundAmount(lead.refundAmount || 0);
    setFormChargebackAmount(lead.chargebackAmount || 0);
    setIsEditingFinances(true);
  };

  // Save adjusted finance values for lead bookkeeper records
  const saveLeadFinances = () => {
    if (!selectedLeadId) return;
    onUpdateLeadFinances(
      selectedLeadId,
      formSoldAmount,
      formCardAmount,
      formLoanAmount,
      formRefundAmount,
      formChargebackAmount
    );
    setIsEditingFinances(false);
  };

  // Trigger quick CRM actions (simulate real notifications & communications)
  const executeQuickAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !quickActionText.trim()) return;

    const lead = currentLeadProfile;
    if (!lead) return;

    if (quickActionType === 'Email') {
      onAddLeadNote(selectedLeadId, `[E-MAIL DISPATCHED] To: ${lead.email}. Subject: Auto Part Follow Up. Body: "${quickActionText}"`, 'System');
      // Append to global CRM Mail inbox for demonstration
      onSendMail({
        id: `em-gen-${Math.floor(Math.random() * 1000)}`,
        from: 'joe@turboautoparts.com',
        to: lead.email,
        subject: 'Auto Parts Inquiry Follow-up',
        body: quickActionText,
        timestamp: new Date().toISOString(),
        isRead: true,
        folder: 'Sent',
      });
    } else if (quickActionType === 'SMS') {
      onAddLeadNote(selectedLeadId, `[SMS TELEMETRY TRIGGERED] To: ${lead.phone}. Text message: "${quickActionText}"`, 'System');
    } else if (quickActionType === 'Payment') {
      // Create new transaction ledger record
      const numericAmt = parseFloat(quickActionText) || 100;
      onAddPayment({
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        leadId: lead.id,
        customerName: lead.name,
        amount: numericAmt,
        status: 'Success',
        source: 'Card',
        date: new Date().toISOString(),
        reference: 'Manual Agent Terminal Authorization',
      });
      onAddLeadNote(selectedLeadId, `[MANUAL PAYMENT AUTHORIZED] Recorded Visa terminal authorization fee for $${numericAmt}`, 'System');
    } else if (quickActionType === 'Task') {
      onAddTask({
        id: `KT-gen-${Math.floor(Math.random() * 1000)}`,
        title: `Task for Lead: ${lead.name}`,
        description: quickActionText,
        assignedTo: 'Joe Miller',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        status: 'Pending',
        priority: 'High',
      });
      onAddLeadNote(selectedLeadId, `[AGENT TASK ADDED] Scheduled reminder: "${quickActionText}"`, 'System');
    }

    setQuickActionText('');
    setQuickActionType(null);
  };

  // Add Part Form handler
  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName || !newPartBrand || !newPartOem) {
      alert('Fill in SKU branding/details.');
      return;
    }

    const customKey = `${newPartBrand.substring(0,3).toUpperCase()}-${newPartCategory.substring(0,2).toUpperCase()}-${Math.floor(100 + Math.random()*900)}`;

    const partObj: Part = {
      id: `p-${Math.floor(100 + Math.random() * 900)}`,
      sku: customKey,
      name: newPartName,
      category: newPartCategory,
      condition: newPartCondition,
      price: newPartPrice || 250,
      cost: newPartCost || 100,
      stock: newPartStock || 1,
      warehouseLocation: newPartLocation || 'Dock Storage Aisle 1',
      fitment: {
        yearStart: newPartFitYearStart,
        yearEnd: newPartFitYearEnd,
        make: newPartFitMake || 'Subaru',
        models: newPartFitModels.split(',').map(s => s.trim()).filter(Boolean),
        engines: ['2.5L Turbo', '2.0L Naturally Aspirated'],
      },
      description: 'Custom added automotive replacement component with specialized fitment keys mapped inside current workflow databases.',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop',
      oemNumber: newPartOem,
      brand: newPartBrand,
      weightLbs: newPartWeight || 25,
    };

    onAddPart(partObj);
    setIsAddPartModalOpen(false);

    // Reset fields
    setNewPartName('');
    setNewPartBrand('');
    setNewPartOem('');
    setNewPartPrice(0);
    setNewPartCost(0);
  };

  // Interactive Live Chat response in CRM Tickets module
  const submitTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketId || !supportAgentReply.trim()) return;

    onAddSupportReply(activeTicketId, supportAgentReply.trim(), 'agent');
    setSupportAgentReply('');

    // Simulate standard customer response after 2 seconds for a magical reactive playground
    setTimeout(() => {
      onAddSupportReply(
        activeTicketId,
        'Thank you! That helps a lot, I will pass this dimensions document on to my mechanics right away.',
        'customer'
      );
    }, 2500);
  };

  // Moderate customer review choices
  const triggerReviewAction = (id: string, action: 'Approved' | 'Rejected') => {
    const reply = reviewReplyText[id] || '';
    onReviewModerate(id, action, reply);
    // Clear reply draft segment
    setReviewReplyText(prev => ({ ...prev, [id]: '' }));
  };

  // Compose Outbox Email inside CRM Mail module
  const handleSendComposeMail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mailTo || !mailSubject || !mailBody) return;

    onSendMail({
      id: `em-compose-${Math.floor(1000 + Math.random() * 9000)}`,
      from: 'joe@turboautoparts.com',
      to: mailTo,
      subject: mailSubject,
      body: mailBody,
      timestamp: new Date().toISOString(),
      isRead: true,
      folder: 'Sent',
    });

    setIsComposingMail(false);
    setMailTo('');
    setMailSubject('');
    setMailBody('');
  };

  // Add agent task action
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    onAddTask({
      id: `KT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: taskTitle,
      description: taskDesc,
      assignedTo: taskAgent,
      dueDate: taskDueDate,
      status: 'Pending',
      priority: taskPriority,
    });

    setIsAddingTask(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  // Find active support ticket info
  const selectedTicketObj = useMemo(() => {
    return tickets.find(t => t.id === activeTicketId) || null;
  }, [tickets, activeTicketId]);

  // Find active mailbox mail details
  const selectedMailObj = useMemo(() => {
    return mails.find(m => m.id === selectedMailId) || null;
  }, [mails, selectedMailId]);

  return (
    <div id="crm-layout" className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-slate-800">
      {/* 1. Left Persistent Navigation Menu Sidebar */}
      <nav id="crm-sidebar" className="w-full md:w-64 bg-[#0f172a] text-white flex flex-col shrink-0 border-r border-slate-800/60 shadow-lg">
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-600/30">
              <span className="text-white font-extrabold text-lg italic font-display">T</span>
            </div>
            <div>
              <span className="font-bold text-xs tracking-wider uppercase block font-display">Turbo Admin</span>
              <span className="text-[9px] font-mono text-slate-400">ADMIN OPERATIONS</span>
            </div>
          </div>
          <button
            onClick={() => onChangeViewMode('catalog')}
            className="md:hidden p-1.5 bg-slate-800 rounded text-slate-400 text-xs hover:text-white"
          >
            Store
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {[
            { name: 'Dashboard', icon: LayoutDashboard },
            { name: 'Leads', icon: Users2, sub: true },
            { name: 'Payments', icon: CreditCard },
            { name: 'Orders', icon: PackageCheck },
            { name: 'Inventory', icon: Wrench },
            { name: 'Support', icon: HelpCircle },
            { name: 'Mails', icon: Mail },
            { name: 'My Task', icon: CheckSquare },
            { name: 'Reports', icon: FileText },
            { name: 'Purchase', icon: ShoppingBag },
            { name: 'Users', icon: UserCheck },
            { name: 'Review Manage', icon: Star },
            { name: 'Training', icon: GraduationCap },
          ].map((item) => {
            const IconComponent = item.icon;
            const isSelected = activeMenu === item.name;
            return (
              <div key={item.name} className="space-y-1">
                <button
                  id={`side-menu-${item.name.replace(' ', '-').toLowerCase()}`}
                  onClick={() => {
                    setActiveMenu(item.name);
                    setSelectedLeadId(null); // Clear selected profile detailed view on navigation change
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20 border-l-[3px] border-orange-400'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.name === 'Support' && tickets.filter((t) => t.status === 'Open').length > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-600 text-white text-[9px] rounded-full font-black animate-bounce">
                      {tickets.filter((t) => t.status === 'Open').length}
                    </span>
                  )}
                  {item.name === 'Leads' && (
                    <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded font-mono">
                      {leads.length}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Back link to Store client */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-2">
          <p className="text-[9px] text-slate-500 font-mono tracking-widest text-center uppercase">ENVIRONMENT LOG</p>
          <button
            onClick={() => onChangeViewMode('catalog')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow"
          >
            ← Back to Web Store
          </button>
        </div>
      </nav>

      {/* 2. Main Work Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Global CRM Operations Dashboard Banner */}
        <header id="crm-sub-header" className="bg-white border-b border-slate-200 py-3 px-6 sticky top-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">{activeMenu} Module</h2>
            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded text-[10px] font-mono uppercase font-black tracking-wide">
              Secure Cloud Sync
            </span>
          </div>

          {/* Timeframe & Multi-Filter Options inside Header */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border border-slate-200 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <select
                id="crm-timeframe-filter"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-transparent font-medium border-none focus:outline-none text-[11px]"
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 28 days">Last 28 days</option>
                <option value="Last 3 months">Last 3 months</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border border-slate-200 text-xs">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Agent:</span>
              <select
                id="crm-agent-filter"
                value={filterAgent}
                onChange={(e) => setFilterAgent(e.target.value)}
                className="bg-transparent font-medium border-none focus:outline-none text-[11px]"
              >
                <option value="All">All Staff</option>
                {agents.map((ag) => (
                  <option key={ag.id} value={ag.name}>
                    {ag.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-150 px-2 py-1 rounded border border-slate-200 text-xs">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Fits:</span>
              <select
                id="crm-part-type-filter"
                value={filterPartType}
                onChange={(e) => setFilterPartType(e.target.value)}
                className="bg-transparent font-medium border-none focus:outline-none text-[11px]"
              >
                <option value="All">All Categories</option>
                <option value="Engine">Engines</option>
                <option value="Transmission">Transmissions</option>
                <option value="Brakes">Brakes</option>
                <option value="Suspension">Suspension</option>
                <option value="Electrical">Electrical</option>
              </select>
            </div>
          </div>
        </header>

        {/* WORKBENCH SPACE SWITCH HOOKS BASED ON ACTIVEMENU TAB */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* ======================= TAB: DASHBOARD & ANALYTICS ======================= */}
          {activeMenu === 'Dashboard' && (
            <div id="module-dashboard" className="space-y-6">
              {/* Financial Key Performance Widgets Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Sales Leads</span>
                    <strong className="text-2xl font-black font-display text-slate-900 block">
                      {filteredDashboardDataByTimeframe.totalSales} units
                    </strong>
                    <span className="text-[10px] text-green-600 font-bold mt-2 block flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +14.5% <span className="text-slate-400 font-medium ml-1">vs yesterday</span>
                    </span>
                  </div>
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shadow-inner border border-orange-100">
                    <Users2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Gross Revenue</span>
                    <strong className="text-2xl font-black font-display text-slate-900 block">
                      ${filteredDashboardDataByTimeframe.revenue.toLocaleString()}
                    </strong>
                    <div className="text-[9px] text-slate-500 mt-2 flex gap-2 font-mono">
                      <span>WEB: <strong className="text-slate-700">${filteredDashboardDataByTimeframe.webSalesAmt.toLocaleString()}</strong></span>
                      <span>CALL: <strong className="text-slate-700">${filteredDashboardDataByTimeframe.callSalesAmt.toLocaleString()}</strong></span>
                    </div>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shadow-inner border border-indigo-100">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Operating Expense</span>
                    <strong className="text-2xl font-black font-display text-slate-900 block">
                      ${filteredDashboardDataByTimeframe.expenses.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-2 font-medium">Sourcing & salvage sync</span>
                  </div>
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shadow-inner border border-rose-100">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total ROI Slices</span>
                    <strong className="text-2xl font-black font-display text-slate-900 block">
                      {filteredDashboardDataByTimeframe.roi}% ROI
                    </strong>
                    <span className="text-[9px] bg-green-50 text-green-700 font-extrabold tracking-wider px-2 py-0.5 rounded border border-green-200 uppercase mt-2 inline-block">
                      High Margin Core
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shadow-inner border border-emerald-100">
                    <Percent className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Graphic charts grid using robust beautifully-stylable native SVG */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sale Trend Over Time Line Chart */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <h4 className="text-xs font-bold font-mono uppercase text-slate-400">Total Sales & Conversion Over Time</h4>
                      <h3 className="text-sm font-black text-slate-800">Direct Logistics Performance Wave</h3>
                    </div>
                    <span className="text-[9px] bg-slate-150 text-slate-600 px-2 py-0.5 rounded font-bold font-mono">
                      DATA RANGE: {timeframe}
                    </span>
                  </div>

                  {/* SVG Line Graph */}
                  <div className="relative h-60 w-full bg-slate-50 rounded-lg p-2 border border-slate-100 flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Area block under graph */}
                      <path
                        d="M 0 180 L 100 120 L 200 150 L 300 80 L 400 95 L 500 40 L 500 200 L 0 200 Z"
                        fill="url(#gradient-orange)"
                        opacity="0.1"
                      />

                      {/* Dynamic Trend Curves representing mock timestamps */}
                      <path
                        d="M 0 180 Q 50 140 100 120 T 200 150 T 300 80 T 400 95 T 500 40"
                        fill="none"
                        stroke="#ea580c"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Data point dots */}
                      <circle cx="100" cy="120" r="5" fill="#ea580c" />
                      <circle cx="200" cy="150" r="5" fill="#ea580c" />
                      <circle cx="300" cy="80" r="5" fill="#ea580c" />
                      <circle cx="400" cy="95" r="5" fill="#ea580c" />
                      <circle cx="500" cy="40" r="5" fill="#ea580c" />

                      {/* Tooltip gradients */}
                      <defs>
                        <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#ea580c" />
                          <stop offset="100%" stopColor="#fff" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-500 space-y-1">
                      <div>$15K REV</div>
                      <div>$10K REV</div>
                      <div>$5K REV</div>
                    </div>

                    <div className="absolute bottom-1 leading-none left-0 right-0 px-4 flex justify-between text-[9px] font-mono text-slate-400">
                      <span>Wk 1 (Initial Setup)</span>
                      <span>Wk 2 (Ad Campaign)</span>
                      <span>Wk 3 (Organic SEO)</span>
                      <span>Wk 4 (Current)</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal text-center">
                    Simulated trend curve derived from sales transactions showing rapid climb upon catalog launch.
                  </p>
                </div>

                {/* Lead Status Categories Breakdown Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <h4 className="text-xs font-bold font-mono uppercase text-slate-400">PIE BREAKDOWN</h4>
                    <h3 className="text-sm font-black text-slate-800">Lead Status Distribution</h3>
                  </div>

                  {/* Interactive Pie Chart simulated lists */}
                  <div className="flex flex-col items-center justify-center space-y-4 py-2">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      {/* Simple CSS-driven conically sliced pie simulation */}
                      <div
                        className="w-full h-full rounded-full border-4 border-white shadow-md"
                        style={{
                          background: 'conic-gradient(#ea580c 0% 30%, #3b82f6 30% 55%, #10b981 55% 80%, #f59e0b 80% 100%)',
                        }}
                      />
                      <div className="absolute w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center text-center shadow-inner">
                        <strong className="text-base text-slate-900 font-extrabold">{filteredDashboardDataByTimeframe.totalSales || leads.length}</strong>
                        <span className="text-[8px] text-slate-400 font-mono tracking-widest uppercase">ACTIVE</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold w-full">
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-orange-600 rounded-sm" /> Sold (30%)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm" /> Follow Up (25%)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> Fresh Leads (25%)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-yellow-500 rounded-sm" /> Quotation (20%)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent Sales Performance and Conversion Rates Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
                  <div>
                    <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-400">Staff Contribution</h4>
                    <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-1.5">
                      <UserCheck className="w-5 h-5 text-orange-500" /> Lead Conversion Leaderboard
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Leaderboard updates instantly as leads convert
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Leaderboard List */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Agent Ranking & Success Rate</h5>
                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-2 scrollbar-none">
                      {agentConversionStats.map((item, index) => {
                        const isTop = index === 0;
                        const rateColor = item.rate >= 60 ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : item.rate >= 35 ? 'text-indigo-600 bg-indigo-50 border border-indigo-150' : 'text-slate-600 bg-slate-50 border border-slate-200';

                        return (
                          <div key={item.name} className="py-3.5 flex items-center justify-between gap-4 group hover:bg-slate-50/70 px-2 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              {/* Position */}
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${isTop ? 'bg-amber-100 text-amber-700 font-bold border border-amber-200' : 'bg-slate-100 text-slate-600'}`}>
                                {isTop ? '🏆' : index + 1}
                              </div>
                              {/* Profile Avatar */}
                              <div className="relative">
                                <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm font-display">
                                  {item.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${item.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                              </div>
                              {/* Name and Role */}
                              <div>
                                <h6 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 leading-tight">
                                  {item.name}
                                  {isTop && item.rate > 0 && <span className="text-[9px] bg-amber-500/10 text-amber-700 px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wide">TOP STAFF</span>}
                                </h6>
                                <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase leading-none mt-0.5">{item.role}</p>
                              </div>
                            </div>

                            {/* Performance statistics */}
                            <div className="text-right shrink-0">
                              <span className={`px-2.5 py-1 ${rateColor} font-black text-xs rounded-full font-mono shadow-sm`}>
                                {item.rate}%
                              </span>
                              <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase font-mono">
                                {item.converted} / {item.total} sold
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Visual Progress and Key Metrics Spotlight */}
                  <div className="flex flex-col justify-between bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Visual Target Progress</h5>
                      <div className="space-y-4">
                        {agentConversionStats.slice(0, 4).map((item) => {
                          const barColor = item.rate >= 60 ? 'bg-emerald-500' : item.rate >= 35 ? 'bg-indigo-600' : 'bg-slate-400';
                          return (
                            <div key={item.name + '-bar'} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-bold">
                                <span className="text-slate-700">{item.name}</span>
                                <span className="font-mono text-slate-400">{item.rate}% Rate</span>
                              </div>
                              <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.rate}%` }}
                                  transition={{ duration: 0.8, ease: 'easeOut' }}
                                  className={`${barColor} h-full`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-205 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-150 text-orange-600 flex items-center justify-center font-black text-xs font-display">
                          📈
                        </div>
                        <div className="text-xs">
                          <p className="font-bold text-slate-800 leading-snug">Boost Lead Conversions</p>
                          <p className="text-slate-500 text-[10px] leading-snug">Top performers actively reference core warranty certificates to double trust.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Alerts & Live Feed logs bar */}
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                    <div>
                      <h4 className="text-xs font-bold text-orange-400 font-mono uppercase tracking-wider">SECURE AUDIT FEED</h4>
                      <h3 className="text-xs text-slate-300">Live background system events and pipeline notifications</h3>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-[9px] font-mono text-slate-400">REST API 3PL Active</span>
                </div>
                <div className="space-y-2 text-[11px] font-mono text-slate-300">
                  <p className="flex justify-between border-b border-slate-800/50 pb-1.5">
                    <span>⚡ COURIER ASSIGNMENT: {orders[0]?.logistics.provider || 'UPS Ground'} dispatched label #{orders[0]?.logistics.trackingNumber || 'N/A'}</span>
                    <span className="text-slate-500 font-light">12 secs ago</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-800/50 pb-1.5">
                    <span>✓ ORDER SAVED: Marcus Vance credit ledger approved at checkout gateway (Amount: $7,999)</span>
                    <span className="text-slate-500 font-light">2 mins ago</span>
                  </p>
                  <p className="flex justify-between">
                    <span>⚠ SCAM SIGNAL: Multi-billing zip entry blocked on high-output 180A alternators. System flagged operator Sarah.</span>
                    <span className="text-slate-500 font-light">30 mins ago</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB: LEADS MANAGEMENT (CORE SCREEN) ======================= */}
          {activeMenu === 'Leads' && (
            <div id="module-leads" className="space-y-6">
              {/* Leady Filter tabs (Lead List vs Call Phone logs) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 gap-4 pb-2 sm:pb-0">
                <div className="flex">
                  <button
                    onClick={() => { setActiveLeadSubmenu('LeadList'); setSelectedLeadId(null); }}
                    className={`px-4 py-2 text-xs font-bold tracking-wide border-b-2 transition ${
                      activeLeadSubmenu === 'LeadList' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Active Lead List
                  </button>
                  <button
                    onClick={() => { setActiveLeadSubmenu('PhoneLogs'); setSelectedLeadId(null); }}
                    className={`px-4 py-2 text-xs font-bold tracking-wide border-b-2 transition ${
                      activeLeadSubmenu === 'PhoneLogs' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Phone Logs & Audio Playback
                  </button>
                </div>

                {/* Custom Action Controls: Add New & Upload List */}
                {!selectedLeadId && (
                  <div className="flex items-center gap-2 px-4 sm:px-0 pb-2 sm:pb-0">
                    {activeLeadSubmenu === 'LeadList' ? (
                      <>
                        <button
                          id="btn-add-lead-manual"
                          onClick={() => {
                            setIsAddingLeadManual(!isAddingLeadManual);
                            setIsUploadingLeads(false);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                            isAddingLeadManual ? 'bg-orange-600 text-white shadow-orange-605/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" /> Manual Lead
                        </button>
                        <button
                          id="btn-add-lead-upload"
                          onClick={() => {
                            setIsUploadingLeads(!isUploadingLeads);
                            setIsAddingLeadManual(false);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                            isUploadingLeads ? 'bg-indigo-600 text-white shadow-indigo-600/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" /> Upload CSV/JSON
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          id="btn-add-phone-manual"
                          onClick={() => {
                            setIsAddingPhoneManual(!isAddingPhoneManual);
                            setIsUploadingPhone(false);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                            isAddingPhoneManual ? 'bg-orange-600 text-white shadow-orange-600/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" /> Manual Phone Log
                        </button>
                        <button
                          id="btn-add-phone-upload"
                          onClick={() => {
                            setIsUploadingPhone(!isUploadingPhone);
                            setIsAddingPhoneManual(false);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                            isUploadingPhone ? 'bg-indigo-600 text-white shadow-indigo-600/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" /> Upload Phone Logs
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Manual Add Lead Form */}
              {isAddingLeadManual && !selectedLeadId && (
                <motion.div
                  id="form-add-lead-manual"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white p-5 rounded-1.5xl border border-orange-200 shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-orange-500" /> Manually Register New Lead
                    </h3>
                    <button
                      onClick={() => setIsAddingLeadManual(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleManualLeadSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Customer Name *</label>
                      <input
                        type="text"
                        required
                        value={newLeadName}
                        onChange={(e) => setNewLeadName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Customer Email</label>
                      <input
                        type="email"
                        value={newLeadEmail}
                        onChange={(e) => setNewLeadEmail(e.target.value)}
                        placeholder="john.doe@example.com"
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Customer Phone</label>
                      <input
                        type="text"
                        value={newLeadPhone}
                        onChange={(e) => setNewLeadPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Part Requested / Component *</label>
                      <input
                        type="text"
                        required
                        value={newLeadPart}
                        onChange={(e) => setNewLeadPart(e.target.value)}
                        placeholder="Alternator Assembly 2.4L"
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Year</label>
                        <input
                          type="number"
                          value={newLeadYear}
                          onChange={(e) => setNewLeadYear(e.target.value)}
                          placeholder="2018"
                          className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Make</label>
                        <input
                          type="text"
                          value={newLeadMake}
                          onChange={(e) => setNewLeadMake(e.target.value)}
                          placeholder="Toyota"
                          className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Model</label>
                        <input
                          type="text"
                          value={newLeadModel}
                          onChange={(e) => setNewLeadModel(e.target.value)}
                          placeholder="Camry"
                          className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Engine Size</label>
                        <input
                          type="text"
                          value={newLeadEngine}
                          onChange={(e) => setNewLeadEngine(e.target.value)}
                          placeholder="2.5L L4"
                          className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Lead Status</label>
                      <select
                        value={newLeadStatus}
                        onChange={(e) => setNewLeadStatus(e.target.value as LeadStatus)}
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        {['Fresh Lead', 'Follow Up', 'Quotation Given', 'Sold', 'Bad Number', 'Need More Info', 'Not Interested'].map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Contact Channel Type</label>
                      <select
                        value={newLeadType}
                        onChange={(e) => setNewLeadType(e.target.value as LeadType)}
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="Phone Call">Phone Call</option>
                        <option value="Web Query">Web Query</option>
                        <option value="Live Chat">Live Chat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Owner Staff Agent</label>
                      <select
                        value={newLeadOwner}
                        onChange={(e) => setNewLeadOwner(e.target.value)}
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="">Select Staff...</option>
                        {agents.map(ag => (
                          <option key={ag.id} value={ag.name}>{ag.name} ({ag.role})</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-2 pt-2 border-t mt-2">
                       <button
                         type="button"
                         onClick={() => setIsAddingLeadManual(false)}
                         className="px-4 py-2 border rounded-lg font-bold hover:bg-slate-50 transition"
                       >
                         Discard
                       </button>
                       <button
                         type="submit"
                         className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition"
                       >
                         Register Lead
                       </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Upload Leads List Form */}
              {isUploadingLeads && !selectedLeadId && (
                <motion.div
                  id="form-add-lead-upload"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-4 text-xs font-sans"
                >
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" /> Upload Lead Bulk Listing
                    </h3>
                    <button
                      onClick={() => {
                        setIsUploadingLeads(false);
                        setLeadUploadPreview([]);
                        setLeadUploadError(null);
                      }}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* File Drop and Paste Area */}
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/20 p-6 rounded-xl text-center relative hover:bg-indigo-50/40 transition">
                        <input
                          type="file"
                          accept=".csv,.json"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                const txt = evt.target?.result as string;
                                if (txt) handleLeadCSVUpload(txt);
                              };
                              reader.readAsText(file);
                            }
                          }}
                        />
                        <p className="font-black text-indigo-700">Drag or click to choose a CSV or JSON file</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono hover:underline">Supports lead_list.csv or backup_leads.json</p>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paste raw data directly</label>
                        <textarea
                          rows={4}
                          placeholder="Name,Email,Phone,Part,Year,Make,Model,Engine,Status,Type,Owner&#10;Alice Smith,alice@example.com,(555) 777-8888,Turbocharger OEM,2017,Chevrolet,Cruze,1.4L,Fresh Lead,Phone Call,Joe Miller"
                          onChange={(e) => handleLeadCSVUpload(e.target.value)}
                          className="w-full p-2.5 border rounded-lg font-mono text-[10px] bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Template Guidelines and CSV Structure Info */}
                    <div className="bg-slate-50 p-4 rounded-xl border space-y-3 text-[11px] leading-relaxed">
                      <h4 className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Expected Data Columns (CSV Template)</h4>
                      <p className="text-slate-500">For CSV list uploading, format your first line as headers or follow this columns index layout:</p>
                      <div className="bg-white p-2 border rounded font-mono text-[9px] text-indigo-700 whitespace-nowrap overflow-x-auto">
                        Name,Email,Phone,Part,Year,Make,Model,Engine,Status,Type,Owner
                      </div>
                      <div className="space-y-1 text-slate-500 text-[10px]">
                        <p>• <strong>Name:</strong> Full customer name string (required)</p>
                        <p>• <strong>Part:</strong> Gear requested component name e.g. "Cylinder Head"</p>
                        <p>• <strong>Status & Type:</strong> "Fresh Lead" / "Follow Up" & "Phone Call" / "Live Chat"</p>
                        <p>• <strong>Owner:</strong> Full name of any of your active agents</p>
                      </div>
                    </div>
                  </div>

                  {/* Errors display */}
                  {leadUploadError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl font-bold leading-normal text-[11px]">
                      ⚠️ {leadUploadError}
                    </div>
                  )}

                  {/* Leads Preview Section */}
                  {leadUploadPreview.length > 0 && (
                    <div className="space-y-2 border-t pt-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-black text-[11px] uppercase tracking-wider text-emerald-600 font-mono">
                          ✓ Successfully Parsed {leadUploadPreview.length} Leads
                        </h4>
                        <button
                          onClick={() => {
                            onAddLeads(leadUploadPreview);
                            setIsUploadingLeads(false);
                            setLeadUploadPreview([]);
                            setLeadUploadError(null);
                          }}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm"
                        >
                          Confirm & Import {leadUploadPreview.length} Leads
                        </button>
                      </div>

                      <div className="max-h-44 overflow-y-auto border rounded-xl divide-y">
                        {leadUploadPreview.map((item, idx) => (
                          <div key={idx} className="p-2 hover:bg-slate-50 flex justify-between items-center text-[10px]">
                            <div>
                              <span className="font-black text-slate-900">{item.name}</span>
                              <span className="text-slate-400 ml-1">({item.email})</span>
                              <div className="text-slate-500 font-mono mt-0.5">
                                Requested: {item.partRequested} • {item.vehicle.year} {item.vehicle.make} {item.vehicle.model}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-0.5 text-[8px] font-bold bg-amber-50 rounded border border-amber-200">
                                {item.status}
                              </span>
                              <p className="text-slate-400 mt-0.5 font-mono">Agent: {item.owner}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Manual Add Phone Log Form */}
              {isAddingPhoneManual && !selectedLeadId && (
                <motion.div
                  id="form-add-phone-manual"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white p-5 rounded-1.5xl border border-orange-200 shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-500" /> Manually Register Call Phone Log
                    </h3>
                    <button
                      onClick={() => setIsAddingPhoneManual(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleManualPhoneSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Customer Contact Name *</label>
                      <input
                        type="text"
                        required
                        value={newLogCustomer}
                        onChange={(e) => setNewLogCustomer(e.target.value)}
                        placeholder="Alice Smith"
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Phone Number *</label>
                      <input
                        type="text"
                        required
                        value={newLogPhone}
                        onChange={(e) => setNewLogPhone(e.target.value)}
                        placeholder="(555) 777-8888"
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Staff Agent Assigned</label>
                      <select
                        value={newLogAgent}
                        onChange={(e) => setNewLogAgent(e.target.value)}
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="">Select Agent...</option>
                        {agents.map(ag => (
                          <option key={ag.id} value={ag.name}>{ag.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Call Duration (seconds) *</label>
                      <input
                        type="number"
                        required
                        value={newLogDuration}
                        onChange={(e) => setNewLogDuration(e.target.value)}
                        placeholder="180"
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Directional Flow</label>
                      <select
                        value={newLogDirection}
                        onChange={(e) => setNewLogDirection(e.target.value as 'Inbound' | 'Outbound')}
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="Inbound">Inbound Call</option>
                        <option value="Outbound">Outbound Call</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Audio Recording Link</label>
                      <input
                        type="text"
                        value={newLogRecording}
                        onChange={(e) => setNewLogRecording(e.target.value)}
                        placeholder="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Speech Transcription & Log Summaries</label>
                      <textarea
                        rows={3}
                        value={newLogTranscription}
                        onChange={(e) => setNewLogTranscription(e.target.value)}
                        placeholder="Customer requested active support on turbo core and confirmed shipment tracking info..."
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-2 pt-2 border-t mt-2">
                       <button
                         type="button"
                         onClick={() => setIsAddingPhoneManual(false)}
                         className="px-4 py-2 border rounded-lg font-bold hover:bg-slate-50 transition"
                       >
                         Discard
                       </button>
                       <button
                         type="submit"
                         className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition"
                       >
                         Save Call Log
                       </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Upload Phone Logs Form */}
              {isUploadingPhone && !selectedLeadId && (
                <motion.div
                  id="form-add-phone-upload"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-4 text-xs font-sans"
                >
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" /> Upload Phone Call Logs
                    </h3>
                    <button
                      onClick={() => {
                        setIsUploadingPhone(false);
                        setPhoneUploadPreview([]);
                        setPhoneUploadError(null);
                      }}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Upload File Input and Paste Box */}
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/20 p-6 rounded-xl text-center relative hover:bg-indigo-50/40 transition">
                        <input
                          type="file"
                          accept=".csv,.json"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                const txt = evt.target?.result as string;
                                if (txt) handlePhoneCSVUpload(txt);
                              };
                              reader.readAsText(file);
                            }
                          }}
                        />
                        <p className="font-black text-indigo-700">Drag or click to choose a CSV or JSON file</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono hover:underline">Supports phone_logs.csv or logs_backup.json</p>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paste raw log data directly</label>
                        <textarea
                          rows={4}
                          placeholder="AgentName,CustomerName,PhoneNumber,DurationSeconds,Direction,Transcription&#10;Joe Miller,James Carter,(555) 888-9999,235,Inbound,Looking to buy an Audi OEM transmission soon."
                          onChange={(e) => handlePhoneCSVUpload(e.target.value)}
                          className="w-full p-2.5 border rounded-lg font-mono text-[10px] bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Template columns explanation for Phone Logs */}
                    <div className="bg-slate-50 p-4 rounded-xl border space-y-3 text-[11px] leading-relaxed">
                      <h4 className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Expected Call log Columns</h4>
                      <p className="text-slate-500">For CSV logs loading, format your first line as headers or follow this column structure:</p>
                      <div className="bg-white p-2 border rounded font-mono text-[9px] text-indigo-700 whitespace-nowrap overflow-x-auto">
                        AgentName,CustomerName,PhoneNumber,DurationSeconds,Direction,Transcription
                      </div>
                      <div className="space-y-1 text-slate-500 text-[10px]">
                        <p>• <strong>AgentName:</strong> Name of staff matching registration list exactly</p>
                        <p>• <strong>CustomerName & Phone:</strong> Contact information of the client caller</p>
                        <p>• <strong>DurationSeconds:</strong> Duration of speech in raw seconds unit</p>
                        <p>• <strong>Direction:</strong> Call orientation (either "Inbound" or "Outbound")</p>
                        <p>• <strong>Transcription:</strong> Auto dialog mapping details</p>
                      </div>
                    </div>
                  </div>

                  {/* Error indicators */}
                  {phoneUploadError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl font-bold leading-normal text-[11px]">
                      ⚠️ {phoneUploadError}
                    </div>
                  )}

                  {/* Call Logs Preview list */}
                  {phoneUploadPreview.length > 0 && (
                    <div className="space-y-2 border-t pt-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-black text-[11px] uppercase tracking-wider text-emerald-600 font-mono">
                          ✓ Successfully Parsed {phoneUploadPreview.length} Call Logs
                        </h4>
                        <button
                          onClick={() => {
                            onAddPhoneLogs(phoneUploadPreview);
                            setIsUploadingPhone(false);
                            setPhoneUploadPreview([]);
                            setPhoneUploadError(null);
                          }}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm"
                        >
                          Confirm & Import {phoneUploadPreview.length} Phone Logs
                        </button>
                      </div>

                      <div className="max-h-44 overflow-y-auto border rounded-xl divide-y text-[10px]">
                        {phoneUploadPreview.map((item, idx) => (
                          <div key={idx} className="p-2 hover:bg-slate-50 flex justify-between items-center">
                            <div>
                              <span className="font-black text-slate-900">{item.customerName}</span>
                              <span className="text-slate-400 ml-1">({item.phoneNumber})</span>
                              <div className="text-slate-500 font-mono mt-0.5 max-w-md truncate">
                                Call Direction: {item.direction} • {item.durationSeconds}s duration • {item.transcription}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-0.5 text-[8px] font-bold bg-slate-100 rounded border">
                                {item.agentName}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* VIEW: LEAD DETAIL PAGE / PROFILE REVEALED ON SELECTION */}
              {selectedLeadId && currentLeadProfile ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* Detail Banner */}
                  <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedLeadId(null)}
                        className="text-xs text-orange-400 hover:text-orange-300 font-semibold mb-2 block"
                      >
                        ← Back to List View
                      </button>
                      <h3 className="text-xl font-bold tracking-tight">{currentLeadProfile.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <span>Email: {currentLeadProfile.email}</span> • <span>Phone: {currentLeadProfile.phone}</span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <select
                        id="lead-status-profile-select"
                        value={currentLeadProfile.status}
                        onChange={(e) => onUpdateLeadStatus(currentLeadProfile.id, e.target.value as LeadStatus)}
                        className="bg-slate-800 border border-slate-700 text-white rounded px-3 py-1.5 text-xs font-bold focus:ring-1 focus:ring-orange-500 focus:outline-none"
                      >
                        {['Fresh Lead', 'Follow Up', 'Quotation Given', 'Sold', 'Bad Number', 'Need More Info', 'Not Interested'].map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => {
                          if (confirm('Delete this active lead? This action cannot be reversed.')) {
                            onDeleteLead(currentLeadProfile.id);
                            setSelectedLeadId(null);
                          }
                        }}
                        className="p-1.5 bg-red-950/40 text-red-400 hover:bg-red-900 hover:text-white rounded transition"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Split Content: Profiles, Notes log & Bookkeeping financial logs */}
                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* Left 2 Cols: Notes History Log & New Note input */}
                    <div className="lg:col-span-2 p-6 border-r border-slate-150 space-y-6">
                      {/* Customer Vehicle Information Specs Card */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-4">
                        <Wrench className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-xs">
                          <div>
                            <span className="block text-slate-400 font-semibold text-[10px] uppercase">Requested Part</span>
                            <span className="text-slate-900 font-bold">{currentLeadProfile.partRequested}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 font-semibold text-[10px] uppercase">Automobile Make</span>
                            <span className="text-slate-900 font-bold">{currentLeadProfile.vehicle.make}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 font-semibold text-[10px] uppercase">Automobile Model</span>
                            <span className="text-slate-900 font-bold">{currentLeadProfile.vehicle.model} ({currentLeadProfile.vehicle.year})</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 font-semibold text-[10px] uppercase">Motor Cylinders</span>
                            <span className="text-slate-900 font-bold font-mono">{currentLeadProfile.vehicle.engineSize || 'Unspecified'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Lead Action Row Widget Shortcut */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setQuickActionType('Email'); setQuickActionText('Hi, I wanted to follow up with our pricing on the gearbox transmission assembly. We can offer free residential delivery if signed this week.'); }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          Send Email
                        </button>
                        <button
                          onClick={() => { setQuickActionType('SMS'); setQuickActionText('Your auto parts consignment has been packed. Ready for dispatch tracking.'); }}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          Send SMS
                        </button>
                        <button
                          onClick={() => { setQuickActionType('Task'); setQuickActionText('Follow up with mechanic regarding block thickness clearance compatibility.'); }}
                          className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          Add Task
                        </button>
                        <button
                          onClick={() => { setQuickActionType('Payment'); setQuickActionText('3250'); }}
                          className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          Receive Payment
                        </button>
                      </div>

                      {/* Action parameters details composings panel */}
                      {quickActionType && (
                        <form onSubmit={executeQuickAction} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">Compose Quick Lead {quickActionType}</span>
                            <button onClick={() => setQuickActionType(null)} type="button" className="text-slate-500 hover:text-slate-950 font-black">Cancel</button>
                          </div>
                          <textarea
                            rows={2}
                            required
                            value={quickActionText}
                            onChange={(e) => setQuickActionText(e.target.value)}
                            placeholder={quickActionType === 'Payment' ? 'Enter manual numeric card charge in USD' : 'Draft action body... Details register in Lead Notes history logs'}
                            className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="bg-orange-600 font-bold text-white text-xs px-4 py-1.5 rounded"
                          >
                            Execute Action
                          </button>
                        </form>
                      )}

                      {/* Notes Chronology Stream */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1">Notes & Comm Logs Tracking</h4>

                        <div className="space-y-3">
                          {currentLeadProfile.notes.map((note) => (
                            <div key={note.id} className={`p-3.5 rounded-xl border ${note.isSystem ? 'bg-indigo-50/50 border-indigo-100 text-indigo-950' : 'bg-slate-50 border-slate-150 text-slate-800'}`}>
                              <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                                <span>Author: <strong className={note.isSystem ? 'text-indigo-600' : 'text-slate-800'}>{note.author}</strong></span>
                                <span className="font-mono">{new Date(note.createdAt).toLocaleString()}</span>
                              </div>
                              <p className="text-xs mt-1.5 font-medium leading-relaxed">{note.content}</p>
                            </div>
                          ))}
                        </div>

                        {/* Add Note Submitter Form */}
                        <form onSubmit={triggerSubmitNote} className="space-y-2 pt-2">
                          <div>
                            <label className="text-[10px] text-slate-500 block mb-0.5 font-semibold">Post New Note</label>
                            <textarea
                              rows={3}
                              required
                              value={newNoteText}
                              onChange={(e) => setNewNoteText(e.target.value)}
                              placeholder="Record caller objections, fitment checks, quotes given, shipping dispatch issues..."
                              className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none"
                            />
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <span>Author:</span>
                              <select
                                value={newNoteAuthor}
                                onChange={(e) => setNewNoteAuthor(e.target.value)}
                                className="bg-slate-100 px-2 py-0.5 rounded font-bold"
                              >
                                {agents.map((ag) => (
                                  <option key={ag.id} value={ag.name}>
                                    {ag.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              type="submit"
                              className="px-4 py-1.5 bg-slate-900 border border-transparent hover:bg-slate-800 text-white font-bold text-xs rounded shadow"
                            >
                              Add Note Entry
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* Right Columns: Financial Bookkeeping sheet */}
                    <div className="p-6 bg-slate-50/50 space-y-6">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Financial Split Bookkeeper</h4>
                        <button
                          onClick={() => {
                            if (isEditingFinances) {
                              saveLeadFinances();
                            } else {
                              startEditingFinances(currentLeadProfile);
                            }
                          }}
                          className="text-xs text-orange-600 font-bold hover:underline"
                        >
                          {isEditingFinances ? 'Save Ledger' : 'Modify Values'}
                        </button>
                      </div>

                      {isEditingFinances ? (
                        <div className="space-y-3 font-mono text-xs">
                          <div>
                            <label className="text-[9px] text-slate-400 block font-bold">Total Sold Amount ($)</label>
                            <input
                              type="number"
                              value={formSoldAmount}
                              onChange={(e) => setFormSoldAmount(parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 block font-bold">Card Payment Total ($)</label>
                            <input
                              type="number"
                              value={formCardAmount}
                              onChange={(e) => setFormCardAmount(parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 block font-bold">Financed Loan Balance ($)</label>
                            <input
                              type="number"
                              value={formLoanAmount}
                              onChange={(e) => setFormLoanAmount(parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 block font-bold">Sourced Refund Deficit ($)</label>
                            <input
                              type="number"
                              value={formRefundAmount}
                              onChange={(e) => setFormRefundAmount(parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 block font-bold">Chargeback Penalties ($)</label>
                            <input
                              type="number"
                              value={formChargebackAmount}
                              onChange={(e) => setFormChargebackAmount(parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                          <button
                            onClick={saveLeadFinances}
                            className="w-full py-1.5 bg-orange-600 text-white text-xs font-bold rounded"
                          >
                            Update Financial Ledger
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4 text-xs">
                          <div className="p-3 bg-white border rounded-lg shadow-sm flex items-center justify-between">
                            <div>
                              <span className="block text-[9px] text-slate-400 tracking-wider">Gross Booked Value</span>
                              <strong className="text-lg font-black text-slate-900">${(currentLeadProfile.soldAmount || 0).toLocaleString()}</strong>
                            </div>
                            <div className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded border border-emerald-100">
                              Payment Settled
                            </div>
                          </div>

                          <div className="space-y-2 font-mono text-[11px] text-slate-600 bg-white p-3 rounded-lg border">
                            <div className="flex justify-between">
                              <span>Discover/Card split:</span>
                              <span className="font-semibold text-slate-800">${(currentLeadProfile.cardAmount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>LendingUSA financing:</span>
                              <span className="font-semibold text-slate-800">${(currentLeadProfile.loanAmount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-rose-600">
                              <span>Refund deductions:</span>
                              <span>-${(currentLeadProfile.refundAmount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-rose-800 font-bold">
                              <span>Chargeback Penalty:</span>
                              <span>-${(currentLeadProfile.chargebackAmount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-t pt-1.5 text-slate-900 font-bold block">
                              <span>NET REALIZED CASH:</span>
                              <span>
                                ${(
                                  (currentLeadProfile.soldAmount || 0) -
                                  (currentLeadProfile.refundAmount || 0) -
                                  (currentLeadProfile.chargebackAmount || 0)
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {/* VIEW: LEADS LIST VIEW WITH FILTER PANEL & PAGINATION DROPDOWN */}
              {activeLeadSubmenu === 'LeadList' && !selectedLeadId && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-4 p-4">
                  {/* Sorting & filters rows */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        id="leads-search-input"
                        type="text"
                        placeholder="Search Lead Index (Customer, brand Make, Model...)"
                        value={leadSearchQuery}
                        onChange={(e) => { setLeadSearchQuery(e.target.value); setLeadCurrentPage(1); }}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-1 text-slate-500 text-xs bg-slate-50 px-2.5 py-1.5 rounded border">
                        <Filter className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-semibold">Status:</span>
                        <select
                          id="leads-status-filter"
                          value={leadStatusFilter}
                          onChange={(e) => { setLeadStatusFilter(e.target.value); setLeadCurrentPage(1); }}
                          className="bg-transparent font-bold border-none text-[10px] focus:outline-none"
                        >
                          <option value="All">All Lead Types</option>
                          {['Fresh Lead', 'Follow Up', 'Quotation Given', 'Sold', 'Bad Number', 'Need More Info', 'Not Interested'].map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-1 text-slate-500 text-xs bg-slate-50 px-2.5 py-1.5 rounded border">
                        <span className="text-[10px] font-semibold">Page Size:</span>
                        <select
                          id="leads-page-size-select"
                          value={leadPageSize}
                          onChange={(e) => { setLeadPageSize(parseInt(e.target.value)); setLeadCurrentPage(1); }}
                          className="bg-transparent font-bold border-none text-[10px] focus:outline-none"
                        >
                          <option value={25}>Show 25</option>
                          <option value={50}>Show 50</option>
                          <option value={100}>Show 100</option>
                          <option value={200}>Show 200</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* High Quality Lead table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-500 border-collapse">
                      <thead className="bg-slate-50 text-slate-700 font-mono tracking-wider uppercase text-[10px]">
                        <tr>
                          <th className="p-3 border-b border-slate-200">Customer</th>
                          <th className="p-3 border-b border-slate-200">Requested Gear Component</th>
                          <th className="p-3 border-b border-slate-200">Car Spec Fitment</th>
                          <th className="p-3 border-b border-slate-200">Channel</th>
                          <th className="p-3 border-b border-slate-200">Lead Status</th>
                          <th className="p-3 border-b border-slate-200">Owner Assigned</th>
                          <th className="p-3 border-b border-slate-200">Date Logged</th>
                          <th className="p-3 border-b border-slate-200 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedLeads.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50 border-b border-slate-100 transition"
                          >
                            <td className="p-3 font-semibold text-slate-900">
                              <div>{item.name}</div>
                              <div className="font-mono text-[9px] text-slate-400 font-light">{item.phone}</div>
                            </td>
                            <td className="p-3 text-slate-950 font-medium">
                              {item.partRequested}
                            </td>
                            <td className="p-3">
                              {item.vehicle.make} {item.vehicle.model} ({item.vehicle.year})
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                item.type === 'Web Query' ? 'bg-indigo-50 text-indigo-700' :
                                item.type === 'Phone Call' ? 'bg-sky-50 text-sky-700' : 'bg-teal-50 text-teal-700'
                              }`}>
                                {item.type}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                                item.status === 'Sold' ? 'bg-emerald-100 text-emerald-800' :
                                item.status === 'Follow Up' ? 'bg-blue-100 text-blue-800' :
                                item.status === 'Quotation Given' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="p-3 font-medium text-slate-900">
                              {item.owner}
                            </td>
                            <td className="p-3 font-mono text-slate-400 text-[10px]">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => setSelectedLeadId(item.id)}
                                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-[10px] font-bold tracking-wide transition"
                              >
                                Track Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination state footer */}
                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Showing {paginatedLeads.length} of {filteredLeads.length} lead entries indexed
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setLeadCurrentPage(p => Math.max(1, p - 1))}
                        disabled={leadCurrentPage === 1}
                        className="p-1 px-2.5 bg-slate-100 border rounded hover:bg-slate-200 disabled:opacity-40"
                      >
                        Prev
                      </button>
                      <span className="text-[11px] font-mono px-2">Page {leadCurrentPage} of {maxLeadPages}</span>
                      <button
                        onClick={() => setLeadCurrentPage(p => Math.min(maxLeadPages, p + 1))}
                        disabled={leadCurrentPage === maxLeadPages}
                        className="p-1 px-2.5 bg-slate-100 border rounded hover:bg-slate-200 disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: SUB-MENU PHONE LOGS WITH AUDIO PLAYBACK SIMULATION */}
              {activeLeadSubmenu === 'PhoneLogs' && !selectedLeadId && (
                <div className="space-y-4">
                  {phoneLogs.map((log) => (
                    <div key={log.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <Phone className={`w-4 h-4 ${log.direction === 'Inbound' ? 'text-green-500' : 'text-blue-500'}`} />
                          <span className="font-extrabold text-xs text-slate-900 font-mono">{log.direction} LOG #{log.id}</span>
                          <span className="text-[10px] text-slate-400">Agent: {log.agentName}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[10px]">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>

                      {/* Customer contact block */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                        <div>
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">Customer Name</span>
                          <span className="text-slate-950 font-bold">{log.customerName}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">Phone Number</span>
                          <span className="text-slate-950">{log.phoneNumber}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">Call Duration</span>
                          <span className="text-slate-950">{log.durationSeconds} seconds</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">Audio Record</span>
                          <audio controls className="h-5 w-44 scale-95 origin-left" src={log.recordingUrl} />
                        </div>
                      </div>

                      {/* OCR Speech Transcription block */}
                      <div className="bg-slate-50 border p-3 rounded-lg text-xs leading-normal font-mono text-slate-600">
                        <p className="font-bold text-slate-900 border-b pb-1 mb-1 text-[10px]">SPEECH COGNITIVE TRANSCRIPTION</p>
                        {log.transcription}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================= TAB: TRANSACTION LEDGER PAYMENT ======================= */}
          {activeMenu === 'Payments' && (
            <div id="module-payments" className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1">Real-time Transaction Ledger</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-500 border-collapse">
                  <thead className="bg-slate-50 text-slate-700 font-mono uppercase text-[9px]">
                    <tr>
                      <th className="p-3 border-b">Receipt Code</th>
                      <th className="p-3 border-b">Customer Account</th>
                      <th className="p-3 border-b">Charge Amount</th>
                      <th className="p-3 border-b">Payment Source</th>
                      <th className="p-3 border-b">Transaction status</th>
                      <th className="p-3 border-b">Date Logs</th>
                      <th className="p-3 border-b">Authorization Ref</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 border-b border-slate-100 transition">
                        <td className="p-3 font-mono font-extrabold text-slate-900">{item.id}</td>
                        <td className="p-3 font-semibold text-slate-900">{item.customerName}</td>
                        <td className="p-3 text-slate-950 font-black">${item.amount.toLocaleString()}</td>
                        <td className="p-3">{item.source}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                            item.status === 'Success' ? 'bg-emerald-50 text-emerald-700' :
                            item.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[10px] text-slate-400">{new Date(item.date).toLocaleString()}</td>
                        <td className="p-3 text-[10px] text-slate-400 font-mono">{item.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================= TAB: 3PL ORDERS MONITOR ======================= */}
          {activeMenu === 'Orders' && (
            <div id="module-orders" className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1">3PL Shipping Operations</h3>

              {orders.map((ord) => (
                <div key={ord.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-2">
                    <div>
                      <span className="text-[10px] font-bold text-orange-600 font-mono">3PL ID: {ord.id}</span>
                      <h4 className="text-sm font-bold text-slate-900">{ord.partName}</h4>
                    </div>
                    {/* Status controller switcher */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase">3PL Transit Stage:</span>
                      <select
                        value={ord.logistics.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any, `Operational status transition to: ${e.target.value}`)}
                        className="bg-slate-100 px-2 py-1 rounded text-xs font-bold border"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Warehouse Picked">Warehouse Picked</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Logistics metrics specs grids */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                    <div>
                      <span className="block text-slate-400 font-bold text-[9px] uppercase">Buyer Destination</span>
                      <span className="text-slate-950 font-bold break-words">{ord.customerName}</span>
                      <span className="block text-[10px] text-slate-400">{ord.customerPhone}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 font-bold text-[9px] uppercase">Shipping Address docs</span>
                      <span className="text-slate-600 truncate block max-w-[150px]">{ord.shippingAddress}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 font-bold text-[9px] uppercase">Assigned Carrier</span>
                      <span className="text-slate-950 font-extrabold text-orange-600">{ord.logistics.provider}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 font-bold text-[9px] uppercase">Tracking Consignment</span>
                      <strong className="text-slate-950 bg-slate-50 p-1 border text-[10px] rounded block truncate">{ord.logistics.trackingNumber}</strong>
                    </div>
                  </div>

                  {/* Active 3PL Dispatch chronological tracking logs */}
                  <div className="bg-slate-50 p-3 rounded-lg text-[11px] font-mono border">
                    <p className="font-bold text-slate-900 border-b pb-1 mb-2 uppercase text-[10px] tracking-wider text-orange-500">Logistics Routing Sync Records</p>
                    <div className="space-y-1.5">
                      {ord.logistics.logs.map((lg, idx) => (
                        <div key={idx} className="flex justify-between text-slate-600 border-b border-slate-150/50 pb-1">
                          <span className="font-semibold text-slate-800">● {lg.status} ({lg.location})</span>
                          <span>{new Date(lg.timestamp).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ======================= TAB: INVENTORY CONTROLLER & CUSTOMIZABLE FITMENTS ======================= */}
          {activeMenu === 'Inventory' && (
            <div id="module-inventory" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    id="inventory-search-input"
                    type="text"
                    placeholder="Search by Name, SKU, or Brand..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border bg-white border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <button
                  id="add-part-modal-btn"
                  onClick={() => setIsAddPartModalOpen(true)}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add Part catalog
                </button>
              </div>

              {/* Add Part Dialog Overlay Modal */}
              <AnimatePresence>
                {isAddPartModalOpen && (
                  <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsAddPartModalOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="fixed inset-4 max-w-xl mx-auto my-auto h-[80vh] bg-white rounded-xl shadow-2xl z-50 p-6 overflow-y-auto space-y-4"
                    >
                      <div className="flex justify-between items-center border-b pb-2">
                        <h4 className="font-bold text-slate-900 text-sm">Add New Component SKU Specification</h4>
                        <button onClick={() => setIsAddPartModalOpen(false)} className="text-slate-500 font-extrabold hover:text-slate-900">Close</button>
                      </div>

                      {/* Add parts form */}
                      <form onSubmit={handleCreatePart} className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-slate-500 font-semibold block">Component Name</label>
                            <input
                              type="text"
                              required
                              value={newPartName}
                              onChange={(e) => setNewPartName(e.target.value)}
                              placeholder="F150 Alternator Brembo Grade"
                              className="w-full px-2 py-1.5 border rounded"
                            />
                          </div>
                          <div>
                            <label className="text-slate-500 font-semibold block">Brand Supplier</label>
                            <input
                              type="text"
                              required
                              value={newPartBrand}
                              onChange={(e) => setNewPartBrand(e.target.value)}
                              placeholder="Ford OEM"
                              className="w-full px-2 py-1.5 border rounded"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-slate-500 font-semibold block">Category</label>
                            <select
                              value={newPartCategory}
                              onChange={(e) => setNewPartCategory(e.target.value)}
                              className="w-full px-2 py-1.5 border rounded bg-white"
                            >
                              <option value="Engine">Engine</option>
                              <option value="Transmission">Transmission</option>
                              <option value="Brakes">Brakes</option>
                              <option value="Suspension">Suspension</option>
                              <option value="Electrical">Electrical</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-slate-500 font-semibold block">Condition Quality</label>
                            <select
                              value={newPartCondition}
                              onChange={(e) => setNewPartCondition(e.target.value as any)}
                              className="w-full px-2 py-1.5 border rounded bg-white"
                            >
                              <option value="New">New</option>
                              <option value="OEM Remanufactured">OEM Remanufactured</option>
                              <option value="Used - Grade A">Used - Grade A</option>
                              <option value="Used - Grade B">Used - Grade B</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-slate-500 font-semibold block">OEM Core Serial #</label>
                            <input
                              type="text"
                              required
                              value={newPartOem}
                              onChange={(e) => setNewPartOem(e.target.value)}
                              placeholder="TOY-12-FL"
                              className="w-full px-2 py-1.5 border rounded"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                          <div>
                            <label className="text-slate-500 font-semibold block">Price ($)</label>
                            <input
                              type="number"
                              required
                              value={newPartPrice}
                              onChange={(e) => setNewPartPrice(parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 border rounded"
                            />
                          </div>
                          <div>
                            <label className="text-slate-500 font-semibold block">Sourcing Cost ($)</label>
                            <input
                              type="number"
                              required
                              value={newPartCost}
                              onChange={(e) => setNewPartCost(parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 border rounded"
                            />
                          </div>
                          <div>
                            <label className="text-slate-500 font-semibold block">Stock qty</label>
                            <input
                              type="number"
                              required
                              value={newPartStock}
                              onChange={(e) => setNewPartStock(parseInt(e.target.value) || 1)}
                              className="w-full px-2 py-1.5 border rounded"
                            />
                          </div>
                          <div>
                            <label className="text-slate-500 font-semibold block">Weight (lbs)</label>
                            <input
                              type="number"
                              required
                              value={newPartWeight}
                              onChange={(e) => setNewPartWeight(parseFloat(e.target.value) || 10)}
                              className="w-full px-2 py-1.5 border rounded"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-slate-500 font-semibold block">Aisle Location Shelf</label>
                            <input
                              type="text"
                              value={newPartLocation}
                              onChange={(e) => setNewPartLocation(e.target.value)}
                              placeholder="Row 1, Aisle D, Shelf 4"
                              className="w-full px-2 py-1.5 border rounded"
                            />
                          </div>
                        </div>

                        {/* Customizable Fitment Keys Area block */}
                        <div className="bg-sky-50 border border-sky-100 p-3.5 rounded-lg space-y-3">
                          <label className="block text-sky-950 font-extrabold uppercase font-mono tracking-wider text-[10px]">Customized Vehicle Fitment Keys Spec Matrix</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-slate-500 font-semibold block text-[10px]">Year Start Span</label>
                              <input
                                type="number"
                                value={newPartFitYearStart}
                                onChange={(e) => setNewPartFitYearStart(parseInt(e.target.value) || 2015)}
                                className="w-full px-2 py-1 border rounded"
                              />
                            </div>
                            <div>
                              <label className="text-slate-500 font-semibold block text-[10px]">Year End Span</label>
                              <input
                                type="number"
                                value={newPartFitYearEnd}
                                onChange={(e) => setNewPartFitYearEnd(parseInt(e.target.value) || 2025)}
                                className="w-full px-2 py-1 border rounded"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-slate-500 font-semibold block text-[10px]">Make Manufacturer</label>
                              <input
                                type="text"
                                placeholder="Subaru / Ford / BMW"
                                value={newPartFitMake}
                                onChange={(e) => setNewPartFitMake(e.target.value)}
                                className="w-full px-2 py-1 border rounded"
                              />
                            </div>
                            <div>
                              <label className="text-slate-500 font-semibold block text-[10px]">Models list (comma separated)</label>
                              <input
                                type="text"
                                placeholder="Outback, WRX, Legacy"
                                value={newPartFitModels}
                                onChange={(e) => setNewPartFitModels(e.target.value)}
                                className="w-full px-2 py-1 border rounded"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-orange-600 text-white font-bold text-xs rounded-lg"
                        >
                          Commit Component to Live Slices
                        </button>
                      </form>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Inventory Live listing layout */}
              <div className="bg-white border p-4 rounded-xl shadow-sm overflow-hidden text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-700 font-mono text-[9px] uppercase">
                      <tr>
                        <th className="p-3 border-b">Category</th>
                        <th className="p-3 border-b">SKU (Part Name)</th>
                        <th className="p-3 border-b">OEM #</th>
                        <th className="p-3 border-b">Condition</th>
                        <th className="p-3 border-b">Pricing</th>
                        <th className="p-3 border-b">Warehouse Grid</th>
                        <th className="p-3 border-b">Stock counts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.filter(p => {
                        if (!inventorySearch) return true;
                        const query = inventorySearch.toLowerCase();
                        return (
                          (p.name && p.name.toLowerCase().includes(query)) ||
                          (p.sku && p.sku.toLowerCase().includes(query)) ||
                          (p.brand && p.brand.toLowerCase().includes(query)) ||
                          (p.warehouseLocation && p.warehouseLocation.toLowerCase().includes(query)) ||
                          (p.oemNumber && p.oemNumber.toLowerCase().includes(query))
                        );
                      }).map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 border-b transition">
                          <td className="p-3"><span className="px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-bold rounded uppercase">{p.category}</span></td>
                          <td className="p-3">
                            <strong className="text-slate-950 font-bold block">{p.name}</strong>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px]">
                              <span className="text-slate-400 font-mono font-light">MFR Sku: {p.sku}</span>
                              <span className="text-slate-300 select-none">•</span>
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">Brand: {p.brand}</span>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-[11px] font-semibold text-slate-500">{p.oemNumber}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 border text-[10px] rounded-lg bg-orange-50/10 font-bold text-orange-600">{p.condition}</span>
                          </td>
                          <td className="p-3 font-black text-slate-900">${p.price.toLocaleString()}</td>
                          <td className="p-3 text-[11px] font-mono font-medium text-slate-600">{p.warehouseLocation}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded ${p.stock > 2 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                              {p.stock} units
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB: SUPPORT CONTROL PANEL (HELP DESK LIVE-CHAT) ======================= */}
          {activeMenu === 'Support' && (
            <div id="module-support" className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border rounded-xl shadow-sm overflow-hidden h-[75vh]">
              {/* Left Column: Tickets panel index selector */}
              <div className="border-r border-slate-200 overflow-y-auto block p-4 space-y-2">
                <span className="text-[10px] font-black font-mono text-slate-400 tracking-wider block uppercase mb-3">Support Ticket Queue</span>
                {tickets.map((t) => {
                  const isActive = t.id === activeTicketId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTicketId(t.id)}
                      className={`w-full text-left p-3 rounded-lg border text-xs flex flex-col justify-between transition ${
                        isActive
                          ? 'bg-slate-900 text-white border-transparent'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <strong className="font-bold">{t.customerName}</strong>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold ${t.status === 'Open' ? 'bg-red-650 text-red-500 border border-red-500' : 'bg-slate-700 text-white'}`}>{t.status}</span>
                      </div>
                      <p className={`line-clamp-1 text-[11px] mt-1 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>{t.subject}</p>
                      <span className="text-[9px] font-mono text-slate-500 text-right w-full block mt-2">{new Date(t.createdAt).toLocaleDateString()}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Chat History and Response Form container */}
              <div className="md:col-span-2 flex flex-col justify-between h-full bg-slate-50 overflow-hidden">
                {selectedTicketObj ? (
                  <>
                    {/* Chat headers info */}
                    <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-950 text-xs">{selectedTicketObj.customerName}</h4>
                        <span className="text-[10px] text-slate-400 block font-mono">Enquire: {selectedTicketObj.subject}</span>
                      </div>
                      <span className="text-xs text-indigo-600 font-bold font-mono">ID: {selectedTicketObj.id}</span>
                    </div>

                    {/* Chat chronology dialogue listing bubble */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                      {selectedTicketObj.chatHistory?.map((msg, i) => (
                        <div key={i} className={`flex max-w-[80%] flex-col ${msg.sender === 'agent' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                          <span className="text-[8px] text-slate-400 font-mono font-medium block uppercase tracking-wide">{msg.sender}</span>
                          <div className={`p-3 rounded-xl text-xs mt-1 leading-relaxed ${
                            msg.sender === 'agent'
                              ? 'bg-orange-600 text-white rounded-br-none shadow'
                              : 'bg-white text-slate-900 border rounded-bl-none border-slate-200 shadow-sm'
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Reply Form submit handler */}
                    <form onSubmit={submitTicketReply} className="p-3 border-t border-slate-205 bg-white flex gap-2">
                      <input
                        type="text"
                        required
                        value={supportAgentReply}
                        onChange={(e) => setSupportAgentReply(e.target.value)}
                        placeholder="Type reply... Your response pipes back to live customers logs in sandbox testing."
                        className="flex-1 px-3 py-2 border rounded-xl text-xs bg-slate-50 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-950 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-slate-800"
                      >
                        <Send className="w-3.5 h-3.5" /> Send
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-20 flex flex-col justify-center items-center">
                    <p className="text-slate-400 text-xs">Select ticket on left to begin integrated chat sessions.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================= TAB: REPORT PANEL & PRINTS ======================= */}
          {activeMenu === 'Reports' && (
            <div id="module-reports" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Turbo Metrics Reports Hub</h4>
                  <h3 className="text-lg font-black text-slate-900">Direct sales evaluation and commission reportings</h3>
                </div>
                <button
                  onClick={() => alert('Operational PDF downloads is queued. Serial certificates compiled successfully.')}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-lg tracking-wider font-mono uppercase"
                >
                  Export CSV Logs
                </button>
              </div>

              {/* Mini Stats matrices summaries block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-500">
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <span className="block font-bold text-slate-400 text-[10px] uppercase font-mono mb-2">Lead Conversion Analysis</span>
                  <div className="space-y-1 font-mono text-[11px] text-slate-700">
                    <p className="flex justify-between"><span>Sold Deals Count:</span><strong>{leads.filter(l => l.status === 'Sold').length}</strong></p>
                    <p className="flex justify-between"><span>Follow up status count:</span><strong>{leads.filter(l => l.status === 'Follow Up').length}</strong></p>
                    <p className="flex justify-between"><span>Quotations proposed:</span><strong>{leads.filter(l => l.status === 'Quotation Given').length}</strong></p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border">
                  <span className="block font-bold text-slate-400 text-[10px] uppercase font-mono mb-2">Audit Accounting Balance</span>
                  <div className="space-y-1 font-mono text-[11px] text-slate-700">
                    <p className="flex justify-between"><span>Gross Realized Card Amount:</span><strong>${leads.reduce((s, c) => s + (c.cardAmount || 0), 0).toLocaleString()}</strong></p>
                    <p className="flex justify-between"><span>Secured Loan Finance Balance:</span><strong>${leads.reduce((s, c) => s + (c.loanAmount || 0), 0).toLocaleString()}</strong></p>
                    <p className="flex justify-between text-rose-600"><span>Refund Deficit deductions:</span><strong>-${leads.reduce((s, c) => s + (c.refundAmount || 0), 0).toLocaleString()}</strong></p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border">
                  <span className="block font-bold text-slate-400 text-[10px] uppercase font-mono mb-2">Staff Commission Tracker</span>
                  <div className="space-y-1 font-mono text-[11px] text-slate-700">
                    {agents.map(ag => {
                      const totalSold = leads.filter(l => l.owner === ag.name && l.status === 'Sold').reduce((s,c) => s + (c.soldAmount || 0), 0);
                      const commValue = Math.round(totalSold * ag.commissionRate);
                      return (
                        <p key={ag.id} className="flex justify-between">
                          <span>{ag.name} ({Math.round(ag.commissionRate * 100)}%):</span>
                          <strong>${commValue.toLocaleString()}</strong>
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB: MAILS INBOX CLIENT ======================= */}
          {activeMenu === 'Mails' && (
            <div id="module-mails" className="grid grid-cols-1 md:grid-cols-3 bg-white border rounded-xl overflow-hidden shadow-sm h-[70vh]">
              {/* Mail Left sidebar nav panel */}
              <div className="border-r border-slate-200 block p-4 space-y-4">
                <button
                  onClick={() => setIsComposingMail(true)}
                  className="w-full py-2 bg-orange-600 text-white font-bold text-xs rounded-lg uppercase tracking-wider block text-center"
                >
                  Compose Email
                </button>

                <div className="space-y-1.5 flex flex-col">
                  {['Inbox', 'Sent', 'Drafts'].map((folder) => {
                    const count = mails.filter(m => m.folder === folder).length;
                    return (
                      <button
                        key={folder}
                        onClick={() => { setMailFolder(folder as any); setIsComposingMail(false); }}
                        className={`text-left px-3 py-2 text-xs font-bold rounded-lg flex justify-between items-center ${
                          mailFolder === folder ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <span>{folder}</span>
                        <span className="px-1.5 py-0.5 bg-slate-200 text-slate-500 text-[10px] font-mono rounded-full">{count}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 font-mono tracking-widest block uppercase border-t pt-3 mt-3">Messages list</span>
                  {mails.filter(m => m.folder === mailFolder).map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedMailId(m.id); setIsComposingMail(false); }}
                      className={`w-full text-left p-2 rounded-lg text-xs tracking-tight truncate block ${
                        selectedMailId === m.id ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 border-transparent text-slate-700'
                      }`}
                    >
                      <strong className="block truncate">{m.subject}</strong>
                      <span className="text-[10px] opacity-60 truncate block">{m.from}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mail Right panel workspace */}
              <div className="md:col-span-2 p-6 flex flex-col justify-between bg-slate-50 h-full overflow-y-auto">
                {isComposingMail ? (
                  <form onSubmit={handleSendComposeMail} className="space-y-3 text-xs flex flex-col h-full justify-between">
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-950 text-sm">Draft New Email</h4>
                      <div>
                        <label className="text-[10px] text-slate-400 block font-semibold uppercase">Recipient address (To)</label>
                        <input
                          type="email"
                          required
                          value={mailTo}
                          onChange={(e) => setMailTo(e.target.value)}
                          placeholder="jenkins@outlook.com"
                          className="w-full px-3 py-1.5 border bg-white rounded-lg focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block font-semibold uppercase">Subject Title</label>
                        <input
                          type="text"
                          required
                          value={mailSubject}
                          onChange={(e) => setMailSubject(e.target.value)}
                          placeholder="Warranty certificate & delivery instructions"
                          className="w-full px-3 py-1.5 border bg-white rounded-lg focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block font-semibold uppercase font-mono">Email Body text</label>
                        <textarea
                          rows={6}
                          required
                          value={mailBody}
                          onChange={(e) => setMailBody(e.target.value)}
                          placeholder="Write transmission spec confirmations..."
                          className="w-full px-3 py-2 border bg-white rounded-lg focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="py-2 bg-orange-600 text-white font-bold text-xs rounded-lg uppercase tracking-wider block mx-auto w-40"
                    >
                      Send Message
                    </button>
                  </form>
                ) : selectedMailObj ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 border rounded-xl shadow-inner space-y-1">
                      <p className="text-xs text-slate-400 font-mono flex justify-between"><span>From: {selectedMailObj.from}</span> <span>{new Date(selectedMailObj.timestamp).toLocaleString()}</span></p>
                      <p className="text-xs text-slate-400 font-mono">To: {selectedMailObj.to}</p>
                      <h4 className="text-sm font-black text-slate-900 border-t pt-2 mt-2">{selectedMailObj.subject}</h4>
                    </div>

                    <div className="bg-white p-5 rounded-xl border leading-relaxed text-xs shadow-sm whitespace-pre-wrap">
                      {selectedMailObj.body}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 flex flex-col justify-center items-center">
                    <p className="text-slate-400 text-xs text-center">Compose a new draft or select catalog message envelope.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================= TAB: MY TASK TASKBOARD ======================= */}
          {activeMenu === 'My Task' && (
            <div id="module-tasks" className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1">Team Action Kanban Scheduler</span>
                <button
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs"
                >
                  Create Task
                </button>
              </div>

              {/* Inline Composition form */}
              {isAddingTask && (
                <form onSubmit={handleCreateTask} className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-3 max-w-md">
                  <h4 className="text-slate-900 font-bold border-b pb-1">Compose Reminder Task</h4>
                  <div>
                    <label className="text-[10px] text-slate-500 block font-semibold">Title</label>
                    <input
                      type="text"
                      required
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="e.g. Call back Jenkins regarding Discover card"
                      className="w-full px-2 py-1.5 border rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block font-semibold">Detailed instructions</label>
                    <textarea
                      required
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                      placeholder="Verify dynamic tracking..."
                      className="w-full px-2 py-1.5 border rounded focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block font-semibold">Staff Agent</label>
                      <select
                        value={taskAgent}
                        onChange={(e) => setTaskAgent(e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-white"
                      >
                        {agents.map((ag) => (
                          <option key={ag.id} value={ag.name}>
                            {ag.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block font-semibold">Priority tier</label>
                      <select
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value as any)}
                        className="w-full px-2 py-1 border rounded bg-white"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded"
                  >
                    Commit Task Alert
                  </button>
                </form>
              )}

              {/* Taskboard Search and Filter Controls */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search tasks by title or assigned staff agent in real-time..."
                    value={taskSearchQuery}
                    onChange={(e) => setTaskSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold tracking-wide focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none bg-slate-50 hover:bg-slate-100/50 transition-all placeholder:text-slate-400 placeholder:font-normal font-sans"
                  />
                </div>
                {taskSearchQuery && (
                  <button
                    onClick={() => setTaskSearchQuery('')}
                    className="text-orange-600 hover:text-orange-700 font-bold font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 hover:bg-orange-50 rounded-lg transition-all"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* Taskboard boards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Pending', 'In Progress', 'Completed'].map((statusKey) => {
                  const items = tasks.filter(t => {
                    const matchesStatus = t.status === statusKey || (!t.status && statusKey === 'Pending');
                    if (!matchesStatus) return false;
                    if (!taskSearchQuery.trim()) return true;

                    const query = taskSearchQuery.toLowerCase();
                    const matchesTitle = t.title?.toLowerCase().includes(query);
                    const matchesAgent = t.assignedTo?.toLowerCase().includes(query);
                    const matchesDesc = (t.description || '').toLowerCase().includes(query);
                    return matchesTitle || matchesAgent || matchesDesc;
                  });
                  return (
                    <div key={statusKey} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                        <span className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-widest">{statusKey} Board</span>
                        <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-mono">{items.length}</span>
                      </div>

                      <div className="space-y-3.5">
                        {items.length === 0 ? (
                          <div className="text-center py-6 text-[10px] text-slate-400">Column Empty</div>
                        ) : (
                          items.map(t => (
                            <div key={t.id} className="bg-white p-3.5 rounded-lg border border-slate-150/80 shadow-sm space-y-2">
                              <div className="flex justify-between items-start">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                  t.priority === 'High' ? 'bg-red-50 text-red-700' :
                                  t.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {t.priority} priority
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono font-bold tracking-wider">ID: {t.id}</span>
                              </div>
                              <h5 className="font-bold text-slate-950 text-xs leading-snug">{t.title}</h5>
                              <p className="text-[11px] text-slate-500 leading-normal">{t.description}</p>
                              <div className="border-t pt-2 flex justify-between items-center text-[10px] text-slate-400">
                                <span>Owner: <strong>{t.assignedTo}</strong></span>
                                <span>Due: {t.dueDate}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= TAB: SCOOP PURCHASE salvage PLATES ======================= */}
          {activeMenu === 'Purchase' && (
            <div id="module-purchase" className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1">Supply-Chain Parts Purchase</h3>

              <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-2 max-w-sm">
                <span className="text-[10px] font-black font-mono text-orange-600 uppercase">Interactive buying workflow</span>
                <p className="text-[11px] text-slate-500 leading-normal">Piping scrap and yard salvage offers securely from broker feeds directly into warehouse row allocations.</p>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-705 font-mono uppercase text-[9px]">
                    <tr>
                      <th className="p-3 border-b">Request ID</th>
                      <th className="p-3 border-b">Auto Wrecker Yard</th>
                      <th className="p-3 border-b">Offered Component & Gears</th>
                      <th className="p-3 border-b">Bidding Price</th>
                      <th className="p-3 border-b">Buying Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((offer) => (
                      <tr key={offer.id} className="border-b hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-indigo-600">{offer.id}</td>
                        <td className="p-3 font-bold text-slate-900">{offer.supplierName}</td>
                        <td className="p-3">{offer.partDetails}</td>
                        <td className="p-3 font-black text-slate-950">${offer.priceRequested.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            offer.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                            offer.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {offer.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================= TAB: AGENT/USERS ROLE ROSTER ======================= */}
          {activeMenu === 'Users' && (
            <div id="module-users" className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1">Staff Roster & Commission Plans</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
                {agents.map((ag) => (
                  <div key={ag.id} className="bg-slate-50 p-4 border rounded-xl shadow-sm relative overflow-hidden space-y-1">
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500" />
                    <h5 className="font-bold text-slate-950 text-sm">{ag.name}</h5>
                    <p className="text-orange-600 font-mono font-bold text-[10px] uppercase">{ag.role}</p>
                    <p className="text-[11px] text-slate-400">{ag.email}</p>
                    <p className="font-semibold text-slate-600 font-mono text-[11px] pt-2 border-t mt-3">
                      Commissions Rate: <strong className="text-slate-950">{ag.commissionRate * 100}%</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================= TAB: TRAINING MATERIALS MODULE ======================= */}
          {activeMenu === 'Training' && (
            <div id="module-training" className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1">Auto Parts Sales Objection Manuals</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {training.map(doc => (
                  <div key={doc.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3.5">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded text-[9px] font-mono font-bold uppercase">{doc.category}</span>
                      <BookOpen className="w-4 h-4 text-slate-400" />
                    </div>
                    <h4 className="font-bold text-slate-955 text-sm">{doc.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{doc.content}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================= TAB: REVIEW MANAGE SECTION ======================= */}
          {activeMenu === 'Review Manage' && (
            <div id="module-reviews" className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1">Customer Star Review Moderation</h3>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong className="text-slate-900 font-bold block text-sm">{rev.customerName}</strong>
                        <span className="text-[10px] text-slate-400">Purchased: <strong className="text-slate-700">{rev.partName}</strong></span>
                      </div>
                      {/* Rating stars display */}
                      <div className="flex gap-0.5 text-amber-500 text-xs">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>

                    {rev.status === 'Pending' ? (
                      <div className="space-y-2 pt-2 border-t">
                        <textarea
                          placeholder="Compose reply as administrator..."
                          value={reviewReplyText[rev.id] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setReviewReplyText(prev => ({ ...prev, [rev.id]: val }));
                          }}
                          className="w-full p-2 border text-xs rounded bg-slate-50 focus:outline-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => triggerReviewAction(rev.id, 'Rejected')}
                            className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded hover:bg-slate-200"
                          >
                            Reject Review
                          </button>
                          <button
                            onClick={() => triggerReviewAction(rev.id, 'Approved')}
                            className="px-3 py-1 bg-orange-600 text-white text-xs font-extrabold rounded hover:bg-orange-700"
                          >
                            Approve & Publish Reply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50/50 p-2.5 rounded text-[11px] text-slate-600 border border-amber-100">
                        <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">OPERATIONAL REPLY</span>
                        {rev.replyContent}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
