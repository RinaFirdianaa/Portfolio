import StarIcon from '@/components/StarIcon/StarIcon'
import styles from './ScorePopup.module.css'

export default function ScorePopup({ score, total, completed = false, onSurpriseClick }) {
  return (
    <div className={`${styles.popup} ${completed ? styles.completed : ''}`} role="status">
      {completed ? (
        <>
          <StarIcon className={styles.completeStar} size="24px" glow />
          <span className={styles.completeTitle}>Congratulations!</span>
          <span className={styles.completeText}>You have scored full marks</span>
        </>
      ) : null}
      {!completed ? <span className={styles.label}>Your Score</span> : null}
      <span className={styles.value}>
        <span className={styles.currentScore}>{score}</span>
        <span className={styles.totalScore}>/{total}</span>
      </span>
      {completed ? (
        <>
          <span className={styles.surpriseText}>
            Here is a surprise for u
            <span aria-hidden="true">🎁</span>
          </span>
          <button className={styles.surpriseButton} type="button" onClick={onSurpriseClick}>
            Get surprise
          </button>
        </>
      ) : null}
    </div>
  )
}
