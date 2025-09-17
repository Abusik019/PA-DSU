import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExam, passExam } from '../../store/slices/exams';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import ExamTime from '../../components/common/examTime';
import Loader from '../../components/common/loader';
import { TimerIcon } from '../../assets';
import { ExamResult } from '../../components/layouts/ExamResult';

export default function PassExam() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const exam = useSelector((state) => state.exams.list);

    const   [activeQuestion, setActiveQuestion] = useState(1),
            [currentQuestion, setCurrentQuestion] = useState(null),
            [data, setData] = useState([]),
            [isEndedExam, setIsEndedExam] = useState(false),
            [resultData, setResultData] = useState({}),
            [isSubmitting, setIsSubmitting] = useState(false),
            [qType, setQType] = useState("");

    const timeoutRef = useRef(null);

    useEffect(() => {
        if (Array.isArray(exam?.text_questions) && exam.text_questions.length > 0) {
            setQType('write');
        } else {
            setQType('test');
        }
    }, [exam]);

    // Текущий массив вопросов по типу
    const questionsArray = useMemo(
        () => (qType === 'write' ? (exam?.text_questions || []) : (exam?.questions || [])),
        [exam, qType]
    );

    // Кол-во и список номеров вопросов
    const quantity_questions = useMemo(
        () => Array.from({ length: questionsArray.length }, (_, index) => index + 1),
        [questionsArray.length]
    );

    const hasQuestions = useMemo(
        () => Array.isArray(questionsArray) && questionsArray.length > 0,
        [questionsArray]
    );

    // Раздельный ключ хранилища
    const STORAGE_KEY = useMemo(() => `examData:${id}:${qType}`, [id, qType]);

    // Блокировка завершения
    const isDisabledFinish = useMemo(() => {
        if (qType === 'test') {
            return data.some(item => item.answer_id === null || item.answer_id === undefined);
        }
        return data.some(item => !String(item.text || '').trim());
    }, [data, qType]);

    // Payload результата
    const result = useMemo(
        () => ({
            choise_questions: data
                .filter(item => item.answer_id !== null && item.answer_id !== undefined)
                .map(item => ({
                    question_id: Number(item.question_id),
                    answer_id: Number(item.answer_id)
                })),
            text_questions: data
                .filter(item => typeof item.text === 'string' && item.text.trim().length > 0)
                .map(item => ({
                    question_id: Number(item.question_id),
                    text: String(item.text).trim()
                }))
        }),
        [data]
    );

    useEffect(() => {
        if (id) dispatch(getExam(id));
    }, [dispatch, id]);

    // Инициализация ответов
    useEffect(() => {
        if (!hasQuestions) return;

        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (Array.isArray(parsed)) {
                    setData(parsed);
                    return;
                }
            } catch {console.log('Ошибка парсинга сохранённых данных');}
        }

        // Создаём по типу
        if (qType === 'test') {
            setData(questionsArray.map(q => ({
                question_id: q.id,
                answer_id: null
            })));
        } else {
            setData(questionsArray.map(q => ({
                question_id: q.id,
                text: ''
            })));
        }
    }, [questionsArray, hasQuestions, qType, STORAGE_KEY]);

    // Таймер
    useEffect(() => {
        if (exam?.time && hasQuestions) {
            const timeInMilliseconds = exam.time * 60000;
            timeoutRef.current = setTimeout(() => {
                handleSubmitExam();
            }, timeInMilliseconds);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exam?.time, hasQuestions]);

    const getQuestionByNumber = useCallback((num) => {
        let q = questionsArray.find(item => item.order === num);
        if (!q) q = questionsArray[num - 1] || null;
        return q;
    }, [questionsArray]);

    useEffect(() => {
        if (!hasQuestions) {
            setCurrentQuestion(null);
            return;
        }
        setCurrentQuestion(getQuestionByNumber(activeQuestion));
    }, [getQuestionByNumber, activeQuestion, hasQuestions]);

    useEffect(() => {
        if (isEndedExam) {
            localStorage.removeItem('examData');
            localStorage.removeItem('examStartTime');
            localStorage.removeItem('examTimeLeft');
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [isEndedExam, STORAGE_KEY]);

    const persistData = useCallback((updated) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }, [STORAGE_KEY]);

    const handleChooseAnswer = useCallback((qID, ansID) => {
        if (qType !== 'test') return;
        setData(prev => {
            const updated = prev.map(item => item.question_id === qID ? { ...item, answer_id: ansID } : item);
            persistData(updated);
            return updated;
        });
    }, [qType, persistData]);

    const handleTextAnswerChange = useCallback((qID, textVal) => {
        if (qType !== 'write') return;
        setData(prev => {
            const updated = prev.map(item => item.question_id === qID ? { ...item, text: textVal } : item);
            persistData(updated);
            return updated;
        });
    }, [qType, persistData]);

    const handleSubmitExam = useCallback(() => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        dispatch(passExam({ id, exam: result }))
            .unwrap()
            .then((data) => {
                setIsEndedExam(true);
                setResultData(data);
            })
            .catch((error) => {
                console.log('Ошибка прохождения экзамена', error);
            })
            .finally(() => setIsSubmitting(false));
    }, [dispatch, id, result, isSubmitting]);

    if (!exam || (!Array.isArray(exam?.questions) && !Array.isArray(exam?.text_questions))) {
        return <Loader />;
    }
    if (!hasQuestions) {
        return <Loader />;
    }

    return (
        <>
            {isEndedExam ? <ExamResult resultData={resultData} qType={qType}/> : (
                <div className='w-full min-h-full h-fit pt-10 box-border flex items-start flex-col gap-10 relative max-sm:mt-10 max-sm:pb-32'>
                    <div className='w-full h-fit'>
                        <h1 className='text-lg'>Экзамен начался!</h1>
                        <h2 className='text-5xl mt-5 font-medium'>{exam?.title}</h2>
                        <div className='mt-5 w-full flex items-center justify-between'>
                            <ul className='w-fit flex-wrap flex items-center gap-3 ml-1'>
                                {quantity_questions.map((num, index) => {
                                    const question = getQuestionByNumber(num);
                                    const questionData = question ? data.find(d => d.question_id === question.id) : undefined;
                                    const hasAnswer = qType === 'test'
                                        ? (questionData?.answer_id !== null && questionData?.answer_id !== undefined)
                                        : !!String(questionData?.text || '').trim();

                                    return (
                                        <li 
                                            key={index}
                                            onClick={() => setActiveQuestion(num)}
                                            className={classNames(
                                                'flex justify-center items-center rounded-full w-[30px] h-[30px] font-medium cursor-pointer',
                                                {
                                                    'bg-blue-500 text-white': hasAnswer, 
                                                    'bg-gray-200 text-black': !hasAnswer
                                                }
                                            )}
                                        >
                                            {num}
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className='flex items-center gap-3'>
                                <TimerIcon />
                                <ExamTime time={exam && exam.time}/>
                            </div>
                        </div>
                        <div className="w-full h-[2px] bg-black mt-5"></div> 
                    </div>
                    <div className="w-full h-fit flex items-start flex-col">
                        <h2 className='text-3xl'>
                            {activeQuestion}. {currentQuestion?.text}
                        </h2>

                        {qType === 'test' ? (
                            <ul className='flex flex-col gap-4 mt-8'>
                                {currentQuestion?.answers?.length !== 0 && currentQuestion?.answers?.map((item, index) => {
                                    const letter = String.fromCharCode(65 + index);
                                    const selectedId = data.find(d => d.question_id === currentQuestion.id)?.answer_id;
                                    return (
                                        <li key={item.id} className='flex items-center gap-4'>
                                            <span className='w-9 h-9 rounded-full pt-1 box-border bg-[#F3EBE5] flex item-center justify-center text-center text-lg font-semibold'>{letter}</span>
                                            <h3
                                                onClick={() => handleChooseAnswer(currentQuestion.id, item.id)}
                                                className={classNames('text-lg px-4 py-1 box-border rounded-3xl cursor-pointer', {
                                                    'bg-blue-500 text-white': selectedId === item.id,
                                                    'bg-gray-100 text-black': selectedId !== item.id
                                                })}
                                            >
                                                {item.text}
                                            </h3>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <textarea
                                className='w-full min-h-[180px] mt-6 p-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500'
                                placeholder='Введите ваш ответ...'
                                value={data.find(d => d.question_id === currentQuestion?.id)?.text || ''}
                                onChange={(e) => currentQuestion && handleTextAnswerChange(currentQuestion.id, e.target.value)}
                            />
                        )}

                        {activeQuestion === quantity_questions.length && 
                            <button 
                                className={classNames('absolute bottom-3 right-3 py-2 px-6 box-border bg-blue-500 text-white font-medium rounded-lg', {
                                    'opacity-50 cursor-not-allowed': isDisabledFinish || isSubmitting,
                                    'hover:bg-blue-600': !isDisabledFinish && !isSubmitting
                                })}
                                disabled={isDisabledFinish || isSubmitting}
                                onClick={handleSubmitExam}
                            >
                                Завершить
                            </button>
                        }
                    </div>
                </div>
            )}
        </>
    )
}