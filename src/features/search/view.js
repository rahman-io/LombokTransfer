import { destinations, experiences, getExperiencesByCity, getPopularExperiences } from '../experiences/data.js';
import { experienceCard } from '../../components/cards.js';
import { icon } from '../../components/icons.js';
import { mainLayout } from '../../layouts/MainLayout.js';
import { header } from '../../components/Header.js';
import { escapeHtml } from '../../utils/html.js';
import { state } from '../../app/store.js';

const filters = ['Golf carts', 'Entry tickets', 'Nightlife', 'Cooking classes', 'Guided tours'];
const mapCenters = {
  Rome: { latitude: 41.9028, longitude: 12.4964, zoom: 13 },
  Paris: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
  London: { latitude: 51.5072, longitude: -0.1276, zoom: 13 },
};
const experienceCoordinates = {
  colosseum: [41.8902, 12.4922],
  pantheon: [41.8986, 12.4768],
  vatican: [41.9029, 12.4534],
  basilica: [41.9022, 12.4539],
  arena: [41.8902, 12.4922],
};
export function searchView() {
  return mainLayout(`
    ${header('Search')}
    <div class="page-pad search-entry">
      <label class="search-field">${icon('search', 21)}<input id="place-search" type="search" placeholder="Find places and things to do" autocomplete="off" value="${escapeHtml(state.search)}" autofocus /></label>
      <div id="search-suggestions">
        <h2>Top destinations</h2>
        ${destinations.map((item) => `<a class="suggestion" href="#/results?city=${encodeURIComponent(item.name)}"><img src="${escapeHtml(item.image)}" alt="" /><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.count)}</small></span>${icon('chevron', 20)}</a>`).join('')}
        <h2>Popular experiences</h2>
        ${getPopularExperiences().map((item) => `<a class="suggestion" href="#/experience/${encodeURIComponent(item.id)}"><img src="${escapeHtml(item.image)}" alt="" /><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.city)}</small></span>${icon('chevron', 20)}</a>`).join('')}
      </div>
    </div>
  `, 'Discover');
}
export function resultsView(city = 'Rome') {
  const resultItems = getExperiencesByCity(city);
  return mainLayout(`
    <div class="results-top"><div class="results-search"><a href="#/search" aria-label="Change search">${icon('arrow', 22)} <span>${escapeHtml(city)}</span></a><button data-action="open-dates" class="text-button">${icon('calendar', 20)} Add dates</button></div>
      <div class="chip-row"><button class="chip round" data-action="filter-sheet">${icon('sliders', 20)}</button>${filters.map((filter) => `<button class="chip ${state.filter === filter ? 'selected' : ''}" data-action="set-filter" data-value="${filter}">${filter}</button>`).join('')}</div>
    </div>
    <div class="result-count">${resultItems.length} ${resultItems.length === 1 ? 'result' : 'results'} ${icon('info', 16)}</div>
    <div class="result-list">${resultItems.length ? resultItems.map((item) => experienceCard(item)).join('') : `<div class="empty-state"><h2>No activities in ${escapeHtml(city)} yet</h2><p>Try another destination while we add more experiences.</p><a class="outline-button" href="#/search">Explore destinations</a></div>`}</div>
    ${city.toLocaleLowerCase() === 'rome' && resultItems.length ? `<button class="floating-map" data-action="show-map">${icon('map', 21)} Open map</button>` : ''}
  `, 'Discover', { className: 'results-page' });
}
export function mapView(city = 'Rome') {
  const center = mapCenters[city] || mapCenters.Rome;
  const mapItems = [experiences[4], experiences[0], experiences[2]];
  const points = mapItems.map((item) => ({
    id: item.id,
    title: item.title,
    city: item.city,
    price: item.price,
    coordinates: experienceCoordinates[item.id] || [center.latitude, center.longitude],
  }));
  return mainLayout(`
    <div class="map-canvas" data-map-canvas data-map-city="${escapeHtml(city)}" data-map-center="${escapeHtml(JSON.stringify(center))}" data-map-points="${escapeHtml(JSON.stringify(points))}">
      <div class="map-toolbar"><button class="round-white" data-action="back">${icon('close')}</button><a href="#/search" class="map-search">${icon('search', 19)}<span>Search for a place or address</span></a></div>
      <div class="chip-row map-chips"><button class="chip selected" data-action="filter-sheet">${icon('sliders', 19)} 1</button><button class="chip selected" data-action="set-filter" data-value="Guided tours">♧ Guided tours ×</button><button class="chip">♧ Entry tickets</button></div>
      <button class="map-locate" data-action="map-locate" aria-label="Show my location">${icon('location', 19)}</button>
      <div class="map-loading" data-map-loading>Loading live map…</div>
    </div>
    <div class="map-results"><div class="sheet-handle"></div>${mapItems.map((item) => experienceCard(item)).join('')}<a href="#/results?city=${encodeURIComponent(city)}" class="outline-button">View list</a></div>
  `, 'Discover', { className: 'map-page' });
}
