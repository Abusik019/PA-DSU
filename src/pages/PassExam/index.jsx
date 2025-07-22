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

    const [activeQuestion, setActiveQuestion] = useState(1);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [data, setData] = useState([]);
    const [isEndedExam, setIsEndedExam] = useState(false);
    const [resultData, setResultData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const timeoutRef = useRef(null);

    const quantity_questions = useMemo(
        () => exam?.quantity_questions ? Array.from({ length: exam.quantity_questions }, (_, index) => index + 1) : [],
        [exam?.quantity_questions]
    );
    const isValidArray = useMemo(
        () => exam?.questions && Array.isArray(exam.questions) && exam.questions.length !== 0,
        [exam?.questions]
    );
    const isDisabledFinish = useMemo(
        () => data.some(item => item.answer_id === null || item.answer_id === undefined),
        [data]
    );
    const result = useMemo(
        () => ({
            choise_questions: data
                .filter(item => item.answer_id !== null && item.answer_id !== undefined)
                .map(item => ({
                    question_id: Number(item.question_id),
                    answer_id: Number(item.answer_id)
                }))
        }),
        [data]
    );

    useEffect(() => {
        if (id) dispatch(getExam(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (!isValidArray) return;
        const savedData = localStorage.getItem('examData');
        if (savedData) {
            setData(JSON.parse(savedData));
        } else {
            setData(exam.questions.map(item => ({
                question_id: item.id,
                answer_id: null
            })));
        }
    }, [exam, isValidArray]);

    // Таймер экзамена
    useEffect(() => {
        if (exam.time && isValidArray) {
            const timeInMilliseconds = exam.time * 60000;
            timeoutRef.current = setTimeout(() => {
                handleSubmitExam();
            }, timeInMilliseconds);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
        // eslint-disable-next-line
    }, [exam.time, isValidArray]);

    // Текущий вопрос
    useEffect(() => {
        if (isValidArray) {
            const q = exam.questions.find((item) => item.order === activeQuestion);
            setCurrentQuestion(q);
        } else {
            setCurrentQuestion(null); 
        }
    }, [exam, activeQuestion, isValidArray]);

    // Очистка localStorage при завершении экзамена
    useEffect(() => {
        if (isEndedExam) {
            localStorage.removeItem('examData');
            localStorage.removeItem('examStartTime');
            localStorage.removeItem('examTimeLeft');
        }
    }, [isEndedExam]);

    const handleChooseAnswer = useCallback((qID, ansID) => {
        setData((prev) => {
            const updatedData = prev.map(item => {
                if (item.question_id === qID) {
                    return { ...item, answer_id: ansID };
                }
                return item;
            });
            localStorage.setItem('examData', JSON.stringify(updatedData));
            return updatedData;
        });
    }, []);

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

    if (!exam?.questions) {
        return <Loader />;
    }

    return (
        <>
            {isEndedExam ? <ExamResult resultData={resultData}/> : (
                <div className='w-full min-h-full h-fit pt-10 box-border flex items-start flex-col gap-10 relative'>
                    <div className='w-full h-fit'>
                        <h1 className='text-lg'>Экзамен начался!</h1>
                        <h2 className='text-5xl mt-5 font-medium'>{exam?.title}</h2>
                        <div className='mt-5 w-full flex items-center justify-between'>
                            <ul className='w-fit flex-wrap flex items-center gap-3 ml-1'>
                                {quantity_questions.map((item, index) => {
                                    const question = exam.questions.find(q => q.order === item);
                                    const questionData = data.find(d => d.question_id === question?.id);
                                    const hasAnswer = questionData?.answer_id !== null && questionData?.answer_id !== undefined;

                                    return (
                                        <li 
                                            key={index}
                                            onClick={() => setActiveQuestion(item)}
                                            className={classNames(
                                                'flex justify-center items-center rounded-full w-[30px] h-[30px] font-medium cursor-pointer',
                                                {
                                                    'bg-blue-500 text-white': hasAnswer, 
                                                    'bg-gray-200 text-black': !hasAnswer
                                                }
                                            )}
                                        >
                                            {item}
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
                    <div 
                        className="w-full h-fit flex items-start flex-col"
                    >
                        <h2 className='text-3xl'>{currentQuestion?.order}. {currentQuestion?.text}</h2>
                        <ul className='flex flex-col gap-4 mt-8'>
                            {currentQuestion?.answers?.length !== 0 && currentQuestion?.answers.map((item, index) => {
                                const letter = String.fromCharCode(65 + index); 
                                return (
                                    <li key={item.id} className='flex items-center gap-4'>
                                        <span className='w-9 h-9 rounded-full pt-1 box-border bg-[#F3EBE5] flex item-center justify-center text-center text-lg font-semibold'>{letter}</span> 
                                        <h3 
                                            onClick={() => handleChooseAnswer(currentQuestion.id, item.id)} 
                                            className={classNames('text-lg px-4 py-1 box-border rounded-3xl cursor-pointer', {
                                                'bg-blue-500 text-white': data.find(d => d.question_id === currentQuestion.id)?.answer_id === item.id,
                                                'bg-gray-100 text-black': data.find(d => d.question_id === currentQuestion.id)?.answer_id !== item.id
                                            })}
                                        >{item.text}</h3>
                                    </li>
                                );
                            })}
                        </ul>
                        {currentQuestion?.order === exam?.quantity_questions && 
                            <button 
                                className={classNames('absolute bottom-3 right-3 py-2 px-6 box-border bg-blue-500 text-white font-medium rounded-lg', {
                                    'opacity-50 cursor-not-allowed': isDisabledFinish || isSubmitting,
                                    'hover:bg-blue-600': !isDisabledFinish && !isSubmitting
                                })}
                                disabled={isDisabledFinish || isSubmitting}
                                onClick={handleSubmitExam}
                            >Завершить</button>
                        }
                    </div>
                </div>
            )}
        </>
    )
}
