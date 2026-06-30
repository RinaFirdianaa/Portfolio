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

## Deploy

The project can be deployed without extra configuration on either platform:

- **Vercel:** import this repository, select the Vite framework preset, and deploy.
- **Netlify:** import this repository, use `npm run build` as the build command, and `dist` as the publish directory.

Both services install dependencies from `package-lock.json`. Do not upload `node_modules` or `dist`; the host generates them during deployment.

## Content and assets

- Portfolio text and project data: `src/constants/data.js`
- Components: `src/components/`
- Global styles: `src/styles/global.css`
- Images, resume, and downloadable files: `public/`

Public assets use root-relative paths such as `/images/hero.png`. This works directly with a custom domain, Vercel, or Netlify. A GitHub Pages project URL needs an additional Vite `base` setting and asset-path changes.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint` | Check JavaScript and JSX |
| `npm run build` | Create the production build |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Run lint and build together |
