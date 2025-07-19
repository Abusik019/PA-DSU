import styles from "./style.module.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserState, getMyInfo, getUser } from "../../store/slices/users";
import { getUnreadNotifications } from "../../store/slices/notifications";
import Loader from './../../components/common/loader';
import handleIsTrueDate from "./../../utils/dateNotification";
import { getAllGroups, getMyCreatedGroups } from "../../store/slices/groups";
import { NotificationIcon, NotNotificationIcon, OpenIcon, PenIcon, PeopleIcon } from "../../assets";
import NotData from "../../components/layouts/NotData";
import { CloseButton } from "../../components/common/CloseButton";
import EditProfile from "../../components/layouts/EditProfile";

export default function Profile() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const notifications = useSelector((state) => state.notifications.list);
    const myInfo = useSelector((state) => state.users.list);
    const user = useSelector((state) => state.users.user);
    const groups = useSelector((state) => state.groups.list);
    const usersLoading = useSelector((state) => state.users.loading);
    const groupsLoading = useSelector((state) => state.groups.loading);
    const notificationsLoading = useSelector((state) => state.notifications.loading);

    // Мемоизация isMe
    const isMe = useMemo(() => myInfo?.id && id === myInfo.id.toString(), [myInfo.id, id]);

    // Мемоизация групп
    const createdGroups = useMemo(() => user.created_groups || [], [user.created_groups]);
    const membersGroups = useMemo(() => user.member_groups || [], [user.member_groups]);

    // Мемоизация showGroups
    const showGroups = useMemo(() => {
        if (isMe) {
            return user.is_teacher ? groups : membersGroups;
        } else {
            return user.is_teacher ? createdGroups : membersGroups;
        }
    }, [isMe, user.is_teacher, groups, membersGroups, createdGroups]);

    // Группировка уведомлений
    const groupedNotifications = useMemo(() => {
        const grouped = { today: [], yesterday: [], other: [] };
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
        grouped.other.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return grouped;
    }, [notifications]);

    const [isOpenNotification, setIsOpenNotification] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (!myInfo.id) dispatch(getMyInfo());
        dispatch(getUser(id));
        dispatch(getUnreadNotifications());
        // Группы только если профиль свой
        if (isMe) {
            if (myInfo.is_teacher) {
                dispatch(getMyCreatedGroups());
            } else {
                dispatch(getAllGroups());
            }
        }
    }, [dispatch, id, isMe, myInfo.id, myInfo.is_teacher]);

    if (usersLoading || groupsLoading || notificationsLoading) {
        return <Loader />;
    }

    const getQuantityStudents = (groupID) => {
        const group = Array.isArray(groups) && groups.find(item => item.id === groupID);
        return group ? group.members.length : null;
    };

    const handleLeaveAccount = () => {
        localStorage.removeItem('access_token');
        dispatch(clearUserState());
        navigate('/sign-in');
    };

    const renderNotifications = (title, notificationsList) => (
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
                                        alt="profile"
                                        style={{ borderRadius: "50%" }}
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
        )
    );

    const renderGroupedNotifications = () => (
        <>
            {renderNotifications("Сегодня", groupedNotifications.today)}
            {renderNotifications("Вчера", groupedNotifications.yesterday)}
            {groupedNotifications.other.map((item) => {
                const formattedDate = new Date(item.created_at).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                });
                return renderNotifications(formattedDate, [item]);
            })}
        </>
    );

    return (
        <div className={styles.profile}>
            {isEdit ? (
                <EditProfile setState={setIsEdit} />
            ) : (
                <div className={styles.profileContent}>
                    <h2>
                        {isMe && 'Здравствуйте,'}
                        {isMe && <br />}
                        {isMe ? myInfo.username : user.username}
                    </h2>
                    <div className={styles.myGroups}>
                        <h2>{isMe ? 'Мои группы' : 'Группы'}</h2>
                        {showGroups.length ? (
                            <ul className={styles.myGroupsContent}>
                                {showGroups.map((item) => (
                                    <li key={item.id}>
                                        <div className={styles.groupInfo}>
                                            <div>
                                                <span>{item.course}</span>
                                                <h2>курс</h2>
                                            </div>
                                            <div>
                                                <h2>группа</h2>
                                                <span>{item.subgroup}</span>
                                            </div>
                                        </div>
                                        <h2>{item.facult}</h2>
                                        <div className={styles.studentsInfo}>
                                            <PeopleIcon />
                                            <h2>Участников: <b>{getQuantityStudents(item.id)}</b></h2>
                                            {isMe && (
                                                <Link
                                                    to={`/my-groups/${item.id}`}
                                                    className={styles.openGroup}
                                                >
                                                    <OpenIcon />
                                                </Link>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <NotData text={isMe ? 'Вы не состоите ни в одной группе' : 'Пользователь не состоит ни в одной группе'} />
                        )}
                    </div>
                </div>
            )}
            <div className={styles.profileInfo}>
                {isMe && (
                    <button className={styles.notification} onClick={() => setIsOpenNotification(prev => !prev)}>
                        {notifications.length ? <NotificationIcon /> : <NotNotificationIcon />}
                    </button>
                )}
                <div className={`${styles.notificationBlock} ${isOpenNotification ? styles.active : ""}`}>
                    <div className={styles.notificationClose}>
                        <h2>Уведомления ({notifications.length})</h2>
                        <CloseButton onClick={() => setIsOpenNotification(false)} />
                    </div>
                    {notifications.length ? (
                        renderGroupedNotifications()
                    ) : (
                        <div className="p-4 box-border text-center text-2xl">
                            Новых уведомлений нет<br />:(
                        </div>
                    )}
                </div>
                {isMe && (
                    <button
                        className={styles.editProfile}
                        onClick={() => setIsEdit(true)}
                    >
                        <PenIcon width={28} height={28} />
                    </button>
                )}
                <div className={styles.profileNameBlock}>
                    <img
                        src={isMe ? myInfo.image : user.image}
                        className="object-cover rounded-full w-20 h-20"
                        alt="avatar"
                    />
                    <h2>
                        {isMe
                            ? `${myInfo.first_name} ${myInfo.last_name}`
                            : `${user.first_name} ${user.last_name}`}
                    </h2>
                    <div className={styles.mail}>
                        {isMe ? myInfo.email : user.email}
                    </div>
                </div>
                <div className="w-full flex flex-col items-center gap-2">
                    {!isMe ? (
                        <Link
                            className="w-full py-2 px-4 rounded-lg bg-white text-black text-center border border-black font-medium"
                            to={`/chats?userID=${user.id}`}
                        >
                            Написать сообщение
                        </Link>
                    ) : (
                        <button
                            className="w-full py-2 px-4 rounded-lg bg-black text-white font-medium"
                            onClick={handleLeaveAccount}
                        >
                            Выйти из аккаунта
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}