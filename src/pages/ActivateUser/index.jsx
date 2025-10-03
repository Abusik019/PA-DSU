import { Link, useParams } from "react-router-dom"
import UserIcon from './../../assets/icons/user/UserIcon';
import { useDispatch } from "react-redux";
import { activateUser } from './../../store/slices/auth';
import { useState } from "react";
import DoneIcon from './../../assets/icons/done/DoneIcon';
import { message } from "antd";

export default function ActivateUser() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [isActivated, setIsActivated] = useState(false);

    function handleActivateUser(){
        if(!id) return

        dispatch(activateUser(id)).unwrap()
            .then(() => {
                setIsActivated(true);
            })
            .catch((error) => {
                console.log(error);
                message.error("Ошибка активации пользователя")
                setIsActivated(false);
            })
    }

    return (
        <>
            {isActivated ? (
                <div className="h-full w-full flex flex-col gap-10 items-center justify-center">
                    <DoneIcon width={80} height={80} />
                    <h1 className="text-3xl font-medium text-center">Пользователь успешно активирован</h1>
                    <Link to="/" className="bg-blue-500 text-white text-lg font-medium text-center px-8 py-2 rounded-xl">Войти в аккаунт</Link>
                </div>
            ) : (
                <div className="h-full w-full flex flex-col gap-10 items-center justify-center">
                    <UserIcon width={80} height={80} />
                    <h1 className="text-3xl font-medium text-center">Активация пользователя</h1>
                    <button type="button" onClick={handleActivateUser} className="bg-blue-500 text-white text-lg font-medium text-center px-8 py-2 rounded-xl">Активировать</button>
                </div>
            )}
        </>
    )
}
