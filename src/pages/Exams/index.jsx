import styles from "./style.module.scss";
import ActionButton from "../../components/common/groupsAction";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteLecture, getLectures, getMyLectures } from "./../../store/slices/lectures";
import { getMyInfo } from "./../../store/slices/users";
import { Dropdown } from "../../components/layouts/Dropdown";
import classNames from 'classnames';
import Loader from './../../components/common/loader';
import { useOutsideClick } from './../../utils/useOutsideClick';
import { getGroupExams, getResultExamByUser, getTeacherExams } from "../../store/slices/exams";
import Modal from './../../components/layouts/Modal/index';

import filterImg from "../../assets/icons/filter.svg";
import violetFilterImg from "../../assets/icons/violetFilter.svg";
import LinkImg from "../../assets/icons/open.svg";
import plusImg from "../../assets/icons/plus.svg";
import arrowUpImg from '../../assets/icons/arrow-up.svg';
import arrowDownImg from '../../assets/icons/arrow-down.svg';
import deleteImg from '../../assets/icons/delete.svg';
import boxAnimate from '../../assets/images/box.gif';
import userListImg from '../../assets/icons/user-list.svg';
import quizzImg from '../../assets/icons/quizz.svg';

export default function Exams() {
    const dispatch = useDispatch();
    const dropdownRef = useRef(null);

    const   myInfo = useSelector((state) => state.users.list),
            list = useSelector((state) => state.exams.list),
            result = useSelector((state) => state.exams.result),
            loading = useSelector((state) => state.exams.loading);
            
    const   [isHoverBtn, setIsHoverBtn] = useState(false),
            [isFilterDropdown, setIsFilterDropdown] = useState(false),
            [filter, setFilter] = useState({
                up: false,
                down: false
            }),
            [filteredArray, setFilteredArray] = useState([]),
            [searchValue, setSearchValue] = useState(''),
            [isOpenModal, setIsOpenModal] = useState(false);

    const groupId = myInfo?.member_groups?.length ? myInfo.member_groups[0].id : null;
    const commonExams = Array.isArray(list) && list?.filter(item => Array.isArray(result) && result.some(resultItem => resultItem.id === item.id));

    console.log(commonExams);

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getMyInfo()).unwrap();
            if(myInfo.is_teacher){
                dispatch(getTeacherExams(myInfo.id));
            } else{
                if (groupId) {
                    dispatch(getGroupExams(groupId));
                    dispatch(getResultExamByUser(myInfo.id));
                }
            }
        };

        fetchData();
    }, [dispatch, groupId, myInfo.is_teacher]);

    useOutsideClick(dropdownRef, () => setIsFilterDropdown(false));

    useEffect(() => {
        if (list.length) {
            let sortedList = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
            if (filter.up) {
                sortedList = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            } else if (filter.down) {
                sortedList = [...list].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            }
    
            const regex = new RegExp(searchValue, 'gi');
            sortedList = sortedList.filter(item => regex.test(item.title));
    
            setFilteredArray(sortedList);
        }
    }, [filter, list, searchValue]);
    
    const handleDeleteExam = async (id) => {
        try {
            await dispatch(deleteLecture(id)).unwrap();
            if(myInfo.is_teacher){
                dispatch(getMyLectures());
            } else{
                if (groupId) {
                    dispatch(getLectures(groupId));
                }
            }
        } catch (error) {
            console.error("Ошибка удаления лекции:", error);
        }
    }

    const handleReturnResultExam = (id) => {
        const { score } = result.find(item => item.id === id);
        return score
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
                            <img src={plusImg} width={28} height={28} alt="plus" />
                        </Link>
                    }
                    {!myInfo.is_teacher && 
                        <button title="Список пройденных экзаменов" onClick={() => setIsOpenModal(true)}>
                            <img 
                                src={userListImg} 
                                width={28}
                                height={28}
                                alt="list" 
                            />
                        </button>
                    }
                </div>
                <div className="w-full flex justify-between items-center relative">
                    <ActionButton
                        isHover={isHoverBtn}
                        onClick={() => setIsFilterDropdown(true)}
                        onMouseEnter={() => setIsHoverBtn(true)}
                        onMouseLeave={() => setIsHoverBtn(false)}
                        activeIcon={violetFilterImg}
                        inactiveIcon={filterImg}
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
                                <img 
                                    src={arrowDownImg}
                                    width={36}
                                    height={36}
                                    alt="arrow"
                                />
                            </button>
                            <button 
                                onClick={() => setFilter({down: true, up: false})}
                                className={classNames("p-1 box-border border-[2px] rounded-md", {
                                    "border-black": filter.down,
                                })}
                            >
                                <img 
                                    src={arrowUpImg}
                                    width={36}
                                    height={36}
                                    alt="arrow"
                                />
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
                                            width={48}
                                            height={48}
                                            alt="teacher avatar" 
                                            style={{borderRadius: "50%"}}
                                        />
                                    </td>
                                    <td className="pr-2 box-border flex items-center justify-center gap-4 h-[90px]">
                                        {myInfo?.is_teacher &&  
                                            <button onClick={() => handleDeleteExam(item.id)}>
                                                <img 
                                                    src={deleteImg}
                                                    width={24}
                                                    height={24} 
                                                    alt="delete" 
                                                />
                                            </button>
                                        }
                                        <Link to={`/exams/${item.id}`}>
                                            <img
                                                src={LinkImg}
                                                width={24}
                                                height={24}
                                                alt="link img"
                                            />
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3 absolute">
                                    <h2 className="text-3xl">
                                        Список экзаменов пуст
                                    </h2>
                                    <img
                                        src={boxAnimate}
                                        width={128}
                                        height={128}
                                        alt="empty"
                                    />
                                </div>
                            )}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                <div className="w-[500px] flex flex-col items-center">
                    <h2 className="text-2xl font-medium">Пройденные экзамены</h2>
                    <ul className="w-full max-h-[400px] overflow-y-auto flex flex-col items-center mt-6">
                        {(commonExams.length !== 0 && Array.isArray(commonExams)) && commonExams.map(item => (
                            <li className="w-full flex items-center justify-between border-b-[2px] border-black pt-5 pb-2 px-2" key={item.id}>
                                <div className="w-full flex items-center gap-2">
                                    <img 
                                        src={quizzImg}
                                        width={36}
                                        height={36} 
                                        alt="quizz" 
                                    />
                                    <div className="max-w-[70%]">
                                        <h2 className="text-lg font-medium max-w-[100%] truncate">{item?.title}</h2>
                                        <h3 className="text-sm text-gray-500">{item?.author?.first_name} {item?.author?.last_name}</h3>
                                    </div>
                                </div>
                                <h4 className="w-10 h-10 pb-1 flex items-center justify-center text-2xl font-semibold box-border border-2 border-black rounded-lg">{handleReturnResultExam(item.id)}</h4>
                            </li>
                        ))}
                    </ul>
                </div>
            </Modal>
        </div>
    );
}
