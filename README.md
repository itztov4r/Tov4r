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
