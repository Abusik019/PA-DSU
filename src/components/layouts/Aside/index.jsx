import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyInfo } from "../../../store/slices/users";
import logo from "../../../assets/images/dgu.logo.png";
import { LoginIcon } from "../../../assets";

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
        <div className={styles.aside}>
            <Link to="/">
                <img src={logo} width={60} height={60} alt="logo" />
            </Link>
            <ul className={styles.navLinks}>
                <li className={styles.home}>
                    <Link to="/" title="Главная"></Link>
                </li>
                {myInfo.is_teacher && 
                    <li className={styles.info}>
                        <Link to="/my-groups" title="Группы"></Link>
                    </li>
                }
                <li className={styles.lectures}>
                    <Link to="/lectures" title="Лекции"></Link>
                </li>
                <li className={styles.tasks}>
                    <Link to="/exams" title="Экзамены"></Link>
                </li>
                <li className={styles.chat}>
                    <Link to="/chats" title="чаты"></Link>
                </li>
            </ul>
            <Link to={isLogin ? `/user/${myInfo.id}` : "/sign-in"}>
                {isLogin ? <img src={myInfo.image} className="object-cover rounded-full w-12 h-12" alt="avatar"  /> : <LoginIcon />}
            </Link>
        </div>
    );
};
