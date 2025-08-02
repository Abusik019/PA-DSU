import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getNews } from '../../store/slices/news';
import { ArrowBackIcon, PlusRounded } from '../../assets';
import NotData from '../../components/layouts/NotData';
import { Login } from '../../components/layouts/Login';
import { Registration } from '../../components/layouts/Registration';

export default function Home() {
    const dispatch = useDispatch();
    const myInfo = useSelector((state) => state.users.list);
    const news = useSelector((state) => state.news.list);
    const lastNews = Array.isArray(news.results) && news.results[news.results.length - 1];

    const [isShowLogin, setIsShowLogin] = useState(true);

    const isAdmin = myInfo.is_superuser;

    useEffect(() => {
        dispatch(getNews());
    }, [dispatch]);

    return (
        <div className="w-full h-fit flex flex-col items-center">
            <div className="w-full pt-12 box-border">
                <div className='w-full flex items-center justify-between'>
                    <h1 className="text-5xl">Главная</h1>
                    {isAdmin && <Link to="/create-news"><PlusRounded width={30} height={30} /></Link>}
                </div>
                <div className="w-full h-[2px] bg-black rounded-lg mt-8"></div>
            </div>
            <div style={{ height: 'calc(100% - 138px)'}} className="w-full flex items-start gap-10 pt-8 box-border">
                {news?.results?.length === 0 ? (
                    <NotData text="Новостей пока нет" />
                ) : (
                    <>
                        <div className="min-w-[70%] flex flex-col items-start gap-5">
                            <img src={lastNews?.image} alt="news image" className="w-full h-[300px] object-cover rounded-lg" />
                            <div>
                                <h2 className='text-3xl mt-3 line-clamp-2'>{lastNews?.title}</h2>
                                <div className='mt-5'>
                                    <span className='text-red-500 font-medium'>{lastNews?.category?.title}</span> • {lastNews?.time_to_read} минут чтения
                                </div>
                            </div>
                            <div className='w-full flex items-center justify-between mt-5'>
                                <Link to={`/news/${lastNews?.id}`} className='text-white bg-gray-700 rounded-md p-[10px] box-border'>Подробнее</Link>
                                <Link to="/news" className='flex items-center gap-1'>
                                    <span>Больше новостей</span>
                                    <ArrowBackIcon className='rotate-180'/>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
                {isShowLogin ? <Login setIsShowLogin={setIsShowLogin} /> : <Registration setIsShowLogin={setIsShowLogin} />}
            </div>
        </div>
    )
}
