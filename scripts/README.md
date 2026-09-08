# Local theme and build workflow

The site is generated entirely by the sibling `-body-builder` checkout. There is no enhancer or post-build command.

From the sibling `-body-builder` directory:

```sh
.venv/bin/python app.py -p ../lude.rs -c ../lude.rs/config.json
```

For a new post, add a `.md` file to a content folder. Use a title on line 1 (`# Title` or plain text), a Unix timestamp on line 2, then a blank line and the article. Run the command above, then preview from the site root with `python3 -m http.server 8000`. It generates the article, directory listing, RSS, and search index together. New content folders are discovered automatically.

One-time setup on a fresh checkout, from `-body-builder`:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
```

Site-specific choices stay in `config.json`: `theme`, `page_scripts`, `search_index`, and `timezone`. The builder has no hardcoded blog sections, fonts, colors, background animation, or search UI. Those assets stay under this site's `assets/`. The template owns the styles; the builder injects the configured shared script into both indexes and articles.

This build requires the configurable scripts/search integration in [body-builder PR #1](https://github.com/caioluders/-body-builder/pull/1). Use that builder branch until it is merged; afterward update the builder checkout before generating the site. `index.html` is generated in every traversed directory; standalone HTML with other filenames is preserved. Deleting a Markdown source removes its listing/search/RSS entry but does not delete its old HTML file.

## Final appearance

The comparison UI is removed. The site uses the chosen settings directly, without reading browser tweak preferences:

- Headings, filenames, and byline: **P0T-NOoDLE**, with 32px main headings.
- Article text: **IBM VGA**, requested size 17px; table text: 16px.
- Line spacing: 1.75; content width: 53rem; black background opacity: 60%.
- Text `#e2e5ed`; links `#08b3e7`; visited links `#8b769e`; table stripe base `#59668b`.

The two selected fonts are served locally through `assets/fonts.css`, with upstream credits and notices in `assets/fonts/README.md`. Color/layout defaults are in `assets/enhancements.css`; font size and display-grid handling are in `assets/theme.js` and `assets/pixel-grid.css`. Legacy fonts snap to native 16-device-pixel steps, so the requested 17px article size renders at 16px at 100% scaling. Alignment is rechecked after font loading, resize, and display-scale changes. Font outlines and browser/OS rasterization can still affect appearance.

## Navigation and search

The builder appends `/` to directory labels and targets, and emits `../` only below the site root. The configured footnote is wrapped in `.site-byline` in both directory and article output.

Search appears only on directory pages, with the placeholder `Search...`. It is local, full-text, case- and accent-insensitive, and highlights matches using safe DOM text nodes. Existing calculator keyboard shortcuts do not intercept the search input. Below 640px, filenames occupy a full-width line and titles/dates appear below; code blocks scroll independently.

## Background

- `assets/background.js` is the complete 42-line space background algorithm, including initialization, seeded randomness, text nebulae, perspective motion, recycling, fading, and textmode drawing.
- `assets/background-loader.js` loads the pinned local textmode.js 0.18.0 UMD bundle, creates and mounts the canvas, and registers the algorithm with `t.draw()`. Frame deltas come from the library's `t.deltaTime()` in milliseconds, converted to seconds and capped at 0.15.
- Font size is 8px, target frame rate 30 fps, density 1, with canvas resolution capped at 1920×1200. The built-in glyphs stay at their native 8px size: rendering them at 6px produced different pixel masks for the same `x` at different grid positions. Canvas scaling uses pixelated sampling.
- Reduced motion and hidden tabs stop the loop; resizing and WebGL loss are handled separately from the algorithm. Missing WebGL2 or a failed library load leaves the static midnight background.
- Stars retain seed 7319 and continuous outward perspective motion. The video-inspired field mixes blue, cyan, violet, pink, gold, mint, and icy-white colors, with the original asterisks, crosses, rings, and larger cross-shaped sparkles; only about 10% of stars are pinpricks. Distant stars are dimmer; nearby stars brighten toward white and are drawn over distant ones. Every star keeps its assigned ASCII character and orientation, including when recycled. Some nearby stars leave short, fading trails made from unrotated `-`, `|`, `/`, and `\` characters. Independent smooth pulses make them twinkle; up to 2,000 stars are drawn according to viewport pixel area, so a finer character grid does not increase star density. New stars fade in over two seconds. No shader or 2D canvas substitutes for textmode drawing: every star uses `char`, `charColor`, `translate`, and `point` on its grid.

- Two faint cyan/violet nebulae use clustered `:;~=` characters. The clouds expand outward more slowly than the foreground stars and fade at cycle boundaries. Constellations have been removed. Cloud counts scale with viewport area (up to 1,200). All layers remain character drawing, with no SVG or image assets.

## Calculator

`assets/popcalc-launcher.js` makes one independent 20% probability draw per page load. On success it waits 3–15 seconds, downloads the existing popcalc library, and opens it once. Navigation cancels a pending timer; the library's existing mobile suppression remains. The template omits the old immediate invocation; the shared browser script loads this launcher.
