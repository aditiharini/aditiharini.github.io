# aditi srinivasan

Personal website for Aditi Srinivasan, adapted from the Life Log design handoff.

## Editing content

Most text lives in `assets/site-data.js`:

- `timelineEntries` controls the timeline rows and command-palette labels.
- `links` controls the footer and palette actions.
- `parts` lets a row mix plain text, emphasized text, and external links.

The intro paragraph lives in `index.html`.

## Local preview

```sh
npm run dev
```

Then open `http://localhost:4173`. The page refreshes automatically when you
edit `index.html`, `assets/site-data.js`, `assets/styles.css`, or `assets/app.js`.

Docker preview:

```sh
npm run docker:serve
```

## Checks

```sh
npm run lint
npm run build
```

## GitHub Pages

This folder contains a local GitHub Pages workflow template at
`.github/workflows/pages.yml`. It builds `dist/` and publishes only the static
site files. Nothing is deployed unless you explicitly put these files in a
GitHub repository and push them.

If this should be the root user site at `https://aditiharini.github.io`, create
or use the repository named `aditiharini.github.io`. For a project site, any repo
name is fine; GitHub will publish it under that repo's Pages URL.
