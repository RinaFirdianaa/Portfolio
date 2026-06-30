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
