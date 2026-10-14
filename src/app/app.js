import { route, navigate, back } from './router.js';
import { state, update, toggleWishlist } from './store.js';
import { homeView } from '../features/home/view.js';
import { searchView, resultsView, mapView } from '../features/search/view.js';
import { wishlistView, favouritesView } from '../features/wishlist/view.js';
import { bookingsView } from '../features/bookings/view.js';
import { profileView, profileSectionView } from '../features/profile/view.js';
import { inboxView, chatView } from '../features/messaging/view.js';
import { loginView } from '../features/authentication/view.js';
import { splashView } from '../features/onboarding/view.js';
import { installView } from '../features/onboarding/install-view.js';
import { getInstallState, isInstalledApp, requestInstallation, watchInstallation } from '../features/onboarding/install.js';
import { experienceView } from '../features/experience-detail/view.js';
import { bookingView, checkoutView, cardDetailsView } from '../features/booking/view.js';
import { experiences, getExperience, getExperienceGallery } from '../features/experiences/data.js';
import { modalView } from '../components/Modal.js';
import { socialFeedView, socialExploreView, socialSavedView, socialProfileView, socialPostView, socialCreateView, socialEditView, socialDraft, clearSocialDraft } from '../features/social/view.js';
import { addSocialComment, createSocialPost, deleteSocialComment, deleteSocialPost, editSocialPost, prepareSocialPhoto, reportSocialPost, socialPost, switchSocialUser, toggleSocialFollow, toggleSocialLike, toggleSocialSave } from '../features/social/repository.js';
import { getOrCreateChatThread, sendChatMessage } from '../features/messaging/repository.js';
import { trackExperienceView, trackSearch, trackWishlistChange, trackSocialBookingOpen } from '../features/recommendations/repository.js';
import { tripPlannerView } from '../features/trip-intelligence/view.js';
import { markInboxItemRead } from '../features/inbox/repository.js';

const root = document.getElementById('app');
let lastPath = '';
let galleryDrag = null;
let suppressGalleryClick = false;
let devBrowserPreview = false;
function needsInstallation() { return !isInstalledApp() && !devBrowserPreview; }
function syncDetailHeader() {
  const header = root.querySelector('[data-detail-sticky-header]');
  const actions = root.querySelector('.detail-top-actions');
  if (!header || !actions) return;
  header.classList.toggle('is-visible', actions.getBoundingClientRect().bottom <= 0);
}
function currentView() {
  const { path, params } = route();
  if (path === '/login') return loginView();
  if (path === '/' || path === '') return homeView();
  if (path === '/search') return searchView();
  if (path === '/results') { trackSearch(params.get('city') || 'Rome'); return resultsView(params.get('city') || 'Rome'); }
  if (path === '/map') return mapView(params.get('city') || 'Rome');
  if (path === '/wishlist') return wishlistView();
  if (path === '/wishlist/favourites') return favouritesView();
  if (path === '/bookings') return bookingsView();
  if (path === '/profile') return profileView();
  if (path === '/trip-planner') return tripPlannerView(params.get('city') || '', Number(params.get('days') || 3), params.get('budget') || 'mid');
  if (path.startsWith('/profile/')) return profileSectionView(path.split('/')[2]);
  if (path === '/inbox') return inboxView();
  if (path.startsWith('/inbox/chat/')) return chatView(path.split('/')[3]);
  if (path === '/social') return socialFeedView(params.get('feed') === 'following');
  if (path === '/social/explore') return socialExploreView(params.get('topic') || '');
  if (path === '/social/saved') return socialSavedView();
  if (path === '/social/activity') return inboxView();
  if (path === '/social/create') return socialCreateView(params.get('experience') || '');
  if (path.startsWith('/social/edit/')) return socialEditView(path.split('/')[3]);
  if (path.startsWith('/social/user/')) return socialProfileView(path.split('/')[3]);
  if (path.startsWith('/social/post/')) return socialPostView(path.split('/')[3]);
  if (path.startsWith('/experience/')) { const experienceId = path.split('/')[2]; const experience = getExperience(experienceId); trackExperienceView(experienceId, experience); if (params.get('from') === 'vibes') trackSocialBookingOpen(experienceId, experience); return experienceView(experienceId); }
  if (path.startsWith('/booking/')) return bookingView(path.split('/')[2]);
  if (path.startsWith('/checkout/')) return checkoutView(path.split('/')[2]);
  if (path.startsWith('/card/')) return cardDetailsView(path.split('/')[2]);
  return homeView();
}
export function render() {
  const { path } = route();
  if (needsInstallation()) {
    root.innerHTML = installView(getInstallState(), import.meta.env.DEV);
    return;
  }
  const expandedSections = path === lastPath && path.startsWith('/experience/') ? [...root.querySelectorAll('[data-detail-section]')].filter((section) => section.open).map((section) => section.dataset.detailSection) : null;
  if (path !== lastPath) { state.galleryIndex = 0; state.availabilityChecked = false; }
  root.innerHTML = currentView() + modalView() + (state.toast ? `<div class="toast" role="status">${state.toast}</div>` : '');
  if (expandedSections) root.querySelectorAll('[data-detail-section]').forEach((section) => { section.open = expandedSections.includes(section.dataset.detailSection); });
  selectGalleryIndex(state.galleryIndex, false);
  if (path !== lastPath) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    lastPath = path;
  }
  syncDetailHeader();
}
function galleryLength() {
  const { path } = route();
  const id = state.modal === 'gallery' ? state.galleryExperienceId : path.startsWith('/experience/') ? path.split('/')[2] : '';
  return id ? getExperienceGallery(getExperience(id)).length : 0;
}
function updateGalleryIndicators(index) {
  state.galleryIndex = index;
  root.querySelectorAll('[data-gallery-dot]').forEach((dot) => {
    const active = Number(dot.dataset.index) === index;
    dot.classList.toggle('active', active);
    dot.setAttribute('aria-current', String(active));
  });
  root.querySelectorAll('.gallery-thumb').forEach((thumb) => thumb.classList.toggle('active', Number(thumb.dataset.index) === index));
  const counter = root.querySelector('[data-gallery-counter]');
  if (counter) counter.textContent = `${index + 1} / ${galleryLength()}`;
  const previous = root.querySelector('[data-action="gallery-prev"]');
  const next = root.querySelector('[data-action="gallery-next"]');
  if (previous) previous.disabled = index === 0;
  if (next) next.disabled = index === galleryLength() - 1;
}
function selectGalleryIndex(requestedIndex, animate = true) {
  const length = galleryLength();
  if (!length) return;
  const index = Math.max(0, Math.min(length - 1, Number(requestedIndex) || 0));
  updateGalleryIndicators(index);
  root.querySelectorAll('[data-gallery-track]').forEach((track) => {
    track.scrollTo({ left: index * track.clientWidth, behavior: animate ? 'smooth' : 'instant' });
  });
}
function announce(message) {
  state.toast = message;
  render();
  setTimeout(() => { state.toast = ''; render(); }, 2200);
}
function closeModal() { state.modal = ''; render(); }
function openModal(name) { state.modal = name; render(); }
function clickAction(action, el) {
  const { path } = route();
  const id = el.dataset.id || path.split('/')[2] || state.selectedExperience;
  const value = el.dataset.value || '';
  switch (action) {
    case 'back': if (path.startsWith('/checkout/') && state.checkoutStep === 2) { state.checkoutStep = 1; render(); } else back(); break;
    case 'heart': trackWishlistChange(id, state.wishlist.includes(id) ? 'remove' : 'add', getExperience(id)); toggleWishlist(id); render(); break;
    case 'open-dates': openModal('dates'); break;
    case 'show-availability': root.querySelector('#detail-availability')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
    case 'check-availability': state.availabilityChecked = true; if (!state.date) openModal('dates'); else { render(); root.querySelector('#detail-availability-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } break;
    case 'select-date': update({ date: value }); closeModal(); break;
    case 'tomorrow': { const d = new Date(); d.setDate(d.getDate() + 1); update({ date: d.toISOString().slice(0, 10) }); closeModal(); break; }
    case 'participants': openModal('participants'); break;
    case 'count': { const [key, amount] = value.split(':'); update({ [key]: Math.max(key === 'adults' ? 1 : 0, state[key] + Number(amount)) }); render(); break; }
    case 'language': state.modalTitle = 'Language'; state.modalMessage = 'English'; openModal('message'); break;
    case 'filter-sheet': openModal('filters'); break;
    case 'set-filter': state.filter = value; render(); break;
    case 'show-map': navigate('/map?city=' + encodeURIComponent(route().params.get('city') || 'Rome')); break;
    case 'map-marker': navigate('/experience/pantheon'); break;
    case 'new-list': openModal('new-list'); break;
    case 'create-list': { const input = document.getElementById('list-name'); if (input?.value.trim()) { state.listName = input.value.trim(); closeModal(); navigate('/wishlist'); } break; }
    case 'save-to-list': closeModal(); break;
    case 'dismiss-banner': el.closest('.info-banner')?.remove(); break;
    case 'list-menu': state.modalTitle = 'List options'; state.modalMessage = 'Your saved activities are available in this list.'; openModal('message'); break;
    case 'reviews': state.reviewExperienceId = id; openModal('reviews'); break;
    case 'gallery': state.galleryExperienceId = id; state.galleryIndex = Number(el.dataset.index) || 0; openModal('gallery'); break;
    case 'gallery-select': selectGalleryIndex(el.dataset.index); break;
    case 'gallery-prev': selectGalleryIndex(state.galleryIndex - 1); break;
    case 'gallery-next': selectGalleryIndex(state.galleryIndex + 1); break;
    case 'share': if (navigator.share) navigator.share({ title: document.title, url: location.href }).catch((error) => { if (error.name !== 'AbortError') openModal('share'); }); else openModal('share'); break;
    case 'share-to-vibes': navigate(`/social/create?experience=${encodeURIComponent(id)}`); break;
    case 'install-app': requestInstallation().catch(() => announce('Instalasi belum tersedia di browser ini')); break;
    case 'preview-in-browser': if (import.meta.env.DEV) { devBrowserPreview = true; render(); } break;
    case 'copy-link': navigator.clipboard?.writeText(location.href).then(() => { closeModal(); announce('Link copied'); }).catch(() => announce('Unable to copy link')); break;
    case 'close-modal': closeModal(); break;
    case 'select-time': update({ selectedTime: value }); render(); break;
    case 'meeting': state.modalTitle = 'Meeting point'; state.modalMessage = 'Your exact meeting point will be confirmed after booking.'; openModal('message'); break;
    case 'go-payment': {
      const name = document.getElementById('checkout-name');
      const email = document.getElementById('checkout-email');
      const phone = document.getElementById('checkout-phone');
      if (!name?.value.trim() || !email?.checkValidity() || !phone?.value.trim()) { name?.reportValidity(); email?.reportValidity(); phone?.reportValidity(); break; }
      update({ guestName: name.value.trim(), email: email.value.trim() });
      state.checkoutStep = 2; render(); window.scrollTo(0, 0); break;
    }
    case 'edit-contact': state.checkoutStep = 1; render(); window.scrollTo(0, 0); break;
    case 'promo': openModal('promo'); break;
    case 'apply-promo': closeModal(); announce('Promo code is not available'); break;
    case 'card-details': if (state.paymentMethod === 'card') navigate('/card/' + id); else { state.modalTitle = 'Payment method'; state.modalMessage = 'This payment method will be connected in the backend phase.'; openModal('message'); } break;
    case 'payment-unavailable': state.modalTitle = 'Payment unavailable'; state.modalMessage = 'Online payments will be available when the backend is connected.'; openModal('message'); break;
    case 'save-profile': update({ guestName: document.getElementById('profile-name')?.value.trim() || state.guestName, email: document.getElementById('profile-email')?.value.trim() || state.email }); announce('Details saved'); break;
    case 'set-currency': update({ currency: value }); render(); break;
    case 'set-language': update({ language: value }); render(); break;
    case 'inbox-filter': state.inboxFilter = value; render(); break;
    case 'dismiss-login': localStorage.setItem('travel-intro-seen', '1'); navigate('/'); break;
    case 'continue-email': { const email = document.getElementById('login-email'); if (email?.value && !email.checkValidity()) { email.reportValidity(); break; } if (email?.value) update({ email: email.value }); localStorage.setItem('travel-intro-seen', '1'); navigate('/'); break; }
    case 'auth-placeholder': state.modalTitle = 'Sign in'; state.modalMessage = 'Account sign in will be available when the backend is connected.'; openModal('message'); break;
    case 'sign-out': navigate('/login'); break;
    case 'booking-history': announce('No past bookings yet'); break;
    case 'inbox-more': announce('Inbox is up to date'); break;
    case 'inbox-read': markInboxItemRead(value); navigate(el.dataset.href || '/inbox'); break;
    case 'chat-user': { const threadId = getOrCreateChatThread(el.dataset.id); if (threadId) navigate(`/inbox/chat/${encodeURIComponent(threadId)}`); break; }
    case 'social-back': back(); break;
    case 'social-switch-user': if (switchSocialUser(id)) { navigate('/social'); render(); } break;
    case 'social-like': toggleSocialLike(id); render(); break;
    case 'social-save': toggleSocialSave(id); render(); break;
    case 'social-follow': toggleSocialFollow(id); render(); break;
    case 'social-select-photo': socialDraft.imageKey = value; socialDraft.localImage = null; render(); break;
    case 'social-delete': if (window.confirm('Delete this post from the local demo?') && deleteSocialPost(id)) navigate('/social'); break;
    case 'social-delete-comment': if (deleteSocialComment(id, value)) render(); break;
    case 'social-report': if (reportSocialPost(id)) announce('Report saved for admin review (demo)'); else announce('This post was already reported'); break;
    case 'social-share': {
      const post = socialPost(id);
      if (!post) break;
      const url = `${location.origin}${location.pathname}#/social/post/${encodeURIComponent(id)}`;
      if (navigator.share) navigator.share({ title: 'Travel moment', url }).catch(() => {});
      else navigator.clipboard?.writeText(url).then(() => announce('Post link copied')).catch(() => announce('Sharing unavailable'));
      break;
    }
    default: break;
  }
}
export function startApp() {
  watchInstallation(render);
  const firstLaunch = !needsInstallation() && !location.hash && !localStorage.getItem('travel-intro-seen');
  if (firstLaunch) {
    root.innerHTML = splashView();
    setTimeout(() => navigate('/login'), 850);
  } else render();
  window.addEventListener('hashchange', () => { state.modal = ''; render(); });
  window.addEventListener('scroll', syncDetailHeader, { passive: true });
  root.addEventListener('click', (event) => {
    const el = event.target.closest('[data-action]');
    if (!el) return;
    if (suppressGalleryClick && el.dataset.action === 'gallery') {
      event.preventDefault();
      suppressGalleryClick = false;
      return;
    }
    event.preventDefault();
    if (el.classList.contains('modal-backdrop') && event.target !== el) return;
    clickAction(el.dataset.action, el);
  });
  root.addEventListener('pointerdown', (event) => {
    const track = event.target.closest('[data-gallery-track]');
    if (!track || event.pointerType !== 'mouse') return;
    galleryDrag = { track, pointerId: event.pointerId, x: event.clientX, left: track.scrollLeft, moved: false };
  });
  root.addEventListener('pointermove', (event) => {
    if (!galleryDrag || galleryDrag.pointerId !== event.pointerId) return;
    const distance = event.clientX - galleryDrag.x;
    if (Math.abs(distance) > 6 && !galleryDrag.moved) {
      galleryDrag.moved = true;
      galleryDrag.track.style.scrollSnapType = 'none';
      galleryDrag.track.setPointerCapture(event.pointerId);
    }
    if (galleryDrag.moved) galleryDrag.track.scrollLeft = galleryDrag.left - distance;
  });
  const endGalleryDrag = (event) => {
    if (!galleryDrag || galleryDrag.pointerId !== event.pointerId) return;
    if (galleryDrag.moved) {
      galleryDrag.track.style.scrollSnapType = '';
      selectGalleryIndex(Math.round(galleryDrag.track.scrollLeft / galleryDrag.track.clientWidth));
      suppressGalleryClick = true;
      setTimeout(() => { suppressGalleryClick = false; }, 0);
    }
    galleryDrag = null;
  };
  root.addEventListener('pointerup', endGalleryDrag);
  root.addEventListener('pointercancel', endGalleryDrag);
  root.addEventListener('input', (event) => {
    if (event.target.closest('#social-compose-form')) {
      if (event.target.name === 'caption') socialDraft.caption = event.target.value;
      if (event.target.name === 'location') socialDraft.location = event.target.value;
    }
    if (event.target.id === 'social-search') {
      const query = event.target.value.toLowerCase().trim();
      let shown = 0;
      root.querySelectorAll('#social-explore-grid [data-search-text]').forEach((post) => {
        post.hidden = !post.dataset.searchText.includes(query);
        if (!post.hidden) shown += 1;
      });
      const empty = root.querySelector('#social-search-empty');
      if (empty) empty.hidden = shown !== 0;
    }
    if (event.target.id !== 'place-search') return;
    state.search = event.target.value;
    document.querySelectorAll('#search-suggestions .suggestion').forEach((item) => { item.hidden = !item.textContent.toLowerCase().includes(state.search.toLowerCase()); });
  });
  root.addEventListener('keydown', (event) => {
    if (event.target.id === 'place-search' && event.key === 'Enter') navigate('/results?city=' + encodeURIComponent(event.target.value.trim() || 'Rome'));
    if (event.key === 'Escape' && state.modal) closeModal();
    if (event.target.matches('[data-gallery-track]') && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      selectGalleryIndex(state.galleryIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  root.addEventListener('scroll', (event) => {
    const track = event.target;
    if (!track.matches?.('[data-gallery-track]') || !track.clientWidth) return;
    const index = Math.max(0, Math.min(galleryLength() - 1, Math.round(track.scrollLeft / track.clientWidth)));
    updateGalleryIndicators(index);
  }, true);
  root.addEventListener('change', (event) => {
    if (event.target.id === 'social-photo-input' && event.target.files?.[0]) {
      prepareSocialPhoto(event.target.files[0]).then((dataUrl) => { socialDraft.localImage = dataUrl; render(); }).catch((error) => announce(error.message));
    }
    if (event.target.id === 'social-experience-select') socialDraft.experienceId = event.target.value || null;
    if (event.target.name === 'payment') { update({ paymentMethod: event.target.value }); render(); }
    if (event.target.dataset.filter) { state.filter = event.target.checked ? event.target.dataset.filter : 'All'; }
  });
  root.addEventListener('submit', (event) => {
    if (event.target.id === 'chat-message-form') {
      event.preventDefault();
      const threadId = route().path.split('/')[3];
      const input = event.target.elements.message;
      if (sendChatMessage(threadId, input?.value)) render();
    }
    if (event.target.id === 'social-compose-form') {
      event.preventDefault();
      const post = createSocialPost({ caption: socialDraft.caption, location: socialDraft.location, imageKey: socialDraft.imageKey, localImage: socialDraft.localImage, experienceId: socialDraft.experienceId });
      if (!post) { announce('Could not save this post on this device'); return; }
      clearSocialDraft();
      navigate(`/social/post/${encodeURIComponent(post.id)}`);
    }
    if (event.target.id === 'social-comment-form') {
      event.preventDefault();
      const postId = route().path.split('/')[3];
      const input = event.target.elements.comment;
      if (addSocialComment(postId, input?.value)) render();
    }
    if (event.target.id === 'social-edit-form') {
      event.preventDefault();
      const postId = route().path.split('/')[3];
      const { caption, location } = event.target.elements;
      if (editSocialPost(postId, { caption: caption.value, location: location.value })) navigate(`/social/post/${encodeURIComponent(postId)}`);
    }
  });
  document.addEventListener('contextmenu', (event) => { if (!event.target.closest('input,textarea')) event.preventDefault(); });
}
