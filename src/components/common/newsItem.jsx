import { Link } from "react-router-dom";

export default function NewsItem({ width = 'auto', image, title, category, readTime }) {
    return (
        <li className={`w-${width}`}>
            <img
                src={image}
                alt="news image"
                className="w-full h-[150px] object-cover rounded-lg"
            />
            <Link to="#" className="mt-2 font-xl line-clamp-3">{title}</Link>
            <h2 className="mt-4 text-[#00000080]">
                <span className="text-red-500 font-medium">{category}</span> • {readTime} minutes read
            </h2>
        </li>
    );
}
