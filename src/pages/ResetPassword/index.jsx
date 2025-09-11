import { message } from 'antd';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../store/slices/users';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [isEmail, setIsEmail] = useState();
    const [isWarning, setIsWarning] = useState(false);

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.users);

    useEffect(() => {
        setIsEmail(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    }, [email]);

    function handleSubmit(){
        dispatch(forgotPassword(email))
            .then(() => {
                message.success('Перейдите по ссылке, отправленной на вашу почту');
                setIsWarning(true);
            })
            .catch((error) => {
                console.error('Ошибка сброса: ', error);
                message.error('Ошибка сброса пароля')
                setIsWarning(false);
            })
    }


    return (
        <div className="w-full h-full flex flex-col items-center">
            <div className="w-full pt-12 box-border">
                <h1 className="text-5xl">Сброс пароля</h1>
                <div className="w-full h-[2px] bg-black rounded-lg mt-8"></div>
            </div>
            <div className="w-full h-[calc(100%-130px)] flex items-center justify-center pt-8 box-border">
                <form className="w-[30%] h-fit bg-gray-100 border border-gray-200 rounded-xl py-7 px-4 box-border flex flex-col items-center">
                    <h2 className="text-2xl font-normal w-full text-center mb-4">Введите вашу почту</h2>
                    <input 
                        type="email"
                        placeholder="Ваша почта" 
                        className="w-full h-10 mt-8 mb-3 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onInput={(e) => setEmail(e.target.value)}
                    />
                    <button
                        type="button"
                        disabled={!isEmail || loading}
                        className={`w-full mt-5 p-2 rounded-lg text-white text-base font-semibold cursor-pointer ${!isEmail || loading ? "bg-gray-400 cursor-not-allowed" : "bg-black"}`}
                        onClick={handleSubmit}
                    >
                        {loading ? 'Загрузка...' : 'Отправить'}
                    </button>
                    {isWarning && <p className="text-red-500 font-medium text-sm self-start mt-4">✱ Письмо может находится в спаме</p>}
                </form>
            </div>
        </div>
    )
}
