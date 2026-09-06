/**
 * What Veida actually serves, in the shape an agent needs to answer
 * "which model, and where does the human go to run it".
 *
 * Every slug here exists in veida.ai's sitemap and was checked for a 200 —
 * a model page that 404s is worse than one this server does not mention.
 */
export const SITE = 'https://veida.ai';
export const UTM = '?utm_source=mcp&utm_medium=lobehub';

export const pageUrl = (path: string) => `${SITE}${path}${UTM}`;

export type Model = {
  /** what the API takes as `model` */
  id: string;
  label: string;
  /** page a human can run it on */
  path: string;
  scenes: ('text-to-image' | 'image-to-image')[];
  /** runnable without an account? */
  anonymous: boolean;
  note: string;
};

export const MODELS: Model[] = [
  {
    id: 'veida-image-v1',
    label: 'Veida AI Image v1',
    path: '/image',
    scenes: ['text-to-image'],
    anonymous: true,
    note: 'The only model an anonymous caller can run. Fast, cheap, 1K, watermarked on the free tier.',
  },
  {
    id: 'nano-banana-2-lite',
    label: 'Nano Banana 2 Lite',
    path: '/image/nano-banana-2-lite',
    scenes: ['text-to-image', 'image-to-image'],
    anonymous: false,
    note: 'The editing model — takes a source image. Costs more than the anonymous grant can pay, so it needs an account.',
  },
  {
    id: 'nano-banana-2',
    label: 'Nano Banana 2',
    path: '/image/nano-banana-2',
    scenes: ['text-to-image', 'image-to-image'],
    anonymous: false,
    note: 'Stronger instruction following than Lite, and it edits.',
  },
  {
    id: 'nano-banana-pro',
    label: 'Nano Banana Pro',
    path: '/image/nano-banana-pro',
    scenes: ['text-to-image'],
    anonymous: false,
    note: 'Text-to-image only here; the edit path is a separate model and has not been exercised.',
  },
  {
    id: 'gpt-image-2',
    label: 'GPT Image 2',
    path: '/image/gpt-image-2',
    scenes: ['text-to-image', 'image-to-image'],
    anonymous: false,
    note: 'The one to reach for when the image has to contain readable text.',
  },
  {
    id: 'seedream-5-lite',
    label: 'Seedream 5.0 Lite',
    path: '/image/seedream-5-lite',
    scenes: ['text-to-image', 'image-to-image'],
    anonymous: false,
    note: 'Good colour and composition for the price.',
  },
  {
    id: 'seedream-4-5',
    label: 'Seedream 4.5',
    path: '/image/seedream-4-5',
    scenes: ['text-to-image'],
    anonymous: false,
    note: 'Quality tier splits the price: basic or high.',
  },
  {
    id: 'seedream-5-pro',
    label: 'Seedream 5.0 Pro',
    path: '/image/seedream-5-pro',
    scenes: ['text-to-image'],
    anonymous: false,
    note: 'The top Seedream tier on the shelf.',
  },
  {
    id: 'qwen-image-3',
    label: 'Qwen Image 3',
    path: '/image/qwen-image-3',
    scenes: ['text-to-image'],
    anonymous: false,
    note: 'Strong on Chinese and English typography.',
  },
  {
    id: 'grok-imagine-image-2-0',
    label: 'Grok Imagine Image 2.0',
    path: '/image/grok-imagine-image-2-0',
    scenes: ['text-to-image'],
    anonymous: false,
    note: 'Looser, more illustrative output than the Seedream line.',
  },
];

export type Destination = { title: string; path: string; blurb: string };

/** Pages worth handing a human, when the answer is "go do this in a browser". */
export const DESTINATIONS: Destination[] = [
  { title: 'Image generator', path: '/image', blurb: 'The generator itself. Free tier runs without an account.' },
  { title: 'ChatGPT image generator', path: '/image/chatgpt-image-generator', blurb: 'The ChatGPT-style prompt-to-image flow.' },
  { title: 'ChatGPT image editor', path: '/image/chatgpt-image-editor', blurb: 'Edit an image you already have by describing the change.' },
  { title: 'Prompt library', path: '/image/prompts', blurb: 'Worked prompts to start from instead of a blank box.' },
  { title: 'Image upscaler', path: '/image/image-upscaler', blurb: 'Raise resolution on an existing image.' },
  { title: 'Background remover', path: '/image/background-remover', blurb: 'Cut a subject out of its background.' },
  { title: 'Showcase', path: '/showcases', blurb: 'Finished output, for judging quality before committing.' },
  { title: 'Pricing', path: '/pricing', blurb: 'What the free tier includes and what an account adds.' },
];
