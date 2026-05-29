/**
 * About
 * Two-column section: personal bio on the left,
 * interactive education card on the right.
 */

import { useState } from 'react'
import { EDUCATION } from '@/constants/data'
import styles from './About.module.css'

export default function About() {
  // Track which education entries the user has marked complete
  const [marked, setMarked] = useState(
    () => new Set(EDUCATION.filter((e) => e.completed).map((e) => e.id))
  )

  const toggleMark = (id) => {
    setMarked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const score = Math.round((marked.size / EDUCATION.length) * 100)

  return (
    <section id="about" className={`section ${styles.about}`} aria-label="About me">
      <div className="container">
        <div className={styles.grid}>

          {/* ---- Left: Bio ---- */}
          <div className={styles.bio}>
            <h2 className={styles.sectionTitle}>Something to know about me</h2>

            <div className={styles.avatarRow}>
              {/*
                REPLACE AVATAR:
                <img src="/images/avatar.png" alt="Rina Firdiana" className={styles.avatar} />
              */}
              <div className={styles.avatarPlaceholder} aria-label="Profile photo placeholder">
                <span>avatar</span>
              </div>
              <p className={styles.bioIntro}>
                I'm just a CS grad from SIT (DigiPen) who ended up loving design more than coding.
              </p>
            </div>

            <p className={styles.bioPara}>
              Through my studies, I learnt UI/UX design principles, human-computer interaction,
              prototyping, and user-centred design. I was usually the one handling the UI for game
              projects, designing menus, HUDs, and interfaces that felt smooth and intuitive.
            </p>
            <p className={styles.bioPara}>
              Back in polytechnic, I also learnt web design and development using Adobe XD,
              Photoshop, HTML, CSS, and JavaScript to create mobile app prototypes and interactive
              web experiences.
            </p>
          </div>

          {/* ---- Right: Education card ---- */}
          <div className={styles.educationCard}>
            <div className={styles.cardTopRow}>
              <span className={styles.cardHint}>Mark to get points</span>
              <span className={styles.ptsBadge}>✦ pts</span>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Education</h3>
                <span className={styles.scoreChip} aria-label={`Score: ${score} out of 100`}>
                  {score}/100
                </span>
              </div>

              <ul className={styles.eduList}>
                {EDUCATION.map((edu, index) => {
                  const isDone = marked.has(edu.id)
                  return (
                    <li
                      key={edu.id}
                      className={`${styles.eduItem} ${index < EDUCATION.length - 1 ? styles.hasDivider : ''}`}
                    >
                      <div className={styles.eduRow}>
                        <div className={styles.eduInfo}>
                          <span className={styles.eduSchool}>{edu.school}</span>
                          <span className={styles.eduCourse}>{edu.course}</span>
                        </div>
                        <span className={styles.eduPeriod}>{edu.period}</span>
                      </div>
                      <div className={styles.markRow}>
                        {isDone ? (
                          <span className={styles.checkDone} aria-label="Completed">✓</span>
                        ) : (
                          <button
                            className={styles.markBtn}
                            onClick={() => toggleMark(edu.id)}
                            aria-label={`Mark ${edu.school} as complete`}
                          >
                            Mark ✓
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
