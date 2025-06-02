import { Link } from "react-router-dom";

export default function NewsItem({ width = 'auto', key, image, title, category, readTime }) {
    return (
        <li key={key} className={`w-${width} max-w-[${width}] h-[280px]`}>
            <img
                src={image}
                alt="news image"
                className="max-w-full h-[150px] object-cover rounded-lg"
            />
            <Link to="#" className="mt-2 font-xl line-clamp-3">{title}</Link>
            <h2 className="mt-4 text-[#00000080]">
                <span className="text-red-500 font-medium">{category}</span> • {readTime} minutes read
            </h2>
        </li>
    );
}
