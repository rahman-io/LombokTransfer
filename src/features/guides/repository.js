import { experiences, getExperience } from '../experiences/data.js';

const storageKey = 'lombok-guide-demo-v1';
const commissionRate = 0.10;
const seedGuides = [
  { id: 'guide-adi', name: 'Adi Saputra', initials: 'AS', area: 'Sembalun, East Lombok', languages: 'Indonesian, English', bio: 'Local trekking guide focused on Rinjani and Sembalun routes.', experienceIds: ['arena', 'sumo'], capacity: 6, status: 'verified', blockedDates: [], prices: {} },
  { id: 'guide-nur', name: 'Nur Aisyah', initials: 'NA', area: 'North Lombok & Gili Islands', languages: 'Indonesian, English', bio: 'Island and waterfall guide who loves sharing local stories.', experienceIds: ['pantheon', 'vatican', 'basilica'], capacity: 8, status: 'verified', blockedDates: [], prices: {} },
  { id: 'guide-lalu', name: 'Lalu Pratama', initials: 'LP', area: 'Central Lombok', languages: 'Indonesian, English', bio: 'Cultural guide for village visits and local craft experiences.', experienceIds: ['desa-sade', 'pantheon'], capacity: 6, status: 'verified', blockedDates: [], prices: {} },
];

const emptyData = () => ({
  schemaVersion: 1,
  activeGuideId: 'guide-adi',
  guides: seedGuides.map((guide) => ({ ...guide, blockedDates: [...guide.blockedDates], prices: { ...guide.prices }, experienceIds: [...guide.experienceIds] })),
  requests: [
    { id: 'demo-rinjani-pending', schemaVersion: 1, experienceId: 'arena', packageId: 'rinjani-2d1n', guideId: 'guide-adi', date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), time: '5:00 AM', adults: 1, children: 0, travelers: 1, travelerName: 'Maya Putri', travelerEmail: 'maya.demo@example.com', unitPrice: 2531969, currency: 'IDR', ...priceSplit(2531969), status: 'pending', createdAt: new Date().toISOString(), review: null },
    { id: 'demo-gili-completed', schemaVersion: 1, experienceId: 'pantheon', packageId: 'gili-shared-snorkeling', guideId: 'guide-nur', date: new Date(Date.now() - 4 * 86400000).toISOString().slice(0, 10), time: '8:00 AM', adults: 2, children: 0, travelers: 2, travelerName: 'Sophie Walker', travelerEmail: 'sophie.demo@example.com', unitPrice: 164872, currency: 'IDR', ...priceSplit(329744), status: 'completed', createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), review: { stars: 5, comment: 'Lovely day around the Gilis.', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() } },
  ],
});
function read() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || 'null');
    return data && Array.isArray(data.guides) && Array.isArray(data.requests) ? data : emptyData();
  } catch { return emptyData(); }
}
function write(data) { localStorage.setItem(storageKey, JSON.stringify(data)); return data; }
export function guideDemoData() { return read(); }
export function guideById(id) { return read().guides.find((guide) => guide.id === id) || null; }
export function activeGuide() { const data = read(); return data.guides.find((guide) => guide.id === data.activeGuideId) || data.guides[0]; }
export function switchGuide(id) {
  const data = read();
  if (!data.guides.some((guide) => guide.id === id)) return false;
  data.activeGuideId = id; write(data); return true;
}
export function packagePrice(guide, option) { return Number(guide?.prices?.[option.id] || option.price); }
export function packageStartTimes(experience, option) { return experience?.id === 'arena' || option?.id === 'pergasingan-sunrise' ? ['5:00 AM', '6:00 AM'] : ['8:00 AM', '9:00 AM']; }
export function priceSplit(amount) {
  const platform = Math.round(Number(amount) * commissionRate);
  return { travelerTotal: Number(amount), guideShare: Number(amount) - platform, platformShare: platform };
}
function packageDates(date, option) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
  const start = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(start.getTime()) || start.toISOString().slice(0, 10) !== date) return [];
  const days = Math.max(1, Math.min(14, Number(option?.duration?.match(/^(\d+)\s+days?/)?.[1]) || 1));
  return Array.from({ length: days }, (_, index) => new Date(start.getTime() + index * 86400000).toISOString().slice(0, 10));
}
function requestDates(request) {
  const option = getExperience(request.experienceId)?.packageOptions?.find((entry) => entry.id === request.packageId);
  return packageDates(request.date, option);
}
export function availableGuides(experienceId, optionId, date = '', travelers = 1) {
  const data = read();
  const option = getExperience(experienceId)?.packageOptions?.find((entry) => entry.id === optionId);
  if (!option || (date && !packageDates(date, option).length)) return [];
  const dates = date ? packageDates(date, option) : [];
  return data.guides.filter((guide) => guide.status === 'verified' && guide.experienceIds.includes(experienceId) && Number(travelers) > 0 && dates.every((day) => !guide.blockedDates.includes(day) && data.requests.filter((request) => request.guideId === guide.id && request.status === 'accepted' && requestDates(request).includes(day)).reduce((total, request) => total + request.travelers, 0) + Number(travelers) <= guide.capacity) && Number(travelers) <= guide.capacity);
}
export function createGuideRequest({ experienceId, packageId, guideId, date, time, adults, children, travelerName, travelerEmail }) {
  const experience = getExperience(experienceId);
  const option = experience?.packageOptions?.find((entry) => entry.id === packageId);
  const travelers = Number(adults) + Number(children);
  const guide = availableGuides(experienceId, packageId, date, travelers).find((entry) => entry.id === guideId);
  if (!experience || !option || !guide || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date < new Date().toISOString().slice(0, 10) || travelers < 1 || !String(travelerName).trim() || !String(travelerEmail).includes('@')) return null;
  const data = read();
  if (data.requests.some((request) => request.travelerEmail === String(travelerEmail).trim().toLowerCase() && request.experienceId === experienceId && request.packageId === packageId && request.date === date && ['pending', 'accepted'].includes(request.status))) return null;
  const unitPrice = packagePrice(guide, option);
  const split = priceSplit(unitPrice * travelers);
  const request = { id: globalThis.crypto?.randomUUID?.() || `request-${Date.now()}`, schemaVersion: 1, experienceId, packageId, guideId, date, time: packageStartTimes(experience, option).includes(time) ? time : packageStartTimes(experience, option)[0], adults: Number(adults), children: Number(children), travelers, travelerName: String(travelerName).trim(), travelerEmail: String(travelerEmail).trim().toLowerCase(), unitPrice, currency: option.currency || 'IDR', ...split, status: 'pending', createdAt: new Date().toISOString(), review: null };
  data.requests.unshift(request); write(data); return request;
}
export function updateGuideRequest(id, guideId, status) {
  const data = read();
  const request = data.requests.find((entry) => entry.id === id && entry.guideId === guideId);
  if (!request || !({ pending: ['accepted', 'declined'], accepted: ['completed'] }[request.status] || []).includes(status)) return false;
  if (status === 'accepted' && !availableGuides(request.experienceId, request.packageId, request.date, request.travelers).some((guide) => guide.id === guideId)) return false;
  request.status = status; request.updatedAt = new Date().toISOString(); write(data); return true;
}
export function reviewGuideRequest(id, email, stars, comment) {
  const data = read();
  const request = data.requests.find((entry) => entry.id === id && entry.travelerEmail === String(email).toLowerCase());
  if (!request || request.status !== 'completed' || request.review || !Number.isInteger(Number(stars)) || Number(stars) < 1 || Number(stars) > 5) return false;
  request.review = { stars: Number(stars), comment: String(comment || '').trim().slice(0, 500), createdAt: new Date().toISOString() }; write(data); return true;
}
export function saveGuideProfile(id, { name, area, languages, bio, capacity }) {
  const data = read(); const guide = data.guides.find((entry) => entry.id === id);
  if (!guide || !String(name).trim() || !String(area).trim() || !Number.isInteger(Number(capacity)) || Number(capacity) < 1 || Number(capacity) > 30) return false;
  Object.assign(guide, { name: String(name).trim().slice(0, 80), area: String(area).trim().slice(0, 100), languages: String(languages).trim().slice(0, 100), bio: String(bio).trim().slice(0, 500), capacity: Number(capacity) }); write(data); return true;
}
export function setGuidePrice(guideId, packageId, amount) {
  const data = read(); const guide = data.guides.find((entry) => entry.id === guideId);
  const option = guide?.experienceIds.flatMap((id) => getExperience(id)?.packageOptions || []).find((entry) => entry.id === packageId);
  if (!guide || !option || guide.status !== 'verified' || !Number.isInteger(Number(amount)) || Number(amount) < 1000) return false;
  guide.prices[packageId] = Number(amount); write(data); return true;
}
export function toggleGuideExperience(guideId, experienceId) {
  const data = read(); const guide = data.guides.find((entry) => entry.id === guideId);
  const experience = experiences.find((item) => item.id === experienceId && item.packageOptions?.length);
  if (!guide || guide.status !== 'verified' || !experience) return false;
  if (guide.experienceIds.includes(experienceId)) {
    if (data.requests.some((request) => request.guideId === guideId && request.experienceId === experienceId && ['pending', 'accepted'].includes(request.status))) return false;
    guide.experienceIds = guide.experienceIds.filter((id) => id !== experienceId);
  } else guide.experienceIds.push(experienceId);
  write(data); return true;
}
export function toggleGuideDate(guideId, date) {
  const data = read(); const guide = data.guides.find((entry) => entry.id === guideId);
  if (!guide || guide.status !== 'verified' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date < new Date().toISOString().slice(0, 10)) return false;
  if (data.requests.some((request) => request.guideId === guideId && request.status === 'accepted' && requestDates(request).includes(date))) return false;
  guide.blockedDates = guide.blockedDates.includes(date) ? guide.blockedDates.filter((entry) => entry !== date) : [...guide.blockedDates, date].sort(); write(data); return true;
}
export function applyAsGuide({ name, area, languages, bio, capacity, experienceIds }) {
  const data = read();
  if (!String(name).trim() || !String(area).trim() || !Array.isArray(experienceIds) || !experienceIds.length) return null;
  const id = globalThis.crypto?.randomUUID?.() || `guide-${Date.now()}`;
  const guide = { id, name: String(name).trim().slice(0, 80), initials: String(name).trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase(), area: String(area).trim().slice(0, 100), languages: String(languages).trim().slice(0, 100), bio: String(bio).trim().slice(0, 500), capacity: Math.max(1, Math.min(30, Number(capacity) || 1)), experienceIds: experienceIds.filter((experienceId) => experiences.some((item) => item.id === experienceId && item.packageOptions?.length)), status: 'pending', blockedDates: [], prices: {} };
  if (!guide.experienceIds.length) return null;
  data.guides.push(guide); data.activeGuideId = id; write(data); return guide;
}
