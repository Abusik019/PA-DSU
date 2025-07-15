import styles from './style.module.scss';
import { CrossIcon } from '../../../assets';

export const CloseButton = ({ setState }) => {
    return (
        <button className={styles.closeBtn} onClick={() => setState(false)}>
            <CrossIcon width={24} height={24} />
        </button>
    );
};
