import styles from './style.module.scss';
import crossImg from '../../../assets/icons/cross.svg';

export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <img 
                        src={crossImg}
                        width={20}
                        height={20}
                        alt="close" 
                    />
                </button>
                {children}
            </div>
        </div>
    );
}
