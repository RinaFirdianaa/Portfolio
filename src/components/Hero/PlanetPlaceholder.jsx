/**
 * PlanetPlaceholder
 * A styled CSS placeholder for the hero planet illustration.
 * Replace this entire component with an <img> tag once you have your asset.
 *
 * REPLACEMENT:
 *   <img
 *     src="/images/hero-planet.png"
 *     alt=""
 *     className={styles.planet}
 *   />
 */

import styles from './Hero.module.css'

export default function PlanetPlaceholder() {
  return (
    <div className={styles.planet}>
      <div className={styles.planetRing} />
      <span className={styles.planetLabel}>[ Replace with hero image ]</span>
    </div>
  )
}
