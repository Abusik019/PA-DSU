import styles from './style.module.scss';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserState, getMyInfo, getUser } from "../../store/slices/users";
import { getUnreadNotifications } from "../../store/slices/notifications";
import Loader from './../../components/common/loader';
import { handleIsTrueDate } from "./../../utils";
import { getAllGroups, getMyCreatedGroups } from "../../store/slices/groups";
import { NotificationIcon, NotNotificationIcon, OpenIcon, PenIcon, PeopleIcon } from "../../assets";
import NotData from "../../components/layouts/NotData";
import { CloseButton } from "../../components/common/closeButton";
import EditProfile from "../../components/layouts/EditProfile";
import { useScreenWidth } from './../../providers/ScreenWidthProvider';

export default function Profile() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const windowWidth = useScreenWidth();

    const notifications = useSelector((state) => state.notifications.list);
    const myInfo = useSelector((state) => state.users.list);
    const user = useSelector((state) => state.users.user);
    const groups = useSelector((state) => state.groups.list);
    const usersLoading = useSelector((state) => state.users.loading);
    const groupsLoading = useSelector((state) => state.groups.loading);
    const notificationsLoading = useSelector((state) => state.notifications.loading);

    const isMe = useMemo(() => myInfo?.id && id === myInfo.id.toString(), [myInfo.id, id]);

    const createdGroups = useMemo(() => user.created_groups || [], [user.created_groups]);
    const membersGroups = useMemo(() => user.member_groups || [], [user.member_groups]);


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
        navigate('/');
    };

    const renderNotifications = (title, notificationsList) => (
        notificationsList.length > 0 && (
            <>
                <div className="bg-gray-50 p-2.5 box-border border-t border-b border-gray-200 text-base font-semibold">{title}</div>
                <ul className="flex flex-col items-center w-full">
                    {notificationsList.map((item) => (
                        <li key={item.id} className="w-full max-h-[120px] p-[15px] box-border overflow-hidden border-b border-gray-200 transition-[max-height] duration-300 ease-in-out hover:max-h-[500px] last:border-none">
                            <Link className="flex items-center justify-between h-full no-underline">
                                <div className="flex items-center gap-2.5 max-w-full">
                                    <img
                                        src={item.user && item.user.image}
                                        width={40}
                                        height={40}
                                        alt="profile"
                                        className="rounded-full"
                                    />
                                    <div className="max-w-full w-full flex items-start flex-col gap-1.5 overflow-hidden">
                                        <h2 className="font-semibold text-black overflow-hidden whitespace-nowrap text-ellipsis max-w-full w-full break-words">
                                            {item.title}
                                        </h2>
                                        <p className="text-black overflow-hidden whitespace-nowrap text-ellipsis max-w-full w-full break-words">
                                            {item.body}
                                        </p>
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
        <div className="
            h-full w-full overflow-hidden flex items-start justify-between gap-20
            max-sm:flex-col-reverse max-sm:justify-start max-sm:h-fit max-sm:overflow-auto max-sm:my-28
        ">
            {isEdit ? (
                <EditProfile setState={setIsEdit} />
            ) : (
                <div className="h-full max-h-[900px] w-[calc(65%-40px)] flex flex-col justify-between items-start max-sm:w-full max-sm:h-fit">
                    {windowWidth >= 640 &&
                        <h2 className="text-5xl leading-[54px] font-medium w-fit mt-[12vh]">
                            {isMe && 'Здравствуйте,'}
                            {isMe && <br />}
                            {isMe ? myInfo.username : user.username}
                        </h2>
                    }
                    <div className="h-fit w-full max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-center">
                        <h2 className="font-semibold max-sm:text-3xl max-sm:self-start">{isMe ? 'Мои группы' : 'Группы'}</h2>
                        {showGroups.length ? (
                            <ul className="grid grid-flow-col grid-rows-1 gap-5 overflow-x-auto mt-5 pb-2.5 max-sm:w-full max-sm:justify-center">
                                {showGroups.map((item, index) => (
                                    <li 
                                        key={item.id}
                                        className={`
                                            rounded-2xl p-5 flex flex-col items-start justify-between w-[350px] h-auto
                                            ${index % 4 === 0 ? 'bg-[#F3C5C5]' : ''}
                                            ${index % 4 === 1 ? 'bg-[#FAE0C1]' : ''}
                                            ${index % 4 === 2 ? 'bg-[#D5D2FE]' : ''}
                                            ${index % 4 === 3 ? 'bg-[#BFF0DB]' : ''}
                                            ${index % 4 !== 0 && index % 4 !== 1 && index % 4 !== 2 && index % 4 !== 3 ? 'bg-[#F3EBE5]' : ''}
                                        `}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-end gap-[7px]">
                                                <span className="text-[22px] font-semibold">{item.course}</span>
                                                <h2 className="text-xl">курс</h2>
                                            </div>
                                            <div className="flex items-end gap-[7px]">
                                                <h2 className="text-xl">группа</h2>
                                                <span className="text-[22px] font-semibold">{item.subgroup}</span>
                                            </div>
                                        </div>
                                        <h2 className="mt-[30px] text-[22px] font-semibold">{item.facult}</h2>
                                        <div className="flex items-start gap-2.5 mt-5 w-full relative">
                                            <PeopleIcon />
                                            <h2>Участников: <b>{getQuantityStudents(item.id)}</b></h2>
                                            {isMe && (
                                                <Link
                                                    to={`/my-groups/${item.id}`}
                                                    className="absolute right-0 bottom-0"
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
            {(isEdit && windowWidth < 640) ? null : (
                <div className="
                    h-full max-h-[900px] w-[calc(35%-40px)] border border-gray-300 bg-gray-100 rounded-2xl p-5 box-border relative flex flex-col items-center justify-between
                    max-sm:w-full max-sm:h-fit
                ">
                    {isMe && (
                        <button className="absolute left-5 top-5 bg-transparent" onClick={() => setIsOpenNotification(prev => !prev)}>
                            {notifications.length ? <NotificationIcon /> : <NotNotificationIcon />}
                        </button>
                    )}
                    <div className={`${styles.notificationBlock} ${isOpenNotification ? styles.active : ''}`}>
                        <div className="flex items-center justify-between w-full p-[15px] box-border relative">
                            <h2 className="text-xl font-semibold">Уведомления ({notifications.length})</h2>
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
                            className="absolute right-5 top-5 bg-transparent"
                            onClick={() => setIsEdit(true)}
                        >
                            <PenIcon width={28} height={28} />
                        </button>
                    )}
                    <div className="flex flex-col items-center mt-7 w-full">
                        <img
                            src={isMe ? myInfo.image : user.image}
                            className="object-cover rounded-full w-20 h-20"
                            alt="avatar"
                        />
                        <h2 className="mt-5 text-2xl font-semibold text-center">
                            {isMe
                                ? `${myInfo.first_name} ${myInfo.last_name}`
                                : `${user.first_name} ${user.last_name}`}
                        </h2>
                        <div className="bg-white w-full h-12 mt-10 rounded-3xl flex items-center justify-center max-sm:mt-28 truncate">
                            {isMe ? myInfo.email : user.email}
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center gap-2 max-sm:mt-4">
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
            )}
        </div>
    );
}