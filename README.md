# Rina Firdiana — Portfolio

Personal portfolio website built with **React + Vite**. Features a gamified UI with a score/points system, smooth animations, and a fully component-based architecture.

---

## Getting Started

### Prerequisites
- Node.js **v18+**
- npm **v9+**

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output goes to /dist
```

---

## Project Structure

```
rina-portfolio/
├── index.html                    # HTML entry point
├── vite.config.js                # Vite configuration
├── package.json
│
└── src/
    ├── main.jsx                  # React root render
    ├── App.jsx                   # Root component (composes all sections)
    │
    ├── styles/
    │   └── global.css            # CSS custom properties + global resets
    │
    ├── constants/
    │   └── data.js               # ★ All site content lives here
    │
    ├── hooks/
    │   └── useScrolled.js        # Scroll position hook (for navbar shadow)
    │
    └── components/
        ├── Navbar/
        │   ├── Navbar.jsx
        │   └── Navbar.module.css
        ├── Hero/
        │   ├── Hero.jsx
        │   ├── PlanetPlaceholder.jsx   # Replace with your hero image
        │   └── Hero.module.css
        ├── About/
        │   ├── About.jsx
        │   └── About.module.css
        ├── Skills/
        │   ├── Skills.jsx
        │   └── Skills.module.css
        ├── Projects/
        │   ├── Projects.jsx
        │   └── Projects.module.css
        ├── Experience/
        │   ├── Experience.jsx
        │   └── Experience.module.css
        └── Footer/
            ├── Footer.jsx
            └── Footer.module.css
```

---

## Replacing Placeholder Images

All images are managed in `src/constants/data.js`. Change the `null` values to your asset paths.

### 1. Hero Image / Planet Illustration
In `src/components/Hero/Hero.jsx`, replace `<PlanetPlaceholder />` with:
```jsx
<img
  src="/images/hero-planet.png"
  alt="Rina's hero illustration"
  className={styles.heroImage}
/>
```

### 2. Avatar (About section)
In `src/components/About/About.jsx`, replace `<div className={styles.avatarPlaceholder}>` with:
```jsx
<img src="/images/avatar.png" alt="Rina Firdiana" className={styles.avatar} />
```

### 3. Project Images
In `src/constants/data.js`, update the `image` and `thumbnails` fields:
```js
image: '/images/projects/boba-time.jpg',
thumbnails: [
  '/images/projects/boba-time-thumb-1.jpg',
  '/images/projects/boba-time-thumb-2.jpg',
],
```

### 4. Company Logos (Experience section)
In `src/constants/data.js`, update the `logo` field for each experience:
```js
logo: '/images/logos/mas.png',
```

> **Tip:** Place all image assets inside `public/images/` so they are served at the root path.

---

## Updating Content

All text content (education, skills, projects, experiences, nav links) is in one place:

```
src/constants/data.js
```

Edit that file — no need to touch any component files.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool & dev server |
| CSS Modules | — | Scoped component styles |
| Google Fonts | — | Playfair Display + DM Sans |

---

## License

This project is personal and not licensed for redistribution.
