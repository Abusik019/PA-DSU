import { Select } from "antd";

const SelectDirection = ({ setFilterGroup, value }) => (
    <Select
        placeholder="Выберите направление"
        onChange={(value, option) =>
            setFilterGroup((prev) => ({
                ...prev,
                direction: {
                    value: value, 
                    label: option.label, 
                },
            }))
        }
        value={value}
        filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        style={{
            width: "100%"
        }}
        options={[
            {
                value: "1",
                label: "ПСО",
            },
            {
                value: "2",
                label: "ПСА",
            },
            {
                value: "3",
                label: "ПД",
            },
            {
                value: "4",
                label: "ИСИП",
            },
            {
                value: "5",
                label: "ОИБАС",
            },
            {
                value: "6",
                label: "РИПК",
            },
        ]}
    />
);

export default SelectDirection;
