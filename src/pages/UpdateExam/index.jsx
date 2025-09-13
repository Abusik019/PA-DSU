import "./style.css";
import DatePickerItem from "../../components/common/datePicker";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { deleteAnswer, deleteQuestion, deleteTextQuestion, getExam, updateExam } from '../../store/slices/exams';
import { useNavigate, useParams } from "react-router-dom";
import { ArrowIcon, CrossIcon, DoneIcon, PlusIcon, PlusRounded, RhombusIcon, TrashIcon } from "../../assets";
import { BackButton } from "../../components/common/backButton";
import { message } from "antd";
import Modal from './../../components/layouts/Modal';

export default function UpdateExam({ examData }) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myInfo = useSelector((state) => state.users.list);
    const member_groups = myInfo?.member_groups || [];

    const [qType, setQType] = useState("test");

    useEffect(() => {
        if (Array.isArray(examData?.text_questions) && examData.text_questions.length > 0) {
            setQType("write");
        } else {
            setQType("test");
        }
    }, [examData?.text_questions, examData?.questions]);

    const serverQuestions = useMemo(() => {
        return qType === "test" ? (examData?.questions || []) : (examData?.text_questions || []);
    }, [qType, examData?.questions, examData?.text_questions]);

    const sortExamDataQuestions = Array.isArray(serverQuestions)
        ? [...serverQuestions].sort((a, b) => (a.order || 0) - (b.order || 0))
        : [];

    const [isHidden, setIsHidden] = useState(true);
    const [questionsList, setQuestionsList] = useState([]);
    const [modalDelete, setModalDelete] = useState(false);
    const [openQuestions, setOpenQuestions] = useState([]);
    const [openNewQuestions, setOpenNewQuestions] = useState([]);

    console.log(examData);

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

    const trueData = Boolean(
        exam.title &&
        exam.time &&
        exam.start_time &&
        exam.end_time &&
        exam.groups.length &&
        ((exam.questions?.length || 0) > 0 || (serverQuestions?.length || 0) > 0)
    );

    useEffect(() => {
        setExam((prev) => ({
            ...prev,
            questions: questionsList
        }));
    }, [questionsList]);

    useEffect(() => {
        setExam((prev) => ({
            ...prev,
            title: examData?.title || '',
            time: examData?.time || 0,
            start_time: examData?.start_time || "",
            end_time: examData?.end_time || "",
            groups: examData?.groups || [],
        }));
    }, [examData?.end_time, examData?.groups, examData?.start_time, examData?.time, examData?.title]);

    function handleOpenQuestion(questionID) {
        setOpenQuestions((prev) =>
            prev.includes(questionID) ? prev.filter(item => item !== questionID) : [...prev, questionID]
        );
    }

    function handleOpenNewQuestion(questionID) {
        setOpenNewQuestions((prev) =>
            prev.includes(questionID) ? prev.filter(item => item !== questionID) : [...prev, questionID]
        );
    }

    function handleSaveQuestion() {
        if (!question.text.trim()) {
            message.warning("Название вопроса не может быть пустым!");
            return;
        }

        if (qType === "test") {
            const answers = question.answers || [];
            if (answers.some(answer => !answer.text.trim())) {
                message.warning("Текст всех ответов должен быть заполнен!");
                return;
            }
            if (answers.length <= 1) {
                message.warning("Должно быть как минимум 2 варианта ответа");
                return;
            }
            if (answers.filter(answer => answer.is_correct).length !== 1) {
                message.warning("Должен быть выбран правильный ответ!");
                return;
            }
        }

        setQuestionsList((prevList) => {
            const nextId = prevList.length + 1;
            const nextOrder = (serverQuestions?.length || 0) + prevList.length + 1;

            const toAdd =
                qType === "test"
                    ? {
                        id: nextId,
                        text: question.text,
                        order: nextOrder,
                        answers: (question.answers || []).map(a => ({ ...a }))
                    }
                    : {
                        id: nextId,
                        text: question.text,
                        order: nextOrder
                    };

            return [...prevList, toAdd];
        });

        // Сброс формы
        if (qType === "test") {
            setQuestion({
                id: null,
                text: '',
                order: null,
                answers: []
            });
        } else {
            setQuestion({
                id: null,
                text: '',
                order: null
            });
        }
        setIsHidden(true);
    }

    function handleRemoveQuestion(id) {
        setQuestionsList((prev) => prev.filter(item => item.id !== id));
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

            const maxOrder = Math.max(0, ...serverQuestions.map(q => q.order || 0));

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

            const maxOrder = Math.max(0, ...serverQuestions.map(q => q.order || 0));
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

    async function handleDeleteQuestion(questionID) {
        try {
            if(qType == 'test'){
                await dispatch(deleteQuestion(questionID)).unwrap();
            } else{
                await dispatch(deleteTextQuestion(questionID)).unwrap();
            }
            dispatch(getExam(id));
        } catch (error) {
            console.error("Ошибка удаления вопроса:", error);
            message.error("Ошибка удаления вопроса");
        }
    }

    async function handleDeleteAnswer(answerID) {
        if (qType !== "test") return;

        const quest = serverQuestions.find(q => Array.isArray(q.answers) && q.answers.some(a => a.id === answerID));
        if (!quest) return;

        const answer = quest.answers.find(a => a.id === answerID);

        if ((quest.answers?.length || 0) < 3) {
            message.warning("Должно быть минимум два ответа");
            return;
        }

        if (answer?.is_correct) {
            message.warning("Нельзя удалить правильный ответ");
            return;
        }

        try {
            await dispatch(deleteAnswer(answerID)).unwrap();
            dispatch(getExam(id));
        } catch (error) {
            console.error("Ошибка удаления ответа:", error);
            message.error("Ошибка удаления ответа");
        }
    }

    function handleDeleteNewAnswer(answerID, questionID) {
        if (qType !== "test") return;

        setQuestionsList(prev => {
            const quest = prev.find(q => Array.isArray(q.answers) && q.id === questionID);
            if (!quest) return prev;

            if ((quest.answers?.length || 0) < 3) {
                message.warning("Должно быть минимум два ответа");
                return prev;
            }

            const answer = quest.answers.find(a => a.id === answerID);
            if (answer?.is_correct) {
                message.warning("Нельзя удалить правильный ответ");
                return prev;
            }

            return prev.map(q => {
                if (q.id !== questionID) return q;
                const filtered = q.answers.filter(a => a.id !== answerID).map((a, idx) => ({ ...a, id: idx + 1 }));
                return { ...q, answers: filtered };
            });
        });
    }

    async function handleCreateExam() {
        if (!trueData) return;

        const copyGroups = (exam.groups || []).map(item => item.id).map(id => id.toString());

        const preparedNew = (exam.questions || []).map((q) => {
            if (qType === "test") {
                const { text, order, answers } = q;
                return {
                    text,
                    order,
                    answers: (answers || []).map(a => ({ ...a }))
                };
            } else {
                const { text, order } = q;
                return { text, order }; 
            }
        });

        const combined = [...(serverQuestions || []), ...preparedNew];

        const data = {
            title: exam.title,
            time: exam.time,
            start_time: exam.start_time,
            end_time: exam.end_time,
            groups: copyGroups
        };

        if (qType === "test") {
            data["questions"] = combined;
        } else {
            data["text_questions"] = combined;
        }

        try {
            await dispatch(updateExam({ id, data })).unwrap();
            navigate('/exams');
        } catch (e) {
            console.error(e);
        }
    }

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
                        onInput={(e) => setExam((prev) => ({ ...prev, title: e.target.value }))}
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
                        onInput={(e) => setExam((prev) => ({ ...prev, time: parseInt(e.target.value || "0", 10) || 0 }))}
                    />
                </div>
            </div>
            <div className="mt-[30px] w-full h-[238px] flex items-start justify-between">
                <div className="flex flex-col justify-between">
                    <div className="flex flex-col items-start gap-1">
                        <span className="font-medium">Дата проведения:</span>
                        <DatePickerItem setExam={setExam} start_time={exam.start_time} end_time={exam.end_time} />
                    </div>
                    <button
                        className="mt-[50px] bg-gray-100 border border-gray-200 w-full h-[80px] rounded-xl flex flex-col items-center justify-center"
                        onClick={() => {
                            setIsHidden(false);
                            if (qType === "test") {
                                setQuestion({ id: null, text: '', order: null, answers: [] });
                            } else {
                                setQuestion({ id: null, text: '', order: null });
                            }
                        }}
                    >
                        <PlusIcon />
                        <span>Добавить вопрос</span>
                    </button>
                </div>
                <div className="flex flex-col items-start gap-1">
                    <span className="font-medium">Группы:</span>
                    <ul className="w-[300px] max-h-[210px] overflow-y-auto border border-black rounded-lg p-2 box-border">
                        {member_groups.length > 0 && member_groups.map((item) => (
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
                        {member_groups.length === 0 && (
                            <li className="text-sm text-gray-500">Нет доступных групп</li>
                        )}
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
                                {qType === "test" && openQuestions.includes(item.id) && Array.isArray(item.answers) && (
                                    <ul className="w-full h-fit p-5 box-border rounded-lg mt-3 bg-gray-100 flex flex-col items-start gap-2">
                                        {item.answers.map((ans, index) => (
                                            <li key={ans.id} className="w-full flex items-center justify-between">
                                                <h2><span className="font-semibold">{index + 1}.</span> {ans.text}</h2>
                                                <button className="z-50" onClick={() => handleDeleteAnswer(ans.id, item.id)}>
                                                    <CrossIcon className="text-red-500" width={20} height={20} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <Modal isOpen={modalDelete} onClose={() => setModalDelete(false)} defaultDeletion={false}>
                                    <div className="flex flex-col items-center gap-[40px] mt-6 w-fit">
                                        <h2 className="text-xl">Вы точно хотите удалить вопрос?</h2>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => setModalDelete(false)} className="py-1 px-4 box-border rounded-md border border-black font-medium ">Отмена</button>
                                            <button onClick={() => {
                                                handleDeleteQuestion(item.id);
                                                setModalDelete(false);
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
                                <div onClick={() => handleOpenNewQuestion(item.id)} className="w-full py-2 px-4 flex items-center justify-between rounded-lg box-border cursor-pointer bg-gray-100 border border-gray-200">
                                    <h2 className="truncate max-w-[90%]">{item.order}. {item.text}</h2>
                                    <div className="flex items-center gap-3">
                                        <button onClick={(e) => { e.stopPropagation(); handleRemoveQuestion(item.id); }}>
                                            <TrashIcon />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleMoveDown(item.id); }}>
                                            <ArrowIcon />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleMoveUp(item.id); }}>
                                            <ArrowIcon className='rotate-180' />
                                        </button>
                                    </div>
                                </div>
                                {qType === "test" && openNewQuestions.includes(item.id) && Array.isArray(item.answers) && (
                                    <ul className="w-full h-fit p-5 box-border rounded-lg mt-3 bg-gray-100 border border-gray-200 flex flex-col items-start gap-2">
                                        {item.answers.map((ans, index) => (
                                            <li key={ans.id} className="w-full flex items-center justify-between">
                                                <h2><span className="font-semibold">{index + 1}.</span> {ans.text}</h2>
                                                <button onClick={() => handleDeleteNewAnswer(ans.id, item.id)}>
                                                    <CrossIcon className="text-red-500" width={20} height={20} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
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
                                    if (qType === "test") {
                                        setQuestion({
                                            id: null,
                                            text: '',
                                            order: null,
                                            answers: []
                                        });
                                    } else {
                                        setQuestion({
                                            id: null,
                                            text: '',
                                            order: null
                                        });
                                    }
                                    setIsHidden(true);
                                }}>
                                    <CrossIcon className="text-red-500" width={24} height={24} />
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
                            {qType === "test" && (
                                <>
                                    <div className="mt-[30px] w-[60%] flex flex-col items-start gap-2">
                                        {(question.answers || []).map((item) => (
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
                                        className="mt-[8px] ml-[28px] h-[40px] bg-gray-100 border border-gray-200 rounded-xl py-2 box-border flex items-center justify-center"
                                        onClick={() => setQuestion((prev) => ({
                                            ...prev,
                                            answers: [
                                                ...(prev.answers || []),
                                                { id: (prev.answers?.length || 0) + 1, text: "", is_correct: false }
                                            ]
                                        }))}
                                    >
                                        <PlusRounded />
                                    </button>
                                </>
                            )}
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