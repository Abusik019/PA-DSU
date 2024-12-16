import styles from './style.module.scss';
import cross from '../../assets/icons/cross.svg';

export const CloseButton = ({ setState }) => {
    return (
        <button className={styles.closeBtn} onClick={() => setState(false)}>
            <img src={cross} width={24} height={24} alt="cross" />
        </button>
    );
};
