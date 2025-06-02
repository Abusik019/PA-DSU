import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createGroup, getMyGroups } from "../../store/slices/groups";

import ActionButton from "../../components/common/groupsAction";
import Modal from "../../components/layouts/Modal";
import GroupSelectors from "../../components/common/groupSelectors";
import Loader from "../../components/common/loader";

import filterImg from "../../assets/icons/filter.svg";
import violetFilterImg from "../../assets/icons/violetFilter.svg";
import LinkImg from "../../assets/icons/open.svg";
import plusImg from "../../assets/icons/plus.svg";
import boxAnimate from "../../assets/images/box.gif";

export default function MyGroups() {
    const dispatch = useDispatch();

    const groups = useSelector((state) => state.groups.list);
    const loading = useSelector((state) => state.groups.loading);

    const [isFilterModal, setIsFilterModal] = useState(false);
    const [isHoverBtn, setIsHoverBtn] = useState(false);
    const [filterGroup, setFilterGroup] = useState({
        direction: {},
        course: {},
        group: {},
    });
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [newGroupModal, setNewGroupModal] = useState(false);
    const [createError, setCreateError] = useState(false);

    const handleClearGroupChanges = () => {
        setFilterGroup({ direction: {}, course: {}, group: {} });
        setFilteredGroups(groups);
    };

    const applyFilters = () => {
        if (!Array.isArray(groups)) return setFilteredGroups([]);

        let result = [...groups];

        if (filterGroup.direction.label) {
            result = result.filter(group => group.facult === filterGroup.direction.label);
        }
        if (filterGroup.course.label) {
            result = result.filter(group => group.course.toString() === filterGroup.course.label.charAt(0));
        }
        if (filterGroup.group.label) {
            result = result.filter(group => group.subgroup.toString() === filterGroup.group.label.charAt(0));
        }

        setFilteredGroups(result);
    };

    const handleSaveChanges = async () => {
        setCreateError(false);

        const { direction, course, group } = filterGroup;
        const data = {
            facult: direction?.label || '',
            course: course?.label?.charAt(0) || '',
            subgroup: group?.label?.charAt(0) || '',
        };

        if (data.facult || data.course || data.subgroup) {
            try {
                await dispatch(createGroup(data)).unwrap();
                dispatch(getMyGroups());
                setNewGroupModal(false);
            } catch (error) {
                if (error.message.includes("400")) {
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

    if (loading) return <Loader />;

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
                    <button className={styles.resetBtn} onClick={handleClearGroupChanges}>
                        Сброс
                    </button>
                </div>
            </div>

            <div style={{ height: "calc(100% - 130px)" }} className="w-full overflow-y-auto">
                {filteredGroups.length > 0 ? (
                    <table className="w-full">
                        <thead className="border-y-[1px] border-gray-200 bg-gray-100">
                            <tr className="text-left">
                                {["Направление", "Курс", "Группа", "Дата создания", "Методист", ""].map((title, idx) => (
                                    <th key={idx} className="p-2 font-semibold">{title}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-[#ececec]">
                            {filteredGroups.map((item) => (
                                <tr key={item.id} className="p-2 box-border h-[80px]">
                                    <td className="p-2">{item.facult ?? "-"}</td>
                                    <td className="p-2 pl-4">{item.course ?? "-"}</td>
                                    <td className="p-2 pl-4">{item.subgroup ?? "-"}</td>
                                    <td className="p-2">{item.created_at?.match(/\d{4}-\d{2}-\d{2}/) ?? "-"}</td>
                                    <td className="p-2">
                                        {item.methodist ? `${item.methodist.last_name} ${item.methodist.first_name?.charAt(0)}.` : "-"}
                                    </td>
                                    <td className="p-2">
                                        <Link to={`/my-groups/${item.id}`}>
                                            <img src={LinkImg} width={24} height={24} alt="open link" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyState />
                )}
            </div>

            {/* Модалка фильтрации */}
            <Modal isOpen={isFilterModal} onClose={() => setIsFilterModal(false)}>
                <div className="flex flex-col items-start gap-3 w-full h-full mt-5">
                    <h2 className="text-2xl font-medium text-center self-center mb-3">Фильтрация</h2>
                    <GroupSelectors filterGroup={filterGroup} setFilterGroup={setFilterGroup} />
                    <button
                        className="mt-4 w-full p-2 text-center bg-blue-400 rounded-xl text-white"
                        onClick={() => {
                            setIsFilterModal(false);
                            applyFilters();
                        }}
                    >
                        Сохранить
                    </button>
                </div>
            </Modal>

            {/* Модалка создания группы */}
            <Modal isOpen={newGroupModal} onClose={() => setNewGroupModal(false)}>
                <div className="flex flex-col items-start gap-3 w-full h-full mt-5">
                    <h2 className="text-2xl font-medium text-center self-center mb-3">Создание новой группы</h2>
                    <GroupSelectors filterGroup={filterGroup} setFilterGroup={setFilterGroup} />
                    <button
                        className="mt-4 w-full p-2 text-center bg-blue-400 rounded-xl text-white"
                        onClick={handleSaveChanges}
                    >
                        Создать
                    </button>
                    {createError && (
                        <div className="w-full p-2 text-center border border-red-500 text-red-500 font-medium rounded-xl">
                            Такая группа уже существует
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}

// Пустое состояние
function EmptyState() {
    return (
        <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3">
            <h2 className="text-3xl">Список групп пуст</h2>
            <img src={boxAnimate} width={128} height={128} alt="empty" />
        </div>
    );
}
