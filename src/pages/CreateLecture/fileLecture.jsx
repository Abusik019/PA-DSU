import "./style.css";
import InputFile from "./../../components/common/fileDrop";
import fileImg from '../../assets/icons/file.svg';
import crossImg from '../../assets/icons/cross.svg';
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { createLecture } from '../../store/slices/lectures.js';

export default function FileLecture({ setTypeLecture, setLecture, lecture }) {
    const dispatch = useDispatch();
    const [files, setFiles] = useState([]);
    const file = files[0];

    const formatFileSize = (size) => {
        return (size / (1024 * 1024)).toFixed(2) + " МБ";
    }

    const handleCreateLecture = () => {
        setLecture((prev) => ({
            ...prev,
            file: file
        }));
        dispatch(createLecture());
    }

    return (
        <div className="w-full h-full flex flex-col justify-start gap-[40px] items-center pt-[100px] box-border relative">
            <button className="backLink" onClick={() => setTypeLecture("")}>
                Назад
            </button>
            <div className="w-full flex justify-between items-center">
                <h1 className="text-5xl">Загрузите вашу лекцию</h1>
                <button 
                    className="py-1 px-3 box-border bg-blue-500 text-white text-center rounded-lg text-lg"
                    onClick={handleCreateLecture}
                >
                    Создать
                </button>
            </div>
            <div
                style={{ height: "calc(100% - 164px)" }}
                className="w-full overflow-y-auto flex items-center justify-center"
            >
                {files.length ? (
                    <div 
                        className="border-[1px] border-black rounded-xl px-4 py-8 box-border flex items-center gap-3 text-xl min-w-[300px] w-fit relative"
                        onClick={() => setTypeLecture('file')}
                    >
                        <img 
                            src={fileImg}
                            width={48}
                            height={48}
                            alt="file"
                        />
                        <div>
                            <h2 className="font-semibold">{file.name}</h2>
                            <h3 className="text-gray-400">{formatFileSize(file.size)}</h3>
                        </div>
                        <button className="absolute top-3 right-3" onClick={() => setFiles([])}>
                            <img 
                                src={crossImg}
                                width={20}
                                height={20} 
                                alt="delete file" 
                            />
                        </button>
                    </div>
                ) : <InputFile setFiles={setFiles}/>}
            </div>
        </div>
    );
}
