import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

test('Sumbawa destinations, categories, and the source-based open trip are discoverable without invented booking data', async () => {
  const values = new Map();
  globalThis.localStorage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'silent' });
  try {
    const data = await vite.ssrLoadModule('/src/features/experiences/data.js');
    const { resultsView } = await vite.ssrLoadModule('/src/features/search/view.js');
    const { experienceView } = await vite.ssrLoadModule('/src/features/experience-detail/view.js');
    const { toExperienceDocument } = await vite.ssrLoadModule('/src/features/experiences/firebase-documents.js');
    const { state } = await vite.ssrLoadModule('/src/app/store.js');
    const ids = ['pulau-kenawa', 'pulau-moyo', 'mata-jitu-waterfall', 'sumbawa-whale-shark', 'sumbawa-open-trip-3d2n'];
    const sumbawaItems = data.getExperiencesByCity('Sumbawa');
    assert.deepEqual(sumbawaItems.map((item) => item.id), ids);
    assert.equal(data.destinations.some((item) => item.name === 'Sumbawa'), true);
    assert.ok(data.getExperiencesByCity('all', 'Waterfall').some((item) => item.id === 'mata-jitu-waterfall'));
    assert.ok(data.getExperiencesByCity('all', 'Open trip').some((item) => item.id === 'sumbawa-open-trip-3d2n'));
    assert.match(resultsView('all', 'Open trip'), /Sumbawa Open Trip: Kenawa, Moyo &amp; Whale Sharks/);

    const trip = data.getExperience('sumbawa-open-trip-3d2n');
    assert.equal(trip.packageItinerary.length, 3);
    assert.equal(trip.packageItinerary[2].items[0].time, 'TBC');
    assert.match(trip.itineraryNote, /not visible in the supplied source/i);
    assert.equal(trip.price, null);
    assert.equal(trip.packageOptions, undefined);
    assert.match(trip.gallery[0], /sumbawa-whale-shark/);
    assert.equal(data.getExperience('sumbawa-whale-shark').image, trip.gallery[0]);

    Object.assign(state, { availabilityChecked: true, date: '2026-10-26', adults: 2, children: 0 });
    const page = experienceView('sumbawa-open-trip-3d2n');
    assert.match(page, /Open trip itinerary/);
    assert.match(page, /Pulau Kenawa/);
    assert.match(page, /Mata Jitu Waterfall/);
    assert.match(page, /Whale shark activity/);
    assert.match(page, /Not included/);
    assert.match(page, /third-night Lombok hotel and airport transfer are explicitly excluded/i);
    assert.match(page, /Price pending/);
    assert.match(page, /Operator confirmation required/);
    assert.doesNotMatch(page, /class="booking-selector"|class="demo-price-preview"|data-action="check-availability"|data-action="show-availability"|href="#\/checkout|\$0(?:\.00)?/);
    assert.match(page, /commons\.wikimedia\.org\/wiki\/File:Pulau_kenawa\.jpg/);

    const doc = toExperienceDocument(trip, undefined);
    assert.equal(doc.pricing.adultBaseCents, null);
    assert.equal(doc.pricing.status, 'pending_operator_confirmation');
    assert.equal(doc.rating, null);
    assert.equal(doc.itinerary.length, 3);
    assert.equal(doc.itinerary[2].items[0].time, 'TBC');
    assert.ok(doc.content.excludes.includes('Transfer out to the airport'));
    assert.ok(doc.mediaAttributions.some((credit) => credit.label.includes('Papudaengoyang')));
  } finally {
    await vite.close();
    delete globalThis.localStorage;
  }
});
