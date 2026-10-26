export type SubscriptionTier = 'starter' | 'growth' | 'premium';

export interface Business {
  id: string;
  name: string;
  category: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  gstNumber?: string;
  address?: string;
  status?: 'active' | 'pending' | 'suspended';
  subscriptionTier: SubscriptionTier;
  catalogSize: number;
  monthlyQuota: {
    whatsappMessages: number;
    whatsappMessagesUsed: number;
    aiCalls: number;
    aiCallsUsed: number;
    aiCallingMinutes?: number;
    aiCallingMinutesUsed?: number;
    managerReports: number;
    managerReportsUsed: number;
  };
  createdAt: string;
}

export type StaffRoleCategory = 
  | 'business_owner'
  | 'project_manager'
  | 'site_manager'
  | 'site_engineer' 
  | 'site_supervisor' 
  | 'worker'
  | 'tender_manager' 
  | 'dispatch_manager' 
  | 'sales_rep';

export interface Employee {
  id: string;
  businessId: string;
  name: string;
  role: string;
  roleCategory: StaffRoleCategory;
  siteName: string; // e.g. "Sector 62 Metro Depot Site" or "IOCL Refinery Project"
  phone: string;
  staffId: string; // Auto-generated ID e.g. "EMP-NOIDA-409" or "TNDR-MGR-102"
  password: string; // Auto-generated password e.g. "pass_8392"
  status: 'active' | 'on_site' | 'on_break' | 'offline';
  currentLocation: string;
  lastUpdate: string;
  lastReportNote: string;
  assignedTasks: number;
  // Hierarchy & Tender/Project assignment:
  projectTender?: string; // Tender/Project assigned to, e.g. "Metro Rail Phase 4 (Tender #MR-402)"
  tenderCode?: string; // e.g. "TNDR-MR-402"
  reportingManagerId?: string; // Manager or Supervisor they report to
  reportingManagerName?: string; // Manager or Supervisor name
  assignedBy?: string; // e.g. "Business Owner" or "Project Manager"
  // Working Hours & Salary tracking:
  workingHoursToday?: number; // e.g. 8.5
  overtimeHoursToday?: number; // e.g. 1.5
  totalHoursMonth?: number; // e.g. 176
  dailyWageRate?: number; // e.g. 850 for worker, 2500 for engineer
  monthlySalary?: number; // e.g. 25000, 65000
  overtimeRate?: number; // e.g. 150/hr
  salaryStatus?: 'paid' | 'pending' | 'processing' | 'approved';
  skillSpecialty?: string; // e.g. "Civil Engineering", "Welding & Fabrication", "Safety"
}

export interface SalesLead {
  id: string;
  businessId: string;
  source: 'indiamart' | 'google_shop' | 'whatsapp' | 'website' | 'meta_ads';
  clientName: string;
  phone: string;
  productName: string;
  quantity: string;
  estimatedValue: number;
  status: 'new' | 'contacted' | 'negotiation' | 'converted' | 'lost';
  aiScore: number; // 0-100 hotness
  notes: string;
  createdAt: string;
}

export interface ManagerReport {
  id: string;
  businessId: string;
  reporterName: string;
  reporterRole: 'project_manager' | 'tender_manager' | 'operations_head';
  title: string;
  summary: string;
  tenderCode?: string;
  budgetStatus?: string;
  risksAlerts: string[];
  aiActionItems: string[];
  submissionChannel: 'whatsapp' | 'portal';
  createdAt: string;
}

export interface AICall {
  id: string;
  businessId: string;
  recipientName: string;
  phone: string;
  direction: 'outbound' | 'inbound';
  goal: 'lead_qualification' | 'tender_followup' | 'payment_reminder' | 'order_confirmation';
  status: 'completed' | 'in_progress' | 'scheduled';
  durationSeconds: number;
  transcript: Array<{ speaker: 'agent' | 'client'; text: string; time: string }>;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'urgent' | 'negative';
  audioUrl?: string;
  createdAt: string;
}

export interface WhatsAppMessage {
  id: string;
  businessId: string;
  senderPhone: string;
  senderName: string;
  text: string;
  isBot: boolean;
  intent?: 'employee_status' | 'sales_inquiry' | 'report_submission' | 'ai_call_request' | 'bill_query' | 'general';
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface Bill {
  id: string;
  businessId: string;
  billNumber: string;
  partyName: string;
  type: 'sale_invoice' | 'vendor_purchase' | 'site_expense' | 'transport';
  amount: number;
  gstAmount: number;
  totalAmount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  siteReference?: string;
  createdAt: string;
}

export interface MarketingConnector {
  id: string;
  businessId: string;
  platform: 'indiamart' | 'google_shopping' | 'google_ads' | 'gem_portal' | 'meta_whatsapp';
  name: string;
  status: 'connected' | 'syncing' | 'disconnected';
  lastSynced: string;
  leadsIngested: number;
  apiKeyOrGluskey: string;
  webhookUrl: string;
}

export interface BusinessResearch {
  id: string;
  topic: string;
  category: 'market_rates' | 'competitor_tender' | 'supplier_hedging' | 'regulation';
  headline: string;
  analysis: string;
  actionRecommendation: string;
  confidenceScore: number;
  updatedAt: string;
}

export interface AdminStats {
  totalClients: number;
  activeAgents: number;
  totalMonthlyRevenue: number;
  totalMessagesProcessed: number;
  totalCallsDialed: number;
  neonConnected: boolean;
  geminiModelActive: string;
}

export interface InventoryItem {
  id: string;
  businessId: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  warehouseLocation: string;
  status: 'in_stock' | 'low_stock' | 'critical';
  lastUpdated: string;
}

export interface AttendanceRecord {
  id: string;
  businessId: string;
  employeeId?: string;
  employeeName: string;
  role: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  workingHours?: number; // e.g. 8.5
  overtimeHours?: number; // e.g. 1.5
  status: 'present' | 'on_site' | 'on_break' | 'absent' | 'half_day';
  location: string;
  projectTender?: string; // Tender/Project assigned to
  reportingManagerName?: string; // Reporting Supervisor/Manager
  dailyWage?: number; // Base wage rate for day
  overtimePay?: number; // Extra pay for overtime
  totalPayable?: number; // Total calculated salary payable
  salaryStatus?: 'paid' | 'pending' | 'approved'; // Payment approval status
  source: 'chat_app' | 'whatsapp' | 'staff_portal' | 'manual';
  notes: string;
  createdAt: string;
}

export interface TeamChatMessage {
  id: string;
  businessId: string;
  senderName: string;
  senderRole: 'manager' | 'staff' | 'client' | 'admin' | 'bot';
  senderAvatar?: string;
  text: string;
  category: 'general' | 'attendance' | 'inventory' | 'billing' | 'query';
  extractedData?: {
    type: 'attendance_log' | 'inventory_update' | 'bill_record' | 'data_query' | 'site_progress' | 'none';
    summary?: string;
    targetId?: string;
    details?: any;
  };
  timestamp: string;
  isBot?: boolean;
}

// Meta Video Ads AI Autonomous Manager Types
export interface MetaAdAccount {
  id: string;
  businessId: string;
  adAccountId: string;
  pageName: string;
  pageId: string;
  instagramHandle: string;
  accessToken: string;
  pixelId?: string;
  currency: string;
  status: 'connected' | 'disconnected' | 'token_expired';
  dailySpendCap: number;
  currentBalance: number;
  apiVersion: string;
  lastSyncTime: string;
}

export type MetaAdObjective = 
  | 'click_to_whatsapp' 
  | 'lead_generation' 
  | 'website_conversions' 
  | 'video_views';

export interface MetaAdVariation {
  id: string;
  hookHeadline: string; // Hook script / top banner for first 3 seconds
  primaryText: string; // Post body caption
  headline: string; // Link card headline
  description?: string;
  callToAction: 'WHATSAPP_MESSAGE' | 'LEARN_MORE' | 'GET_QUOTE' | 'CONTACT_US' | 'ORDER_NOW';
  language: 'hinglish' | 'english';
  ctr: number; // e.g. 3.4
  leadsGenerated: number;
  spend: number;
  isWinning?: boolean;
  status: 'active' | 'paused_by_ai' | 'testing';
}

export interface MetaVideoCreative {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  durationSeconds: number;
  aspectRatio: '9:16' | '1:1' | '16:9';
  fileSizeMb?: number;
  uploadedAt: string;
}

export interface MetaAIOptimizationRule {
  autoPilotEnabled: boolean;
  maxCostPerLead: number; // Target CPL limit in INR
  targetRoas: number; // Target ROAS multiplier e.g. 3.5
  autoReallocateBudget: boolean;
  killUnderperformingVariations: boolean;
  scaleWinningCreatives: boolean;
  aiBidStrategy: 'lowest_cost_without_cap' | 'cost_cap' | 'target_roas';
}

export interface MetaAIOptimizationLog {
  id: string;
  timestamp: string;
  type: 'budget_scaled' | 'variation_killed' | 'audience_refined' | 'bid_adjusted' | 'audit_check' | 'lead_sync';
  message: string;
  impact: string;
}

export interface MetaAdCampaign {
  id: string;
  businessId: string;
  name: string;
  objective: MetaAdObjective;
  status: 'active' | 'learning' | 'paused' | 'completed';
  dailyBudget: number; // In INR e.g. 1500
  totalSpend: number;
  impressions: number;
  videoViews3s: number;
  videoCompletions: number;
  clicks: number;
  leads: number;
  costPerLead: number;
  roas: number;
  targetAudience: {
    locations: string[];
    ageMin: number;
    ageMax: number;
    interests: string[];
    placements: string[];
  };
  creative: MetaVideoCreative;
  variations: MetaAdVariation[];
  aiRules: MetaAIOptimizationRule;
  aiOptimizationLogs: MetaAIOptimizationLog[];
  createdAt: string;
}

export interface MetaAdLead {
  id: string;
  campaignId: string;
  campaignName: string;
  clientName: string;
  phone: string;
  city?: string;
  requirement: string;
  estimatedValue: number;
  createdAt: string;
  syncedToPipeline: boolean;
}

