import { useRef, useEffect } from "react";
import sendImg from "../../assets/icons/send.svg";
import { CrossRedIcon, DoneIcon } from "../../assets";

export const MessageInput = ({
    input,
    setInput,
    isEdit,
    editMessage,
    handleUpdateMessage,
    sendMessage,
    setEditMessage
}) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEdit && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEdit]);

    return (
        <div className="w-full bg-white rounded-lg px-2 py-1 box-border flex items-center justify-between gap-2 border border-transparent focus-within:border-blue-500">
            <input
                ref={inputRef}
                value={editMessage ? editMessage.text : input}
                style={{ width: "calc(100% - 48px)" }}
                className="outline-none border-none appearance-none"
                placeholder="Введите текст..."
                onChange={(e) => {
                    if (editMessage) {
                        setEditMessage({ ...editMessage, text: e.target.value });
                    } else {
                        setInput(e.target.value);
                    }
                }}
                onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            if (editMessage) {
                                handleUpdateMessage();
                            } else {
                                sendMessage();
                            }
                        }
                    }}
                />
            {isEdit ? (
                <div className="flex items-center gap-2 p-2 box-border">
                    <button onClick={() => setEditMessage(null)}>
                        <CrossRedIcon />
                    </button>
                    <button onClick={handleUpdateMessage}>
                        <DoneIcon />
                    </button>
                </div>
            ) : (
                <button
                    onClick={sendMessage}
                    className="w-[40px] h-[40px] bg-purple-400 rounded-lg flex items-center justify-center"
                >
                    <img src={sendImg} width={24} height={24} alt="send" />
                </button>
            )}
        </div>
    );
};
