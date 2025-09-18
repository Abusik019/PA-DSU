import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getNews } from '../../store/slices/news';
import { PlusRounded } from '../../assets';
import NotData from '../../components/layouts/NotData';
import { Login } from '../../components/layouts/Login';
import { Registration } from '../../components/layouts/Registration';
import FeedbackDropList from '../../components/common/feedbackDropList';
import { useScreenWidth } from './../../providers/ScreenWidthProvider';
import NewsSlider from './../../components/common/newsSlider';

export default function Home() {
    const dispatch = useDispatch();
    const myInfo = useSelector((state) => state.users.list);
    const news = useSelector((state) => state.news.list);
    const windowWidth = useScreenWidth();

    const [isShowLogin, setIsShowLogin] = useState(true);

    const token = localStorage.getItem('access_token');

    const isAdmin = myInfo.is_superuser;

    useEffect(() => {
        dispatch(getNews());
    }, [dispatch]);

    return (
        <div className="w-full h-fit flex flex-col items-center max-sm:mt-10 max-sm:mb-20">
            <div className="w-full pt-12 box-border">
                <div className='w-full flex items-center justify-between'>
                    <h1 className="text-5xl">Колледж ДГУ</h1>
                    {(isAdmin && windowWidth >= 640) && <Link to="/create-news"><PlusRounded width={30} height={30} /></Link>}
                </div>
                <div className="w-full h-[2px] bg-black rounded-lg mt-8"></div>
            </div>
            <div style={{ height: 'calc(100% - 138px)'}} className="w-full flex items-start gap-10 pt-8 box-border max-sm:flex-col">
                {news?.results?.length == 0 ? (
                    <NotData text="Новостей пока нет" />
                ) : (
                    <NewsSlider news={news?.results} maxSlides={4} />
                )}
                {!token && (isShowLogin ? <Login setIsShowLogin={setIsShowLogin} /> : <Registration setIsShowLogin={setIsShowLogin}/>)}
                {token && <FeedbackDropList />}
            </div>
        </div>
    )
}