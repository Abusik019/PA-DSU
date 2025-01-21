import styles from "./style.module.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "./../../store/slices/notifications";
import { Link } from 'react-router-dom';

export default function Notifications() {
    const dispatch = useDispatch();
    const list = useSelector((state) => state.notifications.list);
    const loading = useSelector((state) => state.notifications.loading);
    const error = useSelector((state) => state.notifications.error);

    console.log(list);

    useEffect(() => {
        dispatch(getNotifications());
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleString('ru-RU', options);
    };

    const sortedList = list?.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <div className="w-full h-full flex flex-col justify-between items-center pt-[100px] box-border">
            <div className="w-full flex items-center justify-between">
                <h1 className="text-5xl">Уведомления</h1>
                <button className={styles.readAll}>Прочитаны все</button>
            </div>
            <div className={styles.notificationsContent}>
                <ul className={styles.notificationsList}>
                    {sortedList &&
                        sortedList.map((item) => (
                            <li key={item.id}>
                                <Link to="#">
                                    <div className={styles.titleBlock}>
                                        <img 
                                            src={item.user.image}
                                            width={48}
                                            height={48}
                                            alt="user image" 
                                        />
                                        <div>
                                            <h2><span>{item.user.username}</span> отправил(а) вам сообщение</h2>
                                            <h3>{formatDate(item.created_at)}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}
