import { readSavedState, writeSavedState } from '../services/storage.js';

const saved = readSavedState();
export const state = {
  wishlist: saved.wishlist || ['vatican', 'sumo'],
  accountUserId: saved.accountUserId || 'rahman',
  guestName: saved.guestName || 'A Rahman',
  email: saved.email || 'lombok_transfer@gmail.com',
  authMode: 'login',
  authError: '',
  profilePhoto: saved.profilePhoto || '',
  currency: saved.currency || 'USD ($)',
  language: saved.language || 'English',
  date: saved.date || '',
  adults: saved.adults || 1,
  children: saved.children || 0,
  selectedExperience: saved.selectedExperience || 'kayaking',
  selectedPackageExperienceId: saved.selectedPackageExperienceId || '',
  selectedPackageOptionId: saved.selectedPackageOptionId || '',
  selectedOfferId: saved.selectedOfferId || '',
  tripPriceFilter: saved.tripPriceFilter || 'all',
  selectedGuideExperienceId: saved.selectedGuideExperienceId || '',
  selectedGuideId: saved.selectedGuideId || '',
  selectedTime: saved.selectedTime || '6:00 PM',
  availabilityChecked: false,
  paymentMethod: saved.paymentMethod || 'card',
  checkoutStep: 1,
  bookingNotes: '',
  modal: '',
  confirmAction: null,
  galleryExperienceId: '',
  reviewExperienceId: '',
  galleryIndex: 0,
  toast: '',
  search: '',
  filter: 'All',
  inboxFilter: 'All',
  listName: 'Favourites',
  socialReplyCommentId: '',
  socialSharePostId: '',
  socialLikesPostId: '',
  shareTarget: null,
  chatSharedTarget: null,
  socialGalleryPostId: '',
  socialGalleryIndex: 0,
  travelerGroupThreadId: '',
  privacy: saved.privacy || { onlineStatus: true, readReceipts: true },
  chatReplyMessageId: '',
  chatEditMessageId: '',
  chatForwardMessageId: '',
  chatCollectionThreadId: '',
  chatCollectionKind: '',
  chatGalleryThreadId: '',
  chatGalleryIndex: 0,
};

export function update(patch) {
  Object.assign(state, patch);
  const { wishlist, accountUserId, guestName, email, profilePhoto, currency, language, date, adults, children, selectedExperience, selectedPackageOptionId, selectedOfferId, tripPriceFilter, selectedGuideExperienceId, selectedGuideId, selectedTime, paymentMethod, privacy } = state;
  writeSavedState({ wishlist, accountUserId, guestName, email, profilePhoto, currency, language, date, adults, children, selectedExperience, selectedPackageOptionId, selectedOfferId, tripPriceFilter, selectedGuideExperienceId, selectedGuideId, selectedTime, paymentMethod, privacy });
}

export function toggleWishlist(id) {
  update({ wishlist: state.wishlist.includes(id) ? state.wishlist.filter((item) => item !== id) : [...state.wishlist, id] });
}
