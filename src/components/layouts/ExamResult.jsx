import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { QuizzIcon, UserIcon } from '../../assets';

export const ExamResult = ({ resultData }) => {
    const exam = useSelector((state) => state.exams.list);
    
    return (
        <div className='w-full h-full flex flex-col items-center justify-between pt-[100px] pb-5 box-border'>
            <h1 className='text-3xl self-start'>Экзамен окончен!</h1>
            <div className='flex flex-col items-center gap-5 pb-10'>
                <h2 className='text-5xl font-medium'>{exam?.title}</h2>
                <div className='flex items-center gap-2 mt-10'>
                    <UserIcon />
                    <span className='text-xl'>{resultData?.student?.first_name} {resultData?.student?.last_name}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <QuizzIcon />
                    <span className='text-xl'>Ваша оценка:  <b>{resultData?.score}</b></span>
                </div>
            </div>
            <Link to='/exams' className='py-1 px-3 box-border bg-black text-white text-center rounded-lg text-lg min-w-[130px] self-end'>Далее</Link>
        </div>
    )
}
