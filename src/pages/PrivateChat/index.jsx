import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import classNames from "classnames";

import sendImg from '../../assets/icons/send.svg';
import menuImg from '../../assets/icons/menu.svg';
import avaImg from '../../assets/images/example-profile.png';

export const PrivateChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const socketRef = useRef(null);
    const token = localStorage.getItem("access_token");

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('id');

    useEffect(() => {
        if (!userId) return; 

        const url = `ws://127.0.0.1:8000/api/v1/chats/private-chats/${userId}?token=${token}`;
        const socket = new WebSocket(url);

        socketRef.current = socket;

        socket.onopen = () => {
            console.log("🔌 WebSocket connected");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [
                ...prev,
                { 
                    text: data.text, 
                    sender: "other",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                },
            ]);
        };

        socket.onclose = () => {
            console.log("❌ WebSocket disconnected");
        };

        return () => {
            socket.close();
        };
    }, [token, userId]); 

    const sendMessage = () => {
        if (!input.trim() || !socketRef.current) return;

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        socketRef.current.send(JSON.stringify({ 
            text: input,
            time: currentTime
        }));
        
        setMessages((prev) => [...prev, { 
            text: input, 
            sender: "you",
            time: currentTime
        }]);
        setInput("");
    };

    return (
        <div style={{height: 'calc(100vh - 60px)'}} className="w-full relative flex flex-col items-center justify-between gap-5 bg-gray-100 rounded-lg border border-gray-300 p-5 box-border">
            <div className="h-full w-full flex flex-col items-center justify-end">
                <div className="bg-white w-full absolute top-0 left-0 rounded-t-lg  h-fit py-3 px-5 box-border flex items-center justify-between border-b-2 border-gray-300">
                    <div className="flex items-center gap-3">
                        <img src={avaImg} width={48} height={48} alt="avatar" />
                        <div>
                            <h2 className="font-medium">User Userov</h2>
                            <h3 className="mt-[2px] text-gray-500">typing...</h3>
                        </div>
                    </div>
                    <ul className="flex items-center gap-2">
                        <li className="cursor-pointer">
                            <img src={menuImg} width={24} height={24} alt="menu" />
                        </li>
                    </ul>
                </div>
                <div style={{maxHeight: 'calc(100% - 96px)'}} className="mt-5 w-full h-full overflow-y-hidden flex flex-col gap-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={classNames("flex flex-col", {
                                'items-start': msg.sender !== "you", 
                                'items-end': msg.sender === "you", 
                            })}
                        >
                            <span className="text-xs text-gray-500 mb-1.5 font-medium">{msg.time}</span>
                            <h2 className={classNames("", {
                                'bg-gray-200 p-2 box-border rounded-lg': msg.sender !== "you", 
                                'bg-blue-500 text-white p-2 box-border rounded-lg': msg.sender === "you", 
                            })}>{msg.text}</h2>
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