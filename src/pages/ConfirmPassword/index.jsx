import { message } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EyeCloseIcon, EyeIcon } from "../../assets";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../store/slices/users";
import { useScreenWidth } from "../../providers/ScreenWidthProvider";
import logo from '../../assets/images/dgu.logo.png';


export default function ConfirmPassword() {
    const [hidePassword, setHidePassword] = useState(true);
    const [hideConfirm, setHideConfirm] = useState(true);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.users);

    const windowWidth = useScreenWidth();

    const { token: tokenFromPath } = useParams();
    const navigate = useNavigate();

    const isTooShort = password.length < 8;
    const isWeak = password.length > 0 && isTooShort;
    const isMismatch = password !== confirmPassword && confirmPassword.length > 0;
    const isDisabled = isTooShort || isMismatch || loading || !tokenFromPath;

    const inputBase = "w-full h-10 rounded-lg p-2 pr-10 focus:outline-none border transition";
    const inputOk = "border-gray-300 focus:ring-2 focus:ring-blue-500";
    const inputErr = "border-red-500 text-red-600 placeholder-red-400 focus:ring-2 focus:ring-red-500";
    const eyeClass = isWeak ? "text-red-500" : "text-gray-600";

    async function handleSubmit(e) {
        e.preventDefault();
        if (!tokenFromPath) {
            message.error("Токен не найден в ссылке. Проверьте корректность URL.");
            return;
        }
        if (isDisabled) return;

        try {
            await dispatch(
                resetPassword({
                    token: tokenFromPath,
                    new_password: password,
                    confirm_password: confirmPassword,
                })
            ).unwrap(); 

            message.success("Пароль успешно изменен");
            navigate("/"); 
        } catch (error) {
            const msg = error?.message || error || "Ошибка установки нового пароля";
            message.error(msg);
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center">
            <div className="w-full pt-12 box-border">
                <div className='w-full flex items-center max-sm:gap-4'>
                    {windowWidth < 640 && 
                        <Link to="/">
                            <img src={logo} width={60} height={60} alt="logo" />
                        </Link>
                    }
                    <h1 className="text-5xl max-sm:text-3xl max-sm:font-medium">Сброс пароля</h1>
                </div>
                <div className="w-full h-[2px] bg-black rounded-lg mt-8"></div>
            </div>

            <div className="w-full h-[calc(100%-130px)] flex items-center justify-center pt-8 box-border">
                <form
                    className="w-[30%] h-fit bg-gray-100 border border-gray-200 rounded-xl py-7 px-4 box-border flex flex-col items-center max-sm:w-full"
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-2xl font-normal w-full text-center mb-4">Установите новый пароль</h2>
                    {!tokenFromPath && (
                        <p className="w-full text-sm text-red-600 mb-2">
                            Токен в ссылке не найден. Проверьте корректность
                            URL.
                        </p>
                    )}
                    <div className="w-full mb-3 relative">
                        <input
                            type={hidePassword ? "password" : "text"}
                            name="password"
                            placeholder="Пароль"
                            autoComplete="new-password"
                            className={`${inputBase} ${
                                isWeak ? inputErr : inputOk
                            }`}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <button
                            type="button"
                            style={{ top: "calc(50% - 10px)" }}
                            className="absolute right-3 bg-transparent h-5 w-5 focus:outline-none"
                            onClick={(e) => {
                                e.preventDefault();
                                setHidePassword((prevState) => !prevState);
                            }}
                            aria-label="Показать/скрыть пароль"
                            title="Показать/скрыть пароль"
                        >
                            {hidePassword ? (
                                <EyeCloseIcon className={eyeClass} />
                            ) : (
                                <EyeIcon className={eyeClass} />
                            )}
                        </button>
                    </div>

                    <div className="w-full mb-1 relative">
                        <input
                            type={hideConfirm ? "password" : "text"}
                            name="confirmPassword"
                            placeholder="Подтвердите пароль"
                            autoComplete="new-password"
                            className={`${inputBase} ${
                                isMismatch ? inputErr : inputOk
                            }`}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                        />
                        <button
                            type="button"
                            style={{ top: "calc(50% - 10px)" }}
                            className="absolute right-3 bg-transparent h-5 w-5 focus:outline-none"
                            onClick={(e) => {
                                e.preventDefault();
                                setHideConfirm((prevState) => !prevState);
                            }}
                            aria-label="Показать/скрыть подтверждение"
                            title="Показать/скрыть подтверждение"
                        >
                            {hideConfirm ? (
                                <EyeCloseIcon className="text-gray-600" />
                            ) : (
                                <EyeIcon className="text-gray-600" />
                            )}
                        </button>
                    </div>

                    {isMismatch && (
                        <div className="w-full text-sm text-red-600 mb-2">
                            Пароли не совпадают.
                        </div>
                    )}
                    {isWeak && (
                        <div className="w-full text-sm text-red-600 mb-2">
                            Пароль должен содержать не менее 8 символов.
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isDisabled}
                        className={`w-full mt-5 p-2 rounded-lg text-white text-base font-semibold ${
                            isDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black"
                        }`}
                    >
                        {loading ? "Загрузка..." : "Поменять"}
                    </button>
                </form>
            </div>
        </div>
    );
}
