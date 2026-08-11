import type { APIRoute } from 'astro';

const clean = (value: unknown, maxLength: number) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

const normalizeProjectUrl = (value: unknown): string | null => {
  const rawUrl = clean(value, 300);
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
};

export const POST: APIRoute = async ({ request }) => {
  const webhookUrl = import.meta.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return Response.json(
      { message: 'The review form has not been configured yet.' },
      { status: 503 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: 'Invalid form submission.' }, { status: 400 });
  }

  if (clean(payload.website, 200)) return Response.json({ ok: true });

  const name = clean(payload.name, 80);
  const contact = clean(payload.contact, 120);
  const projectName = clean(payload.projectName, 100);
  const projectUrlInput = clean(payload.projectUrl, 300);
  const projectUrl = normalizeProjectUrl(projectUrlInput);
  const comment = clean(payload.comment, 1000);
  const rating = Number(clean(payload.rating, 3));

  if (!name || !contact || !projectName || !comment || !Number.isInteger(rating * 2) || rating < 0.5 || rating > 5) {
    return Response.json({ message: 'Please complete all required fields.' }, { status: 400 });
  }

  if (projectUrlInput && !projectUrl) {
    return Response.json({ message: 'Please enter a valid project URL.' }, { status: 400 });
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const stars = `${'⭐'.repeat(fullStars)}${hasHalfStar ? '½' : ''}${'☆'.repeat(5 - Math.ceil(rating))}`;
  const discordResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Portfolio Reviews',
      allowed_mentions: { parse: [] },
      embeds: [
        {
          title: `New client review: ${projectName}`,
          description: comment,
          color: 0x942fff,
          fields: [
            { name: 'Client', value: name, inline: true },
            { name: 'Email / Discord', value: contact, inline: true },
            { name: 'Rating', value: `${stars} (${rating}/5)`, inline: false },
            {
              name: 'Project',
              value: projectUrl ? `[${projectName}](${projectUrl})` : projectName,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: { text: 'Sent from the portfolio review form' },
        },
      ],
    }),
  });

  if (!discordResponse.ok) {
    console.error('Discord webhook rejected review form:', discordResponse.status);
    return Response.json(
      { message: 'Your review could not be delivered. Please try again later.' },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
};

export const ALL: APIRoute = () =>
  Response.json({ message: 'Method not allowed.' }, { status: 405 });
