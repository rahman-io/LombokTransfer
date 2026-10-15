import { getExperience, getExperienceGallery, experiences, images } from '../experiences/data.js';
import { state } from '../../app/store.js';
import { icon } from '../../components/icons.js';
import { mainLayout } from '../../layouts/MainLayout.js';
import { experienceCard } from '../../components/cards.js';
import { escapeHtml } from '../../utils/html.js';
import { calculateDemoQuote, formatDemoPrice, formatListedPrice, getDemoBooking } from '../experiences/booking-demo.js';
import { toExperienceDocument } from '../experiences/firebase-documents.js';
import { getDemoReviews } from '../experiences/demo-engagement.js';
import { socialImage } from '../social/media.js';
import { socialPostsForExperience, socialUser, visibleSocialPosts } from '../social/repository.js';
import { socialBookingSignals } from '../social/intelligence.js';
import { getBookingLikelihood, getPriceAvailabilityAlerts, getSmartBundle } from '../booking-intelligence/repository.js';
import { getSmartReviewIntelligence } from '../travel-intelligence/repository.js';
export function experienceView(id) {
  const item = getExperience(id);
  const saved = state.wishlist.includes(item.id);
  const sameCity = experiences.filter((other) => other.id !== item.id && other.city === item.city);
  const similar = (sameCity.length ? sameCity : experiences.filter((other) => other.id !== item.id)).slice(0, 3);
  const photos = getExperienceGallery(item);
  const booking = getDemoBooking(item);
  const document = toExperienceDocument(item, booking);
  const cancellation = document.cancellation;
  const reviews = getDemoReviews(item);
  const communityPosts = socialPostsForExperience(item.id).slice(0, 2);
  const communitySignal = socialBookingSignals(visibleSocialPosts()).find((signal) => signal.experienceId === item.id);
  const dateText = state.date ? new Date(state.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select date';
  const quote = calculateDemoQuote(item, state);
  const bookingLikelihood = getBookingLikelihood(item, state);
  const smartBundle = getSmartBundle(item, experiences, state);
  const bookingAlerts = getPriceAvailabilityAlerts(item, booking);
  const reviewIntelligence = getSmartReviewIntelligence(item, reviews.featured);
  const joined = state.joinedExperiences.includes(item.id);
  const travelerCount = Number(booking?.travelersBooked || 0) + (joined ? 1 : 0);
  const travelerStack = joined ? [{ initials: 'AR', color: '#234e70' }, ...(booking?.bookedTravelers || [])] : (booking?.bookedTravelers || []);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const detail = `
    <header class="detail-sticky-header" data-detail-sticky-header>
      <button class="icon-button" data-action="back" aria-label="Back">${icon('arrow')}</button>
      <strong title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</strong>
      <button class="icon-button ${saved ? 'saved' : ''}" data-action="heart" data-id="${escapeHtml(item.id)}" aria-label="Wishlist">${icon('heart')}</button>
      <button class="icon-button" data-action="share" aria-label="Share">${icon('share')}</button>
    </header>
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
      ${booking?.travelersBooked ? `<section class="detail-booking-social-proof"><div class="detail-traveler-stack">${travelerStack.slice(0, 5).map((traveler) => `<span class="detail-traveler-avatar" style="--avatar-color:${escapeHtml(traveler.color)}">${escapeHtml(traveler.initials)}</span>`).join('')}</div><strong>${travelerCount} traveler${travelerCount === 1 ? '' : 's'} booked</strong><button class="detail-join-button ${joined ? 'joined' : ''}" data-action="join-travelers" data-id="${escapeHtml(item.id)}" aria-pressed="${joined}">${joined ? 'Joined' : 'Join'}</button>${joined && state.travelerGroupThreads[item.id] ? `<div class="detail-group-actions"><a href="#/inbox/chat/${escapeHtml(state.travelerGroupThreads[item.id])}">${icon('comment', 15)} Open traveler group</a><button data-action="show-availability">${icon('calendar', 15)} Choose date & book</button></div>` : ''}</section>` : ''}
      ${communitySignal ? `<a class="detail-social-proof" href="#/social/explore?topic=${encodeURIComponent(communitySignal.topics[0] || item.city.toLowerCase())}">${icon('sparkle', 17)} Shared by ${communitySignal.posts} traveler${communitySignal.posts === 1 ? '' : 's'} on Vibes · See why it is trending</a>` : ''}
      <a class="detail-community-link" href="#/social/create?experience=${encodeURIComponent(item.id)}">${icon('community', 18)} Recommend this on Vibes</a>
      ${item.lovedByEnglishSpeakers ? `<div class="loved-card"><span>🏆</span><div><strong>Loved by English speakers</strong><small>91% of English-speaking travelers gave this activity a perfect score</small></div></div>` : ''}
      <div class="detail-facts">
        <div>${icon('calendar', 27)}<span><strong>${escapeHtml(cancellation.title)}</strong><small>${escapeHtml(cancellation.text)}</small></span></div>
        <div>${icon('clock', 27)}<span><strong>${escapeHtml(item.validity || 'Duration ' + item.duration)}</strong><small>Check availability to see starting times</small></span></div>
        <div>${icon('tickets', 27)}<span><strong>Reserve now & pay later</strong><small>Keep your travel plans flexible</small></span></div>
        ${item.location ? `<div>${icon('pin', 27)}<span><strong>Location</strong><small>${escapeHtml(item.location)}</small></span></div>` : ''}
        ${item.openingHours ? `<div>${icon('clock', 27)}<span><strong>Opening hours</strong><small>${escapeHtml(item.openingHours)}</small></span></div>` : ''}
      </div>
      <section class="booking-intelligence"><div class="booking-intelligence-heading"><span>${icon('sparkle', 16)} Smart travel signals</span><small>Local AI demo</small></div><div class="booking-intelligence-grid"><article class="booking-signal-card"><small>Booking likelihood</small><strong>${bookingLikelihood.score}%</strong><b>${escapeHtml(bookingLikelihood.label)}</b><p>${escapeHtml(bookingLikelihood.timing)}</p><em>${escapeHtml(bookingLikelihood.reason)}</em></article><article class="booking-signal-card"><small>Price & availability alerts</small>${bookingAlerts.slice(0, 2).map((alert) => `<div class="booking-alert"><strong>${escapeHtml(alert.title)}</strong><p>${escapeHtml(alert.text)}</p></div>`).join('')}</article></div>${smartBundle.items.length ? `<article class="smart-bundle"><div><small>Smart bundle</small><strong>Smart bundle suggestions</strong><p>${escapeHtml(smartBundle.reason)} · Save about $${smartBundle.savings}</p></div><div class="smart-bundle-items">${smartBundle.items.map((bundleItem) => `<a href="#/experience/${escapeHtml(bundleItem.id)}"><img src="${escapeHtml(bundleItem.image)}" alt="" /><span>${escapeHtml(bundleItem.title)}</span></a>`).join('')}</div></article>` : ''}</section>
      <section class="detail-section"><h2>What travelers loved ${icon('info', 18)}</h2><div class="review-card"><div class="review-stars">★★★★★</div><strong>${escapeHtml(reviews.featured.author)} - ${escapeHtml(reviews.featured.country)}</strong><small>${escapeHtml(reviews.featured.dateLabel)} · Verified booking</small><p>${escapeHtml(reviews.featured.text)}</p></div><button class="outline-button" data-action="reviews">See more reviews</button></section>
      ${booking?.popularDays?.length ? `<section class="popular-days" aria-label="Most popular days"><h2>Most popular days <small>Demo data</small></h2><div class="popular-days-row">${dayNames.map((name, day) => `<span class="popular-day ${booking.popularDays.includes(day) ? 'active' : ''}" aria-label="${name}${booking.popularDays.includes(day) ? ', popular' : ''}">${name}</span>`).join('')}</div></section>` : ''}
      <details class="detail-section detail-accordion" data-detail-section="highlights" open><summary><h2>Highlights</h2>${icon('down')}</summary><ul class="bullet-list">${document.content.highlights.map((text) => `<li>${escapeHtml(text)}</li>`).join('')}</ul></details>
      <details class="detail-section detail-accordion" data-detail-section="description"><summary><h2>Full description</h2>${icon('down')}</summary><p>${escapeHtml(document.content.fullDescription)}</p></details>
      <details class="detail-section detail-accordion" data-detail-section="includes"><summary><h2>Includes</h2>${icon('down')}</summary><ul class="check-list">${document.content.includes.map((entry) => `<li>${icon('check', 19)} ${escapeHtml(entry)}</li>`).join('')}</ul></details>
      <section class="detail-availability" id="detail-availability"><div class="booking-selector"><h2>Select participants and date</h2>
        <button data-action="participants">${icon('user', 22)} Adult x${state.adults}${state.children ? `, Child x${state.children}` : ''}${icon('down', 20)}</button>
        <button data-action="open-dates">${icon('calendar', 22)} ${dateText}${icon('down', 20)}</button>
        <div class="demo-price-preview"><span>Estimated total <small>Demo price</small></span><strong>${formatDemoPrice(quote.total)}</strong><small>${state.adults} adult × ${formatDemoPrice(quote.adultPrice)}${state.children ? ` · ${state.children} child × ${formatDemoPrice(quote.childPrice)}` : ''}${state.date ? '' : ' · Choose a date for the dated price'}</small></div>
        <button class="primary-button full" data-action="check-availability">Check availability</button>
      </div>${state.availabilityChecked && state.date ? `<div class="detail-availability-results" id="detail-availability-results"><h2>1 option available</h2><article class="option-card"><h3>${escapeHtml(item.title)}</h3><div class="option-fact">${icon('clock', 21)} Duration: ${escapeHtml(item.duration)}</div><div class="option-fact">${icon('calendar', 21)} ${dateText}</div><hr /><h3>Starting time</h3>${booking.timeOptions.map((time) => `<button class="time-button ${state.selectedTime === time ? 'active' : ''}" data-action="select-time" data-value="${escapeHtml(time)}">${escapeHtml(time)}</button>`).join('')}<hr /><strong class="option-price">${formatDemoPrice(quote.total)}</strong><small>${state.adults} adult × ${formatDemoPrice(quote.adultPrice)}${state.children ? `<br/>${state.children} child × ${formatDemoPrice(quote.childPrice)}` : ''}<br/>Demo price · All taxes and fees included</small><a class="primary-button full" href="#/checkout/${encodeURIComponent(item.id)}">Continue</a></article></div>` : ''}</section>
      <details class="detail-section detail-accordion" data-detail-section="meeting"><summary><h2>Meeting point</h2>${icon('down')}</summary><div class="meeting-map" style="background-image:url('${images.mapCore}')"><span>${icon('pin', 24)}</span></div><p>${escapeHtml(document.meetingPoint.description)}</p></details>
      <details class="detail-section detail-accordion" data-detail-section="important" open><summary><h2>Important information</h2>${icon('down')}</summary><h3>What to bring</h3><ul class="bullet-list">${document.content.whatToBring.map((entry) => `<li>${escapeHtml(entry)}</li>`).join('')}</ul><h3>Not allowed</h3><ul class="bullet-list">${document.content.notAllowed.map((entry) => `<li>${escapeHtml(entry)}</li>`).join('')}</ul><h3>Know before you go</h3><p>${escapeHtml(document.content.knowBeforeYouGo)}</p></details>
      <section class="detail-section"><h2>Customer reviews</h2><div class="rating-summary"><strong>${escapeHtml(item.rating)}</strong><span>★★★★★<small>Based on ${escapeHtml(item.reviews)} reviews</small></span></div><div class="review-card"><div class="review-stars">★★★★★</div><strong>${escapeHtml(reviews.summary.author)}</strong><small>Verified booking</small><p>${escapeHtml(reviews.summary.text)}</p></div><button class="outline-button" data-action="reviews">See all reviews</button><div class="smart-review-card"><div><span>${icon('sparkle', 15)} Smart review intelligence</span><small>${reviewIntelligence.quality}% helpfulness potential</small></div><p>${escapeHtml(reviewIntelligence.tone)}</p><div>${reviewIntelligence.prompts.slice(0, 2).map((prompt) => `<span>${escapeHtml(prompt)}</span>`).join('')}</div></div></section>
      ${communityPosts.length ? `<section class="detail-community-section"><div class="detail-community-heading"><h2>Travelers shared this</h2><a href="#/social/create?experience=${encodeURIComponent(item.id)}">Share yours</a></div><div class="detail-community-posts">${communityPosts.map((post) => { const author = socialUser(post.authorId); return `<a class="detail-community-post" href="#/social/post/${escapeHtml(post.id)}"><img src="${escapeHtml(socialImage(post))}" alt="" loading="lazy" /><span><strong>@${escapeHtml(author?.username || 'traveler')}</strong><small>${post.likedBy.length} likes · ${post.comments.length} comments</small><p>${escapeHtml(post.caption || 'Shared a travel moment')}</p></span></a>`; }).join('')}</div></section>` : ''}
      <section class="detail-section"><h2>${sameCity.length ? `Discover more for ${escapeHtml(item.city)}` : 'Discover more experiences'}</h2><div class="related-list">${similar.map((other) => experienceCard(other)).join('')}</div></section>
    </div>`;
  const footer = `<div class="detail-cta"><div><small>From</small><strong>${escapeHtml(formatListedPrice(item))}</strong><small>${escapeHtml(item.priceNote || 'per person')}</small></div><button class="primary-button" data-action="show-availability">Check availability</button></div>`;
  return mainLayout(detail, 'Discover', { className: 'detail-page', footer });
}
