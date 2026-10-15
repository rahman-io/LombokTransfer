import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

test('traveler requests reach the guide and keep the agreed price split through completion', async () => {
  const values = new Map();
  globalThis.localStorage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'silent' });
  try {
    const guideRepo = await vite.ssrLoadModule('/src/features/guides/repository.js');
    const guideViews = await vite.ssrLoadModule('/src/features/guides/view.js');
    const date = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const nextDate = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
    const { activeGuide, availableGuides, createGuideRequest, guideDemoData, priceSplit, reviewGuideRequest, setGuidePrice, toggleGuideDate, updateGuideRequest } = guideRepo;
    assert.deepEqual(priceSplit(2500000), { travelerTotal: 2500000, guideShare: 2250000, platformShare: 250000 });
    assert.equal(setGuidePrice('guide-adi', 'rinjani-2d1n', 2500000), true);
    assert.equal(availableGuides('arena', 'rinjani-2d1n', date, 1)[0].id, 'guide-adi');
    const request = createGuideRequest({ experienceId: 'arena', packageId: 'rinjani-2d1n', guideId: 'guide-adi', date, time: '5:00 AM', adults: 1, children: 0, travelerName: 'Traveler Demo', travelerEmail: 'traveler@example.com' });
    assert.equal(request.status, 'pending');
    assert.equal(request.guideShare, 2250000);
    assert.equal(request.platformShare, 250000);
    assert.equal(createGuideRequest({ experienceId: 'arena', packageId: 'rinjani-2d1n', guideId: 'guide-adi', date, adults: 1, children: 0, travelerName: 'Traveler Demo', travelerEmail: 'traveler@example.com' }), null);
    assert.match(guideViews.guideDashboardView(), /Traveler Demo/);
    assert.equal(updateGuideRequest(request.id, 'guide-adi', 'accepted'), true);
    assert.equal(availableGuides('arena', 'rinjani-2d1n', date, activeGuide().capacity).length, 0);
    assert.equal(toggleGuideDate('guide-adi', date), false);
    assert.equal(toggleGuideDate('guide-adi', nextDate), false);
    assert.equal(availableGuides('arena', 'rinjani-2d1n', nextDate, activeGuide().capacity).length, 0);
    assert.equal(updateGuideRequest(request.id, 'guide-adi', 'declined'), false);
    assert.equal(updateGuideRequest(request.id, 'guide-adi', 'completed'), true);
    assert.equal(reviewGuideRequest(request.id, 'traveler@example.com', 5, 'Great trek'), true);
    assert.equal(reviewGuideRequest(request.id, 'traveler@example.com', 5, 'Again'), false);
    assert.equal(guideDemoData().requests[0].review.comment, 'Great trek');
  } finally { await vite.close(); delete globalThis.localStorage; }
});
