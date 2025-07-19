import { Link } from 'react-router-dom';
import NewsItem from './../../components/common/newsItem';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getNews } from '../../store/slices/news';
import { ArrowBackIcon, PlusRounded } from '../../assets';
import NotData from '../../components/layouts/NotData';

export default function Home() {
    const dispatch = useDispatch();
    const myInfo = useSelector((state) => state.users.list);
    const news = useSelector((state) => state.news.list);
    const lastNews = Array.isArray(news.results) && news.results[news.results.length - 1];
    const latestNews = Array.isArray(news.results) ? news.results.slice(-4).reverse() : [];

    const isAdmin = myInfo.is_superuser;

    useEffect(() => {
        dispatch(getNews());
    }, [dispatch]);

    return (
        <div className="w-full h-fit flex flex-col items-center">
            <div className="w-full pt-12 box-border">
                <div className='w-full flex items-center justify-between'>
                    <h1 className="text-5xl">Новости</h1>
                    {isAdmin && <Link to="/create-news"><PlusRounded width={30} height={30} /></Link>}
                </div>
                <div className="w-full h-[2px] bg-black rounded-lg mt-8"></div>
            </div>
            <div style={{ height: 'calc(100% - 138px)'}} className="w-full flex flex-col items-center gap-10 pt-8 pb-10 box-border">
                {news?.results?.length === 0 ? (
                    <NotData text="Новостей пока нет" />
                ) : (
                    <>
                        <div className="w-full flex items-center gap-12">
                            <img src={lastNews?.image} alt="news image" className="w-1/2 h-[300px] object-cover rounded-lg" />
                            <div>
                                {/* <h4 className='text-sm text-[#00000080]'>
                                    Author • 12 minutes ago
                                </h4> */}
                                <Link to="#" className='text-3xl mt-3 line-clamp-2'>{lastNews?.title}</Link>
                                <p
                                    className='text-[#00000090] mt-3 line-clamp-4'
                                    dangerouslySetInnerHTML={{ __html: lastNews?.text || '' }}
                                />
                                <div className='mt-5'>
                                    <span className='text-red-500 font-medium'>{lastNews?.category?.title}</span> • {lastNews?.time_to_read} минут чтения
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-between w-full'>
                            <h2 className='text-xl font-medium'>Последние новости</h2>
                            <Link to="/news" className='flex items-center gap-2'>
                                <span>Посмотреть все</span>
                                <ArrowBackIcon className="rotate-180" width={24} height={24}/>
                            </Link>
                        </div>
                        <ul className='w-full grid grid-cols-4 gap-5'>
                            {latestNews?.map((item) => (
                                <NewsItem 
                                    id={item?.id}
                                    width='1/4'
                                    height='[200px]'
                                    key={item?.id} 
                                    image={item?.image} 
                                    title={item?.title} 
                                    category={item?.category?.title}
                                    readTime={item?.time_to_read} 
                                    isShadow={false}
                                    isActions={false}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    )
}
