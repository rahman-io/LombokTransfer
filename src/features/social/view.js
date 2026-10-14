import { mainLayout } from '../../layouts/MainLayout.js';
import { icon } from '../../components/icons.js';
import { escapeHtml } from '../../utils/html.js';
import { socialImages, socialImage } from './media.js';
import { findChatThreadWith } from '../messaging/repository.js';
import { experiences } from '../experiences/data.js';
import { rankSocialPosts, recommendedSocialUsers, relatedSocialPosts, socialTopics, trendingSocialTopics } from './intelligence.js';
import {
  activeSocialUser, isFollowing, socialActivity, socialFollowerCount, socialFollowingCount,
  socialPost, socialState, socialUser, visibleSocialPosts,
} from './repository.js';

const esc = escapeHtml;
export const socialDraft = { imageKey: 'kayaking', localImage: null, caption: '', location: '', experienceId: null };
export function clearSocialDraft() { socialDraft.imageKey = 'kayaking'; socialDraft.localImage = null; socialDraft.caption = ''; socialDraft.location = ''; socialDraft.experienceId = null; }

function avatar(user, size = '') {
  return `<span class="social-avatar ${size}" style="--avatar-color:${esc(user?.color || '#566d65')}" aria-hidden="true">${esc(user?.initials || '?')}</span>`;
}

function socialHeader(title = 'Travel moments', options = {}) {
  const self = activeSocialUser();
  return `<header class="social-header"><div><span class="social-kicker">LOMBOKTRANSFER COMMUNITY</span><h1>${esc(title)}</h1></div><div class="social-header-actions">${options.back ? `<button class="social-icon-button" data-action="social-back" aria-label="Back">${icon('arrow', 23)}</button>` : `<a class="social-icon-button" href="#/inbox" aria-label="Inbox">${icon('bell', 23)}</a>`}<details class="social-switcher"><summary aria-label="Switch demo account">${avatar(self, 'small')}</summary><div class="social-switcher-menu"><strong>Demo accounts</strong><small>Switch to try interactions as another user.</small>${socialState().users.map((user) => `<button data-action="social-switch-user" data-id="${esc(user.id)}" aria-label="Switch to ${esc(user.displayName)}">${avatar(user, 'tiny')}<span>${esc(user.displayName)}<small>@${esc(user.username)}</small></span>${user.id === self.id ? icon('check', 17) : ''}</button>`).join('')}</div></details></div></header>`;
}

function socialSubnav(active) {
  const tabs = [
    ['feed', 'Feed', '/social'], ['explore', 'Explore', '/social/explore'],
    ['saved', 'Saved', '/social/saved'], ['profile', 'You', `/social/user/${activeSocialUser().id}`],
  ];
  return `<nav class="social-subnav" aria-label="Community sections">${tabs.map(([id, label, path]) => `<a class="${active === id ? 'active' : ''}" href="#${path}" ${active === id ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
}

function postCard(post, recommendationReason = '') {
  const author = socialUser(post.authorId);
  const selfId = activeSocialUser().id;
  const liked = post.likedBy.includes(selfId);
  const saved = post.savedBy.includes(selfId);
  return `<article class="social-post" data-post-id="${esc(post.id)}">
    <div class="social-post-top"><a class="social-author" href="#/social/user/${esc(author.id)}">${avatar(author)}<span><strong>${esc(author.username)}</strong><small>${esc(post.location || author.location)} · ${new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small></span></a><details class="social-post-menu"><summary aria-label="Post options">${icon('more', 22)}</summary><div>${post.authorId === selfId ? `<a href="#/social/edit/${esc(post.id)}">Edit post</a><button data-action="social-delete" data-id="${esc(post.id)}">Delete post</button>` : `<button data-action="social-report" data-id="${esc(post.id)}">Report post</button>`}</div></details></div>
    <a class="social-post-media" href="#/social/post/${esc(post.id)}" aria-label="View post by ${esc(author.username)}"><img src="${esc(socialImage(post))}" alt="${esc(post.location ? `Travel photo in ${post.location}` : `Travel photo by ${author.displayName}`)}" loading="lazy" /></a>
    <div class="social-post-actions"><div><button data-action="social-like" data-id="${esc(post.id)}" class="${liked ? 'is-liked' : ''}" aria-label="${liked ? 'Unlike' : 'Like'} post" aria-pressed="${liked}">${icon('heart', 27)}</button><a href="#/social/post/${esc(post.id)}" aria-label="View comments">${icon('comment', 27)}</a><button data-action="social-share" data-id="${esc(post.id)}" aria-label="Share post">${icon('share', 25)}</button></div><button data-action="social-save" data-id="${esc(post.id)}" class="${saved ? 'is-saved' : ''}" aria-label="${saved ? 'Remove saved post' : 'Save post'}" aria-pressed="${saved}">${icon('bookmark', 26)}</button></div>
    <div class="social-post-copy">${recommendationReason ? `<small class="social-ai-reason">${icon('sparkle', 13)} ${esc(recommendationReason)}</small>` : ''}<strong>${post.likedBy.length} ${post.likedBy.length === 1 ? 'like' : 'likes'}</strong><p><a href="#/social/user/${esc(author.id)}">${esc(author.username)}</a>${post.caption ? ` ${esc(post.caption)}` : ''}</p>${socialTopics(post).length ? `<div class="social-post-topics">${socialTopics(post).slice(0, 3).map((topic) => `<a class="social-topic-tag" href="#/social/explore?topic=${encodeURIComponent(topic)}">#${esc(topic)}</a>`).join('')}</div>` : ''}${post.experienceId ? `<a class="social-post-experience" href="#/experience/${esc(post.experienceId)}?from=vibes">${icon('tickets', 16)} Explore this experience</a>` : ''}<a class="social-comments-link" href="#/social/post/${esc(post.id)}">${post.comments.length ? `View all ${post.comments.length} comments` : 'Add a comment'}</a></div>
  </article>`;
}

function emptyState(title, message) {
  return `<div class="social-empty">${icon('image', 38)}<h2>${esc(title)}</h2><p>${esc(message)}</p></div>`;
}

function topicRow(topics, title = 'Trending now') {
  if (!topics.length) return '';
  return `<section class="social-topics"><div class="social-section-heading"><h2>${esc(title)}</h2><span>${icon('sparkle', 15)} Vibes Intelligence</span></div><div class="social-topic-row">${topics.map(({ topic, count }) => `<a href="#/social/explore?topic=${encodeURIComponent(topic)}">#${esc(topic)} <small>${count}</small></a>`).join('')}</div></section>`;
}

function peopleToFollow(users) {
  if (!users.length) return '';
  return `<section class="social-people"><div class="social-section-heading"><h2>People to follow</h2><span>${icon('sparkle', 15)} For you</span></div><div class="social-people-row">${users.map(({ user, reason }) => `<article class="social-person-card">${avatar(user, 'small')}<strong>${esc(user.displayName)}</strong><small>@${esc(user.username)}</small><em>${esc(reason)}</em><button data-action="social-follow" data-id="${esc(user.id)}">Follow</button></article>`).join('')}</div></section>`;
}

export function socialFeedView(followingOnly = false) {
  const self = activeSocialUser();
  const allPosts = visibleSocialPosts();
  const ranked = rankSocialPosts(allPosts, self.id, socialState().follows);
  const rankedReasons = new Map(ranked.map(({ post, reason }) => [post.id, reason]));
  const posts = (followingOnly ? allPosts.filter((post) => post.authorId === self.id || isFollowing(post.authorId)) : ranked.map(({ post }) => post));
  const stories = [self, ...socialState().users.filter((user) => user.id !== self.id)].slice(0, 6);
  const suggestions = recommendedSocialUsers(socialState().users, allPosts, socialState().follows, self.id);
  return mainLayout(`<div class="social-page">${socialHeader()}${socialSubnav('feed')}<div class="social-demo-note">Demo community · Interactions are saved on this device</div><div class="social-intelligence-banner">${icon('sparkle', 18)}<span><strong>Vibes Intelligence</strong><small>${followingOnly ? 'Your followed travelers, in one place.' : 'A For you feed tuned to your travel taste.'}</small></span></div><div class="social-stories">${stories.map((user) => `<a href="#/social/user/${esc(user.id)}">${avatar(user, 'story')}<span>${user.id === self.id ? 'Your profile' : esc(user.displayName.split(' ')[0])}</span></a>`).join('')}</div>${followingOnly ? '' : topicRow(trendingSocialTopics(allPosts))}${followingOnly ? '' : peopleToFollow(suggestions)}<div class="social-feed-heading"><div class="social-feed-switch"><a href="#/social" class="${!followingOnly ? 'active' : ''}">For you</a><a href="#/social?feed=following" class="${followingOnly ? 'active' : ''}">Following</a></div><a class="social-create-link" href="#/social/create">${icon('plus', 18)} Post</a></div>${posts.length ? posts.map((post) => postCard(post, followingOnly ? '' : rankedReasons.get(post.id))).join('') : emptyState('Nothing here yet', 'Follow travelers to see their posts here.')}</div>`, 'Community', { className: 'social-main' });
}

export function socialExploreView(topic = '') {
  const self = activeSocialUser();
  const allPosts = visibleSocialPosts();
  const posts = rankSocialPosts(allPosts.filter((post) => !topic || socialTopics(post).includes(topic)), self.id, socialState().follows).map(({ post }) => post);
  const suggestions = recommendedSocialUsers(socialState().users, allPosts, socialState().follows, self.id);
  return mainLayout(`<div class="social-page">${socialHeader('Explore')}${socialSubnav('explore')}${topicRow(trendingSocialTopics(allPosts), topic ? `Explore #${topic}` : 'Trending travel')}${peopleToFollow(suggestions)}<div class="social-explore-intro"><h2>Where to next?</h2><p>Travel inspiration from our demo community.</p><label class="social-search">${icon('search', 19)}<input id="social-search" type="search" placeholder="Search places, people or posts" autocomplete="off" /></label></div><div class="social-explore-grid" id="social-explore-grid">${posts.map((post) => `<a href="#/social/post/${esc(post.id)}" data-search-text="${esc(`${post.caption} ${post.location} ${socialUser(post.authorId)?.username}`.toLowerCase())}" aria-label="Post from ${esc(post.location)}"><img src="${esc(socialImage(post))}" alt="${esc(post.location)}" loading="lazy" /><span>${icon('heart', 15)} ${post.likedBy.length}</span></a>`).join('')}</div><p class="social-search-empty" id="social-search-empty" hidden>No matching posts.</p></div>`, 'Community', { className: 'social-main' });
}

export function socialSavedView() {
  const posts = visibleSocialPosts().filter((post) => post.savedBy.includes(activeSocialUser().id));
  return mainLayout(`<div class="social-page">${socialHeader('Saved posts')}${socialSubnav('saved')}<div class="social-section-intro"><h2>Keep the inspiration</h2><p>Only you can see what you saved in this demo account.</p></div>${posts.length ? posts.map(postCard).join('') : emptyState('No saved posts yet', 'Tap the bookmark on a post to find it here.')}</div>`, 'Community', { className: 'social-main' });
}

export function socialProfileView(userId) {
  const person = socialUser(userId);
  if (!person) return socialFeedView();
  const self = activeSocialUser();
  const own = person.id === self.id;
  const posts = visibleSocialPosts().filter((post) => post.authorId === person.id);
  return mainLayout(`<div class="social-page">${socialHeader('Profile', { back: true })}${socialSubnav(own ? 'profile' : '')}<section class="social-profile"><div class="social-profile-head">${avatar(person, 'large')}<div><strong>${posts.length}<small>posts</small></strong><strong>${socialFollowerCount(person.id)}<small>followers</small></strong><strong>${socialFollowingCount(person.id)}<small>following</small></strong></div></div><h2>${esc(person.displayName)} ${person.role === 'guide' ? '<span class="social-role">Local guide</span>' : ''}</h2><span class="social-handle">@${esc(person.username)}</span><p>${esc(person.bio)}</p><small>${icon('pin', 15)} ${esc(person.location)}</small><div class="social-profile-actions">${own ? `<a class="primary-button" href="#/social/create">${icon('plus', 18)} Create post</a>` : `<button class="primary-button ${isFollowing(person.id) ? 'following' : ''}" data-action="social-follow" data-id="${esc(person.id)}">${isFollowing(person.id) ? 'Following' : 'Follow'}</button>${findChatThreadWith(person.id) ? `<a class="outline-button social-message-button" href="#/inbox/chat/${esc(findChatThreadWith(person.id).id)}">Message</a>` : `<button class="outline-button social-message-button" data-action="chat-user" data-id="${esc(person.id)}">Message</button>`}`}</div></section><div class="social-grid-label">${icon('image', 18)} POSTS</div><div class="social-profile-grid">${posts.map((post) => `<a href="#/social/post/${esc(post.id)}"><img src="${esc(socialImage(post))}" alt="${esc(post.location)}" loading="lazy" /></a>`).join('')}</div>${posts.length ? '' : emptyState('No posts yet', 'Share the first travel moment.')}</div>`, 'Community', { className: 'social-main' });
}

export function socialPostView(postId) {
  const post = socialPost(postId);
  if (!post) return mainLayout(`<div class="social-page">${socialHeader('Post', { back: true })}${emptyState('Post unavailable', 'This post may have been deleted.')}</div>`, 'Community', { className: 'social-main' });
  const related = relatedSocialPosts(post, visibleSocialPosts());
  return mainLayout(`<div class="social-page">${socialHeader('Post', { back: true })}${postCard(post)}<section class="social-comment-section"><h2>Comments</h2>${post.comments.length ? post.comments.map((comment) => { const author = socialUser(comment.authorId); return `<div class="social-comment">${avatar(author, 'small')}<p><a href="#/social/user/${esc(author.id)}">${esc(author.username)}</a> ${esc(comment.text)}<small>${new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small></p>${comment.authorId === activeSocialUser().id ? `<button data-action="social-delete-comment" data-id="${esc(post.id)}" data-value="${esc(comment.id)}" aria-label="Delete your comment">${icon('close', 17)}</button>` : ''}</div>`; }).join('') : '<p class="muted">Be the first to comment.</p>'}<form class="social-comment-form" id="social-comment-form"><input name="comment" type="text" maxlength="500" placeholder="Add a comment..." aria-label="Add a comment" required /><button type="submit" aria-label="Post comment">Post</button></form></section>${post.experienceId ? `<a class="social-tour-link" href="#/experience/${esc(post.experienceId)}?from=vibes">Explore this experience ${icon('chevron', 18)}</a>` : ''}${related.length ? `<section class="social-related"><div class="social-section-heading"><h2>More like this</h2><span>${icon('sparkle', 15)} AI picks</span></div><div class="social-related-grid">${related.map(({ post: item }) => `<a href="#/social/post/${esc(item.id)}"><img src="${esc(socialImage(item))}" alt="${esc(item.location)}" loading="lazy" /><strong>${esc(item.location || 'Travel moment')}</strong><small>${item.likedBy.length} likes</small></a>`).join('')}</div></section>` : ''}</div>`, 'Community', { className: 'social-main' });
}

export function socialCreateView(experienceId = '') {
  if (experienceId && experiences.some((item) => item.id === experienceId)) socialDraft.experienceId = experienceId;
  const photo = socialDraft.localImage || socialImages[socialDraft.imageKey];
  return mainLayout(`<div class="social-page">${socialHeader('New post', { back: true })}<form class="social-compose" id="social-compose-form"><div class="social-compose-author">${avatar(activeSocialUser())}<span><strong>${esc(activeSocialUser().displayName)}</strong><small>Sharing to Travel moments · Demo</small></span></div><div class="social-compose-image"><img src="${esc(photo)}" alt="Selected post photo" /></div><label class="social-upload-button">${icon('image', 19)} Choose photo from device<input id="social-photo-input" type="file" accept="image/*" hidden /></label><p class="social-compose-or">or choose a demo travel photo</p><div class="social-photo-choices">${Object.entries(socialImages).slice(0, 10).map(([key, url]) => `<button type="button" data-action="social-select-photo" data-value="${esc(key)}" aria-label="Use ${esc(key)} photo" class="${!socialDraft.localImage && socialDraft.imageKey === key ? 'selected' : ''}"><img src="${esc(url)}" alt="" /></button>`).join('')}</div><label>Caption<textarea name="caption" maxlength="2200" rows="4" placeholder="Tell the story behind this moment...">${esc(socialDraft.caption)}</textarea></label><label>Location<input name="location" maxlength="100" placeholder="Where was this taken?" value="${esc(socialDraft.location)}" /></label><label>Attach a Discover experience<select id="social-experience-select"><option value="">No experience attached</option>${experiences.map((item) => `<option value="${esc(item.id)}" ${socialDraft.experienceId === item.id ? 'selected' : ''}>${esc(item.title)}</option>`).join('')}</select></label><button class="primary-button full" type="submit">Share post</button><p class="social-compose-note">This is a local demo. Your post is saved only on this device; it is not public or synced yet.</p></form></div>`, 'Community', { className: 'social-main' });
}

export function socialEditView(postId) {
  const post = socialPost(postId);
  if (!post || post.authorId !== activeSocialUser().id) return socialFeedView();
  return mainLayout(`<div class="social-page">${socialHeader('Edit post', { back: true })}<form class="social-compose" id="social-edit-form"><div class="social-compose-image"><img src="${esc(socialImage(post))}" alt="Post photo" /></div><label>Caption<textarea name="caption" maxlength="2200" rows="5" placeholder="Tell the story behind this moment...">${esc(post.caption)}</textarea></label><label>Location<input name="location" maxlength="100" value="${esc(post.location)}" placeholder="Where was this taken?" /></label><button class="primary-button full" type="submit">Save changes</button></form></div>`, 'Community', { className: 'social-main' });
}

export function socialActivityView() {
  const events = socialActivity(activeSocialUser().id).slice(0, 30);
  return mainLayout(`<div class="social-page">${socialHeader('Activity', { back: true })}<div class="social-section-intro"><h2>Your activity</h2><p>Likes, comments and follows from demo travelers.</p></div><div class="social-activity-list">${events.length ? events.map((event) => { const user = socialUser(event.actorId); const label = event.kind === 'like' ? 'liked your post' : event.kind === 'comment' ? 'commented on your post' : 'started following you'; return `<a href="#${event.post ? `/social/post/${esc(event.post.id)}` : `/social/user/${esc(user.id)}`}">${avatar(user, 'small')}<span><strong>${esc(user.username)}</strong> ${label}</span>${event.post ? `<img src="${esc(socialImage(event.post))}" alt="" />` : ''}</a>`; }).join('') : emptyState('No activity yet', 'Interactions with your posts will appear here.')}</div></div>`, 'Community', { className: 'social-main' });
}
