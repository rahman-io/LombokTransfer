import { images } from '../experiences/data.js';

export const socialImages = {
  kayaking: images.kayaking,
  kayakingSunset: images.kayakingThumbB,
  skydiving: images.skydiving,
  skydivingFriends: images.skydivingThumbA,
  pantheon: images.pantheon,
  pantheonDetail: images.pantheonThumbB,
  rome: images.rome,
  paris: images.paris,
  agafay: images.agafay,
  sumo: images.sumo,
  vatican: images.vaticanTour,
  colosseum: images.colosseum,
};

export function socialImage(post) { return post.localImage || socialImages[post.imageKey] || socialImages.kayaking; }
