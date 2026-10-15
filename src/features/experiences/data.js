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
import { demoBookingData } from './booking-demo.js';
import { toExperienceDocument, toMediaDocuments, toDestinationDocument, toTileMediaDocument } from './firebase-documents.js';

export const images = { rome, paris, statue, vatican, wishlist, colosseum, arena, vaticanTour, basilica, pantheon, pantheonCard, skydiving, kayaking, mapCore, login, agafay, sumo, pantheonThumbA, pantheonThumbB, skydivingThumbA, skydivingThumbB, kayakingThumbA, kayakingThumbB };

export const destinations = [
  { name: 'Lombok', location: 'NTB, Indonesia', image: rome, count: '1,420 activities', rating: '4.8' },
  { name: 'Mataram', location: 'NTB, Indonesia', image: paris, count: '1,205 activities', rating: '4.8' },
  { name: 'Sembalun', location: 'East Lombok, NTB', image: wishlist, count: '980 activities', rating: '4.7' },
];

export const attractions = [
  { name: 'Mount Rinjani', image: statue, city: 'Sembalun', count: '248 activities' },
  { name: 'Tanjung Aan Beach', image: vatican, city: 'Lombok', count: '530 activities' },
];

export const experiences = [
  {
    id: 'colosseum', title: 'Lombok: Tanjung Aan Beach & Kuta Coast Guided Tour',
    city: 'Lombok', duration: '2.5 hours', image: colosseum, rating: '4.8', reviews: '92,692',
    price: 55, oldPrice: 69, badge: 'Best match', label: 'Skip the line', popularSearch: true,
    description: 'Explore the white sands and turquoise water of Tanjung Aan while discovering the landscapes around Lombok’s Kuta coast with a local guide.',
    highlights: ['Visit Tanjung Aan Beach', 'Explore the Kuta coast', 'Hear stories from a local guide'],
  },
  {
    id: 'arena', title: 'Lombok: Mount Rinjani National Park & Sembalun Tour',
    city: 'Lombok', duration: '2.5 - 3 hours', image: arena, rating: '4.5', reviews: '29,044',
    price: 44, oldPrice: 87, badge: 'Certified', label: 'Skip the line',
    description: 'Discover the foothills and viewpoints around Mount Rinjani National Park with a local guide based near Sembalun.',
    highlights: ['Explore Rinjani landscapes', 'Visit Sembalun viewpoints', 'Enjoy stories from a local guide'],
  },
  {
    id: 'vatican', title: 'Lombok: Sendang Gile & Tiu Kelep Waterfalls Tour',
    city: 'Lombok', duration: '2 - 3 hours', image: vaticanTour, rating: '4.3', reviews: '85,818',
    price: 66, oldPrice: 132, badge: 'Certified', label: 'Skip the line',
    description: 'Travel through North Lombok to discover Sendang Gile and Tiu Kelep, two of the island’s best-known waterfalls.',
    highlights: ['Visit Sendang Gile Waterfall', 'Discover Tiu Kelep Waterfall', 'Explore North Lombok with a guide'],
  },
  {
    id: 'basilica', title: 'Lombok: Benang Stokel & Benang Kelambu Waterfalls Tour',
    city: 'Lombok', duration: '2 - 4 hours', image: basilica, rating: '4.7', reviews: '18,880',
    price: 72, oldPrice: 119, badge: 'Certified', label: 'Skip the line',
    description: 'Explore Central Lombok’s Benang Stokel and Benang Kelambu waterfalls with time to enjoy the surrounding forest.',
    highlights: ['Visit Benang Stokel Waterfall', 'Discover Benang Kelambu Waterfall', 'Walk through the surrounding forest'],
  },
  {
    id: 'pantheon', title: 'Lombok: Gili Islands Island-Hopping Experience',
    city: 'Lombok', duration: '1 day', image: pantheon, gallery: [pantheon, pantheonThumbA, pantheonThumbB], cardImage: pantheonCard, rating: '4.1', reviews: '40', featured: true,
    price: 8, oldPrice: 13, badge: 'Likely to sell out', label: 'Audio guide',
    description: 'Spend a day exploring the Gili Islands, with time for the sea, beaches, and relaxed island views off Lombok’s northwest coast.',
    cancellation: { title: 'Cancellation policy', text: 'This activity is non-refundable' }, validity: 'Valid 1 day',
    includes: ['Island-hopping experience', 'Local guide', 'Booking confirmation'],
    whatToBring: ['Passport or ID card', 'Charged smartphone'],
    featuredReview: 'A relaxed way to compare the islands and plan a day around the water. Check the sea conditions before departure.',
    highlights: ['Explore the Gili Islands', 'Enjoy time by the sea', 'Discover Lombok’s northwest coast'],
  },
  {
    id: 'skydiving', title: 'Lombok: Selong Belanak Beach Surf Experience',
    city: 'Lombok', duration: '3 hours', image: skydiving, gallery: [skydiving, skydivingThumbA, skydivingThumbB], cardImage: skydivingThumbA, rating: '4.8', reviews: '625',
    price: 213, oldPrice: null, badge: '', label: 'Adventure',
    description: 'Enjoy a beginner-friendly surf session at Selong Belanak Beach, one of South Lombok’s most popular coastal areas.',
    lovedByEnglishSpeakers: true,
    includes: ['Surf lesson', 'Professional instructor', 'Safety equipment'],
    whatToBring: ['Comfortable clothes', 'Closed-toe shoes'],
    highlights: ['Learn the basics of surfing', 'Enjoy Selong Belanak Beach', 'Practice with a local instructor'],
  },
  {
    id: 'kayaking', title: 'Lombok: Senggigi Beach Sunset Kayak Tour',
    city: 'Lombok', duration: '2.5 hours', image: kayaking, gallery: [kayaking, kayakingThumbA, kayakingThumbB], cardImage: kayakingThumbA, rating: '4.8', reviews: '2,441', featured: true,
    price: 52, oldPrice: null, badge: 'Likely to sell out', label: 'Guided tour', popularSearch: true,
    description: 'Paddle along Senggigi Beach in the calmer evening light and enjoy a relaxed view of Lombok’s west coast.',
    lovedByEnglishSpeakers: true,
    includes: ['Kayak equipment', 'Local guide', 'Safety briefing'],
    whatToBring: ['Clothes that can get wet', 'Water bottle'],
    highlights: ['Paddle along Senggigi Beach', 'Watch the sunset over West Lombok', 'Enjoy the company of a local guide'],
  },
  {
    id: 'agafay', title: 'Mataram: Bilebante Green Tourism Village Experience',
    city: 'Mataram', duration: '5 hours', image: agafay, rating: '4.9', reviews: '9,164', featured: true,
    price: 60, oldPrice: 68, badge: '', label: 'Dinner included',
    description: 'Spend time in Bilebante Green Tourism Village and discover local landscapes, food, and community-led experiences near Mataram.',
    highlights: ['Explore Bilebante village', 'Discover local food and landscapes', 'Meet the local community'],
  },
  {
    id: 'sumo', title: 'Sembalun: Pergasingan Hill Sunrise Trek',
    city: 'Sembalun', duration: '75 minutes - 1.5 hours', image: sumo, rating: '4.9', reviews: '9,101', featured: true,
    price: 35, oldPrice: null, badge: 'Likely to sell out', label: 'Cultural experience',
    description: 'Climb Pergasingan Hill near Sembalun for a sunrise view across the valleys and farmland of East Lombok.',
    highlights: ['Trek to Pergasingan Hill', 'Watch the sunrise over Sembalun', 'Take a memorable landscape photo'],
  },
];

export const getExperience = (id) => experiences.find((item) => item.id === id) || experiences[0];
export const getExperienceGallery = (item) => item.gallery?.length ? item.gallery : [item.image];
export const getFeaturedExperiences = () => experiences.filter((item) => item.featured);
export const getPopularExperiences = () => experiences.filter((item) => item.popularSearch);
export const getExperiencesByCity = (city) => experiences.filter((item) => item.city.toLocaleLowerCase() === city.toLocaleLowerCase());
export const demoFirebaseDocuments = {
  organizations: [{ id: 'demo-operator', schemaVersion: 1, name: 'Demo operator', status: 'draft' }],
  experiences: experiences.map((item) => toExperienceDocument(item, demoBookingData[item.id])),
  media: [...experiences.flatMap(toMediaDocuments), ...destinations.map((item) => toTileMediaDocument(item, 'destination')), ...attractions.map((item) => toTileMediaDocument(item, 'attraction'))],
  destinations: destinations.map(toDestinationDocument),
  attractions: attractions.map((item) => toDestinationDocument(item, 'attraction')),
};
