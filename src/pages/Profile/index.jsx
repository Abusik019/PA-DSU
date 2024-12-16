import styles from './style.module.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import notNotification from '../../assets/icons/not.notification.svg';
import edit from '../../assets/icons/edit.svg';
import logo from '../../assets/images/example-profile.png';
import list from '../../assets/icons/list.svg';
import members from '../../assets/icons/members.png';
import open from '../../assets/icons/open.svg';
import EditProfile from '../../components/EditProfile';
import { CloseButton } from './../../components/CloseButton';

export default function Profile() {
    const [isOpenNotifcation, setIsOpenNotifcation] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

  return (
    <div className={styles.profile}>
        {isEdit ? <EditProfile avatar={logo} setState={setIsEdit}/> :
            <div className={styles.profileContent}>
            <h2>Здраствуйте,<br/>Абужапар</h2>
            <div className={styles.myGroups}>
                <h2>Мои группы</h2>
                <ul className={styles.myGroupsContent}>
                    <li>
                        <div className={styles.groupInfo}>
                            <div>
                                <span>4</span>
                                <h2>курс</h2>
                            </div>
                            <h2>ИСИП</h2>
                            <div>
                                <h2>группа</h2>
                                <span>1</span>
                            </div>
                        </div>
                        <h2>Web-программирование</h2>
                        <div className={styles.studentsInfo}>
                            <img
                                src={members}
                                width={24}
                                height={24}
                                alt='people'
                            />
                            <h2>12 студентов</h2>
                            <Link to='#' className={styles.openGroup}>
                                <img 
                                    src={open}
                                    width={24}
                                    height={24}
                                    alt='open'
                                />
                            </Link>
                        </div>
                    </li>
                    <li>
                        <div className={styles.groupInfo}>
                            <div>
                                <span>4</span>
                                <h2>курс</h2>
                            </div>
                            <h2>ИСИП</h2>
                            <div>
                                <h2>группа</h2>
                                <span>2</span>
                            </div>
                        </div>
                        <h2>Разработка программных модулей</h2>
                        <div className={styles.studentsInfo}>
                            <img
                                src={members}
                                width={24}
                                height={24}
                                alt='people'
                            />
                            <h2>12 студентов</h2>
                            <Link to='#' className={styles.openGroup}>
                                <img 
                                    src={open}
                                    width={24}
                                    height={24}
                                    alt='open'
                                />
                            </Link>
                        </div>
                    </li>
                    <li>
                        <div className={styles.groupInfo}>
                            <div>
                                <span>4</span>
                                <h2>курс</h2>
                            </div>
                            <h2>ИСИП</h2>
                            <div>
                                <h2>группа</h2>
                                <span>1</span>
                            </div>
                        </div>
                        <h2>Web-программирование</h2>
                        <div className={styles.studentsInfo}>
                            <img
                                src={members}
                                width={24}
                                height={24}
                                alt='people'
                            />
                            <h2>12 студентов</h2>
                            <Link to='#' className={styles.openGroup}>
                                <img 
                                    src={open}
                                    width={24}
                                    height={24}
                                    alt='open'
                                />
                            </Link>
                        </div>
                    </li>
                    <li>
                        <div className={styles.groupInfo}>
                            <div>
                                <span>4</span>
                                <h2>курс</h2>
                            </div>
                            <h2>ИСИП</h2>
                            <div>
                                <h2>группа</h2>
                                <span>1</span>
                            </div>
                        </div>
                        <h2>Web-программирование</h2>
                        <div className={styles.studentsInfo}>
                            <img
                                src={members}
                                width={24}
                                height={24}
                                alt='people'
                            />
                            <h2>12 студентов</h2>
                            <Link to='#' className={styles.openGroup}>
                                <img 
                                    src={open}
                                    width={24}
                                    height={24}
                                    alt='open'
                                />
                            </Link>
                        </div>
                    </li>
                    <li>
                        <div className={styles.groupInfo}>
                            <div>
                                <span>4</span>
                                <h2>курс</h2>
                            </div>
                            <h2>ИСИП</h2>
                            <div>
                                <h2>группа</h2>
                                <span>1</span>
                            </div>
                        </div>
                        <h2>Web-программирование</h2>
                        <div className={styles.studentsInfo}>
                            <img
                                src={members}
                                width={24}
                                height={24}
                                alt='people'
                            />
                            <h2>12 студентов</h2>
                            <Link to='#' className={styles.openGroup}>
                                <img 
                                    src={open}
                                    width={24}
                                    height={24}
                                    alt='open'
                                />
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>
            </div>
        }
        <div className={styles.profileInfo}>
            <button className={styles.notification}>
                <img 
                    src={notNotification}
                    width={28}
                    height={28}
                    alt='notification'
                    onClick={() => setIsOpenNotifcation((prev) => !prev)}
                />
            </button>
            <div className={`${styles.notificationBlock} ${isOpenNotifcation ? styles.active : ''}`}>
                <div className={styles.notificationClose}>
                    <h2>Уведомления (3)</h2>
                    <CloseButton setState={setIsOpenNotifcation}/>
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
                                    alt='profile image'
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
                                    alt='profile image'
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
                                    alt='profile image'
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
                                    alt='profile image'
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
                                    alt='profile image'
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
                                    alt='profile image'
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
                <img 
                    src={edit}
                    width={28}
                    height={28}
                    alt='edit'
                />
            </button>
            <div className={styles.profileNameBlock}>
                <img 
                    src={logo}
                    width={80}
                    height={80}
                    alt='avatar'
                />
                <h2>Абужапар Гасанбеков</h2>
                <div className={styles.mail}>abusroyale@gmail.com</div>
            </div>
            <div className={styles.importantLinks}>
                <h2>Важные ссылки</h2>
                <ul className={styles.importantLinksContent}>
                    <li>
                        <img 
                            src={list}
                            width={24}
                            height={24}
                            alt='list'
                        />
                        <Link to='#'>Расписание</Link>
                    </li>
                    <li>
                        <img 
                            src={list}
                            width={24}
                            height={24}
                            alt='list'
                        />
                        <Link to='#'>Учебная программа</Link>
                    </li>
                    <li>
                        <img 
                            src={list}
                            width={24}
                            height={24}
                            alt='list'
                        />
                        <Link to='#'>ФОС</Link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}
