import DatePickerItem from "./../../components/common/datePicker";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { createExam } from './../../store/slices/exams';
import { useNavigate } from "react-router-dom";
import { ArrowIcon, CrossIcon, DoneIcon, PenIcon, PlusIcon, PlusRounded, RhombusIcon, TestIcon, TrashIcon } from "../../assets";
import { BackButton } from "../../components/common/backButton";
import { message } from "antd";
import { useScreenWidth } from './../../providers/ScreenWidthProvider';

export default function CreateExam() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myInfo = useSelector((state) => state.users.list);

    const member_groups = useMemo(() => myInfo?.member_groups || [], [myInfo?.member_groups]);

    const windowWidth = useScreenWidth();

    const [qType, setQType] = useState("test");

    const [isHidden, setIsHidden] = useState(true);
    const [questionsList, setQestionsList] = useState([]);
    const [question, setQuestion] = useState({
        id: null,
        text: '',
        order: null,
        type: "test",
        answers: [] 
    });

    const [exam, setExam] = useState({
        title: '',
        time: 0,
        start_time: "",
        end_time: "",
        groups: [],
        type: "test", 
        questions: []
    });

    const trueData = Boolean(
        exam.title &&
        exam.time &&
        exam.start_time &&
        exam.end_time &&
        exam.groups.length &&
        exam.questions.length &&
        exam.type
    );

    useEffect(() => {
        setExam((prev) => ({
            ...prev,
            questions: questionsList
        }));
    }, [questionsList]);

    useEffect(() => {
        setExam((prev) => ({ ...prev, type: qType }));
        if (qType === "test") {
            setQuestion({
                id: null,
                text: '',
                order: null,
                type: "test",
                answers: []
            });
        } else {
            setQuestion({
                id: null,
                text: '',
                order: null,
                type: "write"
            });
        }
    }, [qType]);

    const handleTypeChange = useCallback((nextType) => {
        if (nextType === qType) return;

        if (questionsList.length > 0) {
            const ok = window.confirm(
                "Смена типа экзамена очистит текущие вопросы. Продолжить?"
            );
            if (!ok) return;

            setQestionsList([]);
        }
        setQType(nextType);
        setIsHidden(true);
    }, [qType, questionsList.length]);

    const handleSaveQuestion = useCallback(() => {
        if (!question.text.trim()) {
            message.warning("Название вопроса не может быть пустым!");
            return;
        }

        if (qType === 'test') {
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

        setQuestion((prev) => {
            const updatedQuestion = {
                ...prev,
                id: questionsList.length + 1,
                order: questionsList.length + 1,
                type: qType
            };

            setQestionsList((prevList) => [...prevList, updatedQuestion]);

            if (qType === 'test') {
                return {
                    id: null,
                    text: '',
                    order: null,
                    type: "test",
                    answers: []
                };
            } else {
                return {
                    id: null,
                    text: '',
                    order: null,
                    type: "write"
                };
            }
        });
        setIsHidden(true);
    }, [qType, question.answers, question.text, questionsList.length]);

    const handleDeleteQuestion = useCallback((id) => {
        setQestionsList((prev) => {
            const updated = prev.filter(item => item.id !== id)
                .map((item, idx) => ({ ...item, order: idx + 1, id: idx + 1 }));
            return updated;
        });
    }, []);

    const handleChangeGroups = useCallback((e, item) => {
        if (e.target.checked) {
            setExam((prev) => ({ ...prev, groups: [...prev.groups, item.id] }));
        } else {
            setExam((prev) => ({ ...prev, groups: prev.groups.filter(group => group !== item.id) }));
        }
    }, []);

    const handleMoveUp = useCallback((id) => {
        const index = questionsList.findIndex(item => item.id === id);
        if (index > 0) {
            const updatedQuestionsList = [...questionsList];
            const [movedItem] = updatedQuestionsList.splice(index, 1);
            updatedQuestionsList.splice(index - 1, 0, movedItem);

            const normalized = updatedQuestionsList.map((item, i) => ({ ...item, order: i + 1, id: i + 1 }));
            setQestionsList(normalized);
        }
    }, [questionsList]);

    const handleMoveDown = useCallback((id) => {
        const index = questionsList.findIndex(item => item.id === id);
        if (index < questionsList.length - 1) {
            const updatedQuestionsList = [...questionsList];
            const [movedItem] = updatedQuestionsList.splice(index, 1);
            updatedQuestionsList.splice(index + 1, 0, movedItem);

            const normalized = updatedQuestionsList.map((item, i) => ({ ...item, order: i + 1, id: i + 1 }));
            setQestionsList(normalized);
        }
    }, [questionsList]);

    const handleCreateExam = useCallback(() => {
        if (trueData) {
            const copyGroups = exam?.groups?.map(group => group.toString()) || [];

            const copyQuestions = exam.questions.map((q) => {
                if (qType === "write") {
                    const { answers, type, ...rest } = q;
                    return { ...rest };
                } else {
                    const { type, ...rest } = q;
                    return {
                        ...rest,
                        answers: (q.answers || []).map(a => ({ ...a }))
                    };
                }
            });

            const data = {
                title: exam.title,
                time: exam.time,
                start_time: exam.start_time,
                end_time: exam.end_time,
                groups: copyGroups,
            };

            if (qType === 'test') {
                data["questions"] = copyQuestions;
            } else {
                data["text_questions"] = copyQuestions;
            }

            dispatch(createExam(data))
                .unwrap()
                .then(() => {
                    navigate('/exams');
                })
                .catch((error) => {
                    console.log('Ошибка создания экзамена', error);
                    message.error('Ошибка создания экзамена');
                });
        }
    }, [exam, dispatch, navigate, trueData, qType]);

    return (
        <div className="w-full h-fit pt-[70px] box-border relative max-sm:mb-20">
            {windowWidth >= 640 && <BackButton />}
            <h1 className="text-5xl max-sm:text-3xl max-sm:font-medium max-sm:text-center max-sm:mt-5">Создание экзамена</h1>
            <div className="w-full h-[2px] bg-black rounded-lg mt-[30px]"></div>
            <div className="w-full h-fit lg mt-[30px] flex items-center justify-between max-sm:flex-col max-sm:gap-4">
                <div className="w-[60%] flex flex-col items-start max-sm:w-full">
                    <label className="font-medium" htmlFor="title">
                        Название:
                    </label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Название"
                        className="w-full h-[40px] border-gray-400 border-[1px] rounded-lg p-2 box-border outline-none text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0"
                        onInput={(e) => setExam((prev) => ({ ...prev, title: e.target.value }))}
                    />
                </div>
                <div className="w-[10%] flex flex-col items-start max-sm:w-full ">
                    <label className="font-medium" htmlFor="time">
                        Длительность:
                    </label>
                    <input
                        type="number"
                        id="time"
                        className="w-full h-[40px] border-gray-400 border-[1px] rounded-lg p-2 box-border appearance-none outline-none text-center"
                        placeholder="В минутах"
                        onInput={(e) => setExam((prev) => ({ ...prev, time: parseInt(e.target.value || "0", 10) || 0 }))}
                    />
                </div>
            </div>
            <div className="mt-[30px] w-full h-fit flex items-start justify-between max-sm:flex-col max-sm:items-center">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col items-start gap-1">
                        <span className="font-medium">Дата проведения:</span>
                        <DatePickerItem setExam={setExam} start_time={exam.start_time} end_time={exam.end_time} />
                    </div>
                    <div className="flex gap-6 items-center">
                        <div
                            className={classNames("w-40 h-20 rounded-xl border flex items-center justify-center cursor-pointer", {
                                'bg-gray-100 border-gray-200': qType === 'test',
                                'bg-transparent border-gray-200': qType !== 'test',
                            })}
                            onClick={() => handleTypeChange('test')}
                            title="Тестовые вопросы"
                        >
                            <TestIcon />
                        </div>
                        <div
                            className={classNames("w-40 h-20 rounded-xl border flex items-center justify-center cursor-pointer", {
                                'bg-gray-100 border-gray-200': qType === 'write',
                                'bg-transparent border-gray-200': qType !== 'write',
                            })}
                            onClick={() => handleTypeChange('write')}
                            title="Письменные вопросы"
                        >
                            <PenIcon className='w-10 h-10' />
                        </div>
                    </div>
                    <button
                        className="bg-gray-100 border border-gray-200 rounded-xl w-full h-[80px] flex flex-col items-center justify-center"
                        onClick={() => setIsHidden(false)}
                    >
                        <PlusIcon />
                        <span>Добавить вопрос</span>
                    </button>
                </div>
                <div className="flex flex-col items-start gap-1 max-sm:mt-5">
                    <span className="font-medium">Группы:</span>
                    <ul className="w-[300px] max-h-[210px] overflow-y-auto border border-black rounded-lg p-2 box-border">
                        {member_groups.map((item) => (
                            <li key={item.id} className="w-full p-1 box-border flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="appearance-none w-[15px] h-[15px] border border-black inline-block relative cursor-pointer rounded checked:bg-black"
                                    onInput={(e) => handleChangeGroups(e, item)}
                                />
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
                {questionsList.length !== 0 &&
                    <ul className="w-full h-fit flex flex-col gap-3  mt-[30px]">
                        {questionsList.map((item) => (
                            <li className="w-full py-2 px-4 box-border flex items-center justify-between bg-gray-100 rounded-lg" key={`${item.id}`}>
                                <h2 className="truncate max-w-[90%]">{item.id}. {item.text}</h2>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleDeleteQuestion(item.id)} title="Удалить">
                                        <TrashIcon />
                                    </button>
                                    <button onClick={() => handleMoveDown(item.id)} title="Вниз">
                                        <ArrowIcon />
                                    </button>
                                    <button onClick={() => handleMoveUp(item.id)} title="Вверх">
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
                                <button onClick={handleSaveQuestion} title="Сохранить вопрос">
                                    <DoneIcon />
                                </button>
                                <button
                                    onClick={() => {
                                        if (qType === "test") {
                                            setQuestion({
                                                id: null,
                                                text: '',
                                                order: null,
                                                type: "test",
                                                answers: []
                                            });
                                        } else {
                                            setQuestion({
                                                id: null,
                                                text: '',
                                                order: null,
                                                type: "write"
                                            });
                                        }
                                        setIsHidden(true);
                                    }}
                                    title="Отмена"
                                >
                                    <CrossIcon className='text-red-500' width={24} height={24} />
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

                            {qType === 'test' && (
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
                                                    title="Отметить как правильный"
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
            >
                Создать
            </button>
        </div>
    );
}