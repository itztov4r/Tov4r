# TOV4R — Gaming Portfolio

**Live site:** https://tov4r.xyz/

A responsive red/black gaming portfolio showcasing existing CS2/Medal video links, Steam and XPLAY profiles, illustrative crosshair demos, gaming setup, community and gaming journey.

## Website V3 (November 2026)

### Mobile Experience V3
- Accessible responsive hamburger menu with Escape, ARIA expanded state, close-on-navigation, and narrow-screen optimizations.
- Existing animations, soundtrack, desktop navigation and images retained.

### Featured Clip of the Week
- Homepage player/editorial spotlight rotating **every Monday UTC** among the **four already linked Medal clips**.
- Original Medal links remain available if an iframe cannot play. Existing background audio pauses while the featured clip is open.
- Browser-native share or copied original URL fallback.
- “Featured” is a website pick, **not** a recent match, award, newly uploaded clip or official statistic.

### My Gaming Journey
- Uses XPLAY's member-since date already displayed in the existing website, with links to check it.
- Linked Medal clips are listed without unverified recording dates.
- Website milestones and future ideas are marked honestly.

### Install TOV4R App (PWA)
- Manifest, real PNG icons (192px and 512px), Apple touch icon (180px), install button, iPhone/Safari home-screen guidance.
- Service worker caches a static shell after successful first load. Existing Medal embeds, third-party content and background MP3 require internet.
- Android Chrome: browser Install app (if offered). iPhone Safari: Share → Add to Home Screen. Desktop Chrome/Edge: browser install menu (if offered).

### Analytics & SEO
- Canonical URL, social share metadata, JSON-LD WebSite schema, robots.txt, sitemap.xml.
- **Privacy-first analytics support is ready but disabled** until the owner connects an Umami account and supplies their site's public Website ID. No fabricated visitor numbers; no third-party tracker loaded while disabled.
- Setup: create a site for tov4r.xyz in Umami Cloud; copy its public Website ID (UUID); update assets/tov4r-analytics-config.js so provider is "umami" and websiteId is that real UUID.
- Never commit Umami API tokens, passwords or secrets; the Website ID is only public site configuration. The integration respects Do Not Track and Global Privacy Control.
- Umami's dashboard will contain real visitor numbers after configuration and actual visits. Search ranking/indexing isn't guaranteed by deploying a sitemap.

## CS2 accuracy and preservation
- All existing gaming sections, original artwork, Discord links, Medal clips, setup, social media, soundtrack, and player settings remain intact.
- Original sample settings such as “800 · CONCEPT”, “1.20 · CONCEPT”, and “1280 × 960 · 4:3 IDEA” remain examples, **not** verified personal settings. Official crosshair import code remains unset.
- No invented ranks, trophies, match results, owned items or visitor counts.

## Acceptance checklist
1. Desktop and narrow phone: menu opens, Escape dismisses, navigation works and scrolling remains usable.
2. Featured clip: check selected original URL, play, close, audio pause/resume and share behavior.
3. Journey: check date labels and the unconfirmed-date disclaimer.
4. Check /manifest.webmanifest, /icons/tov4r-192.png, /icons/tov4r-512.png, /service-worker.js and /sitemap.xml return successfully.
5. Install on a supported browser; mobile Safari uses Share → Add to Home Screen.
6. Existing crosshair controls, loadout, music dock, Highlights and Discord still work.
7. If enabled, use Umami's **actual** dashboard for page views.
8. Check keyboard navigation, reduced-motion preference, and offline cached-shell behavior.

Built with static HTML, CSS and JavaScript for GitHub Pages.

## Redline visual refresh (November 2026)

- Four **original locally hosted SVG illustrations** replace the signed/expiring Medal thumbnail images. Original Medal clip URLs, controls, playback and clip titles remain unchanged. These posters are deliberately marked *illustrations*, not gameplay captures.
- The weekly highlighted video now switches its illustration to match the selected existing Medal clip (Monday UTC rotation).
- Added the **Redline Visual Board** with two licensed Unsplash gaming-atmosphere photographs and a TOV4R original graphic, including links to the original photo sources. These are moodboard images **not** the owner's real setup or inventory. If a remote photo is blocked, a local SVG appears.
- Replaced four empty `href="#"` game-card links with descriptive, non-clickable cards. Site sections, navigation, personal hardware image and settings preserved.
- Visual consistency: crimson gradients, improved contrast, refined image cards, mobile gallery layout, reduced-motion accommodations, local poster cache.

### Artwork / photo credits

- TOV4R poster artwork: original SVGs in `assets/media/clip-*.svg`.
- Unsplash atmospheric setup photo: https://unsplash.com/photos/a-desktop-computer-sitting-on-top-of-a-wooden-desk-wvqOnlLZn2o
- Unsplash red-lit desktop photo by **Luca Hooijer**: https://unsplash.com/photos/a-desktop-computer-sitting-on-top-of-a-wooden-desk-Eogh68FBB7c
- License for the photos: https://unsplash.com/license (free commercial/personal reuse; credit appreciated). Pinterest inspiration is not automatically licensed for republication.
- Photos are loaded lazily from images.unsplash.com; offline fallback uses original local art. Online video clips remain hosted on Medal.

### Visual refresh QA

1. Open `/#visual-board` on desktop and phone to inspect all three mood cards and credit links.
2. Check four `/#highlights` cards: original posters are visible; the PLAY HERE buttons open their existing Medal clips.
3. Confirm that the featured clip rotates among the same original four and shows the matching illustrated poster.
4. The four game cards should no longer jump to the top when clicked.
5. Check `/#setup` still shows the original personal hardware details/image and `/#cs2-settings` retains the same example DPI/sensitivity/resolution/crosshair state.
6. Verify the new service worker has a bumped cache version and mobile installation still works.


## TOV4R V5 · Clips, progress, sharing, gallery and analytics

**Clip Manager / #clip-manager:** The public clip library is driven by \`assets/tov4r-clips.js\`. It initially contains exactly the four already-linked Medal clips and preserves the previous Highlights gallery. The on-page *local draft workspace* lets any visitor prepare their own unpublished draft. It does **not** authenticate as an admin or publish directly. To publish your own changes:

1. Open Clip Manager → "Edit a private draft". Add real Medal clip URLs, enter truthful clip titles/map names and optionally choose a featured video, or leave the default weekly rotation.
2. Save locally (optional), then press **Export for GitHub**. A new \`tov4r-clips.js\` file downloads. You can also use Copy Config.
3. In your own GitHub repo, replace **\`assets/tov4r-clips.js\`** with that exported content, commit to \`main\` and let GitHub Pages deploy.
4. Public site reads the committed version; the PWA tries **network-first** for this configuration so publishing later changes does not leave the old clip list permanently cached.

Clips must be valid \`https://medal.tv/clips/<clip-id>\` or their official Counter-Strike 2 canonical Medal URLs. The editor accepts up to 40 entries and uses locally hosted illustrated artwork; it never invents wins, game statistics or dates. The original four featured clip links remain as a safe default, and the older Medal gallery keeps its existing player.

**CS2 Progress Tracker / #progress-tracker:** Starts with **zero entries**. Date, map, outcome, and optional kills/deaths are entered manually and stored only in that browser's \`localStorage\`. Counts/ratio are computed only from entries and are **not verified Steam/XPLAY statistics**. Export a local JSON backup or clear your data if you wish. No server, public scoreboard, accounts, or user tracking.

**Share Profile / #share-profile:** Real offline-generated QR code for \`https://tov4r.xyz/\`, Copy Link and browser-native Share (fallback to clipboard). No third-party QR requests.

**Gaming Setup Gallery / #setup-gallery:** Reuses existing TOV4R \`pc-setup.jpg\` and previously committed TOV4R original illustration assets. A native dialog enlarges images. Illustrations are labeled *concept artwork*, not photographs or owned hardware.

**Real Analytics Dashboard / #analytics-dashboard:** Status-only until a **real Umami site** is connected. The panel links to \`https://cloud.umami.is/\`, the official Google Search Console and this site's sitemap. It **does not show fabricated visits** or require sensitive account tokens in the repository. Set up your own Umami Website ID and commit a valid \`window.TOV4R_ANALYTICS={provider:"umami",websiteId:"YOUR_PUBLIC_UUID"};\` in \`assets/tov4r-analytics-config.js\`. Visitors' data, where available, is viewed in your authenticated Umami dashboard, not fetched with exposed API keys. Browser DNT / GPC support from V3 remains active.

### V5 regression and privacy checklist

- All old site sections, TOV4R artwork and personal setup photo, CS2 sample settings and crosshair, game cards, music dock, four Medal clips, and interactive loadout must remain intact.
- Test local clip draft add/remove/pin, exported JS content and the published featured selection. Loading a new public clip configuration must not cause unsafe HTML injection.
- Verify first use of CS2 Progress Tracker says **NO ENTRIES YET** and logging/clearing/export works on your own device; no stats are fabricated.
- Scan the QR with a camera; it must open exactly \`https://tov4r.xyz/\`.
- Open and close setup artwork dialog; verify the personal photo is unchanged.
- Analytics should say **NOT CONNECTED** until a real public Umami Website ID is committed. No private tokens or fake dashboard traffic.
- Check desktop and mobile navigation and PWA service-worker version, including network-first updates of public clip/analytics configuration.

GitHub CI runs \`node scripts/verify-site.cjs\` on PRs and \`main\`.


## V5 Photo-first refresh (November 2026)

The V5 sections use genuine gaming hardware photography, not synthetic screenshots. Each section has a real licensed full-width image and typography overlays. Clip Manager uses real gaming atmosphere pictures, clearly labeled as not actual Medal frames; all original videos remain unchanged.

- Clip Manager: authentic RGB desktop photo.
- CS2 Progress: red-backlit mechanical keyboard photo.
- Share Profile: real gaming desk photo; QR/copy/share preserved.
- Setup Gallery: keeps the site's original pc-setup.jpg and adds two inspiration photographs, never claimed to be TOV4R-owned equipment.
- Analytics: actual RGB desktop photograph; tracking remains disabled pending genuine Umami connection.

Photo license: https://unsplash.com/license . Original photo source pages:

- https://unsplash.com/photos/a-desktop-computer-sitting-on-top-of-a-wooden-desk-Ie9BekWw_Uk
- https://unsplash.com/photos/a-close-up-of-a-red-and-black-keyboard-h7h_0TSQcRM
- https://unsplash.com/photos/a-desktop-computer-sitting-on-top-of-a-wooden-desk-wvqOnlLZn2o
- https://unsplash.com/photos/a-desk-with-a-laptop-and-a-computer-monitor-DdiwOzeqkDU
- https://unsplash.com/photos/a-desktop-computer-sitting-on-top-of-a-desk-2rQoMZLVXHc
- https://unsplash.com/photos/a-desktop-computer-sitting-on-top-of-a-wooden-desk-Eogh68FBB7c (Luca Hooijer)

Photos use image sizing parameters on images.unsplash.com, lazy loading and a fallback to existing local photos where available. External photo hosting receives standard image requests. No unlicensed Pinterest imagery was copied.

Privacy and honesty: references do not imply the pictured setup belongs to TOV4R. Existing CS2 demo settings, player data and Medal links are preserved. Site visitor counts remain unconnected until an authentic Umami Website ID is committed.

Regression: original setup photo, CS2 controls, soundtrack, QR, featured clip, setup gallery and PWA remain. Cache version was incremented and CI checks licensing labels, gallery sources and fallbacks.

## Mobile photographic polish · 9 November 2026

This release responds to owner-supplied iPhone screenshots showing overlapping Medal poster labels and a soundtrack dock covering page content.

- Four existing Medal highlight cards now show real licensed Unsplash RGB gaming desk and keyboard photography instead of abstract SVG posters. These are illustrative mood photos, not actual video frames. The original Medal video URLs are unchanged.
- Remove conflicting ARTWORK / VIDEO OPENS ON PLAY CSS pseudo-labels and decorative square frames; restore full-width 16:9 posters and legible overlay controls.
- Add real photo backdrops to CS2 profile, community mode cards, Crosshair Studio visual demo, loadout theme cards, achievement/idea cards and the Discord community hub. No ownership, rank, match history or real game inventory is implied.
- On iPhone/narrow screens the original soundtrack becomes a compact one-line player. The MORE/LESS control reveals seek and volume controls, with pause/play and mute preserved.
- External photo URLs use images.unsplash.com and HTML images include local fallback pictures where appropriate; CSS backgrounds retain local solid-color fallback if offline.
- GitHub Pages PWA shell cache bumped to v8; original images, settings, music file, and links are preserved.

Attribution and licensed photo sources:
- https://unsplash.com/license
- https://unsplash.com/photos/black-flat-screen-computer-monitor-turned-on-near-black-computer-keyboard-B10AxHKLvnQ
- Other photo sources documented in the V5 photo-first refresh section above.

iPhone QA: check /#highlights for correctly filled posters and one unobstructed play button, then inspect photo-rich CS2, Loadout, Achievements and Discord. MORE expands the audio progress controls. Safari bottom-toolbar behavior varies by device.


## 9 November 2026 — Analytics + navigation fixes
- Umami public Website ID is configured in `assets/tov4r-analytics-config.js`. The only loader is in `assets/tov4r-v3.js`, gated by Do Not Track and Global Privacy Control. Never add a second hardcoded tracking script.
- Visit counts remain in the owner's Umami dashboard. `/privacy.html` provides a readable notice.
- `/downloads/` is linked from the quick navigation and footer. External game photos remain credited and original Medal gameplay stays linked.
- Remote Steam avatar has a local fallback; service worker no longer serves the homepage when an unrelated offline path fails.
- Run `node scripts/verify-site.cjs` after edits.
