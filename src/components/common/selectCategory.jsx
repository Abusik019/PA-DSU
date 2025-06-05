import { Select } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../store/slices/categories";

const SelectCategory = ({ onChange, value = undefined, width = "auto" }) => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.list);
    const list = categories?.results?.map((category) => ({ value: category.id, label: category.title })) || [];

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    return (
        <Select
            placeholder="Выберите категорию"
            onChange={onChange}
            value={value || undefined} 
            filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            style={{
                width: width,
                height: "42px",
                minWidth: "200px",
            }}
            options={list}
        />
    )
};

export default SelectCategory;
