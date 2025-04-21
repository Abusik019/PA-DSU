import { useEffect, useState } from "react"
import { PrivateChat } from "../PrivateChat";
import { useDispatch, useSelector } from 'react-redux';
import { getMyRooms } from "../../store/slices/chats";
import { useLocation, useNavigate } from 'react-router-dom';
import { getMyInfo } from './../../store/slices/users';
import classNames from 'classnames';

import messageImg from '../../assets/icons/message.svg';

export default function Chat() {
    const dispatch = useDispatch();
    const myId = useSelector(state => state.users.list.id);
    const rooms = useSelector((state) => state.chats.rooms);

    const navigate =  useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('id');

    const currentRoom = Array.isArray(rooms) && rooms.find(room => 
        room.members.some(m => m.id === Number(userId))
    );
    const opponent = currentRoom?.members.find(m => m.id !== myId);

    const [chatType, setChatType] = useState('personal');

    useEffect(() => {
        dispatch(getMyRooms());
        dispatch(getMyInfo());
    }, [userId]);

    return (
        <div className="w-full flex items-start gap-20">
            <div className="w-[70%]">
                {userId ? chatType === 'personal' && <PrivateChat /> : (
                    <div style={{height: 'calc(100vh - 30px)'}} className="w-full flex items-center justify-center">
                        <div className="border border-gray-300 rounded-xl p-10 box-border flex flex-col items-center">
                            <img src={messageImg} width={128} height={128} alt="message" />
                            <h2 className="text-3xl font-semibold mt-5">Добро пожаловать в чаты</h2>
                            <p className="text-center mt-2 text-[#00000080] font-medium text-xl">Выберите контакт, чтобы<br />начать общение</p>
                        </div>
                    </div>
                )}
            </div>
            <aside style={{maxHeight: 'calc(100vh - 60px)'}} className="w-[30%] overflow-y-auto border border-gray-300 rounded-xl h-fit p-5 box-border">
                <h2 className="text-center font-medium text-xl">Чаты</h2>
                <div className="mt-5 w-full bg-gray-200 rounded-3xl p-2 box-border">
                    <button className={classNames("w-[50%] py-2 box-border rounded-3xl font-medium", {
                        'bg-white text-blue-600': chatType === 'personal',
                        'bg-transparent text-gray-500': chatType !== 'personal',
                    })} onClick={() => setChatType('personal')}>Личные</button>
                    <button className={classNames("w-[50%] py-2 box-border rounded-3xl font-medium", {
                        'bg-white text-blue-600': chatType === 'group',
                        'bg-transparent text-gray-500': chatType !== 'group',
                    })} onClick={() => setChatType('group')}>Групповые</button>
                </div>
                <ul className="mt-10 w-full flex flex-col items-center gap-4">
                    {rooms?.length > 0 && rooms.map(room => room.members.map(member => {
                        if(member.id !== myId){
                            return (
                                <li onClick={() => navigate(`?id=${member.id}`)} key={member.id} className={classNames("w-full flex items-center gap-3 p-2 box-border rounded-lg cursor-pointer", {
                                    "bg-gray-100": member.id === Number(userId)
                                })}>
                                    <img src={member?.image} width={48} height={48} alt="avatar" className="rounded-full" />
                                    <div className="h-full flex flex-col justify-between gap-1">
                                        <h2 className="font-medium">{member.first_name} {member.last_name}</h2>
                                        <h3 className="text-gray-500">{room.last_message ? room.last_message.text : ''}</h3>
                                    </div>
                                </li>
                            )
                        }
                    }))}
                </ul>   
            </aside>
        </div>
    )
}
