import { useEffect, useState } from 'react';

export default function PassExam({ time }) {
    const totalTimeInSeconds = time * 60;

    const getStoredTime = () => {
        const storedTimeLeft = localStorage.getItem('examTimeLeft');
        if (storedTimeLeft !== null) {
            return Math.max(parseInt(storedTimeLeft, 10), 0);
        }

        const storedStartTime = localStorage.getItem('examStartTime');
        if (storedStartTime) {
            const elapsedTime = Math.floor((Date.now() - parseInt(storedStartTime, 10)) / 1000);
            return Math.max(totalTimeInSeconds - elapsedTime, 0);
        }

        localStorage.setItem('examStartTime', Date.now().toString());
        return totalTimeInSeconds;
    };

    const [timeLeft, setTimeLeft] = useState(getStoredTime());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                const newTimeLeft = prev - 1;
                localStorage.setItem('examTimeLeft', newTimeLeft); 
                if (newTimeLeft <= 0) {
                    clearInterval(timer);
                }
                return newTimeLeft;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            localStorage.setItem('examTimeLeft', timeLeft); 
        };
    }, [timeLeft]);

    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds < 0) return '00:00';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return hours > 0
            ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
            : `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className='text-2xl font-medium opacity-70'>
            {formatTime(timeLeft)}
        </div>
    );
}
