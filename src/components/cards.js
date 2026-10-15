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
      ${item.recommendationReason ? `<div class="recommendation-reason">${escapeHtml(item.recommendationReason)}</div>` : ''}
      ${item.communityReason ? `<div class="community-reason">${escapeHtml(item.communityReason)}</div>` : ''}
      <div class="card-bottom"><span><b>${escapeHtml(item.rating)} ★</b> <span class="muted">(${escapeHtml(item.reviews)})</span></span><span class="price"><small>From ${item.oldPrice ? `<s>$${escapeHtml(item.oldPrice)}</s>` : ''}</small> <b>$${escapeHtml(item.price)}</b></span></div>
    </div>
    <button class="heart-button ${saved ? 'saved' : ''}" data-action="heart" data-id="${escapeHtml(item.id)}" aria-label="${saved ? 'Remove from wishlist' : 'Save to wishlist'}">${icon('heart', 22)}</button>
  </article>`;
}
export function horizontalTile(item, route, kind = 'attraction') {
  return `<div class="tile place-tile"><a class="tile-link" href="#${escapeHtml(route)}"><img src="${escapeHtml(item.image)}" alt="" loading="lazy" /><strong>${escapeHtml(item.name)}</strong>${item.count ? `<small>${escapeHtml(item.count)}</small>` : ''}</a><button class="place-share-button" data-action="share-destination" data-kind="${escapeHtml(kind)}" data-id="${escapeHtml(item.name)}" aria-label="Share ${escapeHtml(item.name)}">${icon('send', 18)}</button></div>`;
}
