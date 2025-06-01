import { Link } from 'react-router-dom';
import NewsItem from './../../components/common/newsItem';
import newsImage from '../../assets/images/mockNews.png';
import arrowImg from '../../assets/icons/longArrow.svg';
import plusImg from '../../assets/icons/plus.svg';

export default function Home() {
    return (
        <div className="w-full h-full overflow-hidden flex flex-col items-center">
            <div className="w-full pt-12 box-border">
                <div className='w-full flex items-center justify-between'>
                    <h1 className="text-5xl">Новости</h1>
                    <Link to="/create-news"><img src={plusImg} width={30} height={30} alt="plus" /></Link>
                </div>
                <div className="w-full h-[2px] bg-black rounded-lg mt-8"></div>
            </div>
            <div style={{ height: 'calc(100% - 138px)'}} className="w-full flex flex-col items-center gap-10 pt-8 box-border">
                <div className="w-full flex items-center gap-12">
                    <img src={newsImage} alt="news image" className="w-1/2 h-[300px] object-cover rounded-lg" />
                    <div>
                        <h4 className='text-sm text-[#00000080]'>
                            Author • 12 minutes ago
                        </h4>
                        <Link to="#" className='text-3xl mt-3 line-clamp-2'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. lore</Link>
                        <p className='text-[#00000090] mt-3 line-clamp-4'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci quae inventore, et deleniti dolore nam enim fugit perferendis porro, blanditiis recusandae ipsa possimus explicabo quo saepe eum aliquam est minima! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laudantium assumenda atque quia, laboriosam doloremque omnis autem delectus vel a voluptatibus, est exercitationem veritatis eum. Rerum dicta autem iste facere nemo!</p>
                        <div className='mt-5'>
                            <span className='text-red-500 font-medium'>Sport</span> • 8 minutes read
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-between w-full'>
                    <h2 className='text-xl font-medium'>Последние новости</h2>
                    <Link to="/news" className='flex items-center gap-2'>
                        <span>Посмотреть все</span>
                        <img src={arrowImg} width={24} height={24} alt="arrow" className='-rotate-90'/>
                    </Link>
                </div>
                <ul className='w-full flex items-center justify-between gap-5'>
                    <NewsItem width="1/4" image={newsImage} title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam eum, accusamus, recusandae esse saepe eos atque dicta numquam unde similique amet commodi, odio harum expedita nam assumenda iste quo. Mollitia." category="Sport" readTime={8}/>
                    <NewsItem width="1/4" image={newsImage} title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam eum, accusamus, recusandae esse saepe eos atque dicta numquam unde similique amet commodi, odio harum expedita nam assumenda iste quo. Mollitia." category="Sport" readTime={8}/>
                    <NewsItem width="1/4" image={newsImage} title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam eum, accusamus, recusandae esse saepe eos atque dicta numquam unde similique amet commodi, odio harum expedita nam assumenda iste quo. Mollitia." category="Sport" readTime={8}/>
                    <NewsItem width="1/4" image={newsImage} title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam eum, accusamus, recusandae esse saepe eos atque dicta numquam unde similique amet commodi, odio harum expedita nam assumenda iste quo. Mollitia." category="Sport" readTime={8}/>
                </ul>
            </div>
        </div>
    )
}
