import { demoSocialFollows, demoSocialPosts, demoSocialUsers, socialDemoImageKeys } from './data.js';
import { trackSocialSignal } from '../recommendations/repository.js';
import { rankSocialActivity, socialModerationQueue } from './intelligence.js';

const STORAGE_KEY = 'lombok-social-demo-v1';
const clone = (value) => JSON.parse(JSON.stringify(value));
const now = () => new Date().toISOString();

export function createSeedSocialState() {
  return {
    schemaVersion: 1,
    activeUserId: 'rahman',
    users: clone(demoSocialUsers),
    posts: clone(demoSocialPosts).map((post) => ({ ...post, schemaVersion: 1, status: 'published', localImage: null, media: Array.isArray(post.media) && post.media.length ? post.media : [{ id: `${post.id}-media-1`, imageKey: post.imageKey, localImage: null, storagePath: null }], shares: Array.isArray(post.shares) ? post.shares : [] })),
    follows: clone(demoSocialFollows),
    reports: [],
  };
}

function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.schemaVersion === 1 && Array.isArray(saved.users) && Array.isArray(saved.posts) && Array.isArray(saved.follows) && Array.isArray(saved.reports) && saved.users.some((user) => user.id === saved.activeUserId)) {
      const seeds = new Map(demoSocialPosts.map((post) => [post.id, post]));
      saved.posts = saved.posts.map((post) => {
        const seed = seeds.get(post.id);
        const media = Array.isArray(post.media) && post.media.length ? post.media : seed?.media || [{ id: `${post.id}-media-1`, imageKey: post.imageKey, localImage: post.localImage || null, storagePath: null }];
        return { ...post, media, shares: Array.isArray(post.shares) ? post.shares : [], shareCount: post.shareCount ?? seed?.shareCount ?? 0 };
      });
      return saved;
    }
  } catch { /* Demo data remains available when storage is blocked. */ }
  return createSeedSocialState();
}

let currentState;
export function socialState() {
  currentState ||= readState();
  return currentState;
}

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(socialState())); return true; }
  catch { return false; }
}

export function activeSocialUser() { return socialState().users.find((user) => user.id === socialState().activeUserId); }
export function socialUser(id) { return socialState().users.find((user) => user.id === id); }
export function socialPost(id) { return socialState().posts.find((post) => post.id === id && post.status === 'published'); }
export function visibleSocialPosts() { return [...socialState().posts].filter((post) => post.status === 'published').sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
export function socialPostsForExperience(experienceId) { return visibleSocialPosts().filter((post) => post.experienceId === experienceId); }
export function isFollowing(targetId) { return socialState().follows.some(([followerId, followingId]) => followerId === socialState().activeUserId && followingId === targetId); }
export function socialFollowerCount(userId) { return socialState().follows.filter(([, targetId]) => targetId === userId).length; }
export function socialFollowingCount(userId) { return socialState().follows.filter(([sourceId]) => sourceId === userId).length; }

export function switchSocialUser(userId) {
  if (!socialUser(userId)) return false;
  socialState().activeUserId = userId;
  return persist();
}

export function toggleSocialLike(postId) {
  const post = socialPost(postId);
  if (!post) return false;
  const id = socialState().activeUserId;
  const wasLiked = post.likedBy.includes(id);
  post.likedBy = wasLiked ? post.likedBy.filter((userId) => userId !== id) : [...post.likedBy, id];
  if (!wasLiked) trackSocialSignal(post, 'like');
  return persist();
}

export function toggleSocialSave(postId) {
  const post = socialPost(postId);
  if (!post) return false;
  const id = socialState().activeUserId;
  const wasSaved = post.savedBy.includes(id);
  post.savedBy = wasSaved ? post.savedBy.filter((userId) => userId !== id) : [...post.savedBy, id];
  if (!wasSaved) trackSocialSignal(post, 'save');
  return persist();
}

export function socialShareCount(post) { return Array.isArray(post?.shares) && post.shares.length ? post.shares.length : Number(post?.shareCount || 0); }

export function recordSocialShare(postId, recipientId = null) {
  const post = socialPost(postId);
  const senderId = socialState().activeUserId;
  if (!post || !recipientId || !socialUser(recipientId) || recipientId === senderId) return false;
  post.shares ||= [];
  post.shares.push({ id: `share-${crypto.randomUUID()}`, userId: senderId, recipientId, createdAt: now(), channel: 'chat' });
  post.shareCount = post.shares.length;
  return persist();
}

export function toggleSocialFollow(targetId) {
  const actor = socialState().activeUserId;
  if (!socialUser(targetId) || targetId === actor) return false;
  const rows = socialState().follows;
  socialState().follows = isFollowing(targetId) ? rows.filter(([from, to]) => from !== actor || to !== targetId) : [...rows, [actor, targetId]];
  return persist();
}

export function addSocialComment(postId, text, parentId = null) {
  const post = socialPost(postId);
  const clean = String(text || '').trim().slice(0, 500);
  const parent = parentId ? post?.comments.find((comment) => comment.id === parentId) : null;
  if (!post || !clean || (parentId && !parent)) return false;
  post.comments.push({ id: `comment-${crypto.randomUUID()}`, authorId: socialState().activeUserId, text: clean, createdAt: now(), parentId: parent?.id || null });
  trackSocialSignal(post, 'comment');
  return persist();
}

export function deleteSocialComment(postId, commentId) {
  const post = socialPost(postId);
  const comment = post?.comments.find((item) => item.id === commentId);
  if (!comment || comment.authorId !== socialState().activeUserId) return false;
  post.comments = post.comments.filter((item) => item.id !== commentId);
  return persist();
}

export function createSocialPost({ caption, location, imageKey, localImage, media = [], experienceId = null }) {
  const cleanCaption = String(caption || '').trim().slice(0, 2200);
  const cleanLocation = String(location || '').trim().slice(0, 100);
  const selectedMedia = Array.isArray(media) ? media.filter((item) => item?.imageKey || item?.localImage).slice(0, 10) : [];
  if (!selectedMedia.length && !socialDemoImageKeys.includes(imageKey) && !localImage) return null;
  const normalizedMedia = selectedMedia.length ? selectedMedia.map((item, index) => ({ id: item.id || `media-${crypto.randomUUID()}-${index}`, imageKey: item.localImage ? null : item.imageKey, localImage: item.localImage || null, storagePath: null })) : [{ id: `media-${crypto.randomUUID()}-1`, imageKey: localImage ? null : imageKey, localImage: localImage || null, storagePath: null }];
  const post = {
    id: `post-${crypto.randomUUID()}`,
    schemaVersion: 1,
    authorId: socialState().activeUserId,
    createdAt: now(),
    status: 'published',
    location: cleanLocation,
    caption: cleanCaption,
    imageKey: localImage ? null : imageKey,
    localImage: localImage || null,
    media: normalizedMedia,
    experienceId: experienceId || null,
    likedBy: [],
    savedBy: [],
    shares: [],
    shareCount: 0,
    comments: [],
  };
  socialState().posts.unshift(post);
  if (!persist()) { socialState().posts.shift(); return null; }
  if (post.experienceId) trackSocialSignal(post, 'post');
  return post;
}

export function deleteSocialPost(postId) {
  const post = socialPost(postId);
  if (!post || post.authorId !== socialState().activeUserId) return false;
  post.status = 'deleted';
  return persist();
}

export function editSocialPost(postId, { caption, location }) {
  const post = socialPost(postId);
  if (!post || post.authorId !== socialState().activeUserId) return false;
  post.caption = String(caption || '').trim().slice(0, 2200);
  post.location = String(location || '').trim().slice(0, 100);
  post.updatedAt = now();
  return persist();
}

export function reportSocialPost(postId, reason = 'inappropriate') {
  const post = socialPost(postId);
  const reporterId = socialState().activeUserId;
  if (!post || post.authorId === reporterId || socialState().reports.some((report) => report.postId === postId && report.reporterId === reporterId)) return false;
  socialState().reports.push({ id: `report-${crypto.randomUUID()}`, postId, reporterId, reason, status: 'open', createdAt: now() });
  return persist();
}

export function socialActivity(userId) {
  const events = [];
  for (const post of visibleSocialPosts().filter((item) => item.authorId === userId)) {
    for (const actorId of post.likedBy.filter((id) => id !== userId)) events.push({ id: `${post.id}-like-${actorId}`, actorId, kind: 'like', post, createdAt: post.createdAt });
    for (const comment of post.comments.filter((item) => item.authorId !== userId)) events.push({ id: comment.id, actorId: comment.authorId, kind: 'comment', post, createdAt: comment.createdAt });
  }
  for (const [actorId, targetId] of socialState().follows) if (targetId === userId) events.push({ id: `follow-${actorId}-${targetId}`, actorId, kind: 'follow', createdAt: '2026-10-12T12:00:00Z' });
  return rankSocialActivity(events, socialState().follows, userId);
}

export function socialModerationItems() { return socialModerationQueue(socialState()); }

// Exportable seed/current shape: relationship records become separate Firebase documents.
export function toSocialFirebaseFixture(source = socialState()) {
  const publishedPosts = source.posts.filter((post) => post.status === 'published');
  return {
    socialProfiles: source.users.map(({ id, username, displayName, bio, location, role, initials, color }) => ({ id, username, displayName, bio, location, role, initials, color, schemaVersion: 1, createdAt: '2026-10-01T00:00:00Z', updatedAt: null })),
    socialPosts: publishedPosts.map((post) => ({
      id: post.id, schemaVersion: 1, authorId: post.authorId, status: 'draft',
      caption: post.caption, location: post.location, experienceId: post.experienceId,
      createdAt: post.createdAt, updatedAt: null,
      media: (Array.isArray(post.media) && post.media.length ? post.media : [{ imageKey: post.imageKey, localImage: post.localImage }]).map((item) => ({ assetKey: item.imageKey || null, storagePath: item.storagePath || null, needsUpload: true })),
    })),
    likes: publishedPosts.flatMap((post) => post.likedBy.map((userId) => ({ postId: post.id, userId, createdAt: post.createdAt }))),
    saves: publishedPosts.flatMap((post) => post.savedBy.map((userId) => ({ postId: post.id, userId, createdAt: post.createdAt }))),
    comments: publishedPosts.flatMap((post) => post.comments.map((comment) => ({ ...comment, postId: post.id }))),
    shares: publishedPosts.flatMap((post) => (post.shares || []).map((share) => ({ ...share, postId: post.id }))),
    follows: source.follows.map(([followerId, followingId]) => ({ followerId, followingId, createdAt: '2026-10-01T00:00:00Z' })),
    reports: source.reports.map((report) => ({ ...report })),
    moderationQueue: socialModerationQueue(source).map(({ post, safety }) => ({ postId: post.id, ...safety })),
  };
}

export async function prepareSocialPhoto(file) {
  if (!file?.type.startsWith('image/') || file.size > 8 * 1024 * 1024) throw new Error('Choose an image smaller than 8 MB.');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, 1000 / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
    if (dataUrl.length > 900000) throw new Error('This image is too large for the local demo.');
    return dataUrl;
  } finally { URL.revokeObjectURL(url); }
}
