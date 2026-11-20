# Shadow Dance — deploy package

Upload the contents of this folder (not the folder itself) to your host.
These files were prepared from `index (6).html`; changes made during prep:

1. Renamed to `index.html`.
2. Removed two leftover Cloudflare challenge `<script>` blocks from the end of the file.
3. Hardened `SD.setStatus` against non-numeric input (one-line guard).
4. Added `manifest.webmanifest`, `sw.js`, and `icons/` (built from the in-app sigil)
   so install-to-home-screen and offline use work.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app |
| `manifest.webmanifest` | PWA install metadata |
| `sw.js` | Offline service worker (bump `CACHE` name when you ship updates) |
| `icons/icon-192.png` | App icon / Apple touch icon |
| `icons/icon-512.png` | App icon (large) |
| `icons/icon-maskable-512.png` | Android adaptive icon |
| `README.md` | This file |

All paths are relative, so the app works at a domain root
(`https://you.github.io/`) or a subpath (`https://you.github.io/shadow-dance/`).

## Deploy to GitHub Pages (free)

1. Create a free account at github.com (if needed).
2. Create a new **public** repo called `shadow-dance`.
3. **Add file → Upload files**, drag in everything from this folder, Commit.
4. Repo **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main** → Save.
5. Wait ~2 minutes, then open `https://YOURNAME.github.io/shadow-dance/`.

## Verify on your phone

- Site loads over HTTPS.
- Android Chrome menu → **Install app** (or iPhone Safari Share → **Add to Home Screen**).
- Open the installed app, turn on **airplane mode** → it still works. That is the gym test.

## Shipping updates later

1. Edit `index.html`, bump the `CACHE` string in `sw.js` (e.g. `shadow-dance-v2`).
2. Upload both files to the repo. The service worker picks up the new version
   on next visit (users may need to open the app twice: once to fetch, once to activate).
