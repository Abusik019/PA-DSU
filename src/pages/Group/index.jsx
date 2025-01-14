import styles from './style.module.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import linkImg from '../../assets/icons/open.svg';
import profileImg from '../../assets/images/example-profile.png';
import deleteImg from '../../assets/icons/delete.svg';
import editImg from '../../assets/icons/editGroup.svg';

export default function Group() {
    const [isTeacher, setIsTeacher] = useState(true);
    const [isGroupDropdown, setIsGroupDropdown] = useState(false);

    const toggleDropdown = () => {
        setIsGroupDropdown((prev) => !prev);
    };

    return (
        <div className="w-full h-full flex flex-col items-center gap-10 pt-[100px] box-border relative">
            <button className='absolute right-0 top-[20px]' onClick={toggleDropdown}>
                <img 
                    src={editImg}
                    width={24}
                    height={24}
                    alt="actions with group" 
                />
            </button>
            {isTeacher ? (
                <ul className={`${styles.teacherGroupActionsDropdown} ${isGroupDropdown ? styles.visible : ''}`}>
                    <li>Удалить группу</li>
                    <li>Редактировать группу</li>
                    <li>Пригласить участника</li>
                </ul>
            ): (
                <ul className={`${styles.groupActionsDropdown} ${isGroupDropdown ? styles.visible : ''}`}>
                    <li>Покинуть группу</li>
                </ul>
            )}
            <div className='flex flex-col items-start gap-4 w-full border-b-2 border-y-zinc-300 pb-6'>
                <h1 className='text-5xl'>ИСИП 4 курс 1 группа</h1>
                <div className='flex justify-between w-full items-center'>
                    <h2 className='text-3xl font-semibold'>Разработка программных модулей</h2>
                    <div className='flex items-center justify-between h-fit w-[200px]'>
                        <div>
                            <h2 className='mb-5 text-base leading-5'>Аида<br/>Хангишиева</h2>
                            <Link to="#">
                                <img
                                    src={linkImg}
                                    width={20}
                                    height={20}
                                    alt="link to profile" 
                                />
                            </Link>
                        </div>
                        <img 
                            src={profileImg}
                            width={48}
                            height={48}
                            alt="profile avatar"
                            className='rounded-lg'
                        />
                    </div>
                </div>
            </div>
            <ul className='py-4 box-border w-full h-fit flex flex-x items-start gap-2 overflow-y-auto' style={{maxHeight: "calc(100% - 194px)"}}> 
                <li className='bg-[#F3EBE5] w-full h-fit py-2 px-3 box-border rounded-lg flex items-center justify-between'>
                    <h2 className='text-lg font-medium'>Ибрагимов Забит Ибрагимович</h2>
                    {isTeacher && (
                        <div className='flex items-center gap-3'>
                            <button>
                                <img 
                                    src={linkImg}
                                    width={20}
                                    height={20}
                                    alt="link to profile" 
                                />
                            </button>
                            <button>
                                <img 
                                    src={deleteImg}
                                    width={20}
                                    height={20}
                                    alt="delete user" 
                                />
                            </button>
                        </div>
                    )}
                </li>
            </ul>
        </div>
    )
}
