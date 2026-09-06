#!/usr/bin/env node
/**
 * Veida MCP — generate images from an agent without holding an API key.
 *
 * The generation tool is real, not a link-opener: veida.ai exposes an anonymous
 * tier (a client id in a header instead of an account), so this server can submit
 * a job, poll it and hand back a hosted image URL with nothing configured.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { MODELS, DESTINATIONS, pageUrl } from './catalog.js';

const API = 'https://veida.ai/api/ai';

/** Every call is retried: one connect failure is not a failed generation. */
async function call(url: string, init?: RequestInit, tries = 4): Promise<any> {
  let last: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, init);
      const body = await res.json();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(body).slice(0, 200)}`);
      return body;
    } catch (err) {
      last = err;
      if (i < tries - 1) await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw last;
}

const text = (s: string) => ({ content: [{ type: 'text' as const, text: s }] });

const server = new McpServer({ name: 'veida-mcp', version: '0.1.0' });

server.tool(
  'generate_image',
  'Generate an image from a text prompt and return a hosted image URL. No API key or account is needed — this runs on the anonymous free tier. Output is 1K and watermarked. Takes 40-120 seconds.',
  {
    prompt: z.string().min(1).describe('What to draw. Naming the light, the material and the composition moves the result far more than adding adjectives.'),
    aspectRatio: z.enum(['1:1', '16:9', '9:16', '4:3', '3:4']).default('1:1'),
    timeoutSecs: z.number().int().min(60).max(600).default(300),
  },
  async ({ prompt, aspectRatio, timeoutSecs }) => {
    // A fresh identity per image. The anonymous grant pays for exactly one
    // generation, so reusing an id would wall on the second call.
    const anonId = `mcp-${Math.random().toString(36).slice(2, 12)}`;

    const submitted = await call(`${API}/generate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-anon-id': anonId },
      body: JSON.stringify({
        provider: 'kie',
        mediaType: 'image',
        model: 'veida-image-v1',
        scene: 'text-to-image',
        prompt,
        options: { aspect_ratio: aspectRatio },
      }),
    });

    // The quota wall answers 200, not an error.
    if (submitted?.data?.wall) {
      const why =
        submitted.data.reason === 'ip_daily'
          ? 'this machine has used its free allowance for today'
          : 'this client has used its free allowance';
      return text(
        `Could not generate: ${why}. The free tier is capped per machine per day. ` +
          `Signing in at ${pageUrl('/')} lifts the cap, removes the watermark and opens the larger models.`
      );
    }

    const taskId = submitted?.data?.id;
    if (!taskId) return text(`Unexpected response from the generator: ${JSON.stringify(submitted).slice(0, 300)}`);

    // Status is not monotonic — pending and processing alternate. Only success
    // and failed are terminal.
    const deadline = Date.now() + timeoutSecs * 1000;
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 8000));
      const polled = await call(`${API}/anon-query?taskId=${taskId}&provider=kie&mediaType=image`);
      const status = polled?.data?.status;
      if (status === 'success') {
        const url = polled.data.images?.[0];
        const marked = polled.data.watermarked?.[0] ? ' (watermarked, free tier)' : '';
        return text(`${url}${marked}\n\nPrompt: ${prompt}\nAspect ratio: ${aspectRatio}`);
      }
      if (status === 'failed') {
        return text('The model rejected this prompt. Rewording it usually clears it.');
      }
    }
    return text(`Gave up after ${timeoutSecs}s. The job may still finish; task id ${taskId}.`);
  }
);

server.tool(
  'list_models',
  'List the image models Veida serves, which of them a signed-out caller can run, and the page a human can run each one on.',
  { scene: z.enum(['text-to-image', 'image-to-image', 'any']).default('any') },
  async ({ scene }) => {
    const rows = MODELS.filter((m) => scene === 'any' || m.scenes.includes(scene as any)).map(
      (m) =>
        `- **${m.label}** (\`${m.id}\`) — ${m.anonymous ? 'runs without an account' : 'needs an account'}. ${m.note}\n  ${pageUrl(m.path)}`
    );
    return text(
      `${rows.join('\n')}\n\nOnly \`veida-image-v1\` is reachable anonymously; \`generate_image\` uses it. ` +
        `Everything else runs on ${pageUrl('/image')} once signed in.`
    );
  }
);

server.tool(
  'browse_tools',
  'List the Veida pages worth sending a person to — generator, editor, upscaler, background remover, prompt library, pricing.',
  {},
  async () =>
    text(DESTINATIONS.map((d) => `- **${d.title}** — ${d.blurb}\n  ${pageUrl(d.path)}`).join('\n'))
);

server.tool(
  'free_tier_limits',
  'Explain exactly what the anonymous free tier allows, so the caller does not build something that always fails.',
  {},
  async () =>
    text(
      [
        '- Anonymous grant: 4 credits. Text-to-image costs 4. That is **one image per client id**.',
        '- A ceiling of 30 credits per IP per day sits on top: about 7 images a day from one machine.',
        '- Free output is 1K and watermarked.',
        '- **Editing an existing image is not possible anonymously** — the editing model costs 30 credits against a 4-credit grant, so it can never be paid for. Send the person to ' +
          pageUrl('/image/nano-banana-2-lite') + ' and have them sign in.',
        '- There is no video on this site. Do not construct a video request.',
        '',
        `What an account adds is listed at ${pageUrl('/pricing')}.`,
      ].join('\n')
    )
);

await server.connect(new StdioServerTransport());
