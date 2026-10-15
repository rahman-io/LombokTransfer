import { experiences, getExperience } from '../experiences/data.js';

const storageKey = 'lombok-guide-demo-v1';
const commissionRate = 0.10;
const paymentRate = 0.03;
const financeSchemaVersion = 1;
export function financeConfig() { return { platformRate: commissionRate, paymentRate, currency: 'IDR' }; }
const initialAgreements = (guide) => Object.fromEntries(guide.experienceIds.flatMap((id) => (getExperience(id)?.packageOptions || []).map((option) => [option.id, { approvedAmount: Number(option.price), approvedAt: null, approvedBy: 'demo-admin', proposal: null }])));
const seedGuides = [
  { id: 'guide-adi', name: 'Adi Saputra', initials: 'AS', area: 'Sembalun, East Lombok', languages: 'Indonesian, English', bio: 'Local trekking guide focused on Rinjani and Sembalun routes.', experienceIds: ['arena', 'sumo'], capacity: 6, status: 'verified', blockedDates: [], prices: {} },
  { id: 'guide-nur', name: 'Nur Aisyah', initials: 'NA', area: 'North Lombok & Gili Islands', languages: 'Indonesian, English', bio: 'Island and waterfall guide who loves sharing local stories.', experienceIds: ['pantheon', 'vatican', 'basilica'], capacity: 8, status: 'verified', blockedDates: [], prices: {} },
  { id: 'guide-lalu', name: 'Lalu Pratama', initials: 'LP', area: 'Central Lombok', languages: 'Indonesian, English', bio: 'Cultural guide for village visits and local craft experiences.', experienceIds: ['desa-sade', 'pantheon'], capacity: 6, status: 'verified', blockedDates: [], prices: {} },
];

const emptyData = () => ({
  schemaVersion: 2,
  activeGuideId: 'guide-adi',
  guides: seedGuides.map((guide) => ({ ...guide, blockedDates: [...guide.blockedDates], prices: { ...guide.prices }, experienceIds: [...guide.experienceIds], priceAgreements: initialAgreements(guide) })),
  requests: [
    { id: 'demo-rinjani-pending', schemaVersion: 2, experienceId: 'arena', packageId: 'rinjani-2d1n', guideId: 'guide-adi', date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), time: '5:00 AM', adults: 1, children: 0, travelers: 1, travelerName: 'Maya Putri', travelerEmail: 'maya.demo@example.com', notes: 'I would like a steady pace and an early briefing before the hike.', unitPrice: 2531969, currency: 'IDR', ...priceSplit(2531969), status: 'pending', paymentStatus: 'unpaid', payoutStatus: 'not_due', createdAt: new Date().toISOString(), review: null },
    { id: 'demo-gili-completed', schemaVersion: 2, experienceId: 'pantheon', packageId: 'gili-shared-snorkeling', guideId: 'guide-nur', date: new Date(Date.now() - 4 * 86400000).toISOString().slice(0, 10), time: '8:00 AM', adults: 2, children: 0, travelers: 2, travelerName: 'Sophie Walker', travelerEmail: 'sophie.demo@example.com', notes: 'Please recommend a calm snorkeling spot for first-time swimmers.', unitPrice: 164872, currency: 'IDR', ...priceSplit(329744), status: 'completed', paymentStatus: 'paid', payoutStatus: 'paid', paidAt: new Date(Date.now() - 7 * 86400000).toISOString(), payoutReleasedAt: new Date(Date.now() - 2 * 86400000).toISOString(), createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), review: { stars: 5, comment: 'Lovely day around the Gilis.', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() } },
  ],
});
function read() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (!data || !Array.isArray(data.guides) || !Array.isArray(data.requests)) return emptyData();
    let migrated = data.schemaVersion !== 2;
    data.schemaVersion = 2;
    data.guides.forEach((guide) => {
      if (guide.priceAgreements) return;
      guide.priceAgreements = guide.status === 'verified' ? initialAgreements(guide) : {};
      Object.entries(guide.prices || {}).forEach(([packageId, amount]) => {
        if (!guide.priceAgreements[packageId] || Number(amount) === guide.priceAgreements[packageId].approvedAmount) return;
        guide.priceAgreements[packageId].proposal = { amount: Number(amount), status: 'pending', submittedAt: new Date().toISOString() };
      });
    });
    data.requests.forEach((request) => {
      if (!request.finance) { request.finance = financeBreakdown(request.travelerTotal || Number(request.unitPrice) * Number(request.travelers || 1)); migrated = true; }
      if (typeof request.notes !== 'string') { request.notes = ''; migrated = true; }
      if (!request.paymentStatus) { request.paymentStatus = request.status === 'completed' ? 'paid' : 'unpaid'; migrated = true; }
      if (!request.payoutStatus) { request.payoutStatus = request.status === 'completed' && request.paymentStatus === 'paid' ? 'paid' : 'not_due'; migrated = true; }
      if (request.paymentStatus === 'paid' && !request.paidAt) { request.paidAt = request.createdAt || new Date().toISOString(); migrated = true; }
      if (request.payoutStatus === 'paid' && !request.payoutReleasedAt) { request.payoutReleasedAt = request.updatedAt || request.createdAt || new Date().toISOString(); migrated = true; }
      if (request.paymentStatus === 'paid' && request.status === 'accepted' && !request.bookingStatus) { request.bookingStatus = 'confirmed'; migrated = true; }
      if (request.status === 'completed' && !request.bookingStatus) { request.bookingStatus = 'completed'; migrated = true; }
    });
    if (migrated) write(data);
    return data;
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
export function packagePrice(guide, option) { const amount = guide?.priceAgreements?.[option?.id]?.approvedAmount; return Number.isInteger(amount) && amount >= 1000 ? amount : null; }
export function publicPackagePrice(experienceId, option) { const prices = availableGuides(experienceId, option.id).map((guide) => packagePrice(guide, option)); return prices.length ? Math.min(...prices) : null; }
export function approvedPackageLabel(experienceId, option) { const amount = publicPackagePrice(experienceId, option); return amount === null ? 'Awaiting guide approval' : `Rp${amount.toLocaleString('id-ID')}`; }
export function approvedExperienceLabel(item) { const prices = (item.packageOptions || []).map((option) => publicPackagePrice(item.id, option)).filter((amount) => amount !== null); return prices.length ? `Rp${Math.min(...prices).toLocaleString('id-ID')}` : 'Awaiting guide approval'; }
export function packageStartTimes(experience, option) { return experience?.id === 'arena' || option?.id === 'pergasingan-sunrise' ? ['5:00 AM', '6:00 AM'] : ['8:00 AM', '9:00 AM']; }
export function priceSplit(amount) {
  const breakdown = financeBreakdown(amount);
  return { travelerTotal: breakdown.travelerTotal, guideShare: breakdown.guideShare, platformShare: breakdown.platformShare };
}
export function financeBreakdown(amount) {
  const travelerTotal = Math.max(0, Math.round(Number(amount) || 0));
  const platformShare = Math.round(travelerTotal * commissionRate);
  const paymentFee = Math.round(travelerTotal * paymentRate);
  return { schemaVersion: financeSchemaVersion, travelerTotal, guideShare: travelerTotal - platformShare, platformShare, paymentFee, platformNet: Math.max(0, platformShare - paymentFee) };
}
export function financeSummary() {
  const requests = guideDemoData().requests;
  const paid = requests.filter((request) => request.paymentStatus === 'paid');
  const refunded = requests.filter((request) => request.paymentStatus === 'refunded');
  const total = (list, key) => list.reduce((sum, request) => sum + Number(request.finance?.[key] || 0), 0);
  return {
    bookings: requests.filter((request) => request.status !== 'declined').length,
    paidBookings: paid.length,
    grossSales: total(paid, 'travelerTotal'),
    platformGross: total(paid, 'platformShare'),
    paymentFees: total(paid, 'paymentFee'),
    platformNet: total(paid, 'platformNet'),
    guidePayoutDue: paid.filter((request) => request.payoutStatus !== 'paid').reduce((sum, request) => sum + Number(request.finance?.guideShare || 0), 0),
    guidePayoutPaid: paid.filter((request) => request.payoutStatus === 'paid').reduce((sum, request) => sum + Number(request.finance?.guideShare || 0), 0),
    refunds: total(refunded, 'travelerTotal'),
  };
}
export function packageDates(date, option) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
  const start = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(start.getTime()) || start.toISOString().slice(0, 10) !== date) return [];
  const days = Math.max(1, Math.min(14, Number(option?.duration?.match(/^(\d+)\s+days?/)?.[1]) || 1));
  return Array.from({ length: days }, (_, index) => new Date(start.getTime() + index * 86400000).toISOString().slice(0, 10));
}
export function requestDateRange(request) {
  const dates = requestDates(request);
  return { start: dates[0] || request.date, end: dates[dates.length - 1] || request.date, days: dates.length || 1 };
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
  return data.guides.filter((guide) => guide.status === 'verified' && guide.experienceIds.includes(experienceId) && packagePrice(guide, option) !== null && Number(travelers) > 0 && dates.every((day) => !guide.blockedDates.includes(day) && data.requests.filter((request) => request.guideId === guide.id && request.status === 'accepted' && requestDates(request).includes(day)).reduce((total, request) => total + request.travelers, 0) + Number(travelers) <= guide.capacity) && Number(travelers) <= guide.capacity);
}
export function createGuideRequest({ experienceId, packageId, guideId, date, time, adults, children, travelerName, travelerEmail, notes, expectedUnitPrice }) {
  const experience = getExperience(experienceId);
  const option = experience?.packageOptions?.find((entry) => entry.id === packageId);
  const travelers = Number(adults) + Number(children);
  const guide = availableGuides(experienceId, packageId, date, travelers).find((entry) => entry.id === guideId);
  if (!experience || !option || !guide || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date < new Date().toISOString().slice(0, 10) || travelers < 1 || !String(travelerName).trim() || !String(travelerEmail).includes('@')) return null;
  const data = read();
  if (data.requests.some((request) => request.travelerEmail === String(travelerEmail).trim().toLowerCase() && request.experienceId === experienceId && request.packageId === packageId && request.date === date && ['pending', 'accepted'].includes(request.status))) return null;
  const unitPrice = packagePrice(guide, option);
  if (Number(expectedUnitPrice) !== unitPrice) return null;
  const split = priceSplit(unitPrice * travelers);
  const request = { id: globalThis.crypto?.randomUUID?.() || `request-${Date.now()}`, schemaVersion: 2, experienceId, packageId, guideId, date, time: packageStartTimes(experience, option).includes(time) ? time : packageStartTimes(experience, option)[0], adults: Number(adults), children: Number(children), travelers, travelerName: String(travelerName).trim(), travelerEmail: String(travelerEmail).trim().toLowerCase(), notes: String(notes || '').trim().slice(0, 1000), unitPrice, priceApprovedBy: guide.priceAgreements[packageId].approvedBy, priceApprovedAt: guide.priceAgreements[packageId].approvedAt, currency: option.currency || 'IDR', ...split, finance: financeBreakdown(split.travelerTotal), paymentStatus: 'unpaid', payoutStatus: 'not_due', bookingStatus: 'request_sent', status: 'pending', createdAt: new Date().toISOString(), review: null };
  data.requests.unshift(request); write(data); return request;
}
export function updateGuideRequest(id, guideId, status) {
  const data = read();
  const request = data.requests.find((entry) => entry.id === id && entry.guideId === guideId);
  if (!request || !({ pending: ['accepted', 'declined'], accepted: ['completed'] }[request.status] || []).includes(status)) return false;
  if (status === 'accepted' && !availableGuides(request.experienceId, request.packageId, request.date, request.travelers).some((guide) => guide.id === guideId)) return false;
  request.status = status;
  if (status === 'accepted' && request.paymentStatus === 'paid') request.bookingStatus = 'confirmed';
  if (status === 'completed') request.bookingStatus = 'completed';
  request.updatedAt = new Date().toISOString();
  if (status === 'declined' && request.paymentStatus === 'paid') { request.paymentStatus = 'refunded'; request.refundedAt = request.updatedAt; request.payoutStatus = 'not_due'; }
  if (status === 'completed' && request.paymentStatus === 'paid') request.payoutStatus = 'pending';
  write(data); return true;
}
export function markGuideRequestPaid(id, email = '') {
  const data = read();
  const request = data.requests.find((entry) => entry.id === id && (!email || entry.travelerEmail === String(email).trim().toLowerCase()));
  if (!request || !['pending', 'accepted'].includes(request.status) || request.paymentStatus !== 'unpaid') return false;
  request.paymentStatus = 'paid'; request.paidAt = new Date().toISOString();
  request.bookingStatus = request.status === 'completed' ? 'completed' : 'confirmed';
  request.confirmedAt = request.paidAt;
  if (request.status === 'completed') request.payoutStatus = 'pending';
  write(data); return true;
}
export function releaseGuidePayout(id) {
  const data = read();
  const request = data.requests.find((entry) => entry.id === id);
  if (!request || request.status !== 'completed' || request.paymentStatus !== 'paid' || request.payoutStatus === 'paid') return false;
  request.payoutStatus = 'paid'; request.payoutReleasedAt = new Date().toISOString(); write(data); return true;
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
export function proposeGuidePrice(guideId, packageId, amount) {
  const data = read(); const guide = data.guides.find((entry) => entry.id === guideId);
  const option = guide?.experienceIds.flatMap((id) => getExperience(id)?.packageOptions || []).find((entry) => entry.id === packageId);
  if (!guide || !option || guide.status !== 'verified' || !Number.isInteger(Number(amount)) || Number(amount) < 1000) return false;
  const agreement = guide.priceAgreements[packageId] || { approvedAmount: null, approvedAt: null, approvedBy: null, proposal: null };
  if (Number(amount) === agreement.approvedAmount) return false;
  agreement.proposal = { amount: Number(amount), status: 'pending', submittedAt: new Date().toISOString() };
  guide.priceAgreements[packageId] = agreement; write(data); return true;
}
export function decideGuidePrice(guideId, packageId, decision) {
  const data = read(); const guide = data.guides.find((entry) => entry.id === guideId);
  const agreement = guide?.priceAgreements?.[packageId];
  if (!agreement || agreement.proposal?.status !== 'pending' || !['approved', 'rejected'].includes(decision)) return false;
  const amount = agreement.proposal.amount;
  agreement.proposal = { ...agreement.proposal, status: decision, decidedAt: new Date().toISOString(), agreedAmount: decision === 'approved' ? amount : null };
  if (decision === 'approved') { agreement.approvedAmount = amount; agreement.approvedAt = agreement.proposal.decidedAt; agreement.approvedBy = 'demo-admin'; }
  write(data); return true;
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
