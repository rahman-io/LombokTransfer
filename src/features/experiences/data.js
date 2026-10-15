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
  { id: 'waterfall-1723009', title: 'Sendang Gile and Tiu Kelep Waterfalls', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/0d/a1/35/air-terjun-sendang-gile.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-2314079', title: 'Benang Stokal and Benang Kelambu Waterfalls', image: tripadvisorImages.lombok },
  { id: 'waterfall-3228954', title: 'Tetebatu Waterfall', image: tripadvisorImages.tetebatu },
  { id: 'waterfall-2314065', title: 'Sindang Gila Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/8b/0c/48/sindang-gila-waterfall.jpg?w=500&h=-1&s=1' },
  { id: 'waterfall-12199913', title: 'Mangku Sakti and Mangku Kodek Waterfalls', image: tripadvisorImages.mangkuSakti },
  { id: 'waterfall-12968850', title: 'Burung Walet Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/d6/3e/c1/img-20200205-124825-2.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-11693311', title: 'Mangku Sakti Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/54/86/44/photo0jpg.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-11693315', title: 'Mangku Kodek Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/5f/a3/71/clombokfriendly.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-10531156', title: 'Jeruk Manis Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/c8/07/74/img-35941632716008-largejpg.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-8441517', title: 'Kawangan Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/ad/d7/f0/air-terjun-kawangan.jpg?w=500&h=-1&s=1' },
  { id: 'waterfall-10376300', title: 'Sekeper Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/9f/d9/79/truly-on-the-jungle.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-13619975', title: 'Tiu Pupus Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/6a/8b/61/tiu-pupus-waterfall.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-11693320', title: 'Dewi Selendang Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/43/e2/50/img20170805122337-largejpg_rotated_90.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-12721258', title: 'Tiu Pituq Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/8f/bc/4a/fb-img-15306403952751138.jpg?w=500&h=-1&s=1' },
  { id: 'waterfall-26168970', title: 'Wayto Rinjani', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/de/87/6a/caption.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-34299490', title: 'Azantar Indonesia', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/33/3a/73/cd/caption.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-11797776', title: 'Tiu Ngumbak Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/92/64/0d/air-terjun-tiu-ngumbak.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-25173046', title: 'Benang Stokel and Benang Kelambu Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/0b/b5/c7/atl-softreking-village.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-13447303', title: 'Otak Kokoq Joben', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/0b/03/b0/sweet.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-25188413', title: 'Lokok Sekoah', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/94/a4/cb/air-terjun-lokok-sekoah.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-9696935', title: 'Telaga Madu Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/5f/4d/5c/with-companion.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-24926905', title: 'Benang Kelambu Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/a6/d7/8a/benang-kelambu-waterfall.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-13225974', title: 'Treng Wilis Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/c2/e5/22/telaga-biru-sri-jete.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-26865893', title: 'Jalan Raya Tetebatu', image: waterfallFallback },
  { id: 'waterfall-25216201', title: 'Waterfall Lokok Sekoah', image: waterfallFallback },
  { id: 'waterfall-12049695', title: 'Semporonan Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/2a/08/a1/one-of-the-most-interesting.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-9696936', title: 'Telaga Madu Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/1d/8b/4b/telaga-madu-waterfalls.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-25796578', title: 'Sendalem Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/41/11/ed/tibu-sendalem-merupakan.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-9608982', title: 'Umar Maya Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/09/38/41/air-terjun-umar-maya.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-12813056', title: 'Jaran Kurus Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/bc/95/8f/lrm-export-79945059680421.jpg?w=500&h=-1&s=1' },
  { id: 'waterfall-34125312', title: 'Pringgasela Village', image: waterfallFallback },
  { id: 'waterfall-25193063', title: 'Kalianjah Sambik Elen Waterfall', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/94/c9/36/produk-kopi-gp-lombok.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-25032364', title: 'Benang Kelambu and Benang Stokel Waterfalls', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/60/4b/69/jelajah-sawah.jpg?w=500&h=-1&s=1' },
  { id: 'waterfall-27997429', title: 'Senaru Trek Centre', image: waterfallFallback },
  { id: 'waterfall-34453794', title: 'Leong Vanilla and Chocolate Agritourism', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/33/92/88/3d/caption.jpg?w=500&h=400&s=1' },
  { id: 'waterfall-27153378', title: 'Cinta Holiday', image: waterfallFallback },
  { id: 'waterfall-34450139', title: 'Rinjanidreamers', image: waterfallFallback },
  { id: 'waterfall-28156643', title: 'Benang Stokel And Benang Kelambu Waterfall', image: waterfallFallback },
  { id: 'waterfall-34031709', title: 'Eleventrails', image: waterfallFallback },
  { id: 'waterfall-25785530', title: 'Cendramata', image: waterfallFallback },
  { id: 'waterfall-21142003', title: 'Tembiras Waterfall', image: waterfallFallback },
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
  badge: '', label: 'Waterfall', category: 'Waterfall',
  description: `Explore ${item.title} and the surrounding natural landscape in Lombok with a local guide.`,
  highlights: [`Visit ${item.title}`, 'Explore Lombok’s natural landscape', 'Enjoy a flexible local experience'],
}));

const beachFallback = tripadvisorImages.tanjungAan;
const beachCatalog = [
  { id: 'beach-5113207', title: 'Gili Meno Beach', image: tripadvisorImages.giliMeno },
  { id: 'beach-6894350', title: 'Selong Belanak Beach', image: tripadvisorImages.selongBelanak },
  { id: 'beach-3257784', title: 'Tanjung Aan Beach', image: tripadvisorImages.tanjungAan },
  { id: 'beach-3268159', title: 'Senggigi Beach', image: tripadvisorImages.senggigi },
  { id: 'beach-3801497', title: 'Mawun Beach', image: tripadvisorImages.mawun },
  { id: 'beach-4010189', title: 'Pink Beach', image: tripadvisorImages.pantaiPink, listedPrice: 604421, listedPriceCurrency: 'IDR', priceNote: 'Pulau Pasir, Pink Beach, and Semangko private tour starting price', location: 'Sekaroh Village, Jerowaru, East Lombok, West Nusa Tenggara', openingHours: '08:00–17:00 WITA' },
  { id: 'beach-7174395', title: 'Secreat Gili Nanggu, Sudak, Kedis', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/24/ce/41/snorkelling-trip-yg-mau.jpg?w=500&h=-1&s=1' },
  { id: 'beach-8755374', title: 'Nipah Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/3c/5b/2c/lombokprimatourblogspotcoid.jpg?w=500&h=400&s=1' },
  { id: 'beach-10296947', title: 'Mawi Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/48/c0/b8/pantai-mawi-dari-bukit.jpg?w=500&h=400&s=1' },
  { id: 'beach-10532859', title: 'Tampah Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/fc/f8/da/arrecife-en-la-marea.jpg?w=500&h=400&s=1' },
  { id: 'beach-9455034', title: 'Seger Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/56/bd/e9/photo0jpg.jpg?w=500&h=-1&s=1' },
  { id: 'beach-11621498', title: 'Lombok Golf Kosaido Country Club', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/37/3f/fa/enjoy-playing-golf-at.jpg?w=500&h=400&s=1' },
  { id: 'beach-3697018', title: 'Tanjung Ringgit', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/7a/53/e5/very-windy.jpg?w=500&h=400&s=1' },
  { id: 'beach-8783387', title: 'Batu Payung Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/be/1a/13/pantai-batu-payung.jpg?w=500&h=400&s=1' },
  { id: 'beach-13279540', title: 'Lancing Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/03/4f/42/lancing-beach.jpg?w=500&h=400&s=1' },
  { id: 'beach-10347341', title: 'Mekaki Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/15/6f/77/beach.jpg?w=500&h=-1&s=1' },
  { id: 'beach-13794088', title: 'Kerandangan Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/e2/b2/eb/pantai-kerandangan.jpg?w=500&h=400&s=1' },
  { id: 'beach-10833089', title: 'Ampenan Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/d3/e4/0b/pantai-ampenan.jpg?w=500&h=-1&s=1' },
  { id: 'beach-12851437', title: 'Sire Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/21/03/9b/beautiful-sunset-in-sire.jpg?w=500&h=400&s=1' },
  { id: 'beach-12368608', title: 'Gerupuk Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/2d/23/82/surf-easy-and-fun.jpg?w=500&h=400&s=1' },
  { id: 'beach-10422585', title: 'Semeti Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/eb/5f/dd/white-sandy-beach-of.jpg?w=500&h=-1&s=1' },
  { id: 'beach-13225967', title: 'Areguling Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/5d/c3/bf/good-morning-traveler.jpg?w=500&h=400&s=1' },
  { id: 'beach-10346856', title: 'Pandanan Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/24/79/1b/let-s-join-with-us-transport.jpg?w=500&h=400&s=1' },
  { id: 'beach-15221863', title: 'Are Guling Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/d5/1a/46/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-14789930', title: 'Torok Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/a2/99/61/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-9715612', title: 'Setangi Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/57/11/79/photo1jpg.jpg?w=500&h=-1&s=1' },
  { id: 'beach-12002812', title: 'Elak Elak Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/16/ff/9f/datang-dan-nikmati-keindahan.jpg?w=500&h=400&s=1' },
  { id: 'beach-8667040', title: 'Malimbu Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/90/0d/ec/birunya-malimbu.jpg?w=500&h=400&s=1' },
  { id: 'beach-26335859', title: 'Kuta Lombok', image: beachFallback },
  { id: 'beach-8332684', title: 'Lobster Bay Beach Lombok', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/c2/99/71/view-from-the-hills-lobster.jpg?w=500&h=-1&s=1' },
  { id: 'beach-34097437', title: 'Gili Beach', image: beachFallback },
  { id: 'beach-7980746', title: 'Gili Lampu', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/5e/35/5e/p-20191223-061102-largejpg.jpg?w=500&h=400&s=1' },
  { id: 'beach-10296952', title: 'Desert Point', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/cc/a4/72/heaven.jpg?w=500&h=-1&s=1' },
  { id: 'beach-12368435', title: 'Bangko Bangko Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/98/29/8b/pantai-surfing-bangko.jpg?w=500&h=400&s=1' },
  { id: 'beach-12279679', title: 'Tebing Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/d5/29/ca/tebing-beach.jpg?w=500&h=-1&s=1' },
  { id: 'beach-25169871', title: 'Warung Budi Surf', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/6d/07/2c/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-10713062', title: 'Cemara Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/c6/9d/5f/pantai-cemara.jpg?w=500&h=-1&s=1' },
  { id: 'beach-9874004', title: 'Ketapang Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/d3/f5/10/pantai-ketapang.jpg?w=500&h=400&s=1' },
  { id: 'beach-33336142', title: 'Tanjung Bias Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/95/fc/aa/tanjung-bias-a-sunset.jpg?w=500&h=400&s=1' },
  { id: 'beach-5827831', title: 'Gondang Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/44/63/53/pantai-gondang.jpg?w=500&h=400&s=1' },
  { id: 'beach-15239487', title: 'Telawas Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/83/53/c4/getlstd-property-photo.jpg?w=500&h=400&s=1' },
  { id: 'beach-25445958', title: 'Pongkor', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/15/05/d9/some-of-our-activities.jpg?w=500&h=400&s=1' },
  { id: 'beach-4495731', title: 'Induk Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/92/82/0c/pacu-kuda-yg-menjadi.jpg?w=500&h=400&s=1' },
  { id: 'beach-2041912', title: 'Makaki Beach', image: beachFallback },
  { id: 'beach-34299490', title: 'Azantar Indonesia', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/33/3a/73/cd/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-34059025', title: 'Surf Gili Trawangan', image: beachFallback },
  { id: 'beach-17423976', title: 'Pengantap Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/b3/3d/5f/pantai-pengantap.jpg?w=500&h=400&s=1' },
  { id: 'beach-9705675', title: 'Lenggoksono Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/6a/74/71/photo0jpg.jpg?w=500&h=-1&s=1' },
  { id: 'beach-28114532', title: 'Senggigi Beach', image: beachFallback },
  { id: 'beach-10354449', title: 'Putri Nyale Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/ed/ee/02/panorama-dall-alto.jpg?w=500&h=-1&s=1' },
  { id: 'beach-17690019', title: 'Kecinaan Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/98/78/c6/lombok-private-speed.jpg?w=500&h=-1&s=1' },
  { id: 'beach-33329881', title: 'Sup Gili', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/87/00/13/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-32874882', title: 'Kepo Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/bb/41/29/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-17435235', title: 'Nambung Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/29/6e/b1/air-terjun-air-laut.jpg?w=500&h=400&s=1' },
  { id: 'beach-25188755', title: 'Areguling Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/46/f5/f2/caption.jpg?w=500&h=400&s=1' },
  { id: 'beach-25171729', title: 'Selong Belanak Beach', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/2b/1c/dd/hiden-paradise-lombok.jpg?w=500&h=400&s=1' },
  { id: 'beach-27845742', title: 'Gili Lampu', image: beachFallback },
  { id: 'beach-14800811', title: 'Labuhan Haji Beach', image: beachFallback },
  { id: 'beach-34059018', title: 'Surf Gili trawangan', image: beachFallback },
  { id: 'beach-30526799', title: 'Lombok Snorkling', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/63/cb/58/caption.jpg?w=800&h=800&s=1' },
  { id: 'beach-32865861', title: 'Sunaidi', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/e2/76/72/snorkeling-trip-by-glass.jpg?w=500&h=400&s=1' },
  { id: 'beach-25189758', title: 'Areguling Beach', image: beachFallback },
  { id: 'beach-24811137', title: 'Hendus Surf Scholl', image: beachFallback },
  { id: 'beach-34290526', title: 'Gili Trawangan Surf School', image: beachFallback },
  { id: 'beach-34031709', title: 'Eleventrails', image: beachFallback },
  { id: 'beach-25198180', title: 'Areguling Beach', image: beachFallback },
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
  badge: '', label: 'Beach', category: 'Beach',
  description: `Explore ${item.title} and the surrounding coastline in Lombok with a local guide.`,
  highlights: [`Visit ${item.title}`, 'Explore Lombok’s coastline', 'Enjoy a flexible local experience'],
}));

const volcanoFallback = tripadvisorImages.rinjani;
const volcanoCatalog = [
  { id: 'volcano-386938', title: 'Mount Rinjani', image: tripadvisorImages.rinjani, listedPrice: 2780915, listedPriceCurrency: 'IDR', priceNote: 'Two-day Rinjani summit experience starting price', location: 'Aikmel, East Lombok, West Nusa Tenggara', openingHours: 'Check-in 07:00–15:00 · Check-out 07:00–17:00 WITA' },
  { id: 'volcano-28123503', title: 'Jeweh Rinjani Trek', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/d4/2f/1f/caption.jpg?w=500&h=-1&s=1' },
  { id: 'volcano-26328401', title: 'Antok Trekking - Mt.Rinjani Lombok Volcano', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/10/62/2a/caption.jpg?w=500&h=400&s=1' },
  { id: 'volcano-24166667', title: 'Mount Rinjani Vacation', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/84/c4/1d/rinjani-summit-3726.jpg?w=500&h=400&s=1' },
  { id: 'volcano-24084181', title: 'Visiting Rinjani Lombok', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/ec/f5/ca/visiting-rinjani-lombok.jpg?w=500&h=400&s=1' },
  { id: 'volcano-26321765', title: 'Mount Rinjani National Park', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/44/80/9c/caption.jpg?w=500&h=400&s=1' },
  { id: 'volcano-24135222', title: 'Rinjani Information Center', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/30/42/2e/rinjani-summit.jpg?w=500&h=400&s=1' },
  { id: 'volcano-27997429', title: 'Senaru Trek Centre', image: volcanoFallback },
  { id: 'volcano-24116942', title: 'Rinjani Trekking Care', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/2d/40/95/keep-on-planning.jpg?w=200&h=200&s=1&cx=492&cy=358&chk=v1_f64df95338d294710736' },
  { id: 'volcano-28163416', title: 'Runia Rinjani', image: volcanoFallback },
  { id: 'volcano-33323560', title: 'Rinjani Dreamers Trekking', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/33/86/7b/f2/rinjani-3762maslwith.jpg?w=500&h=-1&s=1' },
  { id: 'volcano-34450139', title: 'Rinjanidreamers', image: volcanoFallback },
  { id: 'volcano-34031709', title: 'Eleventrails', image: volcanoFallback },
  { id: 'volcano-10312573', title: 'Syam Trekker', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/56/80/98/photo0jpg.jpg?w=500&h=400&s=1' },
  { id: 'volcano-10860155', title: 'Jaya Trekker', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/c2/f2/c5/sunrise-from-crater-rim.jpg?w=500&h=400&s=1' },
  { id: 'volcano-25782532', title: 'See You Rinjani - Trekking Organizer', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/17/a0/6b/rinjani-trekking-seeyourinjani.jpg?w=500&h=-1&s=1' },
  { id: 'volcano-12193321', title: 'Rinjani Trek Adventure', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/25/8b/ce/b9/get-in-senaru-villages.jpg?w=500&h=-1&s=1' },
  { id: 'volcano-12053888', title: 'Dhyns Rinjani Hiking', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/3e/7c/be/dinner-time.jpg?w=500&h=-1&s=1' },
  { id: 'volcano-10837232', title: 'Hajar Trekking', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/c6/0e/6d/photo1jpg.jpg?w=500&h=400&s=1' },
  { id: 'volcano-13225880', title: 'Star Rinjani', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/34/42/db/star-rinjani.jpg?w=500&h=400&s=1' },
  { id: 'volcano-32696940', title: 'Mount Rinjani Adventures', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/a1/cc/bd/caption.jpg?w=500&h=400&s=1' },
  { id: 'volcano-17497828', title: 'Go2Rinjani', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/78/0b/a3/on-the-top-with-tamil.jpg?w=500&h=-1&s=1' },
  { id: 'volcano-34496223', title: 'Queen Rinjani Trekking', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/33/cb/1a/bd/crater-rim.jpg?w=500&h=-1&s=1' },
  { id: 'volcano-33962469', title: 'Gili Explore', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/0a/6f/09/gili-explore-is-gili.jpg?w=500&h=-1&s=1' },
];

const volcanoExperiences = volcanoCatalog.map((item) => ({
  ...item,
  city: 'Lombok', duration: '1 day', rating: '4.7', reviews: '128', price: 35, oldPrice: null,
  badge: '', label: 'Volcano', category: 'Volcano',
  description: `Explore ${item.title} and the volcanic landscapes of Lombok with a local guide.`,
  highlights: [`Visit ${item.title}`, 'Explore Lombok’s volcanic landscape', 'Enjoy a flexible local experience'],
}));

const articleExperiences = [
  {
    id: 'bukit-selong', title: 'Bukit Selong Viewpoint', city: 'Sembalun', duration: '1 day', image: images.sumo,
    rating: '4.7', reviews: '128', price: 35, listedPrice: 3000, listedPriceCurrency: 'IDR', priceNote: 'Entrance fee',
    badge: '', label: 'Scenic viewpoint', category: 'Nature',
    description: 'Enjoy colorful hills, rice fields, and a peaceful Sembalun landscape from Bukit Selong, with a camping ground nearby.',
    location: 'Sembalun Lawang, East Lombok, West Nusa Tenggara', openingHours: '07:00–18:00 WITA',
    highlights: ['Enjoy the Bukit Selong viewpoint', 'See the colorful hills and rice fields', 'Take a scenic photo or camp nearby'],
  },
  {
    id: 'madu-waterfall', title: 'Madu Waterfall', city: 'Lombok', duration: '1 day', image: waterfallFallback,
    rating: '4.7', reviews: '128', price: 35, listedPrice: 5000, listedPriceCurrency: 'IDR', priceNote: 'Entrance fee',
    badge: '', label: 'Waterfall', category: 'Waterfall',
    description: 'Refresh yourself at Madu Waterfall and explore the natural landscape around Lombok with a flexible local experience.',
    location: 'Lombok, West Nusa Tenggara', openingHours: '07:00–17:00 WITA',
    highlights: ['Visit Madu Waterfall', 'Enjoy the surrounding natural landscape', 'Relax beside the fresh water'],
  },
  {
    id: 'desa-sade', title: 'Sade Traditional Village', city: 'Lombok', duration: '1 day', image: tripadvisorImages.tetebatu,
    rating: '4.7', reviews: '128', price: 35, listedPrice: 1363500, listedPriceCurrency: 'IDR', priceNote: 'Sade and Banyumulek one-day tour starting price',
    badge: '', label: 'Cultural experience', category: 'Culture',
    packageType: 'Cultural day tour', packageOptions: [
      { id: 'sade-banyumulek-day-tour', name: 'Sade & Banyumulek cultural day package', days: 1, duration: '1 day', price: 1363500, currency: 'IDR', pricingUnit: 'per person', includes: ['Village visit', 'Local cultural experience', 'Booking confirmation'] },
    ],
    description: 'Discover Sasak traditions in Sade Traditional Village, including local weaving and the community’s cultural performances.',
    location: 'Rembitan, Pujut, Central Lombok, West Nusa Tenggara', openingHours: '07:00–18:00 WITA',
    highlights: ['Learn about Sasak traditions', 'Try traditional weaving', 'See a local peresean performance'],
  },
  {
    id: 'desa-bonjeruk', title: 'Bonjeruk Tourism Village', city: 'Lombok', duration: '1 day', image: tripadvisorImages.mataram,
    rating: '4.7', reviews: '128', price: 35, listedPrice: 20000, listedPriceCurrency: 'IDR', priceNote: 'Entrance fee',
    badge: '', label: 'Cultural experience', category: 'Culture',
    description: 'Explore Bonjeruk Tourism Village, historic Dutch-era architecture, and local traditions including Gendang Beleq music.',
    location: 'Jonggat, Central Lombok, West Nusa Tenggara', openingHours: 'Open 24 hours',
    highlights: ['Explore historic village buildings', 'Discover local history', 'Experience Gendang Beleq music'],
  },
  {
    id: 'desa-sesaot', title: 'Sesaot Tourism Village', city: 'Lombok', duration: '1 day', image: tripadvisorImages.lombok,
    rating: '4.7', reviews: '128', price: 35, listedPrice: 20000, listedPriceCurrency: 'IDR', priceNote: 'Entrance fee',
    badge: '', label: 'Nature experience', category: 'Nature', categories: ['Nature', 'Culture'],
    description: 'Explore Sesaot Tourism Village, natural springs, Tibu Sendalem Waterfall, and the surrounding Sasak community landscape.',
    location: 'Narmada, West Lombok, West Nusa Tenggara', openingHours: '06:00–17:00 WITA',
    highlights: ['Visit Tibu Sendalem Waterfall', 'Relax at Aik Nyet natural spring', 'Stay in a traditional Sasak house'],
  },
  {
    id: 'desa-sembalun-lawang', title: 'Sembalun Lawang Tourism Village', city: 'Sembalun', duration: '1 day', image: tripadvisorImages.sembalun,
    rating: '4.7', reviews: '128', price: 35, listedPrice: 1691750, listedPriceCurrency: 'IDR', priceNote: 'Sembalun and Sindang Gile full-day tour starting price',
    badge: '', label: 'Cultural experience', category: 'Culture',
    description: 'Enjoy the green landscapes of Sembalun Lawang and try activities such as paragliding from Pergasingan or Telaga Hill.',
    location: 'Sembalun, East Lombok, West Nusa Tenggara', openingHours: '07:00–18:00 WITA',
    highlights: ['Explore Sembalun’s green landscapes', 'See the village near Mount Rinjani', 'Try a scenic outdoor activity'],
  },
];

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
    price: 44, oldPrice: 87, listedPrice: 1691750, listedPriceCurrency: 'IDR', priceNote: 'Sembalun and Sindang Gile full-day tour starting price', badge: 'Certified', label: 'Skip the line',
    packageType: 'Multi-day trek', packageOptions: [
      { id: 'rinjani-2d1n', name: 'Mount Rinjani 2D/1N hiking package', days: 2, nights: 1, duration: '2 days · 1 night', price: 2531969, currency: 'IDR', pricingUnit: 'per person', includes: ['Local trekking guide', 'Trekking route support', 'Booking confirmation'] },
      { id: 'rinjani-3d2n', name: 'Rinjani summit, lake & hot springs', days: 3, nights: 2, duration: '3 days · 2 nights', price: 4518806, currency: 'IDR', pricingUnit: 'per person', includes: ['Local trekking guide', 'Camping and route support', 'Booking confirmation'] },
    ],
    description: 'Discover the foothills and viewpoints around Mount Rinjani National Park with a local guide based near Sembalun.',
    highlights: ['Explore Rinjani landscapes', 'Visit Sembalun viewpoints', 'Enjoy stories from a local guide'],
  },
  {
    id: 'vatican', title: 'Lombok: Sendang Gile & Tiu Kelep Waterfalls Tour',
    city: 'Lombok', duration: '2 - 3 hours', image: images.vaticanTour, rating: '4.3', reviews: '85,818',
    price: 66, oldPrice: 132, listedPrice: 1582775, listedPriceCurrency: 'IDR', priceNote: 'Sendang Gile full-day tour starting price', badge: 'Certified', label: 'Skip the line',
    packageType: 'Day tour', packageOptions: [
      { id: 'sendang-gile-full-day', name: 'Sendang Gile waterfall full-day package', days: 1, duration: '1 day', price: 1582775, currency: 'IDR', pricingUnit: 'per person', includes: ['Local guide', 'Waterfall visit', 'Booking confirmation'] },
    ],
    description: 'Travel through North Lombok to discover Sendang Gile and Tiu Kelep, two of the island’s best-known waterfalls.',
    highlights: ['Visit Sendang Gile Waterfall', 'Discover Tiu Kelep Waterfall', 'Explore North Lombok with a guide'],
  },
  {
    id: 'basilica', title: 'Lombok: Benang Stokel & Benang Kelambu Waterfalls Tour',
    city: 'Lombok', duration: '2 - 4 hours', image: images.basilica, rating: '4.7', reviews: '18,880',
    price: 72, oldPrice: 119, listedPrice: 1559222, listedPriceCurrency: 'IDR', priceNote: 'Private full-day tour starting price', badge: 'Certified', label: 'Skip the line',
    packageType: 'Private day tour', packageOptions: [
      { id: 'benang-waterfalls-private', name: 'Benang Stokel & Kelambu private package', days: 1, duration: '1 day', price: 1559222, currency: 'IDR', pricingUnit: 'per person', includes: ['Private transport', 'Local guide', 'Waterfall visits'] },
    ],
    description: 'Explore Central Lombok’s Benang Stokel and Benang Kelambu waterfalls with time to enjoy the surrounding forest.',
    highlights: ['Visit Benang Stokel Waterfall', 'Discover Benang Kelambu Waterfall', 'Walk through the surrounding forest'],
  },
  {
    id: 'pantheon', title: 'Lombok: Gili Islands Island-Hopping Experience',
    city: 'Lombok', duration: '1 day', image: images.pantheon, gallery: [images.pantheon, images.pantheonThumbA, images.pantheonThumbB], cardImage: images.pantheonCard, rating: '4.1', reviews: '40', featured: true,
    price: 8, oldPrice: 13, listedPrice: 170818, listedPriceCurrency: 'IDR', priceNote: 'Gili island-hopping snorkeling trip starting price', location: 'Gili Indah, Pemenang, North Lombok, West Nusa Tenggara', openingHours: '08:00–17:00 WITA', badge: 'Likely to sell out', label: 'Audio guide',
    packageType: 'Shared or private day tour', packageOptions: [
      { id: 'gili-shared-snorkeling', name: 'Shared snorkeling tour to 3 Gilis', days: 1, duration: '1 day', price: 164872, currency: 'IDR', pricingUnit: 'per person', includes: ['Shared boat', 'Snorkeling equipment', 'Local guide'] },
      { id: 'gili-island-hopping', name: 'Gili island-hopping snorkeling trip', days: 1, duration: '1 day', price: 170818, currency: 'IDR', pricingUnit: 'per person', includes: ['Island-hopping boat', 'Snorkeling stops', 'Booking confirmation'] },
    ],
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
    price: 60, oldPrice: 68, listedPrice: 20000, listedPriceCurrency: 'IDR', priceNote: 'Entrance fee', badge: '', label: 'Dinner included', category: 'Culture',
    description: 'Spend time in Bilebante Green Tourism Village and discover local landscapes, food, and community-led experiences near Mataram.',
    highlights: ['Explore Bilebante village', 'Discover local food and landscapes', 'Meet the local community'],
  },
  {
    id: 'sumo', title: 'Sembalun: Pergasingan Hill Sunrise Trek',
    city: 'Sembalun', duration: '75 minutes - 1.5 hours', image: images.sumo, rating: '4.9', reviews: '9,101', featured: true,
    price: 35, oldPrice: null, listedPrice: 3354597, listedPriceCurrency: 'IDR', priceNote: 'Pergasingan Hill one-day trip starting price', badge: 'Likely to sell out', label: 'Scenic viewpoint', category: 'Nature',
    packageType: 'Outdoor day activity', packageOptions: [
      { id: 'pergasingan-sunrise', name: 'Pergasingan Hill sunrise hiking package', days: 1, duration: '1 day', price: 1707607, currency: 'IDR', pricingUnit: 'per person', includes: ['Local hiking guide', 'Sunrise route support', 'Booking confirmation'] },
      { id: 'sembalun-atv', name: 'Sembalun ATV adventure package', days: 1, duration: '1 day', price: 647713, currency: 'IDR', pricingUnit: 'per person', includes: ['ATV ride', 'Safety briefing', 'Local support'] },
    ],
    description: 'Climb Pergasingan Hill near Sembalun for a sunrise view across the valleys and farmland of East Lombok.',
    highlights: ['Trek to Pergasingan Hill', 'Watch the sunrise over Sembalun', 'Take a memorable landscape photo'],
  },
  ...articleExperiences,
  ...waterfallExperiences,
  ...beachExperiences,
  ...volcanoExperiences,
];

export const experienceCategories = [
  { id: 'pantai', name: 'Beach', description: 'Discover Lombok beaches and coastlines', image: beachCatalog[0].image, count: beachExperiences.length, value: 'Beach' },
  { id: 'air-terjun', name: 'Waterfall', description: 'Explore hidden waterfalls', image: waterfallCatalog[0].image, count: waterfallExperiences.length, value: 'Waterfall' },
  { id: 'gunung-berapi', name: 'Volcano', description: 'Enjoy Rinjani’s volcanic landscapes', image: volcanoCatalog[0].image, count: volcanoExperiences.length, value: 'Volcano' },
  { id: 'alam', name: 'Nature', description: 'Find viewpoints, forests, and natural escapes', image: articleExperiences.find((item) => item.category === 'Nature').image, count: experiences.filter((item) => item.category === 'Nature' || item.categories?.includes('Nature')).length, value: 'Nature' },
  { id: 'budaya', name: 'Culture', description: 'Meet Lombok communities and traditions', image: experiences.find((item) => item.category === 'Culture').image, count: experiences.filter((item) => item.category === 'Culture' || item.categories?.includes('Culture')).length, value: 'Culture' },
];

export const getExperience = (id) => experiences.find((item) => item.id === id) || experiences[0];
export const getExperienceGallery = (item) => item.gallery?.length ? item.gallery : [item.image];
export const getPackageOption = (item, optionId = '') => item?.packageOptions?.find((option) => option.id === optionId) || item?.packageOptions?.[0] || null;
export const getFeaturedExperiences = () => experiences.filter((item) => item.featured);
export const getPopularExperiences = () => experiences.filter((item) => item.popularSearch);
export const getExperiencesByCity = (city, category = '') => experiences.filter((item) => item.city.toLocaleLowerCase() === city.toLocaleLowerCase() && (!category || item.category === category || item.categories?.includes(category)));
export const demoFirebaseDocuments = {
  organizations: [{ id: 'demo-operator', schemaVersion: 1, name: 'Demo operator', status: 'draft' }],
  experiences: experiences.map((item) => toExperienceDocument(item, demoBookingData[item.id])),
  media: [...experiences.flatMap(toMediaDocuments), ...destinations.map((item) => toTileMediaDocument(item, 'destination')), ...attractions.map((item) => toTileMediaDocument(item, 'attraction'))],
  destinations: destinations.map(toDestinationDocument),
  attractions: attractions.map((item) => toDestinationDocument(item, 'attraction')),
};
