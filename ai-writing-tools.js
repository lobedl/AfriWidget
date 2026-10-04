function onReady(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } }
(function () {
  'use strict';

  var endpoint = window.AFRIWIDGET_AI_ENDPOINT || '/.netlify/functions/groq-proxy';
  var writingPick = function (items) {
    return items[Math.floor(Math.random() * items.length)];
  };

  var fallback = {
    cover: function (d) {
      var role = d.role || '[Job Title]';
      var company = d.company || '[Company Name]';
      var experience = d.experience || '[relevant experience]';
      var skills = d.skills || '[relevant skills]';
      var highlight = d.highlights || '[add a project, achievement, or result that connects your experience to this role]';
      var openings = [
        'I am excited to apply for the ' + role + ' position at ' + company + '. My experience in ' + experience + ' and strengths in ' + skills + ' match the needs of this opportunity.',
        'Please accept my application for the ' + role + ' role at ' + company + '. I would bring practical experience in ' + experience + ', together with a strong foundation in ' + skills + '.',
        'The ' + role + ' opportunity at ' + company + ' caught my attention because it connects closely with my background in ' + experience + '. I am confident I could contribute through ' + skills + '.'
      ];
      return [
        'Subject: Application for ' + role,
        '',
        writingPick(['Dear Hiring Manager,', 'Hello Hiring Team,', 'Dear ' + company + ' Recruitment Team,']),
        '',
        writingPick(openings),
        '',
        'A relevant example is ' + highlight + '.',
        '',
        writingPick([
          'I would welcome the opportunity to discuss how my experience could support your team. Thank you for your consideration.',
          'I would be pleased to explain how I could contribute to ' + company + '. Thank you for taking the time to review my application.',
          'Thank you for considering my application. I would value the opportunity to discuss the role further.'
        ]),
        '',
        writingPick(['Kind regards,', 'Best regards,', 'Sincerely,']),
        d.name || '[Your Name]'
      ].join('\n');
    },
    linkedin: function (d) {
      var role = d.role || '[Target Role]';
      var specialty = d.specialty || '[specialty]';
      var strengths = d.strengths || '[strength or outcome]';
      return writingPick([
        role + ' | ' + specialty + ' | Helping teams ' + strengths + ' | Open to meaningful opportunities',
        role + ' focused on ' + specialty + ' | ' + strengths + ' | Building useful, measurable outcomes',
        specialty + ' professional | ' + role + ' | Turning ' + strengths + ' into practical results',
        role + ' • ' + specialty + ' • Clear thinking, thoughtful execution, and ' + strengths,
        'Helping organizations ' + strengths + ' | ' + specialty + ' | ' + role
      ]);
    },
    bio: function (d) {
      var name = d.name || '[Your Name]';
      var role = d.role || '[professional role]';
      var experience = d.experience || '[relevant experience]';
      var strengths = d.strengths || '[specialty or strengths]';
      var audience = d.audience || '[clients, teams, or communities]';
      return writingPick([
        [
          name + ' is a ' + role + ' with ' + experience + ', focused on ' + strengths + '.',
          '',
          'Their work helps ' + audience + ' make progress through clear communication, dependable execution, and practical problem-solving.',
          '',
          'Connect with ' + name + ' for thoughtful collaborations and projects in this field.'
        ],
        [
          'As a ' + role + ', ' + name + ' brings experience in ' + experience + ' and a particular interest in ' + strengths + '.',
          '',
          'They enjoy helping ' + audience + ' turn ideas into useful outcomes.',
          '',
          'Their approach is grounded, curious, and focused on continuous improvement.'
        ],
        [
          name + ' works at the intersection of ' + strengths + ' and practical delivery.',
          '',
          'With a background in ' + experience + ', ' + name + ' supports ' + audience + ' through thoughtful ' + role.toLowerCase() + ' work.',
          '',
          'Open to conversations, collaborations, and meaningful opportunities.'
        ]
      ]).join('\n');
    },
    email: function (d) {
      var recipient = d.recipient || '[Name]';
      var sender = d.sender || '[Your Name]';
      var subject = d.subject || d.purpose || '[Clear email subject]';
      var context = d.context || d.purpose || '[the topic]';
      var ask = d.ask || 'Could we review the next steps and agree on a convenient time to continue the conversation?';
      var tone = d.emailTone || 'professional';
      var type = d.emailType || 'request';
      var greeting = tone === 'friendly' ? 'Hello ' + recipient + ',' : tone === 'direct' ? recipient + ',' : 'Hi ' + recipient + ',';
      var closing = tone === 'friendly' ? 'Thanks again,' : tone === 'direct' ? 'Regards,' : 'Best,';
      var bodies = {
        request: [
          'I am writing about ' + context + '. ' + ask,
          'Could you please help with ' + context + '? ' + ask,
          'When you have a moment, I would appreciate your input on ' + context + '. ' + ask
        ],
        followup: [
          'I wanted to follow up on ' + context + '. ' + ask,
          'Just checking in regarding ' + context + '. ' + ask,
          'Following up on our earlier conversation about ' + context + '. ' + ask
        ],
        update: [
          'Here is a quick update on ' + context + ': ' + ask,
          'I wanted to keep you informed about ' + context + '. ' + ask,
          'A brief update regarding ' + context + ': ' + ask
        ],
        meeting: [
          'I would like to arrange a conversation about ' + context + '. ' + ask,
          'Could we schedule a short meeting to discuss ' + context + '? ' + ask,
          'I am reaching out to find a suitable time to discuss ' + context + '. ' + ask
        ],
        introduction: [
          'I am pleased to connect with you regarding ' + context + '. ' + ask,
          'I wanted to introduce myself and share a little context about ' + context + '. ' + ask,
          'I am reaching out to begin a conversation about ' + context + '. ' + ask
        ],
        reminder: [
          'This is a gentle reminder about ' + context + '. ' + ask,
          'I wanted to remind you about ' + context + '. ' + ask,
          'A quick reminder regarding ' + context + '. ' + ask
        ]
      };
      var body = (bodies[type] || bodies.request)[Math.floor(Math.random() * (bodies[type] || bodies.request).length)];
      var bridge = tone === 'friendly' ? 'Thanks for taking a look when you can.' : tone === 'direct' ? 'Please confirm the next step.' : 'Please let me know what works best for you.';
      return [
        'Subject: ' + subject,
        '',
        greeting,
        '',
        body,
        '',
        bridge,
        '',
        closing,
        sender
      ].join('\n');
    },
    'business-name': function (d) {
      var industry = d.industry || 'your industry';
      var audience = d.audience || 'modern customers';
      var keyword = d.keyword || '';
      var style = d.style || 'modern';
      var first = {
        modern: ['Bright', 'Nexa', 'Luma', 'North', 'Mosaic', 'Vanta'],
        premium: ['Crown', 'Aurelia', 'Atlas', 'Sterling', 'Summit', 'Velvet'],
        playful: ['Poppy', 'Bumble', 'Sprout', 'Wink', 'Zesty', 'Jolly'],
        local: ['Kora', 'Ubuntu', 'Sankofa', 'Savanna', 'Kijani', 'Maji']
      }[style] || ['Bright', 'Nexa', 'Luma'];
      var second = {
        modern: ['Works', 'Loop', 'House', 'Studio', 'Labs', 'Collective'],
        premium: ['& Co.', 'Partners', 'Atelier', 'Group', 'House', 'Capital'],
        playful: ['Pop', 'Box', 'Club', 'Nest', 'Spark', 'Joy'],
        local: ['Market', 'Craft', 'Roots', 'Hub', 'Connect', 'Rise']
      }[style] || ['Works', 'Studio', 'House'];
      var names = [
        writingPick(first) + ' ' + writingPick(second),
        (keyword ? keyword + ' ' : '') + writingPick(['& Co.', 'Collective', 'Studio', 'Works']),
        writingPick(['True', 'Clear', 'Kind', 'Open', 'Good']) + ' ' + writingPick(['Path', 'Field', 'Source', 'Table', 'Bridge']),
        writingPick(first) + writingPick(['ly', 'ora', 'iva', 'io', 'ara']),
        writingPick(['The', 'New', 'One']) + ' ' + writingPick(['Foundry', 'Corner', 'Exchange', 'Project'])
      ];
      return [
        'BUSINESS NAME IDEAS',
        '',
        names.map(function (name, index) { return (index + 1) + '. ' + name; }).join('\n'),
        '',
        'DIRECTION',
        'These names are designed for a ' + industry + ' business serving ' + audience + '. Check domain, trademark, company-registration, and social-handle availability before choosing one.'
      ].join('\n');
    },
    'product-description': function (d) {
      var product = d.product || '[Product name]';
      var audience = d.audience || '[target customer]';
      var features = d.features || '[key features and materials]';
      var benefit = d.benefit || 'make an everyday task easier';
      var platform = d.platform || 'your online store';
      var cta = d.cta || 'Shop now';
      return [
        'PRODUCT DESCRIPTION',
        '',
        product,
        '',
        'SHORT DESCRIPTION',
        product + ' is designed for ' + audience + ' who want to ' + benefit + '. Made with ' + features + ', it combines practical performance with an easy experience.',
        '',
        'WHY CUSTOMERS WILL VALUE IT',
        '- Helps ' + audience + ' ' + benefit + '.',
        '- Built around ' + features + '.',
        '- A thoughtful choice for customers who value quality, convenience, and dependable results.',
        '',
        'FULL DESCRIPTION',
        'Meet ' + product + ', a practical solution for ' + audience + '. Whether you are upgrading a routine, preparing a thoughtful gift, or looking for a dependable everyday product, it is made to deliver useful value without unnecessary complication. ' + features + ' support a smoother experience from the first use, while the design keeps the focus on what customers actually need.',
        '',
        'PLATFORM AND TONE',
        'Prepared for ' + platform + ' in a ' + (d.tone || 'clear and persuasive') + ' voice.',
        '',
        'CALL TO ACTION',
        cta + ': choose ' + product + ' when you are ready for a simpler way to ' + benefit + '.'
      ].join('\n');
    },
    'gig-description': function (d) {
      var service = d.service || '[your freelance service]';
      var client = d.client || '[ideal client]';
      var niche = d.niche || 'your client’s niche';
      var buyer = d.buyer || client;
      var deliverables = d.deliverables || '[deliverables]';
      var turnaround = d.turnaround || '[turnaround time]';
      var process = d.process || 'clear communication, careful work, and a useful final delivery';
      return [
        'GIG DESCRIPTION',
        '',
        'Need ' + service + '? I can help.',
        '',
        'ABOUT THIS SERVICE',
        'I provide ' + service + ' for ' + client + ' in ' + niche + ', helping ' + buyer + ' get dependable support and a professional result. My approach combines ' + process + ' so you know what to expect from the first message to the final handover.',
        '',
        'WHAT YOU WILL RECEIVE',
        '- ' + deliverables,
        '- A clear process and updates at the agreed stages',
        '- A final delivery prepared for your intended platform or use',
        '',
        'HOW IT WORKS',
        '1. Share your goals, references, requirements, and deadline.',
        '2. I confirm the scope and ask focused questions before starting.',
        '3. I complete the work and send a review-ready draft.',
        '4. We use the agreed revision process to prepare the final files.',
        '',
        'TIMELINE',
        'Typical turnaround: ' + turnaround + '. Tone: ' + (d.tone || 'professional and approachable') + '. Please message me before ordering if your project has a fixed launch date or unusual requirements.',
        '',
        'READY TO START?',
        'Send the project details and let us turn your idea into a clear, professional result.'
      ].join('\n');
    },
    paraphrase: function (d) {
      var text = d.text || '[Paste a sentence or paragraph to rewrite]';
      var tone = d.tone || 'clear and professional';
      var audience = d.audience || 'a general reader';
      var level = d.readingLevel || 'general reader';
      var degree = d.degree || 'moderate rewrite';
      var rewrite = text
        .replace(/\butilize\b/gi, 'use')
        .replace(/\bin order to\b/gi, 'to')
        .replace(/\ba large number of\b/gi, 'many')
        .replace(/\bat this point in time\b/gi, 'now')
        .replace(/\bdue to the fact that\b/gi, 'because');
      if (degree === 'light edit') rewrite = text.replace(/\s+/g, ' ').trim();
      return [
        'PARAPHRASED VERSION',
        '',
        'Here is a ' + tone + ' ' + degree + ' for ' + audience + ' at a ' + level + ' reading level:',
        '',
        rewrite,
        '',
        'EDITING NOTE',
        'Review names, figures, quotations, technical terms, and citations against the original before using this version. Paraphrasing should preserve the source meaning while changing the wording and sentence structure.'
      ].join('\n');
    },
    summarizer: function (d) {
      var text = d.text || '[Paste the article or text you want to summarize]';
      var format = d.format || 'key bullet points';
      var focus = d.focus || 'the main ideas and useful takeaways';
      var audience = d.audience || 'a general reader';
      var length = d.summaryLength || 'short';
      var words = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
      var sentences = text.replace(/\s+/g, ' ').trim().match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
      var wanted = length === 'detailed' ? 5 : length === 'medium' ? 3 : 2;
      var selected = sentences.slice(0, wanted).map(function (sentence) { return sentence.trim(); });
      return [
        'SUMMARY',
        '',
        'Format: ' + format,
        'Focus: ' + focus,
        'Audience: ' + audience,
        'Length: ' + length,
        '',
        selected.length ? selected.map(function (sentence) { return '- ' + sentence; }).join('\n') : '- Add source text to create a summary.',
        '',
        'SOURCE SNAPSHOT',
        words.slice(0, 55).join(' ') + (words.length > 55 ? '…' : ''),
        '',
        'Note: This local preview is a starting summary. Check the full source for nuance, evidence, exceptions, and exact figures.'
      ].join('\n');
    },
    'social-caption': function (d) {
      var topic = d.topic || '[your post topic]';
      var audience = d.audience || '[your audience]';
      var platform = d.platform || 'Instagram';
      var tone = d.tone || 'warm and engaging';
      var cta = d.cta || 'What do you think?';
      return [
        'SOCIAL MEDIA CAPTION',
        '',
        'Here is a ' + tone + ' caption for ' + platform + ':',
        '',
        'Showing up for ' + audience + ' means making ' + topic + ' easier to understand, try, and share. Small steps can create meaningful momentum when they are consistent and intentional.',
        '',
        cta,
        '',
        'OPTIONAL HASHTAGS',
        '#' + topic.toLowerCase().replace(/[^a-z0-9]+/g, '') + ' #contentcreator #community'
      ].join('\n');
    },
    hashtag: function (d) {
      var topic = d.topic || 'your topic';
      var niche = d.niche || 'your niche';
      var platform = d.platform || 'Instagram';
      var location = d.location || '';
      var count = Number(d.count) || 15;
      var roots = [topic, niche, 'contentcreator', 'smallbusiness', 'tips', 'community', 'learn', 'inspiration', 'growth', 'howto', 'creator', 'ideas', location];
      var tags = roots.filter(Boolean).map(function (item) { return '#' + item.toLowerCase().replace(/[^a-z0-9]+/g, ''); });
      tags = tags.filter(function (tag, index) { return tag.length > 1 && tags.indexOf(tag) === index; });
      return [
        'HASHTAG SET',
        '',
        'Platform: ' + platform,
        'Topic: ' + topic,
        '',
        tags.slice(0, Math.max(5, Math.min(count, tags.length))).join(' '),
        '',
        'USE WITH INTENTION',
        'Mix specific topic tags with niche and community tags. Check current platform guidance, search each tag before publishing, and rotate sets rather than repeating the same block on every post.'
      ].join('\n');
    },
    'youtube-title': function (d) {
      var topic = d.topic || '[video topic]';
      var keywords = d.keywords || '[target keywords]';
      var audience = d.audience || '[target viewers]';
      var format = d.format || 'how-to';
      return [
        'YOUTUBE TITLE IDEAS',
        '',
        'Topic: ' + topic,
        'Format: ' + format,
        'Audience: ' + audience,
        '',
        '1. How to ' + topic + ' (A Practical Guide for ' + audience + ')',
        '2. I Tried ' + topic + ' So You Don’t Have To',
        '3. The Beginner’s Guide to ' + topic + ' | ' + keywords,
        '4. ' + topic + ': 7 Mistakes to Avoid',
        '5. What Nobody Tells You About ' + topic,
        '',
        'TITLE NOTE',
        'Choose the title that accurately matches the video. Confirm the keyword fits naturally, then test the promise against the opening thirty seconds.'
      ].join('\n');
    },
    'youtube-description': function (d) {
      var topic = d.topic || '[video topic]';
      var summary = d.summary || '[short video summary]';
      var timestamps = d.timestamps || '00:00 Introduction\n01:00 Main idea\n03:00 Practical example\n05:00 Next steps';
      var cta = d.cta || 'Subscribe for more useful videos.';
      var links = d.links || '[Add relevant links]';
      return [
        'YOUTUBE VIDEO DESCRIPTION',
        '',
        summary + ' In this video, we explore ' + topic + ' with practical context, clear examples, and next steps you can adapt to your situation.',
        '',
        'CHAPTERS',
        timestamps,
        '',
        'WHAT YOU WILL LEARN',
        '- The key ideas behind ' + topic,
        '- Practical ways to apply the discussion',
        '- Questions to consider before taking action',
        '',
        'USEFUL LINKS',
        links,
        '',
        cta,
        '',
        'Disclosure: Review every claim, timestamp, link, and call-to-action before publishing.'
      ].join('\n');
    },
    'blog-title': function (d) {
      var seed = d.seed || '[seed keyword]';
      var audience = d.audience || '[target reader]';
      var format = d.format || 'how-to guide';
      var tone = d.tone || 'clear and useful';
      return [
        'BLOG TITLE IDEAS',
        '',
        'Seed keyword: ' + seed,
        'Audience: ' + audience,
        'Format: ' + format,
        'Tone: ' + tone,
        '',
        '1. The Practical Guide to ' + seed + ' for ' + audience,
        '2. ' + seed + ': What to Know Before You Begin',
        '3. 7 Useful Ways to Improve Your Approach to ' + seed,
        '4. A Clear Beginner’s Guide to ' + seed,
        '5. Common ' + seed + ' Mistakes — and How to Fix Them',
        '6. ' + seed + ' Explained: Principles, Examples, and Next Steps',
        '',
        'EDITORIAL NOTE',
        'Choose a headline that promises exactly what the article delivers. Check search intent, uniqueness, accuracy, and readability before publishing.'
      ].join('\n');
    }
  };

  function collect(form) {
    var data = {};
    Array.prototype.forEach.call(form.querySelectorAll('input, textarea, select'), function (field) {
      if (field.type === 'file') return;
      if (field.name) data[field.name] = field.value.trim();
    });
    return data;
  }

  function setBusy(form, busy) {
    var button = form.querySelector('[type="submit"]');
    if (button) {
      button.disabled = busy;
      button.textContent = busy ? 'Generating…' : 'Generate draft';
    }
  }

  function localDraft(tool, data) {
    return fallback[tool] ? fallback[tool](data) : 'Add your details to create a draft.';
  }

  function setupEmailOptions(form) {
    if (form.getAttribute('data-writing-tool') !== 'email' || form.querySelector('[name="emailType"]')) return;
    var anchor = form.querySelector('textarea[name="ask"]');
    var row = document.createElement('div');
    row.className = 'grid gap-4 sm:col-span-2 sm:grid-cols-2';
    row.innerHTML = '<label><span class="writing-label">Email type</span><select class="writing-input" name="emailType"><option value="request">Request</option><option value="followup">Follow-up</option><option value="update">Progress update</option><option value="meeting">Meeting request</option><option value="introduction">Introduction</option><option value="reminder">Reminder</option></select></label><label><span class="writing-label">Tone</span><select class="writing-input" name="emailTone"><option value="professional">Professional</option><option value="friendly">Friendly</option><option value="direct">Direct</option></select></label>';
    var label = anchor && anchor.closest('label');
    if (label && label.parentNode) label.parentNode.insertBefore(row, label);
    else form.insertBefore(row, form.querySelector('[type="submit"]'));
  }

  function setupSpecializedOptions(form) {
    var tool = form.getAttribute('data-writing-tool');
    var submit = form.querySelector('[type="submit"]');
    if (!submit || form.querySelector('[data-specialized-options]')) return;
    var fields = '';
    if (tool === 'business-name') {
      fields = '<label><span class="writing-label">Location or language context</span><input class="writing-input" name="location" placeholder="Local market, region, or bilingual audience"></label>';
    } else if (tool === 'product-description') {
      fields = '<label><span class="writing-label">Publishing platform</span><input class="writing-input" name="platform" placeholder="Shopify, Etsy, Amazon, website catalogue"></label><label><span class="writing-label">Call to action</span><input class="writing-input" name="cta" placeholder="Shop now, Add to basket, Learn more"></label>';
    } else if (tool === 'gig-description') {
      fields = '<label><span class="writing-label">Niche or industry</span><input class="writing-input" name="niche" placeholder="Real estate, wellness, SaaS, hospitality"></label><label><span class="writing-label">Buyer or decision-maker</span><input class="writing-input" name="buyer" placeholder="Founder, marketing manager, shop owner"></label><label><span class="writing-label">Tone</span><select class="writing-input" name="tone"><option>professional and approachable</option><option>friendly and confident</option><option>direct and concise</option></select></label>';
    } else if (tool === 'paraphrase') {
      fields = '<label><span class="writing-label">Reading level</span><select class="writing-input" name="readingLevel"><option>general reader</option><option>plain-language reader</option><option>academic reader</option><option>specialist reader</option></select></label><label><span class="writing-label">Degree of rewrite</span><select class="writing-input" name="degree"><option>light edit</option><option selected>moderate rewrite</option><option>substantial rewrite</option></select></label>';
    } else if (tool === 'summarizer') {
      fields = '<label><span class="writing-label">Summary length</span><select class="writing-input" name="summaryLength"><option>short</option><option>medium</option><option>detailed</option></select></label><label><span class="writing-label">Audience</span><input class="writing-input" name="audience" placeholder="General reader, executive, student, project team"></label>';
    } else if (tool === 'social-caption') {
      fields = '<label><span class="writing-label">Call to action</span><input class="writing-input" name="cta" placeholder="Save this post, comment below, visit the link"></label>';
    } else if (tool === 'hashtag') {
      fields = '<label><span class="writing-label">Location or community</span><input class="writing-input" name="location" placeholder="Nairobi, Accra, remote creators"></label><label><span class="writing-label">Number of hashtags</span><input class="writing-input" name="count" type="number" min="5" max="30" value="15"></label>';
    } else if (tool === 'youtube-title') {
      fields = '<label><span class="writing-label">Title format</span><select class="writing-input" name="format"><option>how-to</option><option>listicle</option><option>review</option><option>story or experiment</option><option>news or explainer</option></select></label>';
    } else if (tool === 'youtube-description') {
      fields = '<label><span class="writing-label">Timestamps or chapter notes</span><textarea class="writing-input" name="timestamps" rows="4" placeholder="00:00 Intro&#10;02:15 Main point"></textarea></label><label><span class="writing-label">Links</span><textarea class="writing-input" name="links" rows="3" placeholder="Website, newsletter, products, or sources"></textarea></label>';
    } else if (tool === 'blog-title') {
      fields = '<label><span class="writing-label">Headline format</span><select class="writing-input" name="format"><option>how-to guide</option><option>listicle</option><option>question</option><option>case study</option><option>opinion or analysis</option></select></label>';
    }
    if (!fields) return;
    var wrapper = document.createElement('div');
    wrapper.setAttribute('data-specialized-options', 'true');
    wrapper.className = 'grid gap-4 sm:grid-cols-2';
    wrapper.innerHTML = fields;
    submit.parentNode.insertBefore(wrapper, submit);
  }

  function requestDraft(tool, data) {
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ mode: 'writing', category: 'productivity', context: Object.assign({ tool: tool }, data) })
    }).then(function (response) {
      if (response.status === 429) {
        return response.json().then(function (errData) {
          throw new Error(errData.message || errData.insight || 'Rate limit reached: maximum 5 requests per hour. Please try again later.');
        }).catch(function (e) {
          throw (e && e.message && e.message.indexOf('Rate limit') !== -1) ? e : new Error('Rate limit reached: maximum 5 requests per hour. Please try again later.');
        });
      }
      if (!response.ok) throw new Error('AI request failed');
      return response.json();
    }).then(function (payload) {
      if (!payload.ok || !payload.text) throw new Error('No AI draft available');
      return payload.text;
    });
  }

  function init() {
    var form = document.querySelector('[data-writing-tool]');
    if (!form) return;
    var tool = form.getAttribute('data-writing-tool');
    var output = document.getElementById('writingOutput');
    var status = document.getElementById('writingStatus');
    var copy = document.getElementById('copyWriting');
    setupEmailOptions(form);
    setupSpecializedOptions(form);
    var latest = '';

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = collect(form);
      setBusy(form, true);
      status.textContent = 'Creating a private first draft…';
      latest = localDraft(tool, data);
      output.textContent = latest;
      requestDraft(tool, data).then(function (draft) {
        latest = draft;
        output.textContent = draft;
        status.textContent = 'AI draft ready. Edit the wording before you send or publish it.';
      }).catch(function () {
        status.textContent = 'Local draft ready. Realtime AI will be available when the secure site proxy is connected.';
      }).finally(function () {
        setBusy(form, false);
      });
    });

    copy.addEventListener('click', function () {
      var currentDraft = output.textContent.trim();
      if (!currentDraft || currentDraft === 'Add your details and select Generate draft to begin.') {
        status.textContent = 'Generate a draft before copying.';
        return;
      }
      navigator.clipboard.writeText(currentDraft).then(function () {
        status.textContent = 'Draft copied to your clipboard.';
        return null;
      }).catch(function () {
        status.textContent = 'Select the draft text and copy it from your browser.';
      });
    });
  }

  if (document.readyState === 'loading') {
    onReady(init);
  } else {
    init();
  }
}());