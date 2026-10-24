# nixxlab.github.io — the nixxlab.ru site

Astro 7 + MDX, static build, GitHub Pages. Process, the author's voice and decisions live in the parent artspace workspace (`../AGENTS.md`, `../docs/`); this file covers code and content rules.

## Repository language

Everything in this repository that is not site content is English: commit messages, README, this file, code comments, script output. Site texts (content entries, UI strings in `src/i18n/`) are written in the site's languages.

## Skeleton and freedom (fixed rules)

- **Skeleton**: meaning — text, headings, links, navigation — always lives in the page's semantic HTML, where search engines, screen readers and translators read it.
- **Freedom**: art is a decorative layer over the skeleton, in any technique (CSS, canvas, WebGL, SVG). The shared background is the `art` slot in `src/layouts/Base.astro`: `aria-hidden` and kept across navigations (`transition:persist`). A post or a project may carry its own art and atmosphere.
- **Motion** calms down under `prefers-reduced-motion`: in CSS through the media query, in JS by checking `matchMedia('(prefers-reduced-motion: reduce)')` before starting an animation.
- **Mobile** is first-class, not a reduced version.
- **Performance**: a page is readable within ~2 s on mobile; heavy art loads after the text (`client:idle` / `client:visible`, lazy imports).
- Page scripts survive client-side navigation (`<ClientRouter />`): initialise on `astro:page-load`, not on document load.

## Visual identity: cosmos and seal

Accepted by the author (artspace ADR 0011); change it only on his request.

- **Sky** (`src/art/cosmos.ts`, mounted by `src/components/Cosmos.astro` in the art layer): stars and nebulae; the flower-of-life lattice with octagrams at some nodes; a vortex of living glyphs (runes, katakana, logic marks) flowing into the seal; the seal — seed of life inside the eight-pointed star of Alatyr, glyphs at its points and around it. Palette: night `#05060b`, gold `#d9ac5c`, a little violet.
- **Type**: Cormorant Garamond (Fontsource, Cyrillic included), light headings; the page's body face is preloaded in `Base.astro`.
- **Layout** on the axis: centred masthead (logo, tagline = site description, menu, languages). A page whose section the menu already names hides its `h1` visually (`.visually-hidden`), never removes it.
- **Reading over the sky**: text sits on edgeless dark clouds that breathe (`breathe`: +50px on every side, i.e. +100px in width and height, never a percentage — a scaled long article would cover the masthead; 0.8–1 opacity, 8 s) — one oval per feed card, one cloud per article (title included). Post and project bodies are wrapped in `.prose`.
- **Motion**: headings sway, feed cards bob, the active menu item shimmers in gold; pages change by lifting into blur and rising out of it (`::view-transition-*(page)` in `src/styles/base.css`).

## Post typography

Accepted by the author (artspace ADR 0012) as the template for every post; all of it lives in `.prose` rules in `src/styles/base.css`, so a post adds none of its own. Example: `src/content/posts/template/ru.mdx`.

- **Title**: smaller than other page titles (a post title is a sentence), wider than the text column, balanced lines. **Subtitle**: the `subtitle` field, italic under the title — never the first line of the body.
- **Paragraphs**: justified, hyphenated by the page's language, each with a two-line gold drop cap; none in Chinese.
- **No one-line paragraph** under a drop cap (the cap hangs below it): break it into two lines with a trailing `\`, join it to a neighbour, or drop it.
- **Section headings**: centred on the axis.
- **Code**: site gold, 0.8em; blocks on a tinted night background with a thin gold border, 1ch padding, long lines wrapping with a 2ch hanging indent.
- **Art**: a decorative component in `src/components/art/`, `aria-hidden`.
- **Ending**: no rule and no postscript; a question for readers belongs in the announcement.

## Languages

- ru has no prefix; en and zh live under `/en/…` and `/zh/…`. Every page exists in all three.
- UI strings: `src/i18n/ui.ts`. Topics (tags): `src/i18n/tags.ts`, Latin key plus labels in three languages; add a topic there before using it.
- Build paths only with `localePath(locale, path)`; never hard-code `/en/...`.
- A page is a wrapper in `src/pages/` (ru) plus a wrapper in `src/pages/[lang]/` (en, zh) plus a shared view in `src/views/`. Paths come from `src/lib/paths.ts`.

## Content

- Post: `src/content/posts/<slug>/{ru,en,zh}.mdx`; project: `src/content/projects/<id>/{ru,en,zh}.mdx`. Schemas: `src/content.config.ts`; sample post: `src/content/posts/template/ru.mdx`.
- Translate with `../i18n/glossary.md`. After translating, run `pnpm translations stamp src/content/<collection>/<slug>` to record the original's hash in `sourceHash`. The build fails when a translation is missing or the ru original changed after it.
- `draft: true` in ru: the entry shows only in `pnpm dev` and needs no translations.
- Author name: ru «Николай Низовцев», en "Nick Nizovtsev", zh «尼可·尼佐夫采夫» (`src/site.ts`).

## Commands

- `astro dev --background` starts the dev server in the background; `astro dev status|logs|stop`.
- `pnpm build` runs the translation check, `astro check` and the build. It must pass before every push.
- Deploy: push to `main`; see `.github/workflows/deploy.yml`.

## Astro documentation

https://docs.astro.build — check it before working on routing, components, collections, i18n or view transitions: the installed version is newer than model memory.
