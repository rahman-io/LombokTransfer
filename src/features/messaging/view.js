import { state } from '../../app/store.js';
import { mainLayout } from '../../layouts/MainLayout.js';
import { icon } from '../../components/icons.js';
import { attractions, destinations, getExperience } from '../experiences/data.js';
import { demoMessages } from '../experiences/demo-engagement.js';
import { escapeHtml } from '../../utils/html.js';
import { activeSocialUser, socialActivity, socialPost, socialUser } from '../social/repository.js';
import { socialImage } from '../social/media.js';
import { chatMessages, chatParticipant, chatParticipants, chatThread, isChatUserOnline, markChatThreadRead, visibleChatThreads } from './repository.js';
import { getContextAwareNotifications } from '../travel-intelligence/repository.js';
import { experiences } from '../experiences/data.js';
import { formatListedPrice } from '../experiences/booking-demo.js';
import { approvedExperienceLabel, guideDemoData, sharedDepartureAlternatives, sharedDepartureStatus } from '../guides/repository.js';
import { bookingAssistantAdvice } from '../guides/safety.js';
import { visibleSocialPosts } from '../social/repository.js';

const esc = escapeHtml;
function avatar(user, size = '') { return `<span class="chat-avatar ${size}" style="--avatar-color:${esc(user?.color || '#566d65')}" aria-hidden="true">${esc(user?.initials || '?')}</span>`; }
function timeLabel(value) { return new Date(value).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
function lastMessage(thread) { return chatMessages(thread.id).at(-1); }
function visibleOnline(userId) { return isChatUserOnline(userId) && (userId !== activeSocialUser().id || state.privacy.onlineStatus); }
function sharedAttachment(attachment, messageId = '') {
  if (attachment?.type === 'image' && attachment.localImage) return `<button type="button" class="chat-image-attachment" data-action="chat-open-gallery" data-id="${esc(messageId)}" aria-label="Open chat photo"><img src="${esc(attachment.localImage)}" alt="Photo sent in chat" loading="lazy" draggable="false" /></button>`;
  if (attachment?.type === 'audio' && attachment.localAudio) return `<audio class="chat-audio-attachment" src="${esc(attachment.localAudio)}" controls preload="metadata"></audio>`;
  if (attachment?.type === 'sticker') return `<span class="chat-sticker-attachment">${esc(attachment.value || '✨')}</span>`;
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
function messageStatus(message, thread, selfId) {
  if (message.senderId !== selfId) return '';
  if (!state.privacy.readReceipts) return '<span class="chat-message-status">✓</span>';
  const recipients = thread.participantIds.filter((id) => id !== selfId);
  const read = recipients.length > 0 && recipients.every((id) => message.readBy.includes(id));
  const delivered = recipients.length > 0 && recipients.every((id) => (message.deliveredTo || recipients).includes(id));
  return `<span class="chat-message-status ${read ? 'read' : ''}">${read ? '✓✓' : delivered ? '✓✓' : '✓'}</span>`;
}
function messageReactions(message) {
  return Object.entries(message.reactions || {}).filter(([, users]) => users.length).map(([emoji, users]) => `<span>${emoji} ${users.length}</span>`).join('');
}
function messageActions(message, selfId) {
  const own = message.senderId === selfId;
  return `<details class="chat-message-menu ${own ? 'mine' : ''}"><summary aria-label="Message actions">${icon('more', 17)}</summary><div><button data-action="reply-chat" data-id="${esc(message.id)}">Reply</button>${message.text && !message.deletedAt ? `<button data-action="copy-chat" data-id="${esc(message.id)}">Copy</button>` : ''}${own && !message.deletedAt ? `<button data-action="edit-chat" data-id="${esc(message.id)}">Edit</button>` : ''}${own && !message.deletedAt ? `<button data-action="delete-chat" data-id="${esc(message.id)}">Delete</button>` : ''}<button data-action="react-chat" data-id="${esc(message.id)}" data-value="👍">👍 Like</button><button data-action="react-chat" data-id="${esc(message.id)}" data-value="❤️">❤️ Love</button><button data-action="forward-chat" data-id="${esc(message.id)}">Forward</button><button data-action="favorite-chat" data-id="${esc(message.id)}">${message.favoriteBy?.includes(selfId) ? 'Unfavorite' : 'Favorite'}</button><button data-action="pin-chat" data-id="${esc(message.id)}">${message.pinned ? 'Unpin' : 'Pin'}</button><button data-action="info-chat" data-id="${esc(message.id)}">Info</button></div></details>`;
}
function bookingChatContextView(thread, request, experience, option, total) {
  const safety = request.safety || {};
  const guideMode = activeSocialUser().role === 'guide' && (activeSocialUser().guideId || activeSocialUser().id) === request.guideId;
  const status = safety.reports?.some((report) => report.status === 'open') ? 'Needs review' : request.status === 'cancelled' ? 'Cancelled · demo refund' : request.status === 'completed' ? 'Trip completed' : request.bookingStatus === 'in_progress' ? 'Trip in progress' : request.verificationStatus === 'verified' ? 'Identity verified' : request.paymentStatus === 'paid' ? 'Payment confirmed' : 'Payment required';
  const bookingLink = `#/bookings/${encodeURIComponent(request.id)}/safety`;
  return `<section class="chat-booking-context" aria-label="Booking context"><div class="chat-booking-context-top"><div><small class="chat-booking-kicker">BOOKING · ${esc(request.bookingId || 'PENDING')}</small><strong>${esc(experience?.title || thread.context.label || 'Travel booking')}</strong><span>${esc(request.date)} · ${esc(option?.duration || 'Duration to confirm')} · ${esc(total)}</span></div><a class="chat-booking-details" href="${bookingLink}">Details ${icon('chevron', 15)}</a></div><div class="chat-booking-status ${status === 'Needs review' ? 'pending' : request.status === 'completed' ? 'complete' : 'confirmed'}"><span>${esc(status)}</span><small>Keep coordination in this chat</small></div><div class="chat-booking-actions"><button type="button" data-action="booking-chat-action" data-id="${esc(thread.id)}" data-value="meeting">Meeting point</button><button type="button" data-action="booking-chat-action" data-id="${esc(thread.id)}" data-value="time">Start time</button><button type="button" data-action="booking-chat-action" data-id="${esc(thread.id)}" data-value="location">Share location</button><a href="${bookingLink}">Safety Center</a></div><div class="chat-booking-checklist"><span class="done">✓ Booking ID ready</span><span class="${request.paymentStatus === 'paid' ? 'done' : ''}">${request.paymentStatus === 'paid' ? '✓' : '○'} Payment confirmed</span><span class="${safety.meetingPoint ? 'done' : ''}">${safety.meetingPoint ? '✓' : '○'} Meeting point ${safety.meetingPoint ? 'agreed' : 'to confirm'}</span>${guideMode ? '' : `<a href="#/bookings/${encodeURIComponent(request.id)}">Show QR</a>`}</div></section>`;
}
function sharedDeparturePanel(thread) {
  const offerId = thread.context?.offerId;
  const departure = offerId && sharedDepartureStatus(offerId);
  if (!departure || (!departure.bookings.length && !departure.historicalBookings.length)) return '';
  const account = activeSocialUser();
  const guideId = account?.guideId || account?.id;
  const guideMode = account?.role === 'guide' && (departure.offer.teamGuideIds || [departure.offer.guideId]).includes(guideId);
  const ownRequest = [...departure.bookings, ...departure.historicalBookings].find((request) => request.travelerEmail === String(account?.accountEmail || '').toLowerCase());
  const decision = departure.decision;
  const responses = Object.values(decision?.responses || {});
  const acceptedVotes = responses.filter((response) => response === true).length;
  const voteCount = responses.length;
  const today = new Date().toISOString().slice(0, 10);
  const options = guideMode ? sharedDepartureAlternatives(offerId, guideId) : [];
  const alternatives = options.map((offer) => {
    const packageOption = getExperience(offer.experienceId)?.packageOptions?.find((entry) => entry.id === offer.packageId);
    return `<option value="${esc(offer.id)}">${esc(packageOption?.name || 'Shared package')} · ${esc(offer.date)} · Rp${Number(offer.price).toLocaleString('id-ID')} per person</option>`;
  }).join('');
  const title = departure.workStatus === 'completed' ? 'Trip completed' : departure.workStatus === 'cancelled' ? 'Departure cancelled · demo refund' : departure.workStatus === 'completion_pending' ? 'Waiting for travelers to confirm completion' : departure.workStatus === 'in_progress' ? 'Guide is working · Trip in progress' : departure.minimumMet ? 'Departure confirmed' : `${departure.paidTravelers} of ${departure.minGuests} minimum travelers`;
  const subtitle = departure.workStatus === 'completed' ? 'The guide and travelers completed the trip.' : departure.workStatus === 'cancelled' ? 'The group agreed to cancel. A demo refund was recorded; no real money moved.' : departure.pendingCount ? `${departure.pendingCount} booking request${departure.pendingCount === 1 ? '' : 's'} still need a guide response.` : departure.unpaidCount ? `${departure.unpaidCount} accepted booking${departure.unpaidCount === 1 ? '' : 's'} still need payment before the group can decide.` : departure.underMinimum ? departure.decisionDue ? 'A group decision is needed within 24 hours of departure.' : 'If the minimum is still unmet within 24 hours of departure, the guide will ask the group what to do.' : `${Math.max(0, departure.maxGuests - departure.paidTravelers)} seats remain on this shared departure.`;
  const canPropose = guideMode && departure.decisionDue && departure.underMinimum && !departure.pendingCount && !departure.unpaidCount && departure.workStatus === 'not_started' && (!decision || ['declined', 'needs_review'].includes(decision.status));
  const proposalForm = canPropose ? `<form class="shared-decision-form" id="shared-departure-decision-form" data-offer-id="${esc(offerId)}"><strong>Ask the group to choose a plan</strong><label>Proposal<select name="kind" data-shared-decision-kind><option value="proceed">Continue with the current group</option><option value="reschedule">Move to another date</option>${alternatives ? '<option value="change_package">Switch to another approved shared departure</option>' : ''}<option value="refund">Cancel and record a demo refund</option></select></label><label data-shared-decision-field="date" hidden>New departure date<input name="date" type="date" min="${today}" /></label>${alternatives ? `<label data-shared-decision-field="offer" hidden>Approved shared departure<select name="targetOfferId"><option value="">Choose a departure</option>${alternatives}</select></label>` : ''}<label>Message to the group<textarea name="message" rows="2" maxlength="360" placeholder="Explain the available choice and any important details" required></textarea></label><button class="primary-button" type="submit">Send proposal to travelers</button></form>` : '';
  let decisionContent = '';
  if (decision?.status === 'proposed') {
    const kindLabel = { proceed: 'Continue with the current group', reschedule: `Move the trip to ${decision.date}`, change_package: `Switch to another shared departure on ${decision.targetDate}`, refund: 'Cancel and record a demo refund' }[decision.kind] || 'Update shared departure';
    const ownResponse = ownRequest ? decision.responses?.[ownRequest.id] : null;
    decisionContent = `<div class="shared-decision-proposal"><strong>Guide proposal · ${esc(kindLabel)}</strong><p>${esc(decision.message)}</p><small>${acceptedVotes} of ${voteCount} traveler parties agreed.</small>${!guideMode && ownRequest && ownResponse === null ? `<div class="guardian-actions"><button data-action="shared-departure-vote" data-id="${esc(offerId)}" data-value="yes">Agree</button><button data-action="shared-departure-vote" data-id="${esc(offerId)}" data-value="no">I don’t agree</button></div>` : ownResponse === true ? '<small class="shared-vote-note">Your party agreed.</small>' : ownResponse === false ? '<small class="shared-vote-note">Your party declined this proposal.</small>' : ''}</div>`;
  } else if (decision?.status === 'declined') {
    decisionContent = `<p class="shared-decision-note">At least one traveler party did not agree. The guide can propose another plan in the group chat.</p>${proposalForm}`;
  } else if (decision?.status === 'needs_review') {
    decisionContent = `<p class="shared-decision-note">The agreed change could not be applied safely. Keep coordinating here; no booking was changed.</p>${proposalForm}`;
  } else if (decision?.status === 'approved') {
    decisionContent = '<p class="shared-decision-note">Every paid traveler party agreed to continue with the current group. The guide can start on the departure date after checking every traveler.</p>';
  } else if (departure.decisionDue && departure.underMinimum) {
    decisionContent = guideMode ? departure.pendingCount ? '<p class="shared-decision-note">Respond to pending booking requests first so no traveler is left out of the group decision.</p>' : departure.unpaidCount ? '<p class="shared-decision-note">Wait until every accepted booking is paid before asking the group to decide.</p>' : proposalForm : '<p class="shared-decision-note">The guide will send a group proposal. Each paid traveler party must respond before the plan is finalized.</p>';
  }
  let workContent = '';
  if (guideMode && departure.workStatus === 'not_started') {
    const canStart = (departure.minimumMet || decision?.kind === 'proceed' && decision.status === 'approved') && departure.offer.date <= today && !departure.unpaidCount && departure.allVerified && !departure.hasOpenReport;
    workContent = canStart
      ? `<form class="shared-trip-start-form" id="shared-trip-start-form" data-offer-id="${esc(offerId)}"><label>Agreed meeting point<input name="meetingPoint" maxlength="180" placeholder="Enter the public meeting point" required /></label><button class="primary-button" type="button" data-action="shared-trip-work" data-id="${esc(offerId)}" data-value="start">Start work and trip</button></form>`
      : `<small class="shared-work-hint">${departure.offer.date > today ? `Not started · Trip date ${esc(departure.offer.date)}` : departure.pendingCount ? 'Not started · Respond to all pending booking requests first.' : departure.unpaidCount ? 'Not started · Wait for all accepted bookings to be paid.' : !departure.allVerified ? 'Not started · Verify every paid traveler’s booking code first.' : departure.hasOpenReport ? 'Not started · Resolve the open safety report first.' : departure.underMinimum && decision?.status !== 'approved' ? 'Not started · The group must agree to proceed with fewer travelers first.' : 'Not started · Complete the pending booking steps first.'}</small>`;
  } else if (guideMode && departure.workStatus === 'in_progress') {
    workContent = departure.allInProgress
      ? `<button class="guardian-danger" data-action="shared-trip-work" data-id="${esc(offerId)}" data-value="complete" ${departure.hasOpenReport ? 'disabled' : ''}>Mark trip work complete</button>`
      : `<small class="shared-work-hint">In progress · Waiting for ${departure.bookings.filter((request) => request.bookingStatus !== 'in_progress').length} traveler${departure.bookings.filter((request) => request.bookingStatus !== 'in_progress').length === 1 ? '' : 's'} to confirm the trip start in Safety Center.</small>`;
  } else if (!guideMode && ownRequest && departure.workStatus === 'in_progress') {
    workContent = `<a class="shared-safety-link" href="#/bookings/${encodeURIComponent(ownRequest.id)}/safety">Confirm meeting and check in · Safety Center</a>`;
  } else if (!guideMode && ownRequest && departure.workStatus === 'completion_pending' && !ownRequest.safety?.travelerEndedAt) {
    workContent = `<a class="shared-safety-link" href="#/bookings/${encodeURIComponent(ownRequest.id)}/safety">Confirm trip completion · Safety Center</a>`;
  } else if (departure.workStatus === 'completion_pending') {
    workContent = '<small class="shared-work-hint">The guide marked the trip complete. Traveler confirmations are still pending.</small>';
  } else if (departure.workStatus === 'completed') {
    workContent = '<small class="shared-work-hint">Status · Completed</small>';
  } else if (departure.workStatus === 'cancelled') {
    workContent = '<small class="shared-work-hint">Status · Cancelled. Contact the guide in this chat if you need help with the demo record.</small>';
  }
  const adjustments = ownRequest?.settlementAdjustment ? `<small class="shared-work-hint">Demo balance ${ownRequest.settlementAdjustment > 0 ? 'due' : 'refund due'} after the package change: Rp${Math.abs(ownRequest.settlementAdjustment).toLocaleString('id-ID')}. No real payment has been processed.</small>` : '';
  return `<section class="shared-departure-panel" aria-label="Shared trip status"><div class="shared-departure-heading"><span><small>SHARED DEPARTURE</small><strong>${esc(title)}</strong></span><em class="shared-work-status ${esc(departure.workStatus)}">${esc(departure.workStatus.replace('_', ' '))}</em></div><p>${esc(subtitle)}</p>${decisionContent}${workContent}${adjustments}</section>`;
}
function chatMessageView(message, thread, selfId) {
  if (message.system) return `<div class="chat-system-message"><span>${esc(message.text)}</span></div>`;
  return `<div class="chat-message ${message.senderId === selfId ? 'mine' : ''}">${thread.group && message.senderId !== selfId ? `<small class="chat-sender-name">${esc(socialUser(message.senderId)?.displayName || 'Traveler')}</small>` : ''}<div class="chat-message-line"><div class="chat-message-bubble ${message.deletedAt ? 'deleted' : ''}" data-action="open-chat-menu" data-id="${esc(message.id)}">${message.replyTo ? `<div class="chat-reply-preview"><strong>Reply</strong><span>${esc(message.replyTo.text || 'Message')}</span></div>` : ''}${message.deletedAt ? '<em>This message was deleted</em>' : `${esc(message.text)}${sharedAttachment(message.attachment, message.id)}${message.editedAt ? '<small class="chat-edited">edited</small>' : ''}`}</div>${messageActions(message, selfId)}</div>${messageReactions(message) ? `<div class="chat-reactions">${messageReactions(message)}</div>` : ''}${message.safetySignal && !message.deletedAt ? `<div class="chat-safety-signal">✦ Smart safety · ${esc(message.safetySignal.advice)}</div>` : ''}<small>${timeLabel(message.createdAt)} ${messageStatus(message, thread, selfId)}</small></div>`;
}
function chatRow(thread) {
  const person = chatParticipant(thread.id);
  const last = lastMessage(thread);
  const unread = thread.unreadBy[activeSocialUser().id] || 0;
  const title = thread.group ? thread.title : person?.displayName || 'Traveler';
  const handle = thread.group ? `${thread.participantIds.length} travelers · ${thread.participantIds.filter(visibleOnline).length} online` : `@${person?.username || 'traveler'}`;
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
  if (!thread || !person || !thread.participantIds.includes(activeSocialUser().id)) return inboxView();
  markChatThreadRead(threadId);
  const selfId = activeSocialUser().id;
  const messages = chatMessages(threadId);
  const onlineLabel = thread.group ? `${thread.participantIds.filter(visibleOnline).length} online` : visibleOnline(person.id) ? 'Online' : 'Last seen recently';
  const editing = messages.find((message) => message.id === state.chatEditMessageId && message.senderId === selfId);
  const replying = messages.find((message) => message.id === state.chatReplyMessageId);
  const pinnedCount = messages.filter((message) => message.pinned).length;
  const favoriteCount = messages.filter((message) => message.favoriteBy?.includes(selfId)).length;
  const contextExperience = thread.context ? getExperience(thread.context.experienceId) : null;
  const contextPrice = contextExperience?.packageOptions?.length ? approvedExperienceLabel(contextExperience) : contextExperience ? formatListedPrice(contextExperience) : '';
  const bookingRequest = thread.context?.requestId ? guideDemoData().requests.find((request) => request.id === thread.context.requestId) : null;
  const bookingOption = bookingRequest ? contextExperience?.packageOptions?.find((option) => option.id === bookingRequest.packageId) : null;
  const bookingTotal = bookingRequest?.finance?.travelerTotal || bookingRequest?.travelerTotal || thread.context?.total;
  const bookingMoney = bookingTotal ? `Rp${Math.round(bookingTotal).toLocaleString('id-ID')}` : 'Total to be confirmed';
  const bookingAdvice = bookingRequest ? bookingAssistantAdvice(bookingRequest) : '';
  const composerValue = editing?.text || (state.chatDraft?.threadId === threadId ? state.chatDraft.text : '');
  return mainLayout(`
    <div class="chat-page"><header class="chat-header"><button class="icon-button" data-action="back" aria-label="Back">${icon('arrow')}</button>${avatar(person, 'small')}<span><strong>${esc(thread.group ? thread.title : person.displayName)}</strong><small>${esc(thread.group ? `${participants.length + 1} travelers · ${onlineLabel}` : `${onlineLabel} · @${person.username}`)}</small></span>${thread.group ? `<button class="icon-button" data-action="view-group-members" data-id="${esc(thread.id)}" aria-label="View group members">${icon('community', 22)}</button><button class="chat-group-leave-button" data-action="leave-travel-group" data-id="${esc(thread.id)}">Leave</button>` : `<a class="icon-button" href="#/social/user/${esc(person.id)}" aria-label="View profile">${icon('community', 22)}</a>`}</header>
      ${bookingRequest ? bookingChatContextView(thread, bookingRequest, contextExperience, bookingOption, bookingMoney) : thread.context ? `<a class="chat-context" href="#/experience/${esc(thread.context.experienceId)}"><span><strong>${esc(thread.context.label)}</strong>${contextExperience ? `<small>${contextPrice === 'Awaiting guide approval' ? '' : 'From '}${esc(contextPrice)} · ${esc(contextExperience.duration)}</small>` : ''}</span>${icon('chevron', 18)}</a>` : ''}
      ${bookingRequest ? `<div class="chat-booking-assistant"><span>✦ Trip assistant · ${esc(bookingAdvice)}</span><a href="#/bookings/${encodeURIComponent(bookingRequest.id)}/safety">Safety Center</a></div>` : ''}
      ${thread.context?.offerId ? sharedDeparturePanel(thread) : ''}
      ${(pinnedCount || favoriteCount) ? `<div class="chat-collections">${pinnedCount ? `<button data-action="chat-collection" data-value="pinned">${icon('pin', 15)} ${pinnedCount} pinned</button>` : ''}${favoriteCount ? `<button data-action="chat-collection" data-value="favorite">${icon('star', 15)} ${favoriteCount} favorite</button>` : ''}</div>` : ''}
      <div class="chat-messages">${messages.map((message) => chatMessageView(message, thread, selfId)).join('')}</div>
      <form class="chat-composer" id="chat-message-form">${editing ? `<div class="chat-compose-context"><strong>Edit message</strong><button type="button" data-action="cancel-chat-compose" aria-label="Cancel edit">${icon('close', 15)}</button></div>` : replying ? `<div class="chat-compose-context"><strong>Replying to ${esc(socialUser(replying.senderId)?.displayName || 'traveler')}</strong><span>${esc(replying.text || 'Message')}</span><button type="button" data-action="cancel-chat-compose" aria-label="Cancel reply">${icon('close', 15)}</button></div>` : ''}<div class="chat-compose-tools"><button type="button" data-action="chat-gallery" aria-label="Send photo">${icon('image', 19)}<span>Photo</span></button><button type="button" data-action="chat-camera" aria-label="Take photo">${icon('camera', 19)}<span>Camera</span></button><button type="button" data-action="chat-emoji" aria-label="Open system emoji keyboard">😊<span>Emoji</span></button><button type="button" data-action="chat-sticker" aria-label="Open stickers">✨<span>Stickers</span></button><button type="button" data-action="chat-voice" aria-label="Record voice message">${icon('mic', 19)}<span>Voice</span></button></div><div class="chat-sticker-panel">${['✨🗺️', '🌍✈️', '🏖️☀️', '🏔️🤍', '📸🌅', '🍜🧳'].map((sticker) => `<button type="button" data-action="send-chat-sticker" data-value="${sticker}" aria-label="Send ${sticker}">${sticker}</button>`).join('')}</div><div class="chat-compose-row"><button type="button" class="chat-compose-plus" data-action="chat-tools" aria-label="More chat tools">${icon('plus', 21)}</button><textarea name="message" rows="1" maxlength="1000" placeholder="Message ${thread.group ? 'the group' : esc(person.displayName.split(' ')[0])}..." autocomplete="off" required>${esc(composerValue)}</textarea><button type="submit" aria-label="Send message">${icon('send', 21)}</button></div><input id="chat-photo-input" type="file" accept="image/*" multiple hidden /><input id="chat-camera-input" type="file" accept="image/*" capture="environment" hidden /></form>
    </div>
  `, 'Discover', { className: 'inbox-shell', hideNavigation: true });
}
