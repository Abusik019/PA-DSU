import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExam, passExam } from '../../store/slices/exams';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { ExamResult } from '../../components/layouts/examResult';
import ExamTime from '../../components/common/examTime';

import clockImg from '../../assets/icons/clock-quarter.svg';

export default function PassExam() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const exam = useSelector((state) => state.exams.list);
    
    const [activeQuestion, setActiveQuestion] = useState(1);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [data, setData] = useState([]);
    const [isEndedExam, setIsEndedExam] = useState(false);

    const quantity_questions = exam?.quantity_questions ? Array.from({ length: exam.quantity_questions }, (_, index) => index + 1) : [];
    const isValidArray = exam?.questions && Array.isArray(exam.questions) && exam.questions.length !== 0;
    const isDisabledFinish = data.some(item => item.answer_id === null || item.answer_id === undefined);
    const result = {
        choise_questions: [...data]
    };

    useEffect(() => {
        const savedData = localStorage.getItem('examData');
        if (savedData) {
            setData(JSON.parse(savedData));
        } else if (isValidArray) {
            setData(exam.questions.map(item => ({
                question_id: item.id,
                answer_id: null
            })));
        }
    }, [exam]);

    useEffect(() => {
        dispatch(getExam(id));
        if (exam.time) {
            const timeInMilliseconds = exam.time * 60000;
            setTimeout(() => {
                dispatch(passExam({ id, exam: result}));
                setIsEndedExam(true);
                localStorage.removeItem('examData');
                localStorage.removeItem('examStartTime');
                localStorage.removeItem('examTimeLeft');
            }, timeInMilliseconds);
        }
    }, []);

    useEffect(() => {
        if (isValidArray) {
            const q = exam.questions.find((item) => item.order === activeQuestion);
            setCurrentQuestion(q);
        } else {
            setCurrentQuestion(null); 
        }
    }, [exam, activeQuestion]);

    function handleChooseAnswer(qID, ansID) {
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
    }

    function handleSubmitExam(){
        dispatch(passExam({ id, exam: result}));
        setIsEndedExam(true);
        localStorage.removeItem('examData');
        localStorage.removeItem('examStartTime');
        localStorage.removeItem('examTimeLeft');
    }

    console.log(exam);

    return (
        <>
            {isEndedExam ? <ExamResult /> : (
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
                                <img 
                                    src={clockImg}
                                    width={36}
                                    height={36} 
                                    alt="clock" 
                                />
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
                                    'opacity-50 cursor-not-allowed': isDisabledFinish,
                                    'hover:bg-blue-600': !isDisabledFinish 
                                })}
                                disabled={isDisabledFinish}
                                onClick={handleSubmitExam}
                            >Завершить</button>
                        }
                    </div>
                </div>
            )}
        </>
    )
}
