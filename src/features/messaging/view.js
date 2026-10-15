import { state } from '../../app/store.js';
import { mainLayout } from '../../layouts/MainLayout.js';
import { icon } from '../../components/icons.js';
import { attractions, destinations, getExperience } from '../experiences/data.js';
import { demoMessages } from '../experiences/demo-engagement.js';
import { escapeHtml } from '../../utils/html.js';
import { activeSocialUser, socialActivity, socialPost, socialUser } from '../social/repository.js';
import { socialImage } from '../social/media.js';
import { chatMessages, chatParticipant, chatParticipants, chatThread, markChatThreadRead, visibleChatThreads } from './repository.js';
import { getContextAwareNotifications } from '../travel-intelligence/repository.js';
import { experiences } from '../experiences/data.js';
import { visibleSocialPosts } from '../social/repository.js';

const esc = escapeHtml;
function avatar(user, size = '') { return `<span class="chat-avatar ${size}" style="--avatar-color:${esc(user?.color || '#566d65')}" aria-hidden="true">${esc(user?.initials || '?')}</span>`; }
function timeLabel(value) { return new Date(value).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
function lastMessage(thread) { return chatMessages(thread.id).at(-1); }
function sharedAttachment(attachment) {
  const post = attachment?.type === 'social-post' ? socialPost(attachment.postId) : null;
  if (post) return `<a class="chat-shared-post" href="#/social/post/${encodeURIComponent(post.id)}"><img src="${esc(socialImage(post))}" alt="" /><span><strong>Vibes post</strong><small>${esc(post.location || 'Travel moment')}</small></span>${icon('chevron', 17)}</a>`;
  if (attachment?.type === 'experience') {
    const experience = getExperience(attachment.id);
    return `<a class="chat-shared-post" href="#/experience/${encodeURIComponent(experience.id)}"><img src="${esc(experience.cardImage || experience.image)}" alt="" /><span><strong>Discover experience</strong><small>${esc(experience.title)}</small></span>${icon('chevron', 17)}</a>`;
  }
  const places = attachment?.type === 'destination' ? destinations : attachment?.type === 'attraction' ? attractions : [];
  const place = places.find((item) => item.name === attachment?.id);
  if (!place) return '';
  return `<a class="chat-shared-post" href="#/results?city=${encodeURIComponent(place.city || place.name)}"><img src="${esc(place.image)}" alt="" /><span><strong>${attachment.type === 'destination' ? 'Destination' : 'Place to visit'}</strong><small>${esc(place.name)}</small></span>${icon('chevron', 17)}</a>`;
}
function chatRow(thread) {
  const person = chatParticipant(thread.id);
  const last = lastMessage(thread);
  const unread = thread.unreadBy[activeSocialUser().id] || 0;
  const title = thread.group ? thread.title : person?.displayName || 'Traveler';
  const handle = thread.group ? `${thread.participantIds.length} travelers` : `@${person?.username || 'traveler'}`;
  return `<a class="inbox-chat" href="#/inbox/chat/${encodeURIComponent(thread.id)}">${avatar(person)}<span><strong>${esc(title)}</strong><small>${esc(handle)}</small><span>${esc(last?.text || 'Start a conversation')}</span>${thread.context ? `<em>${esc(thread.context.label)}</em>` : ''}</span><small class="inbox-chat-time">${last ? timeLabel(last.createdAt) : ''}${unread ? `<b>${unread}</b>` : ''}</small></a>`;
}
function updateRow(message) {
  const experience = getExperience(message.experienceId);
  return `<a class="inbox-message" href="#/experience/${encodeURIComponent(message.experienceId)}" data-action="inbox-read" data-value="update:${esc(message.id)}" data-href="/experience/${encodeURIComponent(message.experienceId)}"><img src="${esc(experience.image)}" alt="" /><span><strong>${esc(message.title)}</strong><span>${esc(message.body)}</span></span><small>${esc(message.timeLabel)}</small></a>`;
}
function activityRow(event) {
  const person = socialUser(event.actorId);
  const label = event.kind === 'like' ? 'liked your Vibes post' : event.kind === 'comment' ? 'commented on your Vibes post' : 'started following you';
  const href = event.post ? `/social/post/${encodeURIComponent(event.post.id)}` : `/social/user/${encodeURIComponent(person?.id || '')}`;
  return `<a class="inbox-activity" href="#${href}" data-action="inbox-read" data-value="activity:${esc(event.id)}" data-href="${href}">${avatar(person, 'small')}<span><strong>${esc(person?.displayName || 'Traveler')}</strong> ${label}<small>@${esc(person?.username || 'traveler')}</small></span>${event.post ? `<em>${event.post.likedBy.length} likes</em>` : ''}</a>`;
}
function smartRow(notification) {
  return `<a class="inbox-smart" href="${esc(notification.href)}" data-action="inbox-read" data-value="smart:${esc(notification.id)}" data-href="${esc(notification.href.replace(/^#/, ''))}"><span class="inbox-smart-icon">✦</span><span><strong>${esc(notification.title)}</strong><span>${esc(notification.body)}</span></span><small>${esc(notification.timeLabel)}</small></a>`;
}
export function inboxView() {
  const threads = visibleChatThreads();
  const updates = demoMessages.filter((message) => state.inboxFilter === 'All' || message.type === state.inboxFilter);
  const activity = socialActivity(activeSocialUser().id);
  const smart = getContextAwareNotifications({ userState: state, posts: visibleSocialPosts(), catalog: experiences });
  const showMessages = state.inboxFilter === 'All' || state.inboxFilter === 'Messages';
  const showUpdates = state.inboxFilter === 'All' || state.inboxFilter === 'Updates';
  const showActivity = state.inboxFilter === 'All' || state.inboxFilter === 'Activity';
  const showSmart = state.inboxFilter === 'All' || state.inboxFilter === 'Smart';
  const hasContent = (showMessages && threads.length) || (showUpdates && updates.length) || (showActivity && activity.length) || (showSmart && smart.length);
  return mainLayout(`
    <div class="page-pad inbox-page"><div class="inbox-top"><button class="icon-button" data-action="back">${icon('arrow')}</button><h1>Inbox</h1><button class="icon-button" data-action="inbox-more">${icon('more')}</button></div>
      <div class="chip-row">${['All', 'Messages', 'Updates', 'Activity', 'Smart', 'Archive'].map((filter) => `<button class="chip ${state.inboxFilter === filter ? 'selected' : ''}" data-action="inbox-filter" data-value="${filter}">${filter}</button>`).join('')}</div>
      ${hasContent ? `${showMessages && threads.length ? `<section class="inbox-section"><h2>Messages</h2>${threads.map(chatRow).join('')}</section>` : ''}${showUpdates && updates.length ? `<section class="inbox-section"><h2>Updates</h2>${updates.map(updateRow).join('')}</section>` : ''}${showSmart && smart.length ? `<section class="inbox-section"><h2>Smart for you</h2>${smart.map(smartRow).join('')}</section>` : ''}${showActivity && activity.length ? `<section class="inbox-section"><h2>Vibes activity</h2>${activity.slice(0, 30).map(activityRow).join('')}</section>` : ''}` : `<div class="empty-state"><h2>No ${state.inboxFilter.toLowerCase()} yet</h2><p>Your messages and travel updates will appear here.</p></div>`}
    </div>
  `, 'Discover', { className: 'inbox-shell' });
}
export function chatView(threadId) {
  const thread = chatThread(threadId);
  const person = chatParticipant(threadId);
  const participants = chatParticipants(threadId);
  if (!thread || !person) return inboxView();
  markChatThreadRead(threadId);
  const selfId = activeSocialUser().id;
  const messages = chatMessages(threadId);
  return mainLayout(`
      <div class="chat-page"><header class="chat-header"><button class="icon-button" data-action="back" aria-label="Back">${icon('arrow')}</button>${avatar(person, 'small')}<span><strong>${esc(thread.group ? thread.title : person.displayName)}</strong><small>${esc(thread.group ? `${participants.length + 1} travelers in this group` : `@${person.username}`)}</small></span>${thread.group ? `<button class="icon-button" data-action="view-group-members" data-id="${esc(thread.id)}" aria-label="View group members">${icon('community', 22)}</button>` : `<a class="icon-button" href="#/social/user/${esc(person.id)}" aria-label="View profile">${icon('community', 22)}</a>`}</header>
      ${thread.context ? `<a class="chat-context" href="#/experience/${esc(thread.context.experienceId)}">${esc(thread.context.label)}${icon('chevron', 18)}</a>` : ''}
      <div class="chat-messages">${messages.map((message) => `<div class="chat-message ${message.senderId === selfId ? 'mine' : ''}">${thread.group && message.senderId !== selfId ? `<small class="chat-sender-name">${esc(socialUser(message.senderId)?.displayName || 'Traveler')}</small>` : ''}<div>${esc(message.text)}${sharedAttachment(message.attachment)}</div><small>${timeLabel(message.createdAt)}</small></div>`).join('')}</div>
      <form class="chat-composer" id="chat-message-form"><input name="message" type="text" maxlength="1000" placeholder="Message ${esc(person.displayName.split(' ')[0])}..." autocomplete="off" required /><button type="submit" aria-label="Send message">${icon('send', 21)}</button></form>
    </div>
  `, 'Discover', { className: 'inbox-shell' });
}
