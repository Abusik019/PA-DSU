import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyInfo } from "../../store/slices/users";
import { CloseButton } from "./../../components/CloseButton";
import EditProfile from "../../components/EditProfile";

import notNotification from "../../assets/icons/not.notification.svg";
import notificationImg from "../../assets/icons/notification.svg";
import edit from "../../assets/icons/edit.svg";
import logo from "../../assets/images/example-profile.png";
import list from "../../assets/icons/list.svg";
import members from "../../assets/icons/members.png";
import open from "../../assets/icons/open.svg";
import boxAnimate from "../../assets/images/box.gif";
import { getUnreadNotifications } from "../../store/slices/notifications";
import handleIsTrueDate from "./../../utils/dateNotification";

export default function Profile() {
    const dispatch = useDispatch();
    const myInfo = useSelector((state) => state.users.list);
    const notifications = useSelector((state) => state.notifications.list);
    const loading = useSelector((state) => state.users.loading);
    const error = useSelector((state) => state.users.error);
    const groupsMember = myInfo.member_groups || [];

    const [isOpenNotifcation, setIsOpenNotifcation] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    console.log(myInfo);
    console.log(notifications);

    useEffect(() => {
        dispatch(getMyInfo());
        dispatch(getUnreadNotifications());
    }, [dispatch]);

    const groupAndSortNotificationsByDate = (notifications) => {
        const grouped = {
            today: [],
            yesterday: [],
            other: [],
        };

        notifications.forEach((item) => {
            const date = handleIsTrueDate(item.created_at);
            if (date.isToday) {
                grouped.today.push(item);
            } else if (date.isYesterday) {
                grouped.yesterday.push(item);
            } else {
                grouped.other.push(item);
            }
        });

        grouped.other.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        return grouped;
    };

    const renderNotifications = (title, notificationsList) =>
        notificationsList.length > 0 && (
            <>
                <div className={styles.dateNotifications}>{title}</div>
                <ul className={styles.notificationsList}>
                    {notificationsList.map((item) => (
                        <li key={item.id}>
                            <Link>
                                <div className={styles.notificationContent}>
                                    <img
                                        src={item.user && item.user.image}
                                        width={40}
                                        height={40}
                                        alt="profile image"
                                        style={{borderRadius: "50%"}}
                                    />
                                    <div className={styles.notificationText}>
                                        <h2>{item.title}</h2>
                                        <p>{item.body}</p>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </>
        );

    const renderGroupedNotifications = (groupedNotifications) => (
        <>
            {renderNotifications("Сегодня", groupedNotifications.today)}
            {renderNotifications("Вчера", groupedNotifications.yesterday)}
            {groupedNotifications.other.map((item) => {
                const formattedDate = new Date(
                    item.created_at
                ).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                });
                return renderNotifications(formattedDate, [item]);
            })}
        </>
    );

    const groupedNotifications = groupAndSortNotificationsByDate(
        notifications || []
    );

    return (
        <div className={styles.profile}>
            {isEdit ? (
                <EditProfile setState={setIsEdit} />
            ) : (
                <div className={styles.profileContent}>
                    <h2>
                        Здраствуйте,
                        <br />
                        {myInfo.username}
                    </h2>
                    <div className={styles.myGroups}>
                        <h2>Мои группы</h2>
                        {groupsMember.length ? (
                            <ul className={styles.myGroupsContent}>
                                {myInfo.member_groups.map((item) => (
                                    <li key={item.id}>
                                        <div className={styles.groupInfo}>
                                            <div>
                                                <span>{item.course}</span>
                                                <h2>курс</h2>
                                            </div>
                                            <h2>{item.facult}</h2>
                                            <div>
                                                <h2>группа</h2>
                                                <span>{item.subgroup}</span>
                                            </div>
                                        </div>
                                        <h2>Web-программирование</h2>
                                        <div className={styles.studentsInfo}>
                                            <img
                                                src={members}
                                                width={24}
                                                height={24}
                                                alt="people"
                                            />
                                            <h2>12 студентов</h2>
                                            <Link
                                                to="#"
                                                className={styles.openGroup}
                                            >
                                                <img
                                                    src={open}
                                                    width={24}
                                                    height={24}
                                                    alt="open"
                                                />
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3">
                                <h2 className="text-3xl">
                                    Вы не состоите ни в одной группе
                                </h2>
                                <img
                                    src={boxAnimate}
                                    width={128}
                                    height={128}
                                    alt="empty"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className={styles.profileInfo}>
                <button className={styles.notification}>
                    <img
                        src={notifications.length ? notificationImg : notNotification}
                        width={28}
                        height={28}
                        alt="notification"
                        onClick={() => setIsOpenNotifcation((prev) => !prev)}
                    />
                </button>
                <div
                    className={`${styles.notificationBlock} ${
                        isOpenNotifcation ? styles.active : ""
                    }`}
                >
                    <div className={styles.notificationClose}>
                        <h2>
                            Уведомления ({notifications && notifications.length}
                            )
                        </h2>
                        <CloseButton setState={setIsOpenNotifcation} />
                    </div>
                    {!notifications.length ? <div className="p-4 box-border text-center text-2xl">Новых уведомлений нет<br />:(</div> : renderGroupedNotifications(groupedNotifications)}
                </div>
                <button
                    className={styles.editProfile}
                    onClick={() => setIsEdit(true)}
                >
                    <img src={edit} width={28} height={28} alt="edit" />
                </button>
                <div className={styles.profileNameBlock}>
                    <img
                        src={myInfo.image}
                        width={80}
                        height={80}
                        alt="avatar"
                        className="rounded-full"
                    />
                    <h2>
                        {myInfo.first_name} {myInfo.last_name}
                    </h2>
                    <div className={styles.mail}>{myInfo.email}</div>
                </div>
                <div className={styles.importantLinks}>
                    <h2>Важные ссылки</h2>
                    <ul className={styles.importantLinksContent}>
                        <li>
                            <img src={list} width={24} height={24} alt="list" />
                            <Link to="#">Расписание</Link>
                        </li>
                        <li>
                            <img src={list} width={24} height={24} alt="list" />
                            <Link to="#">Учебная программа</Link>
                        </li>
                        <li>
                            <img src={list} width={24} height={24} alt="list" />
                            <Link to="#">ФОС</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
