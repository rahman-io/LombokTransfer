import { destinations, attractions, experiences, getFeaturedExperiences } from '../experiences/data.js';
import { horizontalTile, experienceCard } from '../../components/cards.js';
import { icon } from '../../components/icons.js';
import { mainLayout } from '../../layouts/MainLayout.js';
import { demoMessages } from '../experiences/demo-engagement.js';
import { state } from '../../app/store.js';
import { getRecommendedExperiences } from '../recommendations/repository.js';
import { visibleSocialPosts } from '../social/repository.js';
import { socialBookingSignals } from '../social/intelligence.js';
export function homeView() {
  const unreadCount = demoMessages.filter((message) => !message.read).length;
  const recommendations = getRecommendedExperiences(state, experiences);
  const communitySignals = new Map(socialBookingSignals(visibleSocialPosts()).map((signal) => [signal.experienceId, signal]));
  const communityLabel = (item) => { const signal = communitySignals.get(item.id); return signal?.posts ? `Shared by ${signal.posts} traveler${signal.posts === 1 ? '' : 's'} on Vibes` : ''; };
  return mainLayout(`
    <section class="home-hero">
      <div class="hero-top"><h1>Experiences worth<br/>traveling for</h1><a class="inbox-button" href="#/inbox" aria-label="Inbox">${icon('inbox', 21)}${unreadCount ? `<span class="notification-dot">${unreadCount}</span>` : ''}</a></div>
      <a href="#/search" class="search-pill">${icon('search', 19)}<span>Find places and things to do</span></a>
    </section>
    <section class="home-ai-planner"><a href="#/trip-planner"><span>${icon('sparkle', 20)}<strong>Plan a smarter trip</strong><small>Let AI match your interests with bookable experiences</small></span>${icon('chevron', 19)}</a></section>
    <section class="home-section"><h2>Top destinations</h2><div class="tile-row">${destinations.map((item) => horizontalTile(item, '/results?city=' + encodeURIComponent(item.name))).join('')}</div></section>
    <section class="home-section"><h2>Attractions you can't miss</h2><div class="tile-row attraction-row">${attractions.map((item) => horizontalTile(item, '/results?city=' + encodeURIComponent(item.city))).join('')}</div></section>
    ${recommendations.length ? `<section class="home-section recommendation-section"><h2>Picked for you</h2><div class="feature-grid">${recommendations.map(({ experience, reason }) => experienceCard({ ...experience, recommendationReason: reason, communityReason: communityLabel(experience) }, 'grid')).join('')}</div></section>` : ''}
    <section class="home-section last"><h2>Go beyond the guidebook</h2><div class="feature-grid">${getFeaturedExperiences().map((item) => experienceCard({ ...item, communityReason: communityLabel(item) }, 'grid')).join('')}</div></section>
  `, 'Discover', { className: 'home-page' });
}
