function onReady(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } }
(function () {
  'use strict';

  var pick = function (items) {
    return items[Math.floor(Math.random() * items.length)];
  };
  var number = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  var clean = function (value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
  };
  var slug = function (value) {
    return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '');
  };
  var unique = function (make, count) {
    var values = [];
    var seen = {};
    var attempts = 0;
    while (values.length < count && attempts < count * 30) {
      var value = clean(make());
      attempts += 1;
      if (value && !seen[value.toLowerCase()]) {
        seen[value.toLowerCase()] = true;
        values.push(value);
      }
    }
    return values;
  };
  var escapeHtml = function (value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character];
    });
  };
  var copy = function (text, status, message) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(function () {
      status.textContent = message;
    }).catch(function () {
      status.textContent = 'Select the generated results and copy them from your browser.';
    });
  };
  var resetForm = function (form) {
    var replacement = form.cloneNode(true);
    form.parentNode.replaceChild(replacement, form);
    return replacement;
  };

  function renderCards(output, status, values, label) {
    output.innerHTML = values.map(function (value) {
      return '<button type="button" data-variety-value="' + escapeHtml(value) + '" class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-left font-semibold text-emerald-300 transition hover:border-yellow-400 hover:text-yellow-300">' + escapeHtml(value) + '</button>';
    }).join('');
    output.querySelectorAll('[data-variety-value]').forEach(function (button) {
      button.addEventListener('click', function () {
        copy(button.getAttribute('data-variety-value'), status, 'Copied: ' + button.getAttribute('data-variety-value'));
      });
    });
    status.textContent = values.length + ' ' + label + ' generated with varied patterns. Generate again for a fresh set.';
  }

  function emailTool() {
    var form = document.getElementById('emailForm');
    if (!form) return;
    var first = ['Ada', 'Amina', 'Amara', 'Daniel', 'David', 'Grace', 'Ibrahim', 'Jordan', 'Kwame', 'Lina', 'Maya', 'Nia', 'Noah', 'Sam', 'Zuri', 'Chidi', 'Fatima', 'Kofi', 'Leila', 'Tariq'];
    var last = ['Mensah', 'Okafor', 'Smith', 'Khan', 'Ndlovu', 'Otieno', 'Johnson', 'Diallo', 'Moyo', 'Taylor', 'Bello', 'Mwangi', 'Boateng', 'Adeyemi', 'Williams', 'Mbeki'];
    var teams = ['support', 'hello', 'billing', 'orders', 'sales', 'admin', 'care', 'info', 'testing', 'team', 'returns', 'success', 'events', 'press', 'studio'];
    var make = function () {
      var count = Math.max(1, Math.min(250, parseInt(document.getElementById('emailCount').value, 10) || 100));
      var selected = document.getElementById('emailDomain').value;
      var custom = clean(document.getElementById('customEmailDomain').value).toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/^@/, '').replace(/\/.*$/, '');
      var domain = custom || selected;
      var style = document.getElementById('emailStyle').value;
      var prefix = slug(document.getElementById('emailPrefix').value).slice(0, 18);
      if (!/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?(?:\.[a-z]{2,63})$/.test(domain)) {
        document.getElementById('emailStatus').textContent = 'Please enter a valid custom domain such as yourcompany.test, or clear the custom field.';
        document.getElementById('emailOutput').value = '';
        return [];
      }
      return unique(function () {
        var f = slug(pick(first));
        var l = slug(pick(last));
        var n = number(1, 9999);
        var core;
        if (style === 'team') {
          core = pick(teams) + (Math.random() > 0.6 ? '-' + pick(['desk', 'hq', 'inbox', 'unit']) : '');
        } else if (style === 'numeric') {
          core = (prefix || 'user') + pick(['-', '.', '_']) + String(number(1, 999999)).padStart(3, '0');
        } else if (style === 'mixed') {
          core = pick([f + '.' + l, f + l, f[0] + l, l + '.' + f, f + '_' + l, f + l + n]);
        } else {
          core = pick([f + '.' + l, f + l, f[0] + l, f + '_' + l, l + '.' + f, f + '.' + l[0]]);
        }
        return (prefix && style !== 'numeric' ? prefix + pick(['.', '-', '_']) : '') + core + '@' + domain;
      }, count);
    };
    var run = function () {
      var values = make();
      var output = document.getElementById('emailOutput');
      if (values.length) {
        output.value = values.join(',\n');
        document.getElementById('emailStatus').textContent = values.length + ' varied mock email addresses generated locally. Nothing was sent.';
      }
      return values;
    };
    onReady(function () {
      form = resetForm(form);
      form.addEventListener('submit', function (event) { event.preventDefault(); run(); });
      document.getElementById('copyEmails').addEventListener('click', function () {
        var text = document.getElementById('emailOutput').value || run().join(',\n');
        copy(text, document.getElementById('emailStatus'), 'Copied the varied email list to your clipboard.');
      });
      run();
    });
  }

  function usernameTool() {
    var form = document.getElementById('usernameForm');
    if (!form) return;
    var pools = {
      gaming: {
        a: ['Nova', 'Raptor', 'Pixel', 'Drift', 'Blaze', 'Quest', 'Orbit', 'Mamba', 'Titan', 'Vortex', 'Echo', 'Lynx', 'Frost', 'Rogue', 'Pulse', 'Comet', 'Warden', 'Ember'],
        b: ['Rider', 'Forge', 'Strike', 'Runner', 'Hunter', 'Byte', 'Realm', 'Rush', 'Clutch', 'Mode', 'Core', 'Ghost', 'Raid', 'Spark']
      },
      social: {
        a: ['Daily', 'Simply', 'Vibe', 'Urban', 'Sunny', 'Kind', 'Story', 'Wander', 'Create', 'Curious', 'Golden', 'Mellow', 'Local', 'Chill'],
        b: ['Notes', 'Journal', 'Corner', 'Life', 'Lens', 'Vibes', 'Pages', 'Spot', 'World', 'Mood', 'Muse', 'Club']
      },
      professional: {
        a: ['Studio', 'Works', 'Collective', 'Labs', 'Digital', 'Advisory', 'Craft', 'Consult', 'Projects', 'Office', 'Signal', 'Method', 'North'],
        b: ['Group', 'Co', 'Partners', 'Hub', 'House', 'Network', 'Desk', 'Practice', 'Lab', 'Works']
      },
      custom: {
        a: ['Bright', 'True', 'Open', 'Next', 'Local', 'Bold', 'Fresh', 'Common', 'North', 'Signal', 'Clear', 'Wild', 'Golden'],
        b: ['Wave', 'Craft', 'Space', 'Spark', 'Field', 'Base', 'Path', 'Zone', 'Circle', 'Foundry', 'House']
      }
    };
    var run = function () {
      var style = document.getElementById('usernameStyle').value;
      var count = Math.max(1, Math.min(100, parseInt(document.getElementById('usernameCount').value, 10) || 20));
      var keyword = slug(document.getElementById('usernameKeyword').value).slice(0, 20);
      var numbers = document.getElementById('usernameNumbers').checked;
      var separators = document.getElementById('usernameSeparator').checked;
      var set = pools[style];
      var values = unique(function () {
        var a = keyword && Math.random() > 0.25 ? keyword : pick(set.a).toLowerCase();
        var b = pick(set.b).toLowerCase();
        var separator = separators ? pick(['', '.', '_', '-']) : '';
        var pattern = pick([a + separator + b, b + separator + a, a + separator + b + pick(['', 'hq', 'io', 'x']), a + separator + pick(['the', 'its', 'hey']) + separator + b]);
        return pattern + (numbers ? pick(['', String(number(7, 99)), String(number(100, 9999))]) : '');
      }, count);
      renderCards(document.getElementById('usernameOutput'), document.getElementById('usernameStatus'), values, 'username ideas');
      return values;
    };
    onReady(function () {
      form = resetForm(form);
      form.addEventListener('submit', function (event) { event.preventDefault(); run(); });
      document.getElementById('copyUsernames').addEventListener('click', function () {
        var values = [].map.call(document.querySelectorAll('#usernameOutput [data-variety-value]'), function (node) { return node.getAttribute('data-variety-value'); });
        copy((values.length ? values : run()).join('\n'), document.getElementById('usernameStatus'), 'Copied the varied username ideas.');
      });
      run();
    });
  }

  function businessTool() {
    var form = document.getElementById('businessForm');
    if (!form) return;
    var words = {
      tech: ['Cloud', 'Bright', 'Signal', 'Orbit', 'Stack', 'Nova', 'Pixel', 'Vector', 'Nimble', 'Circuit', 'Kernel', 'Beacon', 'Relay', 'Layer', 'Atlas'],
      food: ['Savor', 'Fresh', 'Bowl', 'Crave', 'Table', 'Zest', 'Harvest', 'Hearth', 'Garden', 'Pantry', 'Mingle', 'Spice', 'Cocoa', 'Ladle', 'Gather'],
      fashion: ['Mode', 'Edit', 'Muse', 'Luxe', 'Thread', 'Glow', 'Atelier', 'Velvet', 'Bloom', 'Aura', 'Silk', 'Form', 'Drape', 'Opal'],
      finance: ['Clear', 'Ledger', 'Nexa', 'Bridge', 'Signal', 'Sterling', 'Crown', 'Heritage', 'Anchor', 'Trust', 'Prime', 'Summit', 'Aureus', 'Merit'],
      health: ['Vital', 'Pulse', 'Well', 'Bloom', 'Core', 'Cedar', 'Grace', 'Harmony', 'Care', 'Thrive', 'Kind', 'Serene', 'Renew'],
      creative: ['Frame', 'Canvas', 'Signal', 'Story', 'Pixel', 'Craft', 'Verse', 'Foundry', 'Lumen', 'Muse', 'Wonder', 'Common', 'Arc'],
      logistics: ['Swift', 'Route', 'Grid', 'Cargo', 'Link', 'Harbor', 'Atlas', 'Union', 'Transit', 'Fleet', 'Ready', 'Crest', 'Move'],
      education: ['Learn', 'Spark', 'Nova', 'Path', 'Mind', 'Academy', 'Sage', 'Summit', 'Beacon', 'Bright', 'Curious', 'Merit', 'Clarity']
    };
    var suffixes = {
      tech: ['Labs', 'Works', 'Systems', 'Digital', 'Cloud', 'Studio'],
      food: ['Kitchen', 'Table', 'House', 'Market', 'Kitchen', 'Co'],
      fashion: ['Studio', 'House', 'Collective', 'Edit', 'Atelier'],
      finance: ['Partners', 'Advisory', 'Capital', 'Group', 'Trust'],
      health: ['Wellness', 'Care', 'Clinic', 'Collective', 'Health'],
      creative: ['Studio', 'Works', 'House', 'Media', 'Creative'],
      logistics: ['Logistics', 'Supply', 'Express', 'Hub', 'Routes'],
      education: ['Academy', 'Learning', 'Institute', 'House', 'School']
    };
    var run = function () {
      var industry = document.getElementById('businessIndustry').value;
      var tone = document.getElementById('businessTone').value;
      var count = Math.max(1, Math.min(100, parseInt(document.getElementById('businessCount').value, 10) || 25));
      var keyword = clean(document.getElementById('businessKeyword').value).replace(/[^a-zA-Z0-9À-ÿ -]/g, '').slice(0, 18);
      var addSuffix = document.getElementById('businessSuffix').checked;
      var toneWords = {
        modern: ['Nexa', 'Pulse', 'Bright', 'Next', 'Elevate'],
        classic: ['Cedar', 'Heritage', 'Union', 'Pioneer', 'Crown'],
        friendly: ['Hello', 'Kind', 'Good', 'Mingle', 'Neighbor'],
        premium: ['Aureus', 'Reserve', 'Lumen', 'Prime', 'Opal']
      };
      var runWords = words[industry].concat(toneWords[tone]);
      var values = unique(function () {
        var a = keyword && Math.random() > 0.35 ? keyword : pick(runWords);
        var b = pick(runWords);
        var suffix = addSuffix ? pick(suffixes[industry]) : '';
        return pick([
          a + (suffix ? ' ' + suffix : ''),
          a + ' ' + b,
          a + b,
          b + ' ' + a,
          a + ' & ' + b,
          keyword ? keyword + ' ' + pick(['Collective', 'House', 'Works', 'Co', 'Studio']) : a + ' ' + pick(['Group', 'House', 'Works'])
        ]);
      }, count);
      renderCards(document.getElementById('businessOutput'), document.getElementById('businessStatus'), values, 'business name ideas');
      return values;
    };
    onReady(function () {
      form = resetForm(form);
      form.addEventListener('submit', function (event) { event.preventDefault(); run(); });
      document.getElementById('copyBusiness').addEventListener('click', function () {
        var values = [].map.call(document.querySelectorAll('#businessOutput [data-variety-value]'), function (node) { return node.getAttribute('data-variety-value'); });
        copy((values.length ? values : run()).join('\n'), document.getElementById('businessStatus'), 'Copied the varied business name ideas.');
      });
      run();
    });
  }

  function teamTool() {
    var form = document.getElementById('teamForm');
    if (!form) return;
    var vocab = {
      sports: ['Titans', 'Falcons', 'Warriors', 'Rockets', 'Wolves', 'Giants', 'Chargers', 'Runners', 'Strikers', 'Storm', 'United', 'Dynamos'],
      gaming: ['Raiders', 'Sentinels', 'Vanguard', 'Legion', 'Hunters', 'Strikers', 'Raid', 'Pixel', 'Respawn', 'Nexus', 'Command', 'Phantoms'],
      office: ['Leaders', 'Drivers', 'Makers', 'Achievers', 'Force', 'Thinkers', 'Builders', 'Strategists', 'Pioneers', 'Catalysts', 'Crew'],
      school: ['Trailblazers', 'Scholars', 'Champions', 'Explorers', 'Pioneers', 'Quizmasters', 'Readers', 'Inventors', 'Pathfinders', 'Bright Minds']
    };
    var energy = {
      bold: ['United', 'Elite', 'Force', 'Legion', 'Rising', 'Alliance'],
      funny: ['Snack Squad', 'Reply All', 'Bench Legends', 'Late Slips', 'Coffee Crew', 'Goal Diggers'],
      clever: ['The Think Tank', 'Net Gains', 'Point Taken', 'The Brain Trust', 'Mission Possible', 'Ctrl Alt Elite'],
      professional: ['Collective', 'Partners', 'Alliance', 'Network', 'Group', 'Division']
    };
    var run = function () {
      var theme = document.getElementById('teamTheme').value;
      var mood = document.getElementById('teamEnergy').value;
      var count = Math.max(1, Math.min(100, parseInt(document.getElementById('teamCount').value, 10) || 20));
      var keyword = clean(document.getElementById('teamKeyword').value).replace(/[^a-zA-Z0-9À-ÿ -]/g, '').slice(0, 18);
      var values = unique(function () {
        var core = keyword && Math.random() > 0.35 ? keyword : pick(vocab[theme]);
        var moodWord = pick(energy[mood]);
        return pick([core, 'The ' + core, core + ' ' + moodWord, 'Team ' + core, core + ' ' + pick(vocab[theme]), 'The ' + moodWord, core + ' Collective']);
      }, count);
      renderCards(document.getElementById('teamOutput'), document.getElementById('teamStatus'), values, 'team name ideas');
      return values;
    };
    onReady(function () {
      form = resetForm(form);
      form.addEventListener('submit', function (event) { event.preventDefault(); run(); });
      document.getElementById('copyTeams').addEventListener('click', function () {
        var values = [].map.call(document.querySelectorAll('#teamOutput [data-variety-value]'), function (node) { return node.getAttribute('data-variety-value'); });
        copy((values.length ? values : run()).join('\n'), document.getElementById('teamStatus'), 'Copied the varied team name ideas.');
      });
      run();
    });
  }

  function nicknameTool() {
    var form = document.getElementById('nicknameForm');
    if (!form) return;
    var sets = {
      fantasy: [['Moon', 'Star', 'Ember', 'Silver', 'Raven', 'Willow', 'Frost', 'Dawn', 'Shadow', 'River', 'Sable', 'Storm'], ['Warden', 'Whisper', 'Bloom', 'Rune', 'Vale', 'Flame', 'Dancer', 'Seeker', 'Grove', 'Song', 'Mist', 'Crown']],
      cool: [['Neon', 'Aero', 'Zero', 'Echo', 'Nova', 'Vex', 'Night', 'Drift', 'Chrome', 'Urban', 'Ghost', 'Flux'], ['Wave', 'Rush', 'Core', 'Line', 'Mode', 'Spark', 'Byte', 'Edge', 'Phase', 'Shift', 'Drive']],
      cute: [['Bunny', 'Peach', 'Honey', 'Mochi', 'Berry', 'Panda', 'Sunny', 'Coco', 'Poppy', 'Mimi', 'Cookie', 'Sprinkle'], ['Bean', 'Boo', 'Bubbles', 'Puff', 'Sprout', 'Cupcake', 'Paws', 'Daisy', 'Mallow', 'Pop', 'Bug', 'Pie']],
      funny: [['Captain', 'Professor', 'Snack', 'Waffle', 'Sir', 'Tiny', 'Dancing', 'Mister', 'Pickle', 'Couch', 'Mayor', 'Doctor'], ['Noodle', 'Potato', 'Giggles', 'Pants', 'Toast', 'Pigeon', 'Muffin', 'Wizard', 'Banana', 'Socks', 'Pickles', 'Wobble']]
    };
    var run = function () {
      var style = document.getElementById('nicknameStyle').value;
      var count = Math.max(1, Math.min(100, parseInt(document.getElementById('nicknameCount').value, 10) || 25));
      var keyword = clean(document.getElementById('nicknameKeyword').value).replace(/[^a-zA-Z0-9À-ÿ -]/g, '').slice(0, 18);
      var numbers = document.getElementById('nicknameNumbers').checked;
      var separators = document.getElementById('nicknameSeparator').checked;
      var list = sets[style];
      var values = unique(function () {
        var first = keyword && Math.random() > 0.3 ? keyword : pick(list[0]);
        var last = pick(list[1]);
        var joiner = separators ? pick([' ', '-', '_', '']) : '';
        var value = pick([first + joiner + last, last + joiner + first, first + joiner + pick(list[0]), 'The ' + first + joiner + last]);
        return value + (numbers && Math.random() > 0.25 ? pick(['', String(number(2, 99)), String(number(100, 999))]) : '');
      }, count);
      renderCards(document.getElementById('nicknameOutput'), document.getElementById('nicknameStatus'), values, 'nickname ideas');
      return values;
    };
    onReady(function () {
      form = resetForm(form);
      form.addEventListener('submit', function (event) { event.preventDefault(); run(); });
      document.getElementById('copyNicknames').addEventListener('click', function () {
        var values = [].map.call(document.querySelectorAll('#nicknameOutput [data-variety-value]'), function (node) { return node.getAttribute('data-variety-value'); });
        copy((values.length ? values : run()).join('\n'), document.getElementById('nicknameStatus'), 'Copied the varied nickname ideas.');
      });
      run();
    });
  }

  function addressTool() {
    var form = document.getElementById('addressForm');
    if (!form) return;
    var data = {
      us: { cities: ['Austin', 'Chicago', 'Denver', 'Phoenix', 'Portland', 'Boston', 'Atlanta', 'Seattle'], regions: ['CA', 'NY', 'TX', 'IL', 'CO', 'WA', 'GA', 'OR'], streets: ['Maple', 'Oak', 'Cedar', 'Juniper', 'River', 'Sunset', 'Franklin', 'Willow', 'Highland', 'Lakeview'], types: ['Street', 'Avenue', 'Road', 'Drive', 'Lane', 'Boulevard'] },
      uk: { cities: ['Bristol', 'Leeds', 'London', 'Manchester', 'Oxford', 'Brighton', 'Birmingham', 'York'], regions: ['Greater London', 'West Yorkshire', 'Bristol', 'Lancashire', 'Oxfordshire', 'Sussex', 'West Midlands'], streets: ['High', 'Victoria', 'King', 'Church', 'Station', 'Mill', 'Park', 'Queens', 'Market'], types: ['Road', 'Street', 'Lane', 'Close', 'Gardens', 'Walk'] },
      ca: { cities: ['Calgary', 'Halifax', 'Montreal', 'Toronto', 'Ottawa', 'Vancouver', 'Winnipeg', 'Quebec City'], regions: ['AB', 'NS', 'ON', 'QC', 'BC', 'MB'], streets: ['King', 'Queen', 'Lake', 'Pine', 'Cedar', 'Park', 'Maple', 'Victoria', 'Riverside'], types: ['Street', 'Avenue', 'Road', 'Drive', 'Boulevard'] },
      gh: { cities: ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast', 'Ho', 'Koforidua'], regions: ['Greater Accra', 'Ashanti', 'Northern', 'Western', 'Central', 'Volta', 'Eastern'], streets: ['Independence', 'Adum', 'Airport', 'Cocoa', 'Liberation', 'Oxford', 'Ring', 'Anloga'], types: ['Road', 'Avenue', 'Street', 'Close'] },
      ng: { cities: ['Abuja', 'Ibadan', 'Lagos', 'Enugu', 'Kano', 'Benin City', 'Ilorin'], regions: ['FCT', 'Oyo', 'Lagos', 'Enugu', 'Kano', 'Edo', 'Kwara'], streets: ['Airport', 'Allen', 'Ahmadu Bello', 'Ring', 'Garden', 'Opebi', 'Marina', 'Garki'], types: ['Road', 'Crescent', 'Close', 'Street', 'Avenue'] },
      ke: { cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Malindi'], regions: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kilifi'], streets: ['Kenyatta', 'Moi', 'River', 'Market', 'Ngong', 'Kilimani', 'Muthaiga'], types: ['Road', 'Avenue', 'Street', 'Lane'] },
      za: { cities: ['Cape Town', 'Durban', 'Johannesburg', 'Pretoria', 'Gqeberha', 'Bloemfontein'], regions: ['Western Cape', 'KwaZulu-Natal', 'Gauteng', 'Eastern Cape', 'Free State'], streets: ['Long', 'Church', 'Main', 'Nelson Mandela', 'Market', 'Jan Smuts', 'Baker'], types: ['Street', 'Road', 'Avenue', 'Drive', 'Way'] }
    };
    var postal = function (region) {
      if (region === 'uk') return pick(['SW1A 1AA', 'M1 1AE', 'BS1 4DJ', 'LS1 2AB', 'OX1 3PA', 'B1 1AA']);
      if (region === 'ca') return pick(['K1A 0B1', 'M5V 2T6', 'T2P 1J9', 'H3A 1A1', 'V6B 2W9']);
      if (region === 'za') return String(number(1000, 9999));
      if (region === 'ng') return String(number(100000, 999999));
      return String(number(10000, 99999));
    };
    var run = function () {
      var key = document.getElementById('addressRegion').value;
      var region = data[key];
      var count = Math.max(1, Math.min(100, parseInt(document.getElementById('addressCount').value, 10) || 12));
      var values = unique(function () {
        return number(10, 9999) + ' ' + pick(region.streets) + ' ' + pick(region.types) + ', ' + pick(region.cities) + ', ' + pick(region.regions) + ' ' + postal(key);
      }, count);
      var output = document.getElementById('addressOutput');
      output.innerHTML = values.map(function (value) {
        return '<div class="address-card rounded-2xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm leading-7 text-slate-200">' + escapeHtml(value) + '</div>';
      }).join('');
      document.getElementById('addressStatus').textContent = values.length + ' varied fictional address records generated locally.';
      return values;
    };
    onReady(function () {
      form = resetForm(form);
      form.addEventListener('submit', function (event) { event.preventDefault(); run(); });
      document.getElementById('copyAddresses').addEventListener('click', function () {
        var cards = [].map.call(document.querySelectorAll('#addressOutput .address-card'), function (node) { return node.textContent; });
        copy((cards.length ? cards : run()).join('\n'), document.getElementById('addressStatus'), 'Copied the varied mock addresses.');
      });
      run();
    });
  }

  function colorTool() {
    var form = document.getElementById('colorForm');
    if (!form) return;
    var run = function () {
      var count = Math.max(1, Math.min(50, parseInt(document.getElementById('colorCount').value, 10) || 12));
      var family = document.getElementById('colorFamily').value;
      var values = unique(function () {
        var h = family === 'warm' ? number(0, 75) : family === 'cool' ? number(165, 300) : number(0, 359);
        var s = family === 'bright' ? number(78, 100) : number(42, 96);
        var l = family === 'bright' ? number(45, 66) : number(30, 72);
        var c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
        var x = c * (1 - Math.abs((h / 60) % 2 - 1));
        var m = l / 100 - c / 2;
        var r = 0, g = 0, b = 0;
        if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
        r = Math.round((r + m) * 255); g = Math.round((g + m) * 255); b = Math.round((b + m) * 255);
        var hex = '#' + [r, g, b].map(function (v) { return v.toString(16).padStart(2, '0').toUpperCase(); }).join('');
        return hex + '|' + r + '|' + g + '|' + b + '|' + h + '|' + s + '|' + l;
      }, count).map(function (value) {
        var parts = value.split('|');
        return { hex: parts[0], rgb: 'rgb(' + parts[1] + ', ' + parts[2] + ', ' + parts[3] + ')', hsl: 'hsl(' + parts[4] + ', ' + parts[5] + '%, ' + parts[6] + '%)' };
      });
      document.getElementById('colorOutput').innerHTML = values.map(function (color) {
        return '<div class="color-card rounded-2xl border border-slate-700 bg-slate-950 p-4"><div class="mb-4 h-20 rounded-xl border border-white/10 shadow-inner" style="background:' + color.hex + '"></div><p class="font-mono text-sm leading-7 text-slate-200"><strong class="text-yellow-300">' + color.hex + '</strong><br>' + color.rgb + '<br>' + color.hsl + '</p></div>';
      }).join('');
      document.getElementById('colorStatus').textContent = values.length + ' varied color swatches generated locally.';
      return values;
    };
    onReady(function () {
      form = resetForm(form);
      form.addEventListener('submit', function (event) { event.preventDefault(); run(); });
      document.getElementById('copyColors').addEventListener('click', function () {
        var text = [].map.call(document.querySelectorAll('#colorOutput .color-card'), function (node) { return node.textContent.trim().replace(/\n+/g, ' | '); }).join('\n');
        copy(text || [].map.call(run(), function (color) { return color.hex + ' | ' + color.rgb + ' | ' + color.hsl; }).join('\n'), document.getElementById('colorStatus'), 'Copied the varied color palette.');
      });
      run();
    });
  }

  function dateTool() {
    var form = document.getElementById('dateForm');
    if (!form) return;
    onReady(function () {
      form = resetForm(form);
      var pad = function (n) { return n < 10 ? '0' + n : String(n); };
      var localDate = function (value) { var parts = value.split('-'); return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])); };
      var format = function (date, kind) {
        var y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (kind === 'us') return pad(m) + '/' + pad(d) + '/' + y;
        if (kind === 'intl') return pad(d) + '/' + pad(m) + '/' + y;
        if (kind === 'long') return months[m - 1] + ' ' + d + ', ' + y;
        return y + '-' + pad(m) + '-' + pad(d);
      };
      var run = function () {
        var startValue = document.getElementById('dateStart').value, endValue = document.getElementById('dateEnd').value;
        var status = document.getElementById('dateStatus'), output = document.getElementById('dateOutput');
        if (!startValue || !endValue) { status.textContent = 'Choose both a start date and an end date.'; output.value = ''; return []; }
        var start = localDate(startValue), end = localDate(endValue);
        if (end < start) { status.textContent = 'End date must be on or after the start date.'; output.value = ''; return []; }
        var count = Math.max(1, Math.min(250, parseInt(document.getElementById('dateCount').value, 10) || 20));
        var days = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
        var indexes = [];
        for (var i = 0; i < Math.min(count, days); i += 1) indexes.push(i);
        while (indexes.length < count) indexes.push(number(0, days - 1));
        indexes.sort(function () { return Math.random() - 0.5; });
        var values = indexes.map(function (index) { return format(new Date(start.getTime() + index * 86400000), document.getElementById('dateFormat').value); });
        output.value = values.join(',\n');
        status.textContent = values.length + ' varied dates generated locally between ' + startValue + ' and ' + endValue + '.';
        return values;
      };
      form.addEventListener('submit', function (event) { event.preventDefault(); run(); });
      document.getElementById('copyDates').addEventListener('click', function () {
        var text = document.getElementById('dateOutput').value || run().join('\n');
        copy(text, document.getElementById('dateStatus'), 'Copied the varied dates.');
      });
      run();
    });
  }

  function phoneTool() {
    var form = document.getElementById('phoneForm');
    if (!form) return;
    var formats = {
      us: { code: '+1', local: function () { return '(' + number(200, 899) + ') ' + number(200, 899) + '-' + number(1000, 9999); } },
      gb: { code: '+44', local: function () { return '0' + number(7000, 7999) + ' ' + number(100000, 999999); } },
      gh: { code: '+233', local: function () { return '0' + number(200, 599) + ' ' + number(100, 999) + ' ' + number(1000, 9999); } },
      ng: { code: '+234', local: function () { return '0' + number(700, 909) + ' ' + number(100, 999) + ' ' + number(1000, 9999); } },
      ke: { code: '+254', local: function () { return '0' + number(700, 799) + ' ' + number(100000, 999999); } },
      za: { code: '+27', local: function () { return '0' + number(60, 89) + ' ' + number(100, 999) + ' ' + number(1000, 9999); } },
      in: { code: '+91', local: function () { return '0' + number(600, 999) + ' ' + number(100000, 999999); } }
    };
    onReady(function () {
      form = resetForm(form);
      var run = function () {
        var item = formats[document.getElementById('phoneRegion').value];
        var count = Math.max(1, Math.min(100, parseInt(document.getElementById('phoneCount').value, 10) || 12));
        var international = document.getElementById('phoneFormat').value === 'international';
        var values = unique(function () {
          var local = item.local();
          return international ? item.code + ' ' + local.replace(/^0/, '') : local;
        }, count);
        document.getElementById('phoneOutput').value = values.join(',\n');
        document.getElementById('phoneStatus').textContent = values.length + ' varied fictional phone numbers generated locally.';
        return values;
      };
      form.addEventListener('submit', function (event) { event.preventDefault(); run(); });
      document.getElementById('copyPhones').addEventListener('click', function () {
        var text = document.getElementById('phoneOutput').value || run().join('\n');
        copy(text, document.getElementById('phoneStatus'), 'Copied the varied mock phone numbers.');
      });
      run();
    });
  }

  emailTool();
  usernameTool();
  businessTool();
  teamTool();
  nicknameTool();
  addressTool();
  colorTool();
  dateTool();
  phoneTool();
}());