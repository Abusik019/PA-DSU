import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from "react";
import { getExam, getResultExamByUser, getResultsByExam } from "../../store/slices/exams";
import { Link, useParams } from "react-router-dom";
import UpdateExam from './../UpdateExam';
import classNames from "classnames";
import Loader from "../../components/common/loader";
import { CalendarIcon, ClockIcon, PenIcon, QuestionIcon, QuizzIcon, UserIcon } from "../../assets";
import { BackButton } from '../../components/common/backButton';
import Modal from '../../components/layouts/Modal';

export default function Exam() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const myInfo = useSelector((state) => state.users.list);
    const exam = useSelector((state) => state.exams.list);
    const results = useSelector((state) => state.exams.result);
    const loading = useSelector((state) => state.exams.loading);

    const [isEdit, setIsEdit] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);

    // Мемоизация результата студента
    const studentResult = useMemo(() => (
        Array.isArray(results) && results.length > 0
            ? results.find(item => Number(item.exam_id) === Number(id))
            : null
    ), [results, id]);

    // Кнопка "Начать" доступна только если экзамен завершён или нет результата
    const isDisabledBtn = !(exam.is_ended || !studentResult?.score);

    useEffect(() => {
        dispatch(getExam(id));
        if (myInfo.is_teacher) {
            dispatch(getResultsByExam(id));
        } else {
            dispatch(getResultExamByUser(myInfo.id));
        }
    }, [id, dispatch, myInfo.id, myInfo.is_teacher]);

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

    // Мемоизация списка результатов для модалки
    const examResults = useMemo(() => (
        Array.isArray(results) ? results : []
    ), [results]);

    if (loading) {
        return <Loader />;
    }

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
                                title="Редактировать экзамен"
                            >
                                <PenIcon width={24} height={24} />
                            </button>
                            <button
                                className="absolute right-[45px] top-[20px]"
                                onClick={() => setIsOpenModal(true)}
                                title="Результаты экзамена"
                            >
                                <QuizzIcon width={24} height={24} />
                            </button>
                        </>
                    )}
                    <div className="text-center">
                        <h2 className="text-5xl font-medium">{exam?.title}</h2>
                        <h3 className="text-2xl mt-3 text-gray-500">{exam?.author?.first_name} {exam?.author?.last_name}</h3>
                    </div>
                    <ul className="p-4 box-border border border-gray-400 rounded-lg flex flex-col gap-4">
                        <li className="flex items-center gap-3">
                            <CalendarIcon />
                            <h2> {formatDateTime(exam?.start_time)} - {formatDateTime(exam?.end_time)}</h2>
                        </li>
                        <li className="flex items-center gap-3">
                            <ClockIcon />
                            <h2>Время на экзамен: {exam?.time} мин.</h2>
                        </li>
                        <li className="flex items-center gap-3">
                            <QuestionIcon />
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
                        <span />
                    }
                    <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                        <div className="w-[500px] flex flex-col items-center">
                            <h2 className="text-2xl font-medium">Прошли экзамен</h2>
                            <ul className="w-full max-h-[400px] overflow-y-auto flex flex-col items-center mt-6">
                                {examResults.length > 0 ? examResults.map(item => (
                                    <li className="w-full flex items-center justify-between border-b-[2px] border-black pt-5 pb-2 px-2" key={item.id}>
                                        <div className="w-full flex items-center gap-2 max-w-[90%]">
                                            <UserIcon width={36} height={36} />
                                            <h3 className="font-medium text-lg max-w-[100%] truncate">{item?.student?.first_name} {item?.student?.last_name}</h3>
                                        </div>
                                        <h4 className="w-10 h-10 pb-1 flex items-center justify-center text-2xl font-semibold box-border border-2 border-black rounded-lg">{item?.score}</h4>
                                    </li>
                                )) : <div className="w-full flex items-center justify-center py-5">Нет результатов</div>}
                            </ul>
                        </div>
                    </Modal>
                </div>
            ) : (
                <UpdateExam examData={exam || {}}/>
            )}
        </>
    );
}
