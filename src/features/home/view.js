import { destinations, attractions, getFeaturedExperiences } from '../experiences/data.js';
import { horizontalTile, experienceCard } from '../../components/cards.js';
import { icon } from '../../components/icons.js';
import { mainLayout } from '../../layouts/MainLayout.js';
export function homeView() {
  return mainLayout(`
    <section class="home-hero">
      <div class="hero-top"><h1>Experiences worth<br/>traveling for</h1><a class="inbox-button" href="#/inbox" aria-label="Inbox">${icon('inbox', 21)}<span class="notification-dot">1</span></a></div>
      <a href="#/search" class="search-pill">${icon('search', 19)}<span>Find places and things to do</span></a>
    </section>
    <section class="home-section"><h2>Top destinations</h2><div class="tile-row">${destinations.map((item) => horizontalTile(item, '/results?city=' + encodeURIComponent(item.name))).join('')}</div></section>
    <section class="home-section"><h2>Attractions you can't miss</h2><div class="tile-row attraction-row">${attractions.map((item) => horizontalTile(item, '/results?city=' + encodeURIComponent(item.city))).join('')}</div></section>
    <section class="home-section last"><h2>Go beyond the guidebook</h2><div class="feature-grid">${getFeaturedExperiences().map((item) => experienceCard(item, 'grid')).join('')}</div></section>
  `, 'Discover', { className: 'home-page' });
}
