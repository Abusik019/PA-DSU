import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const { RangePicker } = DatePicker;

const onOk = (value, setExam) => {
    if (Array.isArray(value) && dayjs(value[0]).isValid() && dayjs(value[1]).isValid()) {
        const dateString = [
            dayjs(value[0]).utc().format(),
            dayjs(value[1]).utc().format(),
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


const DatePickerItem = ({ setExam, start_time, end_time }) => {
    const value =
        start_time && end_time
            ? [dayjs.utc(start_time).local(), dayjs.utc(end_time).local()] 
            : null;

    return (
        <Space direction="vertical" size={12}>
            <RangePicker
                showTime={{
                    format: "HH:mm",
                }}
                placeholder={["Начало экзамена", "Конец экзамена"]}
                format="YYYY-MM-DD HH:mm"
                value={value}
                onOk={(value) => onOk(value, setExam)}
            />
        </Space>
    );
};

export default DatePickerItem;