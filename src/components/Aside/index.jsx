import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import logo from "../../assets/icons/example-logo.png";
import avatar from "../../assets/images/example-profile.png";
import login from '../../assets/icons/login.svg';

export const Aside = () => {
    const [isLogin, setIsLogin] = useState(false);
    const token = localStorage.getItem('access_token')
    
    useEffect(() => {
        if(token){
            setIsLogin(true);
        } else{
            setIsLogin(false);
        }
    }, [token])

    return (
        <div className={styles.aside}>
            <Link to="/">
                <img src={logo} width={48} height={48} alt="logo" />
            </Link>
            <ul className={styles.navLinks}>
                <li className={styles.info}>
                    <Link to="/groups"></Link>
                </li>
                <li className={styles.lectures}>
                    <Link to="#"></Link>
                </li>
                <li className={styles.tasks}>
                    <Link to="#"></Link>
                </li>
            </ul>
            <Link to={isLogin ? "/profile" : "/login"}>
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
