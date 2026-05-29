/**
 * Experience
 * Three-column flip-card layout showcasing work experience.
 *
 * TO ADD COMPANY LOGOS:
 *   In constants/data.js, set the `logo` field to your asset path, e.g.:
 *   logo: '/images/logos/mas.png'
 *   The component will render the image instead of the initials fallback.
 */

import { EXPERIENCES } from '@/constants/data'
import styles from './Experience.module.css'

export default function Experience() {
  return (
    <section id="experience" className={`section ${styles.experience}`} aria-label="Work experience">
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.sectionTitle}>Experiences</h2>
            <p className={styles.subtitle}>Flip the cards</p>
          </div>
          <span className={styles.ptsBadge} aria-hidden="true">✦ pts</span>
        </div>

        {/* Cards */}
        <div className={styles.grid}>
          {EXPERIENCES.map((exp) => (
            <div key={exp.id} className={styles.cardWrapper} aria-label={exp.name}>
              <div className={styles.card}>
                {/* Logo */}
                <div
                  className={styles.logoBox}
                  style={{ backgroundColor: exp.logoBg }}
                >
                  {exp.logo ? (
                    <img
                      src={exp.logo}
                      alt={`${exp.name} logo`}
                      className={styles.logoImg}
                    />
                  ) : (
                    <span
                      className={styles.logoInitials}
                      style={{ color: exp.initialsColor }}
                    >
                      {exp.initials}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className={styles.info}>
                  <span className={styles.companyName}>{exp.name}</span>
                  <span className={styles.period}>{exp.period}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
