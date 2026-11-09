# TOV4R DOWNLOAD

Independent, mobile-first catalogue of free games. The initial version uses official download pages only: **no game installers, modified executables, cracks, or copyrighted reuploads are hosted**.

## Preview
When published inside the main TOV4R GitHub Pages repo, this prototype lives at `https://tov4r.xyz/downloads/`. This is an **ad-free preview** only.

## Add a game
Edit `games.js` and add one object to `window.TOV4R_DOWNLOAD_GAMES` with:
- `id`: unique lowercase identifier
- `name`, `tag`, `genre`, `os`: title and filters
- `description`, `details`, `install`: **original** explanatory text
- `url`: developer's official download or store page (verify before publication)
- `image`, `credit`, `creditUrl`: an accurately credited, appropriately licensed screenshot
- `color`: card fallback gradient color.

Never label game cover screenshots as your own. Always check permissions before hosting downloadable game binaries or redistributing screenshots. The default download buttons redirect to official developer sites.

## Advertising readiness
Advertising is intentionally **not active**. Do not paste someone else's publisher ID. Before monetization:
1. Use hosting that permits a commercial ad-supported directory. GitHub Pages is mainly for project showcases and should **not** be the commercial production host.
2. Publish valuable original descriptions, reviews, installation guides, and a complete privacy/legal page; verify external links periodically.
3. Apply to a reputable network, and only implement scripts after account and domain approval.
4. AdSense account holder must be 18+; for a minor, a parent/legal guardian may apply with their own account and receive payments.
5. In France/EU, set up an appropriate consent management platform before advertising trackers requiring consent.
6. Add a network-authorized `ads.txt` **only after** your publisher details are issued.
7. Never entice users to click ads, place misleading download buttons next to ads, or promise downloads through ad clicks.

## Structure
- `index.html`: page, accessible sections, modal
- `style.css`: responsive premium gaming theme
- `games.js`: catalogue data
- `app.js`: search, filters, detail modal, safe external links
- `privacy.html`: prototype transparency policy

This is a site prototype, not a self-hosted installer distribution platform or a completed ad business.
