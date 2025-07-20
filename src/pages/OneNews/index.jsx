import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { useEffect } from "react";
import { getOneNews } from './../../store/slices/news';
import { formatDate } from './../../utils';
import { BackButton } from "../../components/common/BackButton";

export default function OneNews() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const news = useSelector((state) => state.news.news);

    useEffect(() => {
        dispatch(getOneNews(id));
    }, [dispatch, id]);

    return (
        <div className="w-full h-fit relative flex flex-col items-center gap-8 py-16 box-border overflow-y-auto">
            <BackButton />
            <div className="absolute right-0 top-5 opacity-70">{news?.created_at && formatDate(news.created_at)}</div>
            <img src={news?.image} className="object-cover max-w-[50%]"/>
            <h1 className="text-3xl font-medium text-center max-w-[50%]">{news?.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: news?.text || '' }}/>
        </div>
    )
}
