import { useState } from "react";
import ImagePicker from "../../components/common/imagePicker";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { createNews } from "../../store/slices/news";
import { message } from 'antd';
import { useNavigate } from "react-router-dom";
import { BackButton } from '../../components/common/BackButton';
import SelectCategory from './../../components/common/selectCategory';

export default function CreateNews() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const   [content, setContent] = useState(""),
            [title, setTitle] = useState(""),
            [image, setImage] = useState(null),
            [category, setCategory] = useState(null),
            [timeToRead, setTimeToRead] = useState(null);

    const isDisabled = !(content.trim() && title && image && category && timeToRead);

    function handleSave() {
        if (isDisabled) return;

        dispatch(createNews({ title, content, image, category, timeToRead }))
            .unwrap()
            .then(() => {
                setContent("");
                setTitle("");
                setImage(null);
                setCategory(null);
                setTimeToRead(null);
                message.success("Новость успешно создана");
                navigate("/news");
            })
            .catch((error) => {
                console.error("Ошибка создания новости:", error);
                message.error("Не удалось создать новость");
            });
    }

    return (
        <div className="w-full h-full overflow-hidden flex flex-col items-center relative">
            <BackButton />
            <div className="w-full pt-16 box-border">
                <h1 className="text-5xl">Создание новости</h1>
                <div className="w-full h-[2px] bg-black rounded-lg mt-8"></div>
            </div>
            <div
                style={{ height: "calc(100% - 130px)" }}
                className="w-full flex flex-col items-center gap-10 pt-8 box-border overflow-y-auto"
            >   
                <ImagePicker onImageSelected={(file) => setImage(file)} />
                <div className="w-full flex items-center gap-4 justify-between">
                    <input type="text" onInput={(e) => setTitle(e.target.value)} placeholder="Название новости" className="w-1/2 border border-gray-300 px-4 py-2 box-border rounded-lg outline-none"/>
                    <div className="flex items-center gap-2">
                        <input type="number" onInput={(e) => setTimeToRead(e.target.value)} placeholder="10 минут" className="w-[100px] border border-gray-300 px-4 py-2 box-border rounded-lg outline-none text-center"/>
                        <SelectCategory 
                            onChange={(value, option) => {
                                setCategory({
                                    value: value, 
                                    label: option.label
                                })
                            }} 
                            width="30%"
                        />
                    </div>
                </div>
                <ReactQuill
                    className="w-full bg-white rounded-lg"
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    placeholder="Описание новости"
                    style={{ height: "350px" }}
                />
                <button onClick={handleSave} className={classNames("w-36 bg-blue-500 text-white text-lg font-medium py-1 box-border rounded-lg mt-8", {
                    "opacity-50 cursor-not-allowed": isDisabled,
                })}>Сохранить</button>
            </div>
        </div>
    );
}
