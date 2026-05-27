import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  Search,
  ShoppingBag,
  CheckCircle,
  AlertTriangle,
  Truck,
  Plus,
  Minus,
  Trash2,
  X,
  MessageCircle,
  Clock,
  Shield,
  ShieldAlert,
  Info,
  Send,
  Eye,
  Phone,
  ArrowRight,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Heart,
  Sparkles,
  Lock,
  DollarSign
} from 'lucide-react';
import { Part, PartOrder, SupportTicket } from '../types';
import UsedSearchWidget from './UsedSearchWidget';
import UsedArrivalsCarousel from './UsedArrivalsCarousel';
import UsedFaqAccordion from './UsedFaqAccordion';

interface EcommercePortalProps {
  parts: Part[];
  onAddOrder: (order: PartOrder) => void;
  onAddSupportTicket: (ticket: SupportTicket) => void;
  onAddLeadFromWeb: (name: string, email: string, phone: string, partName: string, vehicle: any) => void;
  onGoToCrm: () => void;
}

export default function EcommercePortal({
  parts,
  onAddOrder,
  onAddSupportTicket,
  onAddLeadFromWeb,
  onGoToCrm,
}: EcommercePortalProps) {
  // Fitment filter states
  const [fitmentYear, setFitmentYear] = useState<string>('');
  const [fitmentMake, setFitmentMake] = useState<string>('');
  const [fitmentModel, setFitmentModel] = useState<string>('');
  const [fitmentEngine, setFitmentEngine] = useState<string>('');

  // General search and category states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Selected product detail modal
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  // Cart state
  const [cart, setCart] = useState<{ part: Part; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 3PL Carrier Selection
  const [selectedCarrier, setSelectedCarrier] = useState<
    'FedEx SuperSaver' | 'UPS Ground' | 'Freight Express' | 'DHL Worldwide'
  >('UPS Ground');

  // Customer checkout info
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutSuccessMessage, setCheckoutSuccessMessage] = useState<string | null>(null);

  // Customer support floating live-chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatName, setChatName] = useState('');
  const [chatEmail, setChatEmail] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatSubmitSuccess, setChatSubmitSuccess] = useState(false);

  // 1. Multi-Step Search Widget Status & State
  const [searchPartType, setSearchPartType] = useState<'Engine' | 'Transmission'>('Engine');
  const [searchMake, setSearchMake] = useState<string>('');
  const [searchModel, setSearchModel] = useState<string>('');
  const [searchYear, setSearchYear] = useState<string>('');
  const [searchOption, setSearchOption] = useState<string>('');
  const [searchStep, setSearchStep] = useState<1 | 2 | 3>(1);
  const [searchContactName, setSearchContactName] = useState<string>('');
  const [searchContactEmail, setSearchContactEmail] = useState<string>('');
  const [searchContactPhone, setSearchContactPhone] = useState<string>('');
  const [searchStepError, setSearchStepError] = useState<string | null>(null);

  // Browse by Make State active column
  const [activeBrowseTab, setActiveBrowseTab] = useState<'engines' | 'transmissions'>('engines');

  // Interactive FAQs Accordion active index
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // Vehicle data lookups for the multi-step search dropdown chaining
  const WIDGET_VEHICLE_DATA = {
    makes: ['Toyota', 'BMW', 'Ford', 'Subaru', 'Acura', 'Honda', 'Audi', 'Chevrolet', 'Nissan', 'Lexus'],
    models: {
      'Toyota': ['Camry', 'Supra', 'RAV4', 'Corolla', 'Tacoma'],
      'BMW': ['M2', '3-Series', '5-Series', 'X3', 'M340i'],
      'Subaru': ['Outback', 'Legacy', 'Crosstrek', 'WRX', 'Forester'],
      'Ford': ['F-150', 'Mustang GT', 'Explorer', 'F-150 Raptor'],
      'Acura': ['MDX', 'Integra', 'TLX', 'NSX'],
      'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot'],
      'Audi': ['A4', 'Q5', 'S4', 'R8'],
      'Chevrolet': ['Corvette', 'Camaro SS', 'Silverado', 'Cruze'],
      'Nissan': ['GT-R', 'Z', 'Frontier', 'Altima'],
      'Lexus': ['RX350', 'IS350', 'ES350', 'LS500']
    } as Record<string, string[]>,
    years: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011'],
    options: {
      'Engine': [
        '3.0L S58 Twin-Turbo Inline-6',
        '2.5L I4 Dual VVT-i',
        '3.5L EcoBoost Dual-Turbo V6',
        '6.2L LT1 Naturally Aspirated V8',
        '2.5L Boxer 4-Cylinder H4',
        '4.0L High-Output V8',
        '2.5L L4 DOHC Engine'
      ],
      'Transmission': [
        '8-Speed ZF Automatic RWD / AWD',
        '6-Speed Manual',
        '10-Speed Overdrive 10R80',
        'Lineartronic CVT Automatic',
        '6-Speed Dual-Clutch S-Tronic',
        'TR690 Automatic CVT'
      ]
    } as Record<string, string[]>
  };

  // Static product list matching user specification for used arrival grids
  const engineArrivals = useMemo<Part[]>(() => [
    {
      id: 'arr-en-1',
      sku: 'BMW-M2-S58',
      name: '2024 BMW M2 3.0L Used Engine',
      category: 'Engine',
      condition: 'Used - Grade A',
      price: 22800,
      cost: 11000,
      stock: 3,
      warehouseLocation: 'Bay 4, Row A',
      fitment: { yearStart: 2021, yearEnd: 2024, make: 'BMW', models: ['M2', 'M3', 'M4'], engines: ['3.0L S58'] },
      description: 'High performance S58 twin turbo inline-6 engine. Pulled from low-mileage 2024 BMW M2. Tested with excellent compression.',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop',
      oemNumber: 'BMW-S58-B30A',
      brand: 'BMW OEM',
      weightLbs: 380,
    },
    {
      id: 'arr-en-2',
      sku: 'TOY-SUP-B58',
      name: '2023 Toyota Supra 3.0L Used Engine',
      category: 'Engine',
      condition: 'Used - Grade A',
      price: 9400,
      cost: 4900,
      stock: 2,
      warehouseLocation: 'Bay 4, Row B',
      fitment: { yearStart: 2020, yearEnd: 2024, make: 'Toyota', models: ['Supra'], engines: ['3.0L B58'] },
      description: 'B58 TwinScroll Turbo engine assembly from late-model Supra. Thoroughly tested, runs clean.',
      image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=600&auto=format&fit=crop',
      oemNumber: 'TOY-19000-W001',
      brand: 'Toyota OEM',
      weightLbs: 360,
    },
    {
      id: 'arr-en-3',
      sku: 'FOR-RAP-V6',
      name: '2022 Ford F-150 Raptor 3.5L Used Engine',
      category: 'Engine',
      condition: 'Used - Grade B',
      price: 6850,
      cost: 3500,
      stock: 4,
      warehouseLocation: 'Bay 5, Row C',
      fitment: { yearStart: 2021, yearEnd: 2023, make: 'Ford', models: ['F-150 Raptor'], engines: ['3.5L EcoBoost'] },
      description: '3.5L High Out V6 EcoBoost engine. Grade B with minor scuffs on intake casing, perfect internals.',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop',
      oemNumber: 'FOR-JL3Z-6006-A',
      brand: 'Ford OEM',
      weightLbs: 410,
    },
    {
      id: 'arr-en-4',
      sku: 'CHE-COR-LS3',
      name: '2021 Chevy Corvette 6.2L Used Engine',
      category: 'Engine',
      condition: 'OEM Remanufactured',
      price: 11200,
      cost: 6000,
      stock: 2,
      warehouseLocation: 'Bay 1, Row A',
      fitment: { yearStart: 2014, yearEnd: 2022, make: 'Chevrolet', models: ['Corvette', 'Camaro SS'], engines: ['6.2L LT1 V8'] },
      description: '6.2L LT1 naturally aspirated V8. Direct replacement for modern Corvettes or custom hotrod swap core.',
      image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=600&auto=format&fit=crop',
      oemNumber: 'GM-19355573',
      brand: 'Chevrolet OEM',
      weightLbs: 450,
    }
  ], []);

  const transmissionArrivals = useMemo<Part[]>(() => [
    {
      id: 'arr-tx-1',
      sku: 'BMW-ZF-8HP',
      name: '2023 BMW M340i ZF 8HP51 Used Transmission',
      category: 'Transmission',
      condition: 'Used - Grade A',
      price: 3850,
      cost: 1900,
      stock: 3,
      warehouseLocation: 'Transmission Bay 2',
      fitment: { yearStart: 2019, yearEnd: 2024, make: 'BMW', models: ['3-Series', '4-Series', 'Z4'], engines: ['3.0L B58'] },
      description: 'Excellent condition 8-speed automatic transmission. Synced mechatronics unit, shifts sharp like original.',
      image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=600&auto=format&fit=crop',
      oemNumber: 'BMW-240086960',
      brand: 'ZF OEM',
      weightLbs: 180,
    },
    {
      id: 'arr-tx-2',
      sku: 'SUB-WRX-6MT',
      name: '2022 Subaru WRX 6-Speed Manual Transmission',
      category: 'Transmission',
      condition: 'Used - Grade A',
      price: 2950,
      cost: 1400,
      stock: 2,
      warehouseLocation: 'Transmission Bay 3',
      fitment: { yearStart: 2015, yearEnd: 2023, make: 'Subaru', models: ['WRX'], engines: ['2.0L H4 Turbo', '2.4L H4 Turbo'] },
      description: 'Tough, driver-focused 6-speed manual gearbox with standard center differential of WRX chassis.',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop',
      oemNumber: 'SUB-32000AJ580',
      brand: 'Subaru OEM',
      weightLbs: 165,
    },
    {
      id: 'arr-tx-3',
      sku: 'FORD-10R80',
      name: '2022 Ford Mustang 10R80 10-Speed Transmission',
      category: 'Transmission',
      condition: 'Used - Grade B',
      price: 2600,
      cost: 1200,
      stock: 4,
      warehouseLocation: 'Transmission Bay 1',
      fitment: { yearStart: 2018, yearEnd: 2024, make: 'Ford', models: ['Mustang GT', 'F-150'], engines: ['5.0L V8', '3.5L V6'] },
      description: 'Innovative Ford-engineered 10-speed overdrive automatic. High strength clutch packs post inspection.',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop',
      oemNumber: 'FOR-JL1p-7000-AD',
      brand: 'Ford OEM',
      weightLbs: 230,
    }
  ], []);

  // Helper arrays for Fitment Dropdowns based on actual catalog data
  const fitmentOptions = useMemo(() => {
    const years = Array.from(
      new Set(
        parts.flatMap((p) => {
          const arr = [];
          for (let y = p.fitment.yearStart; y <= p.fitment.yearEnd; y++) {
            arr.push(y);
          }
          return arr;
        })
      )
    ).sort((a, b) => b - a);

    const makes = Array.from(new Set(parts.map((p) => p.fitment.make))).sort();

    const models = Array.from(
      new Set(parts.filter((p) => !fitmentMake || p.fitment.make === fitmentMake).flatMap((p) => p.fitment.models))
    ).sort();

    const engines = Array.from(
      new Set(
        parts
          .filter((p) => {
            const matchMake = !fitmentMake || p.fitment.make === fitmentMake;
            const matchModel = !fitmentModel || p.fitment.models.includes(fitmentModel);
            return matchMake && matchModel;
          })
          .flatMap((p) => p.fitment.engines || [])
      )
    ).sort();

    return { years, makes, models, engines };
  }, [parts, fitmentMake, fitmentModel]);

  // Handle auto-fitment update when make transitions
  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFitmentMake(e.target.value);
    setFitmentModel('');
    setFitmentEngine('');
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFitmentModel(e.target.value);
    setFitmentEngine('');
  };

  // Reset vehicle filter
  const handleResetFitment = () => {
    setFitmentYear('');
    setFitmentMake('');
    setFitmentModel('');
    setFitmentEngine('');
  };

  // Check if a part fits the currently set header vehicle
  const checkFitmentStatus = (part: Part) => {
    if (!fitmentYear && !fitmentMake && !fitmentModel) {
      return { status: 'neutral', message: 'Enter vehicle in header to verify guaranteed fit.' };
    }

    const yearNum = fitmentYear ? parseInt(fitmentYear) : null;

    // Check year range
    if (yearNum && (yearNum < part.fitment.yearStart || yearNum > part.fitment.yearEnd)) {
      return {
        status: 'incompatible',
        message: `Incompatible Year. Fits ${part.fitment.yearStart}-${part.fitment.yearEnd}.`,
      };
    }

    // Check make
    if (fitmentMake && part.fitment.make.toLowerCase() !== fitmentMake.toLowerCase()) {
      return {
        status: 'incompatible',
        message: `Incompatible Manufacturer. Made for ${part.fitment.make}.`,
      };
    }

    // Check model
    if (fitmentModel && !part.fitment.models.some((m) => m.toLowerCase() === fitmentModel.toLowerCase())) {
      return { status: 'incompatible', message: `Made for ${part.fitment.make} ${part.fitment.models.join(', ')}.` };
    }

    // Check engine if specified
    if (
      fitmentEngine &&
      part.fitment.engines &&
      !part.fitment.engines.some((e) => e.toLowerCase() === fitmentEngine.toLowerCase())
    ) {
      return { status: 'compatible-warning', message: `Compatible on Chassis, but fits engine ${part.fitment.engines.join(', ')}.` };
    }

    return {
      status: 'compatible',
      message: `Guaranteed Fit for ${fitmentYear} ${part.fitment.make} ${fitmentModel || part.fitment.models[0]}!`,
    };
  };

  // Compute 3PL Shipping Charges based on weight & carrier
  const getShippingCharges = (carrier: string, totalWeight: number) => {
    if (totalWeight === 0) return 0;
    switch (carrier) {
      case 'FedEx SuperSaver':
        return Math.round(15 + totalWeight * 0.45);
      case 'UPS Ground':
        return Math.round(10 + totalWeight * 0.35);
      case 'DHL Worldwide':
        return Math.round(45 + totalWeight * 1.1);
      case 'Freight Express':
        return Math.round(80 + totalWeight * 0.2); // Good for heavy items like engines/transmission
      default:
        return 15;
    }
  };

  // Filter parts list
  const filteredParts = useMemo(() => {
    return parts.filter((part) => {
      // Category filter
      if (selectedCategory !== 'All' && part.category !== selectedCategory) {
        return false;
      }

      // Live search input
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = part.name.toLowerCase().includes(query);
        const matchesSku = part.sku.toLowerCase().includes(query);
        const matchesBrand = part.brand.toLowerCase().includes(query);
        const matchesOem = part.oemNumber.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesBrand && !matchesOem) {
          return false;
        }
      }

      // If user checks the "Strict Fitment" checkbox, show physical fits
      const fit = checkFitmentStatus(part);
      if ((fitmentYear || fitmentMake || fitmentModel) && fit.status === 'incompatible') {
        return false;
      }

      return true;
    });
  }, [parts, selectedCategory, searchQuery, fitmentYear, fitmentMake, fitmentModel, fitmentEngine]);

  // Categories list
  const categories = ['All', 'Engine', 'Transmission', 'Brakes', 'Suspension', 'Electrical'];

  // Add item to shopping cart
  const handleAddToCart = (part: Part, qty: number = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.part.id === part.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity = Math.min(part.stock, updated[idx].quantity + qty);
        return updated;
      }
      return [...prev, { part, quantity: Math.min(part.stock, qty) }];
    });
    setIsCartOpen(true);
  };

  // Update Cart Quantity
  const handleUpdateCartQty = (partId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.part.id === partId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: Math.min(item.part.stock, nextQty) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  // Remove Item
  const handleRemoveFromCart = (partId: string) => {
    setCart((prev) => prev.filter((item) => item.part.id !== partId));
  };

  // Calculate totals
  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.part.price * curr.quantity, 0);
  const cartWeight = cart.reduce((acc, curr) => acc + curr.part.weightLbs * curr.quantity, 0);
  const cartShippingFee = getShippingCharges(selectedCarrier, cartWeight);
  const cartTax = Math.round(cartSubtotal * 0.0825); // Texas tax
  const cartTotal = cartSubtotal + cartShippingFee + cartTax;

  // Handle Checkout
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName || !checkoutEmail || !checkoutPhone || !checkoutAddress) {
      alert('Please fill in all shipping fields.');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    // Submit each item as a distinct order or join them
    cart.forEach((item) => {
      const generatedOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const generatedTracking = `1Z-${Math.floor(1000 + Math.random() * 9000)}-${item.part.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderData: PartOrder = {
        id: generatedOrderId,
        partId: item.part.id,
        partName: item.part.name,
        customerName: checkoutName,
        customerEmail: checkoutEmail,
        customerPhone: checkoutPhone,
        shippingAddress: checkoutAddress,
        totalAmount: item.part.price * item.quantity + getShippingCharges(selectedCarrier, item.part.weightLbs * item.quantity),
        paymentStatus: 'Success',
        orderDate: new Date().toISOString(),
        logistics: {
          provider: selectedCarrier,
          rate: getShippingCharges(selectedCarrier, item.part.weightLbs * item.quantity),
          trackingNumber: generatedTracking,
          status: 'Order Placed',
          logs: [
            { status: 'Order Placed', timestamp: new Date().toISOString(), location: 'System checkout' },
          ],
        },
      };

      onAddOrder(orderData);

      // Create a CRM Lead automatically for follow-up tracking
      onAddLeadFromWeb(
        checkoutName,
        checkoutEmail,
        checkoutPhone,
        item.part.name,
        {
          year: fitmentYear ? parseInt(fitmentYear) : item.part.fitment.yearStart,
          make: fitmentMake || item.part.fitment.make,
          model: fitmentModel || item.part.fitment.models[0],
          engineSize: fitmentEngine || item.part.fitment.engines?.[0] || 'Unspecified',
        }
      );
    });

    setCheckoutSuccessMessage(`Thank you for choosing TurboAutoparts, ${checkoutName}! Your order has been placed. We have generated live tracking codes for your ${selectedCarrier} consignment.`);
    setCart([]);
    setCheckoutName('');
    setCheckoutEmail('');
    setCheckoutPhone('');
    setCheckoutAddress('');
  };

  // Submit dynamic Live-Chat / Support Ticket widget
  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatName || !chatEmail || !chatMessage) return;

    const generatedTicketId = `TCK-${Math.floor(100 + Math.random() * 900)}`;
    const ticketData: SupportTicket = {
      id: generatedTicketId,
      customerName: chatName,
      email: chatEmail,
      subject: 'Inquiry from Web Live Chat Widget',
      message: chatMessage,
      status: 'Open',
      createdAt: new Date().toISOString(),
      chatHistory: [
        { sender: 'customer', message: chatMessage, timestamp: new Date().toISOString() },
      ],
    };

    onAddSupportTicket(ticketData);
    setChatSubmitSuccess(true);
    setChatMessage('');
  };

  return (
    <div id="ecommerce-portal" className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* 1. Header & Navigation Menu */}
      <div id="ecommerce-topbar" className="bg-[#0f172a] text-slate-300 text-[11px] py-2 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-white transition duration-200 cursor-pointer animate-fade-in"
            >
              FAQs
            </button>
            <button
              onClick={() => {
                alert('Every part sold includes our robust standard warranty. Selected engines are eligible for up to 36-Month extended security.');
              }}
              className="hover:text-white transition duration-200 cursor-pointer"
            >
              Warranty
            </button>
            <button
              onClick={() => {
                alert('Easy Financing available! We partner with leading institutions to offer quick auto-part financing. Select financing during checkout.');
              }}
              className="hover:text-white transition duration-200 cursor-pointer font-semibold text-emerald-400 animate-pulse"
            >
              Financing Now Available
            </button>
            <button
              onClick={() => {
                alert('Sign in to your customer portal. Enter your orders tracking ID or registered phone number.');
              }}
              className="hover:text-white transition duration-200 cursor-pointer"
            >
              Sign In
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Share link button */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link to TurboAutoparts shop copied to your clipboard!');
              }}
              className="flex items-center gap-1.5 hover:text-white transition duration-240 text-[11px] cursor-pointer"
              title="Share catalog link"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Share</span>
            </button>

            {/* Cart Icon with Dynamic Badge */}
            <button
              id="shopping-cart-toggle"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 hover:text-white transition duration-240 text-[11px] cursor-pointer"
              aria-label="View Shopping Cart List"
            >
              <div className="relative">
                <ShoppingBag className="w-3.5 h-3.5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[8px] font-black px-1 rounded-full ring-1 ring-slate-900 leading-none">
                    {cart.reduce((s, c) => s + c.quantity, 0)}
                  </span>
                )}
              </div>
              <span className="font-semibold">Cart ({cart.reduce((s, c) => s + c.quantity, 0)})</span>
            </button>
          </div>
        </div>
      </div>

      <header id="ecommerce-header" className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 py-3.5 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-200">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-900 leading-tight">
                TURBO AUTOPARTS
              </h1>
              <span className="text-[10px] text-slate-505 font-bold uppercase tracking-wider block">
                Used Engine and Transmission for Sale
              </span>
            </div>
          </div>

          {/* Main Navigation links */}
          <nav className="flex items-center gap-4 md:gap-5 text-xs font-bold text-slate-700">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setFitmentMake('');
                setFitmentModel('');
                setFitmentYear('');
                setFitmentEngine('');
              }}
              className="hover:text-orange-600 transition duration-200 cursor-pointer animate-fade-in"
            >
              Home
            </button>
            <button
              onClick={() => {
                setSelectedCategory('Engine');
                document.getElementById('inventory-list-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-orange-600 transition duration-200 cursor-pointer"
            >
              Engine
            </button>
            <button
              onClick={() => {
                setSelectedCategory('Transmission');
                document.getElementById('inventory-list-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-orange-600 transition duration-200 cursor-pointer"
            >
              Transmission
            </button>
            <button
              onClick={() => {
                alert('Get direct pre-qualification for Parts Loans starting at 0% APR. Connect with our Financing specialists at check out.');
              }}
              className="hover:text-orange-600 transition duration-200 cursor-pointer font-semibold text-orange-600"
            >
              Finance
            </button>
            <button
              onClick={() => {
                alert('Read our Blog: "Why grade-A used transmissions outperform rebuilds" and other technical articles.');
              }}
              className="hover:text-orange-600 transition duration-200 cursor-pointer"
            >
              Blogs
            </button>
            <button
              onClick={() => {
                alert('We back all products with a bulletproof 36-Month extended part-replacement warranty policy.');
              }}
              className="hover:text-orange-600 transition duration-200 cursor-pointer"
            >
              Warranty
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="hover:text-orange-600 transition duration-200 cursor-pointer"
            >
              Support
            </button>
            <button
              id="goto-crm-btn"
              onClick={onGoToCrm}
              className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-white rounded text-[10px] font-bold uppercase transition duration-200 flex items-center gap-1 cursor-pointer"
            >
              CRM Login
            </button>
          </nav>

          {/* Call To Action Block */}
          <a
            href="tel:+18886188881"
            className="flex items-center gap-2 bg-orange-600 text-white font-extrabold px-3.5 py-2 rounded-xl shadow-md hover:bg-orange-700 transition duration-200 text-xs cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <div className="text-left leading-none">
              <span className="block text-[8px] tracking-wider uppercase opacity-90 mb-0.5">SPEAK WITH A SPECIALIST NOW</span>
              <span className="text-[11px] uppercase font-mono tracking-wider font-bold">+1 (888) 618-8881</span>
            </div>
          </a>
        </div>
      </header>

      {/* 2. Hero Section & Multi-Step Search Widget with dynamic background and trust ribbon */}
      <section
        id="hero-banner"
        className="relative bg-slate-950 text-white py-16 pb-24 px-4 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1600&auto=format&fit=crop')`,
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-600/30 text-orange-400 text-xs font-bold rounded-full border border-orange-500/20">
              <Sparkles className="w-3" />
              <span>America’s Leading Used Auto-Parts Supplier</span>
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight md:text-2xl text-white font-display uppercase">
              Smarter Part Sourcing.<br /> Guaranteed Vehicle Fit.
            </h2>
            <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
              We warehouse and direct test thousands of certified OEM engines and automated transmissions. Filter by brand below, log requirements in steps, or connect with dispatcher specialists instantly.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('Engine');
                  document.getElementById('inventory-list-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg transition cursor-pointer"
              >
                Browse Used Engines
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('Transmission');
                  document.getElementById('inventory-list-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition border border-slate-705 cursor-pointer"
              >
                Browse Transmissions
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <UsedSearchWidget
              onAddLeadFromWeb={onAddLeadFromWeb}
              onApplyFilters={(year, make, model, option, category) => {
                setFitmentYear(year);
                setFitmentMake(make);
                setFitmentModel(model);
                setFitmentEngine(option);
                setSelectedCategory(category);
                setTimeout(() => {
                  document.getElementById('inventory-list-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              onOpenLiveChat={() => setIsChatOpen(true)}
            />
          </div>
        </div>

        {/* Trust Banner (4 badges) */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md py-3 border-t border-slate-900 z-10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-[11px]">
              <Truck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="font-extrabold text-white">Free & Fast Delivery in USA</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] border-l border-slate-800 font-sans">
              <DollarSign className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="font-extrabold text-white">Price-match Guarantee</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] border-l border-slate-800">
              <Shield className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="font-extrabold text-white">Up to 36-Month Warranty</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] border-l border-slate-800">
              <Lock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="font-extrabold text-white">Secure Payment System</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Introduction Content Block */}
      <section id="seo-intro-block" className="bg-white py-10 px-4 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h1 className="text-xl md:text-2xl font-black text-slate-955 tracking-tight leading-tight uppercase font-display">
            Used Engines and Transmissions for Sale at Turbo Auto Parts
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed font-normal max-w-3xl mx-auto">
            Welcome to Turbo Auto Parts, your premier source for high-quality used engines and transmissions. We understand that finding reliable replacement parts can be a daunting task, which is why we’ve built an extensive network and an easy-to-use search feature to match your vehicle specifications precisely. Our inventory features certified, pre-tested engines and transmissions with standard guarantees. Benefit from direct-to-door free shipping to commercial addresses, our industry-standard 36-month warranty options, and exceptionally fast 15-day delivery across the contiguous USA. Get back on the road safely and affordably today!
          </p>
        </div>
      </section>

      {/* 7. Category Spotlight Modules */}
      <section id="category-spotlights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white rounded-2xl p-6 relative overflow-hidden group shadow">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 select-none pointer-events-none flex items-center justify-center">
            <Wrench className="w-32 h-32 text-orange-605" />
          </div>
          <div className="relative space-y-2.5 z-10">
            <span className="text-[10px] font-bold text-orange-500 tracking-widest uppercase block font-mono">GEARBOX UPGRADES</span>
            <h3 className="text-base font-black uppercase tracking-tight text-white font-display">TRANSMISSIONS</h3>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              Upgrade your vehicle mechanical block with certified pre-tested automated or manual transmissions. Lock clearance ratios instantly.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Transmission');
                document.getElementById('inventory-list-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-black text-orange-400 hover:text-orange-300 transition duration-200 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Know more & View Stock</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-950 to-orange-900/90 text-white rounded-2xl p-6 relative overflow-hidden group shadow">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 select-none pointer-events-none flex items-center justify-center">
            <Sparkles className="w-32 h-32 text-orange-400" />
          </div>
          <div className="relative space-y-2.5 z-10">
            <span className="text-[10px] font-bold text-orange-400 tracking-widest uppercase block font-mono">BLOCK REPLACEMENTS</span>
            <h3 className="text-base font-black uppercase tracking-tight text-white font-display">ENGINES</h3>
            <p className="text-xs text-slate-205 max-w-md leading-relaxed">
              Find perfectly configured exact displacement used OEM blocks for your model. Fully compression tested with secure warranty logs.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Engine');
                document.getElementById('inventory-list-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-black text-orange-300 hover:text-orange-200 transition duration-200 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Know more & View Stock</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Dynamic Product Carousels / Grids ("New Arrival Used Engines" & "New Arrival Used Transmissions") */}
      <section id="dynamic-arrivals-carousels" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <UsedArrivalsCarousel
          onAddToCart={handleAddToCart}
          onViewDetails={setSelectedPart}
          onScrollCategory={(cat) => {
            setSelectedCategory(cat);
            document.getElementById('inventory-list-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </section>

      {/* 5. "Browse by Make" Section */}
      <section id="browse-by-make" className="bg-slate-100 py-10 px-4 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Browse by Manufacturer</h2>
            <p className="text-xs text-slate-400 font-normal">Direct compatible manufacture indexes. Search or click a manufacturer brand tag to auto lock specifications below.</p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveBrowseTab('engines')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                activeBrowseTab === 'engines' ? 'bg-orange-600 text-white border-orange-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Choose Used Engines by Makes
            </button>
            <button
              onClick={() => setActiveBrowseTab('transmissions')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                activeBrowseTab === 'transmissions' ? 'bg-orange-600 text-white border-orange-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Choose Used Transmissions by Makes
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 font-sans">
              {[
                'Acura', 'Alfa Romeo', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevy', 'Chrysler',
                'Dodge', 'Ford', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia',
                'Lexus', 'Lincoln', 'Mazda', 'Mercedes', 'Mitsubishi', 'Nissan', 'Pontiac',
                'Porsche', 'RAM', 'Subaru', 'Toyota', 'Volkswagen', 'Volvo'
              ].map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setFitmentMake(brand);
                    setFitmentModel('');
                    setFitmentYear('');
                    setFitmentEngine('');
                    if (activeBrowseTab === 'engines') {
                      setSelectedCategory('Engine');
                    } else {
                      setSelectedCategory('Transmission');
                    }
                    setTimeout(() => {
                      document.getElementById('inventory-list-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-3 py-2 bg-slate-50 border border-slate-200/60 hover:border-orange-500 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between text-left transition hover:bg-orange-50/20 cursor-pointer group"
                >
                  <span className="group-hover:text-orange-600">{brand}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

            


      {/* 6. Main Live Inventory List Section */}
      <section id="inventory-list-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 bg-white">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-orange-600 tracking-wider uppercase">Live Warehouse Catalog</span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Search Stock & Verify Fitment</h2>
              <p className="text-xs text-slate-400">Showing {filteredParts.length} matching OEM products from our Dallas-1 logistics hub.</p>
            </div>

            {/* Live Filter / Search Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Category selector */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search SKU, make, engine model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 shadow-inner focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Fitment Status Notice if year/make/model set */}
          {(fitmentYear || fitmentMake || fitmentModel) && (
            <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-between text-[11px] text-orange-850">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-500 shrink-0" />
                <span>
                  Filtering active stock for: <strong className="font-extrabold uppercase">{fitmentYear} {fitmentMake} {fitmentModel} {fitmentEngine}</strong>
                </span>
              </div>
              <button
                onClick={handleResetFitment}
                className="px-2 py-1 bg-white hover:bg-slate-50 text-orange-700 font-bold border border-orange-200 rounded-lg transition text-[10px] cursor-pointer"
              >
                Clear Specifications
              </button>
            </div>
          )}

          {/* Parts Grid */}
          {filteredParts.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
              <AlertTriangle className="w-8 h-8 text-orange-505 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No compatible parts found</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                We couldn't locate active inventory matching your search descriptors or strict vehicle fitment rules in this category. Click below to show all warehouse stock.
              </p>
              <button
                onClick={handleResetFitment}
                className="mt-4 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Show All Warehouse Stock
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParts.map((part) => {
                const fit = checkFitmentStatus(part);
                return (
                  <motion.div
                    key={part.id}
                    layout
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                      <img
                        src={part.image}
                        alt={part.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=400&auto=format&fit=crop`;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <span className="px-2 py-0.5 bg-slate-950/90 text-white text-[9px] font-black tracking-widest uppercase rounded">
                          {part.category}
                        </span>
                        <span className="px-2 py-0.5 bg-white/95 text-slate-800 text-[9px] font-bold uppercase rounded border border-slate-200 shadow-xs">
                          {part.condition}
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2 py-0.5 bg-green-600/90 text-white text-[9px] font-bold rounded">
                          STOCK DETECTED
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                          <span>SKU: {part.sku}</span>
                          <span>BY: {part.brand}</span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-tight line-clamp-2 hover:text-orange-600 cursor-pointer transition" onClick={() => setSelectedPart(part)}>
                          {part.name}
                        </h3>

                        {/* Fit banner inside product card */}
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] flex items-start gap-1.5 leading-tight">
                          {fit.status === 'neutral' ? (
                            <>
                              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="text-slate-500">{fit.message}</span>
                            </>
                          ) : fit.status === 'compatible' ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-green-650 shrink-0" />
                              <span className="text-green-700 font-bold">{fit.message}</span>
                            </>
                          ) : fit.status === 'compatible-warning' ? (
                            <>
                              <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="text-amber-700 font-bold">{fit.message}</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span className="text-rose-700 font-bold">{fit.message}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">PRICE RANGE starting</span>
                          <span className="text-base font-black text-slate-950">${part.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-sans">
                          <button
                            onClick={() => setSelectedPart(part)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-705 text-[11px] font-bold rounded-lg transition cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleAddToCart(part)}
                            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-extrabold rounded-lg transition shadow-xs cursor-pointer"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>


      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-40 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-slate-500" />
                  <h3 className="font-bold text-slate-950 text-sm">Cart & Order Logistics Checkout</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full text-slate-500 hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-slate-500">Your shopping list is empty. Choose components to purchase.</p>
                  </div>
                ) : (
                  <>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-1">Selected Components</h4>
                    {cart.map((item) => (
                      <div key={item.part.id} className="flex gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <img
                          src={item.part.image}
                          alt={item.part.name}
                          className="w-16 h-16 object-cover rounded-md"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(item.part.sku)}/100/100`;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-slate-900 text-xs truncate">{item.part.name}</h5>
                          <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded border border-sky-100 inline-block mt-1 font-mono">
                            OEM: {item.part.oemNumber}
                          </span>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-slate-900 text-xs font-black">
                              ${item.part.price.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-2 bg-white border rounded">
                              <button
                                onClick={() => handleUpdateCartQty(item.part.id, -1)}
                                className="p-1 hover:bg-slate-100 text-slate-600"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-bold px-1">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateCartQty(item.part.id, 1)}
                                className="p-1 hover:bg-slate-100 text-slate-600"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveFromCart(item.part.id)}
                              className="p-1 text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Integrated 3PL Logistics API Rates Calculator */}
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-orange-600 animate-pulse" />
                        <h4 className="text-xs font-bold text-slate-900">3PL Carrier & Direct Rate API Integration</h4>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-normal">
                        Shipment options dynamically compute live dispatch estimates based on total package weights ({cartWeight} lbs).
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'UPS Ground', name: 'UPS Ground', speed: '3-5 Days', desc: 'Standard parcel rate' },
                          { id: 'FedEx SuperSaver', name: 'FedEx Direct', speed: '2-3 Days', desc: 'Expedited air courier' },
                          { id: 'DHL Worldwide', name: 'DHL Express', speed: 'Next Jet', desc: 'Overseas priority cargo' },
                          { id: 'Freight Express', name: 'FLT Freight', speed: '3-7 Days', desc: 'Truck Liftgate Required' },
                        ].map((carrier) => {
                          const charge = getShippingCharges(carrier.id, cartWeight);
                          return (
                            <button
                              key={carrier.id}
                              type="button"
                              onClick={() => setSelectedCarrier(carrier.id as any)}
                              className={`p-2 rounded-lg border text-left transition-all ${
                                selectedCarrier === carrier.id
                                  ? 'bg-orange-600 text-white border-transparent'
                                  : 'bg-white text-slate-800 border-slate-200 hover:bg-orange-50/50'
                              }`}
                            >
                              <div className="font-bold text-xs flex justify-between">
                                <span className="truncate">{carrier.name}</span>
                                <span className={selectedCarrier === carrier.id ? 'text-white' : 'text-slate-900'}>
                                  ${charge}
                                </span>
                              </div>
                              <p className={`text-[9px] ${selectedCarrier === carrier.id ? 'text-orange-200' : 'text-slate-400'}`}>
                                {carrier.speed} • {carrier.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Customer Shipping Setup Details */}
                    <form onSubmit={handleCheckoutSubmit} className="space-y-2 pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1">Shipping Destination Details</h4>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block">Full Name</label>
                        <input
                          type="text"
                          required
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          placeholder="e.g. David Jenkins"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block">Email address</label>
                          <input
                            type="email"
                            required
                            value={checkoutEmail}
                            onChange={(e) => setCheckoutEmail(e.target.value)}
                            placeholder="jenkins@outlook.com"
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block">Phone number</label>
                          <input
                            type="tel"
                            required
                            value={checkoutPhone}
                            onChange={(e) => setCheckoutPhone(e.target.value)}
                            placeholder="(512) 555-9821"
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block">Delivery Address Docs</label>
                        <textarea
                          rows={2}
                          required
                          value={checkoutAddress}
                          onChange={(e) => setCheckoutAddress(e.target.value)}
                          placeholder="e.g. 104 West San Saba St, Austin, TX 78701"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white focus:outline-none resize-none"
                        />
                      </div>

                      {/* Receipt Calculator */}
                      <div className="bg-slate-100 rounded-lg p-3 space-y-1.5 text-xs font-mono text-slate-700 mt-4">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-bold">${cartSubtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>3PL Weight:</span>
                          <span>{cartWeight} lbs</span>
                        </div>
                        <div className="flex justify-between">
                          <span>3PL API Route ({selectedCarrier}):</span>
                          <span className="font-bold">${cartShippingFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>TX Tax (8.25%):</span>
                          <span>${cartTax}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-1.5 text-slate-900 font-bold">
                          <span>TOTAL DUE:</span>
                          <span>${cartTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow transition mt-4"
                      >
                        Authorize Payment & Create Lead Profile
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedPart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPart(null)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 max-w-3xl mx-auto h-[90vh] my-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row"
            >
              {/* Product Left Img */}
              <div className="md:w-1/2 relative bg-slate-950">
                <img
                  src={selectedPart.image}
                  alt={selectedPart.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(selectedPart.sku)}/600/600`;
                  }}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedPart(null)}
                  className="absolute top-4 left-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 md:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Right Details */}
              <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto w-full">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-orange-600 font-black font-mono tracking-widest uppercase bg-orange-50 border border-orange-200/50 px-2.5 py-1 rounded">
                      {selectedPart.condition}
                    </span>
                    <button
                      onClick={() => setSelectedPart(null)}
                      className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hidden md:block"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {selectedPart.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 font-mono text-[10px] text-slate-500">
                      <span>Brand: <strong className="text-slate-950 font-semibold">{selectedPart.brand}</strong></span>
                      <span>OEM #: <strong className="text-slate-950 font-semibold">{selectedPart.oemNumber}</strong></span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <p className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider mb-1 font-mono">Specification Details</p>
                    {selectedPart.description}
                  </div>

                  {/* Fitment Specifications */}
                  <div className="space-y-1 bg-sky-50 border border-sky-100 p-3 rounded-lg text-xs text-sky-950">
                    <h5 className="font-bold flex items-center gap-1">
                      <Shield className="w-4 h-4 text-sky-700" /> Complex Fitment Matrix:
                    </h5>
                    <p className="mt-1">
                      Makes: {selectedPart.fitment.make}
                    </p>
                    <p>
                      Models: {selectedPart.fitment.models.join(', ')}
                    </p>
                    <p>
                      Cylinder Year Span: {selectedPart.fitment.yearStart} - {selectedPart.fitment.yearEnd}
                    </p>
                    {selectedPart.fitment.engines && (
                      <p>
                        Motors: {selectedPart.fitment.engines.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Physical Warehouse Tracking */}
                  <div className="text-xs text-slate-500 grid grid-cols-2 gap-2 border-t pt-3">
                    <div className="bg-slate-50 p-2 rounded">
                      <span className="block text-[9px] uppercase tracking-wider font-semibold">Warehouse Location</span>
                      <strong className="text-slate-900 text-[11px] font-mono">{selectedPart.warehouseLocation}</strong>
                    </div>
                    <div className="bg-slate-50 p-2 rounded">
                      <span className="block text-[9px] uppercase tracking-wider font-semibold">Consignment Weight</span>
                      <strong className="text-slate-900 text-[11px] font-mono">{selectedPart.weightLbs} lbs</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Direct Checkout Price</span>
                    <strong className="text-2xl font-black text-slate-900">
                      ${selectedPart.price.toLocaleString()}
                    </strong>
                  </div>
                  <button
                    onClick={() => {
                      handleAddToCart(selectedPart);
                      setSelectedPart(null);
                    }}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition shadow"
                  >
                    Add to Cart & Verify Shipping
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Web Chat Simulator Widget (Integrated Support Tools) */}
      <div className="fixed bottom-4 right-4 z-40">
        <AnimatePresence>
          {isChatOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col mb-2.5"
            >
              {/* Widget Header */}
              <div className="bg-slate-900 p-3.5 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
                  <div>
                    <h4 className="font-bold text-xs">Turbo Live Support Desk</h4>
                    <span className="text-[9px] text-slate-400">Response time: &lt; 2 mins</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Widget Body */}
              <div className="p-4 space-y-3 max-h-80 overflow-y-auto bg-slate-50">
                {chatSubmitSuccess ? (
                  <div className="text-center py-4 space-y-2">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                    <h5 className="font-bold text-slate-900 text-xs">Message Received!</h5>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Your query has been piped to our active Admin Hub. A support specialist has registered Ticket #{Math.floor(100+Math.random()*900)} and is reviewing your transmission dimensions.
                    </p>
                    <button
                      onClick={() => setChatSubmitSuccess(false)}
                      className="text-[10px] text-orange-600 font-semibold underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSupportSubmit} className="space-y-2.5 text-xs">
                    <p className="text-[10px] text-slate-500 leading-normal mb-1">
                      Have questions regarding transmission gears or alternator fitments? Send an inquiry directly to the Admin dashboard.
                    </p>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Your Name</label>
                      <input
                        type="text"
                        required
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Email address</label>
                      <input
                        type="email"
                        required
                        value={chatEmail}
                        onChange={(e) => setChatEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Specifications or fitting Question</label>
                      <textarea
                        rows={3}
                        required
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Does the TR690 fit my JDM 2014 block?"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit to Admin Desk
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <button
          id="open-live-chat-btn"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-105"
          aria-label="Toggle Live Assist"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Footer */}
      <footer id="ecommerce-footer" className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-white text-sm">TurboAutoparts LLC</p>
            <p className="text-[11px] mt-1 space-x-2">
              <span>Direct Logistics API Integrated</span> • <span>LendingUSA Financing Core</span> • <span>2-Year Warranty Guarantees</span>
            </p>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal max-w-sm">
            Mock e-commerce workspace for live testing and development synchronization. 3PL courier rates, inventory logs and tracking statuses are generated in real-time.
          </p>
        </div>
      </footer>
    </div>
  );
}
