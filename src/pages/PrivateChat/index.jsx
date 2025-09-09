import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import classNames from "classnames";
import { message } from 'antd';
import { deletePrivateMessage, getMyRooms, getPrivateMessages, updatePrivateMessage } from "../../store/slices/chats";
import { formatDate, formatTime, useOutsideClick } from "../../utils";
import { MessageInput } from '../../components/common/messageInput';
import avaImg from '../../assets/images/example-profile.png';
import { ContextMenu } from "../../components/common/contextMenu";

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
    const reconcileTimersRef = useRef(new Map());

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
        return () => {
            reconcileTimersRef.current.forEach(t => clearTimeout(t));
            // eslint-disable-next-line react-hooks/exhaustive-deps
            reconcileTimersRef.current.clear();
        };
    }, []);

    useEffect(() => {
        if (!userId || !token) return;

        const socket = new WebSocket(`ws://127.0.0.1:8000/api/v1/chats/private-chats/${userId}?token=${token}`);
        socketRef.current = socket;

        const clearReconcileTimer = (tempId) => {
            const t = reconcileTimersRef.current.get(tempId);
            if (t) {
                clearTimeout(t);
                reconcileTimersRef.current.delete(tempId);
            }
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if (data?.action) {
                    switch (data.action) {
                        case 'message_sent':
                            setMessages(prev => prev.map(msg => 
                                msg.tempId && data.tempId && msg.tempId === data.tempId
                                    ? { 
                                        ...msg, 
                                        id: data.id,
                                        status: 'sent',
                                        tempId: undefined,
                                        created_at: data.created_at || msg.created_at,
                                        sender: data.sender || msg.sender
                                    }
                                    : msg
                            ));
                            if (data.tempId) clearReconcileTimer(data.tempId);
                            break;

                        case 'message_failed':
                            setMessages(prev => prev.map(msg => 
                                msg.tempId && data.tempId && msg.tempId === data.tempId
                                    ? { ...msg, status: 'failed' }
                                    : msg
                            ));
                            if (data.tempId) clearReconcileTimer(data.tempId);
                            message.error("Не удалось отправить сообщение");
                            break;

                        case 'update_message':
                            setMessages(prev => {
                                const idx = prev.findIndex(msg => msg.id === data.message_id);
                                if (idx !== -1) {
                                    const updated = [...prev];
                                    updated[idx] = { ...updated[idx], text: data.text };
                                    return updated;
                                }
                                return prev;
                            });
                            break;

                        case 'delete_message':
                            setMessages(prev => prev.filter(msg => msg.id !== data.message_id));
                            break;

                        default:
                            break;
                    }
                } else if (data?.text) {
                    setMessages(prev => {
                        const exists = prev.find(msg => msg.id === data.id || (data.tempId && msg.tempId === data.tempId));
                        if (exists) {
                            const next = prev.map(msg => {
                                if (msg.id === data.id) {
                                    return { 
                                        ...msg, 
                                        text: data.text, 
                                        created_at: data.created_at || msg.created_at,
                                        sender: data.sender || msg.sender,
                                        status: 'sent'
                                    };
                                }
                                if (data.tempId && msg.tempId === data.tempId) {
                                    return {
                                        ...msg,
                                        id: data.id,
                                        tempId: undefined,
                                        text: data.text,
                                        created_at: data.created_at || msg.created_at,
                                        sender: data.sender || msg.sender,
                                        status: 'sent'
                                    };
                                }
                                return msg;
                            });
                            if (data.tempId) clearReconcileTimer(data.tempId);
                            return next;
                        }

                        if (data.sender?.id === myId) return prev;

                        const newMsg = {
                            id: data.id,
                            text: data.text,
                            sender: data.sender || { id: Number(userId) },
                            created_at: data.created_at || new Date().toISOString(),
                            status: 'sent'
                        };
                        return [...prev, newMsg];
                    });
                }
            } catch {
                // ignore malformed frames
            }
        };

        return () => socket.close();
    }, [userId, token, myId]);

    const waitForSocketOpen = useCallback((ws, timeout = 3000) => {
        return new Promise((resolve, reject) => {
            if (!ws) return reject(new Error('No socket'));
            if (ws.readyState === WebSocket.OPEN) return resolve();
            const onOpen = () => { cleanup(); resolve(); };
            const onError = () => { cleanup(); reject(new Error('error')); };
            const onClose = () => { cleanup(); reject(new Error('closed')); };
            const timer = setTimeout(() => { cleanup(); reject(new Error('timeout')); }, timeout);
            const cleanup = () => {
                ws.removeEventListener('open', onOpen);
                ws.removeEventListener('error', onError);
                ws.removeEventListener('close', onClose);
                clearTimeout(timer);
            };
            ws.addEventListener('open', onOpen);
            ws.addEventListener('error', onError);
            ws.addEventListener('close', onClose);
        });
    }, []);

    // Фолбэк: через 1.5с подтягиваем реальные сообщения и подменяем temp → real
    const startReconcileTimer = useCallback((tempId, text) => {
        if (!userId) return;
        const prevTimer = reconcileTimersRef.current.get(tempId);
        if (prevTimer) clearTimeout(prevTimer);

        const t = setTimeout(async () => {
            try {
                const data = await dispatch(getPrivateMessages(userId)).unwrap();
                const newestMine = [...data]
                    .filter(m => m.sender?.id === myId)
                    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                    .pop();
                
                if (newestMine && newestMine.text === text) {
                    setMessages(prev => prev.map(m => 
                        m.tempId === tempId
                            ? { ...newestMine, status: 'sent' }
                            : m
                    ));
                }
            } finally {
                const t2 = reconcileTimersRef.current.get(tempId);
                if (t2) {
                    clearTimeout(t2);
                    reconcileTimersRef.current.delete(tempId);
                }
            }
        }, 1500);

        reconcileTimersRef.current.set(tempId, t);
    }, [dispatch, userId, myId]);

    useEffect(() => {
        dispatch(getMyRooms());

        if (userId) {
            dispatch(getPrivateMessages(userId))
                .unwrap()
                .then((data) => {
                    const sortData = [...data].sort(
                        (a, b) => new Date(a.created_at) - new Date(b.created_at)
                    );
                    const messagesWithStatus = sortData.map(msg => ({
                        ...msg,
                        status: 'sent'
                    }));
                    setMessages(messagesWithStatus);
                })
                .catch(() => {});
        }
    }, [userId, dispatch]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    useOutsideClick(menuRef, () => setMessageMenu(null));

    const sendMessage = useCallback(() => {
        if (!input.trim() || !socketRef.current) return;
        if (!myId) {
            message.warning("Подождите, профиль еще загружается");
            return;
        }

        const text = input.trim();
        const tempId = generateTempId();
        const newMessage = {
            id: tempId,
            tempId,
            text,
            sender: { id: myId },
            created_at: new Date().toISOString(),
            status: 'sending'
        };

        setMessages(prev => [...prev, newMessage]);

        waitForSocketOpen(socketRef.current, 3000)
            .then(() => {
                socketRef.current.send(JSON.stringify({ text, tempId }));
                startReconcileTimer(tempId, text);
                setInput("");
            })
            .catch(() => {
                setMessages(prev => prev.map(msg => 
                    msg.tempId === tempId ? { ...msg, status: 'failed' } : msg
                ));
                message.error("Не удалось отправить сообщение");
            });
    }, [input, myId, generateTempId, waitForSocketOpen, startReconcileTimer]);

    const retryMessage = useCallback((msg) => {
        if (!socketRef.current) return;

        setMessages(prev => prev.map(m => 
            m.tempId === msg.tempId ? { ...m, status: 'sending' } : m
        ));

        waitForSocketOpen(socketRef.current, 3000)
            .then(() => {
                socketRef.current.send(JSON.stringify({ text: msg.text, tempId: msg.tempId }));
                startReconcileTimer(msg.tempId, msg.text);
            })
            .catch(() => {
                setMessages(prev => prev.map(m => 
                    m.tempId === msg.tempId ? { ...m, status: 'failed' } : m
                ));
            });
    }, [waitForSocketOpen, startReconcileTimer]);

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
            .catch(() => {});
    }, []);

    const handleDeleteMessage = useCallback((msgID) => {
        const msg = messages.find(m => m.id === msgID);
        if (msg?.status === 'sending' || msg?.tempId) {
            message.warning("Нельзя удалить сообщение, которое еще отправляется");
            return;
        }

        dispatch(deletePrivateMessage(msgID))
            .unwrap()
            .then(() => {
                setMessages((prev) => prev.filter((m) => m.id !== msgID));
            })
            .catch(() => {
                message.error("Ошибка удаления сообщения");
            });
    }, [dispatch, messages]);

    const handleUpdateMessage = useCallback(() => {
        if (!editMessage?.text?.trim()) {
            message.error("Сообщение не может быть пустым");
            return;
        }

        const msg = messages.find(m => m.id === editMessage.id);
        if (msg?.status === 'sending' || msg?.tempId) {
            message.warning("Нельзя редактировать сообщение, которое еще отправляется");
            return;
        }

        dispatch(updatePrivateMessage({ id: editMessage.id, text: editMessage.text }))
            .unwrap()
            .then((updated) => {
                setMessages(prev => prev.map(m => 
                    m.id === updated.id ? { ...m, text: updated.text } : m
                ));
                setEditMessage(null);
                setMessageMenu(null);
            })
            .catch(() => {
                message.error("Ошибка изменения сообщения");
            });
    }, [dispatch, editMessage, messages]);

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
                <div 
                    onContextMenu={(e) => e.preventDefault()} 
                    ref={messagesContainerRef} 
                    className="mt-[80px] w-full overflow-y-auto flex flex-col gap-4 z-10"  
                    style={{
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        WebkitScrollbar: { display: 'none' }
                    }}
                >
                    {messages.length === 0 && <div className="text-gray-400 text-center mt-10">Сообщений пока нет</div>}
                    {messages.map((msg, index) => (
                        <div
                            key={msg.tempId || msg.id}
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