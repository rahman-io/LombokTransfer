import { state } from '../app/store.js';
import { icon } from './icons.js';
import { escapeHtml } from '../utils/html.js';
import { getExperience, getExperienceGallery } from '../features/experiences/data.js';
import { getDemoReviews } from '../features/experiences/demo-engagement.js';

function monthGrid(year, month) {
  const first = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const cells = Array(first).fill('<span></span>');
  for (let day = 1; day <= count; day++) {
    const date = new Date(year, month, day);
    const value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push(`<button class="${state.date === value ? 'selected' : ''}" data-action="select-date" data-value="${value}" ${date < today ? 'disabled' : ''}>${day}</button>`);
  }
  return `<div class="calendar-month"><h3>${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1))}</h3><div class="calendar-grid">${cells.join('')}</div></div>`;
}

export function modalView() {
  if (!state.modal) return '';
  let title = '';
  let body = '';
  if (state.modal === 'dates') {
    title = 'Date';
    const now = new Date();
    body = `<div class="calendar-content"><button class="chip" data-action="tomorrow">Tomorrow</button><div class="weekdays">${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => `<span>${d}</span>`).join('')}</div>${monthGrid(now.getFullYear(), now.getMonth())}${monthGrid(now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear(), (now.getMonth() + 1) % 12)}<div class="date-help">${icon('calendar')}<span><strong>Dates not available?</strong><small>View this activity from other providers</small></span></div></div>`;
  } else if (state.modal === 'participants') {
    title = 'Participants';
    body = `<div class="participant-row"><span><strong>Adults</strong><small>Age 18+</small></span><div><button data-action="count" data-value="adults:-1">−</button><b>${state.adults}</b><button data-action="count" data-value="adults:1">+</button></div></div><div class="participant-row"><span><strong>Children</strong><small>Age 0–17</small></span><div><button data-action="count" data-value="children:-1">−</button><b>${state.children}</b><button data-action="count" data-value="children:1">+</button></div></div><button class="primary-button full" data-action="close-modal">Done</button>`;
  } else if (state.modal === 'filters') {
    title = 'Filters';
    body = `<h3>Activity types</h3>${['Guided tours', 'Entry tickets', 'Nightlife', 'Outdoor activities', 'Food & drink'].map((value) => `<label class="filter-choice"><input type="checkbox" ${state.filter === value ? 'checked' : ''} data-filter="${value}" /> ${value}</label>`).join('')}<button class="primary-button full" data-action="close-modal">Show results</button>`;
  } else if (state.modal === 'save') {
    title = 'Select a list';
    body = `<button class="select-list" data-action="save-to-list">${icon('image')}<span><strong>${escapeHtml(state.listName)}</strong><small>${state.wishlist.length} activities</small></span></button><button class="primary-button" data-action="new-list">Create a new list</button>`;
  } else if (state.modal === 'new-list') {
    title = 'Create a new list';
    body = `<label class="form-label">List name<input id="list-name" placeholder="My trip" maxlength="36" autofocus /></label><button class="primary-button full" data-action="create-list">Create list</button>`;
  } else if (state.modal === 'reviews') {
    title = 'Customer reviews';
    body = getDemoReviews(getExperience(state.reviewExperienceId)).more.map((review) => `<div class="review-card"><div class="review-stars">★★★★★</div><strong>${escapeHtml(review.author)} - ${escapeHtml(review.country)}</strong><small>Verified booking</small><p>${escapeHtml(review.text)}</p></div>`).join('');
  } else if (state.modal === 'gallery') {
    title = 'Photos';
    const experience = getExperience(state.galleryExperienceId);
    const photos = getExperienceGallery(experience);
    const current = Math.min(state.galleryIndex, photos.length - 1);
    body = `<div class="modal-gallery"><div class="modal-gallery-track" data-gallery-track aria-label="${escapeHtml(experience.title)} photos" tabindex="0">${photos.map((source, index) => `<img src="${escapeHtml(source)}" alt="${escapeHtml(experience.title)} — photo ${index + 1} of ${photos.length}" ${index !== current ? 'loading="lazy"' : ''} draggable="false" />`).join('')}</div><div class="modal-gallery-controls"><button data-action="gallery-prev" aria-label="Previous photo" ${current === 0 ? 'disabled' : ''}>‹</button><span data-gallery-counter>${current + 1} / ${photos.length}</span><button data-action="gallery-next" aria-label="Next photo" ${current === photos.length - 1 ? 'disabled' : ''}>›</button></div></div>`;
  } else if (state.modal === 'share') {
    title = 'Share this experience';
    body = `<p>Copy the link to share this activity.</p><button class="primary-button full" data-action="copy-link">Copy link</button>`;
  } else if (state.modal === 'promo') {
    title = 'Promo or gift code';
    body = `<label class="form-label">Enter code<input id="promo-code" placeholder="Promo code" /></label><button class="primary-button full" data-action="apply-promo">Apply</button>`;
  } else if (state.modal === 'card') {
    title = 'Card details';
    body = `<p>Payment processing will be connected in the backend phase.</p><button class="primary-button full" data-action="close-modal">Close</button>`;
  } else {
    title = state.modalTitle || 'Information';
    body = `<p>${escapeHtml(state.modalMessage || '')}</p><button class="primary-button full" data-action="close-modal">OK</button>`;
  }
  return `<div class="modal-backdrop" data-action="close-modal"><section class="bottom-sheet" role="dialog" aria-modal="true" aria-label="${title}"><header><button class="icon-button" data-action="close-modal">${icon('close')}</button><h2>${title}</h2><span></span></header><div class="sheet-content">${body}</div></section></div>`;
}
