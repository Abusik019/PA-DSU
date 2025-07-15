import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import classNames from "classnames";
import { message } from 'antd';
import { deletePrivateMessage, getMyRooms, getPrivateMessages, updatePrivateMessage } from "../../store/slices/chats";
import { formatDate, formatTime } from "../../utils/date";
import { MessageInput } from '../../components/layouts/MessageInput';
import { ContextMenu } from '../../components/layouts/ContextMenu';
import avaImg from '../../assets/images/example-profile.png';

export const PrivateChat = () => {
    const dispatch = useDispatch();
    const myId = useSelector(state => state.users.list?.id);
    const rooms = useSelector(state => state.chats.rooms || []);
    const token = localStorage.getItem("access_token");

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [messageMenu, setMessageMenu] = useState(null);
    const [editMessage, setEditMessage] = useState(null);

    const isEdit = Boolean(editMessage);

    const socketRef = useRef(null);
    const menuRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userID");

    const currentRoom = useMemo(() => {
        return rooms.find(room => room.members?.some(m => m.id === Number(userId)));
    }, [rooms, userId]);

    const opponent = useMemo(() => {
        return currentRoom?.members?.find(m => m.id !== myId);
    }, [currentRoom, myId]);

    const generateTempId = useCallback(() => {
        return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    useEffect(() => {
        console.log('messages: ', messages);
    }, [messages])

    useEffect(() => {
        if (!userId || !token) return;

        const socket = new WebSocket(`ws://127.0.0.1:8000/api/v1/chats/private-chats/${userId}?token=${token}`);
        socketRef.current = socket;

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log(data);
                
                if(data?.action){
                    switch(data.action){
                        case 'message_sent':
                            // Подтверждение отправки - заменяем временное сообщение на настоящее
                            setMessages(prev => prev.map(msg => 
                                msg.tempId === data.tempId 
                                    ? { 
                                        ...msg, 
                                        id: data.id,
                                        status: 'sent',
                                        tempId: undefined,
                                        created_at: data.created_at
                                    }
                                    : msg
                            ));
                            break;

                        case 'message_failed':
                            // Ошибка отправки - помечаем сообщение как неудачное
                            setMessages(prev => prev.map(msg => 
                                msg.tempId === data.tempId 
                                    ? { ...msg, status: 'failed' }
                                    : msg
                            ));
                            message.error("Не удалось отправить сообщение");
                            break;

                        case 'update_message':
                            setMessages(prev => {
                                const existingIndex = prev.findIndex(msg => msg.id === data.message_id);

                                if (existingIndex !== -1) {
                                    const updated = [...prev];
                                    updated[existingIndex] = { ...updated[existingIndex], text: data.text };
                                    return updated;
                                }

                                return prev;
                            });
                            break;

                        case 'delete_message':
                            setMessages(prev => prev.filter(msg => msg.id !== data.message_id));
                            break;

                        default:
                            console.log('Some actions with message');
                    }
                } else {
                    // Входящее сообщение от другого пользователя
                    if (data?.text) {
                        setMessages(prev => {
                            const exists = prev.find(msg => msg.id === data.id);
                            if (exists) {
                                return prev.map(msg =>
                                    msg.id == data.id ? { ...msg, text: data.text } : msg
                                );
                            }
                            const newMsg = {
                                id: data.id,
                                text: data.text,
                                sender: { id: Number(userId) },
                                created_at: data.created_at || new Date().toISOString(),
                                status: 'sent'
                            };
                            return [...prev, newMsg];
                        });
                    }
                }
            } catch (err) {
                console.error("Ошибка парсинга сообщения:", err);
            }
        };

        return () => socket.close();
    }, [userId, token]);

    useEffect(() => {
        dispatch(getMyRooms());

        if (userId) {
            dispatch(getPrivateMessages(userId))
                .unwrap()
                .then((data) => {
                    const sortData = [...data].sort(
                        (a, b) => new Date(a.created_at) - new Date(b.created_at)
                    );
                    // Добавляем статус для существующих сообщений
                    const messagesWithStatus = sortData.map(msg => ({
                        ...msg,
                        status: 'sent'
                    }));
                    setMessages(messagesWithStatus);
                })
                .catch((error) => {
                    console.error("Ошибка получения сообщений", error);
                });
        }
    }, [userId, dispatch]);

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

        const tempId = generateTempId();
        const newMessage = {
            id: tempId, // временный ID как основной
            tempId: tempId, // сохраняем временный ID для сопоставления
            text: input.trim(),
            sender: { id: myId },
            created_at: new Date().toISOString(),
            status: 'sending' // статус отправки
        };

        try {
            // Сразу добавляем сообщение в UI
            setMessages(prev => [...prev, newMessage]);

            // Отправляем через WebSocket с временным ID
            socketRef.current.send(JSON.stringify({ 
                text: input.trim(),
                tempId: tempId // включаем временный ID
            }));

            setInput("");
        } catch (err) {
            console.error("Ошибка отправки:", err);
            // Помечаем сообщение как неудачное
            setMessages(prev => prev.map(msg => 
                msg.tempId === tempId 
                    ? { ...msg, status: 'failed' }
                    : msg
            ));
            message.error("Не удалось отправить сообщение");
        }
    }, [input, myId, generateTempId]);

    // Функция для повторной отправки неудачного сообщения
    const retryMessage = useCallback((msg) => {
        if (!socketRef.current) return;

        setMessages(prev => prev.map(m => 
            m.tempId === msg.tempId 
                ? { ...m, status: 'sending' }
                : m
        ));

        try {
            socketRef.current.send(JSON.stringify({ 
                text: msg.text,
                tempId: msg.tempId
            }));
        } catch (err) {
            console.error("Ошибка повторной отправки:", err);
            setMessages(prev => prev.map(m => 
                m.tempId === msg.tempId 
                    ? { ...m, status: 'failed' }
                    : m
            ));
        }
    }, []);

    // Функция для удаления неудачного сообщения
    const removeFailedMessage = useCallback((tempId) => {
        setMessages(prev => prev.filter(msg => msg.tempId !== tempId));
    }, []);

    const shouldShowDate = useCallback(
        (index) => {
            if (index === 0) return true;

            const currentDate = formatDate(messages[index]?.created_at);
            const prevDate = formatDate(messages[index - 1]?.created_at);

            return currentDate !== prevDate;
        },
        [messages]
    );

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
        // Проверяем, что это не временное сообщение
        const msg = messages.find(m => m.id === msgID);
        if (msg?.status === 'sending' || msg?.tempId) {
            message.warning("Нельзя удалить сообщение, которое еще отправляется");
            return;
        }

        dispatch(deletePrivateMessage(msgID))
            .unwrap()
            .then(() => {
                setMessages((prev) => prev.filter((msg) => msg.id !== msgID));
            })
            .catch((error) => {
                console.log("Ошибка удаления сообщения: ", error);
            });
    }, [dispatch, messages]);

    const handleUpdateMessage = useCallback(() => {
        if (!editMessage?.text?.trim()) {
            message.error("Сообщение не может быть пустым");
            return;
        }

        // Проверяем, что это не временное сообщение
        const msg = messages.find(m => m.id === editMessage.id);
        if (msg?.status === 'sending' || msg?.tempId) {
            message.warning("Нельзя редактировать сообщение, которое еще отправляется");
            return;
        }

        dispatch(updatePrivateMessage({ id: editMessage.id, text: editMessage.text }))
            .unwrap()
            .then(() => {
                setEditMessage(null);
                setMessageMenu(null);
            })
            .catch((error) => {
                console.log("Ошибка изменения сообщения: ", error);
            });
    }, [dispatch, editMessage, messages]);

    // Функция для получения статуса сообщения
    const getMessageStatusIcon = useCallback((msg) => {
        if (msg.sender.id !== myId) return null;

        switch (msg.status) {
            case 'sending':
                return <span className="text-xs text-gray-400 ml-1">⏳</span>;
            case 'sent':
                return <span className="text-xs text-green-400 ml-1">✓</span>;
            case 'failed':
                return (
                    <div className="flex items-center gap-1 ml-1">
                        <span className="text-xs text-red-400">❌</span>
                        <button 
                            onClick={() => retryMessage(msg)}
                            className="text-xs text-blue-400 hover:underline"
                        >
                            Повторить
                        </button>
                        <button 
                            onClick={() => removeFailedMessage(msg.tempId)}
                            className="text-xs text-red-400 hover:underline"
                        >
                            Удалить
                        </button>
                    </div>
                );
            default:
                return null;
        }
    }, [myId, retryMessage, removeFailedMessage]);

    return (
        <div style={{ height: "calc(100vh - 60px)" }} className="w-full relative flex flex-col items-center justify-between gap-5 bg-gray-100 rounded-lg border border-gray-300 p-5 box-border">
            <div style={{ height: "calc(100% - 68px)" }} className="h-full w-full flex flex-col items-center justify-start">
                <div className="bg-white w-full absolute top-0 left-0 rounded-t-lg h-fit py-3 px-5 box-border flex items-center justify-between border-b-2 border-gray-300">
                    <div className="flex items-center gap-3">
                        <img src={opponent?.image || avaImg} alt="avatar" className="rounded-full w-12 h-12 object-cover" />
                        <div>
                            <h2 className="font-medium">{opponent?.first_name} {opponent?.last_name}</h2>
                            <h3 className="mt-[2px] text-gray-500">{opponent?.is_online ? "в сети" : "не в сети"}</h3>
                        </div>
                    </div>
                </div>
                <div onContextMenu={(e) => e.preventDefault()} ref={messagesContainerRef} className="mt-[80px] w-full overflow-y-auto flex flex-col gap-4 z-10">
                    {messages.length === 0 && <div className="text-gray-400 text-center mt-10">Сообщений пока нет</div>}
                    {messages.map((msg, index) => (
                        <div
                            key={msg.tempId || msg.id} // используем tempId для ключа, если есть
                            className={classNames("flex flex-col px-4 box-border relative", {
                                "items-start": msg.sender.id !== myId,
                                "items-end": msg.sender.id === myId,
                            })}
                        >
                            {shouldShowDate(index) && (
                                <div className="self-center text-gray-700">{formatDate(msg.created_at)}</div>
                            )}
                            {messageMenu && msg.id === messageMenu.id && (
                                <ContextMenu
                                    ref={menuRef}
                                    message={msg}
                                    position={{ x: messageMenu.x, y: messageMenu.y }}
                                    onClose={() => setMessageMenu(null)}
                                    onCopy={() => copyToClipboard(msg.text)}
                                    onEdit={() => setEditMessage({ id: msg.id, text: msg.text })}
                                    onDelete={() => handleDeleteMessage(msg.id)}
                                    isMyMessage={msg.sender.id === myId}
                                    chatType="private"
                                />
                            )}
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500 mb-1.5 font-medium">{formatTime(msg.created_at)}</span>
                                {getMessageStatusIcon(msg)}
                            </div>
                            <h2
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    // Не показываем меню для отправляющихся сообщений
                                    if (msg.status === 'sending' || msg.status === 'failed') return;
                                    
                                    setMessageMenu({
                                        id: msg.id,
                                        x: e.clientX,
                                        y: e.clientY,
                                    });
                                }}
                                className={classNames("relative", {
                                    "bg-gray-200 p-2 box-border rounded-lg": msg.sender.id !== myId,
                                    "bg-blue-500 text-white p-2 box-border rounded-lg": msg.sender.id === myId && msg.status === 'sent',
                                    "bg-blue-300 text-white p-2 box-border rounded-lg opacity-70": msg.sender.id === myId && msg.status === 'sending',
                                    "bg-red-200 text-red-800 p-2 box-border rounded-lg": msg.sender.id === myId && msg.status === 'failed',
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