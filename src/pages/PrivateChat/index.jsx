import styles from './style.module.scss';
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deletePrivateMessage, getMyRooms, getPrivateMessages } from "../../store/slices/chats";
import { formatDate, formatTime } from "../../utils/date";
import { message } from 'antd';
import classNames from "classnames";

import sendImg from '../../assets/icons/send.svg';
import menuImg from '../../assets/icons/menu.svg';
import avaImg from '../../assets/images/example-profile.png';

export const PrivateChat = () => {
    const dispatch = useDispatch();
    const myId = useSelector(state => state.users.list.id);
    const rooms = useSelector((state) => state.chats.rooms);
    const token = localStorage.getItem("access_token");

    const   [messages, setMessages] = useState([]),
            [input, setInput] = useState(""),
            [messageMenu, setMessageMenu] = useState(null);

    const   socketRef = useRef(null),
            menuRef = useRef(null),
            messagesContainerRef = useRef(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userID');

    const currentRoom = Array.isArray(rooms) && rooms.find(room => 
        room.members.some(m => m.id === Number(userId))
    );
    const opponent = currentRoom?.members.find(m => m.id !== myId);

    console.log(messages);

    useEffect(() => {
        if (!userId) return; 

        const url = `ws://localhost:8000/api/v1/chats/private-chats/${userId}?token=${token}`;
        const socket = new WebSocket(url);

        socketRef.current = socket;

        socket.onopen = () => {
            console.log("🔌 WebSocket connected");
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (!data?.text) return;
        
                const now = new Date();
                const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
                setMessages((prev) => [
                    ...prev,
                    { 
                        id: Date.now(), 
                        text: data.text,
                        sender: { id: Number(userId) },
                        created_at: formattedDate
                    },
                ]);
            } catch (error) {
                console.error("Ошибка парсинга WebSocket-сообщения:", error);
            }
        };
        

        socket.onclose = () => {
            console.log("❌ WebSocket disconnected");
        };

        return () => {
            socket.close();
        };
    }, [token, userId]); 

    useEffect(() => {
        dispatch(getMyRooms());
        dispatch(getPrivateMessages(userId))
            .unwrap()
            .then((data) => {
                const sortData = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                setMessages([...sortData])
            })
            .catch((error) => {
                console.error("Ошибка получения сообщений", error);
            })
    }, [userId])

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMessageMenu(null);
            }
        };
    
        if (messageMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [messageMenu]);

    const sendMessage = () => {
        if (!input.trim() || !socketRef.current) return;
    
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
        socketRef.current.send(JSON.stringify({ 
            text: input,
            time: currentTime
        }));
    
        setInput(""); 

        dispatch(getPrivateMessages(userId))
            .unwrap()
            .then((data) => {
                const sorted = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                setMessages(sorted);
            });
    };

    const shouldShowDate = (index) => {
        if (!messages[index] || index === 0) return true;
    
        const currentDate = formatDate(messages[index]?.created_at);
        const prevDate = formatDate(messages[index - 1]?.created_at);
    
        return currentDate !== prevDate;
    };    

    const copyToClipboard = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                console.log("Текст скопирован в буфер обмена");
                message.success("Сообщение скопировано");
                setMessageMenu(null);
            })
            .catch((err) => {
                console.error("Ошибка при копировании: ", err);
            });
    };

    const handleDeleteMessage = (msgID) => {
        dispatch(deletePrivateMessage(msgID))
            .unwrap()
            .then(() => {
                setMessages((prev) => prev.filter(msg => msg.id !== msgID))
            })
            .catch((error) => {
                console.log("Ошибка удаления сообщений", error);
            })
    }

    return (
        <div style={{height: 'calc(100vh - 60px)'}} className="w-full relative flex flex-col items-center justify-between gap-5 bg-gray-100 rounded-lg border border-gray-300 p-5 box-border">
            <div style={{height: 'calc(100% - 68px)'}} className="h-full w-full flex flex-col items-center justify-start">
                <div className="bg-white w-full absolute top-0 left-0 rounded-t-lg  h-fit py-3 px-5 box-border flex items-center justify-between border-b-2 border-gray-300">
                    <div className="flex items-center gap-3">
                        <img src={opponent?.image || avaImg} width={48} height={48} alt="avatar" className="rounded-full"/>
                        <div>
                            <h2 className="font-medium">{opponent?.first_name} {opponent?.last_name}</h2>
                            <h3 className="mt-[2px] text-gray-500">{opponent?.is_online ? 'в сети' : 'не в сети'}</h3>
                        </div>
                    </div>
                    {/* <ul className="flex items-center gap-2">
                        <li className="cursor-pointer">
                            <img src={menuImg} width={24} height={24} alt="menu" />
                        </li>
                    </ul> */}
                </div>
                <div onContextMenu={(e) => e.preventDefault()} ref={messagesContainerRef} className="mt-[80px] w-full overflow-y-auto flex flex-col gap-4 z-10">
                    {messages.map((msg, index) => (
                        <div
                            key={msg.id}
                            className={classNames("flex flex-col px-4 box-border relative", {
                                'items-start': msg.sender.id !== myId, 
                                'items-end': msg.sender.id === myId, 
                            })}
                        >
                            {shouldShowDate(index) && (
                                <div className="self-center text-gray-700">{formatDate(msg.created_at)}</div>
                            )}
                            {msg.id === messageMenu?.id && (
                                <ul
                                    ref={menuRef}
                                    className="h-fit w-fit rounded-lg bg-white shadow-lg z-[999] fixed"
                                    style={{
                                        top: messageMenu?.y,
                                        left: messageMenu?.x,
                                    }}
                                >
                                    {msg.sender.id === myId && <li className={`${styles.action} ${styles.edit}`}>Изменить</li>}
                                    <li className={`${styles.action} ${styles.copy}`} onClick={() => copyToClipboard(msg.text)}>Копировать</li>
                                    {msg.sender.id === myId && <li className={`${styles.action} ${styles.delete}`} onClick={() => handleDeleteMessage(msg.id)}>Удалить</li>}
                                </ul>
                            )}
                            <span className="text-xs text-gray-500 mb-1.5 font-medium">{formatTime(msg.created_at)}</span>
                            <h2 
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    setMessageMenu({
                                        id: msg.id,
                                        x: e.clientX,
                                        y: e.clientY
                                    });                                    
                                    console.log("Правый клик по сообщению:", msg);
                                }}
                                className={classNames("", {
                                    'bg-gray-200 p-2 box-border rounded-lg': msg.sender.id !== myId, 
                                    'bg-blue-500 text-white p-2 box-border rounded-lg': msg.sender.id === myId, 
                                })}
                            >
                                {msg.text}
                            </h2>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full bg-white rounded-lg px-2 py-1 box-border flex items-center justify-between gap-2">
                <input
                    value={input}
                    style={{width: 'calc(100% - 48px)'}}
                    className="outline-none border-none appearance-none"
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Введите сообщение..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage} className="w-[40px] h-[40px] bg-purple-400 rounded-lg flex items-center justify-center">
                    <img src={sendImg} width={24} height={24} alt="send" />
                </button>
            </div>
        </div>
    );
};