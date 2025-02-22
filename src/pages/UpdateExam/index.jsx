import "./style.css";
import DatePickerItem from "../../components/common/datePicker";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { deleteAnswer, deleteQuestion, getExam, updateExam } from '../../store/slices/exams';
import { BackButton } from '../../components/layouts/BackButton/index';
import { useNavigate, useParams } from "react-router-dom";
import Modal from './../../components/layouts/Modal';

import plusImg from '../../assets/icons/default-plus.svg';
import greenRombImg from '../../assets/icons/green-rombhus.svg';
import rombImg from '../../assets/icons/rombhus.svg';
import doneImg from '../../assets/icons/green-done.svg';
import crossImg from '../../assets/icons/red-cross.svg';
import plusWithBorderImg from '../../assets/icons/plus.svg';
import warnImg from '../../assets/icons/warn.svg';
import deleteImg from '../../assets/icons/delete.svg';
import redDeleteImg from '../../assets/icons/red-trash.svg';
import arrowDownImg from '../../assets/icons/arrow-down.svg';
import arrowUpImg from '../../assets/icons/arrow-up.svg';
import redCrossImg from '../../assets/icons/red-cross.svg';

export default function UpdateExam({ examData }) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myInfo = useSelector((state) => state.users.list);
    const member_groups = myInfo.member_groups || [];

    const [warn, setWarn] = useState("");
    const [deleteWarn, setDeleteWarn] = useState("");
    const [isHidden, setIsHidden] = useState(true);
    const [questionsList, setQuestionsList] = useState([]);
    const [modalDelete, setModalDelete] = useState(false);
    const [openQuestions, setOpenQuestions] = useState([]);
    const [openNewQuestions, setOpenNewQuestions] = useState([]);
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

    const trueData = Boolean(exam.title && exam.time && exam.start_time && exam.end_time && exam.groups.length && (exam.questions?.length || examData?.questions?.length));

    useEffect(() => {   
        setExam((prev) => ({
            ...prev,
            questions: questionsList
        }))
    }, [questionsList])

    useEffect(() => {
        setExam((prev) => ({
            ...prev,
            title: examData.title,
            time: examData.time,
            start_time: examData.start_time,
            end_time: examData.end_time,
            groups: examData.groups,
        }))
    }, [])
    
    function handleOpenQuestion(questionID){
        setOpenQuestions((prev) => 
            prev.includes(questionID) ? prev.filter(item => item !== questionID) : [...prev, questionID]
        )
        setDeleteWarn("")
    }

    function handleOpenNewQuestion(questionID){
        setOpenNewQuestions((prev) => 
            prev.includes(questionID) ? prev.filter(item => item !== questionID) : [...prev, questionID]
        )
    }

    function handleSaveQuestion(){
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
                order: examData.questions.length + 1
            };
    
            setQuestionsList((prevList) => [...prevList, updatedQuestion]);
    
            return {
                id: null,
                text: '',
                order: null,
                answers: []
            };
        });
    }

    function handleRemoveQuestion(id){
        setQuestionsList((prev) => prev.filter(item => item.id !== id));
        setWarn("");
    }

    function handleChangeGroups(group) {
        setExam((prev) => ({
            ...prev,
            groups: prev.groups.some(item => item.id === group.id)
                ? prev.groups.filter((item) => item.id !== group.id)
                : [...prev.groups, group],
        }));
    }

    function handleMoveUp(id) {
        setQuestionsList((prevQuestions) => {
            const index = prevQuestions.findIndex(item => item.id === id);
            if (index > 0) {
                const updatedQuestionsList = [...prevQuestions];
                const [movedItem] = updatedQuestionsList.splice(index, 1);
                updatedQuestionsList.splice(index - 1, 0, movedItem);
    
                updatedQuestionsList.forEach((item, i) => {
                    item.order = i + 1;
                });
    
                return updatedQuestionsList;
            }
            return prevQuestions;
        });
    }
        
    function handleMoveDown(id) {
        setQuestionsList((prevQuestions) => {
            const index = prevQuestions.findIndex(item => item.id === id);
            if (index < prevQuestions.length - 1) {
                const updatedQuestionsList = [...prevQuestions];
                const [movedItem] = updatedQuestionsList.splice(index, 1);
                updatedQuestionsList.splice(index + 1, 0, movedItem);
    
                updatedQuestionsList.forEach((item, i) => {
                    item.order = i + 1;
                });
    
                return updatedQuestionsList;
            }
            return prevQuestions;
        });
    }    

    async function handleDeleteQuestion(questionID){
        try {
            await dispatch(deleteQuestion(questionID)).unwrap();
            dispatch(getExam(id))
        } catch (error) {
            console.error("Ошибка удаления вопроса:", error);
        }
    }

    async function handleDeleteAnswer(answerID){
        const quest = examData.questions.find(q => q.answers.some(a => a.id === answerID));
        const answer = quest.answers.find(a => a.id === answerID);

        if(quest.answers.length < 3){
            setDeleteWarn("Должно быть минимум два ответа");
            return;
        }

        if(answer.is_correct){
            setDeleteWarn("Нельзя удалить правильный ответ");
            return;
        }
        
        try {
            setDeleteWarn("");
            await dispatch(deleteAnswer(answerID)).unwrap();
            dispatch(getExam(id));
        } catch (error) {
            console.error("Ошибка удаления ответа:", error);
        }
    }

    async function handleCreateExam(){
        if(trueData){
            const copyGroups = exam.groups.map(item => item.id).map(id => id.toString()) || [];    
            const copyQuestions = exam.questions.map(({ id, answers, ...rest }) => ({
                ...rest,
                answers: answers.map(({ id, ...answerRest }) => answerRest)
            }));

            const data = {
                title: exam.title,
                time: exam.time,
                start_time: exam.start_time,
                end_time: exam.end_time,
                groups: copyGroups,
                questions: [...examData.questions, ...copyQuestions]
            }
            await dispatch(updateExam({ id, data })).unwrap();
            navigate('/exams')
        }
    }
    
    // console.log(examData);
    console.log(deleteWarn);

    return (
        <div className="w-full h-fit pt-[70px] box-border relative">
            <BackButton />
            <h1 className="text-5xl">Изменение экзамена</h1>
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
                        value={exam.title}
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
                        value={exam.time}
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
                    <button className="mt-[50px] bg-[#F3EBE5] w-full h-[80px] rounded-lg flex flex-col items-center justify-center" onClick={() => {
                        setIsHidden(false);
                        setWarn("");
                    }}>
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
                                <button 
                                    onClick={() => handleChangeGroups(item)} 
                                    className={classNames("w-[15px] h-[15px] border border-black rounded-sm", {
                                        'bg-black': exam.groups.some(group => group.id === item.id),
                                        'bg-white': !exam.groups.some(group => group.id === item.id)
                                    })}
                                ></button>
                                <span>{item.facult} {item.course} курс {item.subgroup} группа</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="w-full h-fit">
                {examData?.questions?.length > 0 && 
                        <ul className="w-full h-fit flex flex-col gap-3 mt-[30px]"> 
                            {examData.questions.map((item) => (
                                <li className="w-full cursor-pointer flex flex-col rounded-lg" key={item.id}>
                                    <div  onClick={() => handleOpenQuestion(item.id)} className="w-full py-2 px-4 flex items-center justify-between border border-black rounded-lg box-border transition hover:bg-gray-100">
                                        <h2 className="truncate max-w-[90%]">{item.order}. {item.text}</h2>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setModalDelete(true)}>
                                                <img 
                                                    src={redDeleteImg} 
                                                    width={20}
                                                    height={20}
                                                    alt="delete" 
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    {openQuestions.includes(item.id) && (
                                        <ul className="w-full h-fit p-5 box-border rounded-lg mt-3 bg-gray-100 flex flex-col items-start gap-2">
                                            {item.answers.map((item, index) => (
                                                <li key={item.id} className="w-full flex items-center justify-between">
                                                    <h2><span className="font-semibold">{index + 1}.</span> {item.text}</h2>
                                                    <button onClick={() => handleDeleteAnswer(item.id)}>
                                                        <img 
                                                            src={redCrossImg} 
                                                            width={20}
                                                            height={20}
                                                            alt="delete" 
                                                        />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {deleteWarn && <div className="text-red-500 border border-red-500 rounded-lg mt-3 w-full h-fit py-1 box-border text-center font-medium">{deleteWarn}</div>}
                                    <Modal isOpen={modalDelete} onClose={() => setModalDelete(false)} defaultDeletion={false}>
                                        <div className="flex flex-col items-center gap-[40px] mt-6 w-fit">
                                            <h2 className="text-xl">Вы точно хотите удалить вопрос?</h2>
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => setModalDelete(false)} className="py-1 px-4 box-border rounded-md border border-black font-medium ">Отмена</button>
                                                <button onClick={() => {
                                                    handleDeleteQuestion(item.id);
                                                    setModalDelete(false)
                                                }} className="py-1 px-4 box-border rounded-md bg-red-500 border border-red-500 text-white font-medium ">Удалить</button>
                                            </div>
                                        </div>
                                    </Modal>
                                </li>
                            ))}
                    </ul>
                }
                {questionsList.length !== 0 && 
                    <ul className="w-full h-fit flex flex-col gap-3 mt-[12px]"> 
                        {questionsList.map((item) => (
                            <li onClick={() => handleOpenNewQuestion(item.id)} className="w-full cursor-pointer py-2 px-4 box-border flex items-center justify-between bg-[#F3EBE5] rounded-lg" key={item.id}>
                                <h2 className="truncate max-w-[90%]">{item.text}</h2>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleRemoveQuestion(item.id)}>
                                        <img 
                                            src={deleteImg} 
                                            width={20}
                                            height={20}
                                            alt="delete" 
                                        />
                                    </button>
                                    <button onClick={() => handleMoveDown(item.id)}>
                                        <img 
                                            src={arrowDownImg} 
                                            width={24}
                                            height={24}
                                            alt="arrow" 
                                        />
                                    </button>
                                    <button onClick={() => handleMoveUp(item.id)}>
                                        <img 
                                            src={arrowUpImg} 
                                            width={24}
                                            height={24}
                                            alt="arrow" 
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
                                        text: '',
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
            <button
                className={classNames("w-full h-[40px] bg-black rounded-lg text-white mt-[30px] font-semibold text-lg mb-[30px]", {
                    'opacity-20': !trueData,
                    'opacity-1': trueData
                })}
                disabled={!trueData}
                onClick={handleCreateExam}
            >Сохранить</button>
        </div>
    );
}
