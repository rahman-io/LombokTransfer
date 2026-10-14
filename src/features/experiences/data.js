import rome from '../../assets/images/rome.webp';
import paris from '../../assets/images/paris.webp';
import statue from '../../assets/images/statue.webp';
import vatican from '../../assets/images/vatican.webp';
import wishlist from '../../assets/images/wishlist.webp';
import colosseum from '../../assets/images/colosseum.webp';
import arena from '../../assets/images/arena.webp';
import vaticanTour from '../../assets/images/vatican-tour.webp';
import basilica from '../../assets/images/basilica-clean.webp';
import pantheon from '../../assets/images/pantheon-clean.webp';
import pantheonCard from '../../assets/images/pantheon-card.webp';
import skydiving from '../../assets/images/skydiving-clean.webp';
import kayaking from '../../assets/images/kayaking-clean.webp';
import mapCore from '../../assets/images/rome-map-core.webp';
import login from '../../assets/images/login-clean.webp';
import agafay from '../../assets/images/agafay-clean.webp';
import sumo from '../../assets/images/sumo-clean.webp';
import pantheonThumbA from '../../assets/images/pantheon-thumb-a-clean.webp';
import pantheonThumbB from '../../assets/images/pantheon-thumb-b-clean.webp';
import skydivingThumbA from '../../assets/images/skydiving-thumb-a-clean.webp';
import skydivingThumbB from '../../assets/images/skydiving-thumb-b-clean.webp';
import kayakingThumbA from '../../assets/images/kayaking-thumb-a-clean.webp';
import kayakingThumbB from '../../assets/images/kayaking-thumb-b-clean.webp';

export const images = { rome, paris, statue, vatican, wishlist, colosseum, arena, vaticanTour, basilica, pantheon, pantheonCard, skydiving, kayaking, mapCore, login, agafay, sumo, pantheonThumbA, pantheonThumbB, skydivingThumbA, skydivingThumbB, kayakingThumbA, kayakingThumbB };

export const destinations = [
  { name: 'Rome', image: rome, count: '1,420 activities' },
  { name: 'Paris', image: paris, count: '1,205 activities' },
  { name: 'London', image: wishlist, count: '980 activities' },
];

export const attractions = [
  { name: 'Statue of Liberty', image: statue, city: 'New York', count: '248 activities' },
  { name: 'Vatican Museums', image: vatican, city: 'Rome', count: '530 activities' },
];

export const experiences = [
  {
    id: 'colosseum', title: 'Colosseum, Roman Forum & Palatine Hill Guided Tour',
    city: 'Rome', duration: '2.5 hours', image: colosseum, rating: '4.8', reviews: '92,692',
    price: 55, oldPrice: 69, badge: 'Best match', label: 'Skip the line', popularSearch: true,
    description: 'Step inside Rome’s most iconic ancient monument and discover the stories of the Colosseum, Roman Forum, and Palatine Hill with an expert guide.',
    highlights: ['Explore the Colosseum with an expert guide', 'Discover the Roman Forum and Palatine Hill', 'Hear stories of gladiators and ancient Rome'],
  },
  {
    id: 'arena', title: 'Colosseum Arena Floor, Palatine & Forum Guided Tour',
    city: 'Rome', duration: '2.5 - 3 hours', image: arena, rating: '4.5', reviews: '29,044',
    price: 44, oldPrice: 87, badge: 'Certified', label: 'Skip the line',
    description: 'Walk onto the arena floor and follow your guide through the Colosseum and the heart of ancient Rome.',
    highlights: ['Enter the iconic arena floor', 'Explore the Roman Forum', 'Enjoy stories from an expert guide'],
  },
  {
    id: 'vatican', title: 'Vatican Museums, Sistine Chapel & St. Peter’s Basilica Tour',
    city: 'Rome', duration: '2 - 3 hours', image: vaticanTour, rating: '4.3', reviews: '85,818',
    price: 66, oldPrice: 132, badge: 'Certified', label: 'Skip the line',
    description: 'Discover the remarkable art and architecture of the Vatican Museums, Sistine Chapel, and St. Peter’s Basilica.',
    highlights: ['Admire Michelangelo’s Sistine Chapel ceiling', 'See masterpieces in the Vatican Museums', 'Visit St. Peter’s Basilica'],
  },
  {
    id: 'basilica', title: 'Vatican Museums, Sistine Chapel & Basilica Tour',
    city: 'Rome', duration: '2 - 4 hours', image: basilica, rating: '4.7', reviews: '18,880',
    price: 72, oldPrice: 119, badge: 'Certified', label: 'Skip the line',
    description: 'Explore Vatican highlights with a knowledgeable guide and experience the grandeur of St. Peter’s Basilica.',
    highlights: ['Skip the ticket line', 'See the Sistine Chapel', 'Learn the history of the Vatican'],
  },
  {
    id: 'pantheon', title: 'Rome: Pantheon Official Ticket & App for City Churches',
    city: 'Rome', duration: '1 day', image: pantheon, gallery: [pantheon, pantheonThumbA, pantheonThumbB], cardImage: pantheonCard, rating: '4.1', reviews: '40', featured: true,
    price: 8, oldPrice: 13, badge: 'Likely to sell out', label: 'Audio guide',
    description: 'Access the Pantheon and unlock stories with an audio app on your phone. The audio app is developed as part of the “Oltre la Soglia” project, aimed at promoting all Churches of Rome’s Historic Center.',
    cancellation: { title: 'Cancellation policy', text: 'This activity is non-refundable' }, validity: 'Valid 1 day',
    includes: ['Pantheon entrance ticket', 'Audio guide app', 'Booking confirmation'],
    whatToBring: ['Passport or ID card', 'Charged smartphone'],
    featuredReview: 'Beautiful building but very busy. We asked someone who confirmed where to go and the queues moved pretty quickly.',
    highlights: ['Discover Rome’s Pantheon', 'Explore the stories of historic churches', 'Enjoy an audio guide on your phone'],
  },
  {
    id: 'skydiving', title: 'Queenstown: Tandem Skydive Experience',
    city: 'Queenstown', duration: '3 hours', image: skydiving, gallery: [skydiving, skydivingThumbA, skydivingThumbB], cardImage: skydivingThumbA, rating: '4.8', reviews: '625',
    price: 213, oldPrice: null, badge: '', label: 'Adventure',
    description: 'Experience unrivaled views of stunning Queenstown, reaching speeds of up to 200kph in freefall before enjoying a relaxing flight under canopy.',
    lovedByEnglishSpeakers: true,
    includes: ['Tandem skydive', 'Professional instructor', 'Safety equipment'],
    whatToBring: ['Comfortable clothes', 'Closed-toe shoes'],
    highlights: ['Experience an unforgettable tandem skydive', 'See Queenstown from above', 'Enjoy a scenic flight under canopy'],
  },
  {
    id: 'kayaking', title: 'Split: Illuminated Evening Guided Kayaking Tour',
    city: 'Split', duration: '2.5 hours', image: kayaking, gallery: [kayaking, kayakingThumbA, kayakingThumbB], cardImage: kayakingThumbA, rating: '4.8', reviews: '2,441', featured: true,
    price: 52, oldPrice: null, badge: 'Likely to sell out', label: 'Guided tour', popularSearch: true,
    description: 'Experience a unique kayak adventure in the calm of the evening. Set out on the Adriatic sea in an illuminated, transparent kayak and admire the glowing colors on the water as you explore.',
    lovedByEnglishSpeakers: true,
    includes: ['Transparent illuminated kayak', 'Local guide', 'Safety briefing'],
    whatToBring: ['Clothes that can get wet', 'Water bottle'],
    highlights: ['Paddle a transparent illuminated kayak', 'Explore the Adriatic at night', 'Enjoy the company of a local guide'],
  },
  {
    id: 'agafay', title: 'Marrakech: Agafay Desert Quad & Camel Rides with Dinner Show',
    city: 'Marrakech', duration: '5 hours', image: agafay, rating: '4.9', reviews: '9,164', featured: true,
    price: 60, oldPrice: 68, badge: '', label: 'Dinner included',
    description: 'Discover the Agafay Desert by quad and camel before dinner under the stars.',
    highlights: ['Ride through the Agafay Desert', 'Enjoy a camel ride', 'Watch a traditional dinner show'],
  },
  {
    id: 'sumo', title: 'Tokyo: Shinjuku Sumo Show & Experience with Photo',
    city: 'Tokyo', duration: '75 minutes - 1.5 hours', image: sumo, rating: '4.9', reviews: '9,101', featured: true,
    price: 35, oldPrice: null, badge: 'Likely to sell out', label: 'Cultural experience',
    description: 'Get up close to sumo in Shinjuku and learn about the traditions of Japan’s national sport.',
    highlights: ['Watch a live sumo show', 'Meet the wrestlers', 'Take a memorable photo'],
  },
];

export const getExperience = (id) => experiences.find((item) => item.id === id) || experiences[0];
export const getExperienceGallery = (item) => item.gallery?.length ? item.gallery : [item.image];
export const getFeaturedExperiences = () => experiences.filter((item) => item.featured);
export const getPopularExperiences = () => experiences.filter((item) => item.popularSearch);
export const getExperiencesByCity = (city) => experiences.filter((item) => item.city.toLocaleLowerCase() === city.toLocaleLowerCase());
