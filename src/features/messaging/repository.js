import { demoChatMessages, demoChatThreads } from './data.js';
import { activeSocialUser, socialUser } from '../social/repository.js';

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
export function getOrCreateChatThread(userId) {
  const selfId = activeSocialUser().id;
  if (!socialUser(userId) || userId === selfId) return null;
  const existing = findChatThreadWith(userId);
  if (existing) return existing.id;
  const thread = {
    id: `thread-${selfId}-${userId}`,
    participantIds: [selfId, userId],
    context: null,
    createdAt: now(),
    updatedAt: now(),
    lastMessageId: null,
    unreadBy: { [selfId]: 0, [userId]: 0 },
    status: 'active',
  };
  messagingState().threads.push(thread);
  return persist() ? thread.id : null;
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
export function sendChatMessage(threadId, text, attachment = null) {
  const thread = chatThread(threadId);
  const senderId = activeSocialUser().id;
  const clean = String(text || '').trim().slice(0, 1000);
  if (!thread || !thread.participantIds.includes(senderId) || !clean) return false;
  const attachmentId = attachment?.id || attachment?.postId;
  const allowedAttachment = ['social-post', 'experience', 'destination', 'attraction'].includes(attachment?.type) && attachmentId;
  const normalizedAttachment = allowedAttachment ? { type: attachment.type, ...(attachment.type === 'social-post' ? { postId: attachmentId } : { id: attachmentId }) } : null;
  const message = { id: `chat-${crypto.randomUUID()}`, threadId, senderId, text: clean, createdAt: now(), readBy: [senderId], ...(normalizedAttachment ? { attachment: normalizedAttachment } : {}) };
  messagingState().messages.push(message);
  thread.lastMessageId = message.id;
  thread.updatedAt = message.createdAt;
  const recipientId = thread.participantIds.find((id) => id !== senderId);
  thread.unreadBy[recipientId] = (thread.unreadBy[recipientId] || 0) + 1;
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
      text: message.text, createdAt: message.createdAt, readBy: message.readBy, attachment: message.attachment || null,
    })),
  };
}
