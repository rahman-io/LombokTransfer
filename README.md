# Travel Experiences PWA

Mobile first travel experience application built with vanilla JavaScript ES modules, CSS, and Vite. The screen flow and visual reference come from the supplied 58 page PDF. The local demo catalog and imagery are prototype content; several photos have been cleaned to remove interface elements embedded in the screenshots.

## Run

```sh
npm install
npm run dev
```

Open the URL printed by Vite. To verify the production build, run `npm run build` then `npm run preview`.

## Deploy to GitHub Pages

Push the repository to GitHub on the `main` branch. In **Settings → Pages**, select **GitHub Actions** as the source. The included workflow builds with a repository relative base path and deploys `dist/`. For a custom domain or a user site, set `GITHUB_PAGES_BASE=/` in the workflow.

## Project layout

- `src/app`: route and state coordination
- `src/components`: shared navigation, icons, cards, and sheets
- `src/features`: individual screens and their content
- `src/layouts`: shared page shell
- `src/services`: replaceable storage and future backend boundary
- `src/styles`: design tokens and application styles
- `src/assets`: reference images used by the prototype
- `public`: manifest, icons, and offline service worker

## Updating activities and photos

The sample catalog is in `src/features/experiences/data.js`. Each experience is one record. Add or update its `image` (cover) and optional `gallery` array (photos in swipe order); the detail screen, thumbnails, gallery counter, and modal follow that array automatically. `featured: true` selects home-page cards. Search results use each record's `city`, so they no longer show unrelated Rome activities for another destination. The interface accepts image URLs as well as imported local assets. Keep photos free of screenshot buttons, labels, and status indicators; the app renders those controls itself.

This is data-driven frontend demo content, not a live inventory feed. Connect the catalog through a service adapter when Firebase or another backend is introduced. GitHub Pages can host the current static version without Firebase. The service worker checks the network for updates first and falls back to cached content offline.

The current build is a frontend prototype. Search, photo browsing, wishlist, date selection, booking choices, profile settings, and the checkout form run locally. Authentication, live inventory, and payment processing need a backend connection before production use. The device/browser supplies its own status and system navigation UI; no clock, battery, or gesture bar is faked inside the page.

## Installation flow and PWA limits

In a normal browser, the application shows installation guidance before its screens, including login. Supported Chromium browsers can show an install button; iPhone and iPad users receive Safari Add to Home Screen instructions. Open the installed icon to continue. In local development only, a browser-preview button lets the team inspect screens without installing.

The production build precaches the app shell, code, icons, and bundled photos for offline use. The manifest requests fullscreen, then standalone as a fallback. Supported platforms can reuse an existing app window when opening an in-scope link. Sharing uses the device share sheet where available.

Installation cannot be forced by a website. A publicly hosted GitHub Pages URL remains reachable in a browser, browser-based installation detection is imperfect, and external link capture/fullscreen/zoom restrictions vary by operating system and browser. The installation screen is a UX gate, not an access-control boundary. Native-only features, true app-only access, and guaranteed deep-link capture require additional native and server-side work.
