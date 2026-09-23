// AfriWidget AI Writing Engine
// Specialized for generative writing tools: Paraphraser, Summarizer, Business Names, Product Descriptions, and Gig Descriptions

export const WRITING_TOOL_SLUGS = [
  'ai-paraphrasing-tool',
  'ai-text-summarizer',
  'ai-product-description-generator',
  'ai-business-name-generator',
  'ai-gig-description-generator'
];

export function isWritingTool(toolSlug, body = {}) {
  if (body && (body.mode === 'writing' || body.mode === 'paraphrase')) return true;
  if (!toolSlug || typeof toolSlug !== 'string') return false;
  const slug = toolSlug.toLowerCase().trim();
  if (WRITING_TOOL_SLUGS.includes(slug)) return true;
  return slug.startsWith('ai-') && (
    slug.includes('paraphras') ||
    slug.includes('summar') ||
    slug.includes('description') ||
    slug.includes('name') ||
    slug.includes('writer') ||
    slug.includes('rewrit')
  );
}

export function cleanWritingOutput(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = rawText;
  // Strip complete <think>...</think> blocks
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
  // Strip unclosed <think> blocks
  text = text.replace(/<think>[\s\S]*$/gi, '');
  text = text.replace(/<\/think>/gi, '');
  // Strip common reasoning process preambles
  text = text.replace(/^(Here'?s (a|the) (thinking process|rationale|analysis|paraphrase|rewrite):?[\s\S]*?\n\n)/i, '');
  text = text.replace(/^(Thinking Process:?[\s\S]*?\n\n)/i, '');
  // Strip emojis from output
  text = text.replace(/\p{Extended_Pictographic}/gu, '');
  // Strip surrounding quotes if the model wrapped the entire response in quotes
  text = text.trim();
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith('“') && text.endsWith('”'))) {
    text = text.slice(1, -1).trim();
  }
  return text;
}

export function buildWritingPrompts(body = {}) {
  const tool = String(body.tool || '').toLowerCase().trim();

  if (tool === 'ai-paraphrasing-tool' || tool.includes('paraphras')) {
    const text = String(body.text || body.input || '').trim();
    const tone = String(body.tone || 'clear professional').trim();
    const audience = String(body.audience || 'general readers').trim();

    const systemPrompt = `You are AfriWidget AI Paraphrasing Assistant, an expert copyeditor and professional rewrite engine. Your task is to paraphrase the provided text with exceptional clarity, natural phrasing, and appropriate vocabulary matching the requested tone and audience.

CRITICAL INSTRUCTIONS:
1. Preserve all factual information, names, figures, and original meaning accurately.
2. Adapt the phrasing, rhythm, sentence structure, and vocabulary to match the requested tone: "${tone}" for "${audience}".
3. Eliminate passive bloat, awkward wordiness, and clunky phrasing.
4. Output the paraphrased text organized into three distinct variations under these exact markdown headers:
### Option 1 (Primary Rewrite)
[The best natural, polished rewrite that flows smoothly]

### Option 2 (Concise & Direct)
[A tight, streamlined version that gets straight to the point]

### Option 3 (Alternative Phrasing)
[A differently structured version offering an alternative stylistic perspective]

5. Do NOT include any conversational filler, introductory remarks ("Here are your rewrites:"), meta-commentary, or <think> tags.
6. Never include emojis, emoticons, or icons in the rewrite output.`;

    const userPrompt = `Please paraphrase this text:\n\n${text}\n\nTone: ${tone}\nTarget Audience: ${audience}`;
    return { systemPrompt, userPrompt, maxTokens: 1200, temperature: 0.35 };
  }

  if (tool === 'ai-text-summarizer' || tool.includes('summariz')) {
    const text = String(body.text || body.input || '').trim();
    const format = String(body.format || 'bullet points').trim();
    const focus = String(body.focus || 'key takeaways').trim();

    const systemPrompt = `You are AfriWidget AI Summarizer, a sharp executive editorial tool.
Summarize the input text clearly, accurately, and without jargon.
- Format requirement: ${format}
- Primary focus: ${focus}
- Highlight the core thesis, crucial facts, and key conclusions.
- Output ONLY the final summary without preamble or filler.`;

    const userPrompt = `Summarize the following text in ${format} focusing on ${focus}:\n\n${text}`;
    return { systemPrompt, userPrompt, maxTokens: 1000, temperature: 0.25 };
  }

  if (tool === 'ai-product-description-generator' || tool.includes('product-description')) {
    const product = String(body.product || '').trim();
    const audience = String(body.audience || 'online buyers').trim();
    const features = String(body.features || '').trim();
    const benefit = String(body.benefit || '').trim();
    const tone = String(body.tone || 'engaging and persuasive').trim();

    const systemPrompt = `You are AfriWidget AI Product Copywriter. Create high-converting, professional e-commerce product copy.
Include:
1. An irresistible headline
2. A compelling narrative hook (2-3 sentences)
3. 3-5 bulleted feature-benefit callouts
4. A clear call to action
Do NOT output conversational filler or intro text.`;

    const userPrompt = `Write a product description for:
Product: ${product}
Target Audience: ${audience}
Key Features: ${features}
Primary Benefit: ${benefit}
Tone: ${tone}`;
    return { systemPrompt, userPrompt, maxTokens: 900, temperature: 0.4 };
  }

  if (tool === 'ai-business-name-generator' || tool.includes('business-name')) {
    const industry = String(body.industry || 'general business').trim();
    const audience = String(body.audience || 'customers').trim();
    const keyword = String(body.keyword || '').trim();
    const style = String(body.style || 'modern and brandable').trim();

    const systemPrompt = `You are AfriWidget AI Brand Strategist. Generate 12-15 creative, memorable, trademark-friendly business and brand names.
Group them into 3 distinct naming styles:
- Modern & Brandable (invented, punchy names)
- Descriptive & Direct (clear value proposition)
- Elegant & Evocative (story-driven names)
Include a 1-sentence brand concept rationale next to each name.
Do NOT output conversational filler.`;

    const userPrompt = `Generate business names for:
Industry: ${industry}
Target Customers: ${audience}
Keyword / Theme: ${keyword}
Style Preference: ${style}`;
    return { systemPrompt, userPrompt, maxTokens: 900, temperature: 0.6 };
  }

  if (tool === 'ai-gig-description-generator' || tool.includes('gig-description')) {
    const service = String(body.service || '').trim();
    const client = String(body.client || 'prospective clients').trim();
    const deliverables = String(body.deliverables || '').trim();
    const turnaround = String(body.turnaround || 'promptly').trim();
    const process = String(body.process || '').trim();

    const systemPrompt = `You are AfriWidget AI Freelance Copywriter. Craft a high-converting freelance service overview (Fiverr/Upwork style).
Include:
1. Attention-grabbing headline
2. Client-focused value proposition hook
3. What You Will Receive (bulleted deliverables)
4. Workflow & Process
5. Why Choose Me & Next Steps (CTA)
No conversational preamble.`;

    const userPrompt = `Write a freelance gig description for:
Service: ${service}
Ideal Client: ${client}
Deliverables: ${deliverables}
Turnaround: ${turnaround}
Process: ${process}`;
    return { systemPrompt, userPrompt, maxTokens: 1000, temperature: 0.35 };
  }

  // Generic writing tool prompt
  const input = String(body.text || body.input || JSON.stringify(body)).slice(0, 2000);
  return {
    systemPrompt: `You are AfriWidget AI Writing Assistant. Produce clean, polished, human-grade writing that directly addresses the user's brief. Output only the final copy.`,
    userPrompt: `Please write or edit based on these details:\n\n${input}`,
    maxTokens: 1000,
    temperature: 0.3
  };
}

export function generateDeterministicWritingFallback(body = {}) {
  const tool = String(body.tool || '').toLowerCase().trim();

  if (tool === 'ai-paraphrasing-tool' || tool.includes('paraphras')) {
    const text = String(body.text || body.input || '').trim();
    if (!text) return 'Please provide text to paraphrase.';

    const replacements = [
      [/\bdue to the fact that\b/gi, 'because'],
      [/\bin order to\b/gi, 'to'],
      [/\bat this point in time\b/gi, 'currently'],
      [/\bat the present time\b/gi, 'currently'],
      [/\bin the event that\b/gi, 'if'],
      [/\bhas the ability to\b/gi, 'can'],
      [/\bis able to\b/gi, 'can'],
      [/\butilize\b/gi, 'use'],
      [/\butilizes\b/gi, 'uses'],
      [/\butilized\b/gi, 'used'],
      [/\bmake a determination\b/gi, 'decide'],
      [/\bgive consideration to\b/gi, 'consider'],
      [/\bwith the exception of\b/gi, 'except for'],
      [/\bin close proximity to\b/gi, 'near'],
      [/\bprior to\b/gi, 'before'],
      [/\bsubsequent to\b/gi, 'after'],
      [/\ba large number of\b/gi, 'many'],
      [/\bin spite of the fact that\b/gi, 'although'],
      [/\bit is important to note that\b/gi, 'notably,'],
      [/\bas a consequence of\b/gi, 'because of'],
      [/\bprovide assistance to\b/gi, 'assist'],
      [/\btake into consideration\b/gi, 'consider'],
      [/\bconduct an investigation\b/gi, 'investigate'],
      [/\bin accordance with\b/gi, 'per']
    ];

    let opt1 = text;
    for (const [re, rep] of replacements) {
      opt1 = opt1.replace(re, rep);
    }
    // Capitalize first letter of each sentence if needed
    opt1 = opt1.replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());

    // Option 2: Concise & Direct
    let opt2 = opt1
      .replace(/\b(?:very|really|quite|basically|actually|definitely|literally|needless to say)\b\s*/gi, '')
      .replace(/\bthere are many people who\b/gi, 'many people')
      .replace(/\bin the near future\b/gi, 'soon')
      .replace(/\bfor the purpose of\b/gi, 'for')
      .trim();

    // Option 3: Alternative Phrasing
    let opt3 = opt1
      .replace(/\bconsequently\b/gi, 'as a result')
      .replace(/\bfurthermore\b/gi, 'in addition')
      .replace(/\bhowever\b/gi, 'on the other hand')
      .replace(/\bhelp\b/gi, 'support')
      .replace(/\buse\b/gi, 'apply')
      .trim();

    return [
      '### Option 1 (Primary Rewrite)',
      opt1,
      '',
      '### Option 2 (Concise & Direct)',
      opt2,
      '',
      '### Option 3 (Alternative Phrasing)',
      opt3
    ].join('\n');
  }

  if (tool === 'ai-text-summarizer' || tool.includes('summariz')) {
    const text = String(body.text || body.input || '').trim();
    if (!text) return 'Please provide text to summarize.';
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const topSentences = sentences.slice(0, 3).map(s => s.trim());
    return [
      '### Executive Summary',
      topSentences[0] || text,
      '',
      '### Key Highlights',
      ...topSentences.map(s => `• ${s}`)
    ].join('\n');
  }

  if (tool === 'ai-product-description-generator') {
    const p = body.product || 'Product';
    const b = body.benefit || 'superior performance and everyday convenience';
    const f = body.features || 'durable build and intuitive design';
    return [
      `### Introducing ${p}: Designed for Real Life`,
      `${p} gives you ${b}, eliminating the hassle from your daily routine. Crafted with ${f}, it delivers dependable performance you can count on.`,
      '',
      '### Key Highlights',
      `• Premium Quality: Built with ${f} for long-lasting reliability.`,
      `• Real Benefits: Experience ${b} every single day.`,
      '• Easy to Use: Thoughtfully designed for immediate, effortless results.',
      '',
      'Upgrade your setup today and experience the difference.'
    ].join('\n');
  }

  if (tool === 'ai-business-name-generator') {
    const kw = (body.keyword || body.industry || 'Apex').replace(/[^a-zA-Z]/g, '') || 'Nexus';
    return [
      '### Modern & Brandable',
      `• ${kw}ify — A modern, digital-first brand identity`,
      `• ${kw}ora — Sleek, memorable, and forward-looking`,
      `• Velo${kw} — Fast, dynamic, and action-oriented`,
      `• Nov${kw} — Inspiring innovation and fresh thinking`,
      '',
      '### Descriptive & Direct',
      `• The ${kw} Collective — Collaborative, community-driven authority`,
      `• True${kw} Solutions — Trustworthy, outcome-focused service`,
      `• Prime ${kw} Works — Premium craftsmanship and dependability`,
      '',
      '### Elegant & Evocative',
      `• Lumina ${kw} — Clear vision, clarity, and insight`,
      `• Iron & ${kw} — Heritage, strength, and durability`
    ].join('\n');
  }

  if (tool === 'ai-gig-description-generator') {
    const s = body.service || 'Professional Service';
    const c = body.client || 'clients looking for results';
    const d = body.deliverables || 'high quality deliverables with revisions included';
    return [
      `### Need High-Quality ${s}? You Are in the Right Place.`,
      `I help ${c} achieve their goals through meticulous, timely, and professional ${s.toLowerCase()}.`,
      '',
      '### What You Will Receive:',
      `• ${d}`,
      '• Comprehensive quality check and polish',
      '• Responsive communication throughout the project',
      '• Full revision round for complete satisfaction',
      '',
      '### Ready to get started?',
      'Send a message with your project brief and let us bring your vision to life.'
    ].join('\n');
  }

  return 'Ready to generate. Please provide details in the form above.';
}
