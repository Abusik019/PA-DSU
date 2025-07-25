import styles from "./style.module.scss";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import ActionButton from "./../../components/common/groupsAction";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteLecture, getLectures, getMyLectures } from "./../../store/slices/lectures";
import classNames from 'classnames';
import { useOutsideClick } from './../../utils';
import Loader from './../../components/common/loader';
import { ArrowIcon, OpenIcon, PlusRounded, TrashIcon } from "../../assets";
import NotData from "../../components/layouts/NotData";
import { Dropdown } from '../../components/common/dropdown';

const MONTHS_GENITIVE = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

export default function Lectures() {
    const dispatch = useDispatch();

    const myInfo = useSelector((state) => state.users.list);
    const { list, loading } = useSelector((state) => state.lectures);

    const [isFilterDropdown, setIsFilterDropdown] = useState(false);
    const [filter, setFilter] = useState({
        up: false,
        down: false
    });
    const [searchValue, setSearchValue] = useState('');

    const dropdownRef = useRef(null);

    const groupId = useMemo(() => (
        myInfo?.member_groups?.length ? myInfo.member_groups[0].id : null
    ), [myInfo?.member_groups]);

    // Получение лекций
    useEffect(() => {
        if (myInfo.is_teacher) {
            dispatch(getMyLectures());
        } else if (groupId) {
            dispatch(getLectures(groupId));
        }
    }, [dispatch, groupId, myInfo.is_teacher]);

    useOutsideClick(dropdownRef, () => setIsFilterDropdown(false));

    // Улучшенная логика поиска и сортировки
    const filteredArray = useMemo(() => {
        if (!Array.isArray(list) || !list.length) return [];
        let sortedList = [...list];

        // Сортировка
        if (filter.up) {
            sortedList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (filter.down) {
            sortedList.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }

        // Поиск по нескольким полям, без учета регистра и с trim
        const search = searchValue.trim().toLowerCase();
        if (search) {
            sortedList = sortedList.filter(item => {
                const title = item.title?.toLowerCase() || '';
                const author = `${item.author?.first_name || ''} ${item.author?.last_name || ''}`.toLowerCase();
                return title.includes(search) || author.includes(search);
            });
        }

        return sortedList;
    }, [filter, list, searchValue]);

    const handleDeleteLecture = useCallback((id) => {
        if (!id) return;
        try {
            dispatch(deleteLecture(id));
        } catch (error) {
            console.error("Ошибка удаления лекции:", error);
        }
    }, [dispatch]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="w-full h-full flex flex-col justify-start gap-[40px] items-center pt-[100px] box-border">
            <div className="w-full flex flex-col gap-5 items-start">
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-5xl">Лекции</h1>
                    <input
                        className={styles.search}
                        type="search"
                        placeholder="Поиск по названию или автору..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    {myInfo.is_teacher &&
                        <Link to="/create-lecture">
                            <PlusRounded width={28} height={28}/>
                        </Link>
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
                                onClick={() => setFilter({ down: false, up: true })}
                                className={classNames("p-1 box-border border-[2px] rounded-md", {
                                    "border-black": filter.up,
                                })}
                            >
                               <ArrowIcon width={36} height={36}/>
                            </button>
                            <button
                                onClick={() => setFilter({ down: true, up: false })}
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
                        onClick={() => setFilter({ down: false, up: false })}
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
                                    <div className="font-semibold text-xl text-center px-4 py-2 box-border bg-gray-100 h-full rounded-s-lg border-r-2 border-black">
                                        {new Date(item.created_at).getDate()}
                                        <br />
                                        {MONTHS_GENITIVE[new Date(item.created_at).getMonth()]}
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
                                            <TrashIcon width={24} height={24} />
                                        </button>
                                    }
                                    <Link to={`/lecture/${item.id}`} className="mr-4 w-[24px] h-[24px]">
                                        <OpenIcon />
                                    </Link>
                                </div>
                            </li>
                        )) : (
                            <NotData text="Лекций пока нет" />
                        )}
                </ul>
            </div>
        </div>
    );
}
