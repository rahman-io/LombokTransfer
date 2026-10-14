import { getExperience, getExperienceGallery, experiences, images } from '../experiences/data.js';
import { state } from '../../app/store.js';
import { icon } from '../../components/icons.js';
import { mainLayout } from '../../layouts/MainLayout.js';
import { experienceCard } from '../../components/cards.js';
import { escapeHtml } from '../../utils/html.js';
export function experienceView(id) {
  const item = getExperience(id);
  const saved = state.wishlist.includes(item.id);
  const sameCity = experiences.filter((other) => other.id !== item.id && other.city === item.city);
  const similar = (sameCity.length ? sameCity : experiences.filter((other) => other.id !== item.id)).slice(0, 3);
  const photos = getExperienceGallery(item);
  const cancellation = item.cancellation || { title: 'Free cancellation', text: 'Cancel up to 24 hours in advance for a full refund' };
  const detail = `
    <div class="detail-top">
      <div class="detail-gallery"><div class="detail-gallery-track" data-gallery-track aria-label="Activity photos" tabindex="0">${photos.map((source, index) => `<img class="detail-main-image" src="${escapeHtml(source)}" alt="${escapeHtml(item.title)} — photo ${index + 1} of ${photos.length}" data-action="gallery" data-id="${escapeHtml(item.id)}" data-index="${index}" ${index ? 'loading="lazy"' : ''} draggable="false" />`).join('')}</div>
        <div class="detail-top-actions"><button class="round-white" data-action="back" aria-label="Back">${icon('arrow')}</button><span><button class="round-white ${saved ? 'saved' : ''}" data-action="heart" data-id="${escapeHtml(item.id)}" aria-label="Wishlist">${icon('heart')}</button><button class="round-white" data-action="share" aria-label="Share">${icon('share')}</button></span></div>
      </div>
      ${photos.length > 1 ? `<div class="gallery-thumbs">${photos.slice(1).map((source, index) => `<button class="gallery-thumb" data-action="gallery-select" data-index="${index + 1}" aria-label="Show photo ${index + 2}"><img src="${escapeHtml(source)}" alt="" loading="lazy" /></button>`).join('')}<div class="gallery-count" role="group" aria-label="Choose photo">${photos.map((_, index) => `<button class="gallery-dot ${index === 0 ? 'active' : ''}" data-gallery-dot data-action="gallery-select" data-index="${index}" aria-label="Photo ${index + 1} of ${photos.length}" aria-current="${index === 0}"></button>`).join('')}</div></div>` : ''}
    </div>
    <div class="detail-body">
      <h1>${escapeHtml(item.title)}</h1>
      <div class="detail-rating">${item.badge ? `<span class="red-badge">${escapeHtml(item.badge)}</span>` : ''}<span class="star-large">★</span> ${escapeHtml(item.rating)} <button data-action="reviews">${escapeHtml(item.reviews)} reviews</button></div>
      <p class="detail-intro">${escapeHtml(item.description)}</p>
      ${item.lovedByEnglishSpeakers ? `<div class="loved-card"><span>🏆</span><div><strong>Loved by English speakers</strong><small>91% of English-speaking travelers gave this activity a perfect score</small></div></div>` : ''}
      <div class="detail-facts">
        <div>${icon('calendar', 27)}<span><strong>${escapeHtml(cancellation.title)}</strong><small>${escapeHtml(cancellation.text)}</small></span></div>
        <div>${icon('clock', 27)}<span><strong>${escapeHtml(item.validity || 'Duration ' + item.duration)}</strong><small>Check availability to see starting times</small></span></div>
        <div>${icon('tickets', 27)}<span><strong>Reserve now & pay later</strong><small>Keep your travel plans flexible</small></span></div>
      </div>
      <section class="detail-section"><h2>What travelers loved ${icon('info', 18)}</h2><div class="review-card"><div class="review-stars">★★★★★</div><strong>Kristy - United Kingdom</strong><small>October 3, 2026 · Verified booking</small><p>${escapeHtml(item.featuredReview || 'An unforgettable experience with a wonderful guide. Everything was well organized and the views were amazing.')}</p></div><button class="outline-button" data-action="reviews">See more reviews</button></section>
      <section class="detail-section"><h2>Highlights</h2><ul class="bullet-list">${item.highlights.map((text) => `<li>${escapeHtml(text)}</li>`).join('')}</ul></section>
      <section class="detail-section"><h2>Full description</h2><p>${escapeHtml(item.description)}</p></section>
      <section class="detail-section"><h2>Includes</h2><ul class="check-list">${(item.includes || ['Experience as described', 'Booking confirmation']).map((entry) => `<li>${icon('check', 19)} ${escapeHtml(entry)}</li>`).join('')}</ul></section>
      <section class="detail-section"><h2>Meeting point</h2><div class="meeting-map" style="background-image:url('${images.mapCore}')"><span>${icon('pin', 24)}</span></div><p>Meeting point details will be shown with your booking confirmation.</p></section>
      <section class="detail-section"><h2>Important information</h2><h3>What to bring</h3><ul class="bullet-list">${(item.whatToBring || ['Comfortable shoes', 'Passport or ID card']).map((entry) => `<li>${escapeHtml(entry)}</li>`).join('')}</ul><h3>Not allowed</h3><ul class="bullet-list"><li>Large bags or luggage</li></ul><h3>Know before you go</h3><p>Please check the activity details and arrival instructions before your visit.</p></section>
      <section class="detail-section"><h2>Customer reviews</h2><div class="rating-summary"><strong>${escapeHtml(item.rating)}</strong><span>★★★★★<small>Based on ${escapeHtml(item.reviews)} reviews</small></span></div><div class="review-card"><div class="review-stars">★★★★★</div><strong>Verified traveler</strong><small>Verified booking</small><p>Fantastic experience and a wonderful way to discover ${escapeHtml(item.city)}.</p></div><button class="outline-button" data-action="reviews">See all reviews</button></section>
      <section class="detail-section"><h2>${sameCity.length ? `Discover more for ${escapeHtml(item.city)}` : 'Discover more experiences'}</h2><div class="related-list">${similar.map((other) => experienceCard(other)).join('')}</div></section>
    </div>`;
  const footer = `<div class="detail-cta"><div><small>From</small><strong>$${escapeHtml(item.price)}</strong><small> per person</small></div><a class="primary-button" href="#/booking/${encodeURIComponent(item.id)}">Check availability</a></div>`;
  return mainLayout(detail, 'Discover', { className: 'detail-page', footer });
}
