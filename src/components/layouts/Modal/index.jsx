import styles from './style.module.scss';
import { CrossIcon } from '../../../assets';

export default function Modal({ isOpen, onClose, defaultDeletion = true, children }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {defaultDeletion && 
                    <button className={styles.closeButton} onClick={onClose}>
                        <CrossIcon />
                    </button>
                }
                {children}
            </div>
        </div>
    );
}
