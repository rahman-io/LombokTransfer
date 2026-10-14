import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildTripItinerary, getTripIntent, toTripItineraryFirebaseFixture } from '../src/features/trip-intelligence/repository.js';

test('smart trip intent and itinerary use saved and social travel signals', () => {
  const experiences = [
    { id: 'pantheon', title: 'Pantheon ticket', city: 'Rome', label: 'Audio guide', price: 8, duration: '1 day', rating: '4.1' },
    { id: 'vatican', title: 'Vatican tour', city: 'Rome', label: 'Skip the line', price: 66, duration: '2 hours', rating: '4.3' },
    { id: 'colosseum', title: 'Colosseum tour', city: 'Rome', label: 'Skip the line', price: 55, duration: '2.5 hours', rating: '4.8' },
    { id: 'sumo', title: 'Sumo show', city: 'Tokyo', label: 'Cultural experience', price: 35, duration: '75 minutes', rating: '4.9' },
  ];
  const userState = { wishlist: ['pantheon', 'vatican'] };
  const socialContext = { userId: 'demo-user', posts: [{ experienceId: 'pantheon', likedBy: ['demo-user'], savedBy: [], comments: [] }] };
  const intent = getTripIntent(userState, experiences, socialContext);
  assert.equal(intent.destination, 'Rome');
  assert.equal(intent.id, 'culture');
  const itinerary = buildTripItinerary({ destination: 'Rome', days: 3, budget: 'mid', catalog: experiences, userState, socialContext });
  assert.equal(itinerary.schemaVersion, 1);
  assert.equal(itinerary.itinerary.length, 3);
  assert.equal(toTripItineraryFirebaseFixture(itinerary).status, 'draft');
});
