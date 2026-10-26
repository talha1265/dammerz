import { neon } from '@neondatabase/serverless';
import { 
  Business, 
  Employee, 
  SalesLead, 
  ManagerReport, 
  AICall, 
  WhatsAppMessage, 
  SubscriptionTier, 
  AdminStats,
  Bill,
  MarketingConnector,
  BusinessResearch,
  StaffRoleCategory,
  InventoryItem,
  AttendanceRecord,
  TeamChatMessage,
  MetaAdAccount,
  MetaAdCampaign,
  MetaAdVariation,
  MetaVideoCreative,
  MetaAIOptimizationRule,
  MetaAdLead,
  MetaAIOptimizationLog
} from './types';
import { processOpsChatMessage } from './gemini';
import { hashPassword, verifyPassword } from './auth';

const getDatabaseUrl = () => {
  return process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || '';
};

const getSql = () => {
  const url = getDatabaseUrl();
  if (!url) return null;
  return neon(url);
};

// Initial in-memory mock businesses
let inMemoryBusinesses: Business[] = [
  {
    id: 'biz_apex_industries',
    name: 'Apex Industrial & Engineering Solutions',
    category: 'Industrial Manufacturing & Tenders',
    phone: '+91 98765 43210',
    email: 'operations@apexindustrial.in',
    whatsappNumber: '+91 98765 43210',
    gstNumber: '07AAACA1234F1Z8',
    address: 'Plot 42, Udyog Vihar Phase 4, Gurugram, Haryana',
    status: 'active',
    subscriptionTier: 'premium',
    catalogSize: 142,
    monthlyQuota: {
      whatsappMessages: 25000,
      whatsappMessagesUsed: 4210,
      aiCalls: 500,
      aiCallsUsed: 84,
      managerReports: 300,
      managerReportsUsed: 49,
    },
    createdAt: '2026-02-15T08:00:00Z',
  },
  {
    id: 'biz_bharat_valves',
    name: 'Bharat Electro-Tech & Valve Works',
    category: 'Industrial Valves & Flow Controls',
    phone: '+91 98100 55443',
    email: 'contact@bharatvalves.com',
    whatsappNumber: '+91 98100 55443',
    gstNumber: '27AABCB9876Q1Z2',
    address: 'MIDC Industrial Estate, Bhosari, Pune, Maharashtra',
    status: 'active',
    subscriptionTier: 'growth',
    catalogSize: 85,
    monthlyQuota: {
      whatsappMessages: 5000,
      whatsappMessagesUsed: 1840,
      aiCalls: 50,
      aiCallsUsed: 0,
      managerReports: 150,
      managerReportsUsed: 22,
    },
    createdAt: '2026-02-28T11:20:00Z',
  },
];

// Initial Staff Roster with Hierarchical Roles (Owner, Project Managers, Site Managers, Site Engineers, Supervisors, Workers)
let inMemoryEmployees: Employee[] = [
  {
    id: 'emp_owner_1',
    businessId: 'biz_apex_industries',
    name: 'Rajiv Mehra',
    role: 'Managing Director & Business Owner',
    roleCategory: 'business_owner',
    siteName: 'Corporate Headquarters, Gurugram',
    phone: '+91 98765 43210',
    staffId: 'OWNR-CORP-101',
    password: 'owner_pass_77',
    status: 'active',
    currentLocation: 'Corporate HQ, Gurugram',
    lastUpdate: 'Active Now',
    lastReportNote: 'Executive oversight across all active tender sites & accounts.',
    assignedTasks: 8,
    projectTender: 'All Active Projects & Tenders',
    tenderCode: 'ALL-TNDR',
    assignedBy: 'System SuperAdmin',
    monthlySalary: 250000,
    dailyWageRate: 8500,
    workingHoursToday: 9.0,
    overtimeHoursToday: 0,
    totalHoursMonth: 180,
    salaryStatus: 'paid',
  },
  {
    id: 'emp_pm_1',
    businessId: 'biz_apex_industries',
    name: 'Rajesh Khanna',
    role: 'Senior Project Manager',
    roleCategory: 'project_manager',
    siteName: 'Sector 62 Metro Depot Site, Noida',
    phone: '+91 98201 11223',
    staffId: 'PM-METRO-401',
    password: 'pass_pm_2026',
    status: 'on_site',
    currentLocation: 'Sector 62 Metro Depot Site, Noida',
    lastUpdate: '10 mins ago via Dashboard',
    lastReportNote: 'Inspecting pier cap casting and girder alignment on Pier 14.',
    assignedTasks: 6,
    projectTender: 'Metro Rail Phase 4 - Tender #MR-402',
    tenderCode: 'TNDR-MR-402',
    reportingManagerName: 'Rajiv Mehra (Business Owner)',
    reportingManagerId: 'emp_owner_1',
    assignedBy: 'Rajiv Mehra (Business Owner)',
    monthlySalary: 95000,
    dailyWageRate: 3800,
    overtimeRate: 350,
    workingHoursToday: 8.5,
    overtimeHoursToday: 1.0,
    totalHoursMonth: 178,
    salaryStatus: 'approved',
  },
  {
    id: 'emp_sm_1',
    businessId: 'biz_apex_industries',
    name: 'Arvind Verma',
    role: 'Site Construction Manager',
    roleCategory: 'site_manager',
    siteName: 'Sector 62 Metro Depot Site, Noida',
    phone: '+91 98110 33445',
    staffId: 'SM-METRO-402',
    password: 'pass_sm_442',
    status: 'on_site',
    currentLocation: 'Sector 62 Metro Depot Site, Noida',
    lastUpdate: '25 mins ago via WhatsApp',
    lastReportNote: 'Coordinating batching plant raw material logistics & cement intake.',
    assignedTasks: 5,
    projectTender: 'Metro Rail Phase 4 - Tender #MR-402',
    tenderCode: 'TNDR-MR-402',
    reportingManagerName: 'Rajesh Khanna (Senior Project Manager)',
    reportingManagerId: 'emp_pm_1',
    assignedBy: 'Rajesh Khanna (Senior Project Manager)',
    monthlySalary: 75000,
    dailyWageRate: 3000,
    overtimeRate: 250,
    workingHoursToday: 9.0,
    overtimeHoursToday: 1.0,
    totalHoursMonth: 182,
    salaryStatus: 'approved',
  },
  {
    id: 'emp_eng_1',
    businessId: 'biz_apex_industries',
    name: 'Vikram Sharma',
    role: 'Senior Site Project Engineer',
    roleCategory: 'site_engineer',
    siteName: 'Sector 62 Metro Depot Site, Noida',
    phone: '+91 98111 22334',
    staffId: 'ENG-NOIDA-403',
    password: 'pass_eng_981',
    status: 'on_site',
    currentLocation: 'Sector 62 Metro Depot Site, Noida',
    lastUpdate: 'Just now via Chatbot',
    lastReportNote: 'Slurry pump pressure and rebar concrete cover verified.',
    assignedTasks: 4,
    projectTender: 'Metro Rail Phase 4 - Tender #MR-402',
    tenderCode: 'TNDR-MR-402',
    reportingManagerName: 'Arvind Verma (Site Construction Manager)',
    reportingManagerId: 'emp_sm_1',
    assignedBy: 'Rajiv Mehra (Business Owner)',
    monthlySalary: 55000,
    dailyWageRate: 2200,
    overtimeRate: 200,
    workingHoursToday: 8.5,
    overtimeHoursToday: 1.5,
    totalHoursMonth: 172,
    salaryStatus: 'pending',
    skillSpecialty: 'Structural Concrete & Geotech QA',
  },
  {
    id: 'emp_sup_1',
    businessId: 'biz_apex_industries',
    name: 'Sunil Sharma',
    role: 'Site Operations Supervisor',
    roleCategory: 'site_supervisor',
    siteName: 'Sector 62 Metro Depot Site, Noida',
    phone: '+91 98112 55667',
    staffId: 'SITE-NOIDA-404',
    password: 'pass_sup_554',
    status: 'on_site',
    currentLocation: 'Sector 62 Metro Depot Site, Noida',
    lastUpdate: '15 mins ago via Portal',
    lastReportNote: '16 site workers checked in for morning shuttering & slab shift.',
    assignedTasks: 4,
    projectTender: 'Metro Rail Phase 4 - Tender #MR-402',
    tenderCode: 'TNDR-MR-402',
    reportingManagerName: 'Rajesh Khanna (Senior Project Manager)',
    reportingManagerId: 'emp_pm_1',
    assignedBy: 'Rajesh Khanna (Senior Project Manager)',
    monthlySalary: 38000,
    dailyWageRate: 1500,
    overtimeRate: 150,
    workingHoursToday: 9.5,
    overtimeHoursToday: 1.5,
    totalHoursMonth: 190,
    salaryStatus: 'approved',
    skillSpecialty: 'Labor Gang Management & Site Safety',
  },
  {
    id: 'emp_wrk_1',
    businessId: 'biz_apex_industries',
    name: 'Ramesh Patel',
    role: 'Master Mason & Shuttering Head',
    roleCategory: 'worker',
    siteName: 'Sector 62 Metro Depot Site, Noida',
    phone: '+91 97180 88991',
    staffId: 'WRK-NOIDA-405',
    password: 'pass_wrk_331',
    status: 'on_site',
    currentLocation: 'Sector 62 Metro Depot Site, Noida',
    lastUpdate: '08:45 AM',
    lastReportNote: 'Completed 45m formwork on Pier Cap 14.',
    assignedTasks: 2,
    projectTender: 'Metro Rail Phase 4 - Tender #MR-402',
    tenderCode: 'TNDR-MR-402',
    reportingManagerName: 'Sunil Sharma (Site Operations Supervisor)',
    reportingManagerId: 'emp_sup_1',
    assignedBy: 'Sunil Sharma (Site Operations Supervisor)',
    dailyWageRate: 950,
    overtimeRate: 120,
    workingHoursToday: 8.5,
    overtimeHoursToday: 1.5,
    totalHoursMonth: 184,
    salaryStatus: 'pending',
    skillSpecialty: 'Heavy Concrete Formwork & Masonry',
  },
  {
    id: 'emp_wrk_2',
    businessId: 'biz_apex_industries',
    name: 'Suresh Yadav',
    role: 'Certified High-Pressure Welder',
    roleCategory: 'worker',
    siteName: 'Sector 62 Metro Depot Site, Noida',
    phone: '+91 97180 44552',
    staffId: 'WRK-NOIDA-406',
    password: 'pass_wrk_332',
    status: 'on_site',
    currentLocation: 'Sector 62 Metro Depot Site, Noida',
    lastUpdate: '09:00 AM',
    lastReportNote: 'Welded 24 splice joints on girder brackets. NDT testing pending.',
    assignedTasks: 3,
    projectTender: 'Metro Rail Phase 4 - Tender #MR-402',
    tenderCode: 'TNDR-MR-402',
    reportingManagerName: 'Sunil Sharma (Site Operations Supervisor)',
    reportingManagerId: 'emp_sup_1',
    assignedBy: 'Rajiv Mehra (Business Owner)',
    dailyWageRate: 1100,
    overtimeRate: 140,
    workingHoursToday: 9.0,
    overtimeHoursToday: 2.0,
    totalHoursMonth: 192,
    salaryStatus: 'pending',
    skillSpecialty: 'SMAW/TIG Structural Steel Welding',
  },
  {
    id: 'emp_pm_2',
    businessId: 'biz_apex_industries',
    name: 'Vikramaditya Singh',
    role: 'Senior Project Manager',
    roleCategory: 'project_manager',
    siteName: 'IOCL Panipat Refinery Complex',
    phone: '+91 98330 99887',
    staffId: 'PM-IOCL-801',
    password: 'pass_pm_881',
    status: 'on_site',
    currentLocation: 'IOCL Panipat Refinery, Unit 4',
    lastUpdate: '1 hour ago',
    lastReportNote: 'Pipeline hydrotesting milestone scheduled for 14:00 hrs.',
    assignedTasks: 5,
    projectTender: 'IOCL Panipat Refinery - Tender #IOCL-88',
    tenderCode: 'TNDR-IOCL-88',
    reportingManagerName: 'Rajiv Mehra (Business Owner)',
    reportingManagerId: 'emp_owner_1',
    assignedBy: 'Rajiv Mehra (Business Owner)',
    monthlySalary: 98000,
    dailyWageRate: 3900,
    overtimeRate: 350,
    workingHoursToday: 8.0,
    overtimeHoursToday: 0,
    totalHoursMonth: 168,
    salaryStatus: 'approved',
  },
  {
    id: 'emp_sup_2',
    businessId: 'biz_apex_industries',
    name: 'Anil Yadav',
    role: 'Refinery Piping Supervisor',
    roleCategory: 'site_supervisor',
    siteName: 'IOCL Panipat Refinery Complex',
    phone: '+91 98330 77665',
    staffId: 'SITE-IOCL-802',
    password: 'pass_sup_882',
    status: 'on_site',
    currentLocation: 'IOCL Panipat Refinery, Unit 4',
    lastUpdate: '30 mins ago',
    lastReportNote: '8 fitters and 4 welders verified for flange torque tightening.',
    assignedTasks: 4,
    projectTender: 'IOCL Panipat Refinery - Tender #IOCL-88',
    tenderCode: 'TNDR-IOCL-88',
    reportingManagerName: 'Vikramaditya Singh (Senior Project Manager)',
    reportingManagerId: 'emp_pm_2',
    assignedBy: 'Vikramaditya Singh (Senior Project Manager)',
    monthlySalary: 42000,
    dailyWageRate: 1650,
    overtimeRate: 160,
    workingHoursToday: 8.5,
    overtimeHoursToday: 1.0,
    totalHoursMonth: 176,
    salaryStatus: 'approved',
  },
  {
    id: 'emp_wrk_3',
    businessId: 'biz_apex_industries',
    name: 'Manoj Pandit',
    role: 'Industrial Pipe Fitter',
    roleCategory: 'worker',
    siteName: 'IOCL Panipat Refinery Complex',
    phone: '+91 97180 11223',
    staffId: 'WRK-IOCL-803',
    password: 'pass_wrk_883',
    status: 'on_site',
    currentLocation: 'IOCL Panipat Refinery, Unit 4',
    lastUpdate: '08:30 AM',
    lastReportNote: 'Tightened 32 high-pressure flange bolts on Line B.',
    assignedTasks: 2,
    projectTender: 'IOCL Panipat Refinery - Tender #IOCL-88',
    tenderCode: 'TNDR-IOCL-88',
    reportingManagerName: 'Anil Yadav (Refinery Piping Supervisor)',
    reportingManagerId: 'emp_sup_2',
    assignedBy: 'Anil Yadav (Refinery Piping Supervisor)',
    dailyWageRate: 980,
    overtimeRate: 130,
    workingHoursToday: 8.0,
    overtimeHoursToday: 1.0,
    totalHoursMonth: 180,
    salaryStatus: 'pending',
    skillSpecialty: 'Class 600 Pipeline Flange Fitment',
  },
];

// Initial Invoices and Bills
let inMemoryBills: Bill[] = [
  {
    id: 'bill_1',
    businessId: 'biz_apex_industries',
    billNumber: 'INV-2026-809',
    partyName: 'Bharat Heavy Steels Ltd',
    type: 'vendor_purchase',
    amount: 450000,
    gstAmount: 81000,
    totalAmount: 531000,
    dueDate: '2026-10-30',
    status: 'pending',
    description: '30 MT Fe550D TMT Reinforcement Steel for Metro Tender #MR-402',
    siteReference: 'Sector 62 Metro Depot Site, Noida',
    createdAt: 'Today',
  },
  {
    id: 'bill_2',
    businessId: 'biz_apex_industries',
    billNumber: 'INV-2026-810',
    partyName: 'UltraTech Cement Corporation',
    type: 'vendor_purchase',
    amount: 320000,
    gstAmount: 57600,
    totalAmount: 377600,
    dueDate: '2026-11-05',
    status: 'pending',
    description: '800 Bags 53-Grade Portland Cement for Pile Cap Casting',
    siteReference: 'Sector 62 Metro Depot Site, Noida',
    createdAt: 'Yesterday',
  },
  {
    id: 'bill_3',
    businessId: 'biz_apex_industries',
    billNumber: 'INV-2026-811',
    partyName: 'Delhi Metro Rail Corporation (DMRC)',
    type: 'sale_invoice',
    amount: 1250000,
    gstAmount: 225000,
    totalAmount: 1475000,
    dueDate: '2026-11-15',
    status: 'pending',
    description: 'RA Bill #04 - Pier Cap Casting & Shuttering Milestone',
    siteReference: 'Sector 62 Metro Depot Site, Noida',
    createdAt: '3 days ago',
  },
];

// Marketing Connectors
let inMemoryConnectors: MarketingConnector[] = [
  {
    id: 'conn_1',
    businessId: 'biz_apex_industries',
    platform: 'indiamart',
    name: 'IndiaMart BuyLead Live Connector',
    status: 'connected',
    lastSynced: 'Live Webhook Ready',
    leadsIngested: 4,
    apiKeyOrGluskey: 'GLUS-LIVE-IND-8821',
    webhookUrl: '/api/leads/webhook?platform=indiamart',
  },
  {
    id: 'conn_2',
    businessId: 'biz_apex_industries',
    platform: 'google_shopping',
    name: 'Google Merchant Center / Shopping Feed',
    status: 'connected',
    lastSynced: 'Live Webhook Ready',
    leadsIngested: 2,
    apiKeyOrGluskey: 'GMC-CATALOG-FLOW',
    webhookUrl: '/api/leads/webhook?platform=google_shop',
  },
  {
    id: 'conn_3',
    businessId: 'biz_apex_industries',
    platform: 'meta_whatsapp',
    name: 'Meta WhatsApp Business Cloud API',
    status: 'connected',
    lastSynced: 'Live 24/7',
    leadsIngested: 12,
    apiKeyOrGluskey: 'WABA-CLOUD-API-LIVE',
    webhookUrl: '/api/whatsapp',
  },
];

// Business & Market Research
let inMemoryResearch: BusinessResearch[] = [];

let inMemoryLeads: SalesLead[] = [
  {
    id: 'lead_1',
    businessId: 'biz_apex_industries',
    source: 'indiamart',
    clientName: 'L&T Construction Equipment',
    phone: '+91 98200 44551',
    productName: 'Forged Carbon Steel Ball Valves DN50',
    quantity: '250 Units',
    estimatedValue: 875000,
    status: 'negotiation',
    aiScore: 92,
    notes: 'Hot buy inquiry for upcoming refinery package.',
    createdAt: 'Today',
  },
  {
    id: 'lead_2',
    businessId: 'biz_apex_industries',
    source: 'indiamart',
    clientName: 'GMR Infrastructure Delhi',
    phone: '+91 98110 99882',
    productName: 'Fe550D TMT Reinforcement Steel',
    quantity: '40 MT',
    estimatedValue: 355000,
    status: 'new',
    aiScore: 84,
    notes: 'Urgent delivery required at T3 expansion site.',
    createdAt: 'Today',
  },
];

let inMemoryReports: ManagerReport[] = [];

let inMemoryCalls: AICall[] = [];

let inMemoryWhatsAppMessages: WhatsAppMessage[] = [];

// Warehouse Inventory Items
let inMemoryInventory: InventoryItem[] = [
  {
    id: 'inv_1',
    businessId: 'biz_apex_industries',
    sku: 'CEM-53-PPC',
    name: 'Portland Pozzolana Cement 50kg Bags',
    category: 'Raw Materials',
    quantity: 650,
    unit: 'bags',
    unitPrice: 380,
    totalValue: 247000,
    warehouseLocation: 'Sector 62 Site Yard, Noida',
    status: 'in_stock',
    lastUpdated: 'Live Neon Synced',
  },
  {
    id: 'inv_2',
    businessId: 'biz_apex_industries',
    sku: 'TMT-FE550-16',
    name: 'Fe550D TMT Steel Rods (16mm & 20mm)',
    category: 'Structural Steel',
    quantity: 28,
    unit: 'MT',
    unitPrice: 54000,
    totalValue: 1512000,
    warehouseLocation: 'Sector 62 Site Yard, Noida',
    status: 'in_stock',
    lastUpdated: 'Live Neon Synced',
  },
  {
    id: 'inv_3',
    businessId: 'biz_apex_industries',
    sku: 'VLV-CS-DN50',
    name: 'Forged Carbon Steel Ball Valves DN50',
    category: 'Valves & Flow Controls',
    quantity: 120,
    unit: 'units',
    unitPrice: 3500,
    totalValue: 420000,
    warehouseLocation: 'Bhiwandi Central Logistics Hub',
    status: 'in_stock',
    lastUpdated: 'Live Neon Synced',
  },
  {
    id: 'inv_4',
    businessId: 'biz_apex_industries',
    sku: 'PMP-SLR-15HP',
    name: 'Centrifugal Slurry Pumps 15HP',
    category: 'Industrial Pumps',
    quantity: 14,
    unit: 'units',
    unitPrice: 42000,
    totalValue: 588000,
    warehouseLocation: 'Bhosari Raw Yard, Pune',
    status: 'low_stock',
    lastUpdated: 'Live Neon Synced',
  },
];

// Staff Attendance & Live Site Tracking with Working Hours & Salaries
let inMemoryAttendance: AttendanceRecord[] = [
  {
    id: 'att_1',
    businessId: 'biz_apex_industries',
    employeeId: 'emp_eng_1',
    employeeName: 'Vikram Sharma',
    role: 'Senior Site Project Engineer',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '08:30 AM',
    checkOutTime: '05:30 PM',
    workingHours: 8.5,
    overtimeHours: 1.5,
    status: 'on_site',
    location: 'Sector 62 Metro Depot Site, Noida',
    projectTender: 'Metro Rail Phase 4 - Tender #MR-402',
    reportingManagerName: 'Arvind Verma (Site Construction Manager)',
    dailyWage: 2200,
    overtimePay: 300,
    totalPayable: 2500,
    salaryStatus: 'pending',
    source: 'staff_portal',
    notes: 'Morning shift started. Concrete pour on Pier 14 inspection complete.',
    createdAt: 'Today',
  },
  {
    id: 'att_2',
    businessId: 'biz_apex_industries',
    employeeId: 'emp_sup_1',
    employeeName: 'Sunil Sharma',
    role: 'Site Operations Supervisor',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '08:00 AM',
    checkOutTime: '05:30 PM',
    workingHours: 9.5,
    overtimeHours: 1.5,
    status: 'on_site',
    location: 'Sector 62 Metro Depot Site, Noida',
    projectTender: 'Metro Rail Phase 4 - Tender #MR-402',
    reportingManagerName: 'Rajesh Khanna (Senior Project Manager)',
    dailyWage: 1500,
    overtimePay: 225,
    totalPayable: 1725,
    salaryStatus: 'paid',
    source: 'whatsapp',
    notes: '16 labours present. Shuttering & slab casting in progress.',
    createdAt: 'Today',
  },
  {
    id: 'att_3',
    businessId: 'biz_apex_industries',
    employeeId: 'emp_wrk_1',
    employeeName: 'Ramesh Patel',
    role: 'Master Mason & Shuttering Head',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '08:45 AM',
    checkOutTime: '05:15 PM',
    workingHours: 8.5,
    overtimeHours: 1.5,
    status: 'on_site',
    location: 'Sector 62 Metro Depot Site, Noida',
    projectTender: 'Metro Rail Phase 4 - Tender #MR-402',
    reportingManagerName: 'Sunil Sharma (Site Operations Supervisor)',
    dailyWage: 950,
    overtimePay: 180,
    totalPayable: 1130,
    salaryStatus: 'pending',
    source: 'manual',
    notes: 'Formwork and alignment on Pier Cap 14.',
    createdAt: 'Today',
  },
  {
    id: 'att_4',
    businessId: 'biz_apex_industries',
    employeeId: 'emp_wrk_2',
    employeeName: 'Suresh Yadav',
    role: 'Certified High-Pressure Welder',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '09:00 AM',
    checkOutTime: '06:00 PM',
    workingHours: 9.0,
    overtimeHours: 2.0,
    status: 'on_site',
    location: 'Sector 62 Metro Depot Site, Noida',
    projectTender: 'Metro Rail Phase 4 - Tender #MR-402',
    reportingManagerName: 'Sunil Sharma (Site Operations Supervisor)',
    dailyWage: 1100,
    overtimePay: 280,
    totalPayable: 1380,
    salaryStatus: 'pending',
    source: 'manual',
    notes: 'Bracket weld splicing and inspection.',
    createdAt: 'Today',
  },
  {
    id: 'att_5',
    businessId: 'biz_apex_industries',
    employeeId: 'emp_sup_2',
    employeeName: 'Anil Yadav',
    role: 'Refinery Piping Supervisor',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '08:15 AM',
    checkOutTime: '04:45 PM',
    workingHours: 8.5,
    overtimeHours: 1.0,
    status: 'on_site',
    location: 'IOCL Panipat Refinery Complex',
    projectTender: 'IOCL Panipat Refinery - Tender #IOCL-88',
    reportingManagerName: 'Vikramaditya Singh (Senior Project Manager)',
    dailyWage: 1650,
    overtimePay: 160,
    totalPayable: 1810,
    salaryStatus: 'paid',
    source: 'chat_app',
    notes: 'Piping flange torque check and hydrotesting prep.',
    createdAt: 'Today',
  },
  {
    id: 'att_6',
    businessId: 'biz_apex_industries',
    employeeId: 'emp_wrk_3',
    employeeName: 'Manoj Pandit',
    role: 'Industrial Pipe Fitter',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '08:30 AM',
    checkOutTime: '04:30 PM',
    workingHours: 8.0,
    overtimeHours: 1.0,
    status: 'on_site',
    location: 'IOCL Panipat Refinery Complex',
    projectTender: 'IOCL Panipat Refinery - Tender #IOCL-88',
    reportingManagerName: 'Anil Yadav (Refinery Piping Supervisor)',
    dailyWage: 980,
    overtimePay: 130,
    totalPayable: 1110,
    salaryStatus: 'pending',
    source: 'manual',
    notes: 'Line B flange gasket replacement.',
    createdAt: 'Today',
  },
];

// Operations & Team Live Chat
let inMemoryTeamChat: TeamChatMessage[] = [];

// Meta Video Ads AI Autonomous Manager In-Memory Storage
let inMemoryMetaAccount: MetaAdAccount = {
  id: 'meta_acc_1',
  businessId: 'biz_apex_industries',
  adAccountId: 'act_pending_connect',
  pageName: 'Your Business Page',
  pageId: '',
  instagramHandle: '',
  accessToken: '',
  pixelId: '',
  currency: 'INR',
  status: 'disconnected',
  dailySpendCap: 0,
  currentBalance: 0,
  apiVersion: 'v21.0',
  lastSyncTime: 'Never',
};

let inMemoryMetaCampaigns: MetaAdCampaign[] = [];
let inMemoryMetaLeads: MetaAdLead[] = [];
let activeBusinessId = 'biz_apex_industries';

// Helper to generate unique Staff ID & Password
function generateStaffCredentials(name: string, roleCategory: StaffRoleCategory, siteName: string) {
  const prefixMap: Record<StaffRoleCategory, string> = {
    business_owner: 'OWNR',
    project_manager: 'PM',
    site_manager: 'SM',
    site_engineer: 'ENG',
    site_supervisor: 'SITE',
    worker: 'WRK',
    tender_manager: 'TNDR',
    dispatch_manager: 'DISP',
    sales_rep: 'SALES',
  };

  const prefix = prefixMap[roleCategory] || 'EMP';
  const siteSlug = siteName.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'HQ';
  const randomNum = Math.floor(100 + Math.random() * 900);
  const staffId = `${prefix}-${siteSlug}-${randomNum}`;
  const password = `pass_${Math.floor(1000 + Math.random() * 9000)}`;

  return { staffId, password };
}

export const db = {
  getBusiness: async (id?: string): Promise<Business> => {
    const targetId = id || activeBusinessId;
    const sql = getSql();
    if (sql) {
      try {
        const rows = id 
          ? await sql`SELECT * FROM businesses WHERE id = ${targetId} LIMIT 1`
          : await sql`SELECT * FROM businesses LIMIT 1`;
        if (rows && rows.length > 0) {
          const r: any = rows[0];
          return {
            id: r.id,
            name: r.name,
            category: r.category,
            phone: r.phone,
            email: r.email || '',
            whatsappNumber: r.whatsapp_number,
            gstNumber: r.gst_number || '',
            address: r.address || '',
            status: r.status || 'active',
            subscriptionTier: r.subscription_tier,
            catalogSize: r.catalog_size || 0,
            monthlyQuota: r.monthly_quota || {
              whatsappMessages: 25000,
              whatsappMessagesUsed: 0,
              aiCalls: 500,
              aiCallsUsed: 0,
              managerReports: 300,
              managerReportsUsed: 0,
            },
            createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
          };
        }
      } catch (err) {
        console.warn('Neon query error in getBusiness:', err);
      }
    }
    const found = inMemoryBusinesses.find((b) => b.id === targetId);
    return found || inMemoryBusinesses[0];
  },

  getAllBusinesses: async (): Promise<Business[]> => {
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM businesses ORDER BY created_at DESC`;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            name: r.name,
            category: r.category,
            phone: r.phone,
            email: r.email || '',
            whatsappNumber: r.whatsapp_number,
            gstNumber: r.gst_number || '',
            address: r.address || '',
            status: r.status || 'active',
            subscriptionTier: r.subscription_tier,
            catalogSize: r.catalog_size || 0,
            monthlyQuota: r.monthly_quota || {
              whatsappMessages: 25000,
              whatsappMessagesUsed: 0,
              aiCalls: 500,
              aiCallsUsed: 0,
              managerReports: 300,
              managerReportsUsed: 0,
            },
            createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.warn('Neon query error in getAllBusinesses:', err);
      }
    }
    return inMemoryBusinesses;
  },

  setActiveBusiness: (id: string) => {
    const exists = inMemoryBusinesses.find((b) => b.id === id);
    if (exists) activeBusinessId = id;
    return activeBusinessId;
  },

  createBusiness: async (data: Partial<Business>): Promise<Business> => {
    const tier = data.subscriptionTier || 'growth';
    const newBiz: Business = {
      id: `biz_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: data.name || 'New Enterprise Client',
      category: data.category || 'General Manufacturing',
      phone: data.phone || '+91 98000 00000',
      email: data.email || 'contact@client.com',
      whatsappNumber: data.whatsappNumber || data.phone || '+91 98000 00000',
      gstNumber: data.gstNumber || 'GST-PENDING',
      address: data.address || 'Corporate Facility',
      status: 'active',
      subscriptionTier: tier,
      catalogSize: data.catalogSize || 50,
      monthlyQuota: {
        whatsappMessages: tier === 'premium' ? 25000 : tier === 'growth' ? 5000 : 1500,
        whatsappMessagesUsed: 0,
        aiCalls: tier === 'premium' ? 500 : tier === 'growth' ? 50 : 0,
        aiCallsUsed: 0,
        managerReports: tier === 'premium' ? 300 : tier === 'growth' ? 150 : 50,
        managerReportsUsed: 0,
      },
      createdAt: new Date().toISOString(),
    };

    const sql = getSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO businesses (
            id, name, category, phone, email, whatsapp_number, gst_number, address, status, subscription_tier, catalog_size, monthly_quota
          ) VALUES (
            ${newBiz.id}, ${newBiz.name}, ${newBiz.category}, ${newBiz.phone}, ${newBiz.email}, ${newBiz.whatsappNumber}, ${newBiz.gstNumber}, ${newBiz.address}, ${newBiz.status}, ${newBiz.subscriptionTier}, ${newBiz.catalogSize}, ${JSON.stringify(newBiz.monthlyQuota)}
          );
        `;
      } catch (err) {
        console.warn('Neon insert error in createBusiness:', err);
      }
    }

    inMemoryBusinesses.unshift(newBiz);
    activeBusinessId = newBiz.id;
    return newBiz;
  },

  updateBusinessProfile: async (id: string, updates: Partial<Business>): Promise<Business | null> => {
    const targetId = id || activeBusinessId;
    const sql = getSql();
    if (sql) {
      try {
        await sql`
          UPDATE businesses SET 
            name = COALESCE(${updates.name || null}, name),
            category = COALESCE(${updates.category || null}, category),
            phone = COALESCE(${updates.phone || null}, phone),
            email = COALESCE(${updates.email || null}, email),
            whatsapp_number = COALESCE(${updates.whatsappNumber || null}, whatsapp_number),
            gst_number = COALESCE(${updates.gstNumber || null}, gst_number),
            address = COALESCE(${updates.address || null}, address)
          WHERE id = ${targetId};
        `;
      } catch (err) {
        console.warn('Neon update profile error:', err);
      }
    }
    const biz = inMemoryBusinesses.find((b) => b.id === targetId) || inMemoryBusinesses[0];
    if (biz) {
      if (updates.name) biz.name = updates.name;
      if (updates.category) biz.category = updates.category;
      if (updates.phone) biz.phone = updates.phone;
      if (updates.email) biz.email = updates.email;
      if (updates.whatsappNumber) biz.whatsappNumber = updates.whatsappNumber;
      if (updates.gstNumber) biz.gstNumber = updates.gstNumber;
      if (updates.address) biz.address = updates.address;
      return biz;
    }
    return null;
  },

  updateBusinessStatus: async (id: string, status: 'active' | 'pending' | 'suspended') => {
    const sql = getSql();
    if (sql) {
      try {
        await sql`UPDATE businesses SET status = ${status} WHERE id = ${id};`;
      } catch (err) {
        console.warn('Neon update error:', err);
      }
    }
    const biz = inMemoryBusinesses.find((b) => b.id === id);
    if (biz) {
      biz.status = status;
      return biz;
    }
    return null;
  },

  updateBusinessTier: async (tier: SubscriptionTier, businessId?: string): Promise<Business> => {
    const targetId = businessId || activeBusinessId;
    const biz = inMemoryBusinesses.find((b) => b.id === targetId) || inMemoryBusinesses[0];
    biz.subscriptionTier = tier;

    if (tier === 'starter') {
      biz.monthlyQuota = {
        whatsappMessages: 2000,
        whatsappMessagesUsed: biz.monthlyQuota.whatsappMessagesUsed || 0,
        aiCalls: 0,
        aiCallsUsed: 0,
        aiCallingMinutes: 0,
        aiCallingMinutesUsed: 0,
        managerReports: 50,
        managerReportsUsed: biz.monthlyQuota.managerReportsUsed || 0,
      };
    } else if (tier === 'growth') {
      biz.monthlyQuota = {
        whatsappMessages: 10000,
        whatsappMessagesUsed: biz.monthlyQuota.whatsappMessagesUsed || 0,
        aiCalls: 60,
        aiCallsUsed: biz.monthlyQuota.aiCallsUsed || 0,
        aiCallingMinutes: 120, // 2 Hours included
        aiCallingMinutesUsed: biz.monthlyQuota.aiCallingMinutesUsed || 0,
        managerReports: 250,
        managerReportsUsed: biz.monthlyQuota.managerReportsUsed || 0,
      };
    } else {
      biz.monthlyQuota = {
        whatsappMessages: 35000,
        whatsappMessagesUsed: biz.monthlyQuota.whatsappMessagesUsed || 0,
        aiCalls: 300,
        aiCallsUsed: biz.monthlyQuota.aiCallsUsed || 0,
        aiCallingMinutes: 600, // 10 Hours included
        aiCallingMinutesUsed: biz.monthlyQuota.aiCallingMinutesUsed || 0,
        managerReports: 1000,
        managerReportsUsed: biz.monthlyQuota.managerReportsUsed || 0,
      };
    }

    const sql = getSql();
    if (sql) {
      try {
        await sql`
          UPDATE businesses 
          SET subscription_tier = ${tier}, monthly_quota = ${JSON.stringify(biz.monthlyQuota)} 
          WHERE id = ${targetId};
        `;
      } catch (err) {
        console.warn('Neon update error in updateBusinessTier:', err);
      }
    }
    return biz;
  },

  getAdminStats: async (): Promise<AdminStats> => {
    const sql = getSql();
    let clientCount = inMemoryBusinesses.length;
    let messageCount = 0;
    let callCount = 0;
    let revenue = 0;

    if (sql) {
      try {
        const [bizRows, msgRows, callRows] = await Promise.all([
          sql`SELECT count(*)::int as count FROM businesses`,
          sql`SELECT count(*)::int as count FROM whatsapp_messages`,
          sql`SELECT count(*)::int as count FROM ai_calls`,
        ]);
        clientCount = Number(bizRows[0]?.count) || 1;
        messageCount = Number(msgRows[0]?.count) || 0;
        callCount = Number(callRows[0]?.count) || 0;
      } catch (err) {
        console.warn('Neon stats query error:', err);
      }
    }

    for (const b of inMemoryBusinesses) {
      if (b.subscriptionTier === 'premium') revenue += 34999;
      else if (b.subscriptionTier === 'growth') revenue += 14999;
      else revenue += 4999;
      if (!sql) {
        messageCount += b.monthlyQuota.whatsappMessagesUsed;
        callCount += b.monthlyQuota.aiCallsUsed;
      }
    }

    return {
      totalClients: clientCount,
      activeAgents: clientCount * 3 + 1,
      totalMonthlyRevenue: revenue || 34999,
      totalMessagesProcessed: messageCount || 4210,
      totalCallsDialed: callCount || 84,
      neonConnected: Boolean(sql),
      geminiModelActive: 'gemini-1.5-flash',
    };
  },

  // Staff Engine
  getEmployees: async (businessId?: string): Promise<Employee[]> => {
    const targetBiz = businessId || activeBusinessId;
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM employees WHERE business_id = ${targetBiz} ORDER BY name ASC`;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            businessId: r.business_id,
            name: r.name,
            role: r.role,
            roleCategory: r.role_category || 'site_engineer',
            siteName: r.site_name || 'Headquarters',
            phone: r.phone,
            staffId: r.staff_id || 'EMP-100',
            password: r.password || 'pass_1234',
            status: r.status || 'active',
            currentLocation: r.current_location || 'Headquarters',
            lastUpdate: r.last_update ? new Date(r.last_update).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live',
            lastReportNote: r.last_report_note || '',
            assignedTasks: r.assigned_tasks || 0,
          }));
        }
      } catch (err) {
        console.warn('Neon query error in getEmployees:', err);
      }
    }
    return inMemoryEmployees.filter((e) => !businessId || e.businessId === businessId);
  },

  authenticateStaff: async (staffId: string, password: string, businessId?: string): Promise<Employee | null> => {
    const sql = getSql();
    if (sql) {
      try {
        const rows = businessId
          ? await sql`
              SELECT * FROM employees 
              WHERE (LOWER(staff_id) = LOWER(${staffId}) OR phone LIKE ${'%' + staffId}) AND business_id = ${businessId}
              LIMIT 1
            `
          : await sql`
              SELECT * FROM employees 
              WHERE (LOWER(staff_id) = LOWER(${staffId}) OR phone LIKE ${'%' + staffId})
              LIMIT 1
            `;
        if (rows && rows.length > 0) {
          const r: any = rows[0];
          if (verifyPassword(password, r.password)) {
            return {
              id: r.id,
              businessId: r.business_id,
              name: r.name,
              role: r.role,
              roleCategory: r.role_category || 'site_engineer',
              siteName: r.site_name || 'Headquarters',
              phone: r.phone,
              staffId: r.staff_id || 'EMP-100',
              password: r.password || 'pass_1234',
              status: r.status || 'active',
              currentLocation: r.current_location || 'Headquarters',
              lastUpdate: 'Live',
              lastReportNote: r.last_report_note || '',
              assignedTasks: r.assigned_tasks || 0,
            };
          }
        }
      } catch (err) {
        console.warn('Neon query error in authenticateStaff:', err);
      }
    }
    const found = inMemoryEmployees.find(
      (e) => (e.staffId.toLowerCase() === staffId.toLowerCase() || e.phone.includes(staffId)) &&
             (!businessId || e.businessId === businessId) &&
             verifyPassword(password, e.password)
    );
    return found || null;
  },

  addEmployee: async (data: {
    name: string;
    role: string;
    roleCategory: StaffRoleCategory;
    siteName: string;
    phone: string;
    businessId?: string;
    projectTender?: string;
    tenderCode?: string;
    reportingManagerId?: string;
    reportingManagerName?: string;
    assignedBy?: string;
    dailyWageRate?: number;
    monthlySalary?: number;
    overtimeRate?: number;
    skillSpecialty?: string;
  }): Promise<Employee> => {
    const creds = generateStaffCredentials(data.name, data.roleCategory, data.siteName);
    const targetBiz = data.businessId || activeBusinessId;
    const hashedPassword = hashPassword(creds.password);

    const newEmp: Employee = {
      id: `emp_${Date.now()}`,
      businessId: targetBiz,
      name: data.name,
      role: data.role,
      roleCategory: data.roleCategory,
      siteName: data.siteName,
      phone: data.phone,
      staffId: creds.staffId,
      password: hashedPassword,
      status: 'active',
      currentLocation: data.siteName,
      lastUpdate: 'Credentials created just now',
      lastReportNote: 'Enrolled to operations roster with auto-generated credentials.',
      assignedTasks: 3,
      projectTender: data.projectTender || 'Sector 62 Metro Depot Site, Noida',
      tenderCode: data.tenderCode || 'TNDR-GEN',
      reportingManagerId: data.reportingManagerId,
      reportingManagerName: data.reportingManagerName,
      assignedBy: data.assignedBy || 'Business Owner',
      dailyWageRate: data.dailyWageRate || (data.roleCategory === 'worker' ? 950 : data.roleCategory === 'site_supervisor' ? 1500 : 2500),
      monthlySalary: data.monthlySalary || (data.roleCategory === 'project_manager' ? 95000 : data.roleCategory === 'site_manager' ? 75000 : 35000),
      overtimeRate: data.overtimeRate || (data.roleCategory === 'worker' ? 120 : 200),
      workingHoursToday: 8.0,
      overtimeHoursToday: 0,
      totalHoursMonth: 160,
      salaryStatus: 'pending',
      skillSpecialty: data.skillSpecialty,
    };
    const sql = getSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO employees (
            id, business_id, name, role, role_category, site_name, phone, staff_id, password, status, current_location, last_report_note, assigned_tasks
          ) VALUES (
            ${newEmp.id}, ${newEmp.businessId}, ${newEmp.name}, ${newEmp.role}, ${newEmp.roleCategory}, ${newEmp.siteName}, ${newEmp.phone}, ${newEmp.staffId}, ${newEmp.password}, ${newEmp.status}, ${newEmp.currentLocation}, ${newEmp.lastReportNote}, ${newEmp.assignedTasks}
          );
        `;
      } catch (err) {
        console.warn('Neon insert error in addEmployee:', err);
      }
    }
    inMemoryEmployees.unshift(newEmp);
    // Return with original credentials password for initial admin display
    return { ...newEmp, password: creds.password };

    // Also create initial attendance entry for them
    const initialAtt: AttendanceRecord = {
      id: `att_${Date.now()}`,
      businessId: activeBusinessId,
      employeeId: newEmp.id,
      employeeName: newEmp.name,
      role: newEmp.role,
      date: new Date().toISOString().split('T')[0],
      checkInTime: '08:30 AM',
      workingHours: newEmp.workingHoursToday,
      overtimeHours: 0,
      status: 'present',
      location: newEmp.siteName,
      projectTender: newEmp.projectTender,
      reportingManagerName: newEmp.reportingManagerName,
      dailyWage: newEmp.dailyWageRate,
      overtimePay: 0,
      totalPayable: newEmp.dailyWageRate,
      salaryStatus: 'pending',
      source: 'manual',
      notes: 'Initial roster assignment',
      createdAt: 'Just now',
    };
    inMemoryAttendance.unshift(initialAtt);

    return newEmp;
  },

  logWorkingHours: async (data: {
    employeeId?: string;
    employeeName: string;
    workingHours: number;
    overtimeHours?: number;
    date?: string;
    notes?: string;
  }) => {
    const emp = inMemoryEmployees.find(e => 
      (data.employeeId && e.id === data.employeeId) || 
      e.name.toLowerCase().includes(data.employeeName.toLowerCase())
    );

    const baseWage = emp?.dailyWageRate || 950;
    const otRate = emp?.overtimeRate || 140;
    const otHours = data.overtimeHours || 0;
    const otPay = Math.round(otHours * otRate);
    const totalPayable = baseWage + otPay;

    if (emp) {
      emp.workingHoursToday = data.workingHours;
      emp.overtimeHoursToday = otHours;
      emp.totalHoursMonth = (emp.totalHoursMonth || 160) + (data.workingHours - 8);
      emp.lastUpdate = 'Working hours logged just now';
      if (data.notes) emp.lastReportNote = data.notes;
    }

    const att = await db.addAttendanceRecord({
      employeeId: emp?.id,
      employeeName: emp ? emp.name : data.employeeName,
      role: emp ? emp.role : 'Site Staff',
      date: data.date || new Date().toISOString().split('T')[0],
      checkInTime: '08:30 AM',
      checkOutTime: '05:30 PM',
      workingHours: data.workingHours,
      overtimeHours: otHours,
      status: 'present',
      location: emp ? emp.siteName : 'Sector 62 Metro Depot Site, Noida',
      projectTender: emp?.projectTender || 'Metro Rail Phase 4 - Tender #MR-402',
      reportingManagerName: emp?.reportingManagerName,
      dailyWage: baseWage,
      overtimePay: otPay,
      totalPayable,
      salaryStatus: 'pending',
      source: 'chat_app',
      notes: data.notes || `Logged ${data.workingHours} hrs worked (+ ${otHours} hrs OT).`,
    });

    return { employee: emp, attendance: att };
  },

  updateAttendanceSalaryStatus: async (id: string, salaryStatus: 'paid' | 'pending') => {
    const att = inMemoryAttendance.find(a => a.id === id);
    if (att) {
      att.salaryStatus = salaryStatus;
      return att;
    }
    return null;
  },

  updateEmployeeStatus: async (id: string, status: Employee['status'], location?: string, note?: string) => {
    const sql = getSql();
    if (sql) {
      try {
        await sql`
          UPDATE employees 
          SET status = ${status}, 
              current_location = COALESCE(${location || null}, current_location), 
              last_report_note = COALESCE(${note || null}, last_report_note),
              last_update = CURRENT_TIMESTAMP
          WHERE id = ${id};
        `;
      } catch (err) {
        console.warn('Neon update error in updateEmployeeStatus:', err);
      }
    }
    const emp = inMemoryEmployees.find((e) => e.id === id);
    if (emp) {
      emp.status = status;
      if (location) emp.currentLocation = location;
      if (note) emp.lastReportNote = note;
      emp.lastUpdate = 'Just now via Chatbot';
    }
    return emp;
  },

  // Bills & Invoices
  getBills: async (businessId?: string): Promise<Bill[]> => {
    const targetBiz = businessId || activeBusinessId;
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM bills WHERE business_id = ${targetBiz} ORDER BY created_at DESC`;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            businessId: r.business_id,
            billNumber: r.invoice_number || `INV-${r.id.slice(-4)}`,
            partyName: r.vendor_name || 'Vendor',
            type: (r.category === 'logistics' ? 'transport' : r.category === 'site_expense' ? 'site_expense' : 'vendor_purchase') as any,
            amount: Number(r.amount) || 0,
            gstAmount: Number(r.gst_amount) || 0,
            totalAmount: (Number(r.amount) || 0) + (Number(r.gst_amount) || 0),
            dueDate: r.due_date || 'Due this week',
            status: (r.status || 'pending') as any,
            description: r.notes || 'Operations Invoice Ledger',
            siteReference: 'Main Operations Hub',
            createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN') : 'Just now',
          }));
        }
      } catch (err) {
        console.warn('Neon query error in getBills:', err);
      }
    }
    return inMemoryBills.filter((b) => !businessId || b.businessId === businessId);
  },

  addBill: async (bill: Omit<Bill, 'id' | 'businessId' | 'createdAt'>): Promise<Bill> => {
    const newBill: Bill = {
      ...bill,
      id: `bill_${Date.now()}`,
      businessId: activeBusinessId,
      createdAt: 'Just now',
    };
    const sql = getSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO bills (
            id, business_id, vendor_name, invoice_number, amount, due_date, status, gst_amount, category, notes
          ) VALUES (
            ${newBill.id}, ${newBill.businessId}, ${newBill.partyName}, ${newBill.billNumber}, ${newBill.amount}, ${newBill.dueDate}, ${newBill.status}, ${newBill.gstAmount}, ${newBill.type}, ${newBill.description}
          );
        `;
      } catch (err) {
        console.warn('Neon insert error in addBill:', err);
      }
    }
    inMemoryBills.unshift(newBill);
    return newBill;
  },

  // Marketing Connectors
  getMarketingConnectors: async (): Promise<MarketingConnector[]> => {
    return inMemoryConnectors;
  },

  updateConnector: async (id: string, updates: Partial<MarketingConnector>): Promise<MarketingConnector | null> => {
    const conn = inMemoryConnectors.find((c) => c.id === id);
    if (conn) {
      Object.assign(conn, updates);
      return conn;
    }
    return null;
  },

  // Business Research
  getResearchBriefings: async (): Promise<BusinessResearch[]> => {
    return inMemoryResearch;
  },

  getLeads: async (businessId?: string): Promise<SalesLead[]> => {
    const targetBiz = businessId || activeBusinessId;
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM sales_leads WHERE business_id = ${targetBiz} ORDER BY created_at DESC`;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            businessId: r.business_id,
            source: r.source || 'indiamart',
            clientName: r.client_name,
            phone: r.phone,
            productName: r.product_name,
            quantity: r.quantity || 'Batch',
            estimatedValue: Number(r.estimated_value) || 0,
            status: r.status || 'new',
            aiScore: r.ai_score || 80,
            notes: r.notes || '',
            createdAt: r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
          }));
        }
      } catch (err) {
        console.warn('Neon query error in getLeads:', err);
      }
    }
    return inMemoryLeads.filter((l) => !businessId || l.businessId === businessId);
  },

  addLead: async (lead: Omit<SalesLead, 'id' | 'businessId' | 'createdAt'>): Promise<SalesLead> => {
    const newLead: SalesLead = {
      ...lead,
      id: `lead_${Date.now()}`,
      businessId: activeBusinessId,
      createdAt: 'Just now',
    };
    const sql = getSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO sales_leads (
            id, business_id, source, client_name, phone, product_name, quantity, estimated_value, status, ai_score, notes
          ) VALUES (
            ${newLead.id}, ${newLead.businessId}, ${newLead.source}, ${newLead.clientName}, ${newLead.phone}, ${newLead.productName}, ${newLead.quantity}, ${newLead.estimatedValue}, ${newLead.status}, ${newLead.aiScore}, ${newLead.notes}
          );
        `;
      } catch (err) {
        console.warn('Neon insert error in addLead:', err);
      }
    }
    inMemoryLeads.unshift(newLead);
    return newLead;
  },

  getReports: async (businessId?: string): Promise<ManagerReport[]> => {
    const targetBiz = businessId || activeBusinessId;
    return inMemoryReports.filter((r) => r.businessId === targetBiz);
  },

  addReport: async (rep: Omit<ManagerReport, 'id' | 'businessId' | 'createdAt'>): Promise<ManagerReport> => {
    const newReport: ManagerReport = {
      ...rep,
      id: `rep_${Date.now()}`,
      businessId: activeBusinessId,
      createdAt: 'Just now',
    };
    inMemoryReports.unshift(newReport);
    return newReport;
  },

  getCalls: async (businessId?: string): Promise<AICall[]> => {
    const targetBiz = businessId || activeBusinessId;
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM ai_calls WHERE business_id = ${targetBiz} ORDER BY created_at DESC`;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            businessId: r.business_id,
            recipientName: r.recipient_name,
            phone: r.phone,
            direction: r.direction || 'outbound',
            goal: r.goal || 'lead_qualification',
            status: r.status || 'completed',
            durationSeconds: r.duration_seconds || 0,
            transcript: r.transcript || [],
            summary: r.summary || '',
            sentiment: r.sentiment || 'positive',
            audioUrl: r.audio_url,
            createdAt: r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
          }));
        }
      } catch (err) {
        console.warn('Neon query error in getCalls:', err);
      }
    }
    return inMemoryCalls.filter((c) => !businessId || c.businessId === businessId);
  },

  addCall: async (call: Omit<AICall, 'id' | 'businessId' | 'createdAt'>): Promise<AICall> => {
    const newCall: AICall = {
      ...call,
      id: `call_${Date.now()}`,
      businessId: activeBusinessId,
      createdAt: 'Just now',
    };
    const sql = getSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO ai_calls (
            id, business_id, recipient_name, phone, direction, goal, status, duration_seconds, transcript, summary, sentiment, audio_url
          ) VALUES (
            ${newCall.id}, ${newCall.businessId}, ${newCall.recipientName}, ${newCall.phone}, ${newCall.direction}, ${newCall.goal}, ${newCall.status}, ${newCall.durationSeconds}, ${JSON.stringify(newCall.transcript)}, ${newCall.summary}, ${newCall.sentiment}, ${newCall.audioUrl || null}
          );
        `;
      } catch (err) {
        console.warn('Neon insert error in addCall:', err);
      }
    }
    inMemoryCalls.unshift(newCall);
    const biz = inMemoryBusinesses.find((b) => b.id === activeBusinessId);
    if (biz) biz.monthlyQuota.aiCallsUsed += 1;
    return newCall;
  },

  getWhatsAppMessages: async (businessId?: string): Promise<WhatsAppMessage[]> => {
    const targetBiz = businessId || activeBusinessId;
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM whatsapp_messages WHERE business_id = ${targetBiz} ORDER BY created_at ASC`;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            businessId: r.business_id,
            senderPhone: r.sender_phone,
            senderName: r.sender_name,
            text: r.text,
            isBot: Boolean(r.is_bot),
            intent: r.intent || 'general',
            timestamp: r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live',
          }));
        }
      } catch (err) {
        console.warn('Neon query error in getWhatsAppMessages:', err);
      }
    }
    return inMemoryWhatsAppMessages.filter((m) => !businessId || m.businessId === businessId);
  },

  addWhatsAppMessage: async (msg: Omit<WhatsAppMessage, 'id' | 'businessId' | 'timestamp'>): Promise<WhatsAppMessage> => {
    const newMsg: WhatsAppMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      businessId: activeBusinessId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const sql = getSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO whatsapp_messages (
            id, business_id, sender_phone, sender_name, text, is_bot, intent
          ) VALUES (
            ${newMsg.id}, ${newMsg.businessId}, ${newMsg.senderPhone}, ${newMsg.senderName}, ${newMsg.text}, ${newMsg.isBot}, ${newMsg.intent || 'general'}
          );
        `;
      } catch (err) {
        console.warn('Neon insert error in addWhatsAppMessage:', err);
      }
    }
    inMemoryWhatsAppMessages.push(newMsg);
    const biz = inMemoryBusinesses.find((b) => b.id === activeBusinessId);
    if (biz) biz.monthlyQuota.whatsappMessagesUsed += 1;
    return newMsg;
  },

  // -------------------------------------------------------------
  // Warehouse Inventory Management & Valuation
  // -------------------------------------------------------------
  getInventory: async (businessId?: string): Promise<InventoryItem[]> => {
    const targetBiz = businessId || activeBusinessId;
    const sql = getSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM inventory_items WHERE business_id = ${targetBiz} ORDER BY name ASC`;
        if (rows && rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            businessId: r.business_id,
            sku: r.sku,
            name: r.name,
            category: r.category,
            quantity: r.stock_level || 0,
            unit: 'Units',
            unitPrice: Number(r.unit_price) || 0,
            totalValue: (r.stock_level || 0) * (Number(r.unit_price) || 0),
            warehouseLocation: r.warehouse_location || 'Main Warehouse',
            status: (r.stock_level || 0) < 20 ? 'low_stock' : 'in_stock',
            lastUpdated: 'Live Neon Synced',
          }));
        }
      } catch (err) {
        console.warn('Neon query error in getInventory:', err);
      }
    }
    return inMemoryInventory.filter((i) => !businessId || i.businessId === businessId);
  },

  getInventorySummary: async (businessId?: string) => {
    const targetBiz = businessId || activeBusinessId;
    const filtered = inMemoryInventory.filter((i) => !businessId || i.businessId === targetBiz);
    const totalValuation = filtered.reduce((acc, item) => acc + (item.totalValue || item.quantity * item.unitPrice), 0);
    const totalSkus = filtered.length;
    const totalUnits = filtered.reduce((acc, item) => acc + item.quantity, 0);
    const lowStockCount = filtered.filter(i => i.status === 'low_stock' || i.status === 'critical').length;
    return {
      totalValuation,
      totalValuationLakhs: (totalValuation / 100000).toFixed(2),
      totalSkus,
      totalUnits,
      lowStockCount,
      items: filtered,
    };
  },

  addInventoryItem: async (item: Omit<InventoryItem, 'id' | 'businessId' | 'lastUpdated'>): Promise<InventoryItem> => {
    const totalValue = item.totalValue || (item.quantity * item.unitPrice);
    const newItem: InventoryItem = {
      ...item,
      id: `inv_${Date.now()}`,
      businessId: activeBusinessId,
      totalValue,
      status: item.status || (item.quantity < 20 ? 'low_stock' : 'in_stock'),
      lastUpdated: 'Just now via Ops Chat',
    };
    inMemoryInventory.unshift(newItem);
    return newItem;
  },

  updateInventoryItem: async (idOrSku: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> => {
    const item = inMemoryInventory.find(i => 
      i.id === idOrSku || 
      i.sku.toLowerCase() === idOrSku.toLowerCase() || 
      i.name.toLowerCase().includes(idOrSku.toLowerCase())
    );
    if (item) {
      Object.assign(item, updates);
      if (updates.quantity !== undefined || updates.unitPrice !== undefined) {
        item.totalValue = item.quantity * item.unitPrice;
      }
      item.lastUpdated = 'Just now';
      return item;
    }
    return null;
  },

  // -------------------------------------------------------------
  // Staff Attendance & Live Site Tracking
  // -------------------------------------------------------------
  getAttendance: async (businessId?: string): Promise<AttendanceRecord[]> => {
    const targetBiz = businessId || activeBusinessId;
    return inMemoryAttendance.filter((a) => !businessId || a.businessId === targetBiz);
  },

  addAttendanceRecord: async (rec: Omit<AttendanceRecord, 'id' | 'businessId' | 'createdAt'>): Promise<AttendanceRecord> => {
    const newRec: AttendanceRecord = {
      ...rec,
      id: `att_${Date.now()}`,
      businessId: activeBusinessId,
      date: rec.date || new Date().toISOString().split('T')[0],
      checkInTime: rec.checkInTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: 'Just now',
    };
    inMemoryAttendance.unshift(newRec);

    // Sync status and location to employee roster
    const emp = inMemoryEmployees.find(e => 
      (rec.employeeId && e.id === rec.employeeId) || 
      e.name.toLowerCase().includes(rec.employeeName.toLowerCase()) || 
      rec.employeeName.toLowerCase().includes(e.name.toLowerCase())
    );
    if (emp) {
      emp.status = rec.status === 'present' ? 'active' : (rec.status as any);
      if (rec.location) emp.currentLocation = rec.location;
      if (rec.notes) emp.lastReportNote = rec.notes;
      emp.lastUpdate = 'Just now via Ops Chat';
    }

    return newRec;
  },

  // -------------------------------------------------------------
  // Team Operations Live Chat
  // -------------------------------------------------------------
  getTeamChat: async (businessId?: string): Promise<TeamChatMessage[]> => {
    const targetBiz = businessId || activeBusinessId;
    return inMemoryTeamChat.filter((t) => !businessId || t.businessId === targetBiz);
  },

  addTeamChatMessage: async (msg: Omit<TeamChatMessage, 'id' | 'businessId' | 'timestamp'>): Promise<TeamChatMessage> => {
    const newMsg: TeamChatMessage = {
      ...msg,
      id: `tchat_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      businessId: activeBusinessId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    inMemoryTeamChat.push(newMsg);
    return newMsg;
  },

  // -------------------------------------------------------------
  // Live Business Intelligence & Natural Language Query Resolver
  // Answers Attendance by Name, Staff Location, Inventory Value, and Bills by Name/Date
  // -------------------------------------------------------------
  queryBusinessIntelligence: async (query: string): Promise<{
    handled: boolean;
    type: 'attendance' | 'location' | 'inventory' | 'bill' | 'general';
    reply: string;
    data?: any;
  }> => {
    const lower = query.toLowerCase().trim();

    // 1. ATTENDANCE BY NAME / LOCATION OF STAFF
    const empMatches = inMemoryEmployees.filter(e => 
      lower.includes(e.name.toLowerCase()) || 
      lower.includes(e.name.split(' ')[0].toLowerCase())
    );

    const isAttendanceQuery = 
      lower.includes('attendance') || 
      lower.includes('hazri') || 
      lower.includes('present') || 
      lower.includes('checkin') || 
      lower.includes('check in');

    const isLocationQuery = 
      lower.includes('location') || 
      lower.includes('where is') || 
      lower.includes('kahan') || 
      lower.includes('kaha') || 
      lower.includes('site pe');

    if (empMatches.length > 0 && (isAttendanceQuery || isLocationQuery || lower.includes('status'))) {
      const emp = empMatches[0];
      const recentAtt = inMemoryAttendance.find(a => 
        a.employeeName.toLowerCase().includes(emp.name.toLowerCase()) || 
        emp.name.toLowerCase().includes(a.employeeName.toLowerCase())
      );

      const statusBadge = emp.status === 'on_site' ? '🟢 ON SITE' : emp.status === 'active' ? '🟢 ACTIVE' : emp.status === 'on_break' ? '🟡 ON BREAK' : '⚪ OFFLINE';
      const checkInTime = recentAtt?.checkInTime || '08:30 AM';
      const reply = `📍 *Staff Attendance & Live Location*\n\n👤 *Name:* ${emp.name} (${emp.role})\n🆔 *Staff ID:* ${emp.staffId}\n🏗️ *Tender / Project:* ${emp.projectTender || 'Metro Rail Phase 4'}\n👔 *Reporting To:* ${emp.reportingManagerName || 'Rajesh Khanna (PM)'}\n🚦 *Status:* ${statusBadge}\n📌 *Current Site/Location:* ${emp.currentLocation}\n⏰ *Check-in Time:* ${checkInTime}\n⏱️ *Hours Today:* ${emp.workingHoursToday || 8.5} hrs (+ ${emp.overtimeHoursToday || 0} hrs OT)\n📝 *Recent Update:* "${emp.lastReportNote}"\n📞 *Contact:* ${emp.phone}`;

      return {
        handled: true,
        type: isLocationQuery ? 'location' : 'attendance',
        reply,
        data: { employee: emp, attendance: recentAtt },
      };
    }

    // 1.2 WORKING HOURS & SALARIES / PAYROLL INQUIRY
    const isSalaryQuery = 
      lower.includes('salary') || 
      lower.includes('salaries') || 
      lower.includes('wage') || 
      lower.includes('working hour') || 
      lower.includes('hours worked') || 
      lower.includes('overtime') || 
      lower.includes('tankhah') || 
      lower.includes('payroll') || 
      lower.includes('duty hours');

    if (isSalaryQuery) {
      if (empMatches.length > 0) {
        const emp = empMatches[0];
        const att = inMemoryAttendance.find(a => 
          a.employeeName.toLowerCase().includes(emp.name.toLowerCase()) || 
          emp.name.toLowerCase().includes(a.employeeName.toLowerCase())
        );
        const hrs = emp.workingHoursToday || att?.workingHours || 8.0;
        const ot = emp.overtimeHoursToday || att?.overtimeHours || 0;
        const dailyRate = emp.dailyWageRate || att?.dailyWage || 950;
        const otPay = att?.overtimePay || Math.round(ot * (emp.overtimeRate || 140));
        const total = att?.totalPayable || (dailyRate + otPay);
        const status = att?.salaryStatus || emp.salaryStatus || 'pending';

        const reply = `💼 *Staff Working Hours & Salary Ledger*\n\n👤 *Staff:* ${emp.name} (${emp.role})\n🆔 *Staff ID:* ${emp.staffId}\n🏗️ *Tender / Project:* ${emp.projectTender || 'Metro Rail Phase 4'}\n👔 *Reporting To:* ${emp.reportingManagerName || 'Rajesh Khanna (PM)'}\n⏱️ *Hours Worked Today:* ${hrs} hrs (+ ${ot} hrs Overtime)\n💰 *Daily Wage Rate:* ₹${dailyRate.toLocaleString('en-IN')}\n⚡ *Overtime Pay:* ₹${otPay.toLocaleString('en-IN')}\n💵 *Total Salary Payable:* ₹${total.toLocaleString('en-IN')}\n🚦 *Payment Status:* ${status.toUpperCase()}\n\n_Full payroll sheet can be exported to Excel from the Staff ID Generator & Role Roster Engine._`;

        return {
          handled: true,
          type: 'attendance',
          reply,
          data: { employee: emp, attendance: att, salaryPayable: total },
        };
      }

      // General Salary / Payroll Ledger Summary
      const totalHours = inMemoryAttendance.reduce((acc, a) => acc + (a.workingHours || 8), 0);
      const totalOt = inMemoryAttendance.reduce((acc, a) => acc + (a.overtimeHours || 0), 0);
      const totalPayable = inMemoryAttendance.reduce((acc, a) => acc + (a.totalPayable || (a.dailyWage || 950)), 0);

      const staffList = inMemoryAttendance.slice(0, 5).map(a => 
        `• *${a.employeeName}* (${a.role}): ${a.workingHours || 8}h + ${a.overtimeHours || 0}h OT | Total: ₹${(a.totalPayable || 950).toLocaleString('en-IN')} [${(a.salaryStatus || 'pending').toUpperCase()}]`
      ).join('\n');

      const reply = `📊 *Operations Payroll, Hours & Salary Summary*\n\n👥 *Active Staff Count:* ${inMemoryAttendance.length} Personnel\n⏱️ *Total Working Hours Today:* ${totalHours.toFixed(1)} hrs (+ ${totalOt.toFixed(1)} hrs Overtime)\n💰 *Total Payroll Payable:* ₹${totalPayable.toLocaleString('en-IN')}\n\n*Recent Staff Ledger Entries:*\n${staffList}\n\n_Click the "Attendance, Working Hours & Salary Excel Ledger" tab in Staff Roster to download the complete Excel sheet._`;

      return {
        handled: true,
        type: 'attendance',
        reply,
        data: { totalHours, totalOt, totalPayable, attendance: inMemoryAttendance },
      };
    }

    // 1.4 PROJECT / TENDER STATUS INQUIRY
    const isProjectStatusQuery = 
      lower.includes('project status') || 
      lower.includes('tender status') || 
      lower.includes('tendor status') || 
      lower.includes('tender report') || 
      lower.includes('site progress') || 
      lower.includes('metro rail') || 
      lower.includes('panipat refinery') || 
      lower.includes('iocl');

    if (isProjectStatusQuery) {
      const isMetro = lower.includes('metro') || !lower.includes('iocl');
      const projectName = isMetro ? 'Metro Rail Phase 4 - Tender #MR-402' : 'IOCL Panipat Refinery - Tender #IOCL-88';
      const pm = isMetro ? 'Rajesh Khanna (Senior Project Manager)' : 'Vikramaditya Singh (Senior Project Manager)';
      const sup = isMetro ? 'Sunil Sharma (Site Operations Supervisor)' : 'Anil Yadav (Refinery Piping Supervisor)';
      const completion = isMetro ? '82% Completed' : '68% Completed';
      const milestone = isMetro ? 'Pier Cap Casting on Pier 14, Shuttering active, 16 workers on site' : 'High-pressure line flange torquing & hydrotesting scheduled for 14:00 hrs';

      const reply = `🏗️ *Live Project & Tender Execution Status*\n\n📋 *Tender / Project:* ${projectName}\n👔 *Project Manager:* ${pm}\n👷 *Site Supervisor:* ${sup}\n📈 *Current Progress:* ${completion}\n📌 *Active Milestone:* ${milestone}\n👥 *Staff Deployed:* Site Engineers, Supervisors & Skilled Labors synced via Staff ID Engine\n🚦 *Health Status:* 🟢 ON TRACK (No safety incidents reported today)`;

      return {
        handled: true,
        type: 'general',
        reply,
        data: { projectName, pm, sup, completion, milestone },
      };
    }

    const isExplicitRosterAsk =
      query.includes('?') ||
      lower.startsWith('show') ||
      lower.startsWith('who') ||
      lower.startsWith('tell') ||
      lower.startsWith('list') ||
      lower.includes('attendance roster') ||
      lower.includes('who is present') ||
      lower.includes('who is on site') ||
      lower.includes('koun present') ||
      lower.includes('kaun present') ||
      lower.includes('all staff');

    if (isExplicitRosterAsk && (isAttendanceQuery || (isLocationQuery && lower.includes('staff')))) {
      // General Attendance Roster Query
      const presentCount = inMemoryEmployees.filter(e => e.status === 'on_site' || e.status === 'active').length;
      const listSummary = inMemoryEmployees.map(e => 
        `• *${e.name}* (${e.role}): ${e.status === 'on_site' ? '🟢 On Site' : e.status === 'on_break' ? '🟡 On Break' : '🟢 Active'} @ _${e.currentLocation}_`
      ).join('\n');

      const reply = `📋 *Staff Attendance & Location Roster*\n\n👥 *Total Staff:* ${inMemoryEmployees.length} | *Present Today:* ${presentCount}\n\n${listSummary}\n\n_Ask for any particular staff by name (e.g., "attendance of Vikram Sharma" or "where is Sunil?") for detailed logs._`;

      return {
        handled: true,
        type: 'attendance',
        reply,
        data: { employees: inMemoryEmployees },
      };
    }

    // 2. INVENTORY VALUE & STOCK BREAKDOWN
    if (
      lower.includes('inventory') || 
      lower.includes('stock') || 
      lower.includes('godown') || 
      lower.includes('warehouse') || 
      lower.includes('maal') || 
      lower.includes('valuation')
    ) {
      // Check if user asked about a particular product
      const productMatch = inMemoryInventory.find(i => 
        lower.includes(i.name.toLowerCase()) || 
        lower.includes(i.category.toLowerCase()) || 
        (lower.includes('valve') && i.name.toLowerCase().includes('valve')) ||
        (lower.includes('pump') && i.name.toLowerCase().includes('pump')) ||
        (lower.includes('steel') && i.name.toLowerCase().includes('steel')) ||
        (lower.includes('actuator') && i.name.toLowerCase().includes('actuator'))
      );

      const totalValuation = inMemoryInventory.reduce((acc, item) => acc + (item.totalValue || item.quantity * item.unitPrice), 0);
      const totalUnits = inMemoryInventory.reduce((acc, item) => acc + item.quantity, 0);

      if (productMatch) {
        const reply = `📦 *Inventory Item Details*\n\n🏷️ *Product:* ${productMatch.name}\n🔖 *SKU:* ${productMatch.sku}\n📊 *Available Stock:* ${productMatch.quantity} ${productMatch.unit}\n💰 *Unit Price:* ₹${productMatch.unitPrice.toLocaleString('en-IN')}\n💎 *Total Stock Value:* ₹${productMatch.totalValue.toLocaleString('en-IN')}\n📍 *Warehouse:* ${productMatch.warehouseLocation}\n🚦 *Status:* ${productMatch.status === 'in_stock' ? '✅ In Stock' : '⚠️ Low Stock'}`;

        return {
          handled: true,
          type: 'inventory',
          reply,
          data: productMatch,
        };
      }

      // Overall Inventory Summary
      const itemsList = inMemoryInventory.map(i => 
        `• *${i.name}*: ${i.quantity} ${i.unit} (Value: ₹${(i.totalValue / 100000).toFixed(1)}L @ ${i.warehouseLocation.split('(')[0].trim()})`
      ).join('\n');

      const reply = `💎 *Warehouse Inventory Valuation Summary*\n\n💰 *Total Inventory Valuation:* ₹${(totalValuation / 100000).toFixed(2)} Lakhs (₹${totalValuation.toLocaleString('en-IN')})\n📦 *Total Units in Stock:* ${totalUnits} units across ${inMemoryInventory.length} SKUs\n\n*Stock Breakdown by Category:*\n${itemsList}\n\n_Real-time valuation synchronized with Bhiwandi, Gurugram, Pune, & Ludhiana Hubs._`;

      return {
        handled: true,
        type: 'inventory',
        reply,
        data: { totalValuation, totalUnits, items: inMemoryInventory },
      };
    }

    // 3. PARTICULAR BILL BY NAME OR DATE OR BILL NUMBER
    if (
      lower.includes('bill') || 
      lower.includes('invoice') || 
      lower.includes('payment') || 
      lower.includes('kharcha') || 
      lower.includes('receivable') ||
      lower.includes('inv-') ||
      lower.includes('po-') ||
      lower.includes('site-exp-')
    ) {
      // Find matching bill by Party Name, Bill Number, or Date
      const matchedBills = inMemoryBills.filter(b => {
        const partyMatch = lower.includes(b.partyName.toLowerCase()) || b.partyName.toLowerCase().split(' ').some(w => w.length > 3 && lower.includes(w));
        const numMatch = lower.includes(b.billNumber.toLowerCase());
        const dateMatch = lower.includes(b.dueDate.toLowerCase()) || lower.includes(b.dueDate.replace(/-/g, ' '));
        const descMatch = b.description.toLowerCase().split(' ').some(w => w.length > 4 && lower.includes(w));
        return partyMatch || numMatch || dateMatch || descMatch;
      });

      if (matchedBills.length > 0) {
        const bill = matchedBills[0];
        const statusBadge = bill.status === 'paid' ? '✅ PAID' : bill.status === 'pending' ? '⏳ PENDING' : '🚨 OVERDUE';
        const reply = `🧾 *Particular Bill Details Found*\n\n📄 *Invoice No:* ${bill.billNumber}\n🏢 *Party Name:* ${bill.partyName}\n💵 *Base Amount:* ₹${bill.amount.toLocaleString('en-IN')}\n📑 *GST (18%):* ₹${bill.gstAmount.toLocaleString('en-IN')}\n💰 *Total Amount:* ₹${bill.totalAmount.toLocaleString('en-IN')}\n📅 *Due Date:* ${bill.dueDate}\n🚦 *Payment Status:* ${statusBadge}\n📝 *Description:* ${bill.description}\n📍 *Site Reference:* ${bill.siteReference || 'Head Office'}`;

        return {
          handled: true,
          type: 'bill',
          reply,
          data: bill,
        };
      }

      // Check if general date is queried e.g. "bills of 2026-10-25" or "bills of October"
      const dateOnlyMatch = inMemoryBills.filter(b => lower.includes(b.dueDate) || lower.includes(b.createdAt.toLowerCase()));
      if (dateOnlyMatch.length > 0) {
        const bill = dateOnlyMatch[0];
        const reply = `🧾 *Bill Found for Date ${bill.dueDate}*\n\n📄 *Invoice:* ${bill.billNumber} (${bill.partyName})\n💰 *Total Value:* ₹${bill.totalAmount.toLocaleString('en-IN')}\n🚦 *Status:* ${bill.status.toUpperCase()}\n📝 *Details:* ${bill.description}`;
        return {
          handled: true,
          type: 'bill',
          reply,
          data: bill,
        };
      }

      // General Bill Ledger Summary
      const pendingTotal = inMemoryBills.filter(b => b.status === 'pending').reduce((acc, b) => acc + b.totalAmount, 0);
      const paidTotal = inMemoryBills.filter(b => b.status === 'paid').reduce((acc, b) => acc + b.totalAmount, 0);
      const billsList = inMemoryBills.map(b => 
        `• *${b.billNumber}* (${b.partyName}): ₹${b.totalAmount.toLocaleString('en-IN')} [${b.status.toUpperCase()}] Due: ${b.dueDate}`
      ).join('\n');

      const reply = `💰 *Commercial Ledger & Bills Summary*\n\n⏳ *Pending Receivables:* ₹${pendingTotal.toLocaleString('en-IN')}\n✅ *Settled Amount:* ₹${paidTotal.toLocaleString('en-IN')}\n\n*Recent Invoices:*\n${billsList}\n\n_To check a particular invoice, ask with the party name (e.g. "bill for Bharat Infrastructure") or date (e.g. "bill on 2026-10-25")._`;

      return {
        handled: true,
        type: 'bill',
        reply,
        data: { pendingTotal, paidTotal, bills: inMemoryBills },
      };
    }

    return {
      handled: false,
      type: 'general',
      reply: '',
    };
  },

  // -------------------------------------------------------------
  // Natural Language Chat Processor for Application Team Chat
  // Extracts data (Attendance, Inventory, Bills) & responds with AI intelligence
  // -------------------------------------------------------------
  parseAndExecuteOpsChat: async (
    senderName: string,
    senderRole: 'manager' | 'staff' | 'client' | 'admin',
    text: string,
    category?: 'general' | 'attendance' | 'inventory' | 'billing' | 'query'
  ) => {
    const lower = text.toLowerCase().trim();
    const isExplicitQuery = 
      text.includes('?') ||
      lower.startsWith('show') ||
      lower.startsWith('what') ||
      lower.startsWith('who') ||
      lower.startsWith('where') ||
      lower.startsWith('tell') ||
      lower.startsWith('kahan') ||
      lower.startsWith('kaha') ||
      lower.startsWith('list') ||
      lower.startsWith('kitna') ||
      lower.startsWith('kaisa') ||
      lower.startsWith('which');

    // 1. Direct Business Intelligence Query Check (e.g. "where is Vikram", "inventory valuation", "who is on site")
    if (isExplicitQuery) {
      const intel = await db.queryBusinessIntelligence(text);
      if (intel.handled) {
        const userMsg = await db.addTeamChatMessage({
          senderName,
          senderRole,
          text,
          category: (intel.type === 'location' ? 'attendance' : intel.type) as any,
          extractedData: {
            type: 'data_query',
            summary: `Query resolved: ${intel.type}`,
            details: intel.data,
          },
        });

        const botReply = await db.addTeamChatMessage({
          senderName: 'BizzUp Operations Bot',
          senderRole: 'bot',
          isBot: true,
          text: intel.reply,
          category: (intel.type === 'location' ? 'attendance' : intel.type) as any,
        });

        return { userMsg, botReply, action: 'query_resolved', data: intel.data };
      }
    }

    // 2. Gemini AI / Operations Copilot Multi-lingual natural language processor
    const business = await db.getBusiness();
    const aiOps = await processOpsChatMessage({
      senderName,
      senderRole,
      text,
      category,
      businessName: business.name || 'BizzUp Enterprise',
    });

    let actionResultData: any = null;

    // 3. Act based on AI intent & extracted structured data:
    if (aiOps.intent === 'attendance') {
      const details = aiOps.extractedData?.details || {};
      const staffName = details.employeeName || senderName;
      const matchedEmp = inMemoryEmployees.find(e => 
        staffName.toLowerCase().includes(e.name.toLowerCase()) || 
        e.name.toLowerCase().includes(staffName.toLowerCase())
      ) || inMemoryEmployees.find(e => senderName.toLowerCase().includes(e.name.toLowerCase()));

      const location = details.location || (matchedEmp ? matchedEmp.currentLocation : 'Sector 62 Site Yard, Noida');
      const labourCount = details.labourCount || 1;
      const labourNamesStr = Array.isArray(details.labourNames) && details.labourNames.length > 0 
        ? ` (${details.labourNames.join(', ')})` 
        : '';
      const notes = `${text}${labourCount > 1 ? ` | Headcount: ${labourCount}${labourNamesStr}` : ''}`;

      const attRecord = await db.addAttendanceRecord({
        employeeId: matchedEmp?.id,
        employeeName: matchedEmp ? matchedEmp.name : staffName,
        role: matchedEmp ? matchedEmp.role : (senderRole === 'staff' ? 'Senior Site Project Engineer' : 'Operations Staff'),
        date: new Date().toISOString().split('T')[0],
        checkInTime: details.checkInTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: (details.status as any) || 'on_site',
        location,
        source: 'chat_app',
        notes,
      });

      if (matchedEmp) {
        await db.updateEmployeeStatus(matchedEmp.id, 'on_site', location, notes);
      }

      actionResultData = attRecord;
    } else if (aiOps.intent === 'inventory') {
      const details = aiOps.extractedData?.details || {};
      const qty = Number(details.quantity) || 25;
      const unit = details.unit || 'units';
      const unitPrice = Number(details.unitPrice) || 3500;
      const totalVal = details.totalValue || (qty * unitPrice);
      const itemName = details.name || 'Industrial Material Stock';
      const warehouse = details.warehouseLocation || 'Sector 62 Site Yard, Noida';

      const newInv = await db.addInventoryItem({
        sku: `SKU-${Date.now().toString().slice(-4)}`,
        name: itemName,
        category: details.category || (itemName.toLowerCase().includes('pump') ? 'Industrial Pumps' : itemName.toLowerCase().includes('cement') ? 'Raw Materials' : 'Valves & Flow Controls'),
        quantity: qty,
        unit,
        unitPrice,
        totalValue: totalVal,
        warehouseLocation: warehouse,
        status: 'in_stock',
      });

      actionResultData = newInv;
    } else if (aiOps.intent === 'billing') {
      const details = aiOps.extractedData?.details || {};
      const amount = Number(details.amount) || 125000;
      const gstAmount = Number(details.gstAmount) || Math.round(amount * 0.18);
      const totalAmount = Number(details.totalAmount) || (amount + gstAmount);
      const party = details.partyName || 'Kaveri Steel Mills';
      const dueDate = details.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];

      const newBill = await db.addBill({
        billNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        partyName: party,
        type: 'sale_invoice',
        amount,
        gstAmount,
        totalAmount,
        dueDate,
        status: 'pending',
        description: details.description || text,
      });

      actionResultData = newBill;
    }

    // 4. Save user message with rich extracted metadata
    const userMsg = await db.addTeamChatMessage({
      senderName,
      senderRole,
      text,
      category: (aiOps.intent === 'site_progress' || aiOps.intent === 'general') ? (category || 'general') : (aiOps.intent as any),
      extractedData: aiOps.extractedData ? {
        ...aiOps.extractedData,
        details: actionResultData || aiOps.extractedData.details,
      } : undefined,
    });

    // 5. Always record and return the intelligent bot reply so staff profile always gets a rich answer
    const botReply = await db.addTeamChatMessage({
      senderName: 'BizzUp Operations Bot',
      senderRole: 'bot',
      isBot: true,
      text: aiOps.botReply,
      category: (aiOps.intent === 'site_progress' || aiOps.intent === 'general') ? (category || 'general') : (aiOps.intent as any),
    });

    return {
      userMsg,
      botReply,
      action: aiOps.action,
      data: actionResultData || aiOps.extractedData?.details,
    };
  },

  // Meta Video Ads AI Autonomous Manager Engine
  getMetaAccount: async (): Promise<MetaAdAccount> => {
    return inMemoryMetaAccount;
  },

  updateMetaAccount: async (updates: Partial<MetaAdAccount>): Promise<MetaAdAccount> => {
    Object.assign(inMemoryMetaAccount, updates, { lastSyncTime: 'Updated just now' });
    return inMemoryMetaAccount;
  },

  getMetaCampaigns: async (): Promise<MetaAdCampaign[]> => {
    return inMemoryMetaCampaigns;
  },

  createMetaCampaign: async (data: Partial<MetaAdCampaign>): Promise<MetaAdCampaign> => {
    const defaultVariations: MetaAdVariation[] = data.variations && data.variations.length > 0 ? data.variations : [
      {
        id: `var_${Date.now()}_1`,
        hookHeadline: 'Direct from Factory • Fast Dispatch Across India',
        primaryText: `Direct procurement from ${data.name || 'our manufacturing unit'}. Best GST pricing and full compliance certs. Tap below to chat directly with our engineering desk on WhatsApp!`,
        headline: 'Verified Quality • Instant WhatsApp Quotation',
        description: 'Tender compliant & certified.',
        callToAction: data.objective === 'lead_generation' ? 'GET_QUOTE' : 'WHATSAPP_MESSAGE',
        language: 'english',
        ctr: 3.2,
        leadsGenerated: 0,
        spend: 0,
        isWinning: true,
        status: 'active',
      },
    ];

    const newCampaign: MetaAdCampaign = {
      id: `camp_meta_${Date.now()}`,
      businessId: activeBusinessId,
      name: data.name || 'New Video Ad Campaign',
      objective: data.objective || 'click_to_whatsapp',
      status: 'active',
      dailyBudget: data.dailyBudget || 1500,
      totalSpend: 0,
      impressions: 120,
      videoViews3s: 85,
      videoCompletions: 34,
      clicks: 12,
      leads: 0,
      costPerLead: 0,
      roas: 1.0,
      targetAudience: data.targetAudience || {
        locations: ['Pan-India', 'Tier-1 Industrial Hubs'],
        ageMin: 25,
        ageMax: 60,
        interests: ['Industrial engineering', 'Contractor', 'B2B Procurement'],
        placements: ['Instagram Reels', 'Facebook Feed'],
      },
      creative: data.creative || {
        id: `cr_vid_${Date.now()}`,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        title: 'Video Creative',
        durationSeconds: 20,
        aspectRatio: '9:16',
        fileSizeMb: 12.0,
        uploadedAt: 'Just now',
      },
      variations: defaultVariations,
      aiRules: data.aiRules || {
        autoPilotEnabled: true,
        maxCostPerLead: 180,
        targetRoas: 3.5,
        autoReallocateBudget: true,
        killUnderperformingVariations: true,
        scaleWinningCreatives: true,
        aiBidStrategy: 'lowest_cost_without_cap',
      },
      aiOptimizationLogs: [
        {
          id: `log_${Date.now()}`,
          timestamp: 'Just now',
          type: 'audit_check',
          message: 'Campaign published to Meta Ad Account act_84920194829. AI Autonomous monitoring active.',
          impact: 'Auto-Pilot active',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    inMemoryMetaCampaigns.unshift(newCampaign);
    return newCampaign;
  },

  updateMetaCampaign: async (id: string, updates: Partial<MetaAdCampaign>): Promise<MetaAdCampaign | null> => {
    const camp = inMemoryMetaCampaigns.find((c) => c.id === id);
    if (camp) {
      Object.assign(camp, updates);
      return camp;
    }
    return null;
  },

  deleteMetaCampaign: async (id: string): Promise<boolean> => {
    const idx = inMemoryMetaCampaigns.findIndex((c) => c.id === id);
    if (idx !== -1) {
      inMemoryMetaCampaigns.splice(idx, 1);
      return true;
    }
    return false;
  },

  getMetaLeads: async (): Promise<MetaAdLead[]> => {
    return inMemoryMetaLeads;
  },

  syncMetaLeadsToPipeline: async (): Promise<{ syncedCount: number; newLeads: SalesLead[] }> => {
    const unsynced = inMemoryMetaLeads.filter((l) => !l.syncedToPipeline);
    const addedSalesLeads: SalesLead[] = [];

    for (const mlead of unsynced) {
      const newLead: SalesLead = {
        id: `lead_meta_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        businessId: activeBusinessId,
        source: 'meta_ads',
        clientName: mlead.clientName,
        phone: mlead.phone,
        productName: mlead.requirement,
        quantity: 'Per inquiry quotation',
        estimatedValue: mlead.estimatedValue || 200000,
        status: 'new',
        aiScore: 92,
        notes: `Meta Video Ad Lead from campaign "${mlead.campaignName}". City: ${mlead.city || 'India'}. Prompt WhatsApp or AI Calling engagement recommended.`,
        createdAt: 'Just now via Meta Ads AI',
      };
      inMemoryLeads.unshift(newLead);
      addedSalesLeads.push(newLead);
      mlead.syncedToPipeline = true;
    }

    return { syncedCount: addedSalesLeads.length, newLeads: addedSalesLeads };
  },

  runMetaAIOptimization: async (campaignId: string): Promise<{ campaign: MetaAdCampaign; log: MetaAIOptimizationLog }> => {
    const camp = inMemoryMetaCampaigns.find((c) => c.id === campaignId) || inMemoryMetaCampaigns[0];

    // Find best variation
    let bestVar = camp.variations[0];
    for (const v of camp.variations) {
      if (v.ctr > (bestVar?.ctr || 0) && v.status === 'active') {
        bestVar = v;
      }
    }

    if (bestVar) {
      bestVar.isWinning = true;
    }

    // Check if any variation has low CTR
    let killedCount = 0;
    camp.variations.forEach((v) => {
      if (v.ctr < 2.0 && v.status === 'active' && camp.variations.length > 1) {
        v.status = 'paused_by_ai';
        v.isWinning = false;
        killedCount++;
      }
    });

    // Simulate AI Telemetry improvement
    const addedSpend = Math.floor(250 + Math.random() * 200);
    const addedLeads = Math.floor(2 + Math.random() * 3);
    const addedViews = Math.floor(800 + Math.random() * 1200);

    camp.totalSpend += addedSpend;
    camp.leads += addedLeads;
    camp.videoViews3s += addedViews;
    camp.impressions += addedViews * 2;
    camp.clicks += Math.floor(addedViews * 0.08);
    camp.costPerLead = camp.leads > 0 ? Math.round(camp.totalSpend / camp.leads) : 150;
    camp.roas = Number((3.6 + Math.random() * 0.8).toFixed(1));

    // Generate new Meta Lead
    const cities = ['Pune, Maharashtra', 'Surat, Gujarat', 'Faridabad, Haryana', 'Bengaluru, Karnataka', 'Coimbatore, Tamil Nadu'];
    const names = ['Kailash Industrial Supplies', 'Deepak R. (Chief Engineer)', 'Manoj Agarwal (EPC Contractor)', 'Shree Ganesh Engineering'];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const newMetaLead: MetaAdLead = {
      id: `mlead_${Date.now()}`,
      campaignId: camp.id,
      campaignName: camp.name,
      clientName: randomName,
      phone: `+91 ${Math.floor(98000 + Math.random() * 1999)} ${Math.floor(10000 + Math.random() * 89999)}`,
      city: randomCity,
      requirement: `Generated from Video Ad Hook: "${bestVar?.hookHeadline || camp.name}". Ready for WhatsApp follow-up.`,
      estimatedValue: Math.floor(150000 + Math.random() * 250000),
      createdAt: 'Just now',
      syncedToPipeline: false,
    };
    inMemoryMetaLeads.unshift(newMetaLead);

    const newLog: MetaAIOptimizationLog = {
      id: `log_${Date.now()}`,
      timestamp: 'Just now',
      type: killedCount > 0 ? 'variation_killed' : 'budget_scaled',
      message: killedCount > 0
        ? `AI Auto-Pilot paused ${killedCount} underperforming variation(s) with CTR < 2.0%. Funneled daily budget to winning hook "${bestVar?.headline}".`
        : `AI Auto-Pilot scaled winning video hook "${bestVar?.headline}". Bidding algorithm adjusted for WhatsApp conversions.`,
      impact: `+${addedLeads} High Intent Leads Generated • CPL at ₹${camp.costPerLead}`,
    };

    camp.aiOptimizationLogs.unshift(newLog);

    return { campaign: camp, log: newLog };
  },
};

