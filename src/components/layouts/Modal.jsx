import { CloseButton } from "../common/CloseButton";

export default function Modal({ isOpen, onClose, defaultDeletion = true, children }) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[1000]" 
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl relative min-w-[300px] max-w-fit h-fit p-4 box-border flex items-center justify-center" 
                onClick={(e) => e.stopPropagation()}
            >
                {defaultDeletion && 
                    <CloseButton onClick={onClose}/>
                }
                {children}
            </div>
        </div>
    );
}
