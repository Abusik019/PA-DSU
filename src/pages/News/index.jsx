import { useEffect, useState } from 'react';
import Modal from './../../components/layouts/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { getNews } from '../../store/slices/news';
import NewsItem from '../../components/common/newsItem';
import { BackButton } from '../../components/layouts/BackButton';
import SelectCategory from '../../components/common/selectCategory';
import { FilterIcon } from '../../assets';

export default function News() {
    const dispatch = useDispatch();
    const news = useSelector((state) => state.news.list);

    const   [isModalOpen, setIsModalOpen] = useState(false),
            [filter, setFilter] = useState({
                keywords: '',
                category: { label: '' },
                timeToRead: null,
            }),
            [filteredNews, setFilteredNews] = useState(news);

    useEffect(() => {
        dispatch(getNews());
    }, [dispatch]);

    useEffect(() => {
        setFilteredNews(news?.results || []);
    }, [news]);

    function handleSaveFilter() {
        setIsModalOpen(false);
        
        let filtered = news?.results || [];

        // Фильтрация по ключевым словам
        if (filter.keywords.trim()) {
            const kw = filter.keywords.trim().toLowerCase();
            filtered = filtered.filter(item => item.title?.toLowerCase().includes(kw));
        }

        // Фильтрация по категории
        if (filter.category && filter.category.value) {
            filtered = filtered.filter(item => item.category?.id === filter.category.value);
        }

        // Фильтрация по времени на прочтение
        if (filter.timeToRead > 0) {
            filtered = filtered.filter(item => Number(item.time_to_read) <= Number(filter.timeToRead));
        }

        setFilteredNews(filtered);
    }

    function handleResetFilter() {
        setFilter({
            keywords: '',
            category: { label: '' },
            timeToRead: 0,
        });
        setFilteredNews(news?.results || []);
        setIsModalOpen(false);
    }

    return (
        <div className="w-full h-full overflow-hidden flex flex-col items-center relative">
            <BackButton path='/'/>
            <div className="w-full pt-12 box-border">
                <div className='w-full flex items-center justify-between py-4'>
                    <h1 className="text-5xl">Новости</h1>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center w-10 h-10 bg-transparent rounded-md transition-all hover:bg-gray-200">
                        <FilterIcon />
                    </button>
                </div>
                <div className="w-full h-[2px] bg-black rounded-lg mt-4"></div>
            </div>
            <div
                style={{ height: "calc(100% - 138px)" }}
                className="w-full flex flex-col items-center gap-10 pt-8 box-border overflow-y-auto"
            >
                <ul className='w-full grid grid-cols-3 gap-6 px-8 pb-5'>
                    {filteredNews.length > 0 ? (
                        filteredNews.map((item) => (
                            <NewsItem
                                id={item?.id}
                                width='1/3'
                                height='[300px]'
                                key={item?.id}
                                image={item?.image}
                                title={item?.title}
                                category={item?.category?.title}
                                readTime={item?.time_to_read} 
                                isShadow={true}
                                isActions={true}
                            />
                        ))
                    ) : (
                        <li className="col-span-3 text-center text-gray-400 py-10">Нет новостей по выбранным фильтрам</li>
                    )}
                </ul>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultDeletion={true}>
                <div className='w-[600px] h-fit overflow-y-auto flex flex-col items-start gap-8'>
                    <h2 className='text-3xl font-semibold self-center'>Фильтрация новостей</h2>
                    <div className='flex items-center gap-8 mt-4'>
                        <label htmlFor="keyWords" className='text-lg font-medium w-[150px]'>Ключевые слова</label>
                        <input 
                            className='w-[400px] border border-gray-200 px-2 py-1 box-border rounded-lg outline-none' 
                            type="text" 
                            name="keyWords" 
                            placeholder='Введите текст' 
                            onInput={(e) => setFilter({ ...filter, keywords: e.target.value })}
                            value={filter.keywords}
                        />
                    </div>
                    <div className='flex items-center gap-8'>
                        <label className='text-lg font-medium min-w-[150px]'>Категория</label>
                        <SelectCategory 
                            onChange={(value, option) =>
                                setFilter((prev) => ({
                                    ...prev,
                                    category: {
                                        value: value, 
                                        label: option.label, 
                                    },
                                }))
                            } 
                            value={filter.category.label} 
                            width="100%" 
                        />
                    </div>
                    <div className='flex items-center gap-8'>
                        <label htmlFor="timeToRead" className='text-lg font-medium w-[150px]'>Время на прочтение</label>
                        <input 
                            className='w-[120px] border border-gray-200 px-2 py-1 box-border rounded-lg outline-none' 
                            type="number" 
                            name="timeToRead" 
                            placeholder='< 30 минут'  
                            value={filter.timeToRead}
                            min={0}
                            onInput={(e) => setFilter({ ...filter, timeToRead: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === '+' ) e.preventDefault();
                            }}
                        />
                    </div>
                    <div className='w-full flex flex-col items-center gap-2 mt-4'>
                        <button onClick={handleResetFilter} className='w-full py-1 bg-white border border-black text-black text-lg font-medium rounded-lg'>Сбросить фильтры</button>
                        <button onClick={handleSaveFilter} className='w-full py-1 bg-blue-500 text-white text-lg font-medium rounded-lg'>Сохранить</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
