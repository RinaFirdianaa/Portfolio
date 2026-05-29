/**
 * CloudBackground.jsx
 * Full-page dark blue→purple gradient background with 4 animated cloud layers.
 * Uses mix-blend-mode: screen to knock out the black from the PNG clouds.
 */

import styles from './CloudBackground.module.css'

export default function CloudBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      {/* Gradient sky */}
      <div className={styles.sky} />

      {/* Cloud layers — back to front, slowest to fastest */}
      <div className={`${styles.cloudLayer} ${styles.cloud4}`} />
      <div className={`${styles.cloudLayer} ${styles.cloud3}`} />
      <div className={`${styles.cloudLayer} ${styles.cloud2}`} />
      <div className={`${styles.cloudLayer} ${styles.cloud1}`} />
    </div>
  )
}