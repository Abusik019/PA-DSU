import styles from './style.module.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeGroup, deleteGroup, getGroup, groupLeave, inviteToGroup, kickUser } from './../../store/slices/groups';
import { BackButton } from '../../components/layouts/BackButton';
import Modal from '../../components/layouts/Modal';
import SelectDirection from './../../components/common/selectDirection';
import SelectGroup from './../../components/common/selectGroup';
import SelectCourse from '../../components/common/selectCourse';

import linkImg from '../../assets/icons/open.svg';
import deleteImg from '../../assets/icons/delete.svg';
import editImg from '../../assets/icons/editGroup.svg';

export default function Group() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const group = useSelector((state) => state.groups.group);
    const myData = useSelector((state) => state.users.list);
    const [isTeacher, setIsTeacher] = useState(false);
    const [isGroupDropdown, setIsGroupDropdown] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isCopy, setIsCopy] = useState(false);
    const [groupData, setGroupData] = useState({
        direction: { label: '' },
        course: { label: '' },
        group: { label: '' }
    });
    
    const isMyGroup = useMemo(() => (
        myData.created_groups && Array.isArray(myData.created_groups)
            ? myData.created_groups.filter((item) => parseInt(item.id) === parseInt(group.id))
            : []
    ), [myData.created_groups, group.id]);

    useEffect(() => {
        dispatch(getGroup(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (group) {
            setGroupData({
                direction: {
                    label: group.facult || ''
                },
                course: {
                    label: group.course || ''
                },
                group: {
                    label: group.subgroup || ''
                }
            });
        }
    }, [group])
    
    useEffect(() => {
        if (isMyGroup.length) {
            setIsTeacher(true);
        } else {
            setIsTeacher(false);
        }
    }, [isMyGroup]); 
    
    const toggleDropdown = () => {
        setIsGroupDropdown((prev) => !prev);
    };

    const handleKickUser = async (userId) => {
        if(!id || !userId) return;

        await dispatch(kickUser({ groupId: id, userId }))
            .unwrap()
            .then(() => {
                setIsGroupDropdown(false);
            })
            .catch((error) => {
                console.error("Ошибка удаления пользователя:", error);
            });
    };

    const handleLeaveGrorp = async () => {
        if(!id) return;
        
        await dispatch(groupLeave(id))
            .unwrap()
            .then(() => {
                navigate('/my-groups');
                setIsGroupDropdown(false);
            })
            .catch((error) => {
                console.error("Ошибка выхода из группы:", error);
            });
    }

    const handleDeleteGroup = async () => {
         if(!id) return;
        
        await dispatch(deleteGroup(id))
            .unwrap()
            .then(() => {
                navigate('/my-groups');
                setIsGroupDropdown(false);
            })
            .catch((error) => {
                console.error("Ошибка удаления группы:", error);
            });
    }

    const handleInviteMember = async () => {
        try {
            if(group.id){
                const res = await dispatch(inviteToGroup(group.id)).unwrap();
                if(res){
                    navigator.clipboard.writeText(res)
                    setIsCopy(true);
                    setIsGroupDropdown(false);
                    setTimeout(() => setIsCopy(false), 3000);
                }

                return
            }
        } catch (error) {
            console.error("Ошибка получения пригласительной ссылки:", error);
        }
        
    }

    const handleSaveChanges = () => {
        const direction = groupData.direction.label === group.facult ? '' : groupData.direction.label;
        const course = typeof groupData.course.label === "string" ? groupData.course.label.charAt(0) : '';
        const subgroup = typeof groupData.group.label === "string" ? groupData.group.label.charAt(0) : '';
    
        const data = {
            direction: direction,
            course: course,
            subgroup: subgroup,
        };

        if(data.direction || data.course || data.subgroup){
            dispatch(changeGroup({ id, data }))
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center gap-10 pt-[100px] box-border relative">
            <BackButton path='/my-groups'/>
            {isCopy && <div className='absolute top-5 w-300 h-30 bg-gray-100 py-2 px-3 box-border rounded-lg font-medium'>Пригласительная ссылка скопирована</div>}
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
                    <li onClick={handleDeleteGroup}>Удалить группу</li>
                    <li onClick={() => {
                        setIsEdit(true);
                        setIsGroupDropdown(false);
                    }}>Редактировать группу</li>
                    <li onClick={handleInviteMember}>Пригласить участника</li>
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
                            src={group.methodist && group.methodist.image}
                            alt="profile avatar"
                            className='rounded-[50%] w-12 h-12 object-cover'
                        />
                        <h2 className='text-3xl font-semibold'>{group.methodist && group.methodist.first_name} {group.methodist && group.methodist.last_name}</h2>
                    </div>
                    <Link to={group.methodist && `/user/${group.methodist.id}`}>
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
                    <li key={item.id} className='bg-gray-100 w-full h-fit py-2 px-3 box-border rounded-lg flex items-center justify-between'>
                        <h2 className='text-lg font-medium'>{item.last_name} {item.first_name}</h2>
                        {isTeacher ? myData.id !== item.id ? (
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
                        ) : undefined : myData.id !== item.id ? (
                            <div className='flex items-center gap-3'>
                                <Link to={`/user/${item.id}`}>
                                    <img 
                                        src={linkImg}
                                        width={20}
                                        height={20}
                                        alt="link to profile" 
                                    />
                                </Link>
                            </div>
                        ) : undefined}
                    </li>
                ))}
            </ul>
            <Modal isOpen={isEdit} onClose={() => setIsEdit(false)}>
                <div className="flex flex-col items-start gap-3 w-full h-full mt-5">
                    <h2 className="text-2xl font-medium text-center self-center mb-3">Изменение данных группы</h2>
                    <SelectDirection setFilterGroup={setGroupData} value={groupData.direction.label}/>
                    <SelectCourse setFilterGroup={setGroupData} value={groupData.course.label}/>
                    <SelectGroup setFilterGroup={setGroupData} value={groupData.group.label}/>
                    <button className="mt-4 w-full p-2 box-border text-center bg-blue-400 rounded-xl text-white"
                        onClick={() => {
                            setIsEdit(false);
                            handleSaveChanges();
                        }}
                    >Сохранить</button>
                </div>
            </Modal>
        </div>
    )
}
