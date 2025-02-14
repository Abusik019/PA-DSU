import "./style.css";
import DatePickerItem from "./../../components/common/datePicker";
import plusImg from '../../assets/icons/default-plus.svg';
import greenRombImg from '../../assets/icons/green-rombhus.svg';
import rombImg from '../../assets/icons/rombhus.svg';
import doneImg from '../../assets/icons/green-done.svg';
import crossImg from '../../assets/icons/red-cross.svg';
import plusWithBorderImg from '../../assets/icons/plus.svg';
import warnImg from '../../assets/icons/warn.svg';
import deleteImg from '../../assets/icons/delete.svg';
import dragImg from '../../assets/icons/drag.svg';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';

export default function CreateExam() {
    const myInfo = useSelector((state) => state.users.list);
    const member_groups = myInfo.member_groups || [];

    const [warn, setWarn] = useState("");
    const [isHidden, setIsHidden] = useState(false);
    const [questionsList, setQestionsList] = useState([]);
    const [question, setQuestion] = useState({
        id: null,
        title: '',
        order: null,
        answers: []
    });

    function handleSaveQuestion(){
        if (!question.title.trim()) {
            setWarn("Название вопроса не может быть пустым!");
            return;
        }

        if (question.answers.some(answer => !answer.text.trim())) {
            setWarn("Текст всех ответов должен быть заполнен!");
            return;
        }

        if (question.answers.filter(answer => answer.is_correct).length !== 1) {
            setWarn("Должен быть выбран правильный ответ!");
            return;
        }

        setWarn("");

        setQuestion((prev) => {
            const updatedQuestion = {
                ...prev,
                id: questionsList.length + 1,
                order: questionsList.length + 1
            };
    
            setQestionsList((prevList) => [...prevList, updatedQuestion]);
    
            return {
                id: null,
                title: '',
                order: null,
                answers: []
            };
        });
    }

    function handleDeleteQuestion(id){
        setQestionsList((prev) => prev.filter(item => item.id !== id))
    }

    console.log(questionsList);

    return (
        <div className="w-full h-fit pt-[30px] box-border">
            <h1 className="text-5xl">Создание экзамена</h1>
            <div className="w-full h-[2px] bg-black rounded-lg mt-[30px]"></div>
            <div className="w-full h-fit lg mt-[30px] flex items-center justify-between">
                <div className="w-[60%] flex flex-col items-start">
                    <label className="font-medium" htmlFor="title">
                        Название:
                    </label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Название"
                        className="w-full h-[40px] border-gray-400 border-[1px] rounded-xl p-2 box-border appearance-none outline-none"
                    />
                </div>
                <div className="w-[10%] flex flex-col items-start">
                    <label className="font-medium" htmlFor="time">
                        Длительность:
                    </label>
                    <input
                        type="number"
                        id="time"
                        className="w-full h-[40px] border-gray-400 border-[1px] rounded-xl p-2 box-border appearance-none outline-none text-center"
                        placeholder="В минутах"
                    />
                </div>
            </div>
            <div className="mt-[30px] w-full h-[238px] flex items-start justify-between">
                <div className="flex flex-col justify-between">
                    <div className="flex flex-col items-start gap-1">
                        <span className="font-medium">Дата проведения:</span>
                        <DatePickerItem />
                    </div>
                    <button className="mt-[50px] bg-[#F3EBE5] w-full h-[80px] rounded-lg flex flex-col items-center justify-center" onClick={() => setIsHidden(false)}>
                        <img 
                            src={plusImg}
                            width={24}
                            height={24}
                            alt="plus" 
                        />
                        <span>Добавить вопрос</span>
                    </button>
                </div>
                <div className="flex flex-col items-start gap-1">
                    <span className="font-medium">Группы:</span>
                    <ul className="w-[300px] max-h-[210px] overflow-y-auto border border-black rounded-lg p-2 box-border">
                        {member_groups.length && member_groups.map((item) => (
                            <li key={item.id} className="w-full p-1 box-border flex items-center gap-3">
                                <input type="checkbox" />
                                <span>{item.facult} {item.course} курс {item.subgroup} группа</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="w-full h-fit">
                {questionsList.length !== 0 && 
                    <ul className="w-full h-fit flex flex-col gap-3  mt-[30px]"> 
                        {questionsList.map((item) => (
                            <li className="w-full py-2 px-4 box-border flex items-center justify-between bg-[#F3EBE5] rounded-lg" key={item.id}>
                                <h2 className="truncate max-w-[90%]">{item.title}</h2>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleDeleteQuestion(item.id)}>
                                        <img 
                                            src={deleteImg} 
                                            width={20}
                                            height={20}
                                            alt="delete" 
                                        />
                                    </button>
                                    <button>
                                        <img 
                                            src={dragImg} 
                                            width={24}
                                            height={24}
                                            alt="drag" 
                                        />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                }
                {!isHidden &&   
                    <ul className="w-full h-fit flex flex-col gap-5  mt-[30px]">
                        <li className="w-full h-fit rounded-lg border border-gray-400 p-4 box-border relative">
                            <div className="absolute right-5 top-5 flex items-center gap-2">
                                <button onClick={handleSaveQuestion}>
                                    <img 
                                        src={doneImg} 
                                        width={24}
                                        height={24}
                                        alt="done" 
                                    />
                                </button>
                                <button onClick={() => {
                                    setQuestion({
                                        id: null,
                                        title: '',
                                        order: null,
                                        answers: []
                                    });
                                    setIsHidden(true);
                                }}>
                                    <img 
                                        src={crossImg} 
                                        width={24}
                                        height={24}
                                        alt="cross" 
                                    />
                                </button>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Ваш вопрос" 
                                value={question.title}
                                className="w-[60%] h-[40px] border-gray-400 border-b-[1px] p-2 box-border appearance-none outline-none"
                                onInput={(e) => setQuestion((prev) => ({
                                    ...prev,
                                    title: e.target.value
                                }))}
                            />
                            <div className="mt-[30px] w-[60%] flex flex-col items-start gap-2">
                                {question.answers.map((item) => (
                                    <div key={item.id} className="w-full flex items-center gap-2">
                                        <button 
                                            onClick={() => setQuestion((prev) => ({
                                                ...prev,
                                                answers: prev.answers.map((ans) => ({
                                                    ...ans,
                                                    is_correct: ans.id === item.id
                                                }))
                                            }))}
                                        >
                                            <img 
                                                src={item.is_correct ? greenRombImg : rombImg}
                                                width={20}
                                                height={20} 
                                                alt="rombhus" 
                                            />
                                        </button>
                                        <input 
                                            style={{ width: 'calc(100% - 28px)' }} 
                                            type="text" 
                                            placeholder="Ответ" 
                                            className="h-[40px] border-black border-[1px] rounded-xl p-2 box-border appearance-none outline-none"
                                            value={item.text}
                                            onInput={(e) => setQuestion((prev) => ({
                                                ...prev,
                                                answers: prev.answers.map((ans) =>
                                                    ans.id === item.id ? { ...ans, text: e.target.value } : ans
                                                )
                                            }))}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button 
                                style={{ width: 'calc(60% - 28px)' }} 
                                className="mt-[8px] ml-[28px] h-[40px] bg-[#F3EBE5] rounded-xl py-2 box-border flex items-center justify-center"
                                onClick={() => setQuestion((prev) => ({
                                    ...prev,
                                    answers: [
                                        ...prev.answers,
                                        { id: prev.answers.length + 1, text: "", is_correct: false }
                                    ]
                                }))}
                            >
                                <img 
                                    src={plusWithBorderImg}
                                    width={24}
                                    height={24} 
                                    alt="plus" 
                                />
                            </button>
                            {warn && 
                            <div 
                                style={{ maxWidthidth: 'calc(60% - 28px)' }} 
                                id="warning" 
                                className="w-fit h-fit rounded-md bg-[#FEF9EB] mt-[16px] ml-[28px] p-4 box-border flex items-center justify-start gap-2"
                            >
                                <img 
                                    src={warnImg} 
                                    width={24}
                                    height={24}
                                    alt="warn" 
                                />
                                <span className="font-semibold">{warn}</span>
                            </div>
                            }
                        </li>
                    </ul>
                }
            </div>
        </div>
    );
}
