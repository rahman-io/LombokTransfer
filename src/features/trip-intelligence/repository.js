const intentRules = [
  { id: 'culture', label: 'Culture seeker', keywords: ['Cultural experience', 'Audio guide', 'Skip the line'], description: 'history, local culture and iconic places' },
  { id: 'adventure', label: 'Adventure seeker', keywords: ['Adventure', 'Guided tour'], description: 'active experiences and memorable adventures' },
  { id: 'food', label: 'Food and evening explorer', keywords: ['Dinner included'], description: 'local flavors and experiences after dark' },
];

const normalize = (value) => String(value || '').toLowerCase();

export function packageOptionForDays(item, days) {
  return (item.packageOptions || []).slice().sort((a, b) => Math.abs(Number(a.days || 1) - Number(days)) - Math.abs(Number(b.days || 1) - Number(days)))[0] || null;
}

export function getTripIntent(userState = {}, catalog = [], socialContext = {}) {
  const wishlistItems = catalog.filter((item) => (userState.wishlist || []).includes(item.id));
  const socialPosts = socialContext.posts || [];
  const activeUserId = socialContext.userId;
  const engagedPosts = activeUserId ? socialPosts.filter((post) => post.likedBy.includes(activeUserId) || post.savedBy.includes(activeUserId) || post.comments.some((comment) => comment.authorId === activeUserId)) : [];
  const sourceItems = [...wishlistItems, ...catalog.filter((item) => engagedPosts.some((post) => post.experienceId === item.id))];
  const scores = intentRules.map((rule) => ({ ...rule, score: sourceItems.reduce((total, item) => total + (rule.keywords.some((keyword) => normalize(item.label) === normalize(keyword)) ? 2 : 0), 0) + engagedPosts.filter((post) => post.experienceId && sourceItems.some((item) => item.id === post.experienceId)).length }));
  const intent = scores.sort((a, b) => b.score - a.score)[0] || intentRules[0];
  const cityCounts = sourceItems.reduce((counts, item) => { counts[item.city] = (counts[item.city] || 0) + 1; return counts; }, {});
  const destination = Object.entries(cityCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || catalog[0]?.city || 'Lombok';
  const prices = sourceItems.map((item) => Number(item.price)).filter(Number.isFinite);
  const averagePrice = prices.length ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length) : 60;
  return { id: intent.id, label: intent.label, description: intent.description, destination, averagePrice, confidence: sourceItems.length ? Math.min(96, 58 + sourceItems.length * 12) : 42, source: sourceItems.length ? 'saved-and-social-signals' : 'catalog-cold-start' };
}

export function buildTripItinerary({ destination = '', days = 3, budget = 'mid', catalog = [], userState = {}, socialContext = {} } = {}) {
  const intent = getTripIntent(userState, catalog, socialContext);
  const city = destination || intent.destination;
  const maxPrice = budget === 'low' ? 60 : budget === 'high' ? Infinity : 120;
  const preferredIds = new Set(userState.wishlist || []);
  const candidates = catalog.filter((item) => item.city === city && item.price <= maxPrice).sort((a, b) => (preferredIds.has(b.id) ? 1 : 0) - (preferredIds.has(a.id) ? 1 : 0) || Number(b.rating) - Number(a.rating));
  const fallback = catalog.filter((item) => item.city === city).sort((a, b) => Number(b.rating) - Number(a.rating));
  const selected = [...new Map([...candidates, ...fallback].map((item) => [item.id, item])).values()].slice(0, Math.max(1, Number(days) || 3));
  const tripDays = Number(days) || 3;
  const itinerary = selected.map((experience, index) => {
    const packageOption = packageOptionForDays(experience, tripDays);
    return { day: index + 1, experienceId: experience.id, title: experience.title, city: experience.city, duration: experience.duration, price: experience.price, packageOption: packageOption ? { id: packageOption.id, name: packageOption.name, duration: packageOption.duration, price: packageOption.price, currency: packageOption.currency, pricingUnit: packageOption.pricingUnit } : null };
  });
  return { intent, destination: city, days: tripDays, budget, itinerary, total: itinerary.reduce((sum, item) => sum + item.price, 0), packageCount: itinerary.filter((item) => item.packageOption).length, generatedAt: new Date().toISOString(), schemaVersion: 1 };
}

export function toTripItineraryFirebaseFixture(itinerary) {
  return { ...itinerary, source: 'demo-local-intent-engine', status: 'draft', userId: 'demo-user' };
}
