# Locally served comparison fonts

WOFF2 Latin and Latin Extended subsets from pinned Fontsource packages. The original four comparison families include regular (400) and bold (700):

- `@fontsource/space-mono@5.3.0` — https://github.com/googlefonts/spacemono
- `@fontsource/ibm-plex-mono@5.3.0` — https://github.com/IBM/plex
- `@fontsource/jetbrains-mono@5.3.0` — https://www.jetbrains.com/lp/mono/
- `@fontsource/fira-code@5.3.0` — https://github.com/tonsky/FiraCode

Each family's SIL Open Font License is included next to its files. Browsers load fonts from this site, not a remote font service. Gohu remains available from the existing /gohu.woff file.

Additional characterful options, all `@5.3.0`, regular (400) with native italic for Xanh Mono:

- `@fontsource/syne-mono` — https://gitlab.com/bonjour-monde/fonderie/syne-typeface
- `@fontsource/xanh-mono` — https://github.com/yellow-type-foundry/xanhmono
- `@fontsource/nova-mono` — https://fonts.google.com/specimen/Nova+Mono

Requested comparison additions, pinned to `@5.3.0`:

- `@fontsource/cutive-mono` — regular (400); https://github.com/googlefonts/cutivemono
- `@fontsource/anonymous-pro` — regular and bold (400/700), normal and italic; https://fontsource.org/fonts/anonymous-pro
- `@fontsource/vt323` — regular (400); https://fontsource.org/fonts/vt323

## ANSI / ASCII / PETSCII options

These are unmodified upstream font files, served locally:

- **TopazPlus (Amiga 1200), MicroKnight, P0T-NOoDLE** — TrueSchool Amiga fonts v1.02 by dMG, from https://github.com/rewtnull/amigafonts at revision `d42987535d94ebbfb51e64fee76f9974c6ae145a`. The upstream README includes original designer credits and GPL with Font Exception notice; preserved verbatim in `amiga-README.txt`. These font families are also included as bitmap fonts in https://github.com/blocktronics/moebius/tree/master/app/fonts/amiga; this site uses TrueSchool's existing TrueType versions.
- **IBM VGA** — `WebPlus_IBM_VGA_8x16.woff`, from VileR's Ultimate Oldschool PC Font Pack v2.2, https://int10h.org/oldschool-pc-fonts/. CC BY-SA 4.0; `oldschool-pc-LICENSE.txt` and `oldschool-pc-README.txt` retain the license and credits. The Plus variant adds international characters to the classic DOS/ANSI lettering.
- **Pet Me 64 / Pet Me** — by Kreative Software / Rebecca G. Bettencourt, https://www.kreativekorp.com/software/fonts/c64/. Original `PetMe64.ttf` and `PetMe.ttf` from the upstream `petme.zip`, with `petme-LICENSE.txt` included verbatim. C64 and Commodore PET lettering, with Unicode PETSCII symbols and Latin-1 additions. No conversion or modification has been made.

The Amiga/C64/PET faces preserve their original pixel shapes; 16px and 32px are useful sizes to compare. Characters missing from a legacy face use the browser's monospace fallback.
