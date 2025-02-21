import { BackButton } from "./../../components/layouts/BackButton";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { getExam } from "../../store/slices/exams";
import { useParams } from "react-router-dom";

import editImg from '../../assets/icons/edit.svg';
import dateImg from '../../assets/icons/date.svg';
import clockImg from '../../assets/icons/clock.svg';
import questionImg from '../../assets/icons/question.svg';
import UpdateExam from "../UpdateExam";

export default function Exam() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const myInfo = useSelector((state) => state.users.list);
    const exam = useSelector((state) => state.exams.list);
    const loading = useSelector((state) => state.exams.list);
    const error = useSelector((state) => state.exams.list);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        dispatch(getExam(id))
    }, [id, dispatch])

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "";
        const date = new Date(dateTime);
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        const day = date.getUTCDate().toString().padStart(2, "0");
        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
        const year = date.getUTCFullYear();
        return `${hours}:${minutes} ${day}-${month}-${year}`;
    };

    console.log(isEdit);

    return (
        <>
            {!isEdit ? (
                <div className="w-full h-full flex flex-col items-center justify-between relative pt-[150px] pb-[50px] box-border">
                    <BackButton />
                    {myInfo.is_teacher && (
                        <button
                            className="absolute right-0 top-[20px]"
                            onClick={() => setIsEdit(true)}
                        >
                            <img src={editImg} width={24} height={24} alt="edit" />
                        </button>
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
                            <h2>Время на экзамен: {exam?.time} минут(а)</h2>
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
                    <button className="self-end bg-black text-white rounded-lg py-2 box-border w-[150px] font-medium">Начать</button>
                </div>
            ) : (
                <UpdateExam examData={exam || []}/>
            )}
        </>
    );
}
