// Port-transfer catalog (vehicle + driver transfers from Lembar Port). Stable ids and plain
// objects deliberately mirror future Firestore documents, the same convention used by
// experiences/data.js and social/data.js elsewhere in this app.

export const transportVehicleClasses = [
  { code: 'mpv_standard', name: 'Standard MPV', exampleVehicles: 'Toyota Avanza, Daihatsu Xenia', maxPassengers: 6, maxLuggage: 4, sortOrder: 1 },
  { code: 'mpv_premium', name: 'Premium MPV', exampleVehicles: 'Toyota Innova, Innova Zenix', maxPassengers: 6, maxLuggage: 5, sortOrder: 2 },
  { code: 'van', name: 'Van (group)', exampleVehicles: 'Toyota Hiace', maxPassengers: 14, maxLuggage: 10, sortOrder: 3 },
];

export const transportZones = [
  {
    id: 1, code: 'SGI', name: 'Senggigi', description: "Lombok's original beach strip, roughly 20–30 minutes from the airport.",
    locations: [{ id: 101, name: 'Senggigi Beach hotels', durationMinEst: 70 }],
  },
  {
    id: 2, code: 'KTA', name: 'Kuta Mandalika', description: 'South coast surf and resort area around Mandalika.',
    locations: [
      { id: 201, name: 'Kuta Lombok town centre', durationMinEst: 55 },
      { id: 202, name: 'Tanjung Aan Beach', durationMinEst: 65 },
      { id: 203, name: 'Selong Belanak Beach', durationMinEst: 75 },
      { id: 204, name: 'Mawun Beach', durationMinEst: 80 },
    ],
  },
  {
    id: 3, code: 'MTR', name: 'Mataram & Airport', description: 'Provincial capital and Zainuddin Abdul Madjid International Airport.',
    locations: [
      { id: 301, name: 'Mataram city centre', durationMinEst: 50 },
      { id: 302, name: 'Lombok International Airport (LOP)', durationMinEst: 45 },
    ],
  },
  {
    id: 4, code: 'GLI', name: 'Gili Islands (via Bangsal)', description: 'Road transfer to the Bangsal crossing point for Gili Trawangan, Air and Meno.',
    locations: [{ id: 401, name: 'Bangsal Harbour', durationMinEst: 120 }],
  },
  {
    id: 5, code: 'SBL', name: 'Sembalun & Rinjani', description: 'Gateway villages for Mount Rinjani treks.',
    locations: [{ id: 501, name: 'Sembalun Lawang village', durationMinEst: 180 }],
  },
];

// Flat fare per zone x vehicle class (IDR), matching the "managed marketplace, fixed tariff"
// model this feature is adopted from. Keyed by zone id for O(1) lookup.
export const transportTariffs = {
  1: { mpv_standard: 350000, mpv_premium: 480000, van: 650000 },
  2: { mpv_standard: 420000, mpv_premium: 560000, van: 780000 },
  3: { mpv_standard: 300000, mpv_premium: 420000, van: 600000 },
  4: { mpv_standard: 550000, mpv_premium: 700000, van: 950000 },
  5: { mpv_standard: 750000, mpv_premium: 950000, van: 1250000 },
};

export const transportSurcharges = [
  { code: 'night', label: 'Night transfer (22:00–06:00)', calcType: 'flat', amount: 75000 },
  { code: 'holiday', label: 'Public holiday', calcType: 'percent', amount: 15 },
  { code: 'child_seat', label: 'Child seat', calcType: 'flat_per_unit', amount: 35000 },
  { code: 'roof_rack', label: 'Roof rack / surfboard rack', calcType: 'flat', amount: 50000 },
];

export const transportHolidayDates = ['2026-10-28', '2026-11-25'];

export const transportMeetingPoints = [
  { id: 1, name: 'Lembar Port arrival hall', instructions: 'Exit the ferry arrival hall and look for a driver holding a FindMyGuide name board near Gate 2.', photoUrl: null },
  { id: 2, name: 'Lembar Port parking zone B', instructions: 'Walk past the ticket counters to the public parking area; your driver will be waiting in Zone B.', photoUrl: null },
];

// Padangbai (Bali) and Lembar (Lombok) are both WITA, so pickup timing needs no timezone offset.
export const transportFerryRoutes = [
  { id: 1, name: 'Padangbai – Lembar', operator: 'ASDP Indonesia Ferry', crossingMinMin: 240, crossingMinMax: 330 },
  { id: 2, name: 'Padangbai – Lembar (Express)', operator: 'ASDP Indonesia Ferry Express', crossingMinMin: 180, crossingMinMax: 240 },
];

export const transportDrivers = [
  { id: 'driver-wayan', name: 'Wayan Suarta', initials: 'WS', ratingAvg: 4.9, tripsCompleted: 212, phone: '+6281234500001', status: 'verified', vehicle: { brand: 'Toyota', model: 'Avanza', color: 'Silver', plateNumber: 'DR 1234 AB' } },
  { id: 'driver-made', name: 'Made Artana', initials: 'MA', ratingAvg: 4.8, tripsCompleted: 156, phone: '+6281234500002', status: 'verified', vehicle: { brand: 'Toyota', model: 'Innova Zenix', color: 'White', plateNumber: 'DR 5678 CD' } },
  { id: 'driver-ketut', name: 'Ketut Sudiarta', initials: 'KS', ratingAvg: 4.95, tripsCompleted: 301, phone: '+6281234500003', status: 'verified', vehicle: { brand: 'Toyota', model: 'Hiace', color: 'White', plateNumber: 'DR 9012 EF' } },
];

export function transportZoneByLocationId(locationId) {
  return transportZones.find((zone) => zone.locations.some((location) => location.id === Number(locationId))) || null;
}
export function transportLocationById(id) {
  for (const zone of transportZones) {
    const location = zone.locations.find((entry) => entry.id === Number(id));
    if (location) return { ...location, zoneId: zone.id };
  }
  return null;
}
export function transportVehicleClassByCode(code) {
  return transportVehicleClasses.find((entry) => entry.code === code) || null;
}
export function transportTariffFor(zoneId, vehicleClassCode) {
  const amount = transportTariffs[zoneId]?.[vehicleClassCode];
  return Number.isFinite(amount) ? amount : null;
}
export function transportPriceList() {
  return transportZones.map((zone) => ({ zone, prices: Object.fromEntries(transportVehicleClasses.map((cls) => [cls.code, transportTariffFor(zone.id, cls.code)])) }));
}
export function transportMeetingPointById(id) {
  return transportMeetingPoints.find((entry) => entry.id === Number(id)) || null;
}
export function transportFerryRouteById(id) {
  return transportFerryRoutes.find((entry) => entry.id === Number(id)) || null;
}
export function transportDriverById(id) {
  return transportDrivers.find((entry) => entry.id === id) || null;
}

// Curated aliases for well-known Lombok landmarks that aren't already a zone location's exact
// name (e.g. "Mount Rinjani" is climbed from the Sembalun Lawang pickup point). Each alias
// resolves to a real transportZones location id, so price and duration always come from that
// zone's own, already-verified tariff and estimate — no new fare is invented for the alias.
// Well-known non-Lombok landmarks (kept as a small local list, not imported from Discover's
// catalog, so this file stays free of Discover's image-asset imports — those can't be resolved
// outside a bundler and would break every other feature's tests that happen to import this file).
export const transportOutOfCoverageLandmarks = [
  { name: 'Pulau Kenawa', city: 'Sumbawa' },
  { name: 'Pulau Moyo', city: 'Sumbawa' },
  { name: 'Mata Jitu Waterfall', city: 'Sumbawa' },
  { name: 'Whale shark encounter', city: 'Sumbawa' },
  { name: 'Sumbawa', city: 'Sumbawa' },
];

export const transportDestinationAliases = [
  { alias: 'Mount Rinjani', locationId: 501 },
  { alias: 'Rinjani summit', locationId: 501 },
  { alias: 'Gili Trawangan', locationId: 401 },
  { alias: 'Gili Air', locationId: 401 },
  { alias: 'Gili Meno', locationId: 401 },
  { alias: 'Mandalika', locationId: 201 },
  { alias: 'Mandalika Circuit', locationId: 201 },
  { alias: 'Bangsal Harbour crossing', locationId: 401 },
  { alias: 'Lombok Airport', locationId: 302 },
  { alias: 'LOP', locationId: 302 },
];

// Finds destinations matching free text: real zone locations first, then the curated aliases
// above (both resolve to a priced, zoned location). An empty query returns every real location,
// grouped by zone, matching what the old <select>'s full option list showed. If nothing in
// Lombok matches, checks Discover's own attraction catalog for a same-name place outside Lombok
// (Sumbawa) so the UI can explain why it isn't bookable here instead of just showing "no results".
export function transportSearchDestinations(query) {
  const normalized = String(query || '').trim().toLocaleLowerCase();
  if (!normalized) {
    return { matches: transportZones.flatMap((zone) => zone.locations.map((location) => ({ ...location, zoneId: zone.id, zoneName: zone.name }))), outOfCoverage: null };
  }
  const seen = new Set();
  const matches = [];
  const addMatch = (location, zone) => {
    if (!location || seen.has(location.id)) return;
    seen.add(location.id);
    matches.push({ ...location, zoneId: zone.id, zoneName: zone.name });
  };
  transportZones.forEach((zone) => zone.locations.forEach((location) => {
    if (location.name.toLocaleLowerCase().includes(normalized)) addMatch(location, zone);
  }));
  transportDestinationAliases.forEach((entry) => {
    if (!entry.alias.toLocaleLowerCase().includes(normalized)) return;
    const location = transportLocationById(entry.locationId);
    if (location) addMatch(location, transportZones.find((zone) => zone.id === location.zoneId));
  });
  if (matches.length) return { matches, outOfCoverage: null };
  const outside = transportOutOfCoverageLandmarks.find((item) => item.name.toLocaleLowerCase().includes(normalized));
  return { matches: [], outOfCoverage: outside || null };
}
