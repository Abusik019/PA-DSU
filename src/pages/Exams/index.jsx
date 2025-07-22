import styles from "./style.module.scss";
import ActionButton from "../../components/common/groupsAction";
import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classNames from 'classnames';
import Loader from './../../components/common/loader';
import { useOutsideClick } from './../../utils';
import { deleteExam, getGroupExams, getResultExamByUser, getTeacherExams } from "../../store/slices/exams";
import { ArrowIcon, OpenIcon, PlusRounded, QuizzIcon, TrashIcon, UserInfoIcon } from "../../assets";
import NotData from "../../components/layouts/NotData";
import { Dropdown } from '../../components/common/dropdown';
import Modal from "../../components/layouts/Modal";

export default function Exams() {
    const dispatch = useDispatch();
    const dropdownRef = useRef(null);

    const   myInfo = useSelector((state) => state.users.list),
            list = useSelector((state) => state.exams.list),
            results = useSelector((state) => state.exams.result),
            loading = useSelector((state) => state.exams.loading);
            
    const   [isFilterDropdown, setIsFilterDropdown] = useState(false),
            [filter, setFilter] = useState({
                up: false,
                down: false
            }),
            [searchValue, setSearchValue] = useState(''),
            [isOpenModal, setIsOpenModal] = useState(false);

    const groupId = myInfo?.member_groups?.length ? myInfo.member_groups[0].id : null;

    useEffect(() => {        
        if (!myInfo.id) return;
        if(myInfo.is_teacher){
            dispatch(getTeacherExams(myInfo.id));
        } else{
            dispatch(getResultExamByUser(myInfo.id));
            if (groupId) {
                dispatch(getGroupExams(groupId));
            }
        }
    }, [dispatch, groupId, myInfo.id, myInfo.is_teacher]);

    useOutsideClick(dropdownRef, () => setIsFilterDropdown(false));

    // Мемоизированная фильтрация и сортировка экзаменов
    const filteredArray = useMemo(() => {
        if (!list.length) return [];
        let sortedList = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        if (filter.up) {
            sortedList = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (filter.down) {
            sortedList = [...list].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
        const regex = new RegExp(searchValue, 'gi');
        return sortedList.filter(item => regex.test(item.title));
    }, [filter, list, searchValue]);
    
    const handleDeleteExam = (id) => {
        if(!id) return;

        try {
            dispatch(deleteExam(id));
        } catch (error) {
            console.error("Ошибка удаления экзамена:", error);
        }
    }

    const handleReturnResultExam = (id) => {
        const found = results.find(item => item.id === id);
        return found ? found.score : '';
    }

    if(loading){
        return <Loader />
    }

    return (
        <div className="w-full h-full flex flex-col justify-start gap-[40px] items-center pt-[100px] box-border">
            <div className="w-full flex flex-col gap-5 items-start">
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-5xl">Экзамены</h1>
                    <input 
                        className={styles.search} 
                        type="search" 
                        placeholder="Поиск экзамена..." 
                        onInput={(e) => setSearchValue(e.target.value)}
                    />
                    {myInfo.is_teacher && 
                        <Link to="/create-exam">
                            <PlusRounded width={28} height={28} />
                        </Link>
                    }
                    {(!myInfo.is_teacher && results.length !== 0) && 
                        <button title="Список пройденных экзаменов" onClick={() => setIsOpenModal(true)}>
                            <UserInfoIcon />
                        </button>
                    }
                </div>
                <div className="w-full flex justify-between items-center relative">
                    <ActionButton
                        onClick={() => setIsFilterDropdown(true)}
                        label="Сортировать"
                        disabled={isFilterDropdown}
                    />
                    <Dropdown maxHeight="130px" isOpen={isFilterDropdown} dropdownRef={dropdownRef}>
                        <h2 className="text-base font-semibold">По дате:</h2>
                        <div className="flex items-center justify-center gap-3 w-full">
                            <button 
                                onClick={() => setFilter({down: false, up: true})}
                                className={classNames("p-1 box-border border-[2px] rounded-md", {
                                    "border-black": filter.up,
                                })}
                            >
                                <ArrowIcon width={36} height={36}/>
                            </button>
                            <button 
                                onClick={() => setFilter({down: true, up: false})}
                                className={classNames("p-1 box-border border-[2px] rounded-md", {
                                    "border-black": filter.down,
                                })}
                            >
                                <ArrowIcon className='rotate-180' width={36} height={36} />
                            </button>
                        </div>
                    </Dropdown>
                    <button
                        className={styles.resetBtn}
                        onClick={() => setFilter({down: false, up: false})}
                    >
                        Сброс
                    </button>
                </div>
                <div className="w-full h-[2px] bg-black"></div>
            </div>
            <div
                style={{ height: "calc(100% - 164px)" }}
                className="w-full overflow-y-auto"
            >
                <table className="w-full">
                    {filteredArray.length !== 0 && (
                        <thead>
                            <tr className="text-left bg-black text-white rounded-lg">
                                <th className="font-medium py-2 pl-6 box-border rounded-s-lg">
                                    Дата проведения
                                </th>
                                <th className="font-medium py-2 box-border">
                                    Название
                                </th>
                                <th className="font-medium py-2 box-border">
                                    Количество вопросов
                                </th>
                                <th className="font-medium py-2 box-border">
                                    Преподаватель
                                </th>
                                <th className="rounded-e-lg"></th>
                            </tr>
                        </thead>
                    )}
                    <tbody className="relative">
                        {filteredArray.length !== 0 ?
                            filteredArray.map((item) => (
                                <tr
                                    key={item.id}
                                    className="h-[90px] border-b-2 border-gray-300 transition-all hover:bg-gray-100"
                                >
                                    <td className="pl-6 box-border">
                                        <span><b>Начало:</b> {item?.start_time.match(/\d\d\d\d-\d\d-\d\d/)}</span>
                                        <br />
                                        <span><b>Конец:</b> {item?.end_time.match(/\d\d\d\d-\d\d-\d\d/)}</span>
                                    </td>
                                    <td className="py-2 box-border">
                                        {item?.title}
                                    </td>
                                    <td className="py-2 box-border pl-20 font-semibold text-xl">
                                        {item?.quantity_questions}
                                    </td>
                                    <td className="py-2 box-border pl-10">
                                        <img 
                                            src={item?.author?.image} 
                                            alt="teacher avatar" 
                                            className="w-12 h-12 object-cover rounded-full"
                                        />
                                    </td>
                                    <td className="pr-2 box-border flex items-center justify-center gap-4 h-[90px]">
                                        {myInfo?.is_teacher &&  
                                            <button onClick={() => handleDeleteExam(item.id)}>
                                                <TrashIcon width={24} height={24} />
                                            </button>
                                        }
                                        <Link to={`/exams/${item.id}`}>
                                            <OpenIcon />
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5}>
                                        <NotData text="Экзаменов пока нет"/>
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                <div className="w-[500px] flex flex-col items-center">
                    <h2 className="text-2xl font-medium">Пройденные экзамены</h2>
                    <ul className="w-full max-h-[400px] overflow-y-auto flex flex-col items-center mt-6">
                        {(results.length !== 0 && Array.isArray(results)) && results.map(item => {
                            const titleExam = list.length && list.find(exam => exam.id === item.exam_id);
                             
                            return (
                                <li className="w-full flex items-center justify-between border-b-[2px] border-black pt-5 pb-2 px-2" key={item.id}>
                                    <div className="w-full flex items-center gap-2">
                                        <QuizzIcon width={36} height={36} />
                                        <div className="max-w-[70%]">
                                            <h2 className="text-lg font-medium max-w-[100%] truncate">{titleExam?.title}</h2>
                                        </div>
                                    </div>
                                    <h4 className="w-10 h-10 pb-1 flex items-center justify-center text-2xl font-semibold box-border border-2 border-black rounded-lg">{handleReturnResultExam(item.id)}</h4>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </Modal>
        </div>
    );
}
