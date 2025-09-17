import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createGroup, getMyGroups } from "../../store/slices/groups";
import ActionButton from "../../components/common/groupsAction";
import GroupSelectors from "../../components/common/groupSelectors";
import Loader from "../../components/common/loader";
import { OpenIcon, PlusRounded } from "../../assets";
import NotData from "../../components/layouts/NotData";
import Modal from "../../components/layouts/Modal";
import { ResetBtn } from '../../components/common/resetBtn';
import { useScreenWidth } from './../../providers/ScreenWidthProvider';

export default function MyGroups() {
    const dispatch = useDispatch();

    const groups = useSelector((state) => state.groups.list);
    const loading = useSelector((state) => state.groups.loading);

    const [isFilterModal, setIsFilterModal] = useState(false);
    const [filterGroup, setFilterGroup] = useState({
        direction: {},
        course: {},
        group: {},
    });
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [newGroupModal, setNewGroupModal] = useState(false);
    const [createError, setCreateError] = useState(false);

    const windowWidth = useScreenWidth();

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
            await dispatch(createGroup(data))
                .unwrap()
                .then(() => {
                    setNewGroupModal(false);
                    setFilterGroup({ direction: {}, course: {}, group: {} });
                })
                .catch((error) => {
                    setCreateError(true);
                    throw new Error(error, "Ошибка создания группы");
                }); 
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
        <div className="w-full h-full flex flex-col justify-start gap-5 items-center pt-[100px] box-border">
            <div className="w-full flex flex-col gap-5 items-start">
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-5xl max-sm:text-3xl max-sm:font-medium">Группы</h1>
                    <button onClick={() => setNewGroupModal(true)}>
                        <PlusRounded width={28} height={28} />
                    </button>
                </div>
                <div className="w-full flex justify-between items-center">
                    <ActionButton
                        onClick={() => setIsFilterModal(true)}
                        label="Фильтрация"
                    />
                    <ResetBtn onClick={handleClearGroupChanges} />
                </div>
            </div>

            <div style={{ height: "calc(100% - 130px)" }} className="w-full overflow-y-auto">
                {filteredGroups.length > 0 ? (
                    <table className="w-full">
                        <thead className="border-y-[1px] border-gray-200 bg-gray-100">
                            <tr className="text-left">
                                {windowWidth >= 640 ? 
                                    ["Направление", "Курс", "Группа", "Дата создания", "Методист", ""].map((title, idx) => (
                                        <th key={idx} className="p-2 font-semibold">{title}</th>
                                    ))
                                    : (
                                        ["Направление", "Курс", "Группа", "Методист", ""].map((title, idx) => (
                                            <th key={idx} className="p-2 font-semibold">{title}</th>
                                        ))
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody className="bg-[#ececec]">
                            {filteredGroups.map((item) => (
                                <tr key={item.id} className="p-2 box-border h-[80px]">
                                    <td className="p-2">{item.facult ?? "-"}</td>
                                    <td className="p-2 pl-4">{item.course ?? "-"}</td>
                                    <td className="p-2 pl-4">{item.subgroup ?? "-"}</td>
                                    {windowWidth >= 640 && <td className="p-2">{item.created_at?.match(/\d{4}-\d{2}-\d{2}/) ?? "-"}</td>}
                                    <td className="p-2">
                                        {item.methodist ? `${item.methodist.last_name} ${item.methodist.first_name?.charAt(0)}.` : "-"}
                                    </td>
                                    <td className="p-2">
                                        <Link to={`/my-groups/${item.id}`}>
                                            <OpenIcon />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <NotData text="Вы не состоите ни в одной группе" />
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

