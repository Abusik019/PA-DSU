import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "./../../store/slices/notifications";
import { Link } from 'react-router-dom';
import linkImg from '../../assets/icons/open.svg';
import boxAnimate from '../../assets/images/box.gif';
import Loader from './../../components/common/loader';

export default function Notifications() {
    const dispatch = useDispatch();
    const list = useSelector((state) => state.notifications.list);
    const loading = useSelector((state) => state.notifications.loading);

    const [choosenNotification, setChoosenNotification] = useState();

    const choosenItem = list?.find((item) => item.id === choosenNotification) || null;

    useEffect(() => {
        dispatch(getNotifications());
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleString('ru-RU', options);
    };

    const sortedList = list?.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if(loading){
        return <Loader />
    }
    
    return (
        <div className="w-full h-full flex flex-col justify-between items-center pt-[100px] box-border">
            <div className="w-full flex items-start justify-between">
                <h1 className="text-5xl">Уведомления</h1>
            </div>
            <div className={styles.notificationsContent}>
                <ul className={styles.notificationsList}>
                    {sortedList.length !== 0 ?
                        sortedList.map((item) => (
                            <li key={item.id} onClick={() => setChoosenNotification(item.id)}> 
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
                        )) : (
                            <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3">
                                <h2 className="text-3xl">
                                    Список уведомлений пуст
                                </h2>
                                <img
                                    src={boxAnimate}
                                    width={128}
                                    height={128}
                                    alt="empty"
                                />
                            </div>
                        )}
                </ul>
                {choosenItem && 
                    <div className="w-[400px] h-fit max-h-full rounded-lg bg-[#F3EBE5] p-[20px]">
                        <div className="w-full h-fit flex items-center justify-between gap-2">
                            <h2 className="text-xl font-semibold max-w-[328px]">{choosenItem.title}</h2>
                            {/* <Link to='#'>
                                <img
                                    src={linkImg}
                                    width={24}
                                    height={24}
                                    alt="link" 
                                />
                            </Link> */}
                        </div>
                        <p className="mt-7 text-wrap">{choosenItem.body}</p>
                        <h3 className="text-gray-500">{formatDate(choosenItem.created_at)}</h3>
                    </div>
                }
            </div>
        </div>
    );
}
