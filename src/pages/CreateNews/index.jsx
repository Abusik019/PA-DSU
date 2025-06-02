import { useState } from "react";
import ImagePicker from "../../components/common/imagePicker";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { createNews } from "../../store/slices/news";
import { message } from 'antd';
import { useNavigate } from "react-router-dom";
import { BackButton } from './../../components/layouts/BackButton/index';

export default function CreateNews() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const   [content, setContent] = useState(""),
            [title, setTitle] = useState(""),
            [image, setImage] = useState(null);

    const isDisabled = !(content.trim() && title && image);

    function handleSave() {
        if (isDisabled) return;

        dispatch(createNews({title, text: content, image}))
            .unwrap()
            .then(() => {
                setContent("");
                setTitle("");
                setImage(null);
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
                <input type="text" onInput={(e) => setTitle(e.target.value)} placeholder="Название новости" className="w-1/2 border border-gray-300 px-4 py-2 box-border rounded-lg outline-none"/>
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
