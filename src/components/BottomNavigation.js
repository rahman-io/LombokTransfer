import { icon } from './icons.js';
export function bottomNavigation(active = 'Discover') {
  const items = [['Discover', '/', 'search'], ['Wishlist', '/wishlist', 'heart'], ['Community', '/social', 'community'], ['Bookings', '/bookings', 'tickets'], ['Profile', '/profile', 'user']];
  return `<nav class="bottom-nav" aria-label="Main navigation">${items.map(([label, path, glyph]) =>
    `<a class="nav-item ${active === label ? 'active' : ''}" href="#${path}" aria-label="${label}" ${active === label ? 'aria-current="page"' : ''}>${icon(glyph, 25)}<span>${label}</span></a>`).join('')}</nav>`;
}
