import { state } from '../../app/store.js';
import { mainLayout } from '../../layouts/MainLayout.js';
import { icon } from '../../components/icons.js';
import { getExperience } from '../experiences/data.js';
import { demoMessages } from '../experiences/demo-engagement.js';
import { escapeHtml } from '../../utils/html.js';
export function inboxView() {
  const messages = demoMessages.filter((message) => state.inboxFilter === 'All' || message.type === state.inboxFilter);
  return mainLayout(`
    <div class="page-pad inbox-page"><div class="inbox-top"><button class="icon-button" data-action="back">${icon('arrow')}</button><h1>Inbox</h1><button class="icon-button" data-action="inbox-more">${icon('more')}</button></div>
      <div class="chip-row">${['All', 'Messages', 'Updates', 'Archive'].map((filter) => `<button class="chip ${state.inboxFilter === filter ? 'selected' : ''}" data-action="inbox-filter" data-value="${filter}">${filter}</button>`).join('')}</div>
      ${messages.length ? messages.map((message) => `<a class="inbox-message" href="#/experience/${encodeURIComponent(message.experienceId)}"><img src="${escapeHtml(getExperience(message.experienceId).image)}" alt="" /><span><strong>${escapeHtml(message.title)}</strong><span>${escapeHtml(message.body)}</span></span><small>${escapeHtml(message.timeLabel)}</small></a>`).join('') : `<div class="empty-state"><h2>No ${state.inboxFilter.toLowerCase()} yet</h2></div>`}
    </div>
  `, 'Discover', { className: 'inbox-shell' });
}
