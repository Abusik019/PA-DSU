import React from "react";
import { DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;

const onOk = (value, setExam) => {
    if (value && value[0] && value[1]) {
        const dateString = [
            value[0].format("YYYY-MM-DD HH:mm"),
            value[1].format("YYYY-MM-DD HH:mm"),
        ];
        console.log(dateString);
        setExam((prev) => ({
            ...prev,
            start_time: dateString[0],
            end_time: dateString[1],
        }));
    } else {
        console.error("Invalid date values");
    }
};

const DatePickerItem = ({ setExam }) => (
    <Space direction="vertical" size={12}>
        <RangePicker
            showTime={{
                format: "HH:mm",
            }}
            placeholder={["Начало экзамена", "Конец экзамена"]}
            format="YYYY-MM-DD HH:mm"
            onChange={(value, dateString) => {
                console.log("Selected Time: ", value);
                console.log("Formatted Selected Time: ", dateString);
            }}
            onOk={(value) => onOk(value, setExam)} // Pass the Moment value here
        />
    </Space>
);

export default DatePickerItem;
