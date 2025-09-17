import InputFile from "./../../components/common/fileDrop";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { createLecture } from '../../store/slices/lectures.js';
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { CrossIcon, FileIcon } from "../../assets/index.js";
import { BackButton } from "../../components/common/backButton.jsx";
import { useScreenWidth } from "../../providers/ScreenWidthProvider.jsx";

export default function FileLecture({ setTypeLecture, setLecture, lecture }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const file = files[0];
    const trueData = Boolean(lecture.file && lecture.title && lecture.group.length);

    const windowWidth = useScreenWidth();

    const formatFileSize = (size) => {
        return (size / (1024 * 1024)).toFixed(2) + " МБ";
    }

    const handleCreateLecture = () => {
        if(trueData){
            const groups = lecture?.group?.map(group => group.toString()) || [];    
            dispatch(createLecture({
                title: lecture.title,
                text: lecture.text,
                file: lecture.file,
                groups: groups
            }));
            navigate("/lectures");
        }
    }

    useEffect(() => {
        setLecture((prev) => ({
            ...prev,
            file: file
        }))
    }, [file, files, setLecture])

    return (
        <div className="w-full h-full flex flex-col justify-start gap-[40px] items-center pt-[100px] box-border relative">
            {windowWidth >= 640 && <BackButton onClick={() => setTypeLecture("")} />}    
            <div className="w-full flex justify-between items-center">
                <h1 className="text-5xl max-sm:text-3xl">Загрузите вашу лекцию</h1>
                <button 
                    className={classNames("py-1 px-3 box-border bg-black text-white text-center rounded-lg text-lg min-w-[130px]", {
                        'opacity-20': !trueData,
                        'opacity-1': trueData
                    })}
                    onClick={handleCreateLecture}
                    disabled={!trueData}
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
                        className="border-[1px] border-black rounded-xl px-4 py-8 box-border flex items-center gap-3 text-xl min-w-[300px] w-fit relative max-sm:w-fit max-sm:mt-20"
                        onClick={() => setTypeLecture('file')}
                    >
                       <FileIcon />
                        <div className="max-sm:max-w-[90%]">
                            <h2 className="font-semibold truncate">{file.name}</h2>
                            <h3 className="text-gray-400">{formatFileSize(file.size)}</h3>
                        </div>
                        <button className="absolute top-3 right-3" onClick={() => setFiles([])}>
                           <CrossIcon />
                        </button>
                    </div>
                ) : <InputFile setFiles={setFiles}/>}
            </div>
        </div>
    );
}
