// Demo-only booking data. Replace these records with provider data when a backend is connected.
const weekdayMultipliers = { 0: 1.12, 1: 1, 2: 1.03, 3: 1.05, 4: 1.08, 5: 1.1, 6: 1.15 };
const demoTimeOptions = ['6:00 PM', '7:30 PM'];
const bookedTravelers = [
  { id: 'maya', initials: 'MP', color: '#bb724f' },
  { id: 'dario', initials: 'DR', color: '#a05d50' },
  { id: 'sophie', initials: 'SW', color: '#587f8c' },
  { id: 'nina', initials: 'NS', color: '#8f6383' },
];

export const demoBookingData = {
  colosseum: { childPrice: 39, weekdayMultipliers, timeOptions: demoTimeOptions, travelersBooked: 4, bookedTravelers },
  arena: { childPrice: 32, weekdayMultipliers, timeOptions: demoTimeOptions, travelersBooked: 3, bookedTravelers: bookedTravelers.slice(0, 3) },
  vatican: { childPrice: 47, weekdayMultipliers, timeOptions: demoTimeOptions, travelersBooked: 2, bookedTravelers: bookedTravelers.slice(0, 2) },
  basilica: { childPrice: 52, weekdayMultipliers, timeOptions: demoTimeOptions, travelersBooked: 2, bookedTravelers: bookedTravelers.slice(0, 2) },
  pantheon: { childPrice: 6, weekdayMultipliers, timeOptions: demoTimeOptions, travelersBooked: 4, bookedTravelers },
  skydiving: { childPrice: 160, weekdayMultipliers, timeOptions: demoTimeOptions, popularDays: [4, 6], travelersBooked: 4, bookedTravelers },
  kayaking: { childPrice: 37, weekdayMultipliers, timeOptions: demoTimeOptions, popularDays: [4, 6], travelersBooked: 4, bookedTravelers },
  agafay: { childPrice: 43, weekdayMultipliers, timeOptions: demoTimeOptions, travelersBooked: 2, bookedTravelers: bookedTravelers.slice(0, 2) },
  sumo: { childPrice: 25, weekdayMultipliers, timeOptions: demoTimeOptions, popularDays: [5, 6], travelersBooked: 3, bookedTravelers: bookedTravelers.slice(0, 3) },
};

export function getDemoBooking(item) {
  return demoBookingData[item.id];
}

export function calculateDemoQuote(item, { adults = 1, children = 0, date = '' } = {}) {
  const booking = getDemoBooking(item);
  const day = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T12:00:00`).getDay() : null;
  const multiplier = day === null || Number.isNaN(day) ? 1 : booking?.weekdayMultipliers?.[day] ?? 1;
  const adultCents = Math.round(item.price * multiplier * 100);
  const childCents = Math.round((booking?.childPrice ?? item.price) * multiplier * 100);
  return {
    adultPrice: adultCents / 100,
    childPrice: childCents / 100,
    total: (adultCents * adults + childCents * children) / 100,
  };
}

export function formatDemoPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

export function formatListedPrice(item) {
  const amount = item?.listedPrice ?? item?.price ?? 0;
  if (item?.listedPriceCurrency === 'IDR') return `Rp${Math.round(amount).toLocaleString('id-ID')}`;
  return `$${amount}`;
}
