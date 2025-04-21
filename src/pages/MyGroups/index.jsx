import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createGroup, getMyGroups } from "../../store/slices/groups";
import ActionButton from "../../components/common/groupsAction";
import Modal from "../../components/layouts/Modal";
import SelectCourse from "../../components/common/selectCourse";
import SelectDirection from "../../components/common/selectDirection";
import SelectGroup from "../../components/common/selectGroup";

import filterImg from "../../assets/icons/filter.svg";
import violetFilterImg from "../../assets/icons/violetFilter.svg";
import LinkImg from "../../assets/icons/open.svg";
import plusImg from "../../assets/icons/plus.svg";
import boxAnimate from '../../assets/images/box.gif';
import Loader from "../../components/common/loader";

export default function MyGroups() {
    const dispatch = useDispatch();

    const   groups = useSelector((state) => state.groups.list),
            loading = useSelector((state) => state.groups.loading);
        
    const   [isFilterModal, setIsFilterModal] = useState(false),
            [isHoverBtn, setIsHoverBtn] = useState(false),
            [filterGroup, setFilterGroup] = useState({
                direction: {},
                course: {},
                group: {},
            }),
            [filteredGroups, setFilteredGroups] = useState([]),
            [newGroupModal, setNewGroupModal] = useState(false),
            [createError, setCreateError] = useState(false);

    const handleClearGroupChanges = () => {
        setFilterGroup({
            direction: {},
            course: {},
            group: {},
        });
        setFilteredGroups(groups);
    };

    const applyFilters = () => {
        if (!groups || !Array.isArray(groups)) {
            setFilteredGroups([]);
            return;
        }

        let result = [...groups];

        if (filterGroup.direction.label) {
            result = result.filter(
                (group) => group.facult === filterGroup.direction.label
            );
        }
        if (filterGroup.course.label) {
            result = result.filter(
                (group) =>
                    group.course.toString() ===
                    filterGroup.course.label.charAt(0)
            );
        }
        if (filterGroup.group.label) {
            result = result.filter(
                (group) =>
                    group.subgroup.toString() ===
                    filterGroup.group.label.charAt(0)
            );
        }
        setFilteredGroups(result);
    };

    const handleSaveChanges = async () => {
        setCreateError(false);

        const direction = filterGroup.direction.label;
        const course =
            typeof filterGroup.course.label === "string"
                ? filterGroup.course.label.charAt(0)
                : "";
        const subgroup =
            typeof filterGroup.group.label === "string"
                ? filterGroup.group.label.charAt(0)
                : "";

        const data = {
            facult: direction,
            course: course,
            subgroup: subgroup,
        };

        if (data.facult || data.course || data.subgroup) {
            try {
                await dispatch(createGroup(data)).unwrap();
                dispatch(getMyGroups());
                setNewGroupModal(false);
            } catch (error) {
                if (error.message === "Request failed with status code 400") {
                    console.error(error);
                    setCreateError(true);
                }
            }
        }
    };

    useEffect(() => {
        dispatch(getMyGroups());
    }, [dispatch]);

    useEffect(() => {
        setFilteredGroups(groups || []);
    }, [groups]);

    if(loading){
        return <Loader />
    }

    return (
        <div className="w-full h-full flex flex-col justify-start gap-[20px] items-center pt-[100px] box-border">
            <div className="w-full flex flex-col gap-5 items-start">
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-5xl">Группы</h1>
                    <button onClick={() => setNewGroupModal(true)}>
                        <img src={plusImg} width={28} height={28} alt="plus" />
                    </button>
                </div>
                <div className="w-full flex justify-between items-center">
                    <ActionButton
                        isHover={isHoverBtn}
                        onClick={() => setIsFilterModal(true)}
                        onMouseEnter={() => setIsHoverBtn(true)}
                        onMouseLeave={() => setIsHoverBtn(false)}
                        activeIcon={violetFilterImg}
                        inactiveIcon={filterImg}
                        label="Фильтрация"
                    />
                    <button
                        className={styles.resetBtn}
                        onClick={handleClearGroupChanges}
                    >
                        Сброс
                    </button>
                </div>
            </div>
            <div
                style={{ height: "calc(100% - 130px)" }}
                className="w-full overflow-y-auto"
            >
                <table className="w-full">
                    <thead className="bg-[#f8e7d9] border-y-[1px] border-[#d3d3d3]">
                        <tr className="text-left">
                            <th className="p-2 box-border font-semibold">
                                Направление
                            </th>
                            <th className="p-2 box-border font-semibold">
                                Курс
                            </th>
                            <th className="p-2 box-border font-semibold">
                                Группа
                            </th>
                            <th className="p-2 box-border font-semibold">
                                Дата создания
                            </th>
                            <th className="p-2 box-border font-semibold">
                                Куратор
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#f8f3ee] relative">
                        {Boolean(Array.isArray(filteredGroups) && filteredGroups.length > 0) ?
                            filteredGroups.map((item) => (
                                <tr
                                    className="p-2 box-border h-[80px]"
                                    key={item.id}
                                >
                                    <td className="p-2 box-border">
                                        {item && item.facult}
                                    </td>
                                    <td className="p-2 pl-4 box-border">
                                        {item && item.course}
                                    </td>
                                    <td className="p-2 pl-4 box-border">
                                        {item && item.subgroup}
                                    </td>
                                    <td className="p-2 box-border">
                                        {item &&
                                            item.created_at.match(
                                                /\d\d\d\d-\d\d-\d\d/
                                            )}
                                    </td>
                                    <td className="p-2 box-border">
                                        {item.curator && item.curator.last_name}{" "}
                                        {item.curator &&
                                            item.curator.first_name.match(
                                                /[A-Za-zА-Яа-я]/
                                            )}
                                        .
                                    </td>
                                    <td>
                                        <Link to={`/my-groups/${item.id}`}>
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
                                        Список групп пуст
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
            <Modal
                isOpen={isFilterModal}
                onClose={() => setIsFilterModal(false)}
            >
                <div className="flex flex-col items-start gap-3 w-full h-full mt-5">
                    <h2 className="text-2xl font-medium text-center self-center mb-3">
                        Фильтрация
                    </h2>
                    <SelectDirection
                        setFilterGroup={setFilterGroup}
                        value={filterGroup.direction.label}
                    />
                    <SelectCourse
                        setFilterGroup={setFilterGroup}
                        value={filterGroup.course.label}
                    />
                    <SelectGroup
                        setFilterGroup={setFilterGroup}
                        value={filterGroup.group.label}
                    />
                    <button
                        className="mt-4 w-full p-2 box-border text-center bg-blue-400 rounded-xl text-white"
                        onClick={() => {
                            setIsFilterModal(false);
                            applyFilters();
                        }}
                    >
                        Сохранить
                    </button>
                </div>
            </Modal>
            <Modal
                isOpen={newGroupModal}
                onClose={() => setNewGroupModal(false)}
            >
                <div className="flex flex-col items-start gap-3 w-full h-full mt-5">
                    <h2 className="text-2xl font-medium text-center self-center mb-3">
                        Создание новой группы
                    </h2>
                    <SelectDirection
                        setFilterGroup={setFilterGroup}
                        value={filterGroup.direction.label}
                    />
                    <SelectCourse
                        setFilterGroup={setFilterGroup}
                        value={filterGroup.course.label}
                    />
                    <SelectGroup
                        setFilterGroup={setFilterGroup}
                        value={filterGroup.group.label}
                    />
                    <button
                        className="mt-4 w-full p-2 box-border text-center bg-blue-400 rounded-xl text-white"
                        onClick={() => {
                            handleSaveChanges();
                        }}
                    >
                        Создать
                    </button>
                    {createError && (
                        <div className="w-full p-2 box-border text-center border-[1px] border-red-500 text-red-500 font-medium rounded-xl">
                            Такая группа уже существует
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
