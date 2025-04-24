import styles from "./style.module.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyInfo, getUser } from "../../store/slices/users";
import { CloseButton } from "../../components/layouts/CloseButton";
import EditProfile from "../../components/layouts/EditProfile";
import { getUnreadNotifications } from "../../store/slices/notifications";
import Loader from './../../components/common/loader';
import handleIsTrueDate from "./../../utils/dateNotification";
import { getAllGroups, getMyCreatedGroups, getMyGroups } from "../../store/slices/groups";

import notNotification from "../../assets/icons/not.notification.svg";
import notificationImg from "../../assets/icons/notification.svg";
import edit from "../../assets/icons/edit.svg";
import list from "../../assets/icons/list.svg";
import members from "../../assets/icons/members.png";
import open from "../../assets/icons/open.svg";
import boxAnimate from "../../assets/images/box.gif";

export default function Profile() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notifications = useSelector((state) => state.notifications.list);
    const myInfo = useSelector((state) => state.users.list);
    const user = useSelector((state) =>  state.users.user);
    const groups = useSelector((state) => state.groups.list);
    const loading = useSelector((state) => state.users.loading);
    const createdGroups = user.created_groups || [];
    const membersGroups = user.member_groups || [];
    
    const [isOpenNotifcation, setIsOpenNotifcation] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isMe, setIsMe] = useState(false);
    
    const showGroups = isMe ? user.is_teacher ? groups : membersGroups : user.is_teacher ? createdGroups : membersGroups;

    console.log(groups);
    
    useLayoutEffect(() => {
        dispatch(getMyInfo());
        dispatch(getUser(id));
        dispatch(getUnreadNotifications());
    }, [dispatch]); 
    
    console.log(myInfo);

    useEffect(() => {
        if (myInfo?.id && id === myInfo.id.toString()) {
            setIsMe(true);
            if (myInfo.is_teacher) {
                dispatch(getMyCreatedGroups());
            } else {
                dispatch(getAllGroups());
            }
        } else {
            setIsMe(false);
        }
    }, [dispatch, myInfo, id]);
    

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

    const getQuantityStudents = (groupID) => {
        const group = Array.isArray(groups) && groups.find(item => item.id === groupID);

        if(group){
            return group.members.length;
        }

        return null;
    }

    const handleLeaveAccount = () => {
        localStorage.removeItem('access_token');
        dispatch(getUser(null));
        dispatch(getMyInfo(null));
        navigate('/sign-in');
    };
    

    if(loading){
        return <Loader />
    }

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
                        {isMe && 'Здравствуйте,'}
                        {isMe && <br />}
                        {isMe ? myInfo.username : user.username}
                    </h2>
                    <div className={styles.myGroups}>
                        <h2>{isMe && 'Мои'} {isMe ? 'группы' : 'Группы'}</h2>
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
                                            <img
                                                src={members}
                                                width={24}
                                                height={24}
                                                alt="people"
                                            />
                                            <h2>Участников: <b>{getQuantityStudents(item.id)}</b></h2>
                                            {isMe && 
                                                <Link
                                                    to={`/my-groups/${item.id}`}
                                                    className={styles.openGroup}
                                                >
                                                    <img
                                                        src={open}
                                                        width={24}
                                                        height={24}
                                                        alt="open"
                                                    />
                                                </Link>
                                            }
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3">
                                <h2 className="text-3xl">
                                    {isMe ? 'Вы не состоите ни в одной группе' : 'Пользователь не состоит ни в одной группе'}
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
                {isMe && 
                    <button className={styles.notification}>
                        <img
                            src={notifications.length ? notificationImg : notNotification}
                            width={28}
                            height={28}
                            alt="notification"
                            onClick={() => setIsOpenNotifcation((prev) => !prev)}
                        />
                    </button>
                }
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
                {isMe && 
                    <button
                        className={styles.editProfile}
                        onClick={() => setIsEdit(true)}
                    >
                        <img src={edit} width={28} height={28} alt="edit" />
                    </button>
                }
                <div className={styles.profileNameBlock}>
                    <img
                        src={isMe ? myInfo.image : user.image}
                        width={80}
                        height={80}
                        alt="avatar"
                        className="rounded-full"
                    />
                    <h2>
                        {isMe ? `${myInfo.first_name} ${myInfo.last_name}` : `${user.first_name} ${user.last_name}`}
                    </h2>
                    <div className={styles.mail}>{isMe ? myInfo.email : user.email}</div>
                </div>
                {/* <div className={styles.importantLinks}>
                    <ul className={styles.importantLinksContent}>
                        <li>
                            <img src={list} width={24} height={24} alt="list" />
                            <Link to="#">Расписание</Link>
                        </li>
                        <li>
                            <img src={list} width={24} height={24} alt="list" />
                            <Link to="#">РПД</Link>
                        </li>
                        <li>
                            <img src={list} width={24} height={24} alt="list" />
                            <Link to="#">ФОС</Link>
                        </li>
                    </ul>
                </div> */}
                <div className="w-full flex flex-col items-center gap-2">
                    {!isMe && <Link className="w-full py-2 px-4 rounded-lg bg-white text-black text-center border border-black font-medium" to={`/chats?id=${user.id}`}>Написать сообщение</Link>}
                    {isMe && <button className="w-full py-2 px-4 rounded-lg bg-black text-white font-medium" onClick={handleLeaveAccount}>Выйти из аккаунта</button>}
                </div>
            </div>
        </div>
    );
}
