import React, { useState } from 'react';
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
  INITIAL_REVIEWS,
} from './data';
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
} from './types';
import EcommercePortal from './components/EcommercePortal';
import CrmPortal from './components/CrmPortal';

export default function App() {
  // Navigation Mode switcher: 'catalog' (client-facing storefront) or 'crm' (internal admin panel)
  const [viewMode, setViewMode] = useState<'catalog' | 'crm'>('catalog');

  // Unified Reactive Databases States
  const [parts, setParts] = useState<Part[]>(INITIAL_PARTS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [phoneLogs, setPhoneLogs] = useState<PhoneLog[]>(INITIAL_PHONE_LOGS);
  const [purchases, setPurchases] = useState<PurchaseOffer[]>(INITIAL_PURCHASES);
  const [agents] = useState<UserAgent[]>(INITIAL_AGENTS);
  const [tasks, setTasks] = useState<AgentTask[]>(INITIAL_TASKS);
  const [mails, setMails] = useState<CrmMail[]>(INITIAL_MAILS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [orders, setOrders] = useState<PartOrder[]>(INITIAL_ORDERS);
  const [training] = useState<TrainingMaterial[]>(INITIAL_TRAINING);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);

  // 1. Action: Add custom parts dynamically mapping custom fitment structures
  const handleAddPart = (newPart: Part) => {
    setParts((prev) => [newPart, ...prev]);
  };

  // 2. Action: Create/Append order from catalog checkout
  const handleAddOrder = (newOrder: PartOrder) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Background automations: Decrement part inventory stock count!
    setParts((prevParts) =>
      prevParts.map((p) => {
        if (p.id === newOrder.partId) {
          return { ...p, stock: Math.max(0, p.stock - 1) };
        }
        return p;
      })
    );

    // Dynamic state logs: Record financial transactions in main ledgers
    const transactionRecord: PaymentTransaction = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newOrder.customerName,
      amount: newOrder.totalAmount,
      status: 'Success',
      source: 'Card',
      date: new Date().toISOString(),
      reference: `Direct E-commerce Credit Gateway #${newOrder.id}`,
    };
    setPayments((prev) => [transactionRecord, ...prev]);
  };

  // 3. Action: Create CRM Lead automatically when shopping checkout completes
  const handleAddLeadFromWeb = (
    name: string,
    email: string,
    phone: string,
    partName: string,
    vehicle: any
  ) => {
    const randomLeadId = `L-${Math.floor(100 + Math.random() * 900)}`;
    const newLead: Lead = {
      id: randomLeadId,
      name,
      email,
      phone,
      partRequested: partName,
      vehicle: {
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        engineSize: vehicle.engineSize,
      },
      status: 'Sold', // Automatic sales mapping since checkout is cleared values
      type: 'Web Query',
      owner: 'Joe Miller',
      soldAmount: 2200, // mock initial value for the part
      cardAmount: 2200,
      loanAmount: 0,
      refundAmount: 0,
      chargebackAmount: 0,
      createdAt: new Date().toISOString(),
      notes: [
        {
          id: `n-gen-${Math.floor(Math.random() * 1000)}`,
          author: 'System',
          content: `Web Query checkout cleared. Part allocated from Row/Bins. CRM lead tracked status mapped to Joe Miller.`,
          createdAt: new Date().toISOString(),
          isSystem: true,
        },
      ],
    };

    setLeads((prev) => [newLead, ...prev]);

    // Also auto-adds a dynamic follow-up task to confirm shipment delivery with dispatcher!
    const followUpTask: AgentTask = {
      id: `KT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Authorize Courier Dispatch for: ${name}`,
      description: `Double check warehouse locations to bundle ${partName} configuration for ${vehicle.year} ${vehicle.make}.`,
      assignedTo: 'Joe Miller',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
      status: 'Pending',
      priority: 'High',
    };
    setTasks((prev) => [followUpTask, ...prev]);
  };

  // 4. Action: Add live support tickets submitted in bottom right helper widget
  const handleAddSupportTicket = (newTicket: SupportTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  // 5. Action: Manage Lead profile state details directly
  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return { ...l, status };
        }
        return l;
      })
    );
  };

  // 6. Action: Append communication notes inside Lead detailed diaries chronologically
  const handleAddLeadNote = (leadId: string, noteText: string, author: string) => {
    const newNote = {
      id: `n-${Math.floor(1000 + Math.random() * 9000)}`,
      author,
      content: noteText,
      createdAt: new Date().toISOString(),
    };

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return { ...l, notes: [...l.notes, newNote] };
        }
        return l;
      })
    );
  };

  // 7. Action: Update financial splits within lead accounting sections
  const handleUpdateLeadFinances = (
    leadId: string,
    sold: number,
    card: number,
    loan: number,
    refund: number,
    chargeback: number
  ) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            soldAmount: sold,
            cardAmount: card,
            loanAmount: loan,
            refundAmount: refund,
            chargebackAmount: chargeback,
          };
        }
        return l;
      })
    );
  };

  // 8. Action: Manual Payments authorized inside lead logs
  const handleAddPayment = (newPayment: PaymentTransaction) => {
    setPayments((prev) => [newPayment, ...prev]);
  };

  // 9. Action: Append supplier scrap bidding offers
  const handleAddPurchase = (newOffer: PurchaseOffer) => {
    setPurchases((prev) => [newOffer, ...prev]);
  };

  // 10. Action: Push outbound emails inside simulated outbox
  const handleSendMail = (newMail: CrmMail) => {
    setMails((prev) => [newMail, ...prev]);
  };

  // 11. Action: Reply dialogue inside support ticket chat history panels
  const handleAddSupportReply = (
    ticketId: string,
    messageText: string,
    sender: 'agent' | 'customer'
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedChat = t.chatHistory ? [...t.chatHistory] : [];
          updatedChat.push({
            sender,
            message: messageText,
            timestamp: new Date().toISOString(),
          });
          return {
            ...t,
            chatHistory: updatedChat,
            status: sender === 'agent' ? 'In Progress' : 'Open',
          };
        }
        return t;
      })
    );
  };

  // 12. Action: 3PL Transit State Replication
  const handleUpdateOrderStatus = (
    orderId: string,
    status: 'Order Placed' | 'Warehouse Picked' | 'In Transit' | 'Delivered',
    logEntry: string
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => {
        if (o.id === orderId) {
          const currentLogs = [...o.logistics.logs];

          // Determine typical logistics hub city depending on stage
          let hubLocation = 'System Checkout';
          if (status === 'Warehouse Picked') hubLocation = 'Warehouse Dallas Hub (Bay 1)';
          if (status === 'In Transit') hubLocation = 'Interstate En Route Carrier Center';
          if (status === 'Delivered') hubLocation = 'Customer Direct Sign off';

          currentLogs.push({
            status,
            timestamp: new Date().toISOString(),
            location: hubLocation,
          });

          return {
            ...o,
            logistics: {
              ...o.logistics,
              status,
              logs: currentLogs,
            },
          };
        }
        return o;
      })
    );
  };

  // 13. Action: Moderate customer review star logs
  const handleReviewModerate = (
    reviewId: string,
    action: 'Approved' | 'Rejected',
    reply?: string
  ) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            status: action === 'Approved' ? 'Approved' : 'Rejected',
            replyContent: reply || '',
          };
        }
        return r;
      })
    );
  };

  // 14. Action: Terminate Lead from Table Lists
  const handleDeleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  // 15. Action: Create task scheduler
  const handleAddTask = (newTask: AgentTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  // 16. Action: Bulk or manual additions of leads
  const handleAddLeads = (newLeads: Lead[]) => {
    setLeads((prev) => [...newLeads, ...prev]);
  };

  // 17. Action: Bulk or manual additions of phone logs
  const handleAddPhoneLogs = (newLogs: PhoneLog[]) => {
    setPhoneLogs((prev) => [...newLogs, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans transition-all duration-300">
      {viewMode === 'catalog' ? (
        <EcommercePortal
          parts={parts}
          onAddOrder={handleAddOrder}
          onAddSupportTicket={handleAddSupportTicket}
          onAddLeadFromWeb={handleAddLeadFromWeb}
          onGoToCrm={() => setViewMode('crm')}
        />
      ) : (
        <CrmPortal
          parts={parts}
          leads={leads}
          payments={payments}
          phoneLogs={phoneLogs}
          purchases={purchases}
          agents={agents}
          tasks={tasks}
          mails={mails}
          tickets={tickets}
          orders={orders}
          training={training}
          reviews={reviews}
          onAddPart={handleAddPart}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          onAddLeadNote={handleAddLeadNote}
          onUpdateLeadFinances={handleUpdateLeadFinances}
          onAddPayment={handleAddPayment}
          onAddPurchase={handleAddPurchase}
          onAddTask={handleAddTask}
          onSendMail={handleSendMail}
          onAddSupportReply={handleAddSupportReply}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onReviewModerate={handleReviewModerate}
          onDeleteLead={handleDeleteLead}
          onAddLeads={handleAddLeads}
          onAddPhoneLogs={handleAddPhoneLogs}
          onChangeViewMode={setViewMode}
        />
      )}
    </div>
  );
}
