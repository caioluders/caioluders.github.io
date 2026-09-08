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

- Headings and byline: **P0T-NOoDLE**, with 32px main headings.
- Article text, code, and filenames: **IBM Plex Mono**, including regular, bold, italic, and bold italic; body size 17px and table size 16px.
- Line spacing: 1.75; content width: 60rem; black background opacity: 60%.
- Five palettes blend smoothly through Brasília time (`America/Sao_Paulo`): midnight violet, rose dawn, cyan noon, amber sunset, and magenta evening. Text, headings, links, syntax colors, frame, and stars share these colors.

The fonts are served locally through `assets/fonts.css`, with upstream credits and notices in `assets/fonts/README.md`. Layout defaults are in `assets/enhancements.css`; font size and display-grid handling are in `assets/theme.js` and `assets/pixel-grid.css`. P0T-NOoDLE snaps to native 16-device-pixel steps; Plex retains its chosen reading size. Alignment is rechecked after font loading, resize, and display-scale changes. Font outlines and browser/OS rasterization can still affect appearance.

`assets/character-frame.js` draws an outer ASCII frame and bands around H2 headings using real P0T-NOoDLE text. Main titles and smaller headings have no extra ornament, and redundant directory/footer rules are hidden. Decorative text is hidden from accessibility and printing; headings remain selectable, semantic HTML. The template includes an HTML5 doctype so short directory pages fit their content instead of stretching to the viewport in quirks mode. New builds inherit this behavior.

## Navigation and search

The builder appends `/` to directory labels and targets, and emits `../` only below the site root. The configured footnote is wrapped in `.site-byline` in both directory and article output.

Search appears only on directory pages, with the placeholder `Search...`. It is local, full-text, case- and accent-insensitive, and highlights matches using safe DOM text nodes. Existing calculator keyboard shortcuts do not intercept the search input. Below 640px, filenames occupy a full-width line and titles/dates appear below; code blocks scroll independently.

## Background

- `assets/background.js` is the complete 41-line space algorithm, including seeded stars, perspective flight, depth fading, ASCII trails, and character drawing. Nebulae and constellations are removed.
- `assets/background-loader.js` loads pinned local textmode.js 0.18.0, creates the canvas, and registers the algorithm with `t.draw()`. Stars initialize on the first draw, when the library's grid is available. Frame deltas come from `t.deltaTime()`, converted from milliseconds to seconds and capped at 0.15.
- Font size is 8px, target frame rate 30 fps, density 1, with canvas resolution capped at 1920×1200. The built-in glyphs stay at their native size and use pixelated canvas scaling.
- Constant forward speed and aspect-correct perspective make nearby stars move faster. Their center characters remain fixed; approaching stars grow through additional ASCII cells, up to 5×5, and some leave short velocity-based trails. Density scales with viewport area, capped at 1,800 stars. Every star is drawn with textmode's character APIs, without SVG or image glyphs.
- `assets/time-palettes.js` supplies colors shared with the page and blends continuously across midnight. Reduced motion and hidden tabs stop movement; palette updates can recolor a paused frame. Missing WebGL2 or a failed library load leaves the static page background.

## Calculator

`assets/popcalc-launcher.js` makes one independent 20% probability draw per page load. On success it waits 3–15 seconds, downloads the existing popcalc library, and opens it once. Navigation cancels a pending timer; the library's existing mobile suppression remains. The template omits the old immediate invocation; the shared browser script loads this launcher.
