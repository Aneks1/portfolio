import type { APIRoute } from 'astro';

const clean = (value: unknown, maxLength: number) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

export const POST: APIRoute = async ({ request }) => {
  const webhookUrl = import.meta.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return Response.json(
      { message: 'The contact form has not been configured yet.' },
      { status: 503 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: 'Invalid form submission.' }, { status: 400 });
  }

  if (clean(payload.website, 200)) {
    return Response.json({ ok: true });
  }

  const name = clean(payload.name, 80);
  const contact = clean(payload.contact, 120);
  const projectName = clean(payload.projectName, 100);
  const service = clean(payload.service, 100);
  const budget = clean(payload.budget, 80) || 'Not specified';
  const timeline = clean(payload.timeline, 100) || 'Not specified';
  const message = clean(payload.message, 1800);

  if (!name || !contact || !projectName || !service || !message) {
    return Response.json({ message: 'Please complete all required fields.' }, { status: 400 });
  }

  const discordResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Portfolio Contact',
      allowed_mentions: { parse: [] },
      embeds: [
        {
          title: `New inquiry: ${projectName}`,
          color: 0x942fff,
          fields: [
            { name: 'Name', value: name, inline: true },
            { name: 'Email / Discord', value: contact, inline: true },
            { name: 'Service', value: service, inline: false },
            { name: 'Budget', value: budget, inline: true },
            { name: 'Timeline', value: timeline, inline: true },
            { name: 'Message', value: message, inline: false },
          ],
          timestamp: new Date().toISOString(),
          footer: { text: 'Sent from the portfolio contact form' },
        },
      ],
    }),
  });

  if (!discordResponse.ok) {
    console.error('Discord webhook rejected contact form:', discordResponse.status);
    return Response.json(
      { message: 'Your message could not be delivered. Please try again later.' },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
};

export const ALL: APIRoute = () =>
  Response.json({ message: 'Method not allowed.' }, { status: 405 });
