import styles from "./style.module.scss";
import { useEffect, useRef, useState } from "react";
import ActionButton from "./../../components/common/groupsAction";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteLecture, getLectures, getMyLectures } from "./../../store/slices/lectures";
import { getMyInfo } from "./../../store/slices/users";
import { Dropdown } from "../../components/layouts/Dropdown";
import classNames from 'classnames';
import { useOutsideClick } from './../../utils/useOutsideClick';

import filterImg from "../../assets/icons/filter.svg";
import violetFilterImg from "../../assets/icons/violetFilter.svg";
import LinkImg from "../../assets/icons/open.svg";
import plusImg from "../../assets/icons/plus.svg";
import arrowUpImg from '../../assets/icons/arrow-up.svg';
import arrowDownImg from '../../assets/icons/arrow-down.svg';
import deleteImg from '../../assets/icons/delete.svg';
import boxAnimate from '../../assets/images/box.gif';
import Loader from './../../components/common/loader';

export default function Lectures() {
    const dispatch = useDispatch();
    const dropdownRef = useRef(null);

    const   myInfo = useSelector((state) => state.users.list),
            list = useSelector((state) => state.lectures.list),
            loading = useSelector((state) => state.lectures.loading);

    const   [isHoverBtn, setIsHoverBtn] = useState(false),
            [isFilterDropdown, setIsFilterDropdown] = useState(false),
            [filter, setFilter] = useState({
                up: false,
                down: false
            }),
            [filteredArray, setFilteredArray] = useState([]),
            [searchValue, setSearchValue] = useState('');

    const groupId = myInfo?.member_groups?.length ? myInfo.member_groups[0].id : null;

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getMyInfo()).unwrap();
            if(myInfo.is_teacher){
                dispatch(getMyLectures());
            } else{
                if (groupId) {
                    dispatch(getLectures(groupId));
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

    const handleDeleteLecture = async (id) => {
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

    if(loading){
        return <Loader />
    }

    return (
        <div className="w-full h-full flex flex-col justify-start gap-[40px] items-center pt-[100px] box-border">
            <div className="w-full flex flex-col gap-5 items-start">
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-5xl">Лекции</h1>
                    <input 
                        className={styles.search} 
                        type="search" 
                        placeholder="Поиск лекции..." 
                        onInput={(e) => setSearchValue(e.target.value)}
                    />
                    {myInfo.is_teacher && 
                        <Link to="/create-lecture">
                            <img src={plusImg} width={28} height={28} alt="plus" />
                        </Link>
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
                <ul className="w-full h-fit flex flex-col items-start gap-5">
                    {filteredArray.length ?
                        filteredArray.map((item) => (
                            <li key={item.id} className="shadow-lg w-full h-fit max-h-[80px] rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2 h-full max-w-[90%]">
                                    <div className="font-semibold text-xl text-center px-4 py-2 box-border bg-[#F3EBE5] h-full rounded-s-lg border-r-2 border-black">
                                        {new Date(item.created_at).getDate()}
                                        <br />
                                        {new Date(item.created_at).toLocaleString("ru-RU", { month: "short" }).toUpperCase().replace(".", "")}
                                    </div>
                                    <div className="ml-3 py-2 box-border overflow-hidden">
                                        <h3 className="text-base font-semibold truncate">
                                            {item.title}
                                        </h3>
                                        <h4 className="text-base font-medium text-[#6e6e6e]">
                                            {item.author && item.author.first_name} {item.author && item.author.last_name}
                                        </h4>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {myInfo?.is_teacher &&  
                                        <button onClick={() => handleDeleteLecture(item.id)}>
                                            <img 
                                                src={deleteImg}
                                                width={24}
                                                height={24} 
                                                alt="delete" 
                                            />
                                        </button>
                                    }
                                    <Link to={`/lecture/${item.id}`} className="mr-4 w-[24px] h-[24px]">
                                        <img
                                            src={LinkImg}
                                            width={24}
                                            height={24}
                                            alt="link"
                                        />
                                    </Link>
                                </div>
                            </li>
                        )) : (
                            <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3">
                                <h2 className="text-3xl">
                                    Список лекций пуст
                                </h2>
                                <img
                                    src={boxAnimate}
                                    width={128}
                                    height={128}
                                    alt="empty"
                                />
                            </div>
                        )}
                </ul>
            </div>
        </div>
    );
}
