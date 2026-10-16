import { demoChatMessages, demoChatThreads } from './data.js';
import { activeSocialUser, socialUser } from '../social/repository.js';
import { analyzeBookingMessage } from '../guides/safety.js';

const STORAGE_KEY = 'lombok-chat-demo-v1';
const clone = (value) => JSON.parse(JSON.stringify(value));
const now = () => new Date().toISOString();

export function createSeedMessagingState() {
  return { schemaVersion: 1, threads: clone(demoChatThreads), messages: clone(demoChatMessages) };
}

function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.schemaVersion === 1 && Array.isArray(saved.threads) && Array.isArray(saved.messages)) return saved;
  } catch { /* Demo conversations remain available when storage is blocked. */ }
  return createSeedMessagingState();
}

let currentState;
function messagingState() {
  currentState ||= readState();
  return currentState;
}
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messagingState())); return true; }
  catch { return false; }
}

export function chatThread(threadId) { return messagingState().threads.find((thread) => thread.id === threadId && thread.status === 'active'); }
export function chatMessages(threadId) { return messagingState().messages.filter((message) => message.threadId === threadId).sort((a, b) => a.createdAt.localeCompare(b.createdAt)); }
export function chatParticipant(threadId) {
  const selfId = activeSocialUser().id;
  const thread = chatThread(threadId);
  return socialUser(thread?.participantIds.find((id) => id !== selfId));
}
export function chatParticipants(threadId) {
  const selfId = activeSocialUser().id;
  const thread = chatThread(threadId);
  return (thread?.participantIds || []).filter((id) => id !== selfId).map((id) => socialUser(id)).filter(Boolean);
}
export function chatMessage(threadId, messageId) { return messagingState().messages.find((message) => message.threadId === threadId && message.id === messageId); }
export function isChatUserOnline(userId) { return Boolean(socialUser(userId)?.online); }
export function visibleChatThreads() {
  const selfId = activeSocialUser().id;
  return messagingState().threads
    .filter((thread) => thread.status === 'active' && thread.participantIds.includes(selfId))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
export function findChatThreadWith(userId) {
  const selfId = activeSocialUser().id;
  return messagingState().threads.find((thread) => thread.status === 'active' && thread.participantIds.includes(selfId) && thread.participantIds.includes(userId));
}
export function getOrCreateChatThread(userId, context = null) {
  const selfId = activeSocialUser().id;
  if (!socialUser(userId) || userId === selfId) return null;
  const existing = findChatThreadWith(userId);
  if (existing) {
    if (context) { existing.context = { ...(existing.context || {}), ...context }; existing.updatedAt = now(); persist(); }
    return existing.id;
  }
  const thread = {
    id: `thread-${selfId}-${userId}`,
    participantIds: [selfId, userId],
    context,
    createdAt: now(),
    updatedAt: now(),
    lastMessageId: null,
    unreadBy: { [selfId]: 0, [userId]: 0 },
    status: 'active',
  };
  messagingState().threads.push(thread);
  return persist() ? thread.id : null;
}
export function getOrCreateTravelGroupThread(experienceId, participantIds, label) {
  const selfId = activeSocialUser().id;
  const members = [...new Set([selfId, ...participantIds])].filter((id) => socialUser(id));
  const existing = messagingState().threads.find((thread) => thread.status === 'active' && thread.group && thread.context?.experienceId === experienceId);
  if (existing) {
    existing.title = label;
    existing.context.label = label;
    if (!existing.participantIds.includes(selfId)) {
      existing.participantIds.push(selfId);
      existing.unreadBy[selfId] = 0;
      persist();
    }
    return existing.id;
  }
  const timestamp = now();
  const thread = { id: `group-${experienceId}`, participantIds: members, group: true, title: label, context: { experienceId, label }, createdAt: timestamp, updatedAt: timestamp, lastMessageId: null, unreadBy: Object.fromEntries(members.map((id) => [id, 0])), status: 'active' };
  const hostId = members.find((id) => id !== selfId) || selfId;
  const welcomeMessage = { id: `chat-${crypto.randomUUID()}`, threadId: thread.id, senderId: hostId, text: `Welcome to the ${label} traveler group. Compare dates and plan together here.`, createdAt: timestamp, readBy: [hostId] };
  thread.lastMessageId = welcomeMessage.id;
  thread.unreadBy[selfId] = hostId === selfId ? 0 : 1;
  messagingState().threads.push(thread);
  messagingState().messages.push(welcomeMessage);
  return persist() ? thread.id : null;
}
export function leaveTravelGroupThread(threadId) {
  const selfId = activeSocialUser().id;
  const thread = chatThread(threadId);
  if (!thread?.group || !thread.participantIds.includes(selfId)) return false;
  thread.participantIds = thread.participantIds.filter((id) => id !== selfId);
  delete thread.unreadBy[selfId];
  return persist();
}
export function markChatThreadRead(threadId) {
  const thread = chatThread(threadId);
  const selfId = activeSocialUser().id;
  if (!thread || !thread.participantIds.includes(selfId)) return false;
  let changed = false;
  messagingState().messages.filter((message) => message.threadId === threadId && !message.readBy.includes(selfId)).forEach((message) => { message.readBy.push(selfId); changed = true; });
  if (thread.unreadBy[selfId]) { thread.unreadBy[selfId] = 0; changed = true; }
  return changed ? persist() : true;
}
export function sendChatMessage(threadId, text, attachment = null, options = {}) {
  const thread = chatThread(threadId);
  const senderId = activeSocialUser().id;
  const clean = String(text || '').trim().slice(0, 1000);
  if (!thread || !thread.participantIds.includes(senderId) || !clean) return false;
  const attachmentId = attachment?.id || attachment?.postId;
  const allowedAttachment = ['social-post', 'experience', 'destination', 'attraction'].includes(attachment?.type) && attachmentId;
  const normalizedAttachment = attachment?.type === 'image' && attachment.localImage ? { type: 'image', localImage: attachment.localImage } : attachment?.type === 'audio' && attachment.localAudio ? { type: 'audio', localAudio: attachment.localAudio } : attachment?.type === 'sticker' && attachment.value ? { type: 'sticker', value: attachment.value } : allowedAttachment ? { type: attachment.type, ...(attachment.type === 'social-post' ? { postId: attachmentId } : { id: attachmentId }) } : null;
  const replyTo = options.replyTo ? chatMessage(threadId, options.replyTo) : null;
  const safetySignal = thread.context?.requestId ? analyzeBookingMessage(clean) : null;
  const message = { id: `chat-${crypto.randomUUID()}`, threadId, senderId, text: clean, createdAt: now(), readBy: [senderId], deliveredTo: [senderId, ...thread.participantIds.filter((id) => id !== senderId)], ...(replyTo ? { replyTo: { id: replyTo.id, text: replyTo.text, senderId: replyTo.senderId } } : {}), ...(normalizedAttachment ? { attachment: normalizedAttachment } : {}), ...(safetySignal ? { safetySignal: { kind: safetySignal.kind, advice: safetySignal.advice } } : {}) };
  messagingState().messages.push(message);
  thread.lastMessageId = message.id;
  thread.updatedAt = message.createdAt;
  thread.participantIds.filter((id) => id !== senderId).forEach((recipientId) => { thread.unreadBy[recipientId] = (thread.unreadBy[recipientId] || 0) + 1; });
  return persist();
}
export function sendChatSystemMessage(threadId, text, metadata = {}) {
  const thread = chatThread(threadId);
  const clean = String(text || '').trim().slice(0, 1000);
  if (!thread || !clean) return false;
  const createdAt = now();
  const message = { id: `system-${crypto.randomUUID()}`, threadId, senderId: null, text: clean, createdAt, readBy: [...thread.participantIds], deliveredTo: [...thread.participantIds], system: true, ...metadata };
  messagingState().messages.push(message);
  thread.lastMessageId = message.id;
  thread.updatedAt = createdAt;
  return persist();
}
export function editChatMessage(threadId, messageId, text) {
  const message = chatMessage(threadId, messageId);
  const clean = String(text || '').trim().slice(0, 1000);
  if (!message || message.senderId !== activeSocialUser().id || !clean) return false;
  message.text = clean;
  message.editedAt = now();
  return persist();
}
export function deleteChatMessage(threadId, messageId) {
  const message = chatMessage(threadId, messageId);
  if (!message || message.senderId !== activeSocialUser().id) return false;
  message.text = '';
  message.deletedAt = now();
  message.attachment = null;
  return persist();
}
export function toggleChatReaction(threadId, messageId, emoji = '👍') {
  const message = chatMessage(threadId, messageId);
  if (!message) return false;
  const userId = activeSocialUser().id;
  message.reactions ||= {};
  message.reactions[emoji] ||= [];
  message.reactions[emoji] = message.reactions[emoji].includes(userId) ? message.reactions[emoji].filter((id) => id !== userId) : [...message.reactions[emoji], userId];
  if (!message.reactions[emoji].length) delete message.reactions[emoji];
  return persist();
}
export function toggleChatFavorite(threadId, messageId) {
  const message = chatMessage(threadId, messageId);
  if (!message) return false;
  message.favoriteBy ||= [];
  const userId = activeSocialUser().id;
  message.favoriteBy = message.favoriteBy.includes(userId) ? message.favoriteBy.filter((id) => id !== userId) : [...message.favoriteBy, userId];
  return persist();
}
export function toggleChatPin(threadId, messageId) {
  const message = chatMessage(threadId, messageId);
  if (!message) return false;
  message.pinned = !message.pinned;
  return persist();
}
export function toMessagingFirebaseFixture(source = messagingState()) {
  return {
    conversations: source.threads.map((thread) => ({
      id: thread.id, schemaVersion: 1, participantIds: thread.participantIds, context: thread.context,
      status: thread.status, createdAt: thread.createdAt, updatedAt: thread.updatedAt,
      lastMessageAt: thread.updatedAt,
      lastMessagePreview: source.messages.find((message) => message.id === thread.lastMessageId)?.text || null,
    })),
    messages: source.messages.map((message) => ({
      id: message.id, conversationId: message.threadId, senderId: message.senderId,
      text: message.text, createdAt: message.createdAt, readBy: message.readBy, deliveredTo: message.deliveredTo || [], attachment: message.attachment || null,
    })),
  };
}
