import styles from './style.module.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGroup, groupLeave, kickUser } from './../../store/slices/groups';
import { getMyInfo } from './../../store/slices/users';

import linkImg from '../../assets/icons/open.svg';
import deleteImg from '../../assets/icons/delete.svg';
import editImg from '../../assets/icons/editGroup.svg';
import { BackButton } from './../../components/BackButton/index';

export default function Group() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const group = useSelector((state) => state.groups.group);
    const myData = useSelector((state) => state.users.list);
    const loading = useSelector((state) => state.groups.loading);
    const error = useSelector((state) => state.groups.error);
    const [isTeacher, setIsTeacher] = useState(false);
    const [isGroupDropdown, setIsGroupDropdown] = useState(false);
    const isMyGroup = myData.created_groups && Array.isArray(myData.created_groups) ? myData.created_groups.filter((item) => parseInt(item.id) === parseInt(group.id)) : [];

    const toggleDropdown = () => {
        setIsGroupDropdown((prev) => !prev);
    };

    const handleKickUser = async (userId) => {
        if (userId) {
            try {
                await dispatch(kickUser({ groupId: id, userId })).unwrap(); 
                dispatch(getGroup(id)); 
            } catch (error) {
                console.error("Ошибка удаления пользователя:", error);
            }
        }
    };

    const handleLeaveGrorp = async () => {
        try {
            dispatch(groupLeave(id)).unwrap(); 
            navigate('/my-groups'); 
        } catch (error) {
            console.error("Ошибка выхода из группы:", error);
        }
    }

    console.log(myData);
    console.log(group);

    useEffect(() => {
        dispatch(getGroup(id));
        dispatch(getMyInfo());
    }, [id, dispatch]);
    
    useEffect(() => {
        if (isMyGroup.length) {
            setIsTeacher(true);
        } else {
            setIsTeacher(false);
        }
    }, [isMyGroup]);    

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
            <BackButton path='/my-groups'/>
            {isTeacher ? (
                <ul className={`${styles.teacherGroupActionsDropdown} ${isGroupDropdown ? styles.visible : ''}`}>
                    <li>Удалить группу</li>
                    <li>Редактировать группу</li>
                    <li>Пригласить участника</li>
                </ul>
            ): (
                <ul className={`${styles.groupActionsDropdown} ${isGroupDropdown ? styles.visible : ''}`}>
                    <li onClick={handleLeaveGrorp}>Покинуть группу</li>
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
                            className='rounded-[50%]'
                        />
                        <h2 className='text-3xl font-semibold'>{group.curator && group.curator.first_name} {group.curator && group.curator.last_name}</h2>
                    </div>
                    <Link to={group.curator && `/user/${group.curator.id}`}>
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
                                <Link to={`/user/${item.id}`}>
                                    <img 
                                        src={linkImg}
                                        width={20}
                                        height={20}
                                        alt="link to profile" 
                                    />
                                </Link>
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
