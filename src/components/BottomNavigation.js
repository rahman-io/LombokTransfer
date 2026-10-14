import { icon } from './icons.js';
export function bottomNavigation(active = 'Discover') {
  const items = [['Discover', '/', 'search'], ['Vibes', '/social', 'community'], ['Bookings', '/bookings', 'tickets'], ['Profile', '/profile', 'user']];
  const current = active === 'Community' ? 'Vibes' : active;
  return `<nav class="bottom-nav" aria-label="Main navigation">${items.map(([label, path, glyph]) =>
    `<a class="nav-item ${current === label ? 'active' : ''}" href="#${path}" aria-label="${label}" ${current === label ? 'aria-current="page"' : ''}>${icon(glyph, 25)}<span>${label}</span></a>`).join('')}</nav>`;
}
