/**
 * Skills
 * 2x2 grid of skill category cards.
 * Skill items are pulled from constants/data.js.
 */

import { SKILLS } from '@/constants/data'
import styles from './Skills.module.css'

export default function Skills() {
  return (
    <section id="skills" className={`section ${styles.skills}`} aria-label="Skills">
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.sectionTitle}>What I bring to the table</h2>
            <p className={styles.subtitle}>Complete the puzzle</p>
          </div>
          <span className={styles.ptsBadge} aria-hidden="true">✦ pts</span>
        </div>

        {/* 2×2 Grid */}
        <div className={styles.grid}>
          {SKILLS.map((skill) => (
            <article
              key={skill.id}
              className={styles.card}
              style={{
                backgroundColor: skill.bgColor,
                borderColor: skill.borderColor,
              }}
            >
              <h3 className={styles.cardTitle}>
                <span className={styles.cardIcon} aria-hidden="true">{skill.icon}</span>
                {skill.label}
              </h3>
              <ul className={styles.itemList} aria-label={`${skill.label} skills`}>
                {skill.items.map((item) => (
                  <li key={item} className={styles.item}>
                    <span className={styles.bullet} aria-hidden="true">–</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
