import { useEffect, useState } from "react"
import { PrivateChat } from "../PrivateChat";
import { useDispatch, useSelector } from 'react-redux';
import { getMyRooms } from "../../store/slices/chats";
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Chat() {
    const dispatch = useDispatch();
    const rooms = useSelector((state) => state.chats.rooms);

    const navigate =  useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('id');

    const   [chatType, setChatType] = useState('personal'),
            [id, setID] = useState(12);


    useEffect(() => {
        dispatch(getMyRooms())
    }, []);

    const handleRoomClick = (roomId) => {
        navigate(`?id=${roomId}`);
    }

    console.log(rooms);

    return (
        <div className="w-full flex items-start gap-20">
            <div className="w-[70%]">
                {chatType === 'personal' && <PrivateChat />}
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
                    {rooms.length > 0 && rooms.map(item => (
                        <li onClick={() => handleRoomClick(item?.members[1].id)} key={item.id} className={classNames("w-full flex items-center gap-3 p-2 box-border rounded-lg cursor-pointer", {
                            "bg-gray-100": item?.members[1].id === Number(userId)
                        })}>
                            <img src={item?.members[1].image} width={48} height={48} alt="avatar" className="rounded-full" />
                            <div className="h-full flex flex-col justify-between gap-1">
                                <h2 className="font-medium">{item?.members[1].first_name} {item?.members[1].last_name}</h2>
                                <h3 className="text-gray-500">{item?.last_message?.text}</h3>
                            </div>
                        </li>
                    ))}
                </ul>   
            </aside>
        </div>
    )
}
