import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deletePrivateMessage, getMyRooms, getPrivateMessages, updatePrivateMessage } from "../../store/slices/chats";
import { formatDate, formatTime } from "../../utils/date";
import { message } from 'antd';
import { MessageInput } from '../../components/layouts/MessageInput';
import { ContextMenu } from '../../components/layouts/ContextMenu';
import classNames from "classnames";
import avaImg from '../../assets/images/example-profile.png';

export const PrivateChat = () => {
    const dispatch = useDispatch();
    const myId = useSelector(state => state.users.list.id);
    const rooms = useSelector((state) => state.chats.rooms);
    const token = localStorage.getItem("access_token");

    const   [messages, setMessages] = useState([]),
            [input, setInput] = useState(""),
            [messageMenu, setMessageMenu] = useState(null),
            [editMessage, setEditMessage] = useState(null);


    const isEdit = !!editMessage;

    const   socketRef = useRef(null),
            menuRef = useRef(null),
            messagesContainerRef = useRef(null);
            
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userID');

    const currentRoom = useMemo(() => {
        return Array.isArray(rooms) && rooms.find(room =>
            room.members.some(m => m.id === Number(userId))
        );
    }, [rooms, userId]);
    
    const opponent = useMemo(() => {
        return currentRoom?.members.find(m => m.id !== myId);
    }, [currentRoom, myId]);

    useEffect(() => {
        if (!userId || !token) return;

        const socket = new WebSocket(`ws://localhost:8000/api/v1/chats/private-chats/${userId}?token=${token}`);
        socketRef.current = socket;

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data?.text) {
                    setMessages(prev => [...prev, {
                        id: data.id,
                        text: data.text,
                        sender: { id: Number(userId) },
                        created_at: new Date().toISOString()
                    }]);
                }
            } catch (err) {
                console.error("Ошибка парсинга:", err);
            }
        };

        return () => socket.close();
    }, [userId, token]);

    useEffect(() => {
        dispatch(getMyRooms());
        if(userId){
            dispatch(getPrivateMessages(userId))
                .unwrap()
                .then((data) => {
                    const sortData = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    setMessages(sortData)
                })
                .catch((error) => {
                    console.error("Ошибка получения сообщений", error);
                })
        }
    }, [userId])

    // Автоскролл до последнего сообщения
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

    const sendMessage = useCallback(() => {
        if (!input.trim() || !socketRef.current) return;

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        socketRef.current.send(JSON.stringify({ text: input, time: currentTime }));
        setInput(""); 
    }, [input]);

    const shouldShowDate = useCallback((index) => {
        if (!messages[index] || index === 0) return true;

        const currentDate = formatDate(messages[index]?.created_at);
        const prevDate = formatDate(messages[index - 1]?.created_at);

        return currentDate !== prevDate;
    }, [messages]);

    const copyToClipboard = useCallback((text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                message.success("Сообщение скопировано");
                setMessageMenu(null);
            })
            .catch((err) => {
                console.error("Ошибка при копировании: ", err);
            });
    }, []);

    const handleDeleteMessage = useCallback((msgID) => {
        dispatch(deletePrivateMessage(msgID))
            .unwrap()
            .then(() => {
                setMessages((prev) => prev.filter(msg => msg.id !== msgID))
            })
            .catch((error) => {
                console.log("Ошибка удаления сообщения: ", error);
            })
    }, [dispatch]);

    const handleUpdateMessage = useCallback(() => {
        if (!editMessage?.text?.trim()) {
            message.error("Сообщение не может быть пустым");
            return;
        }

        dispatch(updatePrivateMessage({ id: editMessage.id, text: editMessage.text }))
            .unwrap()
            .then(() => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === editMessage.id ? { ...msg, text: editMessage.text } : msg
                    )
                );
                setEditMessage(null);
                setMessageMenu(null);
            })
            .catch((error) => {
                console.log("Ошибка изменения сообщения: ", error);
            });
    }, [dispatch, editMessage]);

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
                </div>
                <div onContextMenu={(e) => e.preventDefault()} ref={messagesContainerRef} className="mt-[80px] w-full overflow-y-auto flex flex-col gap-4 z-10">
                    {messages.length === 0 && <div className="text-gray-400 text-center mt-10">Сообщений пока нет</div>}
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
                                 <ContextMenu
                                    message={msg}
                                    position={{ x: messageMenu.x, y: messageMenu.y }}
                                    onClose={() => setMessageMenu(null)}
                                    onCopy={() => copyToClipboard(msg.text)}
                                    onEdit={() => {
                                        setEditMessage({ id: msg.id, text: msg.text });
                                    }}
                                    onDelete={() => handleDeleteMessage(msg.id)}
                                    isMyMessage={msg.sender.id === myId}
                                    chatType="private"
                                />
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
            <MessageInput
                input={input}
                setInput={setInput}
                isEdit={isEdit}
                editMessage={editMessage}
                handleUpdateMessage={handleUpdateMessage}
                sendMessage={sendMessage}
                setEditMessage={setEditMessage}
            />
        </div>
    );
};