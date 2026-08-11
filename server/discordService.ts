import fetch from 'node-fetch';

export interface DiscordEscalationParams {
  ticketNumber?: string;
  orderId?: string;
  platform?: string;
  issueType?: string;
  reason?: string;
  prompt?: string;
  amount?: number;
  confidence?: number;
  status?: string;
}

const DEFAULT_DISCORD_WEBHOOK =
  'https://discord.com/api/webhooks/1535509672092639232/GGjn-KcKtFz2cKWUQjCdHwPkGvL9ZQTDy9cR5JsD4BkTECrlCDrzGDBv7uyzwrF81Q6k';

export async function postDiscordEscalation(params: DiscordEscalationParams): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL || process.env.DISCORD_WEBHOOK || DEFAULT_DISCORD_WEBHOOK;

  if (!webhookUrl) {
    console.warn('Discord Webhook URL not configured');
    return false;
  }

  const ticketStr = params.ticketNumber || `RH-${Math.floor(10000 + Math.random() * 90000)}`;
  const title = `🚨 [ResolveHub Escalation] Manual Activity Required (#${ticketStr})`;
  const reason = params.reason || 'High risk transaction or complaint not recognizable by AI.';

  const fields: { name: string; value: string; inline?: boolean }[] = [
    { name: '🎟️ Ticket Number', value: ticketStr, inline: true },
    { name: '🛒 Platform', value: params.platform || 'General / Multi-Platform', inline: true },
    { name: '📦 Order ID', value: params.orderId || 'N/A', inline: true },
    { name: '⚠️ Issue Type', value: params.issueType || 'High Risk / Manual Review', inline: true },
  ];

  if (params.amount !== undefined) {
    fields.push({ name: '💰 Transaction Amount', value: `₹${params.amount}`, inline: true });
  }

  if (params.confidence !== undefined) {
    fields.push({ name: '🤖 AI Confidence Score', value: `${params.confidence}%`, inline: true });
  }

  if (params.prompt) {
    fields.push({ name: '💬 Customer Complaint', value: params.prompt.slice(0, 500), inline: false });
  }

  const embed = {
    title,
    description: `**Escalation Reason:** ${reason}`,
    color: 15158332, // Crimson Red / Orange
    fields,
    footer: {
      text: 'ResolveHub Autonomous Support Gateway • Real-Time Discord Escalation',
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `🚨 **Manual Activity Triggered**: Ticket **#${ticketStr}** requires human merchant/support intervention.`,
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      console.warn(`Discord webhook returned status ${response.status}`);
      return false;
    }

    console.log(`Discord Webhook successfully dispatched for Ticket #${ticketStr}`);
    return true;
  } catch (err) {
    console.error('Error posting to Discord Webhook:', err);
    return false;
  }
}
