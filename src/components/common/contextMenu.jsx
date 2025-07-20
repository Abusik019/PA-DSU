import styles from "../style.module.scss";
import { useEffect, useRef, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersWhoCheckMessage } from "../../store/slices/chats";
import { AnimatePresence, motion } from "framer-motion";
import plural from 'plural-ru';
import classNames from 'classnames';
import { useOutsideClick } from "../../utils";

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
        if(message.id && chatType == 'group'){
            dispatch(getUsersWhoCheckMessage(message.id))
                .unwrap()
                .then(console.log)
                .catch((error) => {
                    console.error('Ошибка получения данных: ', error);
                })
        }
    }, [chatType, dispatch, message])

    useOutsideClick(menuRef, onClose)

    useEffect(() => {
        const menu = menuRef.current;
        if (!menu) return;

        const { innerWidth } = window;
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
                            <li className={classNames(
                                "w-full text-left py-1 px-10 pl-10 box-border text-sm font-medium transition-colors duration-300 cursor-pointer bg-no-repeat hover:bg-black/10 rounded-t-lg",
                                styles.editIcon
                            )} onClick={onEdit}>
                                Изменить
                            </li>
                        )}
                        <li className={classNames(
                            "w-full text-left py-1 px-10 pl-10 box-border text-sm font-medium transition-colors duration-300 cursor-pointer bg-no-repeat hover:bg-black/10",
                            styles.copyIcon
                        )} onClick={onCopy}>
                            Копировать
                        </li>
                        {isMyMessage && (
                            <li className={classNames(
                                "w-full text-left py-1 px-10 pl-10 box-border text-sm font-medium transition-colors duration-300 cursor-pointer bg-no-repeat hover:bg-black/10",
                                styles.deleteIcon
                            )} onClick={onDelete}>
                                Удалить
                            </li>
                        )}
                        {(isMyMessage && chatType === 'group') && (
                            <li className={classNames(
                                "w-full text-left py-1 px-10 pl-10 box-border text-sm font-medium transition-colors duration-300 cursor-pointer bg-no-repeat rounded-b-lg hover:bg-black/10",
                                styles.viewsIcon
                            )} onClick={() => setSubmenu("views")}>
                                {users.length} {plural(users.length, 'просмотр', 'просмотра', 'просмотров')}
                            </li>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="views" className="w-[167px]" {...animation}>
                        <li className={classNames(
                            "py-1 px-1 pl-[30px] box-border text-sm font-normal transition-colors duration-300 cursor-pointer rounded-t-lg hover:bg-black/10",
                            styles.backBtnIcon
                        )} onClick={() => setSubmenu("main")}>
                            Назад
                        </li>
                        <div className="mt-[10px]">
                            {Array.isArray(users) && (
                                users.map((item) => (
                                    <li className="text-sm flex items-center justify-start gap-2 mt-[7px] pb-[7px] box-border border-b border-black/20 last:border-none" key={item.id}>
                                        <img src={item?.user?.image} width={24} height={24} alt="user avatar" className="rounded-full object-cover" />
                                        <span className="text-ellipsis overflow-hidden whitespace-nowrap max-w-full">{item?.user?.first_name} {item?.user?.last_name}</span>
                                    </li>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.ul>
    );
};

export const ContextMenu = memo(ContextMenuComponent);
