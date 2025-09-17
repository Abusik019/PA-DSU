import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { login, resetError } from "../../store/slices/auth";
import { useDispatch, useSelector } from 'react-redux';
import { getMyInfo } from "../../store/slices/users";
import { message } from "antd";
import { EyeCloseIcon, EyeIcon } from "../../assets";

export const Login = ({ setIsShowLogin }) => {
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
        <form className="w-[30%] h-fit bg-gray-100 border border-gray-200 rounded-xl py-7 px-4 box-border flex flex-col items-center max-sm:w-full">
            <h2 className="text-2xl font-normal w-full text-center mb-4">Авторизация</h2>
            <input 
                type="text"
                name="username"
                placeholder="Имя пользователя" 
                className="w-full h-10 mb-3 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onInput={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <div className="w-full mb-3 relative">
                <input 
                    type={hidePassword ? "password" : "text"}
                    name="password"
                    placeholder="Пароль" 
                    className="w-full h-10 rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onInput={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                    type="button"
                    style={{ top: 'calc(50% - 10px)' }}
                    className="absolute right-3 bg-transparent h-5 w-5 focus:outline-none"
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
                className={`w-full mt-5 p-2 rounded-lg text-white text-base font-semibold cursor-pointer ${isDisabled || loading ? "bg-gray-400 cursor-not-allowed" : "bg-black"}`}
                onClick={handleSubmit}
            >
                {loading ? 'Загрузка...' : 'Войти'}
            </button>
            <div className="w-full flex items-center justify-between mt-5">
                <button
                    type="button"
                    onClick={() => {
                        dispatch(resetError());
                        setIsShowLogin(false);
                    }} 
                    className="text-sm font-medium text-black opacity-80 cursor-pointer text-center"
                >
                    Нет аккаунта?
                </button>
                <Link to="/reset-password" className="text-xs text-black opacity-50 cursor-pointer text-center hover:underline">
                    Забыли пароль?
                </Link>
            </div>
        </form>
    );
}
