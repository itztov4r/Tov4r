# TOV4R STUDIO

**Website:** https://tov4r.xyz/  
**Source:** https://github.com/itztov4r/Tov4r  
**Owner / brand:** TOV4R

An independent static creative marketplace for free Discord CSS themes and responsive single-file website templates.

## Catalog

| Release | Type | Source / Download | Status |
|---|---|---|---|
| TOV4R Death Note | CSS theme | [Download](themes/TOV4R-DeathNote.theme.css) | Available, artwork-free edition |
| Crimson Ledger | CSS theme | [Download](themes/Crimson-Ledger.theme.css) | Available |
| Noirfolio | Single-file HTML portfolio | [Live demo / HTML](templates/noirfolio.html) | Available |
| LaunchDeck | Single-file HTML landing page | [Live demo / HTML](templates/launchdeck.html) | Available |
| TOV4R Hub | Custom Vencord plugin | — | Development concept, not published |

### How to use themes
Use a compatible desktop client that supports CSS themes:
- **Vencord:** Settings → Vencord → Themes; add CSS via local Themes folder or supported online theme links.
- **BetterDiscord:** Settings → BetterDiscord → Themes → Open Themes Folder.
- Save a theme as a `.theme.css` file, enable it, and restart Discord if necessary.

These are independent user-created themes. They are not published in or approved by the official BetterDiscord theme catalog. Client modifications can be against Discord's terms of service. Neither Discord, BetterDiscord, Vencord nor any anime publisher endorses this project. The fan-inspired Death Note CSS **does not include third-party artwork**. Any artwork used privately must be licensed/authorized for public redistribution before inclusion.

### How to use website templates
Open a demo page, download the corresponding `.html` file, and edit it in VS Code. The CSS and small helper scripts are embedded so no npm or build step is required. Replace demo copy, sample projects, sample email addresses, and metadata with real information before publishing. You may adapt the original template code for personal or commercial projects; do not redistribute third-party trademarks as your own.

## Structure

- `index.html` — responsive marketplace
- `studio/site.css` — visual design
- `studio/site.js` — functional mobile menu, category filters, search and theme details
- `templates/` — real single-file HTML starter downloads
- `themes/` — public CSS themes without bundled anime art
- `privacy.html` — privacy policy for new catalog
- `legacy.html` — preserved former gaming homepage (assets remain intact)
- `downloads/` — original game download index, preserved but not promoted
- `service-worker.js` — small new offline shell, removes older gaming caches
- `scripts/verify-site.cjs` — static regression tests

## Development and tests

No build is required. To inspect locally:

```sh
python -m http.server 8080
```

Open http://localhost:8080/ and verify navigation, filters, template live demos, both theme download URLs, mobile menu, modal, and the PWA installation prompt if available.

Run CI checks with:

```sh
node scripts/verify-site.cjs
```

GitHub Actions runs these checks on pull requests and pushes to `main`.

## Deployment and rollback

GitHub Pages hosts the repository with `CNAME` set to `tov4r.xyz`. The original gaming version was saved in branch **`backup-gaming-2026-11-17`** before the redesign. The new site was prepared and reviewed in branch **`studio-redesign-2026-11-17`** before deployment.

To restore the previous home page, use the original files from that backup branch. The archive also remains accessible at `/legacy.html` so old projects aren't lost.

## Honest status
The published catalog contains actual downloadable files only. It does not invent download counts, testimonials, plugin release claims, community size, reviews, sales, or official approvals. The development plugin is labeled unavailable. Test CSS themes on your own Discord client because Discord class names can change.
