import { useEffect, useState } from "react";
import ImagePicker from "../../components/common/imagePicker";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { getOneNews, updateNews } from "../../store/slices/news";
import { message } from 'antd';
import { useNavigate, useParams } from "react-router-dom";
import Loader from './../../components/common/loader';
import { BackButton } from "../../components/common/BackButton";


export default function UpdateNews() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const news = useSelector((state) => state.news.news);

    const   [content, setContent] = useState(""),
            [title, setTitle] = useState(""),
            [image, setImage] = useState(null);

    const isDisabled = !(content.trim() && title);

   useEffect(() => {
        dispatch(getOneNews(id));   
    }, [dispatch, id]);

    useEffect(() => {
        setImage(null);
    }, [news.image]);
    
    async function urlToFile(url) {
        const filename = decodeURIComponent(url.split('/').pop() || 'image');
        const extMatch = filename.match(/\.(\w+)$/);
        const ext = extMatch ? extMatch[1].toLowerCase() : 'webp';
        const mimeType = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp',
            bmp: 'image/bmp',
            svg: 'image/svg+xml'
        }[ext] || 'application/octet-stream';

        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: mimeType });
    }

    useEffect(() => {
        if (news.image) {
            urlToFile(news.image)   
                .then(file => setImage(file))
                .catch(error => console.error("Ошибка преобразования URL в файл:", error));
        }
        setContent(news.text || "");
        setTitle(news.title || "");
    }, [news]);

    function handleSave() {
        if (isDisabled) return;

        dispatch(updateNews({ id, title, text: content, image }))
            .unwrap()
            .then(() => {
                message.success("Новость успешно изменена");
                navigate("/news");
            })
            .catch((error) => {
                console.error("Ошибка изменения новости:", error);
                message.error("Не удалось изменить новость");
            });
    }

    if (news.id != id) {
        return <Loader />;
    }

    return (
        <div className="w-full h-full overflow-hidden flex flex-col items-center relative">
            <BackButton />
            <div className="w-full pt-16 box-border">
                <h1 className="text-5xl">Редактирование новости</h1>
                <div className="w-full h-[2px] bg-black rounded-lg mt-8"></div>
            </div>
            <div
                style={{ height: "calc(100% - 130px)" }}
                className="w-full flex flex-col items-center gap-10 pt-8 box-border overflow-y-auto"
            >   
                <ImagePicker onImageSelected={(file) => setImage(file)} value={image} id={id}/>
                <input 
                    type="text" 
                    onInput={(e) => setTitle(e.target.value)} 
                    placeholder="Название новости" 
                    className="w-1/2 border border-gray-300 px-4 py-2 box-border rounded-lg outline-none"
                    value={title}
                />
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
