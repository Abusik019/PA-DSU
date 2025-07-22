import "./style.css";
import DatePickerItem from "../../components/common/datePicker";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { deleteAnswer, deleteQuestion, getExam, updateExam } from '../../store/slices/exams';
import { useNavigate, useParams } from "react-router-dom";
import { ArrowIcon, CrossIcon, DoneIcon, PlusIcon, PlusRounded, RhombusIcon, TrashIcon, WarningIcon } from "../../assets";
import { BackButton } from "../../components/common/backButton";
import { Modal } from "antd";

export default function UpdateExam({ examData }) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myInfo = useSelector((state) => state.users.list);
    const member_groups = myInfo.member_groups || [];

    const sortExamDataQuestions = Array.isArray(examData?.questions) 
        ? [...examData.questions].sort((a, b) => a.order - b.order) 
        : [];

    const [warn, setWarn] = useState("");
    const [deleteWarns, setDeleteWarns] = useState({});
    const [deleteNewWarns, setDeleteNewWarns] = useState({});
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
    }, [examData.end_time, examData.groups, examData.start_time, examData.time, examData.title])
    
    function handleOpenQuestion(questionID){
        setOpenQuestions((prev) => 
            prev.includes(questionID) ? prev.filter(item => item !== questionID) : [...prev, questionID]
        )
        setDeleteWarns((prev) => ({ ...prev, [questionID]: "" }));
    }

    function handleOpenNewQuestion(questionID){
        setOpenNewQuestions((prev) => 
            prev.includes(questionID) ? prev.filter(item => item !== questionID) : [...prev, questionID]
        );
        setDeleteNewWarns((prev) => ({ ...prev, [questionID]: "" }));
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
                order: examData.questions.length + questionsList.length + 1
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
            if (prevQuestions.length === 0) return prevQuestions;
    
            const maxOrder = Math.max(0, ...examData.questions.map(q => q.order));
    
            const updatedQuestionsList = [...prevQuestions];
            const index = updatedQuestionsList.findIndex(item => item.id === id);
    
            if (index > 0) {
                [updatedQuestionsList[index], updatedQuestionsList[index - 1]] = [updatedQuestionsList[index - 1], updatedQuestionsList[index]];
    
                return updatedQuestionsList.map((item, i) => ({
                    ...item,
                    order: maxOrder + i + 1, 
                }));
            }
    
            return prevQuestions;
        });
    }
    
    function handleMoveDown(id) {
        setQuestionsList((prevQuestions) => {
            if (prevQuestions.length === 0) return prevQuestions;
    
            const maxOrder = Math.max(0, ...examData.questions.map(q => q.order));
            const updatedQuestionsList = [...prevQuestions];
            const index = updatedQuestionsList.findIndex(item => item.id === id);
    
            if (index < updatedQuestionsList.length - 1) {
                [updatedQuestionsList[index], updatedQuestionsList[index + 1]] = [updatedQuestionsList[index + 1], updatedQuestionsList[index]];
    
                return updatedQuestionsList.map((item, i) => ({
                    ...item,
                    order: maxOrder + i + 1, 
                }));
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

    async function handleDeleteAnswer(answerID, questionID){
        const quest = examData.questions.find(q => q.answers.some(a => a.id === answerID));
        const answer = quest.answers.find(a => a.id === answerID);

        if(quest.answers.length < 3){
            setDeleteWarns(prev => ({ ...prev, [questionID]: "Должно быть минимум два ответа" }));
            return;
        }

        if(answer.is_correct){
            setDeleteWarns(prev => ({ ...prev, [questionID]: "Нельзя удалить правильный ответ" }));
            return;
        }
        
        try {
            setDeleteWarns(prev => ({ ...prev, [questionID]: "" }));
            await dispatch(deleteAnswer(answerID)).unwrap();
            dispatch(getExam(id));
        } catch (error) {
            console.error("Ошибка удаления ответа:", error);
        }
    }

    function handleDeleteNewAnswer(answerID, questionID){
        const quest = questionsList.find(q => q.answers.some(a => a.id === answerID));
        const answer = quest.answers.find(a => a.id === answerID);

        console.log(answer);

        if(quest.answers.length < 3){
            setDeleteNewWarns(prev => ({ ...prev, [questionID]: "Должно быть минимум два ответа" }));
            return;
        }

        if(answer.is_correct){
            setDeleteNewWarns(prev => ({ ...prev, [questionID]: "Нельзя удалить правильный ответ" }));
            return;
        }
        
        setDeleteNewWarns(prev => ({ ...prev, [questionID]: "" }));
    }

    async function handleCreateExam(){
        if(trueData){
            const copyGroups = exam.groups.map(item => item.id).map(id => id.toString()) || [];    
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
                questions: [...examData.questions, ...copyQuestions]
            }
            await dispatch(updateExam({ id, data })).unwrap();
            navigate('/exams')
        }
    }

    console.log(questionsList);
    
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
                        <PlusIcon />
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
                {sortExamDataQuestions.length > 0 && 
                        <ul className="w-full h-fit flex flex-col gap-3 mt-[30px]"> 
                            {sortExamDataQuestions.map((item) => (
                                <li className="w-full cursor-pointer flex flex-col rounded-lg" key={item.id}>
                                    <div onClick={() => handleOpenQuestion(item.id)} className="w-full py-2 px-4 flex items-center justify-between border border-black rounded-lg box-border transition hover:bg-gray-100">
                                        <h2 className="truncate max-w-[90%]">{item.order}. {item.text}</h2>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setModalDelete(true)}>
                                                <TrashIcon className="text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                    {openQuestions.includes(item.id) && (
                                        <ul className="w-full h-fit p-5 box-border rounded-lg mt-3 bg-gray-100 flex flex-col items-start gap-2">
                                            {item.answers.map((ans, index) => (
                                                <li key={ans.id} className="w-full flex items-center justify-between">
                                                    <h2><span className="font-semibold">{index + 1}.</span> {ans.text}</h2>
                                                    <button onClick={() => handleDeleteAnswer(ans.id, item.id)}>
                                                        <CrossIcon className="text-red-500" width={20} height={20}/>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {deleteWarns[item.id] && <div className="text-red-500 border border-red-500 rounded-lg mt-3 w-full h-fit py-1 box-border text-center font-medium">{deleteWarns[item.id]}</div>}
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
                            <li className="w-full cursor-pointer flex flex-col rounded-lg" key={item.id}>
                                <div onClick={() => handleOpenNewQuestion(item.id)} className="w-full py-2 px-4 flex items-center justify-between rounded-lg box-border cursor-pointer bg-[#F3EBE5]">
                                    <h2 className="truncate max-w-[90%]">{item.order}. {item.text}</h2>
                                    <div className="flex items-center gap-3">
                                        <button onClick={(e) => { e.stopPropagation(); handleRemoveQuestion(item.id)}}>
                                            <TrashIcon />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleMoveDown(item.id)}}>
                                            <ArrowIcon />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleMoveUp(item.id)}}>
                                            <ArrowIcon className='rotate-180' />
                                        </button>
                                    </div>
                                </div>
                                {openNewQuestions.includes(item.id) && (
                                    <ul className="w-full h-fit p-5 box-border rounded-lg mt-3 bg-[#F3EBE5] flex flex-col items-start gap-2">
                                        {item.answers.map((ans, index) => (
                                            <li key={ans.id} className="w-full flex items-center justify-between">
                                                <h2><span className="font-semibold">{index + 1}.</span> {ans.text}</h2>
                                                <button onClick={() => handleDeleteNewAnswer(ans.id, item.id)}>
                                                    <CrossIcon className="text-red-500" width={20} height={20}/>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {deleteNewWarns[item.id] && <div className="text-red-500 border border-red-500 rounded-lg mt-3 w-full h-fit py-1 box-border text-center font-medium">{deleteNewWarns[item.id]}</div>}
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
                                    <CrossIcon className="text-red-500" width={24} height={24}/>
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
                                className="mt-[8px] ml-[28px] h-[40px] bg-[#F3EBE5] rounded-xl py-2 box-border flex items-center justify-center"
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
                                style={{ maxWidthidth: 'calc(60% - 28px)' }} 
                                id="warning" 
                                className="w-fit h-fit rounded-md bg-[#FEF9EB] mt-[16px] ml-[28px] p-4 box-border flex items-center justify-start gap-2"
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
            >Сохранить</button>
        </div>
    );
}
