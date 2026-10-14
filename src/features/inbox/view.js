import { state } from '../../app/store.js';
import { mainLayout } from '../../layouts/MainLayout.js';
import { icon } from '../../components/icons.js';
import { images } from '../experiences/data.js';
export function inboxView() {
  return mainLayout(`
    <div class="page-pad inbox-page"><div class="inbox-top"><button class="icon-button" data-action="back">${icon('arrow')}</button><button class="icon-button" data-action="inbox-more">${icon('more')}</button></div><h1>Inbox</h1>
      <div class="chip-row">${['All', 'Messages', 'Updates', 'Archive'].map((filter) => `<button class="chip ${state.inboxFilter === filter ? 'selected' : ''}" data-action="inbox-filter" data-value="${filter}">${filter}</button>`).join('')}</div>
      ${['All', 'Updates'].includes(state.inboxFilter) ? `<a class="inbox-message" href="#/experience/skydiving"><img src="${images.skydiving}" alt="" /><span><strong>👀 Love epic views?</strong><span>These viewpoints make gravity feel optional!</span></span><small>Sat, 6:21 PM</small></a>` : `<div class="empty-state"><h2>No ${state.inboxFilter.toLowerCase()} yet</h2></div>`}
    </div>
  `, 'Discover', { className: 'inbox-shell' });
}
