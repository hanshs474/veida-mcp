# Veida MCP

An MCP server that **actually generates images**, with no API key and no account.

Most image MCP servers are a wrapper around a key you have to go and buy first. This one
talks to the anonymous tier of [Veida](https://veida.ai/?utm_source=mcp&utm_medium=lobehub) — a client id in a header
instead of a login — so it works the moment it is installed.

```
> generate a 16:9 cover image of a paper boat on a calm lake at sunrise

  → https://cdn.veida.ai/uploads/kie/image/….webp
```

## Tools

| Tool | What it does |
|---|---|
| `generate_image` | Prompt → hosted image URL. Submits, polls, returns. 40–120 seconds. |
| `list_models` | The model shelf, which ones run signed-out, and the page for each. |
| `browse_tools` | Pages worth sending a person to — editor, upscaler, background remover. |
| `free_tier_limits` | The exact ceilings, so an agent does not build something that always fails. |

## Install

### Claude Desktop / Claude Code

```json
{
  "mcpServers": {
    "veida": { "command": "npx", "args": ["-y", "veida-mcp"] }
  }
}
```

### Cursor / Cline / Windsurf

Same block, in that client's MCP config file. There is nothing else to set — no
`env`, no key.

## What the free tier is, measured

- The anonymous grant is **4 credits** and one image costs **4** — so the server mints a
  fresh client id per image rather than reusing one.
- A ceiling of **30 credits per IP per day** sits on top: roughly **7 images a day** from
  one machine, however many ids it invents.
- Free output is **1K and watermarked**.
- 🔴 **Editing an existing image cannot run anonymously.** The editing model costs 30
  credits against a 4-credit grant, so an anonymous edit can never be paid for. The tool
  set says so rather than offering a call that always fails; for edits, sign in and use the
  [image editor](https://veida.ai/image/nano-banana-2-lite?utm_source=mcp&utm_medium=lobehub) or the
  [ChatGPT image editor](https://veida.ai/image/chatgpt-image-editor?utm_source=mcp&utm_medium=lobehub).
- There is no video on this site, so no video tool.

Signing in removes the watermark, lifts the cap and opens the rest of the shelf. The
current lineup is on the [models the generator offers](https://veida.ai/image?utm_source=mcp&utm_medium=lobehub):
[GPT Image 2](https://veida.ai/image/gpt-image-2?utm_source=mcp&utm_medium=lobehub) when the picture has to contain
readable text, [Nano Banana 2](https://veida.ai/image/nano-banana-2?utm_source=mcp&utm_medium=lobehub) for instruction
following, [Seedream 5.0 Lite](https://veida.ai/image/seedream-5-lite?utm_source=mcp&utm_medium=lobehub) for colour and
composition, and [Qwen Image 3](https://veida.ai/image/qwen-image-3?utm_source=mcp&utm_medium=lobehub) for typography.
[Pricing](https://veida.ai/pricing?utm_source=mcp&utm_medium=lobehub) lists what each tier costs.

## Writing prompts that work

Name the light, the material and the composition. "A product photo of a mug" gives the
model nothing; "matte black ceramic mug on pale oak, soft window light from the left,
shallow depth of field" gives it a picture. Worked examples live in the
[prompt library](https://veida.ai/image/prompts?utm_source=mcp&utm_medium=lobehub), and the
[showcase](https://veida.ai/showcases?utm_source=mcp&utm_medium=lobehub) is there if you want to judge output quality
before wiring anything up.

The same engine is what the
[ChatGPT image generator](https://veida.ai/image/chatgpt-image-generator?utm_source=mcp&utm_medium=lobehub) page serves in
a browser — this server is the headless door to it.

## Develop

```bash
npm install
npm run build
node dist/index.js      # speaks MCP over stdio
```

## Links

- [veida.ai](https://veida.ai/?utm_source=mcp&utm_medium=lobehub)
- [Image generator](https://veida.ai/image?utm_source=mcp&utm_medium=lobehub)
- [Upscaler](https://veida.ai/image/image-upscaler?utm_source=mcp&utm_medium=lobehub) · [Background remover](https://veida.ai/image/background-remover?utm_source=mcp&utm_medium=lobehub)

MIT.
