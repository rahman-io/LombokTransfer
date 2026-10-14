import { icon } from './icons.js';
import { state } from '../app/store.js';
import { escapeHtml } from '../utils/html.js';
export function experienceCard(item, type = 'list') {
  const saved = state.wishlist.includes(item.id);
  const id = encodeURIComponent(item.id);
  return `<article class="experience-card ${type}">
    <a class="card-link" href="#/experience/${id}" aria-label="${escapeHtml(item.title)}"></a>
    <img src="${escapeHtml(item.cardImage || item.image)}" alt="" loading="lazy" />
    <div class="card-copy">
      <div class="eyebrow">${escapeHtml(item.city.toUpperCase())} · ${escapeHtml(item.duration.toUpperCase())}</div>
      <h3>${escapeHtml(item.title)}</h3>
      ${type === 'list' ? `<div class="card-feature">${item.badge ? `<span class="card-badge">${escapeHtml(item.badge)}</span>` : ''} ${escapeHtml(item.label)}</div>` : `<p class="card-duration">${escapeHtml(item.duration)}</p>`}
      <div class="card-bottom"><span><b>${escapeHtml(item.rating)} ★</b> <span class="muted">(${escapeHtml(item.reviews)})</span></span><span class="price"><small>From ${item.oldPrice ? `<s>$${escapeHtml(item.oldPrice)}</s>` : ''}</small> <b>$${escapeHtml(item.price)}</b></span></div>
    </div>
    <button class="heart-button ${saved ? 'saved' : ''}" data-action="heart" data-id="${escapeHtml(item.id)}" aria-label="${saved ? 'Remove from wishlist' : 'Save to wishlist'}">${icon('heart', 25)}</button>
  </article>`;
}
export function horizontalTile(item, route) {
  return `<a class="tile" href="#${escapeHtml(route)}"><img src="${escapeHtml(item.image)}" alt="" loading="lazy" /><strong>${escapeHtml(item.name)}</strong>${item.count ? `<small>${escapeHtml(item.count)}</small>` : ''}</a>`;
}
