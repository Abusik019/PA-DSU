import  './style.css';
import { BackButton } from './../../components/layouts/BackButton';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import boxGif from '../../assets/images/box.gif';

export default function LectureInfo({ setTypeLecture, lecture, setLecture }) {
    const myInfo = useSelector((state) => state.users.list);
    const member_groups = myInfo.member_groups;
    const   [inputValue, setInputValue] = useState(""),
            [choosenGroups, setChoosenGroups] = useState(lecture.group),
            [isDisabledBtn, setIsDisabledBtn] = useState(true);

    useEffect(() => {
        const isAllFilled = inputValue.trim() && choosenGroups.length;

        setIsDisabledBtn(!isAllFilled);
    }, [inputValue, choosenGroups])

    useEffect(() => {
        setInputValue(lecture.title || "");
    }, [lecture.title]);    

    const handleGroupClick = (groupId) => {
        setChoosenGroups((prev) => 
            prev.includes(groupId) 
                ? prev.filter(id => id !== groupId) 
                : [...prev, groupId]
        );
    };

    console.log(choosenGroups);

    return (
        <div className="w-full h-full flex flex-col justify-start gap-[40px] items-center pt-[100px] box-border relative">
            <BackButton />
            <div className="w-full flex justify-between items-center">
                <h1 className="text-5xl">Создание лекции</h1>
                <button 
                    className={classNames("py-1 px-3 box-border bg-black text-white text-center rounded-lg text-lg min-w-[130px]", {
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
                <div className='w-[50%] flex items-start justify-between gap-4'>
                    <h2 className='font-semibold text-xl'>Выберите группу(ы):</h2>
                    <ul className='groupList w-[60%] h-fit rounded-lg shadow-xl max-h-[240px] overflow-y-auto'>
                        {member_groups.length ? member_groups.map((item) => (
                            <li 
                                key={item.id}
                                className={classNames('p-2 box-border text-center font-medium cursor-pointer', {
                                    'bg-blue-400 text-white': choosenGroups.includes(item.id),
                                    'bg-white text-black': !choosenGroups.includes(item.id),
                                })}
                                onClick={() => handleGroupClick(item.id)}
                            >
                                {item.facult} {item.course} курс {item.subgroup} группа
                            </li>
                        )) : (
                            <li className='w-full h-[240px] rounded-lg flex flex-col items-center justify-center gap-2 text-2xl font-semibold text-center'>
                                <h2>Вы не состоите ни в<br />одной группе</h2>
                                <img 
                                    src={boxGif}
                                    width={60}
                                    height={60}
                                    alt="box" 
                                />
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
