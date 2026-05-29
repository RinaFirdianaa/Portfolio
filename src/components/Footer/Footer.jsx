/**
 * Footer
 * Simple centered footer with brand, nav links, and sign-off message.
 */

import { FOOTER_LINKS } from '@/constants/data'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={`container ${styles.inner}`}>
        <p className={styles.brand}>Rina Firdiana</p>

        <nav className={styles.links} aria-label="Footer navigation">
          {FOOTER_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className={styles.link}>
              {label}
            </a>
          ))}
        </nav>

        <p className={styles.tagline}>Thanks for stopping by!</p>
        <p className={styles.signoff}>
          <span aria-hidden="true">✦</span> Hope to connect with you soon{' '}
          <span aria-hidden="true">✦</span>
        </p>

        <p className={styles.copyright}>
          © {currentYear} Rina Firdiana. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
