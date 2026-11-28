(function () {
  'use strict';

  var isSyncing = false;
  var syncScheduled = false;

  var SVG_BACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>';
  var SVG_CHECK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm4.71 8.21-5.25 5.25a1 1 0 0 1-1.42 0l-2.5-2.5a1 1 0 1 1 1.42-1.42l1.79 1.8 4.54-4.55a1 1 0 1 1 1.42 1.42Z"/></svg>';
  var SVG_BARS = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="12" width="4" height="9" rx="1.2"/><rect x="10" y="7" width="4" height="14" rx="1.2"/><rect x="17" y="3" width="4" height="18" rx="1.2"/></svg>';
  var SVG_BULB = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>';
  var SVG_BOLT = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2 4.5 13.5H11l-1 8.5 9.5-12H13l1-8z"/></svg>';
  var SVG_CHEVRON = '<svg class="edu-step-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>';

  var STEP_ICONS = {
    progress: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="13" width="3" height="7" rx="0.8"/><rect x="10.5" y="9" width="3" height="11" rx="0.8"/><rect x="17" y="5" width="3" height="15" rx="0.8"/><path d="M4 9l6.5-4.5L15 7l5-4"/></svg>',
    weakness: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    compare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>'
  };

  function inferResultBadgeLabel() {
    var path = (window.location.pathname || '').toLowerCase();
    var map = [
      ['wassce-aggregate', 'WASSCE Result'],
      ['wassce', 'WASSCE Result'],
      ['bece-aggregate', 'BECE Result'],
      ['bece', 'BECE Result'],
      ['waec', 'WAEC Result'],
      ['kcse-kuccps', 'KUCCPS Result'],
      ['kuccps', 'KUCCPS Result'],
      ['kcse-eligibility', 'KCSE Tier Result'],
      ['kcse', 'KCSE Result'],
      ['kcpe', 'KCPE Result'],
      ['jamb-utme', 'UTME Aggregate'],
      ['jamb', 'JAMB Result'],
      ['aps', 'APS Result'],
      ['matric-sba', 'Matric Result'],
      ['matric', 'Matric Result'],
      ['icass', 'ICASS Result'],
      ['nated', 'NATED Result'],
      ['ucas', 'UCAS Result'],
      ['atar', 'ATAR Result'],
      ['ncea', 'NCEA Result'],
      ['abitur', 'Abitur Result'],
      ['acsee', 'ACSEE Result'],
      ['csee', 'CSEE Result'],
      ['uace', 'UACE Result'],
      ['uce', 'UCE Result'],
      ['zimsec', 'ZIMSEC Result'],
      ['zambia-grade-12', 'ECZ Result'],
      ['ple-', 'PLE Result'],
      ['olevel', 'O-Level Check'],
      ['cgpa', 'CGPA Result'],
      ['gpa', 'GPA Result'],
      ['degree-classification', 'Degree Result'],
      ['scholarship', 'Scholarship Match'],
      ['loan-repayment', 'Loan Estimate'],
      ['student-loan', 'Loan Estimate'],
      ['budget', 'Budget Summary'],
      ['roi', 'ROI Estimate'],
      ['cost', 'Cost Summary'],
      ['converter', 'Conversion Result']
    ];
    for (var i = 0; i < map.length; i++) {
      if (path.indexOf(map[i][0]) !== -1) return map[i][1];
    }
    return 'Calculation Result';
  }

  function formatStatusTone(text) {
    var t = String(text || '').toLowerCase();
    if (/fail|ineligible|unqualified|not eligible|does not meet|missing/.test(t)) return 'is-caution';
    if (/first class|distinction|excellent|top|strongly|eligible|qualified|above|meets|competitive/.test(t)) return 'is-strong';
    return '';
  }

  function normalizeOneHeroHead(head) {
    if (!head) return;

    var headRow = head.querySelector('.results-head-row');
    var statGrid = head.querySelector('.stat-grid');
    var progressWrap = head.querySelector('.progress-wrap');

    if (headRow) {
      if (!headRow.querySelector('.edu-result-tag')) {
        var tag = document.createElement('span');
        tag.className = 'edu-result-tag';
        tag.textContent = inferResultBadgeLabel();
        headRow.insertBefore(tag, headRow.firstChild);
      }

      // Mirror #gpaValue into .results-head-row on gpa-calculator.html
      var existingBig = headRow.querySelector('.aggregate-big, .mean-big, .points-big, .aps-big, .chance-big, .total-big, .wcp-big, .big, .edu-hero-score, .results-head-row > .stat-value');
      var gpaValueEl = document.getElementById('gpaValue');
      if (!existingBig && gpaValueEl) {
        var mirrored = document.createElement('div');
        mirrored.className = 'edu-hero-score';
        mirrored.id = 'eduMirroredScore';
        mirrored.textContent = gpaValueEl.textContent.trim() || '—';
        var gpaBadge = document.getElementById('gpaBadge');
        if (gpaBadge && gpaBadge.parentNode === headRow) {
          headRow.insertBefore(mirrored, gpaBadge);
        } else {
          headRow.appendChild(mirrored);
        }
        existingBig = mirrored;
      } else if (existingBig && existingBig.id === 'eduMirroredScore' && gpaValueEl) {
        existingBig.textContent = gpaValueEl.textContent.trim() || '—';
      }

      if (existingBig) {
        var valText = (existingBig.textContent || '').trim();
        var isLongText = valText.length > 8 || /[a-zA-Z]{4,}/.test(valText);
        existingBig.classList.toggle('is-text-value', isLongText);
      }

      // Status pill: promote #gpaBadge OR status-like stat-card (only when >=1 other breakdown stat-card stays)
      var statusText = '';
      var gpaBadgeEl = headRow.querySelector('#gpaBadge, .gpa-badge');
      if (gpaBadgeEl) {
        gpaBadgeEl.classList.add('edu-mirrored');
        statusText = (gpaBadgeEl.textContent || '').trim();
      }

      if (statGrid) {
        var cards = Array.from(statGrid.querySelectorAll('.stat-card'));
        var candidateCard = null;
        if (!statusText && cards.length >= 2) {
          for (var c = 0; c < cards.length; c++) {
            var lblEl = cards[c].querySelector('.stat-label');
            var lblText = lblEl ? lblEl.textContent.trim() : '';
            if (/^(grade band|band|classification|status|eligibility|degree status|admission tier|cutoff comparison|tier|qualification tier|standing|class of degree|honours|progression status)$/i.test(lblText)) {
              candidateCard = cards[c];
              break;
            }
          }
        }
        cards.forEach(function (card) {
          card.classList.remove('edu-promoted-to-hero');
        });
        if (!statusText && candidateCard) {
          var valEl = candidateCard.querySelector('.stat-value');
          var candText = valEl ? valEl.textContent.trim() : '';
          if (candText && candText !== '—') {
            statusText = candText;
            candidateCard.classList.add('edu-promoted-to-hero');
          }
        } else if (gpaBadgeEl && gpaValueEl) {
          var gpaCard = gpaValueEl.closest('.stat-card');
          if (gpaCard && cards.length >= 2) {
            gpaCard.classList.add('edu-promoted-to-hero');
          }
        }
      }

      var pill = headRow.querySelector('.edu-status-pill');
      if (!pill) {
        pill = document.createElement('div');
        pill.className = 'edu-status-pill';
        var noteEl = headRow.querySelector('.aggregate-note, .mean-note, .points-note, .aps-note, .chance-note, .total-note, .wcp-note, p');
        if (noteEl && noteEl.parentNode === headRow) {
          headRow.insertBefore(pill, noteEl);
        } else {
          headRow.appendChild(pill);
        }
      }

      if (statusText && statusText !== '—') {
        pill.hidden = false;
        pill.className = 'edu-status-pill' + (formatStatusTone(statusText) ? ' ' + formatStatusTone(statusText) : '');
        pill.innerHTML = SVG_CHECK + '<span></span>';
        pill.querySelector('span').textContent = statusText;
      } else {
        pill.hidden = true;
      }
    }

    // Wrap right breakdown column cleanly
    var breakdownCol = head.querySelector('.edu-breakdown-col');
    if (statGrid || progressWrap) {
      if (!breakdownCol) {
        breakdownCol = document.createElement('div');
        breakdownCol.className = 'edu-breakdown-col';
        var h3 = document.createElement('h3');
        h3.className = 'edu-breakdown-heading';
        h3.textContent = 'Result Breakdown';
        breakdownCol.appendChild(h3);
        head.appendChild(breakdownCol);
      }

      if (statGrid) {
        if (statGrid.parentNode !== breakdownCol) {
          breakdownCol.appendChild(statGrid);
        }
        var visibleCards = [];
        Array.from(statGrid.querySelectorAll('.stat-card')).forEach(function (card) {
          card.classList.remove('edu-last-visible');
          var lbl = card.querySelector('.stat-label');
          var sub = card.querySelector('.stat-sub');
          var val = card.querySelector('.stat-value');
          if ((lbl || sub) && !card.querySelector('.edu-stat-copy')) {
            var copyWrap = document.createElement('div');
            copyWrap.className = 'edu-stat-copy';
            if (lbl) copyWrap.appendChild(lbl);
            if (sub) copyWrap.appendChild(sub);
            if (val && val.parentNode === card) {
              card.insertBefore(copyWrap, val);
            } else {
              card.appendChild(copyWrap);
            }
          }
          if (!card.classList.contains('edu-promoted-to-hero')) {
            visibleCards.push(card);
          }
        });
        if (visibleCards.length) {
          visibleCards[visibleCards.length - 1].classList.add('edu-last-visible');
        }
      }

      if (progressWrap && progressWrap.parentNode !== breakdownCol) {
        breakdownCol.appendChild(progressWrap);
      }

      var hasVisibleBreakdown = !!(
        (statGrid && statGrid.querySelector('.stat-card:not(.edu-promoted-to-hero)')) ||
        progressWrap
      );
      breakdownCol.hidden = !hasVisibleBreakdown;
      head.classList.toggle('edu-hero-split', hasVisibleBreakdown);
    }
  }

  function normalizeHeroHead(resultsEl) {
    var heads = Array.from(resultsEl.querySelectorAll('.results-head'));
    if (!heads.length) return;

    // Move direct-child .stat-grid placed outside .results-head (e.g. NSFAS / JAMB chance checkers)
    var directStatGrid = null;
    Array.from(resultsEl.children).forEach(function (ch) {
      if (ch.classList && ch.classList.contains('stat-grid')) {
        directStatGrid = ch;
      }
    });
    if (directStatGrid && !heads[0].querySelector('.stat-grid')) {
      heads[0].appendChild(directStatGrid);
    }

    heads.forEach(normalizeOneHeroHead);
  }

  // Keep only unique generated schedules, matched program/pathway lists, or multi-row payoff/trimester tables.
  // Suppress all redundant breakdown panels, static band/threshold checklists, and duplicate prose panels.
  function isEssentialDetailPanel(el) {
    if (!el || !el.classList) return false;
    if (el.id === 'singleResultsBlock' || el.id === 'trimesterResultsBlock') return true;
    if (el.classList.contains('timetable-panel') || el.classList.contains('blueprint-panel') || el.classList.contains('schedule-panel') || el.classList.contains('combo-panel')) {
      return true;
    }
    if (el.querySelector('#timetableDaysContainer, #weeklyGrid, #blueprintList, #milestoneList, #scheduleList, #scholarshipList, #pathwayRows, #scheduleBody, #comboList, #altContainer, #trimesterTableBody, .tri-result-table-wrap')) {
      return true;
    }
    return false;
  }

  function synthesizeKeyInsight(summary) {
    if (summary && summary.subjectInsight) {
      return summary.subjectInsight;
    }
    if (summary && summary.strongest && summary.weakest && summary.strongest.name !== summary.weakest.name) {
      return summary.strongest.name + ' (' + summary.strongest.score + ') is currently your strongest subject, while ' +
        summary.weakest.name + ' (' + summary.weakest.score + ') has the most room for improvement.';
    }
    if (summary && summary.higherIsBetter === false) {
      return 'A lower aggregate opens more competitive university options. Focusing on your weakest score can bring your total down quickly.';
    }
    if (summary && summary.higherIsBetter === true) {
      return 'Strengthening your lower-scoring components is the fastest way to lift your overall result and unlock more options.';
    }
    return 'Review your component breakdown above to spot the highest-impact areas to strengthen next.';
  }

  function polishDonationCard(card) {
    if (!card) return;
    var desc = card.querySelector('.afri-donation-desc');
    if (desc && !card.getAttribute('data-edu-polished')) {
      desc.textContent = 'Your support helps us maintain and improve AfriWidget for everyone.';
    }
    var submitBtn = card.querySelector('.pp-VXH3B6743NDVE');
    if (submitBtn && submitBtn.tagName === 'INPUT') {
      submitBtn.value = 'Donate / Contribute';
    }
    card.setAttribute('data-edu-polished', 'true');
  }

  function syncLayout() {
    if (isSyncing) return;
    if (!document.body || !document.body.classList.contains('edu-ds')) return;

    var donationOutside = document.getElementById('afriDonationCard');
    polishDonationCard(donationOutside);

    var resultsEl = document.getElementById('results');
    if (!resultsEl) return;

    isSyncing = true;
    try {
      // 1. Top Back Bar
      var backBar = resultsEl.querySelector('.edu-back-bar');
      if (!backBar) {
        backBar = document.createElement('div');
        backBar.className = 'edu-back-bar';
        backBar.innerHTML = '<button type="button" class="edu-back-btn">' + SVG_BACK + '<span>Back to Calculator</span></button>';
        backBar.querySelector('button').addEventListener('click', function () {
          var panel = document.querySelector('.calc-panel') || document.querySelector('form');
          if (panel && typeof panel.scrollIntoView === 'function') {
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
        resultsEl.insertBefore(backBar, resultsEl.firstChild);
      } else if (resultsEl.firstElementChild !== backBar) {
        resultsEl.insertBefore(backBar, resultsEl.firstChild);
      }

      // 2. Hero Result + Result Breakdown Card(s)
      normalizeHeroHead(resultsEl);
      var singleBlock = document.getElementById('singleResultsBlock');
      var trimesterBlock = document.getElementById('trimesterResultsBlock');
      var hasModeBlocks = !!(singleBlock && singleBlock.parentNode === resultsEl);
      var heroHead = null;
      var anchor = backBar;

      if (hasModeBlocks) {
        if (backBar.nextElementSibling !== singleBlock) {
          backBar.insertAdjacentElement('afterend', singleBlock);
        }
        anchor = singleBlock;
        if (trimesterBlock && trimesterBlock.parentNode === resultsEl) {
          if (anchor.nextElementSibling !== trimesterBlock) {
            anchor.insertAdjacentElement('afterend', trimesterBlock);
          }
          anchor = trimesterBlock;
        }
        [singleBlock, trimesterBlock].forEach(function (blk) {
          if (!blk) return;
          Array.from(blk.children).forEach(function (ch) {
            if (!ch.classList || ch.classList.contains('results-head')) return;
            var keep = isEssentialDetailPanel(ch);
            ch.classList.toggle('edu-suppressed', !keep);
            ch.hidden = !keep;
          });
        });
      } else {
        heroHead = resultsEl.querySelector('.results-head');
        if (heroHead && backBar.nextElementSibling !== heroHead) {
          backBar.insertAdjacentElement('afterend', heroHead);
        }
        anchor = heroHead || backBar;
      }

      // Locate integrated modules first so detailPanels can exclude them
      var aiSec = resultsEl.querySelector('.ai-section, #aiInsightSection, #aiSection, .ai-insight');
      var interpretBoxes = Array.from(resultsEl.querySelectorAll('.interpret-box, .tier-box'));
      var primaryInterpretBox = !aiSec && interpretBoxes.length ? interpretBoxes[0] : null;
      interpretBoxes.forEach(function (box) {
        var suppressBox = !!aiSec || box !== primaryInterpretBox;
        box.classList.toggle('edu-suppressed', suppressBox);
        box.hidden = suppressBox;
      });

      var academicProg = document.getElementById('afriAcademicProgress');
      var shareBar = document.getElementById('afriShareBar');
      var weaknessBanner = document.getElementById('weaknessCalloutBanner');
      var compareCard = document.getElementById('compareEntryCard');
      var donationCard = document.getElementById('afriDonationCard');

      // 3. Keep only essential primary outputs directly after Hero Card; suppress redundant breakdown/band panels
      var detailPanels = Array.from(resultsEl.children).filter(function (el) {
        if (!el || !el.classList) return false;
        if (
          el === backBar ||
          el === heroHead ||
          el === singleBlock ||
          el === trimesterBlock ||
          el === aiSec ||
          el === academicProg ||
          el === shareBar ||
          el === weaknessBanner ||
          el === compareCard ||
          el === donationCard ||
          el.classList.contains('edu-summary-card') ||
          el.classList.contains('edu-analysis-card') ||
          el.classList.contains('edu-next-steps-card')
        ) {
          return false;
        }
        return true;
      });
      detailPanels.forEach(function (panel) {
        var keep = isEssentialDetailPanel(panel);
        panel.classList.toggle('edu-suppressed', !keep);
        panel.hidden = !keep;
        if (keep) {
          if (anchor.nextElementSibling !== panel) {
            anchor.insertAdjacentElement('afterend', panel);
          }
          anchor = panel;
        }
      });

      var radarWrap = document.getElementById('afriRadarWrap');
      var summary = window.afriAcademicLatestSummary || null;

      // 4. Card 2: Legacy Summary Card (suppressed when AI insight is present; trending visual removed across all educational pages)
      var summaryCard = resultsEl.querySelector('.edu-summary-card');
      if (primaryInterpretBox) {
        if (!summaryCard) {
          summaryCard = document.createElement('section');
          summaryCard.className = 'edu-summary-card';
          summaryCard.setAttribute('aria-label', 'Performance Summary');
          summaryCard.innerHTML =
            '<div class="edu-summary-grid">' +
              '<div class="edu-summary-copy">' +
                '<h3 class="edu-section-heading">Performance Summary</h3>' +
                '<div class="edu-summary-body"></div>' +
              '</div>' +
            '</div>';
        }
        var summaryBody = summaryCard.querySelector('.edu-summary-body');
        if (summaryBody && primaryInterpretBox.parentNode !== summaryBody) {
          summaryBody.appendChild(primaryInterpretBox);
        }
        summaryCard.hidden = false;
        summaryCard.classList.remove('edu-suppressed');
        if (anchor.nextElementSibling !== summaryCard) {
          anchor.insertAdjacentElement('afterend', summaryCard);
        }
        anchor = summaryCard;
      } else if (summaryCard) {
        summaryCard.hidden = true;
        summaryCard.classList.add('edu-suppressed');
      }

      // 5. Card 3: Subject Performance + Key Insight + Optional AI insight
      var analysisCard = resultsEl.querySelector('.edu-analysis-card');
      if (!analysisCard) {
        analysisCard = document.createElement('section');
        analysisCard.className = 'edu-analysis-card';
        analysisCard.setAttribute('aria-label', 'Subject Performance and Key Insight');
        analysisCard.innerHTML =
          '<div class="edu-analysis-grid">' +
            '<div class="edu-subject-col" hidden>' +
              '<h3 class="edu-section-heading"><span class="edu-heading-icon">' + SVG_BARS + '</span><span>Subject Performance</span></h3>' +
              '<div class="edu-subject-chart-slot"></div>' +
            '</div>' +
            '<div class="edu-insight-col">' +
              '<div class="edu-insight-box">' +
                '<div class="edu-insight-head">' +
                  '<span class="edu-insight-icon">' + SVG_BULB + '</span>' +
                  '<h3 class="edu-insight-title">Key Insight</h3>' +
                '</div>' +
                '<p class="edu-insight-text"></p>' +
                '<div class="edu-insight-meta" hidden></div>' +
              '</div>' +
            '</div>' +
          '</div>';
      }

      var subjectCol = analysisCard.querySelector('.edu-subject-col');
      var chartSlot = analysisCard.querySelector('.edu-subject-chart-slot');
      var analysisGrid = analysisCard.querySelector('.edu-analysis-grid');
      var hasSubjectChart = !!(radarWrap && radarWrap.querySelector('svg, .afri-hbar-list'));

      if (hasSubjectChart) {
        if (radarWrap.parentNode !== chartSlot) {
          chartSlot.appendChild(radarWrap);
        }
        subjectCol.hidden = false;
        analysisGrid.classList.add('has-subjects');
      } else {
        subjectCol.hidden = true;
        analysisGrid.classList.remove('has-subjects');
      }

      var insightBox = analysisCard.querySelector('.edu-insight-box');
      var insightTextEl = analysisCard.querySelector('.edu-insight-text');
      var insightMetaEl = analysisCard.querySelector('.edu-insight-meta');
      var insightCol = analysisCard.querySelector('.edu-insight-col');

      var hasStrongWeak = !!(summary && summary.strongest && summary.weakest && summary.strongest.name !== summary.weakest.name);
      var showKeyInsight = !!(hasSubjectChart || hasStrongWeak || (summary && summary.subjectInsight) || !aiSec);
      if (insightBox) {
        insightBox.hidden = !showKeyInsight;
      }
      if (insightCol) {
        insightCol.classList.toggle('no-key-insight', !showKeyInsight);
      }
      if (showKeyInsight) {
        insightTextEl.textContent = synthesizeKeyInsight(summary);
      }

      if (hasStrongWeak) {
        insightMetaEl.innerHTML = '';
        var sSpan = document.createElement('span');
        sSpan.innerHTML = '<strong>Strongest:</strong> ';
        sSpan.appendChild(document.createTextNode(summary.strongest.name + (summary.strongest.score ? ' (' + summary.strongest.score + ')' : '')));
        var wSpan = document.createElement('span');
        wSpan.innerHTML = '<strong>Focus Area:</strong> ';
        wSpan.appendChild(document.createTextNode(summary.weakest.name + (summary.weakest.score ? ' (' + summary.weakest.score + ')' : '')));
        insightMetaEl.appendChild(sSpan);
        insightMetaEl.appendChild(wSpan);
        insightMetaEl.hidden = false;
      } else {
        insightMetaEl.hidden = true;
      }

      if (aiSec && aiSec.parentNode !== insightCol) {
        insightCol.appendChild(aiSec);
      }

      var showAnalysis = hasSubjectChart || !!aiSec;
      analysisCard.hidden = !showAnalysis;
      if (anchor.nextElementSibling !== analysisCard) {
        anchor.insertAdjacentElement('afterend', analysisCard);
      }
      anchor = analysisCard;

      // 6. Card 4: Your Next Steps
      var nextCard = resultsEl.querySelector('.edu-next-steps-card');
      if (!nextCard) {
        nextCard = document.createElement('section');
        nextCard.className = 'edu-next-steps-card';
        nextCard.setAttribute('aria-label', 'Your Next Steps');
        nextCard.innerHTML =
          '<h3 class="edu-section-heading"><span class="edu-heading-icon">' + SVG_BOLT + '</span><span>Your Next Steps</span></h3>' +
          '<div class="edu-steps-grid"></div>';
      }

      var stepsGrid = nextCard.querySelector('.edu-steps-grid');
      var actions = [];

      var historyBtn = document.getElementById('afriProgHistoryBtn');
      if (historyBtn) {
        actions.push({
          id: 'eduStepProgress',
          icon: STEP_ICONS.progress,
          title: 'Track Your Progress',
          sub: 'View past results and trends.',
          target: historyBtn
        });
      }

      var weaknessBtn = weaknessBanner ? weaknessBanner.querySelector('button') : null;
      if (weaknessBtn) {
        actions.push({
          id: 'eduStepWeakness',
          icon: STEP_ICONS.weakness,
          title: 'Analyse Your Performance',
          sub: 'Find your weak areas.',
          target: weaknessBtn
        });
      }

      var compareBtn = document.getElementById('openCompareBtn');
      if (compareBtn) {
        actions.push({
          id: 'eduStepCompare',
          icon: STEP_ICONS.compare,
          title: 'Compare Results',
          sub: 'See how you stack up.',
          target: compareBtn
        });
      }

      var shareModalBtn = document.getElementById('afriBarModalBtn');
      if (shareModalBtn) {
        actions.push({
          id: 'eduStepShare',
          icon: STEP_ICONS.share,
          title: 'Save or Share',
          sub: 'Keep a copy or share your result.',
          target: shareModalBtn
        });
      }

      var signature = actions.map(function (a) { return a.id; }).join('|');
      if (stepsGrid.getAttribute('data-sig') !== signature) {
        stepsGrid.innerHTML = '';
        actions.forEach(function (act) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.id = act.id;
          btn.className = 'edu-step-btn';
          btn.innerHTML =
            '<span class="edu-step-left">' +
              '<span class="edu-step-icon">' + act.icon + '</span>' +
              '<span class="edu-step-copy">' +
                '<span class="edu-step-title">' + act.title + '</span>' +
                '<span class="edu-step-sub">' + act.sub + '</span>' +
              '</span>' +
            '</span>' +
            SVG_CHEVRON;
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            var freshTarget = null;
            if (act.id === 'eduStepProgress') freshTarget = document.getElementById('afriProgHistoryBtn');
            else if (act.id === 'eduStepWeakness') freshTarget = document.querySelector('#weaknessCalloutBanner button');
            else if (act.id === 'eduStepCompare') freshTarget = document.getElementById('openCompareBtn');
            else if (act.id === 'eduStepShare') freshTarget = document.getElementById('afriBarModalBtn');
            if (freshTarget) freshTarget.click();
          });
          stepsGrid.appendChild(btn);
        });
        stepsGrid.setAttribute('data-sig', signature);
      }

      nextCard.hidden = actions.length === 0;
      if (anchor.nextElementSibling !== nextCard) {
        anchor.insertAdjacentElement('afterend', nextCard);
      }
      anchor = nextCard;

      // Absorb legacy banners cleanly once Next Steps holds their triggers
      if (academicProg && historyBtn) academicProg.classList.add('edu-absorbed');
      if (shareBar && shareModalBtn) shareBar.classList.add('edu-absorbed');
      if (weaknessBanner && weaknessBtn) weaknessBanner.classList.add('edu-absorbed');
      if (compareCard && compareBtn) compareCard.classList.add('edu-absorbed');
      if (actions.length > 0) document.body.classList.add('edu-hydrated');

      // 7. Card 5: Keep AfriWidget Free & Independent
      if (donationCard) {
        polishDonationCard(donationCard);
        if (donationCard.parentNode !== resultsEl || anchor.nextElementSibling !== donationCard) {
          anchor.insertAdjacentElement('afterend', donationCard);
        }
      }
    } finally {
      isSyncing = false;
    }
  }

  function scheduleSync(delay) {
    if (syncScheduled) return;
    syncScheduled = true;
    setTimeout(function () {
      syncScheduled = false;
      syncLayout();
    }, typeof delay === 'number' ? delay : 30);
  }

  window.afriEduSyncLayout = syncLayout;

  function init() {
    if (!document.body || !document.body.classList.contains('edu-ds')) return;

    syncLayout();

    var resultsEl = document.getElementById('results');
    if (resultsEl) {
      var obs = new MutationObserver(function () {
        if (!isSyncing) scheduleSync(35);
      });
      obs.observe(resultsEl, {
        attributes: true,
        attributeFilter: ['class', 'style'],
        childList: true,
        subtree: false
      });
    }

    window.addEventListener('afri:progress-updated', function () {
      scheduleSync(20);
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest('.btn-primary, #calcBtn, #calculateBtn, #sampleBtn, #resetBtn, [type="submit"]')) {
        scheduleSync(160);
        setTimeout(syncLayout, 320);
      }
    });

    document.addEventListener('submit', function (e) {
      if (e.target && e.target.classList && e.target.classList.contains('afri-paypal-form')) return;
      scheduleSync(160);
      setTimeout(syncLayout, 320);
    });

    var calcPanel = document.querySelector('.calc-panel');
    if (calcPanel && resultsEl) {
      var onLiveChange = function () {
        if (resultsEl.classList.contains('visible')) {
          scheduleSync(90);
        }
      };
      calcPanel.addEventListener('change', onLiveChange);
      calcPanel.addEventListener('input', onLiveChange);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
