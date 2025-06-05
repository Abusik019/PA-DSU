import { Link } from "react-router-dom";
import menuImg from '../../assets/icons/menu.svg';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteNews } from "../../store/slices/news";

export default function NewsItem({ id, width = 'auto', height = 'fit', key, image, title, category, readTime, isShadow = false, isActions = false }) {
    const dispatch = useDispatch();
    const [isOpenDropdown, setIsOpenDropdown] = useState(false);

    const isAdmin = true;

    const handleDeleteNews = async () => {
        if(!id) return;

        await dispatch(deleteNews(id))
            .unwrap()
            .then(() => {
                setIsOpenDropdown(false);
            }).catch((error) => {
                console.error("Error deleting news:", error);
            })
    }   

    return (
        <li key={key} className={`max-w-${width} h-${height} flex flex-col items-start justify-between bg-white rounded-lg ${isShadow && 'shadow-md p-4'} relative`}>
            <img
                src={image}
                alt="news image"
                className="w-full max-w-full h-[150px] object-cover rounded-lg self-center"
            />
            <Link to={`/news/${id}`} className="mt-2 font-xl line-clamp-3 hover:underline">{title}</Link>
            <h2 className="mt-2 text-[#00000080]">
                <span className="text-red-500 font-medium">{category}</span> • {readTime} minutes read
            </h2>
            {Boolean(isAdmin && isActions) && <button onClick={() => setIsOpenDropdown((prev) => !prev)} className="absolute right-4 bottom-4"><img src={menuImg} width={24} height={24} alt="menu" /></button>}
            {isOpenDropdown && (
                <ul className="flex flex-col absolute right-4 bottom-[-80px] z-50 bg-white border border-gray-300 rounded-lg">
                    <li className="text-base rounded-lg hover:bg-gray-100 cursor-pointer"><Link className="w-full h-full py-2 px-3 inline-block" to={`/update-news/${id}`}>Редактировать</Link></li>
                    <li onClick={handleDeleteNews} className="text-base py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer">Удалить</li>
                </ul>
            )}
        </li>
    );
}
