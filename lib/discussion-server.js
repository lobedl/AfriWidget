import crypto from 'crypto';
import { WebSocketServer, WebSocket } from 'ws';

const PUBLIC_ROOM_ID = 'public-lounge';
const MAX_ROOM_PARTICIPANTS = 30;
const MAX_CHAT_HISTORY = 80;
const MAX_MESSAGE_LENGTH = 500;
const MAX_USERNAME_LENGTH = 24;
const MIN_USERNAME_LENGTH = 2;
const MAX_ROOM_NAME_LENGTH = 48;
const MIN_ROOM_NAME_LENGTH = 3;
const MAX_TOPIC_LENGTH = 100;
const MAX_CONNECTIONS = 500;
const MAX_CONNECTIONS_PER_IP = 15;
const HEARTBEAT_INTERVAL_MS = 25000;

const DEFAULT_STUN_URLS = [
  'stun:stun.l.google.com:19302',
  'stun:stun1.l.google.com:19302'
];

function stripControlChars(value) {
  return String(value ?? '').replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
}

function sanitizeUsername(raw) {
  const cleaned = stripControlChars(raw).replace(/\s+/g, ' ').trim();
  if (cleaned.length < MIN_USERNAME_LENGTH || cleaned.length > MAX_USERNAME_LENGTH) {
    return null;
  }
  if (!/^[a-zA-Z0-9][a-zA-Z0-9 _.-]*$/.test(cleaned)) {
    return null;
  }
  const lower = cleaned.toLowerCase();
  if (lower === 'system' || lower === 'moderator' || lower === 'admin' || lower === 'afriwidget') {
    return null;
  }
  return cleaned;
}

function sanitizeRoomName(raw) {
  const cleaned = stripControlChars(raw).replace(/\s+/g, ' ').trim();
  if (cleaned.length < MIN_ROOM_NAME_LENGTH || cleaned.length > MAX_ROOM_NAME_LENGTH) {
    return null;
  }
  return cleaned;
}

function sanitizeTopic(raw) {
  const cleaned = stripControlChars(raw).replace(/\s+/g, ' ').trim();
  if (!cleaned) return 'Open discussion';
  return cleaned.slice(0, MAX_TOPIC_LENGTH);
}

function sanitizeMessage(raw) {
  const cleaned = stripControlChars(raw).replace(/\r\n?/g, '\n').trim();
  if (!cleaned || cleaned.length > MAX_MESSAGE_LENGTH) {
    return null;
  }
  return cleaned;
}

function sanitizeRoomId(raw) {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!/^[a-zA-Z0-9_-]{4,48}$/.test(trimmed)) return null;
  return trimmed;
}

export function getIceConfig() {
  const iceServers = [];

  const stunEnv = (process.env.STUN_URLS || '').trim();
  const stunUrls = stunEnv
    ? stunEnv.split(',').map((u) => u.trim()).filter((u) => /^stuns?:[^\s]+$/i.test(u))
    : DEFAULT_STUN_URLS;

  if (stunUrls.length > 0) {
    iceServers.push({ urls: stunUrls });
  }

  const turnEnv = (process.env.TURN_URLS || '').trim();
  const turnUrls = turnEnv
    ? turnEnv.split(',').map((u) => u.trim()).filter((u) => /^turns?:[^\s]+$/i.test(u))
    : [];

  let turnConfigured = false;
  if (turnUrls.length > 0) {
    const turnEntry = { urls: turnUrls };
    const turnUser = (process.env.TURN_USERNAME || '').trim();
    const turnCred = (process.env.TURN_CREDENTIAL || '').trim();
    if (turnUser && turnCred) {
      turnEntry.username = turnUser;
      turnEntry.credential = turnCred;
    }
    iceServers.push(turnEntry);
    turnConfigured = true;
  }

  const wsOverride = (process.env.DISCUSSION_WS_URL || '').trim();
  return {
    iceServers,
    turnConfigured,
    wsUrl: /^wss?:\/\/[^\s]+$/i.test(wsOverride) ? wsOverride : null
  };
}

function getClientIp(req) {
  const cf = req.headers['cf-connecting-ip'];
  if (typeof cf === 'string' && cf.trim()) return cf.trim();
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.trim()) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function checkSlidingRateLimit(timestamps, limit, windowMs, now = Date.now()) {
  while (timestamps.length > 0 && now - timestamps[0] > windowMs) {
    timestamps.shift();
  }
  if (timestamps.length >= limit) {
    return false;
  }
  timestamps.push(now);
  return true;
}

export function attachDiscussionServer(httpServer) {
  const wss = new WebSocketServer({
    server: httpServer,
    path: '/ws/discussion',
    maxPayload: 16 * 1024
  });

  const clients = new Map();
  const ipConnectionCounts = new Map();
  const rooms = new Map();
  const randomQueue = [];

  // Permanent public room — always stays open even when empty
  rooms.set(PUBLIC_ROOM_ID, {
    id: PUBLIC_ROOM_ID,
    name: 'Public Lounge',
    topic: 'Open community voice and text discussion',
    mode: 'public',
    access: 'public',
    permanent: true,
    creatorId: null,
    createdAt: Date.now(),
    participants: new Map(),
    messages: [],
    kickedIds: new Set()
  });

  function send(ws, payload) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }

  function sendError(client, message, code = 'BAD_REQUEST') {
    send(client.ws, {
      type: 'error',
      code,
      message
    });
  }

  function serializeParticipant(p) {
    return {
      id: p.id,
      username: p.username,
      muted: Boolean(p.muted || p.hostMuted),
      hostMuted: Boolean(p.hostMuted),
      speaking: Boolean(p.speaking && !p.muted && !p.hostMuted),
      voiceJoined: Boolean(p.voiceJoined),
      micActive: Boolean(p.micActive),
      joinedAt: p.joinedAt
    };
  }

  function serializeRoomSnapshot(room, viewerId) {
    return {
      id: room.id,
      name: room.name,
      topic: room.topic,
      mode: room.mode,
      access: room.access,
      permanent: Boolean(room.permanent),
      creatorId: room.creatorId,
      isCreator: Boolean(room.creatorId && room.creatorId === viewerId),
      participantCount: room.participants.size,
      participants: Array.from(room.participants.values()).map(serializeParticipant),
      messages: room.messages.slice(-MAX_CHAT_HISTORY),
      partnerDisconnected: Boolean(room.partnerDisconnected)
    };
  }

  function getLobbyState() {
    const publicRoom = rooms.get(PUBLIC_ROOM_ID);
    const customPublicRooms = [];

    for (const room of rooms.values()) {
      if (room.mode === 'custom' && room.access === 'public' && room.participants.size > 0) {
        const creator = room.creatorId ? room.participants.get(room.creatorId) : null;
        customPublicRooms.push({
          id: room.id,
          name: room.name,
          topic: room.topic,
          hostName: creator ? creator.username : 'Member',
          participantCount: room.participants.size,
          createdAt: room.createdAt
        });
      }
    }

    customPublicRooms.sort((a, b) => b.participantCount - a.participantCount || b.createdAt - a.createdAt);

    return {
      type: 'lobby:update',
      publicRoomCount: publicRoom ? publicRoom.participants.size : 0,
      randomQueueCount: randomQueue.length,
      publicRooms: customPublicRooms
    };
  }

  function broadcastLobbyUpdate() {
    const payload = JSON.stringify(getLobbyState());
    for (const client of clients.values()) {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(payload);
      }
    }
  }

  function broadcastToRoom(room, payload, excludeClientId = null) {
    const serialized = JSON.stringify(payload);
    for (const participant of room.participants.values()) {
      if (excludeClientId && participant.id === excludeClientId) continue;
      const targetClient = clients.get(participant.id);
      if (targetClient && targetClient.ws.readyState === WebSocket.OPEN) {
        targetClient.ws.send(serialized);
      }
    }
  }

  function pushSystemMessage(room, text) {
    const msg = {
      id: `sys-${crypto.randomBytes(6).toString('hex')}`,
      system: true,
      username: 'System',
      text,
      timestamp: new Date().toISOString()
    };
    room.messages.push(msg);
    if (room.messages.length > MAX_CHAT_HISTORY) {
      room.messages.splice(0, room.messages.length - MAX_CHAT_HISTORY);
    }
    broadcastToRoom(room, {
      type: 'room:chat',
      roomId: room.id,
      message: msg
    });
  }

  function removeFromRandomQueue(clientId, notify = false) {
    const idx = randomQueue.indexOf(clientId);
    if (idx === -1) return false;
    randomQueue.splice(idx, 1);
    const client = clients.get(clientId);
    if (client) {
      client.inRandomQueue = false;
      if (notify) {
        send(client.ws, { type: 'random:cancelled' });
      }
    }
    return true;
  }

  function leaveCurrentRoom(client, reason = 'left') {
    if (!client.roomId) return false;
    const room = rooms.get(client.roomId);
    client.roomId = null;
    if (!room) return false;

    const participant = room.participants.get(client.id);
    if (!participant) return false;

    room.participants.delete(client.id);

    broadcastToRoom(room, {
      type: 'peer:left',
      roomId: room.id,
      peerId: client.id,
      participantCount: room.participants.size,
      reason
    });

    if (room.mode === 'random' && room.participants.size > 0) {
      room.partnerDisconnected = true;
      pushSystemMessage(room, `${participant.username} ended the session. Click Find Another to match with someone new, or Leave.`);
      broadcastToRoom(room, {
        type: 'random:partner-left',
        roomId: room.id,
        peerId: client.id,
        reason
      });
    } else if (room.participants.size > 0) {
      if (reason === 'kicked') {
        pushSystemMessage(room, `${participant.username} was removed by the room host.`);
      } else {
        pushSystemMessage(room, `${participant.username} left the room.`);
      }
    }

    // If custom room creator leaves while others remain, promote longest-standing member
    if (room.mode === 'custom' && room.creatorId === client.id && room.participants.size > 0) {
      const nextHost = room.participants.values().next().value;
      if (nextHost) {
        room.creatorId = nextHost.id;
        broadcastToRoom(room, {
          type: 'room:host-changed',
          roomId: room.id,
          creatorId: nextHost.id,
          creatorName: nextHost.username
        });
        pushSystemMessage(room, `${nextHost.username} is now the room host.`);
      }
    }

    // Auto-close temporary rooms when empty
    if (!room.permanent && room.participants.size === 0) {
      rooms.delete(room.id);
    }

    broadcastLobbyUpdate();
    return true;
  }

  function joinRoom(client, room) {
    if (!client.username) {
      sendError(client, 'Enter a username before joining a room.', 'USERNAME_REQUIRED');
      return false;
    }
    if (room.kickedIds.has(client.id)) {
      sendError(client, 'You were removed from this room by the host.', 'ROOM_BANNED');
      return false;
    }
    if (room.participants.size >= MAX_ROOM_PARTICIPANTS) {
      sendError(client, 'This room is currently full.', 'ROOM_FULL');
      return false;
    }

    // Leave any active room or queue cleanly first
    if (removeFromRandomQueue(client.id, false)) {
      // cleaned queue entry
    }
    if (client.roomId && client.roomId !== room.id) {
      leaveCurrentRoom(client, 'switched');
    }

    if (room.participants.has(client.id)) {
      send(client.ws, {
        type: 'room:joined',
        room: serializeRoomSnapshot(room, client.id)
      });
      return true;
    }

    const participant = {
      id: client.id,
      username: client.username,
      muted: true,
      hostMuted: false,
      speaking: false,
      voiceJoined: false,
      micActive: false,
      joinedAt: Date.now()
    };

    room.participants.set(client.id, participant);
    client.roomId = room.id;

    send(client.ws, {
      type: 'room:joined',
      room: serializeRoomSnapshot(room, client.id)
    });

    broadcastToRoom(room, {
      type: 'peer:joined',
      roomId: room.id,
      participant: serializeParticipant(participant),
      participantCount: room.participants.size
    }, client.id);

    if (room.mode !== 'random') {
      pushSystemMessage(room, `${client.username} joined the room.`);
    }

    broadcastLobbyUpdate();
    return true;
  }

  function tryMatchRandomPair() {
    // Prune closed or invalid entries from queue
    for (let i = randomQueue.length - 1; i >= 0; i--) {
      const id = randomQueue[i];
      const c = clients.get(id);
      if (!c || c.ws.readyState !== WebSocket.OPEN || !c.username || c.roomId) {
        randomQueue.splice(i, 1);
        if (c) c.inRandomQueue = false;
      }
    }

    while (randomQueue.length >= 2) {
      const idA = randomQueue.shift();
      const idB = randomQueue.shift();
      if (!idA || !idB || idA === idB) continue;

      const clientA = clients.get(idA);
      const clientB = clients.get(idB);
      if (!clientA || !clientB) {
        if (clientA && clientA.ws.readyState === WebSocket.OPEN) randomQueue.unshift(idA);
        if (clientB && clientB.ws.readyState === WebSocket.OPEN) randomQueue.unshift(idB);
        continue;
      }

      clientA.inRandomQueue = false;
      clientB.inRandomQueue = false;

      const roomId = `rc-${crypto.randomBytes(6).toString('hex')}`;
      const room = {
        id: roomId,
        name: 'Random Connect Session',
        topic: 'Private 1-on-1 voice and text conversation',
        mode: 'random',
        access: 'private',
        permanent: false,
        creatorId: null,
        createdAt: Date.now(),
        partnerDisconnected: false,
        participants: new Map(),
        messages: [],
        kickedIds: new Set()
      };
      rooms.set(roomId, room);

      const pA = {
        id: clientA.id,
        username: clientA.username,
        muted: true,
        hostMuted: false,
        speaking: false,
        voiceJoined: false,
        micActive: false,
        joinedAt: Date.now()
      };
      const pB = {
        id: clientB.id,
        username: clientB.username,
        muted: true,
        hostMuted: false,
        speaking: false,
        voiceJoined: false,
        micActive: false,
        joinedAt: Date.now()
      };

      room.participants.set(clientA.id, pA);
      room.participants.set(clientB.id, pB);
      clientA.roomId = roomId;
      clientB.roomId = roomId;

      const startMsg = {
        id: `sys-${crypto.randomBytes(6).toString('hex')}`,
        system: true,
        username: 'System',
        text: `Connected with a random partner (${clientA.username} and ${clientB.username}). Messages and audio stay private to this session.`,
        timestamp: new Date().toISOString()
      };
      room.messages.push(startMsg);

      send(clientA.ws, {
        type: 'random:matched',
        room: serializeRoomSnapshot(room, clientA.id)
      });
      send(clientB.ws, {
        type: 'random:matched',
        room: serializeRoomSnapshot(room, clientB.id)
      });
    }

    broadcastLobbyUpdate();
  }

  function handleRandomJoin(client) {
    if (!client.username) {
      sendError(client, 'Enter a username before starting Random Connect.', 'USERNAME_REQUIRED');
      return;
    }

    if (client.roomId) {
      leaveCurrentRoom(client, 'requeued');
    }

    if (!randomQueue.includes(client.id)) {
      randomQueue.push(client.id);
    }
    client.inRandomQueue = true;

    send(client.ws, {
      type: 'random:queued',
      queueCount: randomQueue.length
    });

    tryMatchRandomPair();
  }

  function handleMessage(client, rawData) {
    let msg;
    try {
      const str = typeof rawData === 'string' ? rawData : rawData.toString('utf8');
      msg = JSON.parse(str);
    } catch {
      sendError(client, 'Invalid message format.');
      return;
    }

    if (!msg || typeof msg !== 'object' || Array.isArray(msg) || typeof msg.type !== 'string') {
      sendError(client, 'Invalid event payload.');
      return;
    }

    switch (msg.type) {
      case 'ping': {
        send(client.ws, { type: 'pong', ts: Date.now() });
        return;
      }

      case 'set-username': {
        const username = sanitizeUsername(msg.username);
        if (!username) {
          sendError(client, 'Username must be 2 to 24 characters using letters, numbers, spaces, dots, hyphens, or underscores.');
          return;
        }
        const previous = client.username;
        client.username = username;

        if (client.roomId) {
          const room = rooms.get(client.roomId);
          if (room && room.participants.has(client.id)) {
            const p = room.participants.get(client.id);
            p.username = username;
            broadcastToRoom(room, {
              type: 'participant:updated',
              roomId: room.id,
              participant: serializeParticipant(p)
            });
            if (previous && previous !== username) {
              pushSystemMessage(room, `${previous} changed their display name to ${username}.`);
            }
          }
        }

        send(client.ws, {
          type: 'username:accepted',
          clientId: client.id,
          username
        });
        broadcastLobbyUpdate();
        return;
      }

      case 'room:join': {
        const roomId = sanitizeRoomId(msg.roomId);
        if (!roomId) {
          sendError(client, 'Invalid room code.');
          return;
        }
        const room = rooms.get(roomId);
        if (!room) {
          sendError(client, 'That room does not exist or has already closed.', 'ROOM_NOT_FOUND');
          return;
        }
        if (room.mode === 'random') {
          sendError(client, 'Random Connect sessions cannot be joined directly.', 'FORBIDDEN');
          return;
        }
        joinRoom(client, room);
        return;
      }

      case 'room:leave': {
        removeFromRandomQueue(client.id, false);
        const left = leaveCurrentRoom(client, 'left');
        send(client.ws, { type: 'room:left', left });
        broadcastLobbyUpdate();
        return;
      }

      case 'room:create': {
        if (!client.username) {
          sendError(client, 'Enter a username before creating a room.', 'USERNAME_REQUIRED');
          return;
        }
        if (!checkSlidingRateLimit(client.createRoomTimestamps, 5, 60000)) {
          sendError(client, 'You are creating rooms too quickly. Wait a minute and try again.', 'RATE_LIMIT');
          return;
        }

        const name = sanitizeRoomName(msg.name);
        if (!name) {
          sendError(client, 'Room name must be between 3 and 48 characters.');
          return;
        }

        const access = msg.access === 'private' ? 'private' : msg.access === 'public' ? 'public' : null;
        if (!access) {
          sendError(client, 'Room access must be public or private.');
          return;
        }

        const topic = sanitizeTopic(msg.topic);
        const prefix = access === 'private' ? 'priv' : 'room';
        const roomId = `${prefix}-${crypto.randomBytes(access === 'private' ? 6 : 4).toString('hex')}`;

        const room = {
          id: roomId,
          name,
          topic,
          mode: 'custom',
          access,
          permanent: false,
          creatorId: client.id,
          createdAt: Date.now(),
          partnerDisconnected: false,
          participants: new Map(),
          messages: [],
          kickedIds: new Set()
        };
        rooms.set(roomId, room);
        joinRoom(client, room);
        return;
      }

      case 'random:join': {
        handleRandomJoin(client);
        return;
      }

      case 'random:cancel': {
        removeFromRandomQueue(client.id, true);
        broadcastLobbyUpdate();
        return;
      }

      case 'random:next': {
        handleRandomJoin(client);
        return;
      }

      case 'chat:send': {
        if (!client.roomId) {
          sendError(client, 'Join a room before sending messages.');
          return;
        }
        const room = rooms.get(client.roomId);
        if (!room || !room.participants.has(client.id)) {
          sendError(client, 'You are no longer in this room.');
          return;
        }
        if (room.mode === 'random' && room.partnerDisconnected) {
          sendError(client, 'Your partner disconnected. Click Find Another to match again.');
          return;
        }
        if (!checkSlidingRateLimit(client.chatTimestamps, 6, 5000)) {
          sendError(client, 'Sending too fast. Please pause briefly before sending another message.', 'RATE_LIMIT');
          return;
        }
        const text = sanitizeMessage(msg.text);
        if (!text) {
          sendError(client, 'Message must be 1 to 500 characters.');
          return;
        }

        const chatMsg = {
          id: `msg-${crypto.randomBytes(6).toString('hex')}`,
          system: false,
          senderId: client.id,
          username: client.username,
          text,
          timestamp: new Date().toISOString()
        };

        room.messages.push(chatMsg);
        if (room.messages.length > MAX_CHAT_HISTORY) {
          room.messages.splice(0, room.messages.length - MAX_CHAT_HISTORY);
        }

        broadcastToRoom(room, {
          type: 'room:chat',
          roomId: room.id,
          message: chatMsg
        });
        return;
      }

      case 'voice:state': {
        if (!client.roomId) return;
        const room = rooms.get(client.roomId);
        if (!room) return;
        const participant = room.participants.get(client.id);
        if (!participant) return;

        if (typeof msg.voiceJoined === 'boolean') {
          participant.voiceJoined = msg.voiceJoined;
        }
        if (typeof msg.micActive === 'boolean') {
          participant.micActive = msg.micActive;
        }
        if (typeof msg.muted === 'boolean') {
          participant.muted = participant.hostMuted ? true : msg.muted;
        }
        if (typeof msg.speaking === 'boolean') {
          participant.speaking = (!participant.muted && !participant.hostMuted && participant.micActive) ? msg.speaking : false;
        }

        broadcastToRoom(room, {
          type: 'participant:updated',
          roomId: room.id,
          participant: serializeParticipant(participant)
        });
        return;
      }

      case 'host:mute': {
        if (!client.roomId) return;
        const room = rooms.get(client.roomId);
        if (!room || room.mode !== 'custom' || room.creatorId !== client.id) {
          sendError(client, 'Only the room creator can mute participants.', 'FORBIDDEN');
          return;
        }
        const targetId = typeof msg.targetId === 'string' ? msg.targetId : '';
        if (!targetId || targetId === client.id) return;
        const targetParticipant = room.participants.get(targetId);
        const targetClient = clients.get(targetId);
        if (!targetParticipant || !targetClient) return;

        const shouldMute = msg.muted !== false;
        targetParticipant.hostMuted = shouldMute;
        if (shouldMute) {
          targetParticipant.muted = true;
          targetParticipant.speaking = false;
        }

        send(targetClient.ws, {
          type: 'moderation:muted',
          roomId: room.id,
          muted: shouldMute,
          by: client.username
        });

        broadcastToRoom(room, {
          type: 'participant:updated',
          roomId: room.id,
          participant: serializeParticipant(targetParticipant)
        });

        pushSystemMessage(
          room,
          shouldMute
            ? `${targetParticipant.username} was muted by host ${client.username}.`
            : `${targetParticipant.username} was allowed to unmute by host ${client.username}.`
        );
        return;
      }

      case 'host:kick': {
        if (!client.roomId) return;
        const room = rooms.get(client.roomId);
        if (!room || room.mode !== 'custom' || room.creatorId !== client.id) {
          sendError(client, 'Only the room creator can remove participants.', 'FORBIDDEN');
          return;
        }
        const targetId = typeof msg.targetId === 'string' ? msg.targetId : '';
        if (!targetId || targetId === client.id) return;
        const targetParticipant = room.participants.get(targetId);
        const targetClient = clients.get(targetId);
        if (!targetParticipant || !targetClient) return;

        room.kickedIds.add(targetId);
        leaveCurrentRoom(targetClient, 'kicked');

        send(targetClient.ws, {
          type: 'moderation:kicked',
          roomId: room.id,
          roomName: room.name,
          by: client.username
        });
        return;
      }

      case 'host:close': {
        if (!client.roomId) return;
        const room = rooms.get(client.roomId);
        if (!room || room.mode !== 'custom' || room.creatorId !== client.id) {
          sendError(client, 'Only the room creator can close this room.', 'FORBIDDEN');
          return;
        }
        const memberIds = Array.from(room.participants.keys());
        for (const memberId of memberIds) {
          const memberClient = clients.get(memberId);
          if (memberClient) {
            memberClient.roomId = null;
            send(memberClient.ws, {
              type: 'room:closed',
              roomId: room.id,
              roomName: room.name,
              by: client.username
            });
          }
        }
        room.participants.clear();
        rooms.delete(room.id);
        broadcastLobbyUpdate();
        return;
      }

      case 'rtc:offer':
      case 'rtc:answer':
      case 'rtc:ice-candidate': {
        if (!client.roomId) return;
        if (!checkSlidingRateLimit(client.signalTimestamps, 180, 10000)) {
          return;
        }
        const room = rooms.get(client.roomId);
        if (!room || !room.participants.has(client.id)) return;

        const targetId = typeof msg.toId === 'string' ? msg.toId : '';
        if (!targetId || targetId === client.id || !room.participants.has(targetId)) {
          return;
        }

        const targetClient = clients.get(targetId);
        if (!targetClient || targetClient.roomId !== client.roomId) return;

        if (msg.type === 'rtc:ice-candidate') {
          if (!msg.candidate || typeof msg.candidate !== 'object') return;
          send(targetClient.ws, {
            type: 'rtc:ice-candidate',
            roomId: room.id,
            fromId: client.id,
            candidate: {
              candidate: typeof msg.candidate.candidate === 'string' ? msg.candidate.candidate.slice(0, 1024) : '',
              sdpMid: typeof msg.candidate.sdpMid === 'string' ? msg.candidate.sdpMid.slice(0, 64) : null,
              sdpMLineIndex: typeof msg.candidate.sdpMLineIndex === 'number' ? msg.candidate.sdpMLineIndex : null,
              usernameFragment: typeof msg.candidate.usernameFragment === 'string' ? msg.candidate.usernameFragment.slice(0, 64) : null
            }
          });
        } else {
          if (!msg.sdp || typeof msg.sdp !== 'object' || typeof msg.sdp.sdp !== 'string' || typeof msg.sdp.type !== 'string') {
            return;
          }
          if (msg.sdp.sdp.length > 12000) return;
          send(targetClient.ws, {
            type: msg.type,
            roomId: room.id,
            fromId: client.id,
            sdp: {
              type: msg.sdp.type,
              sdp: msg.sdp.sdp
            }
          });
        }
        return;
      }

      default:
        sendError(client, 'Unsupported action.');
    }
  }

  wss.on('connection', (ws, req) => {
    const ip = getClientIp(req);
    const currentIpCount = ipConnectionCounts.get(ip) || 0;

    if (clients.size >= MAX_CONNECTIONS || currentIpCount >= MAX_CONNECTIONS_PER_IP) {
      ws.close(1013, 'Server busy');
      return;
    }

    ipConnectionCounts.set(ip, currentIpCount + 1);

    const clientId = crypto.randomUUID();
    const client = {
      id: clientId,
      ip,
      ws,
      username: null,
      roomId: null,
      inRandomQueue: false,
      isAlive: true,
      chatTimestamps: [],
      createRoomTimestamps: [],
      signalTimestamps: []
    };

    clients.set(clientId, client);

    send(ws, {
      type: 'session:init',
      clientId,
      lobby: getLobbyState()
    });

    ws.on('pong', () => {
      client.isAlive = true;
    });

    ws.on('message', (data) => {
      handleMessage(client, data);
    });

    const cleanup = () => {
      if (!clients.has(clientId)) return;
      clients.delete(clientId);

      const remainingIp = (ipConnectionCounts.get(ip) || 1) - 1;
      if (remainingIp <= 0) {
        ipConnectionCounts.delete(ip);
      } else {
        ipConnectionCounts.set(ip, remainingIp);
      }

      removeFromRandomQueue(clientId, false);
      leaveCurrentRoom(client, 'disconnected');
      broadcastLobbyUpdate();
    };

    ws.on('close', cleanup);
    ws.on('error', cleanup);
  });

  const heartbeat = setInterval(() => {
    for (const client of clients.values()) {
      if (!client.isAlive) {
        client.ws.terminate();
        continue;
      }
      client.isAlive = false;
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.ping();
      }
    }
  }, HEARTBEAT_INTERVAL_MS);

  wss.on('close', () => {
    clearInterval(heartbeat);
  });

  return {
    wss,
    getStats: () => ({
      connections: clients.size,
      rooms: rooms.size,
      randomQueue: randomQueue.length
    }),
    shutdown: () => {
      clearInterval(heartbeat);
      wss.close();
    }
  };
}
