import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteGroupMessage, getGroupMessages, updateGroupMessage } from "../../store/slices/chats";
import { formatDate, formatTime } from "../../utils/date";
import { getAllGroups } from './../../store/slices/groups';
import { message } from "antd";
import { MessageInput } from "../../components/common/MessageInput";
import classNames from "classnames";
import { ContextMenu } from "../../components/common/ContextMenu";

export const GroupChat = () => {
    const dispatch = useDispatch();
    const myInfo = useSelector((state) => state.users.list);
    const myId = useSelector(state => state.users.list.id);
    const allGroups = useSelector((state) => state.groups.list);
    const token = localStorage.getItem("access_token");

    const   [messages, setMessages] = useState([]),
            [input, setInput] = useState(""),
            [messageMenu, setMessageMenu] = useState(null),
            [editMessage, setEditMessage] = useState(null);

    const isEdit = !!editMessage;   

    console.log(myInfo);

    const   socketRef = useRef(null),
            menuRef = useRef(null),
            messagesContainerRef = useRef(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const groupID = queryParams.get('groupID');
    const activeGroup = Array.isArray(allGroups) && allGroups.length > 0 ? allGroups.find(group => group.id === Number(groupID)) : null;

    useEffect(() => {
        if (!groupID || !token) return;

        const socket = new WebSocket(`ws://localhost:8000/api/v1/chats/groups/${groupID}?token=${token}`);
        socketRef.current = socket;

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data?.text) {
                    setMessages(prev => {
                        const pendingIndex = prev.findIndex(msg => msg.pending && msg.text === data.text && msg.sender.id === data.sender.id);

                        if (pendingIndex !== -1) {
                            const updated = [...prev];
                            updated[pendingIndex] = {
                                ...updated[pendingIndex],
                                id: data.id,          
                                pending: false,         
                                created_at: data.created_at || new Date().toISOString(),
                            };
                            return updated;
                        }

                        return [...prev, {
                            id: data.id,
                            text: data.text,
                            sender: data.sender,
                            created_at: data.created_at || new Date().toISOString(),
                        }];
                    });
                }
            } catch (err) {
                console.error("Ошибка парсинга:", err);
            }
        };

        return () => socket.close();
    }, [token, groupID]); 

    useEffect(() => {
        dispatch(getAllGroups());
        if(groupID){
            dispatch(getGroupMessages(groupID))
            .unwrap()
            .then((data) => {
                const sortData = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                setMessages(sortData)
            })
            .catch((error) => {
                console.error("Ошибка получения сообщений", error);
            })
        }
    }, [dispatch, groupID])

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
      if (!input.trim() || !socketRef.current || !myId) return;

        const tempId = uuidv4();
        const newMessage = {
            id: tempId,
            text: input,
            sender: { id: myId },
            created_at: new Date().toISOString(),
            pending: true, 
        };

        socketRef.current.send(JSON.stringify({ text: input }));

        setMessages(prev => [...prev, newMessage]);
        setInput(""); 
    }, [input, myId]);

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
            .catch((err) => {
                console.error("Ошибка при копировании: ", err);
            });
    }, []);

    const handleDeleteMessage = useCallback((msgID) => {
        dispatch(deleteGroupMessage(msgID))
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

        dispatch(updateGroupMessage({ id: editMessage.id, text: editMessage.text }))
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
                            key={msg.id}
                            className={classNames("flex flex-col px-4 box-border", {
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
                                    chatType="group"
                                />
                            )}
                            <div className={classNames("flex items-center gap-3 mt-6")}>
                                <img src={msg.sender.id === myId ? myInfo.image : msg.sender.image} alt="profile photo" className={classNames("rounded-full w-9 h-9 object-cover", {
                                    "order-2": msg.sender.id === myId,
                                    "order-0": msg.sender.id !== myId
                                })} />
                                <div className="order-1 relative">
                                    <span className="absolute top-[-20px] text-xs text-gray-500 mb-1.5 font-medium">{formatTime(msg.created_at)}</span>
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