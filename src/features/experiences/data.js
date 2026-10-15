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

const tripadvisorImages = {
  lombok: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/d8/2b/d2/lombok-island-is-not.jpg?w=800&h=800&s=1',
  mataram: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/90/8d/1f/lombok-rise-daily-programs.jpg?w=800&h=800&s=1',
  sembalun: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/ac/70/59/caption.jpg?w=800&h=800&s=1',
  rinjani: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/ac/70/59/caption.jpg?w=800&h=800&s=1',
  tanjungAan: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/3f/75/db/ready-to-ride-the-wave.jpg?w=800&h=800&s=1',
  selongBelanak: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/2b/4f/b4/pantai-selong-belanak.jpg?w=800&h=800&s=1',
  mawun: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/15/de/9b/img-20160418-141227-largejpg.jpg?w=800&h=800&s=1',
  senggigi: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/e8/6d/b8/senggigi-view.jpg?w=800&h=800&s=1',
  pantaiPink: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/61/f1/f7/pink-beach-lombok-indonesia.jpg?w=500&h=-1&s=1',
  giliMeno: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/f4/47/30/caption.jpg?w=600&h=600&s=1',
  giliAir: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/3b/ad/a6/photo4jpg.jpg?w=600&h=600&s=1',
  sendangGile: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/0d/a1/35/air-terjun-sendang-gile.jpg?w=800&h=800&s=1',
  mangkuSakti: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/77/5d/76/air-terjun-mangku-sakti.jpg?w=800&h=800&s=1',
  tetebatu: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/51/c7/26/tete-batu-walk.jpg?w=700&h=700&s=1',
};

export const images = { rome: tripadvisorImages.lombok, paris: tripadvisorImages.mataram, statue: tripadvisorImages.rinjani, vatican: tripadvisorImages.tanjungAan, wishlist: tripadvisorImages.sembalun, colosseum: tripadvisorImages.tanjungAan, arena: tripadvisorImages.rinjani, vaticanTour: tripadvisorImages.sendangGile, basilica: tripadvisorImages.mangkuSakti, pantheon: tripadvisorImages.giliMeno, pantheonCard: tripadvisorImages.giliMeno, skydiving: tripadvisorImages.selongBelanak, kayaking: tripadvisorImages.senggigi, mapCore, login, agafay: tripadvisorImages.tetebatu, sumo: tripadvisorImages.sembalun, pantheonThumbA: tripadvisorImages.giliAir, pantheonThumbB: tripadvisorImages.senggigi, skydivingThumbA: tripadvisorImages.mawun, skydivingThumbB: tripadvisorImages.pantaiPink, kayakingThumbA: tripadvisorImages.giliMeno, kayakingThumbB: tripadvisorImages.giliAir };

export const destinations = [
  { name: 'Lombok', location: 'NTB, Indonesia', image: images.rome, count: '1,420 activities', rating: '4.8' },
  { name: 'Mataram', location: 'NTB, Indonesia', image: images.paris, count: '1,205 activities', rating: '4.8' },
  { name: 'Sembalun', location: 'East Lombok, NTB', image: images.wishlist, count: '980 activities', rating: '4.7' },
];

export const attractions = [
  { name: 'Mount Rinjani', image: images.statue, city: 'Sembalun', count: '248 activities' },
  { name: 'Tanjung Aan Beach', image: images.vatican, city: 'Lombok', count: '530 activities' },
];

const waterfallFallback = tripadvisorImages.sendangGile;
const waterfallCatalog = [
  { id: 'waterfall-1723009', title: 'Air Terjun Sendang Gile dan Tiu Kelep', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/0d/a1/35/air-terjun-sendang-gile.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-2314079', title: 'Air Terjun Benang Stokal and Benang Kelambu', image: tripadvisorImages.lombok },
  { id: 'waterfall-3228954', title: 'Air Terjun Tetebatu', image: tripadvisorImages.tetebatu },
  { id: 'waterfall-2314065', title: 'Air Terjun Sindang Gila', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/8b/0c/48/sindang-gila-waterfall.jpg?w=500&h=-1&s=1' },
  { id: 'waterfall-12199913', title: 'Air Terjun Mangku Sakti & Mangku Kodek', image: tripadvisorImages.mangkuSakti },
  { id: 'waterfall-12968850', title: 'Air Terjun Burung Walet', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/d6/3e/c1/img-20200205-124825-2.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-11693311', title: 'Air Terjun Mangku Sakti', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/54/86/44/photo0jpg.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-11693315', title: 'Air Terjun Mangku Kodek', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/5f/a3/71/clombokfriendly.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-10531156', title: 'Air Terjun Jeruk Manis', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/c8/07/74/img-35941632716008-largejpg.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-8441517', title: 'Air Terjun Kawangan', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/ad/d7/f0/air-terjun-kawangan.jpg?w=500&h=-1&s=1' },
  { id: 'waterfall-10376300', title: 'Air Terjun Sekeper', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/9f/d9/79/truly-on-the-jungle.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-13619975', title: 'Air Terjun Tiu Pupus', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/6a/8b/61/tiu-pupus-waterfall.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-11693320', title: 'Air Terjun Dewi Selendang', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/43/e2/50/img20170805122337-largejpg_rotated_90.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-12721258', title: 'Air Terjun Tiu Pituq', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/8f/bc/4a/fb-img-15306403952751138.jpg?w=500&h=-1&s=1' },
  { id: 'waterfall-26168970', title: 'Wayto Rinjani', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/de/87/6a/caption.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-34299490', title: 'Azantar Indonesia', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/33/3a/73/cd/caption.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-11797776', title: 'Air Terjun Tiu Ngumbak', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/92/64/0d/air-terjun-tiu-ngumbak.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-25173046', title: 'Benang Stokel and Benang Kelambu Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/0b/b5/c7/atl-softreking-village.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-13447303', title: 'Otak Kokoq Joben', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/0b/03/b0/sweet.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-25188413', title: 'Lokok Sekoah', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/94/a4/cb/air-terjun-lokok-sekoah.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-9696935', title: 'Air Terjun Telaga Madu', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/5f/4d/5c/with-companion.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-24926905', title: 'Air Terjun Benang Kelambu', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/a6/d7/8a/benang-kelambu-waterfall.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-13225974', title: 'Air Terjun Treng Wilis', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/c2/e5/22/telaga-biru-sri-jete.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-26865893', title: 'Jalan Raya Tetebatu', image: waterfallFallback },
  { id: 'waterfall-25216201', title: 'Waterfall Lokok Sekoah', image: waterfallFallback },
  { id: 'waterfall-12049695', title: 'Air Terjun Semporonan', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/2a/08/a1/one-of-the-most-interesting.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-9696936', title: 'Air Terjun Telaga Madu', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/1d/8b/4b/telaga-madu-waterfalls.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-25796578', title: 'Sendalem Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/41/11/ed/tibu-sendalem-merupakan.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-9608982', title: 'Air Terjun Umar Maya', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/09/38/41/air-terjun-umar-maya.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-12813056', title: 'Air Terjun Jaran Kurus', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/bc/95/8f/lrm-export-79945059680421.jpg?w=500&h=-1&s=1' },
  { id: 'waterfall-34125312', title: 'Desa pringgasela', image: waterfallFallback },
  { id: 'waterfall-25193063', title: 'Air Terjun Kalianjah Sambik Elen', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/94/c9/36/produk-kopi-gp-lombok.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-25032364', title: 'Benang Kelambu Dan Benang Stokel', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/60/4b/69/jelajah-sawah.jpg?w=500&h=-1&s=1' },
  { id: 'waterfall-27997429', title: 'Senaru Trek Centre', image: waterfallFallback },
  { id: 'waterfall-34453794', title: 'Leong Vanilla and Chocolate Agritourism', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/33/92/88/3d/caption.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-27153378', title: 'Cinta Holiday', image: waterfallFallback },
  { id: 'waterfall-34450139', title: 'Rinjanidreamers', image: waterfallFallback },
  { id: 'waterfall-28156643', title: 'Benang Stokel And Benang Kelambu Waterfall', image: waterfallFallback },
  { id: 'waterfall-34031709', title: 'Eleventrails', image: waterfallFallback },
  { id: 'waterfall-25785530', title: 'Cendramata', image: waterfallFallback },
  { id: 'waterfall-21142003', title: 'Air Terjun Tembiras', image: waterfallFallback },
  { id: 'waterfall-32696940', title: 'Mount Rinjani Adventures', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/a1/cc/bd/caption.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-6607679', title: 'Lombok Hafala', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/b6/ef/49/lombok-hafala-day-tours.jpg?w=500&h=-1&s=1' },
  { id: 'waterfall-17497828', title: 'Go2Rinjani', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/78/0b/a3/on-the-top-with-tamil.jpg?w=500&h=-1&s=1' },
  { id: 'waterfall-11893591', title: 'Onyaq-onyaq Explorider', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/4b/ff/1e/onyaq-onyaq-explorider.jpg?w=500&h=-1&s=1' },
  { id: 'waterfall-24064742', title: 'TETEBATU', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/1d/96/3b/harvesting-rice-with.jpg?w=500&h=-1&s=1' },
  { id: 'waterfall-34042952', title: 'Tetebatu Erlebnis', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/62/48/fa/the-happy-smiles-of-family.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-27478388', title: 'Zila Lombok Trans', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/b2/dc/1e/bukit-bengkoang.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-28474703', title: 'Lombok Wonderland Tour And Travel', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/a5/75/90/caption.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-14911727', title: 'Lombok Frame Holiday', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/34/e8/68/a6/lombok-frame-holiday.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-25219843', title: 'Detriip Travel', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/da/09/12/snorkeling-at-gili-islands.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-10126649', title: 'Lombok Rinjani Trekking', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/6e/aa/d7/this-me.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-34463957', title: 'RINJANI TREK ADVENTURE', image: waterfallFallback },
  { id: 'waterfall-30800990', title: 'Galang Travel', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/63/cb/58/caption.jpg?w=800&h=800&s=1' },
];

const waterfallExperiences = waterfallCatalog.map((item) => ({
  ...item,
  city: 'Lombok', duration: '1 day', rating: '4.7', reviews: '128', price: 35, oldPrice: null,
  badge: '', label: 'Air Terjun', category: 'Air Terjun',
  description: `Explore ${item.title} and the surrounding natural landscape in Lombok with a local guide.`,
  highlights: [`Visit ${item.title}`, 'Explore Lombok’s natural landscape', 'Enjoy a flexible local experience'],
}));

const beachFallback = tripadvisorImages.tanjungAan;
const beachCatalog = [
  { id: 'beach-5113207', title: 'Pantai GIli Meno', image: tripadvisorImages.giliMeno },
  { id: 'beach-6894350', title: 'Pantai Selong Belanak', image: tripadvisorImages.selongBelanak },
  { id: 'beach-3257784', title: 'Pantai Tanjung Aan', image: tripadvisorImages.tanjungAan },
  { id: 'beach-3268159', title: 'Pantai Senggigi', image: tripadvisorImages.senggigi },
  { id: 'beach-3801497', title: 'Pantai Mawun', image: tripadvisorImages.mawun },
  { id: 'beach-4010189', title: 'Pantai Pink', image: tripadvisorImages.pantaiPink },
  { id: 'beach-7174395', title: 'Secreat Gili Nanggu, Sudak, Kedis', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/24/ce/41/snorkelling-trip-yg-mau.jpg?w=500&h=-1&s=1' },
  { id: 'beach-8755374', title: 'Pantai Nipah', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/3c/5b/2c/lombokprimatourblogspotcoid.jpg?w=500&h=400&s=1' },
  { id: 'beach-10296947', title: 'Pantai Mawi', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/48/c0/b8/pantai-mawi-dari-bukit.jpg?w=500&h=400&s=1' },
  { id: 'beach-10532859', title: 'Pantai Tampah', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/fc/f8/da/arrecife-en-la-marea.jpg?w=500&h=400&s=1' },
  { id: 'beach-9455034', title: 'Pantai Seger', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/56/bd/e9/photo0jpg.jpg?w=500&h=-1&s=1' },
  { id: 'beach-11621498', title: 'Lombok Golf Kosaido Country Club', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/37/3f/fa/enjoy-playing-golf-at.jpg?w=500&h=400&s=1' },
  { id: 'beach-3697018', title: 'Tanjung Ringgit', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/7a/53/e5/very-windy.jpg?w=500&h=400&s=1' },
  { id: 'beach-8783387', title: 'Pantai Batu Payung', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/be/1a/13/pantai-batu-payung.jpg?w=500&h=400&s=1' },
  { id: 'beach-13279540', title: 'Pantai Lancing', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/03/4f/42/lancing-beach.jpg?w=500&h=400&s=1' },
  { id: 'beach-10347341', title: 'Pantai Mekaki', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/15/6f/77/beach.jpg?w=500&h=-1&s=1' },
  { id: 'beach-13794088', title: 'Pantai Kerandangan', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/e2/b2/eb/pantai-kerandangan.jpg?w=500&h=400&s=1' },
  { id: 'beach-10833089', title: 'Pantai Ampenan', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/d3/e4/0b/pantai-ampenan.jpg?w=500&h=-1&s=1' },
  { id: 'beach-12851437', title: 'Pantai Sire', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/21/03/9b/beautiful-sunset-in-sire.jpg?w=500&h=400&s=1' },
  { id: 'beach-12368608', title: 'Pantai Gerupuk', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/2d/23/82/surf-easy-and-fun.jpg?w=500&h=400&s=1' },
  { id: 'beach-10422585', title: 'Pantai Semeti', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/eb/5f/dd/white-sandy-beach-of.jpg?w=500&h=-1&s=1' },
  { id: 'beach-13225967', title: 'Pantai Areguling', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/5d/c3/bf/good-morning-traveler.jpg?w=500&h=400&s=1' },
  { id: 'beach-10346856', title: 'Pantai Pandanan', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/24/79/1b/let-s-join-with-us-transport.jpg?w=500&h=400&s=1' },
  { id: 'beach-15221863', title: 'Pantai Are Guling', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/d5/1a/46/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-14789930', title: 'Pantai Torok', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/a2/99/61/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-9715612', title: 'Pantai Setangi', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/57/11/79/photo1jpg.jpg?w=500&h=-1&s=1' },
  { id: 'beach-12002812', title: 'Pantai Elak Elak', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/16/ff/9f/datang-dan-nikmati-keindahan.jpg?w=500&h=400&s=1' },
  { id: 'beach-8667040', title: 'Pantai Malimbu', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/90/0d/ec/birunya-malimbu.jpg?w=500&h=400&s=1' },
  { id: 'beach-26335859', title: 'Kuta Lombok', image: beachFallback },
  { id: 'beach-8332684', title: 'Lobster Bay Beach Lombok', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/c2/99/71/view-from-the-hills-lobster.jpg?w=500&h=-1&s=1' },
  { id: 'beach-34097437', title: 'Gili Beach', image: beachFallback },
  { id: 'beach-7980746', title: 'Gili Lampu', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/5e/35/5e/p-20191223-061102-largejpg.jpg?w=500&h=400&s=1' },
  { id: 'beach-10296952', title: 'Desert Point', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/cc/a4/72/heaven.jpg?w=500&h=-1&s=1' },
  { id: 'beach-12368435', title: 'Pantai Bangko bangko', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/98/29/8b/pantai-surfing-bangko.jpg?w=500&h=400&s=1' },
  { id: 'beach-12279679', title: 'Pantai Tebing', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/d5/29/ca/tebing-beach.jpg?w=500&h=-1&s=1' },
  { id: 'beach-25169871', title: 'Warung Budi Surf', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/6d/07/2c/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-10713062', title: 'Pantai Cemara', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/c6/9d/5f/pantai-cemara.jpg?w=500&h=-1&s=1' },
  { id: 'beach-9874004', title: 'Pantai Ketapang', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/d3/f5/10/pantai-ketapang.jpg?w=500&h=400&s=1' },
  { id: 'beach-33336142', title: 'Tanjung Bias Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/95/fc/aa/tanjung-bias-a-sunset.jpg?w=500&h=400&s=1' },
  { id: 'beach-5827831', title: 'Pantai Gondang', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/44/63/53/pantai-gondang.jpg?w=500&h=400&s=1' },
  { id: 'beach-15239487', title: 'Pantai Telawas', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/83/53/c4/getlstd-property-photo.jpg?w=500&h=400&s=1' },
  { id: 'beach-25445958', title: 'Pongkor', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/15/05/d9/some-of-our-activities.jpg?w=500&h=400&s=1' },
  { id: 'beach-4495731', title: 'Pantai Induk', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/92/82/0c/pacu-kuda-yg-menjadi.jpg?w=500&h=400&s=1' },
  { id: 'beach-2041912', title: 'Pantai Makaki', image: beachFallback },
  { id: 'beach-34299490', title: 'Azantar Indonesia', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/33/3a/73/cd/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-34059025', title: 'Surf Gili Trawangan', image: beachFallback },
  { id: 'beach-17423976', title: 'Pantai Pengantap', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/b3/3d/5f/pantai-pengantap.jpg?w=500&h=400&s=1' },
  { id: 'beach-9705675', title: 'Pantain Lenggoksono', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/6a/74/71/photo0jpg.jpg?w=500&h=-1&s=1' },
  { id: 'beach-28114532', title: 'Senggigi Beach', image: beachFallback },
  { id: 'beach-10354449', title: 'Pantai Putri Nyale', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/ed/ee/02/panorama-dall-alto.jpg?w=500&h=-1&s=1' },
  { id: 'beach-17690019', title: 'Pantai Kecinaan', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/98/78/c6/lombok-private-speed.jpg?w=500&h=-1&s=1' },
  { id: 'beach-33329881', title: 'Sup Gili', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/87/00/13/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-32874882', title: 'Kepo Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/bb/41/29/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-17435235', title: 'Pantai Nambung', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/29/6e/b1/air-terjun-air-laut.jpg?w=500&h=400&s=1' },
  { id: 'beach-25188755', title: 'Pantai Areguling', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/46/f5/f2/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-25171729', title: 'Selong Belanak Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/2b/1c/dd/hiden-paradise-lombok.jpg?w=500&h=400&s=1' },
  { id: 'beach-27845742', title: 'Gili Lampu', image: beachFallback },
  { id: 'beach-14800811', title: 'Pantai Labuhan Haji', image: beachFallback },
  { id: 'beach-34059018', title: 'Surf Gili trawangan', image: beachFallback },
  { id: 'beach-30526799', title: 'Lombok Snorkling', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/63/cb/58/caption.jpg?w=800&h=800&s=1' },
  { id: 'beach-32865861', title: 'Sunaidi', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/e2/76/72/snorkeling-trip-by-glass.jpg?w=500&h=400&s=1' },
  { id: 'beach-25189758', title: 'Areguling Beach', image: beachFallback },
  { id: 'beach-24811137', title: 'Hendus Surf Scholl', image: beachFallback },
  { id: 'beach-34290526', title: 'Gili Trawangan Surf School', image: beachFallback },
  { id: 'beach-34031709', title: 'Eleventrails', image: beachFallback },
  { id: 'beach-25198180', title: 'Pantai Areguling', image: beachFallback },
  { id: 'beach-33235769', title: 'Jetski Lombok', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/1e/35/57/unforgettable-moments.jpg?w=500&h=400&s=1' },
  { id: 'beach-10239542', title: 'Barbir Lombok Tour', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/d2/a4/81/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-14911727', title: 'Lombok Frame Holiday', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/34/e8/68/a6/lombok-frame-holiday.jpg?w=500&h=400&s=1' },
  { id: 'beach-30790542', title: 'Galang Travel', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/5b/20/a4/explore-lombok-with-galang.jpg?w=500&h=400&s=1' },
  { id: 'beach-25219843', title: 'Detriip Travel', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/da/09/12/snorkeling-at-gili-islands.jpg?w=500&h=400&s=1' },
  { id: 'beach-34655365', title: 'Signature Scuba Gili Gede', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/34/67/79/ba/sometimes-we-bring-our.jpg?w=500&h=-1&s=1' },
];

const beachExperiences = beachCatalog.map((item) => ({
  ...item,
  city: 'Lombok', duration: '1 day', rating: '4.7', reviews: '128', price: 35, oldPrice: null,
  badge: '', label: 'Pantai', category: 'Pantai',
  description: `Explore ${item.title} and the surrounding coastline in Lombok with a local guide.`,
  highlights: [`Visit ${item.title}`, 'Explore Lombok’s coastline', 'Enjoy a flexible local experience'],
}));

export const experiences = [
  {
    id: 'colosseum', title: 'Lombok: Tanjung Aan Beach & Kuta Coast Guided Tour',
    city: 'Lombok', duration: '2.5 hours', image: images.colosseum, rating: '4.8', reviews: '92,692',
    price: 55, oldPrice: 69, badge: 'Best match', label: 'Skip the line', popularSearch: true,
    description: 'Explore the white sands and turquoise water of Tanjung Aan while discovering the landscapes around Lombok’s Kuta coast with a local guide.',
    highlights: ['Visit Tanjung Aan Beach', 'Explore the Kuta coast', 'Hear stories from a local guide'],
  },
  {
    id: 'arena', title: 'Lombok: Mount Rinjani National Park & Sembalun Tour',
    city: 'Lombok', duration: '2.5 - 3 hours', image: images.arena, rating: '4.5', reviews: '29,044',
    price: 44, oldPrice: 87, badge: 'Certified', label: 'Skip the line',
    description: 'Discover the foothills and viewpoints around Mount Rinjani National Park with a local guide based near Sembalun.',
    highlights: ['Explore Rinjani landscapes', 'Visit Sembalun viewpoints', 'Enjoy stories from a local guide'],
  },
  {
    id: 'vatican', title: 'Lombok: Sendang Gile & Tiu Kelep Waterfalls Tour',
    city: 'Lombok', duration: '2 - 3 hours', image: images.vaticanTour, rating: '4.3', reviews: '85,818',
    price: 66, oldPrice: 132, badge: 'Certified', label: 'Skip the line',
    description: 'Travel through North Lombok to discover Sendang Gile and Tiu Kelep, two of the island’s best-known waterfalls.',
    highlights: ['Visit Sendang Gile Waterfall', 'Discover Tiu Kelep Waterfall', 'Explore North Lombok with a guide'],
  },
  {
    id: 'basilica', title: 'Lombok: Benang Stokel & Benang Kelambu Waterfalls Tour',
    city: 'Lombok', duration: '2 - 4 hours', image: images.basilica, rating: '4.7', reviews: '18,880',
    price: 72, oldPrice: 119, badge: 'Certified', label: 'Skip the line',
    description: 'Explore Central Lombok’s Benang Stokel and Benang Kelambu waterfalls with time to enjoy the surrounding forest.',
    highlights: ['Visit Benang Stokel Waterfall', 'Discover Benang Kelambu Waterfall', 'Walk through the surrounding forest'],
  },
  {
    id: 'pantheon', title: 'Lombok: Gili Islands Island-Hopping Experience',
    city: 'Lombok', duration: '1 day', image: images.pantheon, gallery: [images.pantheon, images.pantheonThumbA, images.pantheonThumbB], cardImage: images.pantheonCard, rating: '4.1', reviews: '40', featured: true,
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
    city: 'Lombok', duration: '3 hours', image: images.skydiving, gallery: [images.skydiving, images.skydivingThumbA, images.skydivingThumbB], cardImage: images.skydivingThumbA, rating: '4.8', reviews: '625',
    price: 213, oldPrice: null, badge: '', label: 'Adventure',
    description: 'Enjoy a beginner-friendly surf session at Selong Belanak Beach, one of South Lombok’s most popular coastal areas.',
    lovedByEnglishSpeakers: true,
    includes: ['Surf lesson', 'Professional instructor', 'Safety equipment'],
    whatToBring: ['Comfortable clothes', 'Closed-toe shoes'],
    highlights: ['Learn the basics of surfing', 'Enjoy Selong Belanak Beach', 'Practice with a local instructor'],
  },
  {
    id: 'kayaking', title: 'Lombok: Senggigi Beach Sunset Kayak Tour',
    city: 'Lombok', duration: '2.5 hours', image: images.kayaking, gallery: [images.kayaking, images.kayakingThumbA, images.kayakingThumbB], cardImage: images.kayakingThumbA, rating: '4.8', reviews: '2,441', featured: true,
    price: 52, oldPrice: null, badge: 'Likely to sell out', label: 'Guided tour', popularSearch: true,
    description: 'Paddle along Senggigi Beach in the calmer evening light and enjoy a relaxed view of Lombok’s west coast.',
    lovedByEnglishSpeakers: true,
    includes: ['Kayak equipment', 'Local guide', 'Safety briefing'],
    whatToBring: ['Clothes that can get wet', 'Water bottle'],
    highlights: ['Paddle along Senggigi Beach', 'Watch the sunset over West Lombok', 'Enjoy the company of a local guide'],
  },
  {
    id: 'agafay', title: 'Mataram: Bilebante Green Tourism Village Experience',
    city: 'Mataram', duration: '5 hours', image: images.agafay, rating: '4.9', reviews: '9,164', featured: true,
    price: 60, oldPrice: 68, badge: '', label: 'Dinner included',
    description: 'Spend time in Bilebante Green Tourism Village and discover local landscapes, food, and community-led experiences near Mataram.',
    highlights: ['Explore Bilebante village', 'Discover local food and landscapes', 'Meet the local community'],
  },
  {
    id: 'sumo', title: 'Sembalun: Pergasingan Hill Sunrise Trek',
    city: 'Sembalun', duration: '75 minutes - 1.5 hours', image: images.sumo, rating: '4.9', reviews: '9,101', featured: true,
    price: 35, oldPrice: null, badge: 'Likely to sell out', label: 'Cultural experience',
    description: 'Climb Pergasingan Hill near Sembalun for a sunrise view across the valleys and farmland of East Lombok.',
    highlights: ['Trek to Pergasingan Hill', 'Watch the sunrise over Sembalun', 'Take a memorable landscape photo'],
  },
  ...waterfallExperiences,
  ...beachExperiences,
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
