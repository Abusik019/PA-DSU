import { useState, useEffect } from "react";
import { FormValidator } from "../../utils";
import InputField from "../../components/common/InputField";
import { Link, useNavigate } from 'react-router-dom';
import { login, resetError } from "../../store/slices/auth";
import { useDispatch, useSelector } from 'react-redux';
import { getMyInfo } from "../../store/slices/users";
import { message } from "antd";

const createValidatorConfig = () => [
    {
        field: "username",
        method: (value) => /^[a-zA-Zа-яА-я0-9_-]+$/.test(value),
        validWhen: true,
        message: "Неверный формат имени пользователя",
    },
    {
        field: "password",
        method: (value) => value.length >= 8,
        validWhen: true,
        message: "Пароль должен содержать минимум 8 символов",
    },
];

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);
    const { loading, error } = useSelector((state) => state.auth);

    const validator = new FormValidator(createValidatorConfig());

    const   dispatch = useDispatch(),
            myInfo = useSelector((state) => state.users.list);

    useEffect(() => {
        const validationErrors = validator.validate(formData);
        setErrors(validationErrors);
        const allFieldsFilled = Object.values(formData).every((value) => value.trim() !== "");
        const noValidationErrors = Object.keys(validationErrors).length === 0;

        setIsValid(allFieldsFilled && noValidationErrors);
    }, [formData]);

    useEffect(() => {
        if (error) {
            message.error('Неправильное имя пользователя или пароль');
        }
    }, [error]);    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    
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
           <form className="w-[400px] h-fit bg-[#F3EBE5] rounded-2xl p-[30px] box-border flex flex-col items-center">
                <h2 className="text-3xl font-normal w-full text-center mb-[30px]">Вход в аккаунт</h2>
                <InputField
                    title="Имя пользователя"
                    name="username"
                    type="username"
                    handleChange={handleChange}
                    formData={formData}
                    errors={errors}
                />
                <InputField
                    title="Пароль"
                    name="password"
                    type="password"
                    handleChange={handleChange}
                    formData={formData}
                    errors={errors}
                />
                <button
                    disabled={!isValid || loading}
                    className={`w-full mt-5 p-2 rounded-xl text-white text-base font-semibold ${isValid ? "bg-black" : "bg-gray-400"}`}
                    onClick={handleSubmit}
                >
                    {loading ? 'Загрузка...' : 'Отправить'}
                </button>
                <a href="#" className="text-sm text-black mt-[20px] opacity-100 cursor-pointer text-center">
                    Забыли пароль?
                </a>
                <Link to="/sign-up" onClick={() => dispatch(resetError())}  className="text-sm text-black mt-[5px] opacity-50 cursor-pointer text-center transition-opacity hover:opacity-100">Нет аккаунта?</Link>
            </form>
        </div>
    );
}
