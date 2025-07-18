import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { login, resetError } from "../../store/slices/auth";
import { useDispatch, useSelector } from 'react-redux';
import { getMyInfo } from "../../store/slices/users";
import { message } from "antd";
import { EyeCloseIcon, EyeIcon } from "../../assets";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({ username: "", password: "" });
    const [hidePassword, setHidePassword] = useState(true);

    const isDisabled = !formData.username.trim() || !formData.password.trim();

    useEffect(() => {
        if (error) {
            message.error('Неправильное имя пользователя или пароль');
        }
    }, [error]);    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = await dispatch(login({ ...formData })).unwrap();
            if(token){
                const userInfo = await dispatch(getMyInfo()).unwrap();
                if (userInfo?.id) {
                    navigate(`/user/${userInfo.id}`);
                }
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-5 items-center justify-center">
           <form className="w-[400px] h-fit bg-gray-100 border border-gray-200 rounded-3xl p-[30px] box-border flex flex-col items-center">
                <h2 className="text-3xl font-normal w-full text-center mb-[30px]">Вход в аккаунт</h2>
                <div className="w-full mb-[10px] relative">
                    <label className="text-sm mb-1 font-medium text-nowrap" htmlFor="username">Имя пользователя</label>
                    <input 
                        type="text"
                        name="username"
                        placeholder="Имя пользователя" 
                        className="w-full h-10 rounded-lg p-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onInput={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                </div>
                <div className="w-full mb-[10px] relative">
                    <label className="text-sm mb-1 font-medium text-nowrap" htmlFor="password">Пароль</label>
                    <input 
                        type={hidePassword ? "password" : "text"}
                        name="password"
                        placeholder="Пароль" 
                        className="w-full h-10 rounded-lg p-[10px] pr-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onInput={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                        type="button"
                        className="absolute top-[35px] right-[12px] bg-transparent h-5 w-5 focus:outline-none"
                        onClick={(e) => {
                            e.preventDefault();
                            setHidePassword((prevState) => !prevState);
                        }}
                    >
                        {hidePassword ? <EyeCloseIcon /> : <EyeIcon />}
                    </button>
                </div>
                <button
                    disabled={isDisabled || loading}
                    className={`w-full mt-5 p-2 rounded-xl text-white text-base font-semibold cursor-pointer ${isDisabled || loading ? "bg-gray-400 cursor-not-allowed" : "bg-black"}`}
                    onClick={handleSubmit}
                >
                    {loading ? 'Загрузка...' : 'Отправить'}
                </button>
                {/* <a href="#" className="text-sm text-black mt-[20px] opacity-100 cursor-pointer text-center">
                    Забыли пароль?
                </a> */}
                <Link to="/sign-up" onClick={() => dispatch(resetError())}  className="mt-5 text-sm text-black opacity-50 cursor-pointer text-center transition-opacity hover:opacity-100">Нет аккаунта?</Link>
            </form>
        </div>
    );
}
