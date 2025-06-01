import { useState } from 'react';
import Modal from './../../components/layouts/Modal';

import filterImg from '../../assets/icons/filter2.svg';
import NewsItem from '../../components/common/newsItem';
import newsImage from '../../assets/images/mockNews.png';
import SelectCategory from '../../components/common/selectCategory';

export default function News() {
    const   [isModalOpen, setIsModalOpen] = useState(false),
            [filter, setFilter] = useState({
                keywords: '',
                category: { label: '' },
                timeToRead: 0,
            });

    console.log(filter.timeToRead);

    return (
        <div className="w-full h-full overflow-hidden flex flex-col items-center">
            <div className="w-full pt-12 box-border">
                <div className='w-full flex items-center justify-between py-4'>
                    <h1 className="text-5xl">Новости</h1>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center w-10 h-10 bg-transparent rounded-md transition-all hover:bg-gray-200">
                        <img src={filterImg} width={28} height={28} alt="filter" />
                    </button>
                </div>
                <div className="w-full h-[2px] bg-black rounded-lg mt-4"></div>
            </div>
            <div
                style={{ height: "calc(100% - 138px)" }}
                className="w-full flex flex-col items-center gap-10 pt-8 box-border overflow-y-auto"
            >
                <ul className='w-full grid grid-cols-3 gap-6 px-8'>
                    <NewsItem image={newsImage} title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam eum, accusamus, recusandae esse saepe eos atque dicta numquam unde similique amet commodi, odio harum expedita nam assumenda iste quo. Mollitia." category="Sport" readTime={8}/>
                    <NewsItem image={newsImage} title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam eum, accusamus, recusandae esse saepe eos atque dicta numquam unde similique amet commodi, odio harum expedita nam assumenda iste quo. Mollitia." category="Sport" readTime={8}/>
                    <NewsItem image={newsImage} title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam eum, accusamus, recusandae esse saepe eos atque dicta numquam unde similique amet commodi, odio harum expedita nam assumenda iste quo. Mollitia." category="Sport" readTime={8}/>
                    <NewsItem image={newsImage} title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam eum, accusamus, recusandae esse saepe eos atque dicta numquam unde similique amet commodi, odio harum expedita nam assumenda iste quo. Mollitia." category="Sport" readTime={8}/>
                    <NewsItem image={newsImage} title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam eum, accusamus, recusandae esse saepe eos atque dicta numquam unde similique amet commodi, odio harum expedita nam assumenda iste quo. Mollitia." category="Sport" readTime={8}/>
                    <NewsItem image={newsImage} title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam eum, accusamus, recusandae esse saepe eos atque dicta numquam unde similique amet commodi, odio harum expedita nam assumenda iste quo. Mollitia." category="Sport" readTime={8}/>
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
                        />
                    </div>
                    <div className='flex items-center gap-8'>
                        <label className='text-lg font-medium min-w-[150px]'>Категория</label>
                        <SelectCategory setFilter={setFilter} value={filter.category.label} />
                    </div>
                    <div className='flex items-center gap-8'>
                        <label htmlFor="timeToRead" className='text-lg font-medium w-[150px]'>Время на прочтение</label>
                        <input 
                            className='w-[120px] border border-gray-200 px-2 py-1 box-border rounded-lg outline-none' 
                            type="number" 
                            name="timeToRead" 
                            placeholder='< 30 минут'  
                            min={0}
                            onInput={(e) => setFilter({ ...filter, timeToRead: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === '+' ) e.preventDefault();
                            }}
                        />
                    </div>
                    <button className='w-full py-1 bg-blue-500 text-white text-xl font-medium rounded-lg'>Сохранить</button>
                </div>
            </Modal>
        </div>
    );
}
