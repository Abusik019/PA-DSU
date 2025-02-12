import './style.css';
import TextExample from './../../components/layouts/TextExample';
import { useEffect, useState } from 'react';
import { createLecture } from '../../store/slices/lectures';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function TextLecture({ setTypeLecture, lecture, setLecture }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [text, setText] = useState("");
    const trueData = Boolean(lecture.text && lecture.title && lecture.group.length);

    const handleCreateLecture = () => {
        if(trueData){
            dispatch(createLecture(lecture));
            navigate("/lectures");
        }
    }

    useEffect(() => {
        setLecture((prev) => ({
            ...prev,
            text: text
        }))
    }, [text])

    return (
        <div className="w-full h-full flex flex-col justify-start gap-[40px] items-center pt-[100px] box-border relative">
            <button className="backLink" onClick={() => setTypeLecture("")}>Назад</button>
            <div className="w-full flex justify-between items-center">
                <h1 className="text-5xl">Создание лекций</h1>
                <button 
                    className="py-1 px-3 box-border bg-blue-500 text-white text-center rounded-lg text-lg"
                    onClick={handleCreateLecture}
                >Создать</button>
            </div>
            <div
                style={{ height: "calc(100% - 164px)" }}
                className="w-full overflow-y-auto"
            >
                <TextExample setText={setText}/>
            </div>
        </div>
    );
}
