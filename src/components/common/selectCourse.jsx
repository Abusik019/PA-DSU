import { Select } from "antd";

const SelectCourse = () => (
    <Select
        placeholder="Выберите курс"
        filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        style={{
            width: "100%"
        }}
        options={[
            {
                value: "1",
                label: "1 курс",
            },
            {
                value: "2",
                label: "2 курс",
            },
            {
                value: "3",
                label: "3 курс",
            },
            {
                value: "4",
                label: "4 курс",
            },
        ]}
    />
);

export default SelectCourse;
