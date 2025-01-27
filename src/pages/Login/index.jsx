import { useState, useEffect } from "react";
import { FormValidator } from "../../utils";
import InputField from "../../components/common/InputField";
import { Link, useNavigate } from 'react-router-dom';
import { login } from "../../store/slices/auth";
import { useDispatch, useSelector } from 'react-redux';
import { getMyInfo } from "../../store/slices/users";

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
    const token = useSelector((state) => state.auth.token); 
    const error = useSelector((state) => state.auth.error);

    const validator = new FormValidator(createValidatorConfig());

    const   dispatch = useDispatch(),
            myInfo = useSelector((state) => state.users.list),
            loading = useSelector((state) => state.users.loading);

    useEffect(() => {
        const validationErrors = validator.validate(formData);
        setErrors(validationErrors);
        const allFieldsFilled = Object.values(formData).every((value) => value.trim() !== "");
        const noValidationErrors = Object.keys(validationErrors).length === 0;

        setIsValid(allFieldsFilled && noValidationErrors);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
        if (token && !loading && !myInfo.id) {
            dispatch(getMyInfo());
        }
    }, [token, loading, myInfo, dispatch]);
    

    useEffect(() => {
        if (token && !loading && myInfo.id) {
            navigate(`/user/${myInfo.id}`);
        }
    }, [token, loading, myInfo, navigate]);

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        dispatch(login({...formData}));
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
                    disabled={!isValid}
                    className={`w-full mt-5 p-2 rounded-xl text-white text-base font-semibold ${isValid ? "bg-black" : "bg-gray-400"}`}
                    onClick={handleSubmit}
                >
                    Отправить
                </button>
                <a href="#" className="text-sm text-black mt-[20px] opacity-100 cursor-pointer text-center">
                    Забыли пароль?
                </a>
                <Link to="/authorization" className="text-sm text-black mt-[5px] opacity-50 cursor-pointer text-center transition-opacity hover:opacity-100">Нет аккаунта?</Link>
            </form>
            {error && <h2 className="text-sm font-medium text-center text-red-500 w-[400px] p-2 border-2 border-red-500 rounded-xl">Неправильное имя пользователя или пароль</h2>}
        </div>
    );
}
