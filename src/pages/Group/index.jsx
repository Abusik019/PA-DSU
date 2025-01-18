import styles from './style.module.scss';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGroup, kickUser } from './../../store/slices/groups';
import { getMyInfo } from './../../store/slices/users';

import linkImg from '../../assets/icons/open.svg';
import deleteImg from '../../assets/icons/delete.svg';
import editImg from '../../assets/icons/editGroup.svg';

export default function Group() {
    const dispatch = useDispatch();
    const group = useSelector((state) => state.groups.list);
    const myData = useSelector((state) => state.users.list);
    const loading = useSelector((state) => state.groups.loading);
    const error = useSelector((state) => state.groups.error);
    const [isTeacher, setIsTeacher] = useState(true);
    const [isGroupDropdown, setIsGroupDropdown] = useState(false);

    const toggleDropdown = () => {
        setIsGroupDropdown((prev) => !prev);
    };

    const handleKickUser = (id) => {
        if(id){
            dispatch(kickUser(id));
        }
    }

    useEffect(() => {
        dispatch(getGroup(3));  
        dispatch(getMyInfo());

        if(myData.is_teacher){
            setIsTeacher(true);
        } else {
            setIsTeacher(false);
        }
    }, []);

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
            <div className='flex flex-col items-start gap-6 w-full border-b-2 border-y-zinc-300 pb-6'>
                <h1 className='text-5xl'>{group && group.facult} {group && group.course} курс {group && group.subgroup} группа</h1>
                <div className='flex justify-between w-full items-center'>
                    <div className='flex gap-4 items-center w-fit'>
                        <img 
                            src={group.curator && group.curator.image}
                            width={48}
                            height={48}
                            alt="profile avatar"
                            className='rounded-lg'
                        />
                        <h2 className='text-3xl font-semibold'>{group.curator && group.curator.first_name} {group.curator && group.curator.last_name}</h2>
                    </div>
                    <Link to="#">
                        <img
                            src={linkImg}
                            width={30}
                            height={30}
                            alt="link to profile" 
                        />
                    </Link>
                </div>
            </div>
            <ul className='py-4 box-border w-full h-fit flex flex-col flex-x items-start gap-3 overflow-y-auto' style={{maxHeight: "calc(100% - 194px)"}}> 
                {group.members && group.members.map(item => (
                    <li key={item.id} className='bg-[#F3EBE5] w-full h-fit py-2 px-3 box-border rounded-lg flex items-center justify-between'>
                        <h2 className='text-lg font-medium'>{item.last_name} {item.first_name}</h2>
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
                                <button onClick={() => handleKickUser(item.id)}>
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
                ))}
            </ul>
        </div>
    )
}
