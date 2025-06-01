import { Select } from "antd";

const SelectCategory = ({ setFilterGroup, value }) => (
    <Select
        placeholder="Выберите категорию"
        onChange={(value, option) =>
            setFilterGroup((prev) => ({
                ...prev,
                direction: {
                    value: value, 
                    label: option.label, 
                },
            }))
        }
        value={value || undefined} 
        filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        style={{
            width: "100%",
            minWidth: "200px",
        }}
        options={[
            {
                value: "1",
                label: "Технологии",
            },
            {
                value: "2",
                label: "Спорт",
            },
            {
                value: "3",
                label: "Юриспруденция",
            },
            {
                value: "4",
                label: "Наука",
            },
            {
                value: "5",
                label: "Искусство",
            },
            {
                value: "6",
                label: "Культура",
            },
        ]}
    />
);

export default SelectCategory;
