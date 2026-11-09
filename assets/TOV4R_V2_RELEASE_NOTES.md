# TOV4R Website V2 — release notes

## New functionality
- **Crosshair Studio V2** enhances the existing demonstration only. Four explicit *illustrative* presets, center dot and outline toggles, a demo-text copy action, local-only save and reset.
- **Website V2** adds premium quick navigation, responsive section styling, metadata improvements and an optional Redline/Stealth appearance toggle (saved locally).
- **Discord Hub 1729** uses the previously configured `https://discord.gg/ScxyVUb7m` invitation and includes copy-invite functionality. Does not claim member counts, events or server channels.
- **Achievements / Plays** showcases four previously linked Medal clips and lists two **future ideas** clearly marked as not completed/not scheduled. Filters distinguish the categories.

## Preserve existing features
- Original TOV4R Player Dashboard, Medal video gallery, modal, soundtrack/dock, game cards, setup, social links, loadout editor, and settings are retained.
- `assets/tov4r-player-data.js` is not changed. **800 DPI / 1.20 sensitivity / 1280×960** remain *concept examples*, and `crosshairCode` remains null.
- Demo copying is explicitly **not** a valid official CS2 share code; no live API, Steam inventory, or authentication is claimed.

## Automated checks performed
- Existing and new JavaScript parses without syntax errors.
- The HTML retains original sections, balanced section elements, and unique IDs.
- All four Medal clip URLs are preserved; no external target without `rel=noopener`.
- Interactive smoke tests covered preset switching, center dot, local save/reset, appearance mode, clipboard messages, invite copying, and clip/goal filters.

## Manual browser acceptance
1. On desktop and mobile open `/#crosshair-studio`, change each slider, apply every preset and confirm the preview updates.
2. Save and reload a custom demo to confirm browser-local restore; reset to Redline.
3. Copy demo values and verify the copied string explicitly warns it is not a real CS2 import code.
4. Test `/#achievements` filters (four linked clips vs. two future ideas).
5. Test `/#discord-hub` and the copy button; open the invite. Discord can change invitation availability independently of this site.
6. Check existing Medal playback/close flow, soundtrack, 1729 social card, setup, loadout, and settings still work.
7. Check the Redline/Stealth preference, keyboard navigation and reduced-motion settings.

No private tokens, passwords, user-authenticated status, or unverifiable game stats are used.
