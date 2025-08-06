import styles from '../style.module.scss';

export const ResetBtn = ({ onClick }) => {
    return (
        <button
            className={styles.resetBtn}
            onClick={onClick}
        >
            Сброс
        </button>
    )
}
