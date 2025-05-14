import { useEffect, useRef, memo } from "react";
import styles from "./style.module.css"; 

const ContextMenuComponent = ({
    message,
    position,
    onClose,
    onCopy,
    onEdit,
    onDelete,
    isMyMessage
}) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    if (!message) return null;

    return (
        <ul
            ref={menuRef}
            className="h-fit w-fit rounded-lg bg-white shadow-lg z-[999] fixed"
            style={{
                top: position.y,
                left: position.x,
            }}
        >
            {isMyMessage && (
                <li className={`${styles.action} ${styles.edit}`} onClick={onEdit}>
                    Изменить
                </li>
            )}
            <li className={`${styles.action} ${styles.copy}`} onClick={onCopy}>
                Копировать
            </li>
            {isMyMessage && (
                <li className={`${styles.action} ${styles.delete}`} onClick={onDelete}>
                    Удалить
                </li>
            )}
        </ul>
    );
};

export const ContextMenu = memo(ContextMenuComponent);
