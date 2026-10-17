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
