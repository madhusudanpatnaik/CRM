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
import PortalLogin from './components/PortalLogin';

export default function App() {
  // Navigation Mode switcher: 'catalog' (client-facing storefront), 'crm' (internal admin panel), or 'portal' (unified secure login & customer panel)
  const [viewMode, setViewMode] = useState<'catalog' | 'crm' | 'portal'>('catalog');

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

  // Load unified database states from server on application boot and maintain 3s background real-time sync
  React.useEffect(() => {
    const fetchDb = async () => {
      try {
        const response = await fetch('/api/db');
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data === 'object') {
            if (data.parts) setParts(data.parts);
            if (data.leads) setLeads(data.leads);
            if (data.payments) setPayments(data.payments);
            if (data.phoneLogs) setPhoneLogs(data.phoneLogs);
            if (data.purchases) setPurchases(data.purchases);
            if (data.tasks) setTasks(data.tasks);
            if (data.mails) setMails(data.mails);
            if (data.tickets) setTickets(data.tickets);
            if (data.orders) setOrders(data.orders);
            if (data.reviews) setReviews(data.reviews);
          }
        }
      } catch (error) {
        console.error('Failed to load database state from backend server:', error);
      }
    };
    fetchDb();
    
    // Begin 3000ms polling interval to simulate WebSocket persistent connections
    const interval = setInterval(fetchDb, 3000);
    return () => clearInterval(interval);
  }, []);

  // Universal helper to push client state changes to Express JSON Database
  const saveStateToBackend = async (collections: {
    parts?: Part[];
    leads?: Lead[];
    payments?: PaymentTransaction[];
    phoneLogs?: PhoneLog[];
    purchases?: PurchaseOffer[];
    tasks?: AgentTask[];
    mails?: CrmMail[];
    tickets?: SupportTicket[];
    orders?: PartOrder[];
    reviews?: CustomerReview[];
  }) => {
    try {
      // 1. Fetch current database state from server first to prevent overwriting other concurrent events
      const getRes = await fetch('/api/db');
      let currentDb: any = {};
      if (getRes.ok) {
        currentDb = await getRes.json();
      }

      // 2. Perform a robust, surgical merge to prevent stale closure data loss
      const fullPayload = {
        parts: collections.parts !== undefined ? collections.parts : (currentDb.parts !== undefined ? currentDb.parts : parts),
        leads: collections.leads !== undefined ? collections.leads : (currentDb.leads !== undefined ? currentDb.leads : leads),
        payments: collections.payments !== undefined ? collections.payments : (currentDb.payments !== undefined ? currentDb.payments : payments),
        phoneLogs: collections.phoneLogs !== undefined ? collections.phoneLogs : (currentDb.phoneLogs !== undefined ? currentDb.phoneLogs : phoneLogs),
        purchases: collections.purchases !== undefined ? collections.purchases : (currentDb.purchases !== undefined ? currentDb.purchases : purchases),
        agents: currentDb.agents !== undefined ? currentDb.agents : INITIAL_AGENTS,
        tasks: collections.tasks !== undefined ? collections.tasks : (currentDb.tasks !== undefined ? currentDb.tasks : tasks),
        mails: collections.mails !== undefined ? collections.mails : (currentDb.mails !== undefined ? currentDb.mails : mails),
        tickets: collections.tickets !== undefined ? collections.tickets : (currentDb.tickets !== undefined ? currentDb.tickets : tickets),
        orders: collections.orders !== undefined ? collections.orders : (currentDb.orders !== undefined ? currentDb.orders : orders),
        training: currentDb.training !== undefined ? currentDb.training : INITIAL_TRAINING,
        reviews: collections.reviews !== undefined ? collections.reviews : (currentDb.reviews !== undefined ? currentDb.reviews : reviews),
      };

      // 3. Persist the merged data to the server
      await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPayload),
      });

      // 4. Update client-side React hook states as well so they are in sync instantly
      if (collections.parts !== undefined) setParts(fullPayload.parts);
      if (collections.leads !== undefined) setLeads(fullPayload.leads);
      if (collections.payments !== undefined) setPayments(fullPayload.payments);
      if (collections.phoneLogs !== undefined) setPhoneLogs(fullPayload.phoneLogs);
      if (collections.purchases !== undefined) setPurchases(fullPayload.purchases);
      if (collections.tasks !== undefined) setTasks(fullPayload.tasks);
      if (collections.mails !== undefined) setMails(fullPayload.mails);
      if (collections.tickets !== undefined) setTickets(fullPayload.tickets);
      if (collections.orders !== undefined) setOrders(fullPayload.orders);
      if (collections.reviews !== undefined) setReviews(fullPayload.reviews);
    } catch (error) {
      console.error('Failed to sync updated state with backend db:', error);
    }
  };

  // 1. Action: Add custom parts dynamically mapping custom fitment structures
  const handleAddPart = (newPart: Part) => {
    setParts((prev) => {
      const updated = [newPart, ...prev];
      saveStateToBackend({ parts: updated });
      return updated;
    });
  };

  // 2. Action: Create/Append order from catalog checkout
  const handleAddOrder = async (newOrder: PartOrder) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newOrder }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.db) {
          setOrders(result.db.orders);
          setParts(result.db.parts);
          setPayments(result.db.payments);
          setLeads(result.db.leads);
          setTasks(result.db.tasks);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to submit order to backend:', err);
    }

    // Client-side fallback if backend failed:
    setOrders((prev) => {
      const updatedOrders = [newOrder, ...prev];
      setParts((prevParts) => {
        const updatedParts = prevParts.map((p) => {
          if (p.id === newOrder.partId) {
            return { ...p, stock: Math.max(0, p.stock - 1) };
          }
          return p;
        });
        const transactionRecord: PaymentTransaction = {
          id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: newOrder.customerName,
          amount: newOrder.totalAmount,
          status: 'Success',
          source: 'Card',
          date: new Date().toISOString(),
          reference: `Direct E-commerce Credit Gateway #${newOrder.id}`,
        };
        setPayments((prevPayments) => {
          const updatedPayments = [transactionRecord, ...prevPayments];
          saveStateToBackend({
            orders: updatedOrders,
            parts: updatedParts,
            payments: updatedPayments,
          });
          return updatedPayments;
        });
        return updatedParts;
      });
      return updatedOrders;
    });
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
        engineSize: vehicle.engineSize || 'N/A',
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

    setLeads((prevLeads) => {
      const updatedLeads = [newLead, ...prevLeads];
      const followUpTask: AgentTask = {
        id: `KT-${Math.floor(1000 + Math.random() * 9000)}`,
        title: `Authorize Courier Dispatch for: ${name}`,
        description: `Double check warehouse locations to bundle ${partName} configuration for ${vehicle.year} ${vehicle.make}.`,
        assignedTo: 'Joe Miller',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
        status: 'Pending',
        priority: 'High',
      };
      setTasks((prevTasks) => {
        const updatedTasks = [followUpTask, ...prevTasks];
        saveStateToBackend({ leads: updatedLeads, tasks: updatedTasks });
        return updatedTasks;
      });
      return updatedLeads;
    });
  };

  // 4. Action: Add live support tickets submitted in bottom right helper widget
  const handleAddSupportTicket = (newTicket: SupportTicket) => {
    setTickets((prev) => {
      const updated = [newTicket, ...prev];
      saveStateToBackend({ tickets: updated });
      return updated;
    });
  };

  // 5. Action: Manage Lead profile state details directly
  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) => {
      const updated = prev.map((l) => {
        if (l.id === leadId) {
          return { ...l, status };
        }
        return l;
      });
      saveStateToBackend({ leads: updated });
      return updated;
    });
  };

  // 6. Action: Append communication notes inside Lead detailed diaries chronologically
  const handleAddLeadNote = (leadId: string, noteText: string, author: string) => {
    const newNote = {
      id: `n-${Math.floor(1000 + Math.random() * 9000)}`,
      author,
      content: noteText,
      createdAt: new Date().toISOString(),
    };

    setLeads((prev) => {
      const updated = prev.map((l) => {
        if (l.id === leadId) {
          return { ...l, notes: [...l.notes, newNote] };
        }
        return l;
      });
      saveStateToBackend({ leads: updated });
      return updated;
    });
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
    setLeads((prev) => {
      const updated = prev.map((l) => {
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
      });
      saveStateToBackend({ leads: updated });
      return updated;
    });
  };

  // 8. Action: Manual Payments authorized inside lead logs
  const handleAddPayment = (newPayment: PaymentTransaction) => {
    setPayments((prev) => {
      const updated = [newPayment, ...prev];
      saveStateToBackend({ payments: updated });
      return updated;
    });
  };

  // 9. Action: Append supplier scrap bidding offers
  const handleAddPurchase = (newOffer: PurchaseOffer) => {
    setPurchases((prev) => {
      const updated = [newOffer, ...prev];
      saveStateToBackend({ purchases: updated });
      return updated;
    });
  };

  // 9.b. Action: Dynamic Interactive Supply-Chain purchase piping (Approve / Reject / Receive & Warehousing)
  const handlePipeSalvagePurchase = async (
    offerId: string, 
    status: 'Pending' | 'Approved' | 'Declined' | 'Received', 
    newPart?: Part
  ) => {
    try {
      const response = await fetch('/api/purchases/pipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId, status, newPart })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.db) {
          // Sync all database tables in real-time
          setPurchases(result.db.purchases);
          setParts(result.db.parts);
          setTasks(result.db.tasks);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to pipe purchases to database:', err);
    }

    // Client-side fallback if server is unreachable:
    setPurchases((prev) => {
      const updatedPurchases = prev.map((item) => {
        if (item.id === offerId) {
          return { ...item, status };
        }
        return item;
      });

      if (newPart) {
        setParts((prevParts) => {
          const updatedParts = [newPart, ...prevParts];
          
          setTasks((prevTasks) => {
            const labelId = `KT-${Math.floor(1000 + Math.random() * 9000)}`;
            const fallbackTask = {
              id: labelId,
              title: `Pallet Inspection: ${newPart.sku}`,
              description: `Verify scrap components for ${newPart.name} from salvage offer ${offerId}. Allocate securely to ${newPart.warehouseLocation}.`,
              assignedTo: 'Brenda Wu',
              dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              status: 'Pending' as const,
              priority: 'Medium' as const
            };
            const updatedTasks = [fallbackTask, ...prevTasks];
            saveStateToBackend({
              purchases: updatedPurchases,
              parts: updatedParts,
              tasks: updatedTasks
            });
            return updatedTasks;
          });
          return updatedParts;
        });
      } else {
        saveStateToBackend({ purchases: updatedPurchases });
      }

      return updatedPurchases;
    });
  };

  // 10. Action: Push outbound emails inside simulated outbox
  const handleSendMail = (newMail: CrmMail) => {
    setMails((prev) => {
      const updated = [newMail, ...prev];
      saveStateToBackend({ mails: updated });
      return updated;
    });
  };

  // 11. Action: Reply dialogue inside support ticket chat history panels
  const handleAddSupportReply = (
    ticketId: string,
    messageText: string,
    sender: 'agent' | 'customer'
  ) => {
    setTickets((prev) => {
      const updated = prev.map((t) => {
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
      });
      saveStateToBackend({ tickets: updated });
      return updated;
    });
  };

  // 12. Action: 3PL Transit State Replication
  const handleUpdateOrderStatus = (
    orderId: string,
    status: 'Order Placed' | 'Warehouse Picked' | 'In Transit' | 'Delivered',
    logEntry: string
  ) => {
    setOrders((prevOrders) => {
      const updated = prevOrders.map((o) => {
        if (o.id === orderId) {
          const currentLogs = [...o.logistics.logs];

          // Determine typical logistics hub city depending on stage or use custom log entry
          let hubLocation = logEntry || '';
          if (!hubLocation) {
            if (status === 'Order Placed') hubLocation = 'System Checkout';
            else if (status === 'Warehouse Picked') hubLocation = 'Warehouse Dallas Hub (Bay 1)';
            else if (status === 'In Transit') hubLocation = 'Interstate En Route Carrier Center';
            else if (status === 'Delivered') hubLocation = 'Customer Direct Sign off';
          }

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
      });
      saveStateToBackend({ orders: updated });
      return updated;
    });
  };

  // 13. Action: Moderate customer review star logs
  const handleReviewModerate = (
    reviewId: string,
    action: 'Approved' | 'Rejected',
    reply?: string
  ) => {
    setReviews((prev) => {
      const updated = prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            status: action === 'Approved' ? 'Approved' : 'Rejected',
            replyContent: reply || '',
          };
        }
        return r;
      });
      saveStateToBackend({ reviews: updated });
      return updated;
    });
  };

  // 14. Action: Terminate Lead from Table Lists
  const handleDeleteLead = (leadId: string) => {
    setLeads((prev) => {
      const updated = prev.filter((l) => l.id !== leadId);
      saveStateToBackend({ leads: updated });
      return updated;
    });
  };

  // 15. Action: Create task scheduler
  const handleAddTask = (newTask: AgentTask) => {
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      saveStateToBackend({ tasks: updated });
      return updated;
    });
  };

  // 16. Action: Bulk or manual additions of leads
  const handleAddLeads = (newLeads: Lead[]) => {
    setLeads((prev) => {
      const updated = [...newLeads, ...prev];
      saveStateToBackend({ leads: updated });
      return updated;
    });
  };

  // 17. Action: Bulk or manual additions of phone logs
  const handleAddPhoneLogs = (newLogs: PhoneLog[]) => {
    setPhoneLogs((prev) => {
      const updated = [...newLogs, ...prev];
      saveStateToBackend({ phoneLogs: updated });
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans transition-all duration-300">
      {viewMode === 'catalog' ? (
        <EcommercePortal
          parts={parts}
          onAddOrder={handleAddOrder}
          onAddSupportTicket={handleAddSupportTicket}
          onAddLeadFromWeb={handleAddLeadFromWeb}
          onGoToCrm={() => setViewMode('portal')}
        />
      ) : viewMode === 'portal' ? (
        <PortalLogin
          orders={orders}
          tickets={tickets}
          payments={payments}
          leads={leads}
          onAddSupportTicket={handleAddSupportTicket}
          onAddSupportReply={handleAddSupportReply}
          onGoBack={() => setViewMode('catalog')}
          onAdminLoginSuccess={() => setViewMode('crm')}
          onAddLeadFromWeb={handleAddLeadFromWeb}
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
          onPipeSalvagePurchase={handlePipeSalvagePurchase}
          onAddTask={handleAddTask}
          onSendMail={handleSendMail}
          onAddSupportReply={handleAddSupportReply}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onReviewModerate={handleReviewModerate}
          onDeleteLead={handleDeleteLead}
          onAddLeads={handleAddLeads}
          onAddPhoneLogs={handleAddPhoneLogs}
          onChangeViewMode={(mode) => setViewMode(mode as 'catalog' | 'crm' | 'portal')}
        />
      )}
    </div>
  );
}
