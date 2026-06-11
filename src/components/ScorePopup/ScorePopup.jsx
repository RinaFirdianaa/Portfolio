import StarIcon from '@/components/StarIcon/StarIcon'
import styles from './ScorePopup.module.css'

export default function ScorePopup({ score, total, completed = false }) {
  if (completed) {
    return (
      <div className={`${styles.popup} ${styles.completed}`} role="status">
        <StarIcon className={styles.completeStar} size="28px" glow />
        <span className={styles.completeTitle}>Congratulations!</span>
        <span className={styles.completeScore}>
          <span className={styles.completeScoreNum}>{score}</span>
          <span className={styles.completeScoreTotal}>/{total}</span>
        </span>
        <span className={styles.completeText}>you explored everything ✦</span>
      </div>
    )
  }

  return (
    <div className={styles.popup} role="status">
      <span className={styles.label}>Your Points</span>
      <span className={styles.value}>
        <span className={styles.currentScore}>{score}</span>
        <span className={styles.totalScore}>/{total}</span>
      </span>
      <span className={styles.hint}>keep exploring ✦</span>
    </div>
  )
}
