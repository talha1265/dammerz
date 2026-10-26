'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Zap, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  RefreshCw, 
  Eye, 
  Sliders, 
  Globe, 
  MessageSquare, 
  PhoneCall, 
  DollarSign, 
  ShieldCheck, 
  ExternalLink,
  Copy,
  ChevronRight,
  Flame,
  Settings,
  X,
  Volume2,
  Share2,
  Heart,
  Bookmark,
  MoreVertical,
  Plus,
  Search,
  Filter,
  Smartphone,
  Check,
  Video,
  Layers,
  ArrowUpRight,
  BarChart3,
  Clock,
  ThumbsUp,
  MessageCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import { 
  MetaAdAccount, 
  MetaAdCampaign, 
  MetaAdVariation, 
  MetaVideoCreative, 
  MetaAdLead, 
  MetaAIOptimizationLog,
  Business
} from '@/lib/types';

interface MetaAdsManagerHubProps {
  business: Business;
  onRefreshData?: () => void;
  onTriggerCall?: (lead: any) => void;
}

const SAMPLE_VIDEO_TEMPLATES = [
  {
    id: 'tmpl_1',
    title: 'Industrial Factory Tour & Hydro-Pressure Testing',
    categoryTag: 'Tender & Quality Proof',
    badgeText: 'HOT B2B HOOK',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    aspectRatio: '9:16' as const,
    durationSeconds: 24,
    recommendedFor: 'Industrial Manufacturing, Valves, Pipes & Heavy Hardware',
    hookScore: '96% Hook Hold Rate',
  },
  {
    id: 'tmpl_2',
    title: 'High Pressure Water Pump Flow Rate Demo',
    categoryTag: 'Performance Benchmark',
    badgeText: 'HIGH CONVERSION',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
    aspectRatio: '1:1' as const,
    durationSeconds: 28,
    recommendedFor: 'Submersible Pumps, Motors & Agriculture Equipment',
    hookScore: '92% Hook Hold Rate',
  },
  {
    id: 'tmpl_3',
    title: 'Central Logistics Dispatch & Milestone Packaging',
    categoryTag: 'Wholesale Speed Proof',
    badgeText: '48-HR DISPATCH',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    aspectRatio: '9:16' as const,
    durationSeconds: 20,
    recommendedFor: 'Tender Suppliers, Bulk Wholesale & Fast Dispatch Proof',
    hookScore: '94% Hook Hold Rate',
  },
];

export default function MetaAdsManagerHub({ business, onRefreshData, onTriggerCall }: MetaAdsManagerHubProps) {
  const [account, setAccount] = useState<MetaAdAccount | null>(null);
  const [campaigns, setCampaigns] = useState<MetaAdCampaign[]>([]);
  const [leads, setLeads] = useState<MetaAdLead[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [optimizingId, setOptimizingId] = useState<string | null>(null);
  const [syncingLeads, setSyncingLeads] = useState(false);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'create' | 'leads' | 'logs'>('campaigns');

  // Interactive Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Preview States
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [previewCampaign, setPreviewCampaign] = useState<MetaAdCampaign | null>(null);
  const [mockupPlatform, setMockupPlatform] = useState<'instagram' | 'facebook'>('instagram');

  // Form State for Launching Campaign
  const [campaignName, setCampaignName] = useState('');
  const [objective, setObjective] = useState<'click_to_whatsapp' | 'lead_generation'>('click_to_whatsapp');
  const [selectedVideo, setSelectedVideo] = useState(SAMPLE_VIDEO_TEMPLATES[0]);
  const [customVideoFile, setCustomVideoFile] = useState<File | null>(null);
  const [customVideoUrl, setCustomVideoUrl] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [productKeyword, setProductKeyword] = useState('Heavy Butterfly Valves & Industrial Flow Equipment');
  const [dailyBudget, setDailyBudget] = useState(1500);
  const [autoPilot, setAutoPilot] = useState(true);

  // Gemini AI Generated Copy
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiVariations, setAiVariations] = useState<MetaAdVariation[]>([]);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isEditingCopy, setIsEditingCopy] = useState(false);

  // Targeting & Interest Tags
  const [targetInterests, setTargetInterests] = useState<string[]>([
    'Industrial engineering',
    'Tender bidding',
    'Civil contractor',
    'B2B Wholesale',
    'Piping & Infrastructure',
  ]);
  const [newTagInput, setNewTagInput] = useState('');

  // Leads Filter & Search
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsFilter, setLeadsFilter] = useState<'all' | 'synced' | 'pending'>('all');

  // Account Edit Form
  const [editAdAccountId, setEditAdAccountId] = useState('');
  const [editPageName, setEditPageName] = useState('');
  const [editInstagramHandle, setEditInstagramHandle] = useState('');
  const [editAccessToken, setEditAccessToken] = useState('');
  const [editDailyCap, setEditDailyCap] = useState(8000);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/meta-ads');
      const data = await res.json();
      if (data.success) {
        setAccount(data.account);
        setCampaigns(data.campaigns);
        setLeads(data.leads);
        setStats(data.summaryStats);
        if (data.account) {
          setEditAdAccountId(data.account.adAccountId);
          setEditPageName(data.account.pageName);
          setEditInstagramHandle(data.account.instagramHandle);
          setEditAccessToken(data.account.accessToken);
          setEditDailyCap(data.account.dailySpendCap);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle local video file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomVideoFile(file);
      const localUrl = URL.createObjectURL(file);
      setCustomVideoUrl(localUrl);
      showNotification(`Video uploaded: ${file.name}`);
    }
  };

  // Generate Ad Hooks with Gemini AI
  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/meta-ads/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productOrService: productKeyword,
          businessCategory: business.category,
          businessName: business.name,
          objective,
          language: 'dual',
          videoNotes: selectedVideo.title,
        }),
      });
      const data = await res.json();
      if (data.success && data.aiGenerated) {
        const vars: MetaAdVariation[] = data.aiGenerated.variations.map((v: any, i: number) => ({
          id: `gen_var_${Date.now()}_${i}`,
          hookHeadline: v.hookHeadline,
          primaryText: v.primaryText,
          headline: v.headline,
          description: v.description || 'Verified quality & immediate dispatch.',
          callToAction: v.callToAction || 'WHATSAPP_MESSAGE',
          language: v.language || 'english',
          ctr: Number((3.4 + Math.random() * 1.4).toFixed(1)),
          leadsGenerated: 0,
          spend: 0,
          isWinning: i === 0,
          status: 'active' as const,
        }));
        setAiVariations(vars);
        setSelectedVariationIndex(0);

        if (data.aiGenerated.targeting?.interests) {
          setTargetInterests(data.aiGenerated.targeting.interests);
        }
        if (data.aiGenerated.budgetRecommendation?.dailyBudgetINR) {
          setDailyBudget(data.aiGenerated.budgetRecommendation.dailyBudgetINR);
        }
        showNotification('Gemini AI created 3 high-converting hooks & targeting!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Preload default variations on first view of create tab
  useEffect(() => {
    if (activeTab === 'create' && aiVariations.length === 0) {
      handleGenerateAI();
      if (!campaignName) {
        setCampaignName(`${business.name.split(' ')[0]} - Video Reels WhatsApp Campaign`);
      }
    }
  }, [activeTab]);

  // Run Autonomous AI Optimization cycle
  const handleRunAIOptimization = async (campaignId: string) => {
    setOptimizingId(campaignId);
    try {
      const res = await fetch('/api/meta-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'optimize_ai', campaignId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        if (onRefreshData) onRefreshData();
        showNotification(`⚡ AI Auto-Pilot: ${data.log?.impact || 'Optimization cycle completed'}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOptimizingId(null);
    }
  };

  // Scale Campaign Budget Shortcut
  const handleScaleBudget = async (camp: MetaAdCampaign) => {
    const newBudget = Math.round(camp.dailyBudget * 1.2);
    try {
      const res = await fetch('/api/meta-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_budget', campaignId: camp.id, budget: newBudget }),
      });
      if (res.ok) {
        fetchData();
        showNotification(`Scaled daily budget to ₹${newBudget.toLocaleString('en-IN')}/day (+20%)`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Sync Meta Leads to BizzUp CRM
  const handleSyncLeads = async () => {
    setSyncingLeads(true);
    try {
      const res = await fetch('/api/meta-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_leads' }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        if (onRefreshData) onRefreshData();
        showNotification(`✅ ${data.syncedCount} Meta leads synced to your Sales Pipeline & CRM!`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncingLeads(false);
    }
  };

  // Toggle Campaign Pause/Active
  const handleToggleStatus = async (camp: MetaAdCampaign) => {
    const newStatus = camp.status === 'active' ? 'paused' : 'active';
    try {
      const res = await fetch('/api/meta-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_status', campaignId: camp.id, status: newStatus }),
      });
      if (res.ok) {
        fetchData();
        showNotification(`Campaign ${newStatus === 'active' ? 'Activated' : 'Paused'}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Meta Account Settings
  const handleSaveAccount = async () => {
    try {
      const res = await fetch('/api/meta-ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adAccountId: editAdAccountId,
          pageName: editPageName,
          instagramHandle: editInstagramHandle,
          accessToken: editAccessToken,
          dailySpendCap: Number(editDailyCap),
          status: 'connected',
        }),
      });
      if (res.ok) {
        setShowAccountModal(false);
        fetchData();
        showNotification('Meta Ad Account settings updated & verified!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Interest Tag
  const handleAddInterestTag = () => {
    if (newTagInput.trim() && !targetInterests.includes(newTagInput.trim())) {
      setTargetInterests([...targetInterests, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveInterestTag = (tag: string) => {
    setTargetInterests(targetInterests.filter((t) => t !== tag));
  };

  // Copy to clipboard
  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Submit & Deploy New Campaign
  const handleDeployCampaign = async () => {
    const activeCreativeVideoUrl = customVideoUrl || selectedVideo.videoUrl;
    const activeThumbnail = customVideoUrl 
      ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' 
      : selectedVideo.thumbnailUrl;

    const variationsToDeploy = aiVariations.length > 0 ? aiVariations : [
      {
        id: `var_${Date.now()}_1`,
        hookHeadline: 'Direct from Factory • Fast Dispatch Across India',
        primaryText: `Direct procurement from ${business.name}. Best GST pricing and full compliance certs. Tap below to chat directly with our engineering desk on WhatsApp! 📲`,
        headline: 'Verified Quality • Instant WhatsApp Quotation',
        description: 'Tender compliant & ISO certified.',
        callToAction: objective === 'lead_generation' ? ('GET_QUOTE' as const) : ('WHATSAPP_MESSAGE' as const),
        language: 'english' as const,
        ctr: 3.8,
        leadsGenerated: 0,
        spend: 0,
        isWinning: true,
        status: 'active' as const,
      },
    ];

    const newCampPayload = {
      name: campaignName || `${business.name.split(' ')[0]} - Meta Video Reel Ad`,
      objective,
      dailyBudget: Number(dailyBudget),
      creative: {
        id: `cr_vid_${Date.now()}`,
        videoUrl: activeCreativeVideoUrl,
        thumbnailUrl: activeThumbnail,
        title: customVideoFile ? customVideoFile.name : selectedVideo.title,
        durationSeconds: selectedVideo.durationSeconds,
        aspectRatio,
        fileSizeMb: 14.5,
        uploadedAt: 'Just now',
      },
      variations: variationsToDeploy,
      targetAudience: {
        locations: ['Pan-India', 'Delhi NCR', 'Pune MIDC', 'Ahmedabad', 'Bengaluru'],
        ageMin: 25,
        ageMax: 58,
        interests: targetInterests,
        placements: aspectRatio === '9:16' ? ['Instagram Reels', 'Facebook Feed', 'Instagram Stories'] : ['Facebook Feed', 'Instagram Feed'],
      },
      aiRules: {
        autoPilotEnabled: autoPilot,
        maxCostPerLead: 180,
        targetRoas: 3.5,
        autoReallocateBudget: true,
        killUnderperformingVariations: true,
        scaleWinningCreatives: true,
        aiBidStrategy: 'lowest_cost_without_cap' as const,
      },
    };

    try {
      const res = await fetch('/api/meta-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_campaign', campaignData: newCampPayload }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('🚀 Campaign Deployed! AI Auto-Pilot is now running ads.');
        setActiveTab('campaigns');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeVariation = aiVariations[selectedVariationIndex] || {
    hookHeadline: 'Direct from Factory • Fast Dispatch Across India',
    primaryText: `Direct procurement from ${business.name}. Best GST pricing and full compliance certs. Tap below to chat directly with our engineering desk on WhatsApp! 📲`,
    headline: 'Verified Quality • Instant WhatsApp Quotation',
    callToAction: 'WHATSAPP_MESSAGE',
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch = 
      l.clientName.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.phone.includes(leadsSearch) ||
      (l.city && l.city.toLowerCase().includes(leadsSearch.toLowerCase())) ||
      l.requirement.toLowerCase().includes(leadsSearch.toLowerCase());
    
    if (!matchesSearch) return false;
    if (leadsFilter === 'synced') return l.syncedToPipeline;
    if (leadsFilter === 'pending') return !l.syncedToPipeline;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.86rem',
          fontWeight: 600,
          animation: 'fadeInUp 0.3s ease',
        }}>
          <Sparkles size={16} />
          {toastMessage}
        </div>
      )}

      {/* TOP HEADER & ACCOUNT STRIP */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        background: 'linear-gradient(135deg, rgba(24, 119, 242, 0.12) 0%, rgba(13, 17, 26, 0.95) 100%)',
        border: '1px solid rgba(24, 119, 242, 0.28)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
            {/* Meta Brand Emblem */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1877f2 0%, #0064e0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(24, 119, 242, 0.45)',
            }}>
              <Globe size={22} color="#fff" />
            </div>

            <h2 style={{ fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.02em', fontWeight: 800 }}>
              Meta Video Ads AI Autonomous Manager
            </h2>

            <span className="badge" style={{
              background: 'rgba(24, 119, 242, 0.16)',
              color: '#60a5fa',
              border: '1px solid rgba(24, 119, 242, 0.35)',
            }}>
              <span className="pulse-indicator" style={{ width: '6px', height: '6px', background: '#3b82f6' }} />
              API v21.0 VERIFIED
            </span>

            <span className="badge badge-whatsapp shimmer-badge">
              AI AUTOPILOT RUNNING
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '820px' }}>
            Upload or select your product video, connect your Meta ad account, and Gemini AI will craft attention hooks, target B2B buyers, and autonomously optimize Instagram Reels & Facebook Click-to-WhatsApp ads.
          </p>

          {/* Account Details Strip */}
          {account && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '14px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '6px' }}>
                <ShieldCheck size={14} color="#3b82f6" />
                <span>Account: <strong style={{ color: '#fff' }}>{account.adAccountId}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '6px' }}>
                <Globe size={14} color="var(--brand-primary-light)" />
                <span>Page: <strong style={{ color: 'var(--brand-primary-light)' }}>{account.pageName}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '6px' }}>
                <Smartphone size={14} color="#ec4899" />
                <span>Handle: <strong style={{ color: '#ec4899' }}>{account.instagramHandle}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '6px' }}>
                <DollarSign size={14} color="var(--brand-amber)" />
                <span>Cap: <strong style={{ color: 'var(--brand-amber)' }}>₹{account.dailySpendCap.toLocaleString('en-IN')}/day</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowAccountModal(true)} 
            className="btn btn-outline" 
            style={{ fontSize: '0.82rem', borderColor: 'rgba(24, 119, 242, 0.4)', color: '#93c5fd' }}
          >
            <Settings size={14} /> Connect / Edit Meta Account
          </button>

          <button 
            onClick={handleSyncLeads} 
            disabled={syncingLeads}
            className="btn btn-outline" 
            style={{ fontSize: '0.82rem', borderColor: 'var(--brand-whatsapp)', color: 'var(--brand-whatsapp)' }}
          >
            <Share2 size={14} /> {syncingLeads ? 'Syncing...' : 'Sync Leads to CRM'}
          </button>

          <button 
            onClick={() => setActiveTab('create')} 
            className="btn btn-primary" 
            style={{ fontSize: '0.82rem' }}
          >
            <Plus size={14} /> + Launch New Video Ad
          </button>
        </div>
      </div>

      {/* METRICS TELEMETRY GRID */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
          
          <div className="glass-panel" style={{ padding: '18px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Meta Ad Spend</span>
              <DollarSign size={16} color="var(--brand-amber)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-amber)' }}>
              ₹{stats.totalSpend.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--brand-whatsapp)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> ₹{account?.dailySpendCap.toLocaleString('en-IN') || 8000} Max Daily Guardrail
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Leads / WhatsApp Chats</span>
              <MessageSquare size={16} color="var(--brand-whatsapp)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
              {stats.totalLeads} Direct Leads
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--brand-whatsapp)', marginTop: '4px' }}>
              ● 100% Ingested to Sales Pipeline
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Cost Per Lead (CPL)</span>
              <Zap size={16} color="#60a5fa" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa' }}>
              ₹{stats.avgCpl}
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--brand-whatsapp)', marginTop: '4px' }}>
              ● 42% lower than Google Search B2B
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Video 3s Hook Rate</span>
              <Eye size={16} color="#c084fc" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c084fc' }}>
              {(stats.total3sViews / 1000).toFixed(1)}k Views
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              ● 61.2% ThruPlay Completion
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Autonomous AI ROAS</span>
              <Flame size={16} color="var(--brand-rose)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-rose)' }}>
              {stats.avgRoas}x Return
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--brand-whatsapp)', marginTop: '4px' }}>
              ● Gemini real-time bid calibration
            </div>
          </div>

        </div>
      )}

      {/* NAVIGATION TABS WITH PILL BADGES */}
      <div style={{
        display: 'flex',
        gap: '10px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '10px',
        overflowX: 'auto',
      }}>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`btn ${activeTab === 'campaigns' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.85rem', padding: '8px 20px', borderRadius: '10px' }}
        >
          <Video size={15} /> Active Video Campaigns ({campaigns.length})
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`btn ${activeTab === 'create' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.85rem', padding: '8px 20px', borderRadius: '10px' }}
        >
          <Sparkles size={15} /> Launch Video Ad (AI Auto-Pilot)
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`btn ${activeTab === 'leads' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.85rem', padding: '8px 20px', borderRadius: '10px' }}
        >
          <MessageSquare size={15} /> Meta Ad Leads ({leads.length})
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`btn ${activeTab === 'logs' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.85rem', padding: '8px 20px', borderRadius: '10px' }}
        >
          <Layers size={15} /> AI Optimization Logs
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ACTIVE VIDEO CAMPAIGNS */}
      {/* ======================================================== */}
      {activeTab === 'campaigns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {campaigns.length === 0 ? (
            <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
              <Globe size={48} color="var(--brand-primary-light)" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Meta Video Campaigns Running Yet</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 20px' }}>
                Upload your product video, select your Meta Ad account, and let Gemini AI create and run high-converting Click-to-WhatsApp ads.
              </p>
              <button onClick={() => setActiveTab('create')} className="btn btn-primary">
                + Launch Your First Video Ad
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '22px' }}>
              {campaigns.map((camp) => {
                const winningVar = camp.variations.find((v) => v.isWinning) || camp.variations[0];
                const isOptimizing = optimizingId === camp.id;
                const spendPercentage = Math.min(100, Math.round((camp.totalSpend / (camp.dailyBudget * 10)) * 100));

                return (
                  <div key={camp.id} className="glass-panel" style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '18px',
                    border: camp.status === 'active' ? '1px solid rgba(37, 211, 102, 0.35)' : '1px solid var(--border-subtle)',
                    boxShadow: camp.status === 'active' ? '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(37, 211, 102, 0.1)' : 'var(--shadow-md)',
                  }}>
                    
                    <div>
                      {/* Top status bar */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`badge ${camp.status === 'active' ? 'badge-whatsapp' : 'badge-busy'}`}>
                            <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
                            {camp.status === 'active' ? 'ACTIVE (AI AUTOPILOT ON)' : 'PAUSED'}
                          </span>
                          <span className="badge badge-ai" style={{ fontSize: '0.68rem' }}>
                            {camp.objective === 'click_to_whatsapp' ? 'CLICK TO WHATSAPP' : 'LEAD GEN FORM'}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Daily Budget: <strong style={{ color: '#fff' }}>₹{camp.dailyBudget.toLocaleString('en-IN')}/day</strong>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '14px', fontWeight: 700 }}>
                        {camp.name}
                      </h3>

                      {/* Video Player & Performance Snapshot */}
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        
                        {/* Video Element */}
                        <div style={{
                          width: '140px',
                          height: '200px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: '#000',
                          position: 'relative',
                          border: '1px solid var(--border-subtle)',
                          flexShrink: 0,
                          boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                        }}>
                          <video
                            src={camp.creative.videoUrl}
                            poster={camp.creative.thumbnailUrl}
                            controls
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute',
                            top: '6px',
                            left: '6px',
                            background: 'rgba(0,0,0,0.75)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.65rem',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backdropFilter: 'blur(4px)',
                          }}>
                            <Play size={10} /> {camp.creative.aspectRatio}
                          </div>
                        </div>

                        {/* Performance Matrix */}
                        <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Spend / CPL</div>
                              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--brand-amber)' }}>
                                ₹{camp.totalSpend.toLocaleString('en-IN')} <span style={{ fontSize: '0.75rem', color: 'var(--brand-whatsapp)' }}>(₹{camp.costPerLead}/lead)</span>
                              </div>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>WhatsApp Leads</div>
                              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--brand-whatsapp)' }}>
                                {camp.leads} Direct Chats
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Impressions / 3s Views</div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                                {(camp.impressions / 1000).toFixed(1)}k / {(camp.videoViews3s / 1000).toFixed(1)}k
                              </div>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ROAS</div>
                              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--brand-rose)' }}>
                                {camp.roas}x Multiplier
                              </div>
                            </div>
                          </div>

                          {/* Winning Hook Banner */}
                          {winningVar && (
                            <div style={{
                              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(37, 211, 102, 0.1) 100%)',
                              border: '1px solid rgba(99, 102, 241, 0.3)',
                              borderRadius: '8px',
                              padding: '10px 12px',
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--brand-primary-light)', fontWeight: 800, textTransform: 'uppercase' }}>
                                  ★ Winning Video Hook (CTR {winningVar.ctr}%):
                                </span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--brand-whatsapp)', fontWeight: 700 }}>
                                  Auto-Scaled
                                </span>
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#fff', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                "{winningVar.hookHeadline}"
                              </div>
                            </div>
                          )}

                        </div>

                      </div>

                      {/* Target Placements Chips */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
                        {camp.targetAudience.placements.map((p, idx) => (
                          <span key={idx} style={{
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--text-dim)',
                            border: '1px solid var(--border-subtle)',
                          }}>
                            {p}
                          </span>
                        ))}
                      </div>

                    </div>

                    {/* Action Buttons Strip */}
                    <div style={{
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleToggleStatus(camp)}
                          className="btn btn-outline"
                          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                        >
                          {camp.status === 'active' ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Resume</>}
                        </button>

                        <button
                          onClick={() => handleScaleBudget(camp)}
                          className="btn btn-outline"
                          style={{ fontSize: '0.8rem', padding: '6px 12px', color: 'var(--brand-amber)' }}
                          title="Increase daily ad budget by 20%"
                        >
                          <TrendingUp size={13} /> +20% Budget
                        </button>

                        <button
                          onClick={() => setPreviewCampaign(camp)}
                          className="btn btn-outline"
                          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                        >
                          <Eye size={13} /> Ad Mockup
                        </button>
                      </div>

                      <button
                        onClick={() => handleRunAIOptimization(camp.id)}
                        disabled={isOptimizing}
                        className="btn btn-primary"
                        style={{ fontSize: '0.82rem', padding: '7px 16px', boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)' }}
                      >
                        <Sparkles size={14} className={isOptimizing ? 'pulse-indicator' : ''} />
                        {isOptimizing ? 'AI Optimizing...' : 'AI Optimize Now'}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: LAUNCH NEW VIDEO AD CAMPAIGN (CORE WORKFLOW) */}
      {/* ======================================================== */}
      {activeTab === 'create' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(430px, 1fr))', gap: '28px' }}>
          
          {/* LEFT COLUMN: BUILDER & SETTINGS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* STEP 1: VIDEO SELECTION */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>1</div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>Put Video Creative</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select from proven industrial video templates or upload your own video file</div>
                </div>
              </div>

              {/* Template cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {SAMPLE_VIDEO_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedVideo(tmpl);
                      setCustomVideoUrl('');
                      setCustomVideoFile(null);
                      setAspectRatio(tmpl.aspectRatio);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: (!customVideoUrl && selectedVideo.id === tmpl.id) ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0,0,0,0.3)',
                      border: (!customVideoUrl && selectedVideo.id === tmpl.id) ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: '#000', flexShrink: 0, position: 'relative' }}>
                      <img src={tmpl.thumbnailUrl} alt={tmpl.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                        <Play size={14} color="#fff" />
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{tmpl.title}</span>
                        <span className="badge badge-whatsapp" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>{tmpl.badgeText}</span>
                      </div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)' }}>{tmpl.aspectRatio} • {tmpl.durationSeconds}s • {tmpl.recommendedFor}</div>
                    </div>
                    {(!customVideoUrl && selectedVideo.id === tmpl.id) && (
                      <CheckCircle2 size={18} color="var(--brand-whatsapp)" />
                    )}
                  </div>
                ))}
              </div>

              {/* Option B: Local Video File Upload */}
              <div style={{
                border: '1px dashed var(--border-subtle)',
                borderRadius: '10px',
                padding: '18px',
                textAlign: 'center',
                background: customVideoUrl ? 'rgba(37, 211, 102, 0.06)' : 'rgba(255,255,255,0.02)',
              }}>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />

                {customVideoFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <CheckCircle2 size={20} color="var(--brand-whatsapp)" />
                    <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>Loaded: {customVideoFile.name} ({(customVideoFile.size / 1024 / 1024).toFixed(1)}MB)</span>
                    <button
                      onClick={() => {
                        setCustomVideoFile(null);
                        setCustomVideoUrl('');
                      }}
                      className="btn btn-outline"
                      style={{ padding: '3px 10px', fontSize: '0.72rem' }}
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-outline"
                      style={{ fontSize: '0.84rem', padding: '8px 18px', marginBottom: '6px' }}
                    >
                      <Upload size={14} /> Upload Custom MP4 / WebM Video
                    </button>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)' }}>Drag & drop or browse your camera roll / product recordings</div>
                  </div>
                )}
              </div>

              {/* Aspect Ratio Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Video Aspect Ratio:</span>
                {(['9:16', '1:1', '16:9'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className="btn btn-outline ad-format-pill"
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.78rem',
                      background: aspectRatio === ratio ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                      borderColor: aspectRatio === ratio ? 'var(--brand-primary)' : 'var(--border-subtle)',
                      color: aspectRatio === ratio ? '#fff' : 'var(--text-muted)',
                      fontWeight: aspectRatio === ratio ? 700 : 500,
                    }}
                  >
                    {ratio === '9:16' ? '9:16 (Instagram Reels)' : ratio === '1:1' ? '1:1 (Square Feed)' : '16:9 (Landscape)'}
                  </button>
                ))}
              </div>

            </div>

            {/* STEP 2: CAMPAIGN OBJECTIVE & DESTINATION */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>2</div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>Connect Destination & Objective</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Where should interested clients be directed when clicking your video ad?</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div
                  onClick={() => setObjective('click_to_whatsapp')}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    background: objective === 'click_to_whatsapp' ? 'rgba(37, 211, 102, 0.16)' : 'rgba(0,0,0,0.3)',
                    border: objective === 'click_to_whatsapp' ? '1px solid var(--brand-whatsapp)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <MessageSquare size={18} color="var(--brand-whatsapp)" />
                    <strong style={{ fontSize: '0.92rem', color: '#fff' }}>Click to WhatsApp</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    Starts direct conversation with BizzUp AI Sales Agent on your verified WhatsApp. Highest ROI for Indian businesses.
                  </div>
                </div>

                <div
                  onClick={() => setObjective('lead_generation')}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    background: objective === 'lead_generation' ? 'rgba(99, 102, 241, 0.16)' : 'rgba(0,0,0,0.3)',
                    border: objective === 'lead_generation' ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Zap size={18} color="var(--brand-primary-light)" />
                    <strong style={{ fontSize: '0.92rem', color: '#fff' }}>Meta Lead Form</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    Collects customer contact info directly inside Facebook & Instagram without website drop-off.
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Campaign Name</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Apex Industrial - Centrifugal Pumps Video Reel"
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '0.88rem',
                  }}
                />
              </div>

            </div>

            {/* STEP 3: GEMINI AI AD COPY & HOOK GENERATOR */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>3</div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>Gemini AI Ad Hooks & Copy</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Autonomous generation of high-CTR hooks in English & Hinglish</div>
                  </div>
                </div>

                <button
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="btn btn-outline"
                  style={{ fontSize: '0.8rem', padding: '6px 14px', borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc' }}
                >
                  <Sparkles size={14} className={isGeneratingAI ? 'pulse-indicator' : ''} />
                  {isGeneratingAI ? 'Writing with Gemini...' : 'Regenerate Hooks'}
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Product or Equipment Focus
                </label>
                <input
                  type="text"
                  value={productKeyword}
                  onChange={(e) => setProductKeyword(e.target.value)}
                  placeholder="e.g. Industrial Butterfly Valves DN200"
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '0.88rem',
                  }}
                />
              </div>

              {/* Variations Selector Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {aiVariations.map((v, i) => (
                  <button
                    key={v.id || i}
                    onClick={() => setSelectedVariationIndex(i)}
                    className="btn btn-outline"
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '0.78rem',
                      background: selectedVariationIndex === i ? 'rgba(99, 102, 241, 0.25)' : 'rgba(0,0,0,0.3)',
                      borderColor: selectedVariationIndex === i ? 'var(--brand-primary)' : 'var(--border-subtle)',
                      color: selectedVariationIndex === i ? '#fff' : 'var(--text-muted)',
                      fontWeight: selectedVariationIndex === i ? 700 : 500,
                    }}
                  >
                    {i === 0 ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Flame size={12} color="#f59e0b" /> High Urgency
                      </span>
                    ) : i === 1 ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <ShieldCheck size={12} color="var(--brand-whatsapp)" /> ISO Quality
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Sparkles size={12} color="var(--brand-primary-light)" /> Viral Hinglish
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Active Variation Editor Card */}
              {activeVariation && (
                <div style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}>
                  
                  {/* Hook Headline */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--brand-primary-light)', fontWeight: 700 }}>
                        FIRST 3-SECOND VIDEO HOOK:
                      </span>
                      <button
                        onClick={() => copyText(activeVariation.hookHeadline, 'hook')}
                        style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px' }}
                      >
                        {copiedField === 'hook' ? <Check size={12} color="var(--brand-whatsapp)" /> : <Copy size={12} />}
                        {copiedField === 'hook' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={activeVariation.hookHeadline}
                      onChange={(e) => {
                        const updated = [...aiVariations];
                        updated[selectedVariationIndex].hookHeadline = e.target.value;
                        setAiVariations(updated);
                      }}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        color: '#fff',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                      }}
                    />
                  </div>

                  {/* Primary Text */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        PRIMARY AD CAPTION:
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        {activeVariation.primaryText.length} characters
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={activeVariation.primaryText}
                      onChange={(e) => {
                        const updated = [...aiVariations];
                        updated[selectedVariationIndex].primaryText = e.target.value;
                        setAiVariations(updated);
                      }}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        color: '#fff',
                        fontSize: '0.82rem',
                        lineHeight: '1.4',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  {/* Headline & CTA */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Link Headline</span>
                      <input
                        type="text"
                        value={activeVariation.headline}
                        onChange={(e) => {
                          const updated = [...aiVariations];
                          updated[selectedVariationIndex].headline = e.target.value;
                          setAiVariations(updated);
                        }}
                        style={{
                          width: '100%',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '8px 10px',
                          color: '#fff',
                          fontSize: '0.82rem',
                        }}
                      />
                    </div>

                    <div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>CTA Button</span>
                      <div style={{
                        padding: '8px 10px',
                        background: 'rgba(37,211,102,0.15)',
                        border: '1px solid rgba(37,211,102,0.3)',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        color: 'var(--brand-whatsapp)',
                        fontWeight: 700,
                        textAlign: 'center',
                      }}>
                        {activeVariation.callToAction === 'WHATSAPP_MESSAGE' ? 'WhatsApp' : 'Get Quote'}
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* STEP 4: AUDIENCE & BUDGET */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>4</div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>Target Audience & Auto-Pilot Budget</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Configure daily spend, targeting keywords, and autonomous bidding</div>
                </div>
              </div>

              {/* Interest Tag Chips */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Targeting Keywords & Industry Interests
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {targetInterests.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#c084fc',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveInterestTag(tag)}
                        style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddInterestTag()}
                    placeholder="Add custom interest tag (e.g. Petrochemical EPC, CPWD Contractor)..."
                    style={{
                      flex: 1,
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '7px 12px',
                      color: '#fff',
                      fontSize: '0.8rem',
                    }}
                  />
                  <button onClick={handleAddInterestTag} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    + Add
                  </button>
                </div>
              </div>

              {/* Budget Slider */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#fff' }}>Daily Ad Spend:</span>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--brand-amber)' }}>₹{dailyBudget.toLocaleString('en-IN')}/day</strong>
                </div>

                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--brand-amber)' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  <span>₹500/day (~4-6 leads)</span>
                  <span>₹5,000/day (~30-45 leads)</span>
                  <span>₹10,000/day (~65-90 leads)</span>
                </div>
              </div>

              {/* AutoPilot Toggle */}
              <div style={{
                background: 'rgba(37, 211, 102, 0.08)',
                border: '1px solid rgba(37, 211, 102, 0.25)',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--brand-whatsapp)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} /> Autonomous AI Auto-Pilot Active
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    AI will automatically pause losing variations with CTR &lt; 2.0% and scale winning video hooks.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={autoPilot}
                  onChange={(e) => setAutoPilot(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--brand-whatsapp)', cursor: 'pointer' }}
                />
              </div>

            </div>

            {/* DEPLOY BUTTON */}
            <button
              onClick={handleDeployCampaign}
              className="btn btn-whatsapp"
              style={{
                padding: '16px 28px',
                fontSize: '1.05rem',
                fontWeight: 800,
                width: '100%',
                boxShadow: '0 8px 30px rgba(37, 211, 102, 0.45)',
                letterSpacing: '-0.01em',
              }}
            >
              <Zap size={20} /> Deploy Video Campaign & Let AI Run Ads
            </button>

          </div>

          {/* RIGHT COLUMN: INTERACTIVE MOBILE AD PREVIEW (INSTAGRAM REELS VS FACEBOOK FEED) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Mockup Platform Switcher Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={16} /> LIVE META AD PREVIEW
              </div>

              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setMockupPlatform('instagram')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    background: mockupPlatform === 'instagram' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
                    color: '#fff',
                    border: 'none',
                    fontWeight: mockupPlatform === 'instagram' ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  Instagram Reels
                </button>
                <button
                  onClick={() => setMockupPlatform('facebook')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    background: mockupPlatform === 'facebook' ? '#1877f2' : 'transparent',
                    color: '#fff',
                    border: 'none',
                    fontWeight: mockupPlatform === 'facebook' ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  Facebook Mobile Feed
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* PLATFORM 1: INSTAGRAM REELS (9:16) */}
            {/* ======================================================== */}
            {mockupPlatform === 'instagram' && (
              <div className="phone-mockup-frame" style={{
                maxWidth: '380px',
                width: '100%',
                margin: '0 auto',
                background: '#000',
                borderRadius: '38px',
                border: '10px solid #1a2234',
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '9/16',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                
                {/* Video Element */}
                <video
                  src={customVideoUrl || selectedVideo.videoUrl}
                  poster={customVideoUrl ? undefined : selectedVideo.thumbnailUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                  }}
                />

                {/* Dark Gradient Overlay for Readability */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 35%, rgba(0,0,0,0.88) 82%)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }} />

                {/* Reels Header */}
                <div style={{ zIndex: 2, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#fff' }}>
                  <div style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1rem' }}>Reels</div>
                  <Volume2 size={18} />
                </div>

                {/* Top Hook Banner (3-Second Video Hook) */}
                <div style={{
                  zIndex: 2,
                  margin: '0 16px',
                  background: 'linear-gradient(135deg, rgba(235, 87, 87, 0.95), rgba(244, 63, 94, 0.95))',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}>
                  <Zap size={14} color="#fef08a" />
                  <span>{activeVariation.hookHeadline}</span>
                </div>

                {/* Right Side Social Floating Icons */}
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  bottom: '150px',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  color: '#fff',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                    <Heart size={26} fill="#ff2d55" color="#ff2d55" />
                    <span style={{ fontSize: '0.68rem', marginTop: '2px', fontWeight: 600 }}>4.8k</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <MessageSquare size={26} />
                    <span style={{ fontSize: '0.68rem', marginTop: '2px', fontWeight: 600 }}>342</span>
                  </div>
                  <Share2 size={24} />
                  <Bookmark size={24} />
                </div>

                {/* Bottom Caption, Handle & WhatsApp CTA */}
                <div style={{ zIndex: 2, padding: '16px 16px 22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  {/* Brand handle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #25d366, #6366f1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#fff',
                    }}>
                      {business.name.slice(0, 1)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>
                          {account?.instagramHandle || '@apex_industrial'}
                        </span>
                        <CheckCircle2 size={12} color="#38bdf8" />
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>Sponsored</div>
                    </div>
                  </div>

                  {/* Caption / Primary Text */}
                  <p style={{
                    fontSize: '0.78rem',
                    color: '#f8fafc',
                    lineHeight: '1.4',
                    margin: 0,
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                  }}>
                    {activeVariation.primaryText}
                  </p>

                  {/* Audio wave ticker */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#cbd5e1' }}>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '14px' }}>
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                    </div>
                    <span>Original Audio • {business.name} Verified Sound</span>
                  </div>

                  {/* Call to Action Button Bar */}
                  <div style={{
                    background: objective === 'click_to_whatsapp' ? 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    borderRadius: '10px',
                    padding: '11px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
                    cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {objective === 'click_to_whatsapp' ? (
                        <MessageSquare size={17} color="#fff" />
                      ) : (
                        <Zap size={17} color="#fff" />
                      )}
                      <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fff' }}>
                        {objective === 'click_to_whatsapp' ? 'Send WhatsApp Message' : 'Get Quote Now'}
                      </span>
                    </div>
                    <ChevronRight size={17} color="#fff" />
                  </div>

                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* PLATFORM 2: FACEBOOK MOBILE SPONSORED FEED (1:1 / 4:5) */}
            {/* ======================================================== */}
            {mockupPlatform === 'facebook' && (
              <div className="phone-mockup-frame" style={{
                maxWidth: '380px',
                width: '100%',
                margin: '0 auto',
                background: '#18191a',
                borderRadius: '38px',
                border: '10px solid #1a2234',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                color: '#e4e6eb',
              }}>
                
                {/* FB Post Header */}
                <div style={{ padding: '16px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1877f2, #0064e0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#fff',
                    }}>
                      {business.name.slice(0, 1)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                        {account?.pageName || business.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#b0b3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>Sponsored</span> • <Globe size={11} />
                      </div>
                    </div>
                  </div>
                  <MoreVertical size={18} color="#b0b3b8" />
                </div>

                {/* FB Post Text */}
                <div style={{ padding: '0 16px 10px', fontSize: '0.82rem', lineHeight: '1.45', color: '#e4e6eb' }}>
                  {activeVariation.primaryText}
                </div>

                {/* FB Video Container */}
                <div style={{ width: '100%', aspectRatio: '1/1', background: '#000', position: 'relative' }}>
                  <video
                    src={customVideoUrl || selectedVideo.videoUrl}
                    poster={customVideoUrl ? undefined : selectedVideo.thumbnailUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Hook overlay badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.8)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}>
                    <Zap size={13} color="#fef08a" />
                    <span>{activeVariation.hookHeadline}</span>
                  </div>
                </div>

                {/* FB Link Card Bar */}
                <div style={{
                  background: '#242526',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ maxWidth: '200px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#b0b3b8', textTransform: 'uppercase' }}>
                      {business.whatsappNumber || 'WhatsApp Business'}
                    </div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {activeVariation.headline}
                    </div>
                  </div>

                  <button style={{
                    background: objective === 'click_to_whatsapp' ? '#25d366' : '#1877f2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}>
                    {objective === 'click_to_whatsapp' ? 'WhatsApp' : 'Get Quote'}
                  </button>
                </div>

                {/* FB Social Engagement Bar */}
                <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#b0b3b8', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ThumbsUp size={14} color="#1877f2" /> 512 Likes
                  </span>
                  <span>48 Comments • 32 Shares</span>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: META AD LEADS INGESTION */}
      {/* ======================================================== */}
      {activeTab === 'leads' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>
                Meta Video Ads Lead Stream ({filteredLeads.length} of {leads.length})
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Direct inquiries generated through Click-to-WhatsApp and Meta Instant Lead Forms.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Search client, phone, city..."
                  value={leadsSearch}
                  onChange={(e) => setLeadsSearch(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '7px 12px 7px 32px',
                    fontSize: '0.8rem',
                    color: '#fff',
                    width: '200px',
                  }}
                />
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-subtle)', padding: '2px' }}>
                {(['all', 'pending', 'synced'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setLeadsFilter(f)}
                    style={{
                      background: leadsFilter === f ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                      border: 'none',
                      color: leadsFilter === f ? '#fff' : 'var(--text-muted)',
                      fontSize: '0.74rem',
                      fontWeight: leadsFilter === f ? 700 : 500,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    {f === 'all' ? 'All' : f === 'pending' ? 'Pending CRM' : 'Synced'}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSyncLeads}
                disabled={syncingLeads}
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '6px 16px' }}
              >
                <Share2 size={14} /> {syncingLeads ? 'Syncing...' : 'Sync to CRM Pipeline'}
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '12px' }}>Client & Organization</th>
                  <th style={{ padding: '12px' }}>Phone / WhatsApp</th>
                  <th style={{ padding: '12px' }}>Requirement & Campaign</th>
                  <th style={{ padding: '12px' }}>Est. Value</th>
                  <th style={{ padding: '12px' }}>CRM Status</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((l) => (
                  <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px' }}>
                      <strong style={{ color: '#fff' }}>{l.clientName}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{l.city || 'Pan-India'} • {l.createdAt}</div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--brand-whatsapp)', fontWeight: 600 }}>
                      {l.phone}
                    </td>
                    <td style={{ padding: '12px', maxWidth: '300px' }}>
                      <div style={{ color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {l.requirement}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        Campaign: {l.campaignName}
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--brand-amber)', fontWeight: 700 }}>
                      ₹{l.estimatedValue.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${l.syncedToPipeline ? 'badge-whatsapp' : 'badge-busy'}`} style={{ fontSize: '0.65rem' }}>
                        {l.syncedToPipeline ? 'SYNCED TO CRM' : 'PENDING SYNC'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <a
                          href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(l.clientName)},%20this%20is%20from%20${encodeURIComponent(business.name)}%20regarding%20your%20Meta%20Ad%20inquiry.`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-whatsapp"
                          style={{ padding: '5px 10px', fontSize: '0.74rem' }}
                        >
                          <MessageSquare size={13} /> WhatsApp
                        </a>

                        {onTriggerCall && (
                          <button
                            onClick={() => onTriggerCall({ clientName: l.clientName, phone: l.phone, productName: l.requirement })}
                            className="btn btn-premium"
                            style={{ padding: '5px 10px', fontSize: '0.74rem' }}
                          >
                            <PhoneCall size={13} /> AI Call
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: AI OPTIMIZATION LOGS */}
      {/* ======================================================== */}
      {activeTab === 'logs' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>
              Autonomous AI Optimization Feed
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time records of AI autonomous bid adjustments, variation pruning, and placement optimizations.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {campaigns.flatMap((c) => c.aiOptimizationLogs).map((log, i) => (
              <div key={log.id || i} style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: log.type === 'budget_scaled' ? 'rgba(37, 211, 102, 0.2)' : log.type === 'variation_killed' ? 'rgba(235, 87, 87, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {log.type === 'budget_scaled' ? <TrendingUp size={16} color="var(--brand-whatsapp)" /> : log.type === 'variation_killed' ? <AlertCircle size={16} color="#eb5757" /> : <Sparkles size={16} color="var(--brand-primary-light)" />}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 600, marginBottom: '2px' }}>
                      {log.message}
                    </div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)' }}>
                      Timestamp: {log.timestamp} • Action Type: {log.type.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                </div>

                <span className="badge badge-whatsapp" style={{ fontSize: '0.72rem' }}>
                  {log.impact}
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: CONNECT / EDIT META ACCOUNT */}
      {/* ======================================================== */}
      {showAccountModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '30px', background: 'var(--bg-secondary)', position: 'relative' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={22} color="#1877f2" />
                <h3 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 700 }}>Configure Meta Ad Account</h3>
              </div>
              <button onClick={() => setShowAccountModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Link your Meta Business Manager Ad Account ID and Graph API System User Token.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Meta Ad Account ID
                </label>
                <input
                  type="text"
                  value={editAdAccountId}
                  onChange={(e) => setEditAdAccountId(e.target.value)}
                  placeholder="act_84920194829"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '9px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Facebook Page Name
                </label>
                <input
                  type="text"
                  value={editPageName}
                  onChange={(e) => setEditPageName(e.target.value)}
                  placeholder="Apex Industrial & Engineering Solutions"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '9px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Connected Instagram Handle
                </label>
                <input
                  type="text"
                  value={editInstagramHandle}
                  onChange={(e) => setEditInstagramHandle(e.target.value)}
                  placeholder="@apex_industrial_solutions"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '9px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Meta System User Access Token
                </label>
                <input
                  type="password"
                  value={editAccessToken}
                  onChange={(e) => setEditAccessToken(e.target.value)}
                  placeholder="EAAG9284..."
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '9px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Daily Account Maximum Spend Cap (INR)
                </label>
                <input
                  type="number"
                  value={editDailyCap}
                  onChange={(e) => setEditDailyCap(Number(e.target.value))}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '9px 12px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button onClick={() => setShowAccountModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button onClick={handleSaveAccount} className="btn btn-primary">
                  Save & Test Connection
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CAMPAIGN MOBILE AD PREVIEW */}
      {/* ======================================================== */}
      {previewCampaign && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{ maxWidth: '420px', width: '100%', padding: '24px', background: '#000', borderRadius: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 800 }}>Instagram Reel Live Preview</div>
              <button onClick={() => setPreviewCampaign(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '480px', position: 'relative', background: '#000' }}>
              <video
                src={previewCampaign.creative.videoUrl}
                poster={previewCampaign.creative.thumbnailUrl}
                controls
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ marginTop: '14px', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <strong>Campaign:</strong> {previewCampaign.name}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
