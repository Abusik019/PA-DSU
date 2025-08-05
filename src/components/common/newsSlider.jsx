import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ArrowBackIcon } from '../../assets';

export default function NewsSlider({ news, maxSlides = 4 }) {
    const newsForSlider = Array.isArray(news) ? news.slice(0, maxSlides) : [];

    if (newsForSlider.length === 0) {
        return null;
    }

    return (
        <div className="min-w-[70%] flex flex-col items-start gap-5 relative">
            <Swiper
                direction="vertical"
                slidesPerView={1}
                spaceBetween={20}
                modules={[Pagination, Autoplay]}
                pagination={{
                    clickable: true,
                    el: '.custom-pagination',
                    bulletClass: 'swiper-pagination-bullet',
                    bulletActiveClass: 'swiper-pagination-bullet-active',
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                className="w-full h-[500px]"
            >
                {newsForSlider.map((newsItem, index) => (
                    <SwiperSlide key={newsItem.id || index}>
                        <div className="w-full h-full flex flex-col">
                            <img 
                                src={newsItem?.image} 
                                alt="news image" 
                                className="w-full h-[300px] object-cover rounded-lg" 
                            />
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h2 className='text-3xl mt-3 line-clamp-2'>{newsItem?.title}</h2>
                                    <div className='mt-5'>
                                        <span className='text-red-500 font-medium'>{newsItem?.category?.title}</span> • {newsItem?.time_to_read} минут чтения
                                    </div>
                                </div>
                                <div className='w-full flex items-center justify-between mt-5'>
                                    <Link 
                                        to={`/news/${newsItem?.id}`} 
                                        className='text-white bg-gray-700 rounded-md p-[10px] box-border'
                                    >
                                        Подробнее
                                    </Link>
                                    <Link to="/news" className='flex items-center gap-1'>
                                        <span>Больше новостей</span>
                                        <ArrowBackIcon className='rotate-180'/>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="custom-pagination"></div>
        </div>
    );
}