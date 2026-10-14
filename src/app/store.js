import { readSavedState, writeSavedState } from '../services/storage.js';

const saved = readSavedState();
export const state = {
  wishlist: saved.wishlist || ['vatican', 'sumo'],
  guestName: saved.guestName || 'A Rahman',
  email: saved.email || 'lombok_transfer@gmail.com',
  currency: saved.currency || 'USD ($)',
  language: saved.language || 'English',
  date: saved.date || '',
  adults: saved.adults || 1,
  children: saved.children || 0,
  selectedExperience: saved.selectedExperience || 'kayaking',
  selectedTime: saved.selectedTime || '6:00 PM',
  paymentMethod: saved.paymentMethod || 'card',
  checkoutStep: 1,
  modal: '',
  galleryExperienceId: '',
  galleryIndex: 0,
  toast: '',
  search: '',
  filter: 'All',
  inboxFilter: 'All',
  listName: 'Favourites',
};

export function update(patch) {
  Object.assign(state, patch);
  const { wishlist, guestName, email, currency, language, date, adults, children, selectedExperience, selectedTime, paymentMethod } = state;
  writeSavedState({ wishlist, guestName, email, currency, language, date, adults, children, selectedExperience, selectedTime, paymentMethod });
}

export function toggleWishlist(id) {
  update({ wishlist: state.wishlist.includes(id) ? state.wishlist.filter((item) => item !== id) : [...state.wishlist, id] });
}
