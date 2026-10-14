import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { serverTimestamp } from 'firebase/firestore';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';

const env = await initializeTestEnvironment({
  projectId: 'demo-lombok-transfer',
  firestore: { rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8') },
  storage: { rules: readFileSync(new URL('../storage.rules', import.meta.url), 'utf8') },
});

const guest = env.unauthenticatedContext();
const user = env.authenticatedContext('user-1');
const anotherUser = env.authenticatedContext('user-2');
const guide = env.authenticatedContext('guide-1');
const owner = env.authenticatedContext('owner-1');
const admin = env.authenticatedContext('admin-1', { admin: true });
const doc = (context, path) => context.firestore().doc(path);

await env.withSecurityRulesDisabled(async (context) => {
  const db = context.firestore();
  const batch = db.batch();
  for (const [path, value] of Object.entries({
    'users/user-1': { displayName: 'User one' },
    'users/user-2': { displayName: 'User two' },
    'organizations/org-1': { status: 'draft' },
    'organizations/org-1/members/owner-1': { active: true, roles: ['owner'] },
    'experiences/public-tour': { status: 'published', organizationId: 'org-1', guideIds: [] },
    'experiences/draft-tour': { status: 'draft', organizationId: 'org-1', guideIds: ['guide-1'] },
    'bookings/booking-1': { userId: 'user-1', organizationId: 'org-1' },
    'guideAssignments/assignment-1': { guideId: 'guide-1', organizationId: 'org-1' },
    'reviews/approved-review': { status: 'approved', userId: 'user-1' },
    'reviews/draft-review': { status: 'draft', userId: 'user-1' },
    'media/draft-image': { status: 'draft', organizationId: 'org-1' },
  })) batch.set(db.doc(path), value);
  await batch.commit();
});

test('published catalog is public; drafts are scoped to guide, owner, or admin', async () => {
  await assertSucceeds(doc(guest, 'experiences/public-tour').get());
  await assertFails(doc(guest, 'experiences/draft-tour').get());
  await assertFails(doc(user, 'experiences/draft-tour').get());
  await assertSucceeds(doc(guide, 'experiences/draft-tour').get());
  await assertSucceeds(doc(owner, 'experiences/draft-tour').get());
  await assertSucceeds(doc(admin, 'experiences/draft-tour').get());
  await assertFails(doc(guest, 'media/draft-image').get());
  await assertSucceeds(doc(owner, 'media/draft-image').get());
});

test('personal data and bookings cannot be read across users', async () => {
  await assertSucceeds(doc(user, 'users/user-1').get());
  await assertFails(doc(anotherUser, 'users/user-1').get());
  await assertSucceeds(doc(user, 'bookings/booking-1').get());
  await assertFails(doc(anotherUser, 'bookings/booking-1').get());
  await assertFails(doc(guide, 'bookings/booking-1').get());
  await assertSucceeds(doc(owner, 'bookings/booking-1').get());
  await assertSucceeds(doc(guide, 'guideAssignments/assignment-1').get());
  await assertFails(doc(user, 'guideAssignments/assignment-1').get());
  await assertSucceeds(doc(guest, 'reviews/approved-review').get());
  await assertFails(doc(guest, 'reviews/draft-review').get());
});

test('clients cannot grant roles or alter trusted catalog data', async () => {
  await assertFails(doc(user, 'organizations/org-1/members/user-1').set({ active: true, roles: ['owner'] }));
  await assertFails(doc(owner, 'organizations/org-1/members/user-1').set({ active: true, roles: ['manager'] }));
  await assertFails(doc(owner, 'experiences/draft-tour').update({ status: 'published' }));
  await assertFails(doc(user, 'bookings/booking-1').update({ status: 'paid' }));
  await assertSucceeds(doc(admin, 'experiences/draft-tour').update({ title: 'Reviewed draft' }));
});

test('wishlist writes are self-scoped', async () => {
  const wishlist = doc(user, 'users/user-1/wishlists/public-tour');
  await assertSucceeds(wishlist.set({ experienceId: 'public-tour', createdAt: serverTimestamp() }));
  await assertFails(doc(anotherUser, 'users/user-1/wishlists/other-tour').set({ experienceId: 'other-tour', createdAt: serverTimestamp() }));
  await assertFails(wishlist.update({ experienceId: 'draft-tour' }));
  await assertSucceeds(wishlist.delete());
});

test('only admins can upload approved image types to public storage', async () => {
  const imagePath = 'public/experiences/public-tour/test.webp';
  await assertFails(guest.storage().ref(imagePath).putString('image', 'raw', { contentType: 'image/webp' }));
  await assertFails(user.storage().ref(imagePath).putString('image', 'raw', { contentType: 'image/webp' }));
  await assertFails(admin.storage().ref('public/experiences/public-tour/test.txt').putString('text', 'raw', { contentType: 'text/plain' }));
  await assertSucceeds(admin.storage().ref(imagePath).putString('image', 'raw', { contentType: 'image/webp' }));
  await assertSucceeds(guest.storage().ref(imagePath).getDownloadURL());
});

test.after(async () => {
  await env.cleanup();
});
