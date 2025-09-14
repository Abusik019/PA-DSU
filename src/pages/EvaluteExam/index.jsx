import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import { getPassedAnswersByUser, getResultExamByUser, updateResult } from "../../store/slices/exams";
import { QuestionCircleFilled } from "@ant-design/icons";
import Loader from './../../components/common/loader';
import DoneIcon from './../../assets/icons/done/DoneIcon';
import classNames from "classnames";

export default function EvaluteExam() {
    const { userID, examID } = useParams();

    const   [score, setScore] = useState(null),
            [ results, setResults] = useState(null);
    
    const answers = useSelector((state) => state.exams.result);

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.exams);

    const navigate = useNavigate();

    useEffect(() => {
        if(!userID && !examID) return;

        dispatch(getPassedAnswersByUser({ userID, examID })).unwrap();
        dispatch(getResultExamByUser(userID)).unwrap()
            .then((res) => {
                setResults(res);
            })
            .catch((error) => {
                console.log("Ошибка получения результатов: ", error);
            })
    }, [dispatch, examID, userID]);

    function handleSetResult(){
        const result = results.find(item => item.exam_id == examID);

        dispatch(updateResult({ resultID: result.id, score})).unwrap();
        navigate('/exams')
    }

    if(loading){
        return <Loader />
    }

    return (
        <div className="w-full h-fit">
            <h1 className="text-5xl mt-10">Оценка экзамена</h1>
            {answers?.passed_text_answers?.length && (
                <ul className="mt-24 flex flex-col items-start gap-10">
                    {answers?.passed_text_answers.map((item) => (
                        <li key={item.id}>
                            <div className="flex items-center justify-start gap-2">
                                <QuestionCircleFilled className="text-red-400"/>
                                <h2 className="text-md font-bold">{item.question.text}</h2>
                            </div>
                            <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 box-border flex items-start justify-start gap-3 mt-5 h-fit">
                                <DoneIcon className="min-w-5 min-h-5"/>
                                <p>{item.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <div className="mt-24 w-full flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-medium">Оценка: </h3>
                    <ul className="flex items-center gap-2">
                        {[2, 3, 4, 5].map((item, id) => (
                            <li 
                                key={id}
                                onClick={() => setScore(item)}
                                className={classNames("w-7 h-7 text-white font-semibold flex items-center justify-center rounded-full cursor-pointer", {
                                    'bg-blue-500': score == item,
                                    'bg-gray-300': score !== item,
                                })}
                            >{item}</li>
                        ))}
                    </ul>
                </div>
                <button onClick={handleSetResult} disabled={!score} className="bg-blue-500 text-white font-medium rounded-md px-2 py-1 box-border disabled:bg-gray-300 disabled:cursor-not-allowed">Выставить</button>
            </div>
        </div>
    )
}
