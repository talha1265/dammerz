import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [account, campaigns, leads] = await Promise.all([
      db.getMetaAccount(),
      db.getMetaCampaigns(),
      db.getMetaLeads(),
    ]);

    const totalSpend = campaigns.reduce((acc, c) => acc + (c.totalSpend || 0), 0);
    const totalLeads = campaigns.reduce((acc, c) => acc + (c.leads || 0), 0);
    const totalImpressions = campaigns.reduce((acc, c) => acc + (c.impressions || 0), 0);
    const total3sViews = campaigns.reduce((acc, c) => acc + (c.videoViews3s || 0), 0);
    const avgCpl = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0;
    const avgRoas = campaigns.length > 0
      ? (campaigns.reduce((acc, c) => acc + (c.roas || 0), 0) / campaigns.length).toFixed(1)
      : '0.0';

    return NextResponse.json({
      success: true,
      account,
      campaigns,
      leads,
      summaryStats: {
        totalSpend,
        totalLeads,
        totalImpressions,
        total3sViews,
        avgCpl,
        avgRoas,
        activeCampaignsCount: campaigns.filter((c) => c.status === 'active').length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, campaignData, campaignId, status, budget } = body;

    if (action === 'create_campaign') {
      const created = await db.createMetaCampaign(campaignData);
      return NextResponse.json({ success: true, campaign: created, message: 'Video ad campaign launched successfully' });
    }

    if (action === 'optimize_ai') {
      if (!campaignId) {
        return NextResponse.json({ error: 'campaignId is required' }, { status: 400 });
      }
      const result = await db.runMetaAIOptimization(campaignId);
      return NextResponse.json({
        success: true,
        campaign: result.campaign,
        log: result.log,
        message: 'Autonomous AI optimization cycle completed',
      });
    }

    if (action === 'sync_leads') {
      const syncResult = await db.syncMetaLeadsToPipeline();
      return NextResponse.json({
        success: true,
        syncedCount: syncResult.syncedCount,
        newLeads: syncResult.newLeads,
        message: `${syncResult.syncedCount} Meta leads synced to Sales Pipeline & CRM`,
      });
    }

    if (action === 'toggle_status') {
      const updated = await db.updateMetaCampaign(campaignId, { status });
      return NextResponse.json({ success: true, campaign: updated });
    }

    if (action === 'update_budget') {
      const updated = await db.updateMetaCampaign(campaignId, { dailyBudget: Number(budget) });
      return NextResponse.json({ success: true, campaign: updated });
    }

    if (action === 'delete_campaign') {
      const deleted = await db.deleteMetaCampaign(campaignId);
      return NextResponse.json({ success: true, deleted });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const updatedAccount = await db.updateMetaAccount(body);
    return NextResponse.json({
      success: true,
      account: updatedAccount,
      message: 'Meta Ad Account connection updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
