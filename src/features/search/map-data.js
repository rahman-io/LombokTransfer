// Only catalog activities with known coordinates are placed on the map.
export const mapDestinations = {
  Rome: { center: [41.9028, 12.4805], zoom: 13, areas: [
    { id: 'historic-center', name: 'Historic Center', bounds: [41.879, 12.465, 41.910, 12.510] },
    { id: 'vatican-city', name: 'Vatican City', bounds: [41.898, 12.445, 41.911, 12.465] },
  ] },
  Paris: { center: [48.8566, 2.3522], zoom: 13, areas: [] },
  London: { center: [51.5072, -0.1276], zoom: 13, areas: [] },
};

export const mapActivities = {
  colosseum: { coordinates: [41.8902, 12.4922], area: 'historic-center', category: 'tour' },
  arena: { coordinates: [41.8902, 12.4922], area: 'historic-center', category: 'tour' },
  pantheon: { coordinates: [41.8986, 12.4768], area: 'historic-center', category: 'ticket' },
  vatican: { coordinates: [41.9029, 12.4534], area: 'vatican-city', category: 'tour' },
  basilica: { coordinates: [41.9022, 12.4539], area: 'vatican-city', category: 'tour' },
};

export function validCoordinates(point) {
  return Array.isArray(point) && point.length === 2 && point.every(Number.isFinite) && Math.abs(point[0]) <= 90 && Math.abs(point[1]) <= 180;
}

export function distanceMeters(from, to) {
  if (!validCoordinates(from) || !validCoordinates(to)) return null;
  const radians = (value) => value * Math.PI / 180;
  const a = Math.sin(radians(to[0] - from[0]) / 2) ** 2 + Math.cos(radians(from[0])) * Math.cos(radians(to[0])) * Math.sin(radians(to[1] - from[1]) / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, a))));
}

export function formatDistance(from, to) {
  const meters = distanceMeters(from, to);
  if (meters === null) return '';
  return meters < 1000 ? `${Math.round(meters)} m away` : `${(meters / 1000).toFixed(1)} km away`;
}

export function inBounds(point, bounds) {
  return validCoordinates(point) && point[0] >= bounds[0] && point[0] <= bounds[2] && point[1] >= bounds[1] && point[1] <= bounds[3];
}

export function filterMapActivities(points, { area = 'all', category = 'all', mode = 'all', bounds } = {}) {
  if (mode === 'restaurant' || mode === 'hotel') return [];
  return points.filter((point) => (area === 'all' || area === 'view' || point.area === area)
    && (category === 'all' || point.category === category)
    && (!bounds || inBounds(point.coordinates, bounds)));
}

export function parseMapPlaces(data) {
  if (!Array.isArray(data?.elements) || data.remark) throw new Error('Incomplete nearby places response');
  const seen = new Set();
  return data.elements.flatMap((element) => {
    const tags = element.tags || {};
    const type = tags.amenity === 'restaurant' ? 'restaurant' : tags.tourism === 'hotel' ? 'hotel' : null;
    const coordinates = [element.lat ?? element.center?.lat, element.lon ?? element.center?.lon];
    if (!type || typeof tags.name !== 'string' || !tags.name.trim() || !validCoordinates(coordinates)) return [];
    const key = `${type}:${tags.name.trim()}:${coordinates.map((value) => value.toFixed(4)).join(',')}`;
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ id: `${element.type}-${element.id}`, name: tags.name.trim(), type, coordinates }];
  });
}

export function locationErrorMessage(error) {
  if (error.code === 1) return 'Location access is blocked. Allow it in your browser’s site settings, then try again.';
  if (error.code === 3) return 'Finding your location took too long. Try again near a window or outdoors.';
  return 'Your device could not determine its location. Check location services and try again.';
}
