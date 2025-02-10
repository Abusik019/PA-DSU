import { Select } from "antd";

const SelectGroup = ({ setFilterGroup, value }) => (
    <Select
        placeholder="Выберите группу"
        onChange={(value, option) =>
            setFilterGroup((prev) => ({
                ...prev,
                group: {
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
            width: "100%"
        }}
        options={[
            {
                value: "1",
                label: "1 группа",
            },
            {
                value: "2",
                label: "2 группа",
            },
            {
                value: "3",
                label: "3 группа",
            },
            {
                value: "4",
                label: "4 группа",
            },
        ]}
    />
);

export default SelectGroup;
