import { bottomNavigation } from '../components/BottomNavigation.js';
export function mainLayout(content, active = 'Discover', options = {}) {
  return `<div class="app-shell ${options.hideNavigation && options.className !== 'guide-shell' ? 'chat-app-shell' : ''}"><main class="main-content ${options.className || ''}">${content}</main>${options.footer || ''}${options.hideNavigation ? '' : bottomNavigation(active)}</div>`;
}
