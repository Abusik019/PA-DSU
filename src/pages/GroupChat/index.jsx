import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteGroupMessage, getGroupMessages, updateGroupMessage } from "../../store/slices/chats";
import { formatDate, formatTime, useOutsideClick } from "../../utils";
import { getAllGroups } from './../../store/slices/groups';
import { message } from "antd";
import { MessageInput } from "../../components/common/messageInput";
import classNames from "classnames";
import { ContextMenu } from "../../components/common/contextMenu";

export const GroupChat = () => {
    const dispatch = useDispatch();
    const myInfo = useSelector((state) => state.users.list);
    const myId = useSelector(state => state.users.list.id);
    const allGroups = useSelector((state) => state.groups.list);
    const token = localStorage.getItem("access_token");

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [messageMenu, setMessageMenu] = useState(null);
    const [editMessage, setEditMessage] = useState(null);

    const isEdit = !!editMessage;

    const socketRef = useRef(null);
    const menuRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const reconcileTimersRef = useRef(new Map());

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const groupID = queryParams.get('groupID');
    const activeGroup = Array.isArray(allGroups) && allGroups.length > 0 ? allGroups.find(group => group.id === Number(groupID)) : null;

    // Очистка таймеров при размонтировании
    useEffect(() => {
        return () => {
            reconcileTimersRef.current.forEach(t => clearTimeout(t));
            // eslint-disable-next-line react-hooks/exhaustive-deps
            reconcileTimersRef.current.clear();
        };
    }, []);

    // Подключение WS и обработка входящих кадров
    useEffect(() => {
        if (!groupID || !token) return;

        const socket = new WebSocket(`ws://localhost:8000/api/v1/chats/groups/${groupID}?token=${token}`);
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
                            setMessages(prev => prev.map(m =>
                                m.id === data.message_id ? { ...m, text: data.text } : m
                            ));
                            break;

                        case 'delete_message':
                            setMessages(prev => prev.filter(m => m.id !== data.message_id));
                            break;

                        default:
                            break;
                    }
                } else if (data?.text) {
                    setMessages(prev => {
                        const exists = prev.find(m => m.id === data.id || (data.tempId && m.tempId === data.tempId));
                        if (exists) {
                            const next = prev.map(m => {
                                if (m.id === data.id) {
                                    return {
                                        ...m,
                                        text: data.text,
                                        created_at: data.created_at || m.created_at,
                                        sender: data.sender || m.sender,
                                        status: 'sent'
                                    };
                                }
                                if (data.tempId && m.tempId === data.tempId) {
                                    return {
                                        ...m,
                                        id: data.id,
                                        tempId: undefined,
                                        text: data.text,
                                        created_at: data.created_at || m.created_at,
                                        sender: data.sender || m.sender,
                                        status: 'sent'
                                    };
                                }
                                return m;
                            });
                            if (data.tempId) clearReconcileTimer(data.tempId);
                            return next;
                        }

                        if (data.sender?.id === myId) return prev;

                        // Входящее сообщение от других участников
                        const newMsg = {
                            id: data.id,
                            text: data.text,
                            sender: data.sender,
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
    }, [token, groupID, myId]);

    // Ждем открытия сокета перед отправкой
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

    // Фолбэк: подтягиваем сообщения и подменяем temp → real
    const startReconcileTimer = useCallback((tempId, text) => {
        if (!groupID) return;
        const prevTimer = reconcileTimersRef.current.get(tempId);
        if (prevTimer) clearTimeout(prevTimer);

        const t = setTimeout(async () => {
            try {
                const data = await dispatch(getGroupMessages(groupID)).unwrap();
                const newestMine = [...data]
                    .filter(m => m.sender?.id === myId)
                    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                    .pop();

                if (newestMine && newestMine.text === text) {
                    setMessages(prev => prev.map(m =>
                        m.tempId === tempId ? { ...newestMine, status: 'sent' } : m
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
    }, [dispatch, groupID, myId]);

    // Загрузка групп и сообщений
    useEffect(() => {
        dispatch(getAllGroups());
        if (groupID) {
            dispatch(getGroupMessages(groupID))
                .unwrap()
                .then((data) => {
                    const sorted = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    setMessages(sorted.map(m => ({ ...m, status: 'sent' })));
                })
                .catch(() => {});
        }
    }, [dispatch, groupID]);

    // Автоскролл до последнего сообщения
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) container.scrollTop = container.scrollHeight;
    }, [messages]);

    useOutsideClick(menuRef, () => setMessageMenu(null));

    const sendMessage = useCallback(() => {
        if (!input.trim() || !socketRef.current) return;
        if (!myId) {
            message.warning("Подождите, профиль еще загружается");
            return;
        }

        const text = input.trim();
        const tempId = uuidv4();
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
                setMessages(prev => prev.map(m =>
                    m.tempId === tempId ? { ...m, status: 'failed' } : m
                ));
                message.error("Не удалось отправить сообщение");
            });
    }, [input, myId, waitForSocketOpen, startReconcileTimer]);

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
        setMessages(prev => prev.filter(m => m.tempId !== tempId));
    }, []);

    const shouldShowDate = (index) => {
        if (!messages[index] || index === 0) return true;
        const currentDate = formatDate(messages[index]?.created_at);
        const prevDate = formatDate(messages[index - 1]?.created_at);
        return currentDate !== prevDate;
    };

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

        dispatch(deleteGroupMessage(msgID))
            .unwrap()
            .then(() => {
                setMessages(prev => prev.filter(m => m.id !== msgID));
            })
            .catch(() => {
                message.error("Ошибка удаления сообщения");
            });
    }, [dispatch, messages]);

    const handleUpdateMessage = useCallback(() => {
        if (!editMessage || !editMessage.text?.trim()) {
            message.error("Сообщение не может быть пустым");
            return;
        }

        const msg = messages.find(m => m.id === editMessage.id);
        if (msg?.status === 'sending' || msg?.tempId) {
            message.warning("Нельзя редактировать сообщение, которое еще отправляется");
            return;
        }

        dispatch(updateGroupMessage({ id: editMessage.id, text: editMessage.text }))
            .unwrap()
            .then(() => {
                setMessages(prev => prev.map(m =>
                    m.id === editMessage.id ? { ...m, text: editMessage.text } : m
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
        <div style={{height: 'calc(100vh - 60px)'}} className="w-full relative flex flex-col items-center justify-between gap-5 bg-gray-100 rounded-lg border border-gray-300 p-5 box-border">
            <div style={{height: 'calc(100% - 68px)'}} className="h-full w-full flex flex-col items-center justify-start">
                <div className="bg-white w-full absolute top-0 left-0 rounded-t-lg  h-fit py-3 px-5 box-border flex items-center justify-between border-b-2 border-gray-300">
                    <div className="flex flex-col items-start">
                        <h2 className="font-medium text-xl">{activeGroup?.facult} {activeGroup?.course}к {activeGroup?.subgroup}г</h2>
                        <h3 className="mt-[2px] text-gray-500">Количество участников: {activeGroup?.members.length}</h3>
                    </div>
                </div>
                <div
                    onContextMenu={(e) => e.preventDefault()}
                    ref={messagesContainerRef}
                    className="mt-[80px] w-full overflow-y-auto flex flex-col gap-4"
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
                            className={classNames("flex flex-col px-4 box-border", {
                                'items-start': msg.sender?.id !== myId,
                                'items-end': msg.sender?.id === myId,
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
                                    onEdit={() => setEditMessage({ id: msg.id, text: msg.text })}
                                    onDelete={() => handleDeleteMessage(msg.id)}
                                    isMyMessage={msg.sender.id === myId}
                                    chatType="group"
                                />
                            )}
                            <div className={classNames("flex items-center gap-3 mt-6")}>
                                <img
                                    src={msg.sender.id === myId ? myInfo.image : msg.sender.image}
                                    alt="profile"
                                    className={classNames("rounded-full w-9 h-9 object-cover", {
                                        "order-2": msg.sender.id === myId,
                                        "order-0": msg.sender.id !== myId
                                    })}
                                />
                                <div className="order-1 relative">
                                    <div
                                        className={classNames(
                                            "absolute -top-6 flex items-center gap-1",
                                            {
                                                "right-0": msg.sender.id === myId,  
                                                "left-0": msg.sender.id !== myId, 
                                            }
                                        )}
                                    >
                                        <span className="text-xs text-gray-500 font-medium">
                                            {formatTime(msg.created_at)}
                                        </span>
                                        {msg.sender.id === myId && getMessageStatusIcon(msg)}
                                    </div>
                                    <h2
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            if (msg.status === 'sending' || msg.status === 'failed') return;
                                            setMessageMenu({
                                                id: msg.id,
                                                x: e.clientX,
                                                y: e.clientY
                                            });
                                        }}
                                        className={classNames("", {
                                            'bg-gray-200 p-2 box-border rounded-lg': msg.sender.id !== myId,
                                            'bg-blue-500 text-white p-2 box-border rounded-lg': msg.sender.id === myId && msg.status === 'sent',
                                            'bg-blue-300 text-white p-2 box-border rounded-lg opacity-70': msg.sender.id === myId && msg.status === 'sending',
                                            'bg-red-200 text-red-800 p-2 box-border rounded-lg': msg.sender.id === myId && msg.status === 'failed',
                                        })}
                                    >
                                        {msg.text}
                                    </h2>
                                </div>
                            </div>
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