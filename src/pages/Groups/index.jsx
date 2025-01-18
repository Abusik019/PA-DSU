import { useEffect, useState } from "react";

import filterImg from "../../assets/icons/filter.svg";
import sortImg from "../../assets/icons/sort.svg";
import violetFilterImg from "../../assets/icons/violetFilter.svg";
import violetSortImg from "../../assets/icons/violetSort.svg";
import ActionButton from './../../components/common/groupsAction';
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import Modal from './../../components/Modal/';
import SelectCourse from './../../components/common/selectCourse';
import SelectDirection from './../../components/common/selectDirection';
import SelectGroup from './../../components/common/selectGroup';
import SortCheckbox from './../../components/common/checkbox';
import arrowImg from '../../assets/icons/longArrow.svg';
import { getMyGroups } from "../../store/slices/groups";

export default function Groups() {
    const dispatch = useDispatch();
    const groups = useSelector((state) => state.groups.list);
    const loading = useSelector((state) => state.groups.loading);
    const error = useSelector((state) => state.groups.error);
    const [showGroups, setShowGroups] = useState('all');
    const [isFilterModal, setIsFilterModal] = useState(false);
    const [isSortModal, setIsSortModal] = useState(false);
    const [isHoverBtns, setIsHoverBtns] = useState({
        filter: false,
        sort: false,
    });
    const [sortDirection, setSortDirection] = useState({
        direction: 'increase',
        course:  'increase',
        group: 'increase'
    })


    const handleButtonHover = (button) => {
        setIsHoverBtns((prev) => ({
            ...prev,
            [button]: true,
        }));
    };

    const handleButtonLeave = (button) => {
        setIsHoverBtns((prev) => ({
            ...prev,
            [button]: false,
        }));
    };

    const handleSortDirection = (name) => {
        setSortDirection((prev) => ({
            ...prev,
            [name]: prev[name] === 'increase' ? 'decrease' : 'increase',
        }));
    };
    
    
    console.log(groups);

    useEffect(() => {
        dispatch(getMyGroups());
    }, [])

    return (
        <div className="w-full h-full flex flex-col justify-start gap-[20px] items-center pt-[100px] box-border">
            <div className="w-full flex flex-col gap-5 items-start">
                <h1 className="text-5xl">Группы</h1>
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center rounded-3xl">
                        <button className={classNames("w-fit py-2 px-3 box-border rounded-3xl", {
                            "bg-white": showGroups !== 'all',
                            "bg-gray-200": showGroups === 'all'
                        })} onClick={() => setShowGroups('all')}>Все группы</button>
                        <button className={classNames("w-fit py-2 px-3 box-border rounded-3xl", {
                            "bg-white": showGroups !== 'my',
                            "bg-gray-200": showGroups === 'my'
                        })} onClick={() => setShowGroups('my')}>Мои группы</button>
                    </div>
                    <div className="flex w-fit items-center gap-6">
                        <ActionButton
                            isHover={isHoverBtns.filter}
                            onClick={() => setIsFilterModal(true)}
                            onMouseEnter={() => handleButtonHover('filter')}
                            onMouseLeave={() => handleButtonLeave('filter')}
                            activeIcon={violetFilterImg}
                            inactiveIcon={filterImg}
                            label="Фильтрация"
                        />
                        <ActionButton
                            isHover={isHoverBtns.sort}
                            onClick={() => setIsSortModal(true)}
                            onMouseEnter={() => handleButtonHover('sort')}
                            onMouseLeave={() => handleButtonLeave('sort')}
                            activeIcon={violetSortImg}
                            inactiveIcon={sortImg}
                            label="Сортировать"
                        />
                    </div>
                </div>
            </div>
            <div style={{height: 'calc(100% - 130px)'}} className="w-full overflow-y-auto">
                <table className="w-full">
                    <thead className="bg-[#f8e7d9] border-y-[1px] border-[#d3d3d3]">
                        <tr className=" text-left">
                            <th className="p-2 box-border font-semibold">Направление</th>
                            <th className="p-2 box-border font-semibold">Курс</th>
                            <th className="p-2 box-border font-semibold">Группа</th>
                            <th className="p-2 box-border font-semibold">Дата создания</th>
                            <th className="p-2 box-border font-semibold">Куратор</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#f8f3ee]">
                        {groups.map(item => (
                            <tr className="p-2 box-border h-[80px]" key={item.id}>
                                <td className="p-2 box-border">{item  && item.facult}</td>
                                <td className="p-2 box-border">{item && item.course}</td>
                                <td className="p-2 box-border">{item && item.subgroup}</td>
                                <td className="p-2 box-border">{item && item.created_at.match(/\d\d\d\d-\d\d-\d\d/)}</td>
                                <td className="p-2 box-border">{item.curator && item.curator.last_name} {item.curator && item.curator.first_name.match(/\w/)}.</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isFilterModal} onClose={() => setIsFilterModal(false)}>
                <div className="flex flex-col items-start gap-3 w-full h-full mt-5">
                    <h2 className="text-2xl font-medium text-center self-center mb-3">Фильтрация</h2>
                    <SelectDirection />
                    <SelectCourse />
                    <SelectGroup />
                    <button className="mt-4 w-full p-2 box-border text-center bg-blue-400 rounded-xl text-white">Сохранить</button>
                </div>
            </Modal>
            <Modal isOpen={isSortModal} onClose={() => setIsSortModal(false)}>
                <div className="flex flex-col items-start gap-3 w-full h-full mt-5">
                    <h2 className="text-2xl font-medium text-center self-center mb-3">Сортировка</h2>
                    <div className="flex items-center justify-between w-full">
                        <SortCheckbox value="Направление"/>
                        <button onClick={() => handleSortDirection('direction')}>
                            <img 
                                src={arrowImg}
                                width={16}
                                height={16}
                                alt="arrow" 
                                style={{transform: sortDirection.direction === 'increase' ? "rotate(180deg)" : "rotate(0deg)"}}
                            />
                        </button>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <SortCheckbox value="Курс"/>
                        <button onClick={() => handleSortDirection('course')}>
                            <img 
                                src={arrowImg}
                                width={16}
                                height={16}
                                alt="arrow"  
                                style={{transform: sortDirection.course === 'increase' ? "rotate(180deg)" : "rotate(0deg)"}}
                            />
                        </button>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <SortCheckbox value="Группа"/>
                        <button onClick={() => handleSortDirection('group')}>
                            <img 
                                src={arrowImg}
                                width={16}
                                height={16}
                                alt="arrow" 
                                style={{transform: sortDirection.group === 'increase' ? "rotate(180deg)" : "rotate(0deg)"}}
                            />
                        </button>
                    </div>
                    <button className="mt-4 w-full p-2 box-border text-center bg-blue-400 rounded-xl text-white">Сохранить</button>
                </div>
            </Modal>
        </div>
    );
}
