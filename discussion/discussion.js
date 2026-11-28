(function () {
  'use strict';

  const DEFAULT_ICE_SERVERS = [
    { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }
  ];
  const STORAGE_USERNAME_KEY = 'afriwidget_discussion_username';
  const STORAGE_THEME_KEY = 'afriwidget_discussion_theme';
  const RECONNECT_MAX_MS = 8000;
  const SPEAK_THRESHOLD = 0.024;
  const SPEAK_HANG_MS = 450;

  const state = {
    ws: null,
    wsUrl: null,
    iceServers: DEFAULT_ICE_SERVERS,
    turnConfigured: false,
    clientId: null,
    username: '',
    connected: false,
    reconnectDelay: 1000,
    reconnectTimer: null,
    heartbeatTimer: null,
    lobby: {
      publicRoomCount: 0,
      randomQueueCount: 0,
      publicRooms: []
    },
    inRandomQueue: false,
    queueStartedAt: 0,
    queueTimer: null,
    room: null,
    participants: new Map(),
    peers: new Map(),
    localStream: null,
    micActive: false,
    muted: true,
    hostMuted: false,
    speaking: false,
    audioCtx: null,
    analyserTimer: null,
    lastSpeakSignalAt: 0,
    autoplayBlocked: false,
    pendingAction: null,
    callStartedAt: 0,
    callTimerInterval: null,
    callChatOpen: false,
    mobileRoomTab: 'stage',
    unreadMessages: 0,
    theme: 'light'
  };

  const els = {
    app: document.getElementById('discussionApp'),
    robotsMeta: document.querySelector('meta[name="robots"]'),
    connStatusDot: document.getElementById('connStatusDot'),
    connStatusText: document.getElementById('connStatusText'),
    turnStatusText: document.getElementById('turnStatusText'),
    usernameForm: document.getElementById('usernameForm'),
    usernameInput: document.getElementById('usernameInput'),
    usernameSaveBtn: document.getElementById('usernameSaveBtn'),
    activeUserBadge: document.getElementById('activeUserBadge'),
    noticeBanner: document.getElementById('noticeBanner'),
    noticeText: document.getElementById('noticeText'),
    noticeDismiss: document.getElementById('noticeDismiss'),
    lobbyView: document.getElementById('lobbyView'),
    roomView: document.getElementById('roomView'),
    publicRoomCount: document.getElementById('publicRoomCount'),
    publicRoomLiveLine: document.getElementById('publicRoomLiveLine'),
    joinPublicBtn: document.getElementById('joinPublicBtn'),
    customRoomsCount: document.getElementById('customRoomsCount'),
    randomQueueCount: document.getElementById('randomQueueCount'),
    findSomeoneBtn: document.getElementById('findSomeoneBtn'),
    randomSearchingBox: document.getElementById('randomSearchingBox'),
    randomWaitElapsed: document.getElementById('randomWaitElapsed'),
    cancelRandomBtn: document.getElementById('cancelRandomBtn'),
    createRoomForm: document.getElementById('createRoomForm'),
    roomNameInput: document.getElementById('roomNameInput'),
    roomTopicInput: document.getElementById('roomTopicInput'),
    roomAccessSelect: document.getElementById('roomAccessSelect'),
    createRoomBtn: document.getElementById('createRoomBtn'),
    publicRoomsList: document.getElementById('publicRoomsList'),
    privateJoinForm: document.getElementById('privateJoinForm'),
    privateRoomCodeInput: document.getElementById('privateRoomCodeInput'),
    roomModeLabel: document.getElementById('roomModeLabel'),
    roomTitleHeading: document.getElementById('roomTitleHeading'),
    roomTopicText: document.getElementById('roomTopicText'),
    roomParticipantBadge: document.getElementById('roomParticipantBadge'),
    copyInviteBtn: document.getElementById('copyInviteBtn'),
    findAnotherBtn: document.getElementById('findAnotherBtn'),
    endRoomBtn: document.getElementById('endRoomBtn'),
    leaveRoomBtn: document.getElementById('leaveRoomBtn'),
    voiceStatusLabel: document.getElementById('voiceStatusLabel'),
    voiceStatusDot: document.getElementById('voiceStatusDot'),
    voicePrimaryBtn: document.getElementById('voicePrimaryBtn'),
    voicePrimaryLabel: document.getElementById('voicePrimaryLabel'),
    micStateLabel: document.getElementById('micStateLabel'),
    voiceExtraBar: document.getElementById('voiceExtraBar'),
    enableMicBtn: document.getElementById('enableMicBtn'),
    toggleMuteBtn: document.getElementById('toggleMuteBtn'),
    disableMicBtn: document.getElementById('disableMicBtn'),
    unlockAudioBtn: document.getElementById('unlockAudioBtn'),
    participantsHeadingCount: document.getElementById('participantsHeadingCount'),
    participantsList: document.getElementById('participantsList'),
    chatMessages: document.getElementById('chatMessages'),
    chatForm: document.getElementById('chatForm'),
    chatAttachBtn: document.getElementById('chatAttachBtn'),
    chatFileInput: document.getElementById('chatFileInput'),
    chatInput: document.getElementById('chatInput'),
    chatCharCount: document.getElementById('chatCharCount'),
    chatSendBtn: document.getElementById('chatSendBtn'),
    audioContainer: document.getElementById('audioContainer'),
    // Room mobile tabs & self label
    roomTabStageBtn: document.getElementById('roomTabStageBtn'),
    roomTabChatBtn: document.getElementById('roomTabChatBtn'),
    roomChatTabBadge: document.getElementById('roomChatTabBadge'),
    roomStagePane: document.getElementById('roomStagePane'),
    roomChatPane: document.getElementById('roomChatPane'),
    roomSelfLabel: document.getElementById('roomSelfLabel'),
    // iPhone Call UI elements
    callTimer: document.getElementById('callTimer'),
    callPartnerName: document.getElementById('callPartnerName'),
    callPartnerInitials: document.getElementById('callPartnerInitials'),
    callPartnerStatus: document.getElementById('callPartnerStatus'),
    callAvatarRing: document.getElementById('callAvatarRing'),
    callVoiceBars: document.getElementById('callVoiceBars'),
    callMuteCaption: document.getElementById('callMuteCaption'),
    callChatSheet: document.getElementById('callChatSheet'),
    toggleCallChatBtn: document.getElementById('toggleCallChatBtn'),
    closeCallChatBtn: document.getElementById('closeCallChatBtn'),
    callChatBadge: document.getElementById('callChatBadge'),
    callLastMsgPreview: document.getElementById('callLastMsgPreview')
  };

  function showNotice(text, tone) {
    if (!els.noticeBanner || !els.noticeText) return;
    els.noticeText.textContent = text;
    els.noticeBanner.className = 'disc-notice visible ' + (tone === 'error' ? 'disc-notice-error' : tone === 'warn' ? 'disc-notice-warn' : 'disc-notice-info');
  }

  function hideNotice() {
    if (!els.noticeBanner) return;
    els.noticeBanner.className = 'disc-notice';
    els.noticeText.textContent = '';
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    state.theme = isDark ? 'dark' : 'light';
    document.body.classList.toggle('disc-theme-dark', isDark);
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', isDark ? 'Switch to white background' : 'Switch to dark background');
      const labelEl = btn.querySelector('.theme-toggle-label');
      if (labelEl) {
        labelEl.textContent = isDark ? 'White' : 'Dark';
      }
    });
    try {
      localStorage.setItem(STORAGE_THEME_KEY, state.theme);
    } catch {
      // ignore storage error
    }
  }

  function toggleTheme() {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  function formatTime(isoString) {
    try {
      const date = new Date(isoString);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }

  function getPageMode() {
    const mode = els.app ? els.app.getAttribute('data-page-mode') : '';
    if (mode === 'public' || mode === 'random' || mode === 'rooms' || mode === 'hub') {
      return mode;
    }
    return 'hub';
  }

  function getPageBasePath() {
    const mode = getPageMode();
    if (mode === 'public') return '/discussion/public-room/';
    if (mode === 'random') return '/discussion/random-connect/';
    if (mode === 'rooms') return '/discussion/rooms/';
    return '/discussion/';
  }

  function updateRobotsDirective() {
    if (!els.robotsMeta) return;
    const params = new URLSearchParams(window.location.search);
    const hasSessionUrl = Boolean(
      params.get('room') ||
      params.get('invite') ||
      params.get('session') ||
      params.get('mode') === 'private' ||
      window.location.pathname.indexOf('/discussion/room/') === 0
    );
    const inTempRoom = Boolean(state.room && !state.room.permanent);
    if (hasSessionUrl || inTempRoom) {
      els.robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else {
      els.robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1');
    }
  }

  function updateConnectionUI() {
    if (!els.connStatusDot || !els.connStatusText) return;
    if (state.connected) {
      els.connStatusDot.className = 'status-dot online';
      els.connStatusText.textContent = 'Connected to live server';
    } else {
      els.connStatusDot.className = 'status-dot offline';
      els.connStatusText.textContent = 'Connecting to live server...';
    }
    if (els.turnStatusText) {
      els.turnStatusText.textContent = state.turnConfigured
        ? 'Voice transport: STUN + TURN relay configured'
        : 'Voice transport: STUN peer-to-peer';
    }
  }

  function sendWs(payload) {
    if (!state.ws || state.ws.readyState !== WebSocket.OPEN) {
      return false;
    }
    state.ws.send(JSON.stringify(payload));
    return true;
  }

  function normalizeRoomCodeInput(raw) {
    const trimmed = String(raw || '').trim();
    if (!trimmed) return '';
    try {
      if (/^https?:\/\//i.test(trimmed)) {
        const parsed = new URL(trimmed);
        const qp = parsed.searchParams.get('room') || parsed.searchParams.get('invite');
        if (qp) return qp.trim();
        const m = parsed.pathname.match(/\/discussion\/room\/([a-zA-Z0-9_-]+)/);
        if (m) return m[1];
      }
    } catch {
      // treat as plain code
    }
    return trimmed;
  }

  function getInviteRoomFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const qp = params.get('room') || params.get('invite');
    if (qp && /^[a-zA-Z0-9_-]{4,48}$/.test(qp.trim())) {
      return qp.trim();
    }
    const match = window.location.pathname.match(/\/discussion\/room\/([a-zA-Z0-9_-]{4,48})/);
    if (match) return match[1];
    return '';
  }

  function syncRandomNameButtonLabel() {
    if (!els.usernameSaveBtn || getPageMode() !== 'random') return;
    const labelEl = els.usernameSaveBtn.querySelector('.name-btn-label');
    const current = String(els.usernameInput ? els.usernameInput.value : '').trim();
    const isUnchangedSaved = Boolean(state.username && current === state.username);
    const nextLabel = isUnchangedSaved ? 'Edit' : 'Save';
    if (labelEl) {
      labelEl.textContent = nextLabel;
    } else {
      els.usernameSaveBtn.textContent = nextLabel;
    }
  }

  function syncUsernameUI() {
    if (!els.activeUserBadge) return;
    const mode = getPageMode();
    if (mode === 'random') {
      els.activeUserBadge.textContent = '';
      if (state.username) {
        els.activeUserBadge.appendChild(document.createTextNode('Saved name: '));
        const strong = document.createElement('strong');
        strong.textContent = state.username;
        els.activeUserBadge.appendChild(strong);
        els.activeUserBadge.classList.add('active');
      } else {
        els.activeUserBadge.textContent = 'Pick a temporary name to start matching.';
        els.activeUserBadge.classList.remove('active');
      }
      syncRandomNameButtonLabel();
      return;
    }
    const isPublicMode = mode === 'public';
    if (state.username) {
      els.activeUserBadge.textContent = isPublicMode
        ? ('Ready to join as ' + state.username + ' — tap Join Room to enter.')
        : ('Chatting as ' + state.username);
      els.activeUserBadge.classList.add('active');
    } else {
      els.activeUserBadge.textContent = isPublicMode
        ? 'Enter a display name to join and start chatting.'
        : 'Pick a temporary name to talk or message (no sign-up needed).';
      els.activeUserBadge.classList.remove('active');
    }
  }

  function ensureUsername(actionFn) {
    const candidate = String(els.usernameInput ? els.usernameInput.value : '').trim();
    if (state.username && (!candidate || candidate === state.username)) {
      return true;
    }
    if (candidate.length >= 2) {
      state.pendingAction = actionFn || null;
      sendWs({ type: 'set-username', username: candidate });
      return false;
    }
    state.pendingAction = actionFn || null;
    showNotice('Please enter a display name (2 to 24 characters) first.', 'warn');
    if (els.usernameInput) {
      els.usernameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      els.usernameInput.focus();
    }
    return false;
  }

  function createPeopleCountNode(text) {
    const wrap = document.createElement('span');
    wrap.className = 'live-metric-inline';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '14');
    svg.setAttribute('height', '14');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z');
    svg.appendChild(path);
    const label = document.createElement('span');
    label.textContent = text;
    wrap.appendChild(svg);
    wrap.appendChild(label);
    return wrap;
  }

  function renderLobby() {
    const pageMode = getPageMode();
    if (els.publicRoomCount) {
      const n = state.lobby.publicRoomCount || 0;
      els.publicRoomCount.textContent = (pageMode === 'hub' || pageMode === 'public')
        ? (n + ' online')
        : (n + (n === 1 ? ' participant online' : ' participants online'));
    }
    if (els.publicRoomLiveLine) {
      const n = state.lobby.publicRoomCount || 0;
      els.publicRoomLiveLine.textContent = '';
      const strong = document.createElement('strong');
      strong.textContent = n + (n === 1 ? ' person' : ' people');
      els.publicRoomLiveLine.appendChild(strong);
      els.publicRoomLiveLine.appendChild(document.createTextNode(n === 1 ? ' is online right now' : ' are online right now'));
    }
    if (els.randomQueueCount) {
      const q = state.lobby.randomQueueCount || 0;
      if (pageMode === 'random') {
        els.randomQueueCount.textContent = String(q);
      } else {
        els.randomQueueCount.textContent = pageMode === 'hub'
          ? (q + ' waiting')
          : (q + (q === 1 ? ' person waiting in queue' : ' people waiting in queue'));
      }
    }
    if (els.customRoomsCount) {
      const c = Array.isArray(state.lobby.publicRooms) ? state.lobby.publicRooms.length : 0;
      els.customRoomsCount.textContent = c + (c === 1 ? ' room active' : ' rooms active');
    }

    if (els.findSomeoneBtn && els.randomSearchingBox) {
      els.findSomeoneBtn.style.display = state.inRandomQueue ? 'none' : 'inline-flex';
      els.randomSearchingBox.style.display = state.inRandomQueue ? 'block' : 'none';
    }

    if (els.publicRoomsList) {
      els.publicRoomsList.textContent = '';
      const rooms = Array.isArray(state.lobby.publicRooms) ? state.lobby.publicRooms : [];
      if (rooms.length === 0) {
        if (pageMode === 'hub') {
          const emptyRow = document.createElement('div');
          emptyRow.className = 'popular-empty-row';

          const copy = document.createElement('div');
          copy.className = 'popular-empty-copy';
          const title = document.createElement('div');
          title.className = 'popular-room-title';
          title.textContent = 'No custom group rooms open yet';
          const sub = document.createElement('div');
          sub.className = 'popular-room-sub';
          sub.textContent = 'Start a public or private group room for friends, study partners or colleagues.';
          copy.appendChild(title);
          copy.appendChild(sub);

          const cta = document.createElement('a');
          cta.href = '/discussion/rooms/';
          cta.className = 'btn-yellow-sm disc-persist-nav';
          cta.textContent = 'Create Room';

          emptyRow.appendChild(copy);
          emptyRow.appendChild(cta);
          els.publicRoomsList.appendChild(emptyRow);
        } else if (pageMode === 'rooms') {
          const emptyText = document.createElement('p');
          emptyText.className = 'explore-empty-text';
          emptyText.textContent = 'No public rooms are active right now.';
          els.publicRoomsList.appendChild(emptyText);

          const ctaWrap = document.createElement('div');
          const ctaBtn = document.createElement('button');
          ctaBtn.type = 'button';
          ctaBtn.className = 'explore-empty-cta';
          const ctaLabel = document.createElement('span');
          ctaLabel.textContent = 'Be the first to create one.';
          const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          arrowSvg.setAttribute('width', '16');
          arrowSvg.setAttribute('height', '16');
          arrowSvg.setAttribute('fill', 'none');
          arrowSvg.setAttribute('stroke', 'currentColor');
          arrowSvg.setAttribute('stroke-width', '2.2');
          arrowSvg.setAttribute('viewBox', '0 0 24 24');
          arrowSvg.setAttribute('aria-hidden', 'true');
          const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          arrowPath.setAttribute('stroke-linecap', 'round');
          arrowPath.setAttribute('stroke-linejoin', 'round');
          arrowPath.setAttribute('d', 'M5 12h14M13 6l6 6-6 6');
          arrowSvg.appendChild(arrowPath);
          ctaBtn.appendChild(ctaLabel);
          ctaBtn.appendChild(arrowSvg);
          ctaBtn.addEventListener('click', () => {
            if (els.roomNameInput) {
              els.roomNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
              els.roomNameInput.focus();
            }
          });
          ctaWrap.appendChild(ctaBtn);
          els.publicRoomsList.appendChild(ctaWrap);
        } else {
          const empty = document.createElement('p');
          empty.className = 'empty-list-msg';
          empty.textContent = 'No active public custom rooms right now. Create one to get started.';
          els.publicRoomsList.appendChild(empty);
        }
      } else {
        rooms.forEach((r) => {
          const row = document.createElement('div');
          row.className = 'public-room-row';

          const info = document.createElement('div');
          info.className = 'public-room-info';

          const title = document.createElement('div');
          title.className = 'public-room-title';
          title.textContent = r.name;

          if (pageMode === 'hub') {
            const sub = document.createElement('div');
            sub.className = 'popular-room-sub';
            sub.textContent = r.topic && r.topic !== 'General discussion' ? r.topic : 'Open group conversation';

            const countMeta = document.createElement('div');
            countMeta.className = 'public-room-meta';
            countMeta.appendChild(createPeopleCountNode(r.participantCount + ' online'));

            info.appendChild(title);
            info.appendChild(sub);
            info.appendChild(countMeta);
          } else {
            const meta = document.createElement('div');
            meta.className = 'public-room-meta';
            meta.textContent = r.topic + ' · Host: ' + r.hostName + ' · ' + r.participantCount + ' in room';

            info.appendChild(title);
            info.appendChild(meta);
          }

          if (pageMode === 'hub') {
            const joinLink = document.createElement('a');
            joinLink.href = '/discussion/rooms/?room=' + encodeURIComponent(r.id);
            joinLink.className = 'btn-yellow-sm disc-persist-nav';
            joinLink.textContent = 'Join Room';
            row.appendChild(info);
            row.appendChild(joinLink);
          } else {
            const joinBtn = document.createElement('button');
            joinBtn.type = 'button';
            joinBtn.className = 'btn-yellow-sm';
            joinBtn.textContent = 'Join Room';
            joinBtn.addEventListener('click', () => {
              hideNotice();
              const doJoin = () => sendWs({ type: 'room:join', roomId: r.id });
              if (ensureUsername(doJoin)) {
                doJoin();
              }
            });
            row.appendChild(info);
            row.appendChild(joinBtn);
          }

          els.publicRoomsList.appendChild(row);
        });
      }
    }
  }

  function getInitials(name) {
    const clean = String(name || '').trim();
    if (!clean) return '?';
    const parts = clean.split(/[\s_.-]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  }

  function updateUnreadBadges() {
    const countStr = state.unreadMessages > 99 ? '99+' : String(state.unreadMessages);
    if (els.callChatBadge) {
      els.callChatBadge.textContent = countStr;
      els.callChatBadge.style.display = state.unreadMessages > 0 ? 'inline-flex' : 'none';
    }
    if (els.roomChatTabBadge) {
      els.roomChatTabBadge.textContent = countStr;
      els.roomChatTabBadge.style.display = state.unreadMessages > 0 ? 'inline-flex' : 'none';
    }
  }

  function setCallChatOpen(open) {
    state.callChatOpen = Boolean(open);
    if (els.callChatSheet) {
      els.callChatSheet.classList.toggle('open', state.callChatOpen);
    }
    if (els.toggleCallChatBtn) {
      els.toggleCallChatBtn.classList.toggle('is-active', state.callChatOpen);
    }
    if (state.callChatOpen) {
      state.unreadMessages = 0;
      updateUnreadBadges();
      if (els.callLastMsgPreview) {
        els.callLastMsgPreview.style.display = 'none';
      }
      if (els.chatMessages) {
        els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
      }
      if (els.chatInput && !els.chatInput.disabled) {
        setTimeout(() => { try { els.chatInput.focus(); } catch {} }, 60);
      }
    }
  }

  function setMobileRoomTab(tab) {
    state.mobileRoomTab = tab === 'chat' ? 'chat' : 'stage';
    const isChat = state.mobileRoomTab === 'chat';
    if (els.roomStagePane) {
      els.roomStagePane.classList.toggle('mobile-hidden', isChat);
      els.roomStagePane.classList.toggle('pane-hidden', isChat);
    }
    if (els.roomChatPane) {
      els.roomChatPane.classList.toggle('mobile-hidden', !isChat);
      els.roomChatPane.classList.toggle('pane-hidden', !isChat);
    }
    if (els.roomTabStageBtn) {
      els.roomTabStageBtn.classList.toggle('active', !isChat);
      els.roomTabStageBtn.setAttribute('aria-selected', !isChat ? 'true' : 'false');
    }
    if (els.roomTabChatBtn) {
      els.roomTabChatBtn.classList.toggle('active', isChat);
      els.roomTabChatBtn.setAttribute('aria-selected', isChat ? 'true' : 'false');
    }
    if (isChat) {
      state.unreadMessages = 0;
      updateUnreadBadges();
      if (els.chatMessages) {
        els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
      }
    }
  }

  function stopCallTimer() {
    if (state.callTimerInterval) {
      clearInterval(state.callTimerInterval);
      state.callTimerInterval = null;
    }
  }

  function startCallTimer() {
    stopCallTimer();
    state.callStartedAt = Date.now();
    const renderTimer = () => {
      if (!els.callTimer) return;
      const elapsed = Math.max(0, Math.floor((Date.now() - state.callStartedAt) / 1000));
      const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const secs = String(elapsed % 60).padStart(2, '0');
      els.callTimer.textContent = mins + ':' + secs;
    };
    renderTimer();
    state.callTimerInterval = setInterval(renderTimer, 1000);
  }

  function renderCallScreenPartner() {
    if (!state.room || getPageMode() !== 'random') return;
    const list = Array.from(state.participants.values());
    const partner = list.find((p) => p.id !== state.clientId) || null;
    const self = state.participants.get(state.clientId) || null;

    if (state.room.partnerDisconnected || !partner) {
      if (els.callPartnerName && !partner) {
        els.callPartnerName.textContent = 'Call Ended';
      }
      if (els.callPartnerInitials && !partner) {
        els.callPartnerInitials.textContent = '--';
      }
      if (els.callPartnerStatus) {
        els.callPartnerStatus.textContent = 'Partner disconnected · Tap Next Match or End Call';
      }
      if (els.callAvatarRing) {
        els.callAvatarRing.classList.remove('is-speaking');
        els.callAvatarRing.classList.add('is-ended');
      }
      if (els.callVoiceBars) {
        els.callVoiceBars.classList.remove('active');
      }
      return;
    }

    if (els.callAvatarRing) {
      els.callAvatarRing.classList.remove('is-ended');
    }
    if (els.callPartnerName) {
      els.callPartnerName.textContent = partner.username;
    }
    if (els.callPartnerInitials) {
      els.callPartnerInitials.textContent = getInitials(partner.username);
    }

    let statusLine = 'Connected · Listening';
    if (partner.speaking) {
      statusLine = partner.username + ' is speaking...';
    } else if (partner.micActive && !partner.muted) {
      statusLine = 'Partner mic active';
    } else if (partner.muted && partner.micActive) {
      statusLine = 'Partner muted mic';
    } else if (self && self.speaking) {
      statusLine = 'You are speaking...';
    } else if (state.micActive && !state.muted) {
      statusLine = 'Connected · Your mic is live';
    } else {
      statusLine = 'Connected · Tap Mic to speak';
    }
    if (els.callPartnerStatus) {
      els.callPartnerStatus.textContent = statusLine;
    }

    const anyoneSpeaking = Boolean(partner.speaking || (self && self.speaking));
    if (els.callAvatarRing) {
      els.callAvatarRing.classList.toggle('is-speaking', Boolean(partner.speaking));
    }
    if (els.callVoiceBars) {
      els.callVoiceBars.classList.toggle('active', anyoneSpeaking);
    }
  }

  function renderParticipants() {
    if (!state.room) return;
    if (getPageMode() === 'random') {
      renderCallScreenPartner();
    }
    if (!els.participantsList) return;
    els.participantsList.textContent = '';

    const list = Array.from(state.participants.values()).sort((a, b) => {
      if (a.id === state.clientId) return -1;
      if (b.id === state.clientId) return 1;
      if (a.id === state.room.creatorId) return -1;
      if (b.id === state.room.creatorId) return 1;
      return (a.joinedAt || 0) - (b.joinedAt || 0);
    });

    const count = list.length;
    if (els.participantsHeadingCount) {
      els.participantsHeadingCount.textContent = String(count);
    }
    if (els.roomParticipantBadge) {
      els.roomParticipantBadge.textContent = getPageMode() === 'random'
        ? (count + (count === 1 ? ' participant online' : ' participants online'))
        : (count + ' online');
    }
    if (els.roomSelfLabel && state.username) {
      els.roomSelfLabel.textContent = 'You: ' + state.username;
    }

    const iAmCreator = Boolean(state.room.mode === 'custom' && state.room.creatorId === state.clientId);

    list.forEach((p) => {
      const item = document.createElement('li');
      item.className = 'seat-card' + (p.speaking ? ' is-speaking' : '') + (p.id === state.clientId ? ' is-self' : '');

      const seatTop = document.createElement('div');
      seatTop.className = 'seat-top';

      const avatar = document.createElement('div');
      avatar.className = 'seat-avatar' + (p.speaking ? ' is-speaking' : (p.micActive && !p.muted ? ' is-live' : ''));
      avatar.textContent = getInitials(p.username);
      avatar.setAttribute('aria-hidden', 'true');

      const badges = document.createElement('div');
      badges.className = 'seat-badges';
      if (state.room.mode === 'custom' && p.id === state.room.creatorId) {
        const hostTag = document.createElement('span');
        hostTag.className = 'seat-badge seat-badge-host';
        hostTag.textContent = 'Host';
        badges.appendChild(hostTag);
      }
      if (p.id === state.clientId) {
        const youTag = document.createElement('span');
        youTag.className = 'seat-badge seat-badge-you';
        youTag.textContent = 'You';
        badges.appendChild(youTag);
      }

      seatTop.appendChild(avatar);
      seatTop.appendChild(badges);
      item.appendChild(seatTop);

      const nameSpan = document.createElement('div');
      nameSpan.className = 'seat-name';
      nameSpan.textContent = p.username;
      item.appendChild(nameSpan);

      const statusLine = document.createElement('div');
      statusLine.className = 'seat-status' + (p.speaking ? ' is-speaking' : '');

      const indicator = document.createElement('span');
      indicator.className = p.speaking ? 'speak-indicator active' : (p.micActive && !p.muted ? 'speak-indicator ready' : 'speak-indicator');
      indicator.setAttribute('aria-hidden', 'true');

      const statusText = document.createElement('span');
      if (p.speaking) {
        statusText.textContent = 'Speaking live';
      } else if (p.hostMuted) {
        statusText.textContent = 'Muted by host';
      } else if (!p.micActive) {
        statusText.textContent = 'Listening only';
      } else if (p.muted) {
        statusText.textContent = 'Mic muted';
      } else {
        statusText.textContent = 'Mic on';
      }

      statusLine.appendChild(indicator);
      statusLine.appendChild(statusText);
      item.appendChild(statusLine);

      if (iAmCreator && p.id !== state.clientId) {
        const actions = document.createElement('div');
        actions.className = 'participant-host-actions';

        const muteBtn = document.createElement('button');
        muteBtn.type = 'button';
        muteBtn.className = 'btn-mini-outline';
        muteBtn.textContent = p.hostMuted ? 'Allow Unmute' : 'Mute';
        muteBtn.addEventListener('click', () => {
          sendWs({
            type: 'host:mute',
            targetId: p.id,
            muted: !p.hostMuted
          });
        });

        const kickBtn = document.createElement('button');
        kickBtn.type = 'button';
        kickBtn.className = 'btn-mini-danger';
        kickBtn.textContent = 'Remove';
        kickBtn.addEventListener('click', () => {
          sendWs({
            type: 'host:kick',
            targetId: p.id
          });
        });

        actions.appendChild(muteBtn);
        actions.appendChild(kickBtn);
        item.appendChild(actions);
      }

      els.participantsList.appendChild(item);
    });
  }

  function appendChatMessage(msg, shouldScroll = true, isLiveEvent = false) {
    if (!els.chatMessages) return;
    const isModernRoom = Boolean(els.voicePrimaryBtn);
    const row = document.createElement('div');

    if (msg.system) {
      row.className = 'chat-msg chat-msg-system';
      const textSpan = document.createElement('span');
      textSpan.className = 'chat-system-text';
      textSpan.textContent = msg.text;

      const timeSpan = document.createElement('span');
      timeSpan.className = 'chat-time';
      timeSpan.textContent = formatTime(msg.timestamp);

      row.appendChild(textSpan);
      row.appendChild(timeSpan);
    } else if (isModernRoom) {
      const isSelf = msg.senderId === state.clientId;
      if (isSelf) {
        row.className = 'chat-msg chat-msg-self chat-row-out';
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble-out';

        const body = document.createElement('span');
        body.className = 'chat-body-out';
        body.textContent = msg.text;

        const meta = document.createElement('span');
        meta.className = 'chat-out-meta';

        const timeSpan = document.createElement('span');
        timeSpan.className = 'chat-time-out';
        timeSpan.textContent = formatTime(msg.timestamp);

        const checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        checkSvg.setAttribute('width', '14');
        checkSvg.setAttribute('height', '14');
        checkSvg.setAttribute('fill', 'none');
        checkSvg.setAttribute('stroke', 'currentColor');
        checkSvg.setAttribute('stroke-width', '2.2');
        checkSvg.setAttribute('viewBox', '0 0 24 24');
        checkSvg.setAttribute('aria-hidden', 'true');
        const checkPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        checkPath.setAttribute('stroke-linecap', 'round');
        checkPath.setAttribute('stroke-linejoin', 'round');
        checkPath.setAttribute('d', 'M2 12.5l4 4 8-8M9 16.5l2 2 11-11');
        checkSvg.appendChild(checkPath);

        meta.appendChild(timeSpan);
        meta.appendChild(checkSvg);
        bubble.appendChild(body);
        bubble.appendChild(meta);
        row.appendChild(bubble);
      } else {
        row.className = 'chat-msg chat-row-in';

        const avatar = document.createElement('div');
        avatar.className = 'chat-avatar';
        avatar.textContent = getInitials(msg.username);
        avatar.setAttribute('aria-hidden', 'true');

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble-in';

        const author = document.createElement('div');
        author.className = 'chat-author';
        author.textContent = msg.username;

        const body = document.createElement('div');
        body.className = 'chat-body';
        body.textContent = msg.text;

        bubble.appendChild(author);
        bubble.appendChild(body);

        const timeSpan = document.createElement('span');
        timeSpan.className = 'chat-time';
        timeSpan.textContent = formatTime(msg.timestamp);

        row.appendChild(avatar);
        row.appendChild(bubble);
        row.appendChild(timeSpan);
      }

      if (isLiveEvent && msg.senderId !== state.clientId && state.mobileRoomTab !== 'chat') {
        state.unreadMessages += 1;
        updateUnreadBadges();
      }
    } else {
      row.className = msg.senderId === state.clientId ? 'chat-msg chat-msg-self' : 'chat-msg';
      const header = document.createElement('div');
      header.className = 'chat-msg-head';

      const author = document.createElement('span');
      author.className = 'chat-author';
      author.textContent = msg.username + (msg.senderId === state.clientId ? ' (You)' : '');

      const timeSpan = document.createElement('span');
      timeSpan.className = 'chat-time';
      timeSpan.textContent = formatTime(msg.timestamp);

      header.appendChild(author);
      header.appendChild(timeSpan);

      const body = document.createElement('div');
      body.className = 'chat-body';
      body.textContent = msg.text;

      row.appendChild(header);
      row.appendChild(body);

      if (isLiveEvent && msg.senderId !== state.clientId) {
        const mode = getPageMode();
        if (mode === 'random' && !state.callChatOpen) {
          state.unreadMessages += 1;
          updateUnreadBadges();
          if (els.callLastMsgPreview) {
            els.callLastMsgPreview.textContent = msg.username + ': ' + msg.text;
            els.callLastMsgPreview.style.display = 'block';
          }
        } else if (mode !== 'random' && state.mobileRoomTab !== 'chat') {
          state.unreadMessages += 1;
          updateUnreadBadges();
        }
      }
    }

    els.chatMessages.appendChild(row);
    if (shouldScroll) {
      els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
    }
  }

  function renderVoiceControls() {
    if (els.voicePrimaryBtn) {
      els.voicePrimaryBtn.disabled = state.hostMuted;
      els.voicePrimaryBtn.classList.toggle('is-active', Boolean(state.micActive && !state.muted));
      els.voicePrimaryBtn.classList.toggle('is-muted', Boolean(state.micActive && state.muted));
      els.voicePrimaryBtn.classList.toggle('is-speaking', Boolean(state.speaking));

      if (els.voicePrimaryLabel) {
        if (state.hostMuted) {
          els.voicePrimaryLabel.textContent = 'Host Muted';
        } else if (!state.micActive) {
          els.voicePrimaryLabel.textContent = 'Tap to Speak';
        } else if (state.muted) {
          els.voicePrimaryLabel.textContent = 'Tap to Unmute';
        } else {
          els.voicePrimaryLabel.textContent = 'Tap to Mute';
        }
      }
      if (els.voiceStatusLabel) {
        if (state.hostMuted) {
          els.voiceStatusLabel.textContent = 'Host Muted';
        } else if (state.speaking) {
          els.voiceStatusLabel.textContent = 'Speaking';
        } else {
          els.voiceStatusLabel.textContent = 'Listening';
        }
      }
      if (els.voiceStatusDot) {
        els.voiceStatusDot.className = 'voice-status-dot' + (state.hostMuted ? ' is-host-muted' : ' is-listening');
      }
      if (els.micStateLabel) {
        if (!state.micActive) {
          els.micStateLabel.textContent = 'Mic Off';
        } else if (state.muted || state.hostMuted) {
          els.micStateLabel.textContent = 'Muted';
        } else {
          els.micStateLabel.textContent = 'Mic On';
        }
      }
      if (els.voiceExtraBar) {
        els.voiceExtraBar.style.display = (state.micActive || state.autoplayBlocked) ? 'flex' : 'none';
      }
      if (els.disableMicBtn) {
        els.disableMicBtn.style.display = state.micActive ? 'inline-flex' : 'none';
      }
      if (els.unlockAudioBtn) {
        els.unlockAudioBtn.style.display = state.autoplayBlocked ? 'inline-flex' : 'none';
      }
      return;
    }

    if (els.voiceStatusLabel) {
      if (state.hostMuted) {
        els.voiceStatusLabel.textContent = 'Voice: Muted by room host';
      } else if (!state.micActive) {
        els.voiceStatusLabel.textContent = 'Voice: Listening (microphone off)';
      } else if (state.muted) {
        els.voiceStatusLabel.textContent = 'Voice: Microphone muted';
      } else if (state.speaking) {
        els.voiceStatusLabel.textContent = 'Voice: Speaking live';
      } else {
        els.voiceStatusLabel.textContent = 'Voice: Microphone live';
      }
    }

    if (els.enableMicBtn) {
      const wrap = els.enableMicBtn.closest('.call-action-cell');
      if (wrap) {
        wrap.style.display = state.micActive ? 'none' : 'flex';
      } else {
        els.enableMicBtn.style.display = state.micActive ? 'none' : 'inline-flex';
      }
      els.enableMicBtn.disabled = state.hostMuted;
    }
    if (els.toggleMuteBtn) {
      const wrap = els.toggleMuteBtn.closest('.call-action-cell');
      if (wrap) {
        wrap.style.display = state.micActive ? 'flex' : 'none';
      } else {
        els.toggleMuteBtn.style.display = state.micActive ? 'inline-flex' : 'none';
      }
      els.toggleMuteBtn.disabled = state.hostMuted;
      if (els.toggleMuteBtn.hasAttribute('data-call-btn')) {
        els.toggleMuteBtn.classList.toggle('is-active', !state.muted && state.micActive);
        els.toggleMuteBtn.classList.toggle('is-muted', Boolean(state.muted));
        if (els.callMuteCaption) {
          els.callMuteCaption.textContent = state.muted ? 'Unmute' : 'Mute';
        }
      } else {
        els.toggleMuteBtn.textContent = state.muted ? 'Unmute Mic' : 'Mute Mic';
        els.toggleMuteBtn.className = state.muted ? 'btn-room-yellow' : 'btn-room-black';
      }
    }
    if (els.disableMicBtn) {
      const wrap = els.disableMicBtn.closest('.call-action-cell');
      if (wrap) {
        wrap.style.display = state.micActive ? 'flex' : 'none';
      } else {
        els.disableMicBtn.style.display = state.micActive ? 'inline-flex' : 'none';
      }
    }
    if (els.unlockAudioBtn) {
      const wrap = els.unlockAudioBtn.closest('.call-action-cell');
      if (wrap) {
        wrap.style.display = state.autoplayBlocked ? 'flex' : 'none';
      } else {
        els.unlockAudioBtn.style.display = state.autoplayBlocked ? 'inline-flex' : 'none';
      }
    }

    if (getPageMode() === 'random') {
      renderCallScreenPartner();
    }
  }

  function renderRoomHeader() {
    if (!state.room) return;
    const r = state.room;
    if (els.roomModeLabel) {
      if (r.mode === 'public') {
        els.roomModeLabel.textContent = 'LIVE PUBLIC ROOM · OPEN LOUNGE';
      } else if (r.mode === 'random') {
        els.roomModeLabel.textContent = 'Private 1-on-1 Call';
      } else if (r.access === 'private') {
        els.roomModeLabel.textContent = 'LIVE PRIVATE ROOM · INVITE ONLY';
      } else {
        els.roomModeLabel.textContent = 'LIVE GROUP ROOM · PUBLIC';
      }
    }
    if (els.roomTitleHeading) els.roomTitleHeading.textContent = r.name;
    if (els.roomTopicText) els.roomTopicText.textContent = r.topic;

    if (els.copyInviteBtn) {
      els.copyInviteBtn.style.display = r.mode === 'custom' ? 'inline-flex' : 'none';
    }
    if (els.findAnotherBtn) {
      els.findAnotherBtn.style.display = r.mode === 'random' ? 'inline-flex' : 'none';
    }
    if (els.endRoomBtn) {
      const showEnd = r.mode === 'custom' && r.creatorId === state.clientId;
      els.endRoomBtn.style.display = showEnd ? 'inline-flex' : 'none';
    }
    if (els.leaveRoomBtn && !els.leaveRoomBtn.hasAttribute('data-call-btn')) {
      const labelEl = els.leaveRoomBtn.querySelector('.leave-btn-label');
      const labelText = r.mode === 'random' ? 'Disconnect' : 'Leave Room';
      if (labelEl) {
        labelEl.textContent = labelText;
      } else {
        els.leaveRoomBtn.textContent = labelText;
      }
    }
    if (els.chatInput && els.chatSendBtn) {
      const disabled = Boolean(r.mode === 'random' && r.partnerDisconnected);
      els.chatInput.disabled = disabled;
      els.chatSendBtn.disabled = disabled;
      els.chatInput.placeholder = disabled
        ? 'Partner disconnected. Tap Next Match or End Call.'
        : (r.mode === 'random' ? 'Send a 1-on-1 message...' : 'Type a message...');
    }
  }

  function showRoomView() {
    if (els.lobbyView) els.lobbyView.style.display = 'none';
    if (els.roomView) els.roomView.style.display = 'block';
    document.body.classList.add('in-room-session');
    document.body.classList.toggle('in-call-session', getPageMode() === 'random');
    updateRobotsDirective();
  }

  function showLobbyView() {
    document.body.classList.remove('in-room-session');
    document.body.classList.remove('in-call-session');
    if (els.roomView) els.roomView.style.display = 'none';
    if (els.lobbyView) els.lobbyView.style.display = 'block';
    updateRobotsDirective();
    renderLobby();
  }

  function emitVoiceState() {
    if (!state.room) return;
    const effectiveMuted = Boolean(state.muted || state.hostMuted || !state.micActive);
    const effectiveSpeaking = Boolean(state.speaking && !effectiveMuted);

    const selfParticipant = state.participants.get(state.clientId);
    if (selfParticipant) {
      selfParticipant.voiceJoined = true;
      selfParticipant.micActive = state.micActive;
      selfParticipant.muted = effectiveMuted;
      selfParticipant.speaking = effectiveSpeaking;
      renderParticipants();
    }
    renderVoiceControls();

    sendWs({
      type: 'voice:state',
      voiceJoined: true,
      micActive: state.micActive,
      muted: effectiveMuted,
      speaking: effectiveSpeaking
    });
  }

  function stopVoiceMonitor() {
    if (state.analyserTimer) {
      clearInterval(state.analyserTimer);
      state.analyserTimer = null;
    }
    if (state.audioCtx) {
      state.audioCtx.close().catch(() => {});
      state.audioCtx = null;
    }
    state.speaking = false;
  }

  function startVoiceMonitor(stream) {
    stopVoiceMonitor();
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    try {
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const data = new Uint8Array(analyser.fftSize);
      state.audioCtx = ctx;

      state.analyserTimer = setInterval(() => {
        if (!state.micActive || state.muted || state.hostMuted) {
          if (state.speaking) {
            state.speaking = false;
            emitVoiceState();
          }
          return;
        }
        analyser.getByteTimeDomainData(data);
        let sumSq = 0;
        for (let i = 0; i < data.length; i++) {
          const centered = (data[i] - 128) / 128;
          sumSq += centered * centered;
        }
        const rms = Math.sqrt(sumSq / data.length);
        const now = Date.now();
        if (rms > SPEAK_THRESHOLD) {
          state.lastSpeakSignalAt = now;
          if (!state.speaking) {
            state.speaking = true;
            emitVoiceState();
          }
        } else if (state.speaking && now - state.lastSpeakSignalAt > SPEAK_HANG_MS) {
          state.speaking = false;
          emitVoiceState();
        }
      }, 100);
    } catch {
      // AudioContext unavailable
    }
  }

  function playRemoteAudio(audioEl) {
    if (!audioEl) return;
    audioEl.play().then(() => {
      state.autoplayBlocked = false;
      renderVoiceControls();
    }).catch(() => {
      state.autoplayBlocked = true;
      renderVoiceControls();
    });
  }

  function cleanupPeer(peerId) {
    const peer = state.peers.get(peerId);
    if (!peer) return;
    try {
      peer.pc.onicecandidate = null;
      peer.pc.ontrack = null;
      peer.pc.onnegotiationneeded = null;
      peer.pc.onconnectionstatechange = null;
      peer.pc.close();
    } catch {
      // ignore close errors
    }
    if (peer.audioEl && peer.audioEl.parentNode) {
      peer.audioEl.srcObject = null;
      peer.audioEl.parentNode.removeChild(peer.audioEl);
    }
    state.peers.delete(peerId);
  }

  function cleanupAllPeers() {
    for (const peerId of Array.from(state.peers.keys())) {
      cleanupPeer(peerId);
    }
    state.autoplayBlocked = false;
  }

  async function applyLocalTrackToPeers() {
    const track = state.micActive && state.localStream ? state.localStream.getAudioTracks()[0] || null : null;
    if (track) {
      track.enabled = !(state.muted || state.hostMuted);
    }

    for (const [peerId, peer] of state.peers.entries()) {
      try {
        if (peer.transceiver) {
          peer.transceiver.direction = track ? 'sendrecv' : 'recvonly';
          await peer.transceiver.sender.replaceTrack(track);
          await triggerOffer(peerId, peer);
        }
      } catch (err) {
        console.warn('Track update error for peer:', peerId, err);
      }
    }
  }

  async function triggerOffer(peerId, peer) {
    if (!peer || !peer.pc || peer.makingOffer) return;
    try {
      peer.makingOffer = true;
      const offer = await peer.pc.createOffer();
      if (peer.pc.signalingState !== 'stable') return;
      await peer.pc.setLocalDescription(offer);
      sendWs({
        type: 'rtc:offer',
        toId: peerId,
        sdp: peer.pc.localDescription
      });
    } catch (err) {
      console.warn('Offer negotiation error:', err);
    } finally {
      peer.makingOffer = false;
    }
  }

  function ensurePeerConnection(peerId) {
    if (!state.room || !peerId || peerId === state.clientId) return null;
    if (state.peers.has(peerId)) return state.peers.get(peerId);

    if (typeof RTCPeerConnection === 'undefined') {
      return null;
    }

    const pc = new RTCPeerConnection({
      iceServers: state.iceServers
    });

    const polite = String(state.clientId) < String(peerId);
    const peer = {
      id: peerId,
      pc,
      polite,
      makingOffer: false,
      ignoreOffer: false,
      isSettingRemoteAnswerPending: false,
      pendingCandidates: [],
      transceiver: null,
      audioEl: null,
      restartedIce: false
    };

    const localTrack = state.micActive && state.localStream ? state.localStream.getAudioTracks()[0] || null : null;
    peer.transceiver = pc.addTransceiver('audio', {
      direction: localTrack ? 'sendrecv' : 'recvonly'
    });
    if (localTrack) {
      localTrack.enabled = !(state.muted || state.hostMuted);
      peer.transceiver.sender.replaceTrack(localTrack).catch(() => {});
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendWs({
          type: 'rtc:ice-candidate',
          toId: peerId,
          candidate: event.candidate.toJSON ? event.candidate.toJSON() : event.candidate
        });
      }
    };

    pc.ontrack = (event) => {
      const stream = (event.streams && event.streams[0]) ? event.streams[0] : new MediaStream([event.track]);
      if (!peer.audioEl && els.audioContainer) {
        const audio = document.createElement('audio');
        audio.autoplay = true;
        audio.playsInline = true;
        audio.setAttribute('data-peer-id', peerId);
        els.audioContainer.appendChild(audio);
        peer.audioEl = audio;
      }
      if (peer.audioEl) {
        peer.audioEl.srcObject = stream;
        playRemoteAudio(peer.audioEl);
      }
    };

    pc.onnegotiationneeded = () => {
      triggerOffer(peerId, peer);
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' && !peer.restartedIce && !peer.polite) {
        peer.restartedIce = true;
        pc.restartIce();
      }
    };

    state.peers.set(peerId, peer);
    return peer;
  }

  async function handleRtcOfferOrAnswer(msg) {
    if (!state.room || msg.roomId !== state.room.id) return;
    const peer = ensurePeerConnection(msg.fromId);
    if (!peer || !msg.sdp) return;

    const pc = peer.pc;
    const description = new RTCSessionDescription(msg.sdp);

    try {
      const readyForOffer = !peer.makingOffer && (pc.signalingState === 'stable' || peer.isSettingRemoteAnswerPending);
      const offerCollision = description.type === 'offer' && !readyForOffer;

      peer.ignoreOffer = !peer.polite && offerCollision;
      if (peer.ignoreOffer) return;

      peer.isSettingRemoteAnswerPending = description.type === 'answer';
      await pc.setRemoteDescription(description);
      peer.isSettingRemoteAnswerPending = false;

      while (peer.pendingCandidates.length > 0) {
        const candidate = peer.pendingCandidates.shift();
        await pc.addIceCandidate(candidate).catch(() => {});
      }

      if (description.type === 'offer') {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendWs({
          type: 'rtc:answer',
          toId: msg.fromId,
          sdp: pc.localDescription
        });
      }
    } catch (err) {
      peer.isSettingRemoteAnswerPending = false;
      console.warn('WebRTC signaling error:', err);
    }
  }

  async function handleRtcIceCandidate(msg) {
    if (!state.room || msg.roomId !== state.room.id) return;
    const peer = state.peers.get(msg.fromId) || ensurePeerConnection(msg.fromId);
    if (!peer || !msg.candidate || !msg.candidate.candidate) return;

    try {
      const ice = new RTCIceCandidate(msg.candidate);
      if (peer.pc.remoteDescription && peer.pc.remoteDescription.type) {
        await peer.pc.addIceCandidate(ice);
      } else {
        peer.pendingCandidates.push(ice);
      }
    } catch {
      if (!peer.ignoreOffer) {
        // ignore stale candidate mismatch during renegotiation
      }
    }
  }

  async function enableMic() {
    if (!state.room) return;
    if (state.hostMuted) {
      showNotice('You are muted by the room host.', 'warn');
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showNotice('Your browser does not support microphone capture.', 'error');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      if (state.localStream) {
        state.localStream.getTracks().forEach((t) => t.stop());
      }
      state.localStream = stream;
      state.micActive = true;
      state.muted = false;
      startVoiceMonitor(stream);
      await applyLocalTrackToPeers();
      emitVoiceState();
      hideNotice();
    } catch (err) {
      showNotice('Microphone permission was denied or no microphone was detected. You can still listen and chat.', 'warn');
    }
  }

  async function disableMic() {
    stopVoiceMonitor();
    if (state.localStream) {
      state.localStream.getTracks().forEach((t) => t.stop());
      state.localStream = null;
    }
    state.micActive = false;
    state.muted = true;
    await applyLocalTrackToPeers();
    emitVoiceState();
  }

  async function toggleMute() {
    if (!state.micActive) {
      await enableMic();
      return;
    }
    if (state.hostMuted) {
      showNotice('You cannot unmute while muted by the room host.', 'warn');
      return;
    }
    state.muted = !state.muted;
    if (state.localStream) {
      state.localStream.getAudioTracks().forEach((t) => {
        t.enabled = !state.muted;
      });
    }
    if (state.muted) {
      state.speaking = false;
    }
    emitVoiceState();
  }

  function stopQueueTimer() {
    state.inRandomQueue = false;
    if (state.queueTimer) {
      clearInterval(state.queueTimer);
      state.queueTimer = null;
    }
  }

  function startQueueTimer() {
    stopQueueTimer();
    state.inRandomQueue = true;
    state.queueStartedAt = Date.now();
    const updateElapsed = () => {
      if (!els.randomWaitElapsed) return;
      const secs = Math.max(0, Math.floor((Date.now() - state.queueStartedAt) / 1000));
      els.randomWaitElapsed.textContent = 'Searching... ' + secs + 's';
    };
    updateElapsed();
    state.queueTimer = setInterval(updateElapsed, 1000);
  }

  function enterRoomSession(roomSnapshot) {
    stopQueueTimer();
    cleanupAllPeers();
    state.room = roomSnapshot;
    state.hostMuted = false;
    state.unreadMessages = 0;
    updateUnreadBadges();
    if (els.callLastMsgPreview) els.callLastMsgPreview.style.display = 'none';
    state.participants.clear();

    (roomSnapshot.participants || []).forEach((p) => {
      state.participants.set(p.id, p);
      if (p.id === state.clientId) {
        state.hostMuted = Boolean(p.hostMuted);
      }
    });

    if (els.chatMessages) {
      els.chatMessages.textContent = '';
      (roomSnapshot.messages || []).forEach((m) => appendChatMessage(m, false, false));
      els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
    }

    const basePath = getPageBasePath();
    if (roomSnapshot.mode === 'custom') {
      const cleanUrl = basePath + '?room=' + encodeURIComponent(roomSnapshot.id);
      try {
        window.history.replaceState({}, '', cleanUrl);
      } catch {
        // ignore history error
      }
    } else {
      try {
        window.history.replaceState({}, '', basePath);
      } catch {
        // ignore
      }
    }

    if (getPageMode() === 'random') {
      setCallChatOpen(false);
      startCallTimer();
    } else {
      setMobileRoomTab('chat');
    }

    showRoomView();
    renderRoomHeader();
    renderParticipants();
    renderVoiceControls();

    // Open receive/send peer connections for existing participants immediately
    for (const p of state.participants.values()) {
      if (p.id !== state.clientId) {
        ensurePeerConnection(p.id);
      }
    }
    emitVoiceState();
  }

  async function resetActiveRoomState(keepMic = false) {
    stopCallTimer();
    setCallChatOpen(false);
    cleanupAllPeers();
    if (!keepMic && state.micActive) {
      await disableMic();
    }
    state.room = null;
    state.hostMuted = false;
    state.unreadMessages = 0;
    updateUnreadBadges();
    state.participants.clear();
    const basePath = getPageBasePath();
    try {
      if (window.location.search || window.location.pathname.indexOf('/discussion/room/') === 0) {
        window.history.replaceState({}, '', basePath);
      }
    } catch {
      // ignore
    }
    showLobbyView();
  }

  function handleWsEvent(msg) {
    if (!msg || typeof msg !== 'object') return;

    switch (msg.type) {
      case 'pong':
        return;

      case 'session:init': {
        state.clientId = msg.clientId;
        if (msg.lobby) {
          state.lobby = msg.lobby;
          renderLobby();
        }
        if (state.username) {
          sendWs({ type: 'set-username', username: state.username });
        } else {
          const inviteRoom = getInviteRoomFromUrl();
          if (inviteRoom) {
            showNotice('Enter a display name above to join the invited room (' + inviteRoom + ').', 'info');
            if (els.usernameInput) els.usernameInput.focus();
          }
        }
        return;
      }

      case 'username:accepted': {
        state.username = msg.username;
        if (els.usernameInput) els.usernameInput.value = msg.username;
        try {
          sessionStorage.setItem(STORAGE_USERNAME_KEY, msg.username);
        } catch {
          // ignore storage quota errors
        }
        syncUsernameUI();
        hideNotice();

        if (typeof state.pendingAction === 'function') {
          const fn = state.pendingAction;
          state.pendingAction = null;
          fn();
        } else {
          const inviteRoom = getInviteRoomFromUrl();
          if (inviteRoom && !state.room) {
            sendWs({ type: 'room:join', roomId: inviteRoom });
          }
        }
        return;
      }

      case 'lobby:update': {
        state.lobby = {
          publicRoomCount: msg.publicRoomCount || 0,
          randomQueueCount: msg.randomQueueCount || 0,
          publicRooms: msg.publicRooms || []
        };
        if (!state.room) {
          renderLobby();
        }
        return;
      }

      case 'random:queued': {
        startQueueTimer();
        renderLobby();
        return;
      }

      case 'random:cancelled': {
        stopQueueTimer();
        renderLobby();
        return;
      }

      case 'random:matched':
      case 'room:joined': {
        hideNotice();
        if (msg.room) {
          enterRoomSession(msg.room);
        }
        return;
      }

      case 'room:left': {
        resetActiveRoomState(false);
        return;
      }

      case 'peer:joined': {
        if (!state.room || msg.roomId !== state.room.id || !msg.participant) return;
        state.participants.set(msg.participant.id, msg.participant);
        renderParticipants();
        if (msg.participant.id !== state.clientId) {
          ensurePeerConnection(msg.participant.id);
        }
        return;
      }

      case 'peer:left': {
        if (!state.room || msg.roomId !== state.room.id) return;
        state.participants.delete(msg.peerId);
        cleanupPeer(msg.peerId);
        renderParticipants();
        return;
      }

      case 'participant:updated': {
        if (!state.room || msg.roomId !== state.room.id || !msg.participant) return;
        state.participants.set(msg.participant.id, msg.participant);
        if (msg.participant.id === state.clientId) {
          state.hostMuted = Boolean(msg.participant.hostMuted);
          if (state.hostMuted) {
            state.muted = true;
            state.speaking = false;
            if (state.localStream) {
              state.localStream.getAudioTracks().forEach((t) => { t.enabled = false; });
            }
          }
          renderVoiceControls();
        }
        renderParticipants();
        return;
      }

      case 'room:host-changed': {
        if (!state.room || msg.roomId !== state.room.id) return;
        state.room.creatorId = msg.creatorId;
        state.room.isCreator = msg.creatorId === state.clientId;
        renderRoomHeader();
        renderParticipants();
        return;
      }

      case 'random:partner-left': {
        if (!state.room || msg.roomId !== state.room.id) return;
        state.room.partnerDisconnected = true;
        stopCallTimer();
        cleanupAllPeers();
        renderRoomHeader();
        renderParticipants();
        showNotice('Your Random Connect partner ended the session. Tap Next Match or End Call.', 'warn');
        return;
      }

      case 'room:chat': {
        if (!state.room || msg.roomId !== state.room.id || !msg.message) return;
        appendChatMessage(msg.message, true, true);
        return;
      }

      case 'moderation:muted': {
        if (!state.room || msg.roomId !== state.room.id) return;
        state.hostMuted = Boolean(msg.muted);
        if (state.hostMuted) {
          state.muted = true;
          state.speaking = false;
          if (state.localStream) {
            state.localStream.getAudioTracks().forEach((t) => { t.enabled = false; });
          }
          showNotice('You were muted by room host ' + (msg.by || '') + '.', 'warn');
        } else {
          showNotice('Room host ' + (msg.by || '') + ' allowed you to unmute your microphone.', 'info');
        }
        renderVoiceControls();
        return;
      }

      case 'moderation:kicked': {
        resetActiveRoomState(false);
        showNotice('You were removed from "' + (msg.roomName || 'the room') + '" by the host.', 'error');
        return;
      }

      case 'room:closed': {
        resetActiveRoomState(false);
        showNotice('Room "' + (msg.roomName || 'Session') + '" was closed by the host.', 'info');
        return;
      }

      case 'rtc:offer':
      case 'rtc:answer': {
        handleRtcOfferOrAnswer(msg);
        return;
      }

      case 'rtc:ice-candidate': {
        handleRtcIceCandidate(msg);
        return;
      }

      case 'error': {
        showNotice(msg.message || 'Action could not be completed.', 'error');
        return;
      }
    }
  }

  function connectWebSocket() {
    if (state.ws && (state.ws.readyState === WebSocket.OPEN || state.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const targetUrl = state.wsUrl || (wsProtocol + window.location.host + '/ws/discussion');

    try {
      const ws = new WebSocket(targetUrl);
      state.ws = ws;

      ws.addEventListener('open', () => {
        state.connected = true;
        state.reconnectDelay = 1000;
        updateConnectionUI();
        if (state.heartbeatTimer) clearInterval(state.heartbeatTimer);
        state.heartbeatTimer = setInterval(() => {
          sendWs({ type: 'ping' });
        }, 20000);
      });

      ws.addEventListener('message', (event) => {
        try {
          const parsed = JSON.parse(event.data);
          handleWsEvent(parsed);
        } catch {
          // ignore malformed messages
        }
      });

      ws.addEventListener('close', () => {
        state.connected = false;
        if (state.heartbeatTimer) {
          clearInterval(state.heartbeatTimer);
          state.heartbeatTimer = null;
        }
        stopQueueTimer();
        if (state.room) {
          resetActiveRoomState(false);
          showNotice('Connection to live server was interrupted. Reconnecting...', 'warn');
        }
        updateConnectionUI();

        if (!state.reconnectTimer) {
          state.reconnectTimer = setTimeout(() => {
            state.reconnectTimer = null;
            state.reconnectDelay = Math.min(state.reconnectDelay * 1.5, RECONNECT_MAX_MS);
            connectWebSocket();
          }, state.reconnectDelay);
        }
      });
    } catch {
      updateConnectionUI();
    }
  }

  async function init() {
    const pageMode = getPageMode();
    const initialInviteRoom = getInviteRoomFromUrl();
    if (pageMode === 'hub' && initialInviteRoom) {
      window.location.replace('/discussion/rooms/?room=' + encodeURIComponent(initialInviteRoom));
      return;
    }

    updateRobotsDirective();

    try {
      const savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
      applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
    } catch {
      applyTheme('light');
    }

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });

    try {
      const savedName = sessionStorage.getItem(STORAGE_USERNAME_KEY);
      if (savedName && savedName.trim().length >= 2) {
        state.username = savedName.trim();
        if (els.usernameInput) els.usernameInput.value = state.username;
      }
    } catch {
      // ignore sessionStorage error
    }
    syncUsernameUI();

    document.querySelectorAll('.disc-persist-nav').forEach((link) => {
      link.addEventListener('click', () => {
        const typed = String(els.usernameInput ? els.usernameInput.value : '').trim();
        if (typed.length >= 2 && typed.length <= 24) {
          try {
            sessionStorage.setItem(STORAGE_USERNAME_KEY, typed);
          } catch {
            // ignore storage error
          }
        }
      });
    });

    try {
      const res = await fetch('/api/discussion/ice-config', { cache: 'no-store' });
      if (res.ok) {
        const cfg = await res.json();
        if (Array.isArray(cfg.iceServers) && cfg.iceServers.length > 0) {
          state.iceServers = cfg.iceServers;
        }
        state.turnConfigured = Boolean(cfg.turnConfigured);
        if (cfg.wsUrl) {
          state.wsUrl = cfg.wsUrl;
        }
      }
    } catch {
      // keep default STUN servers
    }

    updateConnectionUI();
    renderLobby();
    connectWebSocket();

    if (els.noticeDismiss) {
      els.noticeDismiss.addEventListener('click', hideNotice);
    }

    if (els.usernameInput && getPageMode() === 'random') {
      els.usernameInput.addEventListener('input', syncRandomNameButtonLabel);
    }

    if (els.usernameForm) {
      els.usernameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (getPageMode() === 'public' && els.joinPublicBtn) {
          els.joinPublicBtn.click();
          return;
        }
        const val = String(els.usernameInput.value || '').trim();
        if (getPageMode() === 'random' && state.username && val === state.username) {
          els.usernameInput.focus();
          els.usernameInput.select();
          const labelEl = els.usernameSaveBtn ? els.usernameSaveBtn.querySelector('.name-btn-label') : null;
          if (labelEl) labelEl.textContent = 'Save';
          return;
        }
        if (val.length < 2) {
          showNotice('Display name must be at least 2 characters.', 'warn');
          els.usernameInput.focus();
          return;
        }
        if (!sendWs({ type: 'set-username', username: val })) {
          showNotice('Connecting to live server, please try again in a moment.', 'warn');
        }
      });
    }

    if (els.joinPublicBtn) {
      els.joinPublicBtn.addEventListener('click', () => {
        hideNotice();
        if (!state.connected) {
          showNotice('Connecting to live server, please try again in a moment.', 'warn');
          return;
        }
        const action = () => sendWs({ type: 'room:join', roomId: 'public-lounge' });
        if (ensureUsername(action)) action();
      });
    }

    if (els.findSomeoneBtn) {
      els.findSomeoneBtn.addEventListener('click', () => {
        hideNotice();
        const action = () => sendWs({ type: 'random:join' });
        if (ensureUsername(action)) action();
      });
    }

    if (els.cancelRandomBtn) {
      els.cancelRandomBtn.addEventListener('click', () => {
        sendWs({ type: 'random:cancel' });
        stopQueueTimer();
        renderLobby();
      });
    }

    const accessButtons = document.querySelectorAll('[data-room-access]');
    if (accessButtons.length && els.roomAccessSelect) {
      accessButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const chosen = btn.getAttribute('data-room-access') === 'private' ? 'private' : 'public';
          els.roomAccessSelect.value = chosen;
          accessButtons.forEach((other) => {
            const isMatch = other === btn;
            other.classList.toggle('active', isMatch);
            other.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
          });
        });
      });
    }

    document.querySelectorAll('[data-focus-create-room]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (els.roomNameInput) {
          els.roomNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          els.roomNameInput.focus();
        }
      });
    });

    if (els.createRoomForm) {
      els.createRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideNotice();
        const name = String(els.roomNameInput.value || '').trim();
        const topic = String(els.roomTopicInput.value || '').trim();
        const access = els.roomAccessSelect.value === 'private' ? 'private' : 'public';

        if (name.length < 3) {
          showNotice('Room name must be at least 3 characters.', 'warn');
          els.roomNameInput.focus();
          return;
        }

        const action = () => sendWs({ type: 'room:create', name, topic, access });
        if (ensureUsername(action)) action();
      });
    }

    if (els.privateJoinForm) {
      els.privateJoinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideNotice();
        const roomId = normalizeRoomCodeInput(els.privateRoomCodeInput.value);
        if (!roomId || !/^[a-zA-Z0-9_-]{4,48}$/.test(roomId)) {
          showNotice('Enter a valid room code or invite link.', 'warn');
          els.privateRoomCodeInput.focus();
          return;
        }
        if (getPageMode() === 'hub') {
          const typed = String(els.usernameInput ? els.usernameInput.value : '').trim();
          if (typed.length >= 2 && typed.length <= 24) {
            try {
              sessionStorage.setItem(STORAGE_USERNAME_KEY, typed);
            } catch {
              // ignore storage error
            }
          }
          window.location.href = '/discussion/rooms/?room=' + encodeURIComponent(roomId);
          return;
        }
        const action = () => sendWs({ type: 'room:join', roomId });
        if (ensureUsername(action)) action();
      });
    }

    if (els.copyInviteBtn) {
      els.copyInviteBtn.addEventListener('click', async () => {
        if (!state.room) return;
        const shareUrl = window.location.origin + '/discussion/rooms/?room=' + encodeURIComponent(state.room.id);
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(shareUrl);
            const orig = els.copyInviteBtn.textContent;
            els.copyInviteBtn.textContent = 'Invite Link Copied';
            setTimeout(() => {
              els.copyInviteBtn.textContent = orig;
            }, 2200);
          } else {
            showNotice('Share this invite link: ' + shareUrl, 'info');
          }
        } catch {
          showNotice('Share this invite link: ' + shareUrl, 'info');
        }
      });
    }

    if (els.findAnotherBtn) {
      els.findAnotherBtn.addEventListener('click', async () => {
        hideNotice();
        stopCallTimer();
        setCallChatOpen(false);
        cleanupAllPeers();
        state.room = null;
        showLobbyView();
        sendWs({ type: 'random:next' });
      });
    }

    if (els.toggleCallChatBtn) {
      els.toggleCallChatBtn.addEventListener('click', () => {
        setCallChatOpen(!state.callChatOpen);
      });
    }
    if (els.closeCallChatBtn) {
      els.closeCallChatBtn.addEventListener('click', () => {
        setCallChatOpen(false);
      });
    }
    if (els.callLastMsgPreview) {
      els.callLastMsgPreview.addEventListener('click', () => {
        setCallChatOpen(true);
      });
    }

    if (els.roomTabStageBtn) {
      els.roomTabStageBtn.addEventListener('click', () => setMobileRoomTab('stage'));
    }
    if (els.roomTabChatBtn) {
      els.roomTabChatBtn.addEventListener('click', () => setMobileRoomTab('chat'));
    }

    if (els.endRoomBtn) {
      els.endRoomBtn.addEventListener('click', () => {
        sendWs({ type: 'host:close' });
      });
    }

    if (els.leaveRoomBtn) {
      els.leaveRoomBtn.addEventListener('click', async () => {
        hideNotice();
        sendWs({ type: 'room:leave' });
        await resetActiveRoomState(false);
      });
    }

    if (els.voicePrimaryBtn) {
      els.voicePrimaryBtn.addEventListener('click', toggleMute);
    }
    if (els.enableMicBtn) {
      els.enableMicBtn.addEventListener('click', enableMic);
    }
    if (els.toggleMuteBtn) {
      els.toggleMuteBtn.addEventListener('click', toggleMute);
    }
    if (els.disableMicBtn) {
      els.disableMicBtn.addEventListener('click', disableMic);
    }
    if (els.unlockAudioBtn) {
      els.unlockAudioBtn.addEventListener('click', () => {
        state.autoplayBlocked = false;
        for (const peer of state.peers.values()) {
          if (peer.audioEl) {
            playRemoteAudio(peer.audioEl);
          }
        }
        renderVoiceControls();
      });
    }

    if (els.chatAttachBtn && els.chatFileInput) {
      els.chatAttachBtn.addEventListener('click', () => {
        els.chatFileInput.click();
      });
      els.chatFileInput.addEventListener('change', () => {
        const file = els.chatFileInput.files && els.chatFileInput.files[0];
        if (!file || !els.chatInput) return;
        const kb = Math.max(1, Math.round(file.size / 1024));
        const tag = '[File: ' + file.name + ' (' + kb + ' KB)] ';
        const nextVal = (tag + els.chatInput.value).slice(0, 500);
        els.chatInput.value = nextVal;
        if (els.chatCharCount) {
          els.chatCharCount.textContent = String(nextVal.length) + ' / 500';
        }
        els.chatFileInput.value = '';
        els.chatInput.focus();
      });
    }

    if (els.chatInput && els.chatCharCount) {
      els.chatInput.addEventListener('input', () => {
        els.chatCharCount.textContent = String(els.chatInput.value.length) + ' / 500';
      });
    }

    if (els.chatForm) {
      els.chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = String(els.chatInput.value || '').trim();
        if (!text) return;
        if (sendWs({ type: 'chat:send', text })) {
          els.chatInput.value = '';
          if (els.chatCharCount) els.chatCharCount.textContent = '0 / 500';
        }
      });
    }

    window.addEventListener('beforeunload', () => {
      try {
        if (state.localStream) {
          state.localStream.getTracks().forEach((t) => t.stop());
        }
        if (state.ws && state.ws.readyState === WebSocket.OPEN) {
          state.ws.close(1000, 'Page unload');
        }
      } catch {
        // ignore unload errors
      }
    });
  }

  init();
})();
