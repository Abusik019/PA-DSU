import "./style.css";
import DatePickerItem from "./../../components/common/datePicker";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { createExam } from './../../store/slices/exams';
import { useNavigate } from "react-router-dom";
import { ArrowIcon, CrossIcon, DoneIcon, PlusIcon, PlusRounded, RhombusIcon, TrashIcon, WarningIcon } from "../../assets";
import { BackButton } from "../../components/common/BackButton";

export default function CreateExam() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myInfo = useSelector((state) => state.users.list);

    // Мемоизация member_groups
    const member_groups = useMemo(() => myInfo.member_groups || [], [myInfo.member_groups]);

    const [warn, setWarn] = useState("");
    const [isHidden, setIsHidden] = useState(false);
    const [questionsList, setQestionsList] = useState([]);
    const [question, setQuestion] = useState({
        id: null,
        text: '',
        order: null,
        answers: []
    });
    const [exam, setExam] = useState({
        title: '',
        time: 0,
        start_time: "",
        end_time: "",
        groups: [],
        questions: []
    });

    const trueData = Boolean(exam.title && exam.time && exam.start_time && exam.end_time && exam.groups.length && exam.questions.length);

    // Очистка предупреждения при изменении вопроса или ответов
    useEffect(() => {
        setWarn("");
    }, [question.text, question.answers]);

    useEffect(() => {   
        setExam((prev) => ({
            ...prev,
            questions: questionsList
        }))
    }, [questionsList])

    const handleSaveQuestion = useCallback(() => {
        if (!question.text.trim()) {
            setWarn("Название вопроса не может быть пустым!");
            return;
        }

        if (question.answers.some(answer => !answer.text.trim())) {
            setWarn("Текст всех ответов должен быть заполнен!");
            return;
        }
        
        if (question.answers.length <= 1) {
            setWarn("Должно быть как минимум 2 варианта ответа");
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
                text: '',
                order: null,
                answers: []
            };
        });
        setIsHidden(true); // Скрывать форму после сохранения
    }, [question, questionsList]);

    const handleDeleteQuestion = useCallback((id) => {
        setQestionsList((prev) => prev.filter(item => item.id !== id));
        setWarn("");
    }, []);

    const handleChangeGroups = useCallback((e, item) => {
        if(e.target.checked){
            setExam((prev) => ({...prev, groups: [...prev.groups, item.id]}))
        } else{
            setExam((prev) => ({...prev, groups: prev.groups.filter(group => group !== item.id)}))
        }
    }, []);

    const handleMoveUp = useCallback((id) => {
        const index = questionsList.findIndex(item => item.id === id);
        if (index > 0) {
            const updatedQuestionsList = [...questionsList];
            const [movedItem] = updatedQuestionsList.splice(index, 1);
            updatedQuestionsList.splice(index - 1, 0, movedItem);

            updatedQuestionsList.forEach((item, i) => {
                item.order = i + 1;
            });

            setQestionsList(updatedQuestionsList);
        }
    }, [questionsList]);

    const handleMoveDown = useCallback((id) => {
        const index = questionsList.findIndex(item => item.id === id);
        if (index < questionsList.length - 1) {
            const updatedQuestionsList = [...questionsList];
            const [movedItem] = updatedQuestionsList.splice(index, 1);
            updatedQuestionsList.splice(index + 1, 0, movedItem);

            updatedQuestionsList.forEach((item, i) => {
                item.order = i + 1;
            });

            setQestionsList(updatedQuestionsList);
        }
    }, [questionsList]);

    const handleCreateExam = useCallback(() => {
        if(trueData){
            const copyGroups = exam?.groups?.map(group => group.toString()) || [];    
            const copyQuestions = exam.questions.map(({ answers, ...rest }) => ({
                ...rest,
                answers: answers.map(({ ...answerRest }) => answerRest)
            }));

            const data = {
                title: exam.title,
                time: exam.time,
                start_time: exam.start_time,
                end_time: exam.end_time,
                groups: copyGroups,
                questions: copyQuestions
            }
            dispatch(createExam(data))
                .unwrap()
                .then(() => {
                    navigate('/exams');
                })
                .catch((error) => {
                    console.log('Ошибка создания экзамена', error);
                })
        }
    }, [exam, dispatch, navigate, trueData]);

    return (
        <div className="w-full h-fit pt-[70px] box-border relative">
            <BackButton />
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
                        className="w-full h-[40px] border-gray-400 border-[1px] rounded-lg p-2 box-border appearance-none outline-none"
                        onInput={(e) => setExam((prev) => ({...prev, title: e.target.value}))} 
                    />
                </div>
                <div className="w-[10%] flex flex-col items-start">
                    <label className="font-medium" htmlFor="time">
                        Длительность:
                    </label>
                    <input
                        type="number"
                        id="time"
                        className="w-full h-[40px] border-gray-400 border-[1px] rounded-lg p-2 box-border appearance-none outline-none text-center"
                        placeholder="В минутах"
                        onInput={(e) => setExam((prev) => ({...prev, time: parseInt(e.target.value)}))} 
                    />
                </div>
            </div>
            <div className="mt-[30px] w-full h-[238px] flex items-start justify-between">
                <div className="flex flex-col justify-between">
                    <div className="flex flex-col items-start gap-1">
                        <span className="font-medium">Дата проведения:</span>
                        <DatePickerItem setExam={setExam} start_time={exam.start_time} end_time={exam.end_time}/>
                    </div>
                    <button className="mt-[50px] bg-gray-100 border border-gray-200 rounded-3xl w-full h-[80px] flex flex-col items-center justify-center" onClick={() => {
                        setIsHidden(false);
                        setWarn("");
                    }}>
                        <PlusIcon />
                        <span>Добавить вопрос</span>
                    </button>
                </div>
                <div className="flex flex-col items-start gap-1">
                    <span className="font-medium">Группы:</span>
                    <ul className="w-[300px] max-h-[210px] overflow-y-auto border border-black rounded-lg p-2 box-border">
                        {member_groups.length && member_groups.map((item) => (
                            <li key={item.id} className="w-full p-1 box-border flex items-center gap-3">
                                <input type="checkbox" onInput={(e) => handleChangeGroups(e, item)}/>
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
                            <li className="w-full py-2 px-4 box-border flex items-center justify-between bg-gray-100 rounded-lg" key={item.id}>
                                <h2 className="truncate max-w-[90%]">{item.id}. {item.text}</h2>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleDeleteQuestion(item.id)}>
                                       <TrashIcon />
                                    </button>
                                    <button onClick={() => handleMoveDown(item.id)}>
                                        <ArrowIcon />
                                    </button>
                                    <button onClick={() => handleMoveUp(item.id)}>
                                        <ArrowIcon className='rotate-180' />
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
                                    <DoneIcon />
                                </button>
                                <button onClick={() => {
                                    setQuestion({
                                        id: null,
                                        text: '',
                                        order: null,
                                        answers: []
                                    });
                                    setIsHidden(true);
                                }}>
                                   <CrossIcon width={24} height={24} />
                                </button>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Ваш вопрос" 
                                value={question.text}
                                className="w-[60%] h-[40px] border-gray-400 border-b-[1px] p-2 box-border appearance-none outline-none"
                                onInput={(e) => setQuestion((prev) => ({
                                    ...prev,
                                    text: e.target.value
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
                                            <RhombusIcon className={item.is_correct ? "text-green-500" : "text-black"} />
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
                                className="mt-[8px] ml-[28px] h-[40px] bg-gray-100 border border-gray-200 rounded-3xl py-2 box-border flex items-center justify-center"
                                onClick={() => setQuestion((prev) => ({
                                    ...prev,
                                    answers: [
                                        ...prev.answers,
                                        { id: prev.answers.length + 1, text: "", is_correct: false }
                                    ]
                                }))}
                            >
                                <PlusRounded />
                            </button>
                            {warn && 
                            <div 
                                style={{ maxWidth: 'calc(60% - 28px)' }} 
                                id="warning" 
                                className="w-fit h-fit rounded-md bg-gray-100 mt-[16px] ml-[28px] p-4 box-border flex items-center justify-start gap-2"
                            >
                                <WarningIcon />
                                <span className="font-semibold">{warn}</span>
                            </div>
                            }
                        </li>
                    </ul>
                }
            </div>
            <button
                className={classNames("w-full h-[40px] bg-black rounded-lg text-white mt-[30px] font-semibold text-lg mb-[30px]", {
                    'opacity-20': !trueData,
                    'opacity-1': trueData
                })}
                disabled={!trueData}
                onClick={handleCreateExam}
            >Создать</button>
        </div>
    );
}
