/**
 * Projects
 * Tabbed project showcase with a featured banner and thumbnail strip.
 *
 * TO ADD PROJECT IMAGES:
 *   In constants/data.js, set the `image` field to your asset path, e.g.:
 *   image: '/images/projects/boba-time.jpg'
 *   The component will use it automatically.
 */

import { useState } from 'react'
import { PROJECTS, PROJECT_CATEGORIES } from '@/constants/data'
import styles from './Projects.module.css'

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('Game')
  const [activeIndex, setActiveIndex] = useState(0)

  const filtered = PROJECTS.filter((p) => p.category === activeCategory)
  const featured = filtered[activeIndex] ?? filtered[0]

  return (
    <section id="projects" className={styles.projects} aria-label="Projects">
      {/* Section header */}
      <div className={`container ${styles.header}`}>
        <div className={styles.titleRow}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <nav className={styles.tabs} aria-label="Project categories">
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.tab} ${activeCategory === cat ? styles.tabActive : ''}`}
                onClick={() => { setActiveCategory(cat); setActiveIndex(0) }}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
        <span className={styles.ptsBadge} aria-hidden="true">✦ pts</span>
      </div>

      {/* Featured banner */}
      {featured ? (
        <>
          <div className={styles.banner}>
            {/* Background image or fallback gradient */}
            {featured.image ? (
              <img
                src={featured.image}
                alt={featured.title}
                className={styles.bannerImage}
              />
            ) : (
              <div className={styles.bannerFallback} aria-hidden="true">
                [ Replace with project banner image ]
              </div>
            )}
            <div className={styles.bannerOverlay} />
            <div className={styles.bannerContent}>
              <h3 className={styles.bannerTitle}>{featured.title}</h3>
              <p className={styles.bannerDesc}>{featured.description}</p>
              <button className={styles.readMoreBtn}>Read More</button>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className={styles.thumbnailStrip} role="list" aria-label="Project thumbnails">
            {filtered.map((project, i) => (
              <button
                key={project.id}
                role="listitem"
                className={`${styles.thumbnail} ${activeIndex === i ? styles.thumbnailActive : ''}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`View ${project.title}`}
              >
                {project.image ? (
                  <img src={project.image} alt={project.title} className={styles.thumbImg} />
                ) : (
                  <div className={styles.thumbFallback} aria-hidden="true">
                    <span className={styles.thumbPlaceholder}>img</span>
                  </div>
                )}
                <span className={styles.thumbLabel}>{project.title}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className={`container ${styles.emptyState}`}>
          <p>No projects in this category yet.</p>
        </div>
      )}
    </section>
  )
}
