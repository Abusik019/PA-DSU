import styles from "./style.module.css";
import { useEffect, useRef, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersWhoCheckMessage } from "../../../store/slices/chats";
import { AnimatePresence, motion } from "framer-motion";
import plural from 'plural-ru';


const ContextMenuComponent = ({
    message,
    position,
    onClose,
    onCopy,
    onEdit,
    onDelete,
    isMyMessage,
    chatType
}) => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.chats.users);
    const menuRef = useRef(null);
    const [submenu, setSubmenu] = useState("main");

    useEffect(() => {
        if(message.id){
            dispatch(getUsersWhoCheckMessage(message.id))
                .unwrap()
                .then(console.log)
                .catch((error) => {
                    console.error('Ошибка получения данных: ', error);
                })
        }
    }, [message])

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

    
    useEffect(() => {
        const menu = menuRef.current;
        if (!menu) return;

        const { innerHeight, innerWidth } = window;
        const menuRect = menu.getBoundingClientRect();

        let adjustedTop = position.y - menu.offsetHeight;
        let adjustedLeft = position.x;

        if (adjustedLeft + menuRect.width > innerWidth) {
            adjustedLeft = innerWidth - menuRect.width - 10;
        }

        if (adjustedTop < 0) {
            adjustedTop = 10;
        }

        menu.style.top = `${adjustedTop}px`;
        menu.style.left = `${adjustedLeft}px`;
    }, [position]);

    if (!message) return null;

    const animation = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.15 }
    };

    return (
        <motion.ul
            ref={menuRef}
            {...animation}
            className="h-fit w-fit rounded-lg bg-white shadow-lg z-[999] fixed p-2"
            style={{
                top: position.y,
                left: position.x,
                minWidth: "160px"
            }}
        >
            <AnimatePresence mode="wait">
                {submenu === "main" ? (
                    <motion.div key="main" {...animation}>
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
                        {(isMyMessage && chatType === 'group') && (
                            <li className={`${styles.action} ${styles.views}`} onClick={() => setSubmenu("views")}>
                                {users.length} {plural(users.length, 'просмотр', 'просмотра', 'просмотров')}
                            </li>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="views" className={styles.submenu} {...animation}>
                        <li className={styles.backBtn} onClick={() => setSubmenu("main")}>
                            Назад
                        </li>
                        {Array.isArray(users) && (
                            users.map((item) => (
                                <li className={styles.user} key={item.id}>
                                    <img src={item?.user?.image} width={24} height={24} alt="user avatar" />
                                    <span>{item?.user?.first_name} {item?.user?.last_name}</span>
                                </li>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.ul>
    );
};

export const ContextMenu = memo(ContextMenuComponent);
