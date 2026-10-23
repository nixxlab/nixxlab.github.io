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
