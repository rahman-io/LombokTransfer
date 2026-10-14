import { bottomNavigation } from '../components/BottomNavigation.js';
export function mainLayout(content, active = 'Discover', options = {}) {
  return `<div class="app-shell"><main class="main-content ${options.className || ''}">${content}</main>${options.footer || ''}${bottomNavigation(active)}</div>`;
}
