/**
 * Footer
 * Simple centered footer with brand and sign-off message.
 */

import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={styles.inner}>
        <p className={styles.brand}>Rina Firdiana</p>

        <p className={styles.tagline}>Thanks for stopping by!</p>
        <p className={styles.signoff}>
          <span className={styles.star} aria-hidden="true">✦</span>
          <span>Hope to connect with you soon</span>
          <span className={styles.star} aria-hidden="true">✦</span>
        </p>
      </div>
    </footer>
  )
}
