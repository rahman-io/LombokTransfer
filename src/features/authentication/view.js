import { images } from '../experiences/data.js';
import { icon } from '../../components/icons.js';
export function loginView() {
  return `<div class="app-shell auth-shell">
    <div class="auth-photo" style="background-image:url('${images.login}')"><div class="brand">GET<br/>YOUR<br/>GUIDE</div><button class="auth-close" data-action="dismiss-login">${icon('close', 29)}</button></div>
    <div class="auth-content"><button class="auth-social" data-action="auth-placeholder"><span class="google-g">G</span>Continue with Google</button><button class="auth-social" data-action="auth-placeholder"><span class="facebook-f">f</span>Continue with Facebook</button><div class="or"><span>or</span></div>
      <input id="login-email" type="email" placeholder="Email address" autocomplete="email" />
      <button class="auth-social" data-action="continue-email">${icon('mail', 21)} Continue with email</button>
      <p>Continue to log in or sign up and accept our <u>Terms and Conditions</u>. See our <u>Privacy Policy</u>.</p>
      <label class="offer-switch"><span>Send me discounts and other offers by email. Opt out any time in your settings</span><input type="checkbox" checked /><i></i></label>
    </div></div>`;
}
