import { useState, useEffect } from "react";
import { FormValidator } from "../../utils";
import InputField from "../../components/common/InputField";
import { Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { registration } from "../../store/slices/auth";
import { useDispatch, useSelector } from 'react-redux';
import { Success } from "../../components/common/success";

const createValidatorConfig = () => [
    {
        field: "username",
        method: (value) => /^[a-zA-Zа-яА-я0-9_-]+$/.test(value),
        validWhen: true,
        message: "Неверный формат имени пользователя",
    },
    {
        field: "firstName",
        method: (value) => /^[a-zA-Zа-яА-я]+$/.test(value),
        validWhen: true,
        message: "Неверный формат имени",
    },
    {
        field: "lastName",
        method: (value) => /^[a-zA-Zа-яА-я]+$/.test(value),
        validWhen: true,
        message: "Неверный формат фамилии",
    },
    {
        field: "email",
        method: (value) => /.+@.+\..+/.test(value),
        validWhen: true,
        message: "Неверный формат email",
    },
    {
        field: "password",
        method: (value) => value.length >= 8,
        validWhen: true,
        message: "Пароль должен содержать минимум 8 символов",
    },
];

const Registration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({ username: "", firstName: "", lastName: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const validator = new FormValidator(createValidatorConfig());
    
    useEffect(() => {
        const validationErrors = validator.validate(formData);
        setErrors(validationErrors);
        const allFieldsFilled = Object.values(formData).every((value) => value.trim() !== "");
        const noValidationErrors = Object.keys(validationErrors).length === 0;
        
        setIsValid(allFieldsFilled && noValidationErrors);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(registration({...formData, isTeacher: isTeacher}));
        setIsDone(error ? false : true);
        setTimeout(() => {
            navigate('/sign-in')
        }, 2000)
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-5">
            {isDone && <Success text="Регистрация прошла успешно"/>}
            <form className="w-[400px] h-fit bg-gray-100 border border-gray-200 rounded-3xl p-[30px] box-border flex flex-col items-start">
                <h2 className="text-3xl font-normal w-full text-center mb-[30px]">Регистрация</h2>
                <InputField
                    title="Имя пользователя"
                    name="username"
                    type="username"
                    handleChange={handleChange}
                    formData={formData}
                    errors={errors}
                />
                <div className="flex flex-row items-center gap-[10px] max-w-full">
                    <InputField
                        title="Имя"
                        name="firstName"
                        type="firstName"
                        handleChange={handleChange}
                        formData={formData}
                        errors={errors}
                    />
                    <InputField
                        title="Фамилия"
                        name="lastName"
                        type="lastName"
                        handleChange={handleChange}
                        formData={formData}
                        errors={errors}
                    />
                </div>
                <InputField
                    title="Email"
                    name="email"
                    type="email"
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
                <Checkbox onChange={() => setIsTeacher(value => !value)}>Преподаватель</Checkbox>
                <button
                    disabled={!isValid || loading}
                    className={`w-full mt-5 p-2 rounded-xl text-white text-base font-semibold ${isValid ? "bg-black" : "bg-gray-400"}`}
                    onClick={handleSubmit}
                >
                    {loading ? 'Загрузка...' : 'Отправить'}
                </button>
                <Link to="/sign-in" className="text-sm text-black mt-[20px] opacity-50 cursor-pointer w-full text-center transition-opacity hover:opacity-100">Уже зарегистрированы?</Link>
            </form>
        </div>
    );
};

export default Registration;
