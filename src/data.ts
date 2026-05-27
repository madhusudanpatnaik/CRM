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
} from './types';

export const INITIAL_PARTS: Part[] = [
  {
    id: 'p1',
    sku: 'SUB-TX-TR690',
    name: 'SUBARU TR690 CVT Automatic Transmission',
    category: 'Transmission',
    condition: 'OEM Remanufactured',
    price: 3250,
    cost: 1600,
    stock: 4,
    warehouseLocation: 'Row 3, Aisle B, Shelf 1',
    fitment: {
      yearStart: 2012,
      yearEnd: 2020,
      make: 'Subaru',
      models: ['Outback', 'Legacy', 'Crosstrek', 'Forester'],
      engines: ['2.5L H4', '3.6L H6'],
    },
    description: 'Fully dyno-tested and remanufactured TR690 CVT Transmission. Includes upgraded valve body, new heavy-duty fluid, and a 2-year warranty.',
    image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=600&auto=format&fit=crop',
    oemNumber: '31000AJ270',
    brand: 'Subaru OEM',
    weightLbs: 220,
  },
  {
    id: 'p2',
    sku: 'FOR-EN-50L',
    name: 'Coyote 5.0L DOHC V8 Crate Engine',
    category: 'Engine',
    condition: 'New',
    price: 7999,
    cost: 4500,
    stock: 2,
    warehouseLocation: 'Engine Bay 1, Grid A',
    fitment: {
      yearStart: 2011,
      yearEnd: 2024,
      make: 'Ford',
      models: ['F-150', 'Mustang GT'],
      engines: ['5.0L V8'],
    },
    description: 'Brand new Gen-3 Coyote 5.0L DOHC V8 engine assembly. Delivering 460 HP direct from Ford Performance. Ideal replacement or resto-mod swap.',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop',
    oemNumber: 'M-6007-M50C',
    brand: 'Ford Performance',
    weightLbs: 445,
  },
  {
    id: 'p3',
    sku: 'TOY-BR-R424',
    name: 'Front Ceramic Performance Brake Kit',
    category: 'Brakes',
    condition: 'New',
    price: 289,
    cost: 110,
    stock: 15,
    warehouseLocation: 'Row 12, Aisle D, Shelf 4',
    fitment: {
      yearStart: 2015,
      yearEnd: 2024,
      make: 'Toyota',
      models: ['Camry', 'Avalon', 'RAV4'],
      engines: ['2.5L I4', '3.5L V6'],
    },
    description: 'Premium carbon-fiber ceramic brake pads paired with cross-drilled and slotted silver zinc rotors for ultimate heat dissipation.',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop',
    oemNumber: 'TOY-4465-06100',
    brand: 'PowerStop Auto',
    weightLbs: 38,
  },
  {
    id: 'p4',
    sku: 'BMW-AL-VAL4B',
    name: '180A High-Output OEM Alternator',
    category: 'Electrical',
    condition: 'Used - Grade A',
    price: 450,
    cost: 180,
    stock: 8,
    warehouseLocation: 'Row 7, Aisle A, Shelf 2',
    fitment: {
      yearStart: 2013,
      yearEnd: 2019,
      make: 'BMW',
      models: ['3-Series', '5-Series', 'X3', '4-Series'],
      engines: ['2.0L TwinPower Turbo', '3.0L TwinPower Turbo'],
    },
    description: 'Tested Grade A salvaged 180 Amp alternator. Thoroughly inspected for brush wear and voltage regulation. Perfectly reliable drop-in.',
    image: 'https://images.unsplash.com/photo-1563201374-129b09337ff4?q=80&w=600&auto=format&fit=crop',
    oemNumber: '12317604782',
    brand: 'Valeo Automotive',
    weightLbs: 14,
  },
  {
    id: 'p5',
    sku: 'HON-SU-TEINX',
    name: 'Tein Street Advance Z Adjustable Coilover Kit',
    category: 'Suspension',
    condition: 'New',
    price: 840,
    cost: 520,
    stock: 5,
    warehouseLocation: 'Row 14, Aisle C, Shelf 3',
    fitment: {
      yearStart: 2016,
      yearEnd: 2022,
      make: 'Honda',
      models: ['Civic', 'Civic Type-R', 'Accord'],
      engines: ['1.5T I4', '2.0T I4'],
    },
    description: 'High-performance ride-height and 16-level damping adjustable coilovers. Perfect mixture of aggressive street carving and daily comfort.',
    image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=600&auto=format&fit=crop',
    oemNumber: 'GSH88-91AS2',
    brand: 'Tein Japan',
    weightLbs: 55,
  },
  {
    id: 'p6',
    sku: 'CHE-HD-L8R',
    name: 'Custom Smoked Sequential LED Headlight Assembly',
    category: 'Electrical',
    condition: 'New',
    price: 675,
    cost: 310,
    stock: 6,
    warehouseLocation: 'Row 9, Aisle B, Shelf 5',
    fitment: {
      yearStart: 2014,
      yearEnd: 2019,
      make: 'Chevrolet',
      models: ['Corvette', 'Silverado 1500'],
      engines: ['6.2L V8', '5.3L V8'],
    },
    description: 'Sleek, high-intensity LED headlights with startup sequence animations and sequential amber turn signals. Polycarbonate lenses.',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop',
    oemNumber: 'GM-2311-HL92',
    brand: 'Anzo USA',
    weightLbs: 22,
  },
  {
    id: 'p7',
    sku: 'SUB-EN-EJ255',
    name: 'EJ255 2.5L Turbocharged Engine Block',
    category: 'Engine',
    condition: 'Used - Grade A',
    price: 3400,
    cost: 1500,
    stock: 1,
    warehouseLocation: 'Engine Bay 2, Grid C',
    fitment: {
      yearStart: 2006,
      yearEnd: 2014,
      make: 'Subaru',
      models: ['WRX', 'Forester XT', 'Legacy GT'],
      engines: ['2.5L H4 Turbo'],
    },
    description: 'Inspected Grade A ej255 engine block. Compression tested at 145/145/140/140 psi. Perfect core for a direct OEM replacement or engine rebuild.',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop',
    oemNumber: '10103AB910',
    brand: 'Subaru OEM Salvage',
    weightLbs: 280,
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'L011',
    name: 'David Jenkins',
    email: 'djenkins@outlook.com',
    phone: '(512) 555-9821',
    partRequested: 'SUBARU TR690 CVT Automatic Transmission',
    vehicle: {
      year: 2015,
      make: 'Subaru',
      model: 'Outback',
      engineSize: '2.5L H4',
    },
    status: 'Follow Up',
    type: 'Phone Call',
    owner: 'Joe Miller',
    soldAmount: 3250,
    cardAmount: 1250,
    loanAmount: 2000,
    refundAmount: 0,
    chargebackAmount: 0,
    createdAt: '2026-05-24T10:15:00Z',
    notes: [
      {
        id: 'n1',
        author: 'Joe Miller',
        content: 'Customer is interested in financing. He wants to put down $1,250 on his Discover Card, and split the remaining $2,000 via a LendingUSA loan. He called to confirm fitment with his 2015 Outback 2.5L.',
        createdAt: '2026-05-24T10:30:00Z',
      },
      {
        id: 'n2',
        author: 'Joe Miller',
        content: 'Fitment verified. Transmitted TR690 specification sheets. Following up tomorrow for his credit authorization results.',
        createdAt: '2026-05-24T15:45:00Z',
      },
    ],
  },
  {
    id: 'L012',
    name: 'Marcus Vance',
    email: 'marcus.vance@gmail.com',
    phone: '(415) 332-9011',
    partRequested: 'Coyote 5.0L DOHC V8 Crate Engine',
    vehicle: {
      year: 2018,
      make: 'Ford',
      model: 'Mustang GT',
      engineSize: '5.0L V8',
    },
    status: 'Sold',
    type: 'Web Query',
    owner: 'Sarah Clark',
    soldAmount: 7999,
    cardAmount: 7999,
    loanAmount: 0,
    refundAmount: 0,
    chargebackAmount: 0,
    createdAt: '2026-05-25T08:30:00Z',
    notes: [
      {
        id: 'n3',
        author: 'Sarah Clark',
        content: 'Web lead came through checkout for the 5.0L Coyote Crate Engine. Credit card cleared successfully. Passed to shipping dept.',
        createdAt: '2026-05-25T08:32:00Z',
      },
      {
        id: 'n4',
        author: 'System',
        content: 'Order created for Marcus Vance. Item SUB-TX-FOR-EN-50L allocated. Tracking generated: 1Z99A9999999999999',
        createdAt: '2026-05-25T08:35:00Z',
        isSystem: true,
      },
    ],
  },
  {
    id: 'L013',
    name: 'Jessica Vance',
    email: 'jess.vance77@yahoo.com',
    phone: '(305) 555-4423',
    partRequested: 'EJ255 2.5L Turbocharged Engine Block',
    vehicle: {
      year: 2008,
      make: 'Subaru',
      model: 'WRX',
      engineSize: '2.5L H4 Turbo',
    },
    status: 'Quotation Given',
    type: 'Live Chat',
    owner: 'Joe Miller',
    createdAt: '2026-05-26T14:20:00Z',
    notes: [
      {
        id: 'n5',
        author: 'Joe Miller',
        content: 'Offered the EJ255 engine core for $3,200 shipped if she commits by Friday. She is checking if her mechanic can reuse her intake manifold.',
        createdAt: '2026-05-26T14:40:00Z',
      },
    ],
  },
  {
    id: 'L014',
    name: 'Robert Stark',
    email: 'robert@starkindustries.com',
    phone: '(212) 555-0101',
    partRequested: 'Custom Smoked Sequential LED Headlight Assembly',
    vehicle: {
      year: 2017,
      make: 'Chevrolet',
      model: 'Corvette',
      engineSize: '6.2L V8',
    },
    status: 'Fresh Lead',
    type: 'Web Query',
    owner: 'Unassigned',
    createdAt: '2026-05-27T02:11:00Z',
    notes: [
      {
        id: 'n6',
        author: 'System',
        content: 'Inquired from web catalog about sequential animations on corvette. Is it street legal in California?',
        createdAt: '2026-05-27T02:11:00Z',
        isSystem: true,
      },
    ],
  },
  {
    id: 'L015',
    name: 'Aiden Brooks',
    email: 'abrooks_fake@scammeralert.corp',
    phone: '(917) 555-5201',
    partRequested: '180A High-Output OEM Alternator',
    vehicle: {
      year: 2016,
      make: 'BMW',
      model: '3-Series',
      engineSize: '3.0L twin turbo',
    },
    status: 'Need More Info',
    type: 'Phone Call',
    owner: 'Sarah Clark',
    createdAt: '2026-05-20T11:00:00Z',
    notes: [
      {
        id: 'n7',
        author: 'Sarah Clark',
        content: 'SCAMMER ALERT - Tried to supply invalid billing zipcode 3 times over phone. Using a VoIP burner number. Keep on hold, DO NOT release goods without certified bank wire!',
        createdAt: '2026-05-20T11:20:00Z',
      },
    ],
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'TX-1002',
    customerName: 'Marcus Vance',
    amount: 7999,
    status: 'Success',
    source: 'Card',
    date: '2026-05-25T08:32:00Z',
    reference: 'Visa ending 4242',
  },
  {
    id: 'TX-1003',
    customerName: 'David Jenkins',
    amount: 1250,
    status: 'Success',
    source: 'Card',
    date: '2026-05-24T10:30:00Z',
    reference: 'Discover ending 1121',
  },
  {
    id: 'TX-1004',
    customerName: 'David Jenkins',
    amount: 2000,
    status: 'Pending',
    source: 'Loan/Financing',
    date: '2026-05-24T10:35:00Z',
    reference: 'LendingUSA #L-55928',
  },
  {
    id: 'TX-1005',
    customerName: 'Fake Customer (Aiden Brooks)',
    amount: 450,
    status: 'Failed',
    source: 'Card',
    date: '2026-05-20T11:15:00Z',
    reference: 'Declined - Zip Code Mismatch',
  }
];

export const INITIAL_PHONE_LOGS: PhoneLog[] = [
  {
    id: 'PL-301',
    agentName: 'Joe Miller',
    customerName: 'David Jenkins',
    phoneNumber: '(512) 555-9821',
    durationSeconds: 345,
    direction: 'Inbound',
    timestamp: '2026-05-24T10:15:00Z',
    recordingUrl: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
    transcription: "Agent Joe: Thank you for calling TurboAutoparts, this is Joe. David Jenkins: Hey, I see the TR690 transmission in stock. Can we do partial card and partial financing? Joe: Absolutely! We can do $1,250 on a card and finance the balance over 12 months.",
  },
  {
    id: 'PL-302',
    agentName: 'Sarah Clark',
    customerName: 'Aiden Brooks',
    phoneNumber: '(917) 555-5201',
    durationSeconds: 110,
    direction: 'Inbound',
    timestamp: '2026-05-20T11:00:00Z',
    recordingUrl: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
    transcription: "Agent Sarah: TurboAutoparts sales, this is Sarah. Aiden: Yeah, trying to buy the BMW alternator. Can you run this card? Sarah: What is the billing zip? Aiden: Uh, 90210. No, wait, 10001.",
  }
];

export const INITIAL_PURCHASES: PurchaseOffer[] = [
  {
    id: 'PO-901',
    supplierName: 'Dallas Auto Salvage Yard',
    partDetails: 'Used 2017 Civic Type R 2.0L Engine Core',
    priceRequested: 1800,
    status: 'Approved',
    createdAt: '2026-05-23T09:40:00Z',
  },
  {
    id: 'PO-902',
    supplierName: 'Copart Scrap Broker',
    partDetails: 'Lot of 3x Subaru TR690 Transmissions (Slight Damage)',
    priceRequested: 2200,
    status: 'Pending',
    createdAt: '2026-05-26T16:00:00Z',
  }
];

export const INITIAL_AGENTS: UserAgent[] = [
  { id: 'u1', name: 'Joe Miller', role: 'Agent', email: 'joe@turboautoparts.com', commissionRate: 0.05, status: 'Active' },
  { id: 'u2', name: 'Sarah Clark', role: 'Agent', email: 'sarah@turboautoparts.com', commissionRate: 0.05, status: 'Active' },
  { id: 'u3', name: 'Mark Gable', role: 'Sales Manager', email: 'mark@turboautoparts.com', commissionRate: 0.08, status: 'Active' },
  { id: 'u4', name: 'Brenda Wu', role: 'Inventory Specialist', email: 'brenda@turboautoparts.com', commissionRate: 0.0, status: 'Offline' },
];

export const INITIAL_TASKS: AgentTask[] = [
  { id: 'KT-301', title: 'Verify Jenkins Financing Status', description: 'Check LendingUSA admin panel to see if David Jenkins’ loan has been officially signed and pre-funded.', assignedTo: 'Joe Miller', dueDate: '2026-05-28', status: 'Pending', priority: 'High' },
  { id: 'KT-302', title: 'Double Check Coyote Engine Dimensions', description: 'Confirm with warehouse if PO-901 engine fits standard pallet dimensions before freight dispatch on F150 crated engine.', assignedTo: 'Brenda Wu', dueDate: '2026-05-29', status: 'In Progress', priority: 'Medium' },
  { id: 'KT-303', title: 'Reply to BBB Review on alternators', description: 'Reach back out to the customer who complained about a bracket scratching on install.', assignedTo: 'Joe Miller', dueDate: '2026-05-30', status: 'Pending', priority: 'Low' },
];

export const INITIAL_MAILS: CrmMail[] = [
  {
    id: 'em-1',
    from: 'djenkins@outlook.com',
    to: 'joe@turboautoparts.com',
    subject: 'Re: Subaru transmission Quote #SUB-30292',
    body: 'Hi Joe, my mechanic confirmed they can install this TR690 CVT next Thursday. Can you guarantee the 2-year warranty certificate is physically printed in the box? Thanks, David.',
    timestamp: '2026-05-25T11:04:00Z',
    isRead: false,
    folder: 'Inbox',
  },
  {
    id: 'em-2',
    from: 'joe@turboautoparts.com',
    to: 'djenkins@outlook.com',
    subject: 'Subaru transmission Quote #SUB-30292',
    body: 'Hi David, Yes, the 2-year warranty certificate is included and serialized to matching gearbox TR690-31000AJ270. Let me know when you approve.',
    timestamp: '2026-05-24T14:30:00Z',
    isRead: true,
    folder: 'Sent',
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-221',
    customerName: 'Gregory Finch',
    email: 'finchy50@gmail.com',
    subject: 'Brake kit bracket missing a shim',
    message: 'I purchased the ceramic brake kit and my mechanic tells me he is missing one of the steel backing shims. Can you priority mail one today?',
    status: 'In Progress',
    createdAt: '2026-05-26T08:00:00Z',
    chatHistory: [
      { sender: 'customer', message: 'I purchased the ceramic brake kit and my mechanic tells me he is missing one of the steel backing shims. Can you priority mail one today?', timestamp: '2026-05-26T08:00:00Z' },
      { sender: 'agent', message: 'Hello Gregory! No worries, I am dispatching a hardware shim pack from our Row 12 inventory via USPS First Class today.', timestamp: '2026-05-26T10:15:00Z' }
    ]
  },
  {
    id: 'TCK-222',
    customerName: 'Lana Del Ray',
    email: 'lana@delray.org',
    subject: 'Coyote engine tracking broken',
    message: 'The logistics tracking link tells me "Shipping Label Created" but hasn\'t updated in 2 days. Is my V8 actually on the truck?',
    status: 'Open',
    createdAt: '2026-05-27T10:00:00Z',
    chatHistory: [
      { sender: 'customer', message: 'The logistics tracking link tells me "Shipping Label Created" but hasn\'t updated in 2 days. Is my V8 actually on the truck?', timestamp: '2026-05-27T10:00:00Z' }
    ]
  }
];

export const INITIAL_ORDERS: PartOrder[] = [
  {
    id: 'ORD-8812',
    partId: 'p2',
    partName: 'Coyote 5.0L DOHC V8 Crate Engine',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@gmail.com',
    customerPhone: '(415) 332-9011',
    shippingAddress: '422 Golden Gate Ave, San Francisco, CA 94102',
    totalAmount: 8149, // includes rate of freight
    paymentStatus: 'Success',
    orderDate: '2026-05-25T08:35:00Z',
    logistics: {
      provider: 'Freight Express',
      rate: 150,
      trackingNumber: 'F1-5542-882-FT',
      status: 'In Transit',
      logs: [
        { status: 'Order Placed', timestamp: '2026-05-25T08:35:00Z', location: 'System checkout' },
        { status: 'Warehouse Picked', timestamp: '2026-05-26T10:00:00Z', location: 'Dallas Hub (Bay 1)' },
        { status: 'In Transit', timestamp: '2026-05-26T14:30:00Z', location: 'Departed Dallas Terminal 4' }
      ]
    }
  },
  {
    id: 'ORD-8813',
    partId: 'p3',
    partName: 'Front Ceramic Performance Brake Kit',
    customerName: 'Tyler Simpson',
    customerEmail: 'tylers@gmail.com',
    customerPhone: '(650) 555-8912',
    shippingAddress: '120 Hawthorne St, Palo Alto, CA 94301',
    totalAmount: 314, // rotor + UPS Ground rate
    paymentStatus: 'Success',
    orderDate: '2026-05-26T19:40:00Z',
    logistics: {
      provider: 'UPS Ground',
      rate: 25,
      trackingNumber: '1Z99A9999999999999',
      status: 'Warehouse Picked',
      logs: [
        { status: 'Order Placed', timestamp: '2026-05-26T19:40:00Z', location: 'System checkout' },
        { status: 'Warehouse Picked', timestamp: '2026-05-27T08:15:00Z', location: 'Dallas Hub (Row 12)' }
      ]
    }
  }
];

export const INITIAL_TRAINING: TrainingMaterial[] = [
  {
    id: 'tr-1',
    title: 'Selling Rebuilt Transmissions',
    category: 'Sales Scripts',
    content: 'Always emphasize our 2-Year serialized warranty first. Remind customers that a reliable remanufactured CVT is far superior to buying a risky $1,200 scrap-yard unit with unknown mileage. Overcome price shock by offering split financing (e.g., LendingUSA integration) which breaks down a $3,250 purchase into easy $120/month payments. Highlight that we perform pressure and gear dyno checks on every build.'
  },
  {
    id: 'tr-2',
    title: 'Handling Scammer Flag Signals',
    category: 'Objection Handling',
    content: 'When customers refuse to provide matching billing zipcodes or insist on using overnight delivery to unverified industrial sites, suspect cargo forwarding or credit card fraud. Immediately block the lead owner from updating status to "Sold" alone, require a Sales Manager to sign off on a wire transfer. Standard pitch: "For heavy core components over $1,500 shipping outside our standard zone, our freight team requires bank wires or physical pre-authorization."'
  },
  {
    id: 'tr-3',
    title: 'Understanding Multi-Model Fitment',
    category: 'Technical Parts Info',
    content: 'Subaru TR580 and TR690 CVTs have completely distinct clutch and cooling configurations. The TR690 is heavy-duty and operates with the 2.4T/2.5L and 3.6L models, while the TR580 is used on smaller naturally aspirated Forester/Impreza 2.0L cars. Always inspect the transmission casing OEM stamp! Matching just model year is not enough.'
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Marcus Vance',
    partName: 'Coyote 5.0L DOHC V8 Crate Engine',
    rating: 5,
    comment: 'Unbelievable product. Direct from Ford, delivered packaged perfectly inside a heavy wooden crate via Freight. Direct swap was flawless. Real-time updates let me coordinate the engine crane delivery.',
    status: 'Approved',
    replyContent: 'Thank you Marcus! Enjoy the performance boost on that Mustang GT!',
    createdAt: '2026-05-26T18:00:00Z'
  },
  {
    id: 'rev-2',
    customerName: 'Harold G.',
    partName: 'SUBARU TR690 CVT Automatic Transmission',
    rating: 4,
    comment: 'Smooth shifted again! Outback no longer stalls or chains of death. Rebuilt quality seems high, but the shipping carrier missed the delivery window by 1 day because they required a liftgate.',
    status: 'Pending',
    createdAt: '2026-05-27T12:00:00Z'
  }
];
