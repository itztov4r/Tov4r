# TOV4R — CS2 Player Portfolio

New modules live at https://tov4r.xyz/:

- **CS2 Settings and Crosshair Lab**: the live preview is illustrative only; not the player's real configuration. Actual DPI, sensitivity, resolution, and crosshair code are intentionally blank until the owner provides them.
- **CS2 Loadout**: optional cosmetic display slots for the player's chosen agent, gloves, music kit, and badge. No invented favorites.
- **In-page Medal video viewer**: click any of the four highlight cards to open a dialog. A direct link to Medal remains available when a third-party embed is unavailable. Closing the dialog clears the video iframe.
- **Website optimization**: thirteen formerly inlined JPEGs are now standalone `assets/media/` files so browsers may cache them independently. Assets, existing links, music and sections remain present.

To customize confirmed public data, edit `assets/tov4r-player-data.js` and replace `null` only when the owner provides the real value. Never publish passwords, tokens, or private data in public JavaScript.

## Manual acceptance checks

1. Visit `/#cs2-settings`, adjust crosshair preview sliders, and verify its preview changes without claiming real settings.
2. Verify the Copy button stays disabled until an actual owner crosshair code is supplied.
3. Visit `/#cs2-loadout` and confirm all cosmetic slots are labeled as awaiting values.
4. Visit `/#highlights`, click a Medal card, close with Escape, and verify playback stops.
5. Test narrow/mobile viewport and keyboard navigation. If Medal disallows iframe playback, use the direct external link.

## TOV4R Signature V1 (concept, not owner facts)

A creative starter design was chosen without needing more inputs: 800 DPI, 1.20 sensitivity and 1280×960 4:3 as **sample numbers only**. The red-line crosshair preview uses length 6, gap 4, thickness 2 and crimson color. The real copyable share code stays unset. A graphic moodboard displays Shadow CT Style, Graphite × Crimson palette, the website's Level Up music, and an original TOV4R / 04 emblem. **None of these represent verified personal settings, ownership, or official CS2 inventory items.**
