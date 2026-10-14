import './styles/reset.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/social.css';
import './styles/messaging.css';
import './styles/recommendations.css';
import './styles/trip-intelligence.css';
import './styles/booking-intelligence.css';
import './styles/utilities.css';
import { startApp } from './app/app.js';

startApp();
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {}));
}
