import { destinations, attractions, experiences, experienceCategories, getFeaturedExperiences, images } from '../experiences/data.js';
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
  return `<div class="tile destination-tile"><a class="tile-link" href="#/results?city=${encodeURIComponent(item.name)}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" /><span class="destination-tile-copy"><strong>${escapeHtml(item.name)}</strong>${item.location ? `<span class="destination-tile-location">${icon('pin', 13)}<span>${escapeHtml(item.location)}</span></span>` : ''}<span class="destination-tile-meta">${item.count ? `<span>${escapeHtml(item.count)}</span>` : ''}${item.rating ? `<span>${icon('star', 13)} ${escapeHtml(item.rating)}</span>` : ''}</span></span></a>${item.imageCredit ? `<a class="tile-image-credit" href="${escapeHtml(item.imageCredit.url)}" target="_blank" rel="noopener noreferrer">Photo: ${escapeHtml(item.imageCredit.label)}</a>` : ''}<button class="destination-share-button" data-action="share-destination" data-kind="destination" data-id="${escapeHtml(item.name)}" aria-label="Share ${escapeHtml(item.name)}">${icon('send', 18)}</button></div>`;
}

function categoryTile(item) {
  return `<div class="category-card"><a class="category-card-link" href="#/results?city=${encodeURIComponent(item.city || 'Lombok')}&category=${encodeURIComponent(item.value)}"><img src="${escapeHtml(item.image)}" alt="" loading="lazy" /><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.description)}</small><em>${item.count} ${item.count === 1 ? 'experience' : 'experiences'}</em></span></a>${item.imageCredit ? `<a class="tile-image-credit category-image-credit" href="${escapeHtml(item.imageCredit.url)}" target="_blank" rel="noopener noreferrer">Photo: ${escapeHtml(item.imageCredit.label)}</a>` : ''}</div>`;
}

function trendingDestinations(posts, recommendations) {
  return destinations.map((item, index) => {
    const name = item.name.toLowerCase();
    const relatedPosts = posts.filter((post) => `${post.location || ''} ${post.caption || ''}`.toLowerCase().includes(name));
    const socialScore = relatedPosts.reduce((score, post) => score + post.likedBy.length + post.comments.length * 2 + Number(post.shareCount || 0) + (post.shares?.length || 0), 0);
    const recommendationScore = recommendations.filter(({ experience }) => experience.city.toLowerCase() === name).length * 5;
    return { item, score: socialScore + relatedPosts.length * 4 + recommendationScore, index };
  }).sort((a, b) => b.score - a.score || a.index - b.index).map(({ item }) => item);
}

export function homeView() {
  const recommendations = getRecommendedExperiences(state, experiences);
  const posts = visibleSocialPosts();
  const communitySignals = new Map(socialBookingSignals(posts).map((signal) => [signal.experienceId, signal]));
  const communityLabel = (item) => { const signal = communitySignals.get(item.id); return signal?.posts ? `Shared by ${signal.posts} traveler${signal.posts === 1 ? '' : 's'} on Vibes` : ''; };
  const topDestinations = trendingDestinations(posts, recommendations);
  return mainLayout(`
    <section class="home-hero">
      <div class="hero-top"><div class="home-greeting"><div class="home-greeting-row"><div><h1>Hi, ${escapeHtml(greetingName())}</h1><p>Where would you like to go today?</p></div><a class="home-profile-link" href="#/profile" aria-label="Open profile"><img class="home-profile-photo" src="${escapeHtml(state.profilePhoto || images.login)}" alt="Profile photo" /></a></div></div><a class="inbox-button" href="#/inbox" aria-label="Inbox">${icon('bell', 21)}${inboxBadge()}</a></div>
      <a href="#/search" class="search-pill">${icon('search', 19)}<span>Find places and things to do</span></a>
    </section>
    <section class="home-ai-planner"><a href="#/trip-planner"><span>${icon('sparkle', 20)}<strong class="ai-gradient-text">Plan a smarter trip</strong><small>Let AI match your interests with bookable experiences</small></span>${icon('chevron', 19)}</a></section>
    <section class="home-section home-categories"><div class="home-section-heading"><div><h2>Explore by category</h2><p>Find experiences across Lombok, Sumbawa, and beyond</p></div>${icon('sparkle', 18)}</div><div class="tile-row category-row">${experienceCategories.map(categoryTile).join('')}</div></section>
    <section class="home-section home-destinations"><div class="home-destinations-heading"><div class="home-destinations-title-row"><h2>Top destinations</h2><a href="#/search">See all</a></div><span>${icon('sparkle', 14)} Trending on Vibes</span></div><div class="tile-row" data-home-destination-carousel>${topDestinations.map(destinationTile).join('')}</div></section>
    <section class="home-section"><h2>Attractions you can't miss</h2><div class="tile-row attraction-row">${attractions.map((item) => horizontalTile(item, item.experienceId ? '/experience/' + encodeURIComponent(item.experienceId) : item.name === 'Mount Rinjani' ? '/experience/arena' : '/results?city=' + encodeURIComponent(item.city))).join('')}</div></section>
    ${recommendations.length ? `<section class="home-section recommendation-section"><h2>Picked for you</h2><div class="feature-grid">${recommendations.map(({ experience, reason }) => experienceCard({ ...experience, recommendationReason: reason, communityReason: communityLabel(experience) }, 'grid')).join('')}</div></section>` : ''}
    <section class="home-section last"><h2>Go beyond the guidebook</h2><div class="feature-grid">${getFeaturedExperiences().map((item) => experienceCard({ ...item, communityReason: communityLabel(item) }, 'grid')).join('')}</div></section>
  `, 'Discover', { className: 'home-page' });
}
