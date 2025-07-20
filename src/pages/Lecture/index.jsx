import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLecture, updateLecture } from "./../../store/slices/lectures";
import MDEditor from '@uiw/react-md-editor';
import InputFile from "./../../components/common/fileDrop";
import classNames from "classnames";
import { CrossIcon, EyeIcon, FileIcon, PenIcon } from "../../assets";
import { BackButton } from "../../components/common/BackButton";
import { formatDate } from "../../utils";

export default function Lecture() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const lecture = useSelector((state) => state.lectures.lecture);
    const isFileAvailable = lecture?.file && !lecture.file.includes("/None");
    const myInfo = useSelector((state) => state.users.list);
    const member_groups = myInfo.member_groups;
    const   [fileInfo, setFileInfo] = useState(null),
            [isEdit, setIsEdit] = useState(false),
            [value, setValue] = useState(""),
            [isDisabledBtn, setIsDisabledBtn] = useState(true),
            [files, setFiles] = useState([lecture.file]),
            [updatedLecture, setUpdatedLecture] = useState({
                title: '',
                groups: [],
                file: '',
                text: lecture.text
    });

    useEffect(() => {
        const isTextOrFileAvailable = Boolean(updatedLecture.text) || Boolean(updatedLecture.file);
        const isTitleAvailable = Boolean(updatedLecture.title);
        const isGroupsAvailable = updatedLecture.groups.length > 0;

        setIsDisabledBtn(!(isTextOrFileAvailable && isTitleAvailable && isGroupsAvailable));
    }, [updatedLecture]);    

    useEffect(() => {
        dispatch(getLecture(id));
    }, [dispatch, id]);

    useEffect(() => {
        setUpdatedLecture((prev) => ({
            ...prev,
            title: lecture.title,
            groups: lecture.groups || [],
            file: files[files.length - 1]
        }))
        setValue(lecture.text);
    }, [lecture, files]);

    useEffect(() => {
        setUpdatedLecture((prev) => ({
            ...prev,
            text: value
        }));
    }, [value])

    const fetchFile = useCallback(async () => {
        const url = lecture.file;
    
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const fileName = url.split("/").pop().replace(/^\d{14}_/, "");
    
            const file = new File([blob], fileName, { type: blob.type });
     
            setUpdatedLecture((prev) => ({
                ...prev,
                file: file
            }));
            setFileInfo(file);
            return file;
        } catch (error) {
            console.error("Ошибка при загрузке файла:", error);
        }
    }, [lecture.file])

    useEffect(() => {
        if (isFileAvailable) {
            fetchFile()
        }
    }, [fetchFile, isFileAvailable, lecture]);

    const formatFileSize = (bytes) => {
        if (!bytes) return "0 B";
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
    };

    const handleGroupClick = (group) => {
        setUpdatedLecture((prev) => {
            const exists = prev.groups.some((g) => g.id === group.id);
            return {
                ...prev,
                groups: exists ? prev.groups.filter((g) => g.id !== group.id) : [...prev.groups, group]
            };
        });
    };

    const handleUpdateLecture = async () => {
        const groups = updatedLecture.groups.map(item => item.id).map(group => group.toString()) || []; 
        const lecture = {
            title: updatedLecture.title,
            file: updatedLecture.file,
            text: updatedLecture.text,
            groups: groups
        };

        await dispatch(updateLecture({id, lecture})).unwrap();
        navigate("/lectures");
    }

    return (
        <>   
            {!isEdit ? (
                <div className="w-full h-fit flex flex-col justify-start gap-[40px] items-center pt-[100px] box-border relative">
                    <BackButton />
                    {myInfo.is_teacher && 
                        <button className="absolute right-0 top-[20px]" onClick={() => setIsEdit(true)}>
                            <PenIcon width={24} height={24} />
                        </button>
                    }
                    <div className="w-full flex flex-col items-center">
                        <h5 className="text-gray-400 font-medium">
                            {lecture && formatDate(lecture.created_at)}
                        </h5>
                        <h2 className="text-black font-medium text-4xl max-w-[60%] text-center">
                            {lecture && lecture.title}
                        </h2>
                    </div>
                    <div
                        className="w-full h-fit flex items-start justify-center"
                    >
                        {isFileAvailable ? (
                            <div
                                className="border-[1px] border-black rounded-xl px-4 py-8 box-border flex items-center gap-3 text-xl min-w-[300px] w-fit relative mt-[200px] pr-[60px]"
                            >
                                <FileIcon />
                                <div>
                                    <h2 className="font-semibold">{fileInfo?.name}</h2>
                                    <h3 className="text-gray-400">{formatFileSize(fileInfo?.size)}</h3>
                                </div>
                                <a href={lecture?.file} download={fileInfo?.name} target="_blank" className="absolute bottom-3 right-4 cursor-pointer">
                                   <EyeIcon />
                                </a>
                            </div>
                        ) : (
                            <div className="container markdown h-full" data-color-mode='light'>
                                <MDEditor.Markdown source={lecture?.text} className="border border-gray-400 h-full w-[100%] p-3 box-border rounded-lg"/>
                            </div>      
                        )}
                    </div>
                </div>
            ) : (
                <div className="w-full h-full flex flex-col justify-start gap-[40px] items-center pt-[100px] box-border relative">
                    <BackButton onClick={() => setIsEdit(false)} />
                    <button 
                        className={classNames("py-1 px-3 box-border bg-black text-white text-center rounded-lg text-lg min-w-[130px] self-end", {
                            "opacity-20 cursor-default": isDisabledBtn,
                            "opacity-1 cursor-pointer": !isDisabledBtn
                        })}
                        disabled={isDisabledBtn}
                        onClick={handleUpdateLecture}
                    >Сохранить</button>
                    <div className="w-full flex flex-col items-center"> 
                        <input 
                            type="text" 
                            value={updatedLecture.title} 
                            onInput={(e) => setUpdatedLecture((prev) => ({
                                ...prev,
                                title: e.target.value
                            }))}
                            className="w-[400px] h-[50px] border-gray-400 border-[1px] rounded-xl p-2 box-border appearance-none outline-none"
                            placeholder="Название лекции"
                        />
                    </div>
                    <div
                        className="w-full h-full flex flex-col gap-10 items-center justify-center"
                    >
                        {isFileAvailable ? (
                            updatedLecture.file ? 
                                <div
                                    className="border-[1px] border-black rounded-xl px-4 py-8 box-border flex items-center gap-3 text-xl min-w-[300px] w-fit relative pr-[60px]"
                                >
                                    <FileIcon />
                                    <div>
                                        <h2 className="font-semibold">{updatedLecture.file?.name}</h2>
                                        <h3 className="text-gray-400">{formatFileSize(updatedLecture.file?.size)}</h3>
                                    </div>
                                    <button className="absolute top-3 right-4" onClick={() => setUpdatedLecture((prev) => ({
                                        ...prev,
                                        file: ''
                                    }))}>
                                        <CrossIcon />
                                    </button>
                                </div>
                                : <InputFile setFiles={setFiles}/>
                        ) : (
                            <div className="container markdown h-[50%] flex flex-row gap-2" data-color-mode='light'>
                                <div className="border border-black h-full w-[60%] rounded-lg overflow-hidden">
                                    <MDEditor
                                        value={value}
                                        onChange={setValue}
                                        preview="edit"
                                        className="w-full"
                                        height={'100%'}
                                    />
                                </div>
                                <MDEditor.Markdown source={value} className="border border-black h-full w-[40%] p-3 box-border rounded-lg"/>
                            </div>      
                        )}
                        <ul className='groupList w-[400px] h-fit rounded-lg shadow-xl max-h-[240px] overflow-y-auto'>
                            {member_groups.length && member_groups.map((item) => (
                                <li 
                                    key={item.id}
                                    className={classNames('p-2 box-border text-center font-medium cursor-pointer', {
                                        'bg-blue-400 text-white': updatedLecture.groups.some((g) => g.id === item.id),
                                        'bg-white text-black': !updatedLecture.groups.some((g) => g.id === item.id),
                                    })}
                                    onClick={() => handleGroupClick(item)}
                                >
                                    {item.facult} {item.course} курс {item.subgroup} группа
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>  
            )}
        </>
    );
}
