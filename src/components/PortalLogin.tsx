import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  Truck,
  User,
  Lock,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  Plus,
  Search,
  FileText,
  CreditCard,
  AlertCircle,
  Loader2,
  Send,
  HelpCircle,
} from 'lucide-react';
import { PartOrder, SupportTicket, PaymentTransaction, Lead } from '../types';

interface PortalLoginProps {
  orders: PartOrder[];
  tickets: SupportTicket[];
  payments: PaymentTransaction[];
  leads: Lead[];
  onAddSupportTicket: (ticket: SupportTicket) => void;
  onAddSupportReply: (ticketId: string, message: string, sender: 'agent' | 'customer') => void;
  onGoBack: () => void;
  onAdminLoginSuccess: () => void;
  onAddLeadFromWeb: (name: string, email: string, phone: string, partName: string, vehicle: any) => void;
}

export default function PortalLogin({
  orders,
  tickets,
  payments,
  leads,
  onAddSupportTicket,
  onAddSupportReply,
  onGoBack,
  onAdminLoginSuccess,
  onAddLeadFromWeb,
}: PortalLoginProps) {
  // Primary Navigation
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');

  // Input States
  const [customerQuery, setCustomerQuery] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // UI Flow States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sign Up / Registration States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpYear, setSignUpYear] = useState('2022');
  const [signUpMake, setSignUpMake] = useState('Toyota');
  const [signUpModel, setSignUpModel] = useState('Camry');
  const [signUpInterest, setSignUpInterest] = useState('Transmission');
  const [signUpSubmitting, setSignUpSubmitting] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleCustomerSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSignUpSubmitting(true);

    setTimeout(() => {
      const emailLower = signUpEmail.trim().toLowerCase();
      const name = signUpName.trim();
      const phone = signUpPhone.trim();

      if (!name || !emailLower) {
        setAuthError('Please fill out Name and Email fields to complete account registration.');
        setSignUpSubmitting(false);
        return;
      }

      // Check if candidate email already exists in either orders or leads
      const emailExistsInOrders = orders.some((o) => o.customerEmail.toLowerCase() === emailLower);
      const emailExistsInLeads = leads ? leads.some((l) => l.email.toLowerCase() === emailLower) : false;

      if (emailExistsInOrders || emailExistsInLeads) {
        setAuthError('An account with this email address already exists. Please log in on the left.');
        setSignUpSubmitting(false);
        return;
      }

      // 1. Submit the new client details to the database (triggers dynamic synced backend)
      onAddLeadFromWeb(
        name,
        emailLower,
        phone,
        `Account Registration Interest: ${signUpInterest} parts`,
        {
          year: parseInt(signUpYear) || 2022,
          make: signUpMake || 'Toyota',
          model: signUpModel || 'Camry',
          engineSize: 'N/A'
        }
      );

      setSignUpSuccess(true);
      setSignUpSubmitting(false);

      // 2. Automatically log the newly registered user in to their Customer Command Hub!
      setTimeout(() => {
        setAuthenticatedCustomerEmail(emailLower);
        setCustomerSessionOrders([]); // starts fresh
        setCustomerSessionTickets([]); // starts fresh
        setSuccessMsg(`Welcome, ${name}! Your account has been registered successfully on our unified database.`);
        
        // Reset SignUp form states
        setSignUpName('');
        setSignUpEmail('');
        setSignUpPhone('');
        setSignUpSuccess(false);
      }, 1000);

    }, 850);
  };

  // Logged-in Customer Session Data
  const [authenticatedCustomerEmail, setAuthenticatedCustomerEmail] = useState<string | null>(null);
  const [customerSessionOrders, setCustomerSessionOrders] = useState<PartOrder[]>([]);
  const [customerSessionTickets, setCustomerSessionTickets] = useState<SupportTicket[]>([]);

  // Customer Panel Active Navigation
  const [customerActiveSubTab, setCustomerActiveSubTab] = useState<'orders' | 'support' | 'billing'>('orders');
  const [customerActiveTicketId, setCustomerActiveTicketId] = useState<string | null>(null);
  const [customerTicketReplyText, setCustomerTicketReplyText] = useState('');

  // New Support Ticket Input within session
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');

  // Customer Search Lookup
  const handleCustomerSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const queryLower = customerQuery.trim().toLowerCase();
      
      if (!queryLower) {
        setAuthError('Please enter an email address or Order Tracking ID.');
        setIsSubmitting(false);
        return;
      }

      // Check for orders matching either email, tracking number, order ID, or customer name
      const matchedOrders = orders.filter((o) => {
        return (
          o.customerEmail.toLowerCase() === queryLower ||
          o.id.toLowerCase() === queryLower ||
          o.logistics.trackingNumber.toLowerCase() === queryLower ||
          o.customerName.toLowerCase().includes(queryLower)
        );
      });

      // Check for matching customers in Leads database
      const matchedLead = leads ? leads.find((l) => l.email.toLowerCase() === queryLower) : null;

      if (matchedOrders.length > 0 || matchedLead) {
        // Authenticate Customer Session
        const primaryEmail = matchedOrders.length > 0 ? matchedOrders[0].customerEmail : matchedLead!.email;
        const customerName = matchedOrders.length > 0 ? matchedOrders[0].customerName : matchedLead!.name;

        setAuthenticatedCustomerEmail(primaryEmail);
        setCustomerSessionOrders(matchedOrders);

        // Fetch support tickets matching this customer's email
        const matchedTickets = tickets.filter(
          (t) => t.email.toLowerCase() === primaryEmail.toLowerCase()
        );
        setCustomerSessionTickets(matchedTickets);
        if (matchedTickets.length > 0) {
          setCustomerActiveTicketId(matchedTickets[0].id);
        }

        setSuccessMsg(`Welcome back, ${customerName}! Successfully synchronized secure session ledger.`);
        setIsSubmitting(false);
      } else {
        setAuthError('No matching active accounts, orders, or tracking entries found. Place an order or use our Sign Up form on the right to register instantly!');
        setIsSubmitting(false);
      }
    }, 850);
  };

  // Admin Lookup
  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const emailLower = adminEmail.trim().toLowerCase();
      const password = adminPassword.trim();

      // Simple secure demo keys
      if (
        (emailLower === 'admin@turboparts.com' || emailLower === 'admin' || emailLower === 'staff') &&
        (password === 'admin' || password === 'admin123')
      ) {
        setIsSubmitting(false);
        onAdminLoginSuccess();
      } else {
        setAuthError('Invalid administrative key credentials. Hint: use admin / admin');
        setIsSubmitting(false);
      }
    }, 850);
  };

  // Submit Client Reply to Helpdesk
  const handleCustomerReplySubmit = (e: React.FormEvent, ticketId: string) => {
    e.preventDefault();
    if (!customerTicketReplyText.trim()) return;

    onAddSupportReply(ticketId, customerTicketReplyText.trim(), 'customer');
    
    // Refresh current local tickets copy
    setCustomerSessionTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const chat = t.chatHistory ? [...t.chatHistory] : [];
          chat.push({
            sender: 'customer',
            message: customerTicketReplyText.trim(),
            timestamp: new Date().toISOString(),
          });
          return { ...t, chatHistory: chat, status: 'Open' };
        }
        return t;
      })
    );

    setCustomerTicketReplyText('');
  };

  // Submit New Support Ticket from Customer Workspace
  const handleCreateCustomerTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject || !newTicketMessage || !authenticatedCustomerEmail) return;

    const matchedName = customerSessionOrders[0]?.customerName || 'Customer';
    const newTicketId = `TCK-${Math.floor(100 + Math.random() * 900)}`;

    const newTicket: SupportTicket = {
      id: newTicketId,
      customerName: matchedName,
      email: authenticatedCustomerEmail,
      subject: newTicketSubject,
      message: newTicketMessage,
      status: 'Open',
      createdAt: new Date().toISOString(),
      chatHistory: [
        {
          sender: 'customer',
          message: newTicketMessage,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    onAddSupportTicket(newTicket);
    setCustomerSessionTickets((prev) => [newTicket, ...prev]);
    setCustomerActiveTicketId(newTicketId);
    
    // Clear Form inputs
    setNewTicketSubject('');
    setNewTicketMessage('');
    setShowNewTicketForm(false);
  };

  // Calculate logistics stage index
  const getStageIndex = (status: string) => {
    switch (status) {
      case 'Order Placed':
        return 0;
      case 'Warehouse Picked':
        return 1;
      case 'In Transit':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="flex-1 bg-[#0f172a] text-slate-100 font-sans flex flex-col justify-between relative overflow-hidden min-h-screen">
      {/* Visual background ambient blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Primary Header Segment */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-orange-600/20">
            T
          </div>
          <div>
            <h1 className="font-extrabold text-[#f1f5f9] tracking-tight text-sm">TURBOAUTOPARTS</h1>
            <p className="text-[10px] text-slate-400 font-medium leading-none uppercase tracking-widest">Enterprise Network Portal</p>
          </div>
        </div>

        <button
          onClick={onGoBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Catalog Storefront
        </button>
      </header>

      {/* Main Container Wrapper */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {!authenticatedCustomerEmail ? (
            /* ================================= AUTHENTICATION FORM ================================= */
            <motion.div
              key="auth-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl grid md:grid-cols-5 gap-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative"
            >
              {/* Left Column (Main Authentication Input Forms) */}
              <div className="md:col-span-3 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Secure Client & Enterprise Portal
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Synchronized live 3PL logistics tracking, parts warranties, invoices, and executive CRM controllers.
                  </p>
                </div>

                {/* Authentication Tabs */}
                <div className="flex bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
                  <button
                    onClick={() => {
                      setActiveTab('customer');
                      setAuthError('');
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition ${
                      activeTab === 'customer'
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    Customer Order Portal
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setAuthError('');
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition ${
                      activeTab === 'admin'
                        ? 'bg-slate-850 text-white border border-slate-700/80 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Staff CRM Access
                  </button>
                </div>

                {authError && (
                  <div className="bg-red-900/30 border border-red-500/30 text-red-200 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                {activeTab === 'customer' ? (
                  /* CUSTOMER LOGIN PANEL */
                  <form onSubmit={handleCustomerSignIn} className="space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Car owners, mechanics, and procurement coordinators: Enter your registered checkout email, unique order reference, or consignment tracking identifier (e.g. <code>ORD-xxxx</code> or <code>1Z-xxxx</code>).
                    </p>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                        Consignment Credential Or Registered Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={customerQuery}
                          onChange={(e) => setCustomerQuery(e.target.value)}
                          placeholder="e.g. ORD-1234 or email@example.com"
                          className="w-full bg-slate-950/80 border border-slate-800 focus:border-orange-500 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none transition duration-200 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-800 text-white font-black text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl shadow-lg hover:shadow-orange-600/10 flex items-center justify-center gap-2 transition duration-200 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          Synchronizing Order Ledger...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Locate Dispatch State & Invoices
                        </>
                      )}
                    </button>
                    
                    <div className="text-[10px] text-slate-500 mt-2 font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Live Reactive Database sync enabled.
                    </div>
                  </form>
                ) : (
                  /* ADMIN STAFF LOGIN PANEL */
                  <form onSubmit={handleAdminSignIn} className="space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Access official lead pipelines, warehouse inventory stock managers, billing books, and live helpdesk tickets.
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                          Staff Agent ID / Email Address
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
                          <input
                            type="text"
                            required
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            placeholder="admin@turboparts.com (or 'admin')"
                            className="w-full bg-slate-950/80 border border-slate-800 focus:border-slate-500 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none transition duration-200 font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                          Secure Security Keyphrase
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
                          <input
                            type="password"
                            required
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-950/80 border border-slate-800 focus:border-slate-500 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none transition duration-200 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[10px] text-[#f59e0b] leading-relaxed font-mono space-y-1">
                      <div className="font-extrabold uppercase text-amber-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Staff Demo override active
                      </div>
                      <p>Enter email <code className="text-white">admin</code> and Password <code className="text-white">admin</code> or <code className="text-white">admin123</code> to instantly bypass credential lockouts.</p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-100 hover:bg-slate-200 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          Decrypting CRM Matrices...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Launch CRM Command Desk
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column (Locked signup notice was here - now upgraded to proper interactive DB registration desk!) */}
              <div className="md:col-span-2 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full blur-2xl" />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="bg-orange-950/30 border border-orange-500/20 text-[#f97316] text-[10px] font-mono font-extrabold px-2 py-0.5 rounded inline-block uppercase tracking-wide">
                      Instant Database Enrollment
                    </div>
                    <span className="text-[9px] bg-emerald-950/50 text-emerald-400 border border-emerald-900/40 font-bold px-1.5 py-0.5 rounded font-mono uppercase">
                      ACTIVE
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100">
                    Create Customer Account
                  </h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                    Register directly with the CRM server to track replacement parts, generate support tickets, and synchronize invoices.
                  </p>
                </div>

                <form onSubmit={handleCustomerSignUp} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-orange-500 rounded-lg py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none transition duration-200 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-orange-500 rounded-lg py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none transition duration-200 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="e.g. (555) 019-2834"
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-orange-500 rounded-lg py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none transition duration-200 font-mono"
                    />
                  </div>

                  {/* Vehicle configuration details */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase tracking-tight block font-mono">
                        Year
                      </label>
                      <input
                        type="text"
                        value={signUpYear}
                        onChange={(e) => setSignUpYear(e.target.value)}
                        placeholder="2022"
                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-orange-500 rounded-lg py-1 px-2 text-xs text-white placeholder-slate-600 focus:outline-none transition duration-200 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase tracking-tight block font-mono">
                        Make
                      </label>
                      <input
                        type="text"
                        value={signUpMake}
                        onChange={(e) => setSignUpMake(e.target.value)}
                        placeholder="Toyota"
                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-orange-500 rounded-lg py-1 px-2 text-xs text-white placeholder-slate-600 focus:outline-none transition duration-200 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase tracking-tight block font-mono">
                        Model
                      </label>
                      <input
                        type="text"
                        value={signUpModel}
                        onChange={(e) => setSignUpModel(e.target.value)}
                        placeholder="Camry"
                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-orange-500 rounded-lg py-1 px-2 text-xs text-white placeholder-slate-600 focus:outline-none transition duration-200 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                      Category of Interest
                    </label>
                    <select
                      value={signUpInterest}
                      onChange={(e) => setSignUpInterest(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-none font-mono"
                    >
                      <option value="Transmission">Transmission Box</option>
                      <option value="Engine">Engine Block Assembly</option>
                      <option value="Brakes">Brake kit Accessories</option>
                      <option value="Electrical">Alternator / Electrical</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={signUpSubmitting || signUpSuccess}
                    className="w-full mt-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:bg-slate-800 text-white font-mono text-[10px] uppercase font-bold tracking-widest py-2.5 rounded-lg transition duration-200 cursor-pointer disabled:cursor-not-allowed text-center flex items-center justify-center gap-2 shadow-lg shadow-orange-950/20"
                  >
                    {signUpSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        Saving to CRM Database...
                      </>
                    ) : signUpSuccess ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        Account Synced!
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Construct Account
                      </>
                    )}
                  </button>
                </form>

                <p className="text-[8px] text-slate-500 font-mono text-center">
                  By clicking register, your data immediately persists to our JSON database.
                </p>
              </div>
            </motion.div>
          ) : (
            /* ================================= CUSTOMER HUB DASHBOARD MODULE ================================= */
            <motion.div
              key="customer-hub"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative"
            >
              {/* Customer Workspace Top Banner */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-800 pb-5 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold">
                      Verified Secure Customer Console
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                    {customerSessionOrders[0]?.customerName || 'Customer Hub'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Profile Linked: <span className="text-slate-200">{authenticatedCustomerEmail}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setAuthenticatedCustomerEmail(null);
                      setCustomerSessionOrders([]);
                      setCustomerSessionTickets([]);
                      setCustomerActiveTicketId(null);
                      setSuccessMsg('');
                    }}
                    className="px-3.5 py-2 border border-slate-700 hover:border-slate-600 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition font-mono uppercase"
                  >
                    Logout Workspace
                  </button>
                  <button
                    onClick={onGoBack}
                    className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition font-mono uppercase shadow-lg shadow-orange-600/10"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              {successMsg && (
                <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-200 text-xs p-3.5 rounded-lg flex items-center justify-between">
                  <span className="font-sans flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {successMsg}
                  </span>
                  <button 
                    onClick={() => setSuccessMsg('')} 
                    className="text-xs text-emerald-400 hover:text-emerald-100 font-mono uppercase pl-2 font-bold"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Workspace Navigation Grid */}
              <div className="grid md:grid-cols-4 gap-8">
                
                {/* Lateral Left Sidebar */}
                <div className="md:col-span-1 space-y-4">
                  <nav className="flex md:flex-col bg-slate-950/80 p-1.5 border border-slate-850 rounded-xl space-y-0 md:space-y-1 overflow-x-auto gap-1">
                    <button
                      onClick={() => setCustomerActiveSubTab('orders')}
                      className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 py-2.5 px-3.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider text-left transition ${
                        customerActiveSubTab === 'orders'
                          ? 'bg-orange-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Package className="w-4 h-4" />
                      Track Orders ({customerSessionOrders.length})
                    </button>
                    
                    <button
                      onClick={() => setCustomerActiveSubTab('support')}
                      className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 py-2.5 px-3.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider text-left transition ${
                        customerActiveSubTab === 'support'
                          ? 'bg-orange-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Dispatch Chat ({customerSessionTickets.length})
                    </button>
                    
                    <button
                      onClick={() => setCustomerActiveSubTab('billing')}
                      className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 py-2.5 px-3.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider text-left transition ${
                        customerActiveSubTab === 'billing'
                          ? 'bg-orange-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Invoices & Payment
                    </button>
                  </nav>

                  {/* Summary card */}
                  <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2 text-xs font-sans">
                    <p className="font-extrabold uppercase font-mono text-[9px] tracking-wider text-slate-400">
                      Consignment Accounts
                    </p>
                    <div className="space-y-1.5 font-sans">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Owner:</span>
                        <span className="text-slate-300 font-bold max-w-[120px] truncate">{customerSessionOrders[0]?.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contact:</span>
                        <span className="text-slate-300 font-bold">{customerSessionOrders[0]?.customerPhone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Filer:</span>
                        <span className="text-orange-400 font-mono text-[10px]">VERIFIED CLIENT</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Workspace Panel */}
                <div className="md:col-span-3">
                  <AnimatePresence mode="wait">
                    
                    {/* ======================= SUBTAB: MY ORDERS INTEGRATION ======================= */}
                    {customerActiveSubTab === 'orders' && (
                      <motion.div
                        key="sub-orders"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-6"
                      >
                        <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                          <h3 className="text-sm font-black text-white font-mono uppercase tracking-wider">
                            Active Consignment & 3PL Carrier Despatches
                          </h3>
                          <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                            Updates in Real-time
                          </span>
                        </div>

                        {customerSessionOrders.map((order) => {
                          const currentStage = getStageIndex(order.logistics.status);
                          const stages = ['Placed', 'Picked', 'Transit', 'Delivered'];

                          return (
                            <div
                              key={order.id}
                              className="bg-slate-950 p-4 sm:p-5 border border-slate-850 rounded-xl space-y-5 shadow-inner"
                            >
                              {/* Order Metadata Row */}
                              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-3 font-mono">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-400 text-xs font-bold uppercase">
                                      {order.id}
                                    </span>
                                    <span className="text-[9px] px-1.5 py-0.5 bg-orange-950 text-[#f97316] rounded-sm font-extrabold font-mono uppercase border border-orange-950">
                                      {order.logistics.provider}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500">
                                    Shipped: {new Date(order.orderDate).toLocaleDateString(undefined, {
                                      dateStyle: 'medium'
                                    })}
                                  </p>
                                </div>

                                <div className="text-left sm:text-right">
                                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Order Value</p>
                                  <p className="text-sm font-black text-orange-500">
                                    ${order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </p>
                                </div>
                              </div>

                              {/* Target Item description */}
                              <div className="grid grid-cols-1 xs:grid-cols-4 gap-4 items-center">
                                <div className="xs:col-span-3 text-xs space-y-1">
                                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Component SKU Name</p>
                                  <p className="font-extrabold text-slate-100">{order.partName}</p>
                                  <p className="text-[10px] text-slate-500 font-mono">
                                    Consignment Tracking reference: <code className="text-slate-300">{order.logistics.trackingNumber}</code>
                                  </p>
                                </div>
                                <div className="xs:col-span-1 bg-slate-900 border border-slate-800 p-2.5 rounded text-center font-mono">
                                  <p className="text-[8px] text-slate-500 uppercase">Shipping Rate</p>
                                  <p className="text-xs text-slate-200 font-black">${order.logistics.rate || '0.00'}</p>
                                </div>
                              </div>

                              {/* Shipping Status Linear Progress Bar */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-mono tracking-wide uppercase">
                                  <span className="text-slate-400">Consignment Stage Flow</span>
                                  <span className="text-orange-400 font-extrabold">
                                    {order.logistics.status}
                                  </span>
                                </div>
                                
                                <div className="relative pt-2">
                                  <div className="overflow-hidden h-1.5 text-xs flex rounded bg-slate-800">
                                    <div
                                      style={{ width: `${(currentStage / 3) * 100}%` }}
                                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-600 transition-all duration-500"
                                    />
                                  </div>

                                  {/* Milestone Bubbles */}
                                  <div className="flex justify-between items-center mt-3 font-mono">
                                    {stages.map((stage, idx) => {
                                      const isDone = idx <= currentStage;
                                      const isCurrent = idx === currentStage;
                                      return (
                                        <div key={stage} className="flex flex-col items-center">
                                          <div
                                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                                              isDone
                                                ? 'bg-orange-600 text-white shadow-lg'
                                                : 'bg-slate-800 text-slate-500'
                                            } ${isCurrent ? 'ring-4 ring-orange-950' : ''}`}
                                          >
                                            {idx + 1}
                                          </div>
                                          <span
                                            className={`text-[8px] mt-1 uppercase font-bold ${
                                              isCurrent ? 'text-orange-400' : 'text-slate-500'
                                            }`}
                                          >
                                            {stage}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              {/* Logistics Logs Historiography inside tracking */}
                              <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg space-y-2">
                                <p className="text-[10px] font-mono font-extrabold uppercase text-slate-400 flex items-center gap-1">
                                  <Truck className="w-3.5 h-3.5 text-orange-500" /> Carrier Scan History Logs
                                </p>
                                <div className="space-y-1.5">
                                  {order.logistics.logs.map((log, lIdx) => (
                                    <div
                                      key={lIdx}
                                      className="flex justify-between text-[10px] font-mono border-l-2 border-slate-800 pl-2.5 ml-1 leading-relaxed"
                                    >
                                      <div>
                                        <p className="text-slate-300 font-bold">{log.status}</p>
                                        <p className="text-slate-500 text-[8.5px]">{log.location}</p>
                                      </div>
                                      <span className="text-slate-500 text-[9px] shrink-0 text-right font-mono">
                                        {new Date(log.timestamp).toLocaleTimeString(undefined, {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          second: '2-digit',
                                        })}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {customerSessionOrders.length === 0 && (
                          <div className="text-center py-10 bg-slate-950 rounded-xl border border-slate-850 text-slate-500">
                            No orders matches. Contact dispatch system admin.
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ======================= SUBTAB: LIVEDESK SUPPORT CHAT WITH CRM ======================= */}
                    {customerActiveSubTab === 'support' && (
                      <motion.div
                        key="sub-support"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-6"
                      >
                        <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-wrap gap-2">
                          <div>
                            <h3 className="text-sm font-black text-white font-mono uppercase tracking-wider">
                              Dispatch Hotlines & Technical Support Ticket
                            </h3>
                            <p className="text-[10px] text-slate-500">
                              Real-Time Synchronization with Backoffice CRM Ticket Desks.
                            </p>
                          </div>
                          
                          <button
                            onClick={() => setShowNewTicketForm(!showNewTicketForm)}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-black font-mono text-[10px] uppercase py-1.5 px-3 rounded flex items-center gap-1 transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            {showNewTicketForm ? 'Cancel Ticket' : 'File Support Ticket'}
                          </button>
                        </div>

                        {showNewTicketForm ? (
                          /* Create Support Ticket Form block */
                          <form
                            onSubmit={handleCreateCustomerTicket}
                            className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4"
                          >
                            <h4 className="text-xs font-bold font-mono uppercase text-slate-200">
                              Submit New Inquiry File
                            </h4>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                                Subject Description
                              </label>
                              <input
                                type="text"
                                required
                                value={newTicketSubject}
                                onChange={(e) => setNewTicketSubject(e.target.value)}
                                placeholder="e.g., Shipping Delay on Ford Alternator / Warranty Request"
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-orange-500 focus:outline-none transition font-sans"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                                Message Details
                              </label>
                              <textarea
                                required
                                rows={4}
                                value={newTicketMessage}
                                onChange={(e) => setNewTicketMessage(e.target.value)}
                                placeholder="Explain in detail. Our certified automotive parts specialists will respond directly in this dashboard panel!"
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-orange-500 focus:outline-none transition leading-relaxed"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                            >
                              <Send className="w-4 h-4" /> Submit Live Ticket
                            </button>
                          </form>
                        ) : (
                          /* Tickets List & Live Chat Interface */
                          <div className="grid md:grid-cols-5 gap-6">
                            
                            {/* Tickets Lateral Left Column */}
                            <div className="md:col-span-2 space-y-2.5">
                              <p className="text-[9px] font-bold font-mono uppercase text-slate-500 tracking-wider">
                                File Logs
                              </p>
                              
                              <div className="space-y-2 overflow-y-auto max-h-[400px]">
                                {customerSessionTickets.map((t) => {
                                  let statusColor = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
                                  if (t.status === 'In Progress') {
                                    statusColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                                  } else if (t.status === 'Resolved') {
                                    statusColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                                  }

                                  const isActive = customerActiveTicketId === t.id;

                                  return (
                                    <button
                                      key={t.id}
                                      onClick={() => setCustomerActiveTicketId(t.id)}
                                      className={`w-full text-left p-3 rounded-lg border text-xs transition block ${
                                        isActive
                                          ? 'bg-slate-850/90 border-orange-500'
                                          : 'bg-slate-950 border-slate-850 hover:bg-slate-900'
                                      }`}
                                    >
                                      <div className="flex justify-between items-center">
                                        <span className="font-mono font-extrabold text-slate-300">
                                          {t.id}
                                        </span>
                                        <span className={`text-[8px] font-bold font-mono uppercase tracking-widest px-1.5 py-0.5 border rounded ${statusColor}`}>
                                          {t.status}
                                        </span>
                                      </div>
                                      
                                      <p className="font-bold text-slate-100 mt-1.5 truncate max-w-full">
                                        {t.subject}
                                      </p>
                                      
                                      <p className="text-[10px] text-slate-500 truncate mt-1">
                                        {t.message}
                                      </p>

                                      <p className="text-[9px] text-slate-500 mt-2 font-mono text-right">
                                        {new Date(t.createdAt).toLocaleDateString()}
                                      </p>
                                    </button>
                                  );
                                })}

                                {customerSessionTickets.length === 0 && (
                                  <div className="text-center py-6 bg-slate-950 rounded-lg border border-slate-850 text-[10px] text-slate-500">
                                    No support tickets filed. Click &ldquo;File Support Ticket&rdquo; to start.
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Active Chat Conversation Panel Area */}
                            <div className="md:col-span-3">
                              {customerActiveTicketId ? (
                                (() => {
                                  const activeTicket = customerSessionTickets.find(
                                    (t) => t.id === customerActiveTicketId
                                  );
                                  if (!activeTicket) return null;

                                  return (
                                    <div className="border border-slate-850 rounded-xl bg-slate-950 p-4 space-y-4 flex flex-col justify-between h-[450px]">
                                      {/* Active Chat Header */}
                                      <div className="border-b border-slate-850 pb-2 flex justify-between items-center font-mono">
                                        <div>
                                          <p className="font-extrabold text-[#f1f5f9] text-xs">
                                            {activeTicket.id} Conversation
                                          </p>
                                          <p className="text-[10px] text-slate-400 capitalize hover:underline truncate max-w-[200px]" title={activeTicket.subject}>
                                            Inquiry: {activeTicket.subject}
                                          </p>
                                        </div>
                                        <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">
                                          Status: {activeTicket.status}
                                        </span>
                                      </div>

                                      {/* Scrollable messages container */}
                                      <div className="flex-1 space-y-3.5 overflow-y-auto pr-1 text-xs leading-relaxed font-sans max-h-[280px]">
                                        {/* Original Ticket Post Message */}
                                        <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-lg space-y-1">
                                          <p className="text-[9px] font-mono text-slate-400 font-extrabold uppercase">
                                            Original Inquiry Details
                                          </p>
                                          <p className="text-slate-300 font-medium">{activeTicket.message}</p>
                                          <p className="text-[8px] text-slate-500 font-mono text-right">
                                            Submitted: {new Date(activeTicket.createdAt).toLocaleDateString()}
                                          </p>
                                        </div>

                                        {/* Dynamic Chat Replies Loop */}
                                        {activeTicket.chatHistory?.map((chat, cIdx) => {
                                          const isMe = chat.sender === 'customer';
                                          return (
                                            <div
                                              key={cIdx}
                                              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                            >
                                              <div
                                                className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                                                  isMe
                                                    ? 'bg-orange-600 text-white rounded-br-none'
                                                    : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/80'
                                                }`}
                                              >
                                                <div className="flex justify-between items-center gap-4 text-[8px] uppercase tracking-wide font-mono text-slate-300 font-bold mb-1">
                                                  <span>{isMe ? 'You (Customer)' : 'Backoffice Staff'}</span>
                                                  <span>
                                                    {new Date(chat.timestamp).toLocaleTimeString(undefined, {
                                                      hour: '2-digit',
                                                      minute: '2-digit'
                                                    })}
                                                  </span>
                                                </div>
                                                <p className="font-sans text-slate-100 font-medium">
                                                  {chat.message}
                                                </p>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>

                                      {/* Message input tray */}
                                      <form
                                        onSubmit={(e) =>
                                          handleCustomerReplySubmit(e, activeTicket.id)
                                        }
                                        className="border-t border-slate-850 pt-3 flex gap-2"
                                      >
                                        <input
                                          type="text"
                                          placeholder="Type a message to the dispatch agent..."
                                          value={customerTicketReplyText}
                                          onChange={(e) =>
                                            setCustomerTicketReplyText(e.target.value)
                                          }
                                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-500 text-white"
                                        />
                                        <button
                                          type="submit"
                                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold font-mono tracking-wider uppercase transition flex items-center gap-1 cursor-pointer"
                                        >
                                          <Send className="w-3.5 h-3.5" /> Send
                                        </button>
                                      </form>
                                    </div>
                                  );
                                })()
                              ) : (
                                <div className="border border-slate-850 rounded-xl bg-slate-950 p-8 flex flex-col items-center justify-center h-[400px] text-center text-slate-500">
                                  <HelpCircle className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
                                  <p className="font-bold text-xs">No Conversation Thread Highlighted</p>
                                  <p className="text-[10px] text-slate-500 mt-1">Select an active ticket log from the left file directory grid to begin live chat.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ======================= SUBTAB: INVOICING & HISTORICAL PAYMENT DETAILS ======================= */}
                    {customerActiveSubTab === 'billing' && (
                      <motion.div
                        key="sub-billing"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-6"
                      >
                        <div className="border-b border-slate-800 pb-3">
                          <h3 className="text-sm font-black text-white font-mono uppercase tracking-wider">
                            Billing Records & Commercial Statements
                          </h3>
                          <p className="text-[10px] text-slate-500">
                            Verified secure banking ledger statements corresponding to part transactions.
                          </p>
                        </div>

                        {customerSessionOrders.map((order) => {
                          // Find corresponding payment ledger entries based on references containing order ID
                          const matchingPayment = payments.find(
                            (p) =>
                              p.reference.includes(order.id) ||
                              p.customerName.toLowerCase() === order.customerName.toLowerCase()
                          );

                          return (
                            <div
                              key={order.id}
                              className="bg-slate-950 border border-slate-850 rounded-xl p-5 space-y-4"
                            >
                              <div className="flex justify-between items-start font-mono text-xs flex-wrap gap-2">
                                <div>
                                  <p className="font-extrabold uppercase text-slate-300">
                                    Invoice Surcharge Summary
                                  </p>
                                  <p className="text-[10px] text-slate-500 mt-0.5">
                                    References: {order.id} / {order.logistics.trackingNumber}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <span className="text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded font-extrabold uppercase">
                                    Payment Confirmed
                                  </span>
                                  <p className="text-[9.5px] text-slate-500 mt-1 block">
                                    Cleared via Credit Gateway
                                  </p>
                                </div>
                              </div>

                              <div className="border-t border-b border-slate-850/80 py-3.5 space-y-2.5 text-xs text-slate-300 font-sans">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Selected Components:</span>
                                  <span className="text-slate-200 font-bold">{order.partName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Buyer Delivery Location:</span>
                                  <span className="text-slate-200 font-medium max-w-[280px] text-right text-[11px] truncate" title={order.shippingAddress}>
                                    {order.shippingAddress}
                                  </span>
                                </div>
                                <div className="flex justify-between font-mono">
                                  <span className="text-slate-500">Surcharge Logistics Fee ({order.logistics.provider}):</span>
                                  <span className="text-slate-200">${order.logistics.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                              </div>

                              <div className="flex justify-between items-center font-mono text-xs">
                                <span className="text-slate-400 uppercase font-black">
                                  Aggregate Paid Amount:
                                </span>
                                <span className="text-base text-orange-500 font-extrabold">
                                  ${order.totalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                  })}
                                </span>
                              </div>

                              {/* Virtual download indicator */}
                              <div className="pt-2 flex justify-end">
                                <button
                                  onClick={() => {
                                    alert(`Commercial Invoice for block reference: [${order.id}] downloaded successfully to your client file system! (Simulated)`);
                                  }}
                                  className="text-[9.5px] font-mono text-orange-500 hover:text-orange-400 underline font-extrabold flex items-center gap-1 bg-transparent cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5" /> Download Itemized PDF Receipt
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {customerSessionOrders.length === 0 && (
                          <div className="text-center py-10 bg-slate-950 rounded-xl border border-slate-850 text-slate-500">
                            No billing invoice statements found.
                          </div>
                        )}
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Primary Footer Segments */}
      <footer className="border-t border-slate-800/80 bg-slate-950/40 py-5 px-6 flex flex-col md:flex-row items-center justify-between text-slate-500 text-[10px] gap-4 font-mono uppercase">
        <p>© 2026 TurboAutoparts Enterprise Inc.</p>
        <div className="flex items-center gap-4">
          <span className="text-[#38bdf8] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Web Ledger Linked
          </span>
          <span className="text-slate-600">|</span>
          <span>Security Protocol TLS v1.3</span>
        </div>
      </footer>
    </div>
  );
}
