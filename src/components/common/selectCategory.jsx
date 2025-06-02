import { Select } from "antd";

const SelectCategory = ({ setFilter, value }) => (
    <Select
        placeholder="Выберите категорию"
        onChange={(value, option) =>
            setFilter((prev) => ({
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
                label: "Общее",
            },
            {
                value: "2",
                label: "Технологии",
            },
            {
                value: "4",
                label: "Спорт",
            },
            {
                value: "5",
                label: "Юриспруденция",
            },
            {
                value: "6",
                label: "Наука",
            },
            {
                value: "7",
                label: "Искусство",
            },
            {
                value: "8",
                label: "Культура",
            },
        ]}
    />
);

export default SelectCategory;
