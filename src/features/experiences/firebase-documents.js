// Plain, serializable demo documents. Local asset URLs are preview-only and are never stored as Storage paths.
export const DATA_SCHEMA_VERSION = 1;

export function toExperienceDocument(item, booking, organizationId = 'demo-operator') {
  const gallery = item.gallery?.length ? item.gallery : [item.image];
  return {
    id: item.id,
    schemaVersion: DATA_SCHEMA_VERSION,
    organizationId,
    guideIds: [],
    status: 'draft',
    title: item.title,
    city: item.city,
    durationLabel: item.duration,
    summary: item.description,
    content: {
      fullDescription: item.description,
      highlights: [...item.highlights],
      includes: [...(item.packageIncludes || item.includes || ['Experience as described', 'Booking confirmation'])],
      ...(item.packageExcludes?.length ? { excludes: [...item.packageExcludes] } : {}),
      whatToBring: [...(item.whatToBring || (item.pricePending ? [] : ['Comfortable shoes', 'Passport or ID card']))],
      notAllowed: item.pricePending ? [] : ['Large bags or luggage'],
      knowBeforeYouGo: item.sourceNote || 'Please check the activity details and arrival instructions before your visit.',
    },
    cancellation: item.pricePending ? null : item.cancellation || { title: 'Free cancellation', text: 'Cancel up to 24 hours in advance for a full refund' },
    meetingPoint: { description: item.pricePending ? item.availabilityNote || 'Exact meeting and transfer arrangements are pending operator confirmation.' : 'Meeting point details will be shown with your booking confirmation.', latitude: null, longitude: null },
    pricing: item.pricePending ? {
      currency: item.listedPriceCurrency || 'IDR',
      adultBaseCents: null,
      childBaseCents: null,
      status: 'pending_operator_confirmation',
    } : {
      currency: 'USD',
      adultBaseCents: Math.round(item.price * 100),
      childBaseCents: Math.round((booking?.childPrice ?? item.price) * 100),
      ...(item.listedPrice != null ? { listedCurrency: item.listedPriceCurrency || 'IDR', listedAmount: item.listedPrice, listedNote: item.priceNote || null } : {}),
      weekdayMultiplierBasisPoints: Object.fromEntries(Object.entries(booking?.weekdayMultipliers || {}).map(([day, multiplier]) => [day, Math.round(multiplier * 10000)])),
    },
    ...(item.packageOptions?.length ? { packageType: item.packageType || 'Package', packages: item.packageOptions.map((option) => ({ id: option.id, name: option.name, durationLabel: option.duration, days: option.days || null, nights: option.nights || null, demoOnly: Boolean(option.demoOnly), pricing: { currency: option.currency || 'IDR', amount: option.price, unit: option.pricingUnit || 'per person' }, includes: [...(option.includes || [])] })) } : {}),
    ...(item.packageItinerary?.length ? { itinerary: item.packageItinerary.map((day) => ({ day: day.day, title: day.title, items: day.items.map((entry) => ({ time: entry.time, text: entry.text })) })), itineraryStatus: 'source_transcribed_operator_confirmation_required' } : {}),
    ...(item.packageExcludes?.length ? { exclusions: [...item.packageExcludes] } : {}),
    ...(item.availabilityNote ? { availabilityStatus: item.demoBookingNotice ? 'demo_departure_available' : 'not_bookable_pending_operator_confirmation', availabilityNote: item.availabilityNote, ...(item.demoBookingNotice ? { demoBookingNotice: item.demoBookingNotice } : {}) } : {}),
    ...((item.imageCredit || item.imageCredits?.length) ? { mediaAttributions: [...(item.imageCredits || []), ...(item.imageCredit ? [item.imageCredit] : [])].map((credit) => ({ label: credit.label, sourceUrl: credit.url })) } : {}),
    popularDays: [...(booking?.popularDays || [])],
    demoTimeOptions: [...(booking?.timeOptions || [])],
    rating: item.rating == null ? null : { average: Number(item.rating), count: Number(String(item.reviews).replaceAll(',', '')) },
    media: {
      coverId: `${item.id}-cover`,
      cardId: `${item.id}-card`,
      galleryIds: gallery.map((_, index) => `${item.id}-gallery-${index}`),
    },
    labels: { badge: item.badge || '', category: item.label || '' },
    featured: Boolean(item.featured),
    popularSearch: Boolean(item.popularSearch),
  };
}

export function toMediaDocuments(item) {
  const gallery = item.gallery?.length ? item.gallery : [item.image];
  const sources = [
    [`${item.id}-cover`, item.image],
    [`${item.id}-card`, item.cardImage || item.image],
    ...gallery.map((url, index) => [`${item.id}-gallery-${index}`, url]),
  ];
  return sources.map(([id, previewUrl], order) => ({
    id,
    schemaVersion: DATA_SCHEMA_VERSION,
    experienceId: item.id,
    organizationId: 'demo-operator',
    status: 'draft',
    order,
    previewUrl,
    storagePath: null,
    altText: item.title,
    licenseStatus: 'unverified',
  }));
}

export function toDestinationDocument(item, kind = 'destination') {
  return {
    id: item.name.toLowerCase().replaceAll(' ', '-'),
    schemaVersion: DATA_SCHEMA_VERSION,
    name: item.name,
    city: item.city || item.name,
    activityCount: Number(String(item.count).replace(/[^\d]/g, '')),
    mediaId: `${kind}-${item.name.toLowerCase().replaceAll(' ', '-')}`,
  };
}

export function toTileMediaDocument(item, kind) {
  const id = `${kind}-${item.name.toLowerCase().replaceAll(' ', '-')}`;
  return {
    id,
    schemaVersion: DATA_SCHEMA_VERSION,
    organizationId: 'demo-operator',
    status: 'draft',
    previewUrl: item.image,
    storagePath: null,
    altText: item.name,
    licenseStatus: 'unverified',
  };
}
