import React from "react";
import { DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;

const onOk = (value) => {
    console.log("onOk: ", value);
};

const DatePickerItem = () => (
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
            onOk={onOk}
        />
    </Space>
);
export default DatePickerItem;
