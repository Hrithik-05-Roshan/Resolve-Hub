export interface EscalationDetails {
  ticketNumber?: string;
  orderId?: string;
  platform?: string;
  issueType?: string;
  reason?: string;
  prompt?: string;
  amount?: number;
  confidence?: number;
  customerEmail?: string;
}

export const DISCORD_WEBHOOK_URL =
  'https://discord.com/api/webhooks/1535509672092639232/GGjn-KcKtFz2cKWUQjCdHwPkGvL9ZQTDy9cR5JsD4BkTECrlCDrzGDBv7uyzwrF81Q6k';

/**
 * Sends escalation details to Discord Webhook for manual merchant/support intervention.
 * Triggered automatically when an escalation or manual activity is required in the AI agent workflow.
 */
export async function sendToDiscord(details: EscalationDetails): Promise<boolean> {
  const ticketStr = details.ticketNumber || `RH-${Math.floor(10000 + Math.random() * 90000)}`;

  // Attempt proxy via server endpoint first
  try {
    const serverRes = await fetch('/api/escalate-discord', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...details, ticketNumber: ticketStr }),
    });

    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data.success) {
        return true;
      }
    }
  } catch (err) {
    console.warn('Server escalation proxy endpoint warning, attempting direct Discord POST:', err);
  }

  // Direct client-side fallback post to Discord Webhook
  try {
    const fields: { name: string; value: string; inline?: boolean }[] = [
      { name: '🎟️ Ticket Number', value: ticketStr, inline: true },
      { name: '🛒 Platform', value: details.platform || 'General / Multi-Platform', inline: true },
      { name: '📦 Order ID', value: details.orderId || 'N/A', inline: true },
      { name: '⚠️ Issue Type', value: details.issueType || 'High Risk / Manual Review', inline: true },
    ];

    if (details.amount !== undefined) {
      fields.push({ name: '💰 Transaction Amount', value: `₹${details.amount}`, inline: true });
    }

    if (details.confidence !== undefined) {
      fields.push({ name: '🤖 AI Confidence Score', value: `${details.confidence}%`, inline: true });
    }

    if (details.prompt) {
      fields.push({ name: '💬 Customer Complaint', value: details.prompt.slice(0, 500), inline: false });
    }

    const payload = {
      content: `🚨 **Manual Activity Triggered**: Escalation Ticket **#${ticketStr}** requires human merchant/support intervention.`,
      embeds: [
        {
          title: `🚨 [ResolveHub Escalation] Manual Activity Required (#${ticketStr})`,
          description: `**Escalation Reason:** ${details.reason || 'High risk transaction or unverified complaint requiring human review.'}`,
          color: 15158332,
          fields,
          footer: {
            text: 'ResolveHub Autonomous Support Gateway • Real-Time Discord Escalation',
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to send escalation details to Discord:', err);
    return false;
  }
}
