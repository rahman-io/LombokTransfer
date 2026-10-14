import { state } from '../../app/store.js';
import { mainLayout } from '../../layouts/MainLayout.js';
import { header } from '../../components/Header.js';
import { icon } from '../../components/icons.js';
import { escapeHtml } from '../../utils/html.js';
const groups = [
  ['Settings', [['Personal details', 'personal'], ['Saved cards', 'cards'], ['Currency', 'currency'], ['Language', 'language'], ['Appearance', 'appearance'], ['Notifications', 'notifications']]],
  ['Support', [['About GetYourGuide', 'about'], ['Chat with us', 'chat'], ['Help center', 'help']]],
];
export function profileView() {
  const greetingName = state.guestName.startsWith('A ') ? state.guestName.slice(2) : state.guestName.split(' ')[0];
  return mainLayout(`
    <div class="page-pad profile-page"><div class="profile-user"><h1>👋 Hi ${escapeHtml(greetingName.toLowerCase())}</h1><p>${escapeHtml(state.email)}</p></div>
      <a class="profile-link promo-link" href="#/profile/promos">${icon('tickets', 22)}<span>Your promos</span>${icon('chevron', 20)}</a>
      <a class="profile-link wishlist-profile-link" href="#/wishlist">${icon('heart', 22)}<span>Wishlist</span>${icon('chevron', 20)}</a>
      ${groups.map(([heading, rows]) => `<section class="profile-group"><h2>${heading}</h2>${rows.map(([label, route]) => `<a class="profile-link" href="#/profile/${route}"><span>${label}</span><small>${route === 'currency' ? state.currency : route === 'language' ? state.language : route === 'appearance' ? 'System default' : ''}</small>${icon('chevron', 19)}</a>`).join('')}</section>`).join('')}
      <button class="text-link" data-action="sign-out">Log out</button>
    </div>
  `, 'Profile');
}
export function profileSectionView(section) {
  const titles = { personal: 'Personal details', cards: 'Saved cards', currency: 'Currency', language: 'Language', appearance: 'Appearance', notifications: 'Notifications', about: 'About GetYourGuide', chat: 'Chat with us', help: 'Help center', promos: 'Your promos' };
  const title = titles[section] || 'Settings';
  let body = '';
  if (section === 'personal') body = `<label class="form-label">Name<input id="profile-name" value="${escapeHtml(state.guestName)}" /></label><label class="form-label">Email address<input id="profile-email" type="email" value="${escapeHtml(state.email)}" /></label><button class="primary-button full" data-action="save-profile">Save changes</button>`;
  else if (section === 'currency') body = ['USD ($)', 'EUR (€)', 'PLN (zł)', 'GBP (£)'].map((value) => `<button class="choice-row ${state.currency === value ? 'active' : ''}" data-action="set-currency" data-value="${value}">${value}${state.currency === value ? icon('check') : ''}</button>`).join('');
  else if (section === 'language') body = ['English', 'Bahasa Indonesia', 'Polski', 'Français'].map((value) => `<button class="choice-row ${state.language === value ? 'active' : ''}" data-action="set-language" data-value="${value}">${value}${state.language === value ? icon('check') : ''}</button>`).join('');
  else if (section === 'cards') body = `<div class="empty-state">${icon('credit', 48)}<h2>No saved cards</h2><p>Cards used at checkout will appear here.</p></div>`;
  else if (section === 'promos') body = `<div class="empty-state">${icon('tickets', 48)}<h2>No promos yet</h2><p>Your offers will appear here.</p></div>`;
  else body = `<div class="empty-state">${icon('info', 45)}<h2>${title}</h2><p>Manage your ${title.toLowerCase()} here.</p></div>`;
  return mainLayout(`${header(title)}<div class="page-pad settings-content">${body}</div>`, 'Profile');
}
