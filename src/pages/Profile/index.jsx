import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getMyInfo } from "../../store/slices/users";
import { CloseButton } from "./../../components/CloseButton";
import EditProfile from "../../components/EditProfile";

import notNotification from "../../assets/icons/not.notification.svg";
import edit from "../../assets/icons/edit.svg";
import logo from "../../assets/images/example-profile.png";
import list from "../../assets/icons/list.svg";
import members from "../../assets/icons/members.png";
import open from "../../assets/icons/open.svg";
import boxAnimate from '../../assets/images/box.gif';

export default function Profile() {
    const dispatch = useDispatch();
    const myInfo = useSelector((state) => state.users.list);
    const loading = useSelector((state) => state.users.loading);
    const error = useSelector((state) => state.users.error);
    const groupsMember = myInfo.member_groups || [];

    const [isOpenNotifcation, setIsOpenNotifcation] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    console.log(myInfo);

    useEffect(() => {
        dispatch(getMyInfo());  
    }, []);

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
                        {groupsMember.length ? 
                            <ul className={styles.myGroupsContent}>
                                {myInfo.member_groups.map(item => (
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
                                            <Link to="#" className={styles.openGroup}>
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
                        : 
                            <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3">
                                <h2 className="text-3xl">Вы не состоите ни в одной группе</h2>
                                <img 
                                    src={boxAnimate}
                                    width={128}
                                    height={128}
                                    alt="empty"
                                />
                            </div>
                        }
                    </div>
                </div>
            )}
            <div className={styles.profileInfo}>
                <button className={styles.notification}>
                    <img
                        src={notNotification}
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
                        <h2>Уведомления (3)</h2>
                        <CloseButton setState={setIsOpenNotifcation} />
                    </div>
                    <div className={styles.dateNotifications}>Сегодня</div>
                    <ul className={styles.notificationsList}>
                        <li>
                            <Link>
                                <div className={styles.notificationContent}>
                                    <img
                                        src={logo}
                                        width={32}
                                        height={32}
                                        alt="profile image"
                                    />
                                    <p>Отправляю вам тест для решения</p>
                                </div>
                                <h2>14:08</h2>
                            </Link>
                        </li>
                        <li>
                            <Link>
                                <div className={styles.notificationContent}>
                                    <img
                                        src={logo}
                                        width={32}
                                        height={32}
                                        alt="profile image"
                                    />
                                    <p>Отправляю вам тест для решения</p>
                                </div>
                                <h2>14:08</h2>
                            </Link>
                        </li>
                        <li>
                            <Link>
                                <div className={styles.notificationContent}>
                                    <img
                                        src={logo}
                                        width={32}
                                        height={32}
                                        alt="profile image"
                                    />
                                    <p>Отправляю вам тест для решения</p>
                                </div>
                                <h2>14:08</h2>
                            </Link>
                        </li>
                    </ul>
                    <div className={styles.dateNotifications}>Вчера</div>
                    <ul className={styles.notificationsList}>
                        <li>
                            <Link>
                                <div className={styles.notificationContent}>
                                    <img
                                        src={logo}
                                        width={32}
                                        height={32}
                                        alt="profile image"
                                    />
                                    <p>Отправляю вам тест для решения</p>
                                </div>
                                <h2>14:08</h2>
                            </Link>
                        </li>
                        <li>
                            <Link>
                                <div className={styles.notificationContent}>
                                    <img
                                        src={logo}
                                        width={32}
                                        height={32}
                                        alt="profile image"
                                    />
                                    <p>Отправляю вам тест для решения</p>
                                </div>
                                <h2>14:08</h2>
                            </Link>
                        </li>
                        <li>
                            <Link>
                                <div className={styles.notificationContent}>
                                    <img
                                        src={logo}
                                        width={32}
                                        height={32}
                                        alt="profile image"
                                    />
                                    <p>Отправляю вам тест для решения</p>
                                </div>
                                <h2>14:08</h2>
                            </Link>
                        </li>
                    </ul>
                </div>
                <button
                    className={styles.editProfile}
                    onClick={() => setIsEdit(true)}
                >
                    <img src={edit} width={28} height={28} alt="edit" />
                </button>
                <div className={styles.profileNameBlock}>
                    <img src={myInfo.image} width={80} height={80} alt="avatar" className="rounded-full"/>
                    <h2>{myInfo.first_name} {myInfo.last_name}</h2>
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
