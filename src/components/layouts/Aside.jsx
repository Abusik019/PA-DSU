import styles from "../style.module.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyInfo } from "../../store/slices/users";
import { LoginIcon } from "../../assets";
import logo from "../../assets/images/dgu.logo.png";

export const Aside = () => {
    const [isLogin, setIsLogin] = useState(false);
    const token = localStorage.getItem('access_token');

    const   dispatch = useDispatch(),
            myInfo = useSelector((state) => state.users.list);
    
    useEffect(() => {
        if(token){
            setIsLogin(true);
        } else{
            setIsLogin(false);
        }
    }, [token])

    useEffect(() => {
        dispatch(getMyInfo());
    }, [dispatch])

    return (
        <div className="h-[calc(100vh-60px)] w-[100px] py-[30px] px-5 box-border border border-gray-200 bg-gray-100 rounded-3xl flex flex-col items-center justify-between fixed">
            <Link to="/">
                <img src={logo} width={60} height={60} alt="logo" />
            </Link>
            <ul className="flex flex-col items-center gap-5">
                <li className="bg-white w-[50px] h-[50px] rounded-full flex justify-center items-center">
                    <Link to="/" title="Главная" className={styles.homeLink}></Link>
                </li>
                {myInfo.is_teacher && 
                    <li className="bg-white w-[50px] h-[50px] rounded-full flex justify-center items-center">
                        <Link to="/my-groups" title="Группы" className={styles.infoLink}></Link>
                    </li>
                }
                <li className="bg-white w-[50px] h-[50px] rounded-full flex justify-center items-center">
                    <Link to="/lectures" title="Лекции" className={styles.lecturesLink}></Link>
                </li>
                <li className="bg-white w-[50px] h-[50px] rounded-full flex justify-center items-center">
                    <Link to="/exams" title="Экзамены" className={styles.tasksLink}></Link>
                </li>
                <li className="bg-white w-[50px] h-[50px] rounded-full flex justify-center items-center">
                    <Link to="/chats" title="чаты" className={styles.chatLink}></Link>
                </li>
            </ul>
            <Link to={isLogin ? `/user/${myInfo.id}` : "/sign-in"}>
                {isLogin ? <img src={myInfo.image} className="object-cover rounded-full w-12 h-12" alt="avatar"  /> : <LoginIcon />}
            </Link>
        </div>
    );
};
