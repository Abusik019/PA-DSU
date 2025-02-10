import { BackButton } from './../../components/layouts/BackButton';
import { useEffect, useState } from 'react';
import classNames from 'classnames';

export default function LectureInfo({ setTypeLecture, lecture, setLecture }) {
    const   [inputValue, setInputValue] = useState(""),
            [choosenGroups, setChoosenGroups] = useState([]),
            [isDisabledBtn, setIsDisabledBtn] = useState(true);

    useEffect(() => {
        const isAllFilled = inputValue.trim() && choosenGroups.length;

        setIsDisabledBtn(!isAllFilled);
    }, [inputValue, choosenGroups])

    useEffect(() => {
        setInputValue(lecture.title || "");
    }, [lecture.title]);    

    return (
        <div className="w-full h-full flex flex-col justify-start gap-[40px] items-center pt-[100px] box-border relative">
            <BackButton />
            <div className="w-full flex justify-between items-center">
                <h1 className="text-5xl">Создание лекции</h1>
                <button 
                    className={classNames("py-1 px-3 box-border bg-black text-white text-center rounded-lg text-lg w-[130px]", {
                    "opacity-20 cursor-default": isDisabledBtn,
                    "opacity-1 cursor-pointer": !isDisabledBtn
                    })}
                    disabled={isDisabledBtn}
                    onClick={() => {
                        setTypeLecture('lecture_type');
                        setLecture((prev) => ({
                            ...prev,
                            title: inputValue,
                            group: choosenGroups
                        }))
                    }}
                >
                    Далее
                </button>
            </div>
            <div
                style={{ height: "calc(100% - 164px)" }}
                className="w-full overflow-y-auto flex flex-col items-center justify-center gap-6"
            >
                <input 
                    type="text" 
                    placeholder='Название лекции' 
                    className='w-[50%] h-[50px] border-gray-400 border-[1px] rounded-xl p-2 box-border appearance-none outline-none'
                    onInput={(e) => {
                        setInputValue(e.target.value);
                        setLecture(prev => ({ ...prev, title: e.target.value }));
                    }}
                    value={lecture.title}
                />
                <div className='w-[50%] flex items-center justify-between gap-4'>
                    
                </div>
            </div>
        </div>
    );
}
