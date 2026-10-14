import { destinations, attractions, experiences, getFeaturedExperiences, images } from '../experiences/data.js';
import { horizontalTile, experienceCard } from '../../components/cards.js';
import { icon } from '../../components/icons.js';
import { mainLayout } from '../../layouts/MainLayout.js';
import { state } from '../../app/store.js';
import { escapeHtml } from '../../utils/html.js';
import { getRecommendedExperiences } from '../recommendations/repository.js';
import { visibleSocialPosts } from '../social/repository.js';
import { socialBookingSignals } from '../social/intelligence.js';
import { inboxBadge } from '../inbox/repository.js';

function greetingName() {
  return state.guestName.startsWith('A ') ? state.guestName.slice(2) : state.guestName.split(' ')[0];
}

function destinationTile(item) {
  return `<div class="tile destination-tile"><a class="tile-link" href="#/results?city=${encodeURIComponent(item.name)}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" /><span class="destination-tile-copy"><strong>${escapeHtml(item.name)}</strong>${item.count ? `<small>${escapeHtml(item.count)}</small>` : ''}</span></a><button class="destination-share-button" data-action="share-destination" data-kind="destination" data-id="${escapeHtml(item.name)}" aria-label="Share ${escapeHtml(item.name)}">${icon('share', 18)}</button></div>`;
}

export function homeView() {
  const recommendations = getRecommendedExperiences(state, experiences);
  const communitySignals = new Map(socialBookingSignals(visibleSocialPosts()).map((signal) => [signal.experienceId, signal]));
  const communityLabel = (item) => { const signal = communitySignals.get(item.id); return signal?.posts ? `Shared by ${signal.posts} traveler${signal.posts === 1 ? '' : 's'} on Vibes` : ''; };
  return mainLayout(`
    <section class="home-hero">
      <div class="hero-top"><div class="home-greeting"><div class="home-greeting-row"><div><h1>Hi, ${escapeHtml(greetingName())}</h1><p>Where would you like to go today?</p></div><a class="home-profile-link" href="#/profile" aria-label="Open profile"><img class="home-profile-photo" src="${escapeHtml(images.login)}" alt="Profile photo" /></a></div></div><a class="inbox-button" href="#/inbox" aria-label="Inbox">${icon('bell', 21)}${inboxBadge()}</a></div>
      <a href="#/search" class="search-pill">${icon('search', 19)}<span>Find places and things to do</span></a>
    </section>
    <section class="home-ai-planner"><a href="#/trip-planner"><span>${icon('sparkle', 20)}<strong class="ai-gradient-text">Plan a smarter trip</strong><small>Let AI match your interests with bookable experiences</small></span>${icon('chevron', 19)}</a></section>
    <section class="home-section home-destinations"><h2>Top destinations</h2><div class="tile-row">${destinations.map(destinationTile).join('')}</div></section>
    <section class="home-section"><h2>Attractions you can't miss</h2><div class="tile-row attraction-row">${attractions.map((item) => horizontalTile(item, '/results?city=' + encodeURIComponent(item.city))).join('')}</div></section>
    ${recommendations.length ? `<section class="home-section recommendation-section"><h2>Picked for you</h2><div class="feature-grid">${recommendations.map(({ experience, reason }) => experienceCard({ ...experience, recommendationReason: reason, communityReason: communityLabel(experience) }, 'grid')).join('')}</div></section>` : ''}
    <section class="home-section last"><h2>Go beyond the guidebook</h2><div class="feature-grid">${getFeaturedExperiences().map((item) => experienceCard({ ...item, communityReason: communityLabel(item) }, 'grid')).join('')}</div></section>
  `, 'Discover', { className: 'home-page' });
}
