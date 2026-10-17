import { icon } from './icons.js';
import { chatBadge } from '../features/inbox/repository.js';
export function bottomNavigation(active = 'Discover') {
  const items = [['Discover', '/', 'home'], ['Bookings', '/bookings', 'calendar'], ['Vibes', '/social', 'community'], ['Chat', '/chat', 'comment'], ['Profile', '/profile', 'user']];
  const current = active === 'Community' ? 'Vibes' : active;
  return `<nav class="bottom-nav" aria-label="Main navigation">
    <svg class="bottom-nav-wave" viewBox="0 0 560 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs><linearGradient id="bottom-nav-gradient" x1="0" y1="0" x2="1" y2="0.35"><stop stop-color="var(--brand-gradient-start)"/><stop offset="0.62" stop-color="var(--brand-gradient-middle)"/><stop offset="1" stop-color="var(--brand-gradient-end)"/></linearGradient></defs>
      <path fill="url(#bottom-nav-gradient)" d="M185 43C310-8 439-9 560 38C446 83 321 83 185 43Z"/>
      <path fill="#fff" d="M0 48C107 9 177 27 280 56C383 85 461 70 560 38V80H0Z"/>
    </svg>
    <a class="bottom-nav-ai" href="#/trip-planner">${icon('robot', 25)}<span>Plan trip with AI</span></a>
    <div class="bottom-nav-items">${items.map(([label, path, glyph]) =>
      `<a class="nav-item ${current === label ? 'active' : ''}" href="#${path}" aria-label="${label}" ${current === label ? 'aria-current="page"' : ''}><span class="nav-icon">${icon(glyph, 26)}${label === 'Chat' ? chatBadge() : ''}</span><span class="nav-label">${label}</span></a>`).join('')}</div>
  </nav>`;
}
