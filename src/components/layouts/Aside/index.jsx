import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyInfo } from "../../../store/slices/users";

import logo from "../../../assets/icons/example-logo.png";
import avatar from "../../../assets/images/example-profile.png";
import login from '../../../assets/icons/login.svg';

export const Aside = () => {
    const [isLogin, setIsLogin] = useState(false);
    const token = localStorage.getItem('access_token');

    const   dispatch = useDispatch(),
            myInfo = useSelector((state) => state.users.list),
            loading = useSelector((state) => state.users.loading),
            error = useSelector((state) => state.users.error);
    
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
                <img src={logo} width={48} height={48} alt="logo" />
            </Link>
            <ul className={styles.navLinks}>
                <li className={styles.email}>
                    <Link to="/notifications"></Link>
                </li>
                <li className={styles.info}>
                    <Link to="/my-groups"></Link>
                </li>
                <li className={styles.lectures}>
                    <Link to="/lectures"></Link>
                </li>
                <li className={styles.tasks}>
                    <Link to="#"></Link>
                </li>
            </ul>
            <Link to={isLogin ? `/user/${myInfo.id}` : "/login"}>
                <img 
                    src={isLogin ? avatar : login} 
                    width={48} 
                    height={48}
                    alt="avatar" 
                />
            </Link>
        </div>
    );
};
