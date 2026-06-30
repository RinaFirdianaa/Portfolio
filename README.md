# Rina Firdiana — Portfolio

A responsive, interactive portfolio for UI/UX designer and developer Rina Firdiana. Built with React, Vite, CSS Modules, and Three.js.

## Local development

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Vite prints the local URL, usually `http://localhost:5173`.

## Production checks

Run the complete pre-deployment check:

```bash
npm run check
```

This lints the source and creates an optimized build in `dist/`. To inspect that build locally:

```bash
npm run preview
```

## Deploy to GitHub Pages

Deployment runs automatically through `.github/workflows/deploy.yml` whenever a commit is pushed to `main`.

One-time repository setup:

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push the `main` branch.

The published site is available at:

`https://rinafirdianaa.github.io/Portfolio/`

The workflow supplies `/Portfolio/` as the production base path. Local builds and other hosts continue to use `/` by default.

## Content and assets

- Portfolio text and project data: `src/constants/data.js`
- Components: `src/components/`
- Global styles: `src/styles/global.css`
- Images, resume, and downloadable files: `public/`

Public assets use the base-aware helper in `src/utils/assetUrl.js`, allowing them to work locally and under the GitHub Pages project path.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint` | Check JavaScript and JSX |
| `npm run build` | Create the production build |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Run lint and build together |
