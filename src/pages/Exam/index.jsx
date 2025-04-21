import { BackButton } from "./../../components/layouts/BackButton";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { getExam, getResultsByExam } from "../../store/slices/exams";
import { Link, useParams } from "react-router-dom";
import UpdateExam from './../UpdateExam';
import classNames from "classnames";
import Modal from "../../components/layouts/Modal";

import editImg from '../../assets/icons/edit.svg';
import dateImg from '../../assets/icons/date.svg';
import clockImg from '../../assets/icons/clock.svg';
import questionImg from '../../assets/icons/question.svg';
import quizzImg from '../../assets/icons/quizz.svg';
import userImg from '../../assets/icons/user.svg';

export default function Exam() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const myInfo = useSelector((state) => state.users.list);
    const exam = useSelector((state) => state.exams.list);
    const result = useSelector((state) => state.exams.result);
    const [isEdit, setIsEdit] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);

    const isDisabledBtn = !(!exam.is_ended || result.score);

    useEffect(() => {
        dispatch(getExam(id));
        dispatch(getResultsByExam(id))
    }, [id, dispatch])

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "";
        const date = new Date(dateTime);
        const hours = date.getHours().toString().padStart(2, "0"); 
        const minutes = date.getMinutes().toString().padStart(2, "0"); 
        const day = date.getDate().toString().padStart(2, "0"); 
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); 
        const year = date.getFullYear();
    
        return `${hours}:${minutes} ${day}-${month}-${year}`;
    };

    return (
        <>
            {!isEdit ? (
                <div className="w-full h-full flex flex-col items-center justify-between relative pt-[150px] pb-[50px] box-border">
                    <BackButton />
                    {myInfo.is_teacher && (
                        <>
                            <button
                                className="absolute right-0 top-[20px]"
                                onClick={() => setIsEdit(true)}
                            >
                                <img src={editImg} width={24} height={24} alt="edit" />
                            </button>
                            <button
                                className="absolute right-[45px] top-[20px]"
                                onClick={() => setIsOpenModal(true)}
                            >
                                <img src={quizzImg} width={24} height={24} alt="quizz" />
                            </button>
                        </>
                    )}
                    <div className="text-center">
                        <h2 className="text-5xl font-medium">{exam?.title}</h2>
                        <h3 className="text-2xl mt-3 text-gray-500">{exam?.author?.first_name} {exam?.author?.last_name}</h3>
                    </div>
                    <ul className="p-4 box-border border border-gray-400 rounded-lg flex flex-col gap-4">
                        <li className="flex items-center gap-3">
                            <img 
                                src={dateImg} 
                                width={24}
                                height={24}
                                alt="date" 
                            />
                            <h2> {formatDateTime(exam?.start_time)} - {formatDateTime(exam?.end_time)}</h2>
                        </li>
                        <li className="flex items-center gap-3">
                            <img 
                                src={clockImg} 
                                width={24}
                                height={24}
                                alt="clock" 
                            />
                            <h2>Время на экзамен: {exam?.time} мин.</h2>
                        </li>
                        <li className="flex items-center gap-3">
                            <img 
                                src={questionImg} 
                                width={24}
                                height={24}
                                alt="question" 
                            />
                            <h2>Количество вопросов: {exam?.quantity_questions}</h2>
                        </li>
                    </ul>
                    {!myInfo?.is_teacher ? 
                        <Link
                            to={isDisabledBtn ? "#" : `/pass-exam/${id}`} 
                            className={classNames("self-end bg-black text-white rounded-lg py-2 box-border w-[150px] font-medium text-center", {
                                'opacity-40 cursor-not-allowed': isDisabledBtn,
                            })}
                        >Начать</Link> 
                        : 
                        <button></button>
                    }
                    <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                        <div className="w-[500px] flex flex-col items-center">
                            <h2 className="text-2xl font-medium">Прошли экзамен</h2>
                            <ul className="w-full max-h-[400px] overflow-y-auto flex flex-col items-center mt-6">
                                {(result.length !== 0 && Array.isArray(result)) && result.map(item => (
                                    <li className="w-full flex items-center justify-between border-b-[2px] border-black pt-5 pb-2 px-2" key={item.id}>
                                        <div className="w-full flex items-center gap-2 max-w-[90%">
                                            <img 
                                                src={userImg}
                                                width={36}
                                                height={36} 
                                                alt="user" 
                                            />
                                            <h3 className="font-medium text-lg max-w-[100%] truncate">{item?.student?.first_name} {item?.student?.last_name}</h3>
                                        </div>
                                        <h4 className="w-10 h-10 pb-1 flex items-center justify-center text-2xl font-semibold box-border border-2 border-black rounded-lg">{item?.score}</h4>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Modal>
                </div>
            ) : (
                <UpdateExam examData={exam || []}/>
            )}
        </>
    );
}
