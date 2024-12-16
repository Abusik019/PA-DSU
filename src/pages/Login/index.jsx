import styles from "./style.module.scss";
import { useState } from "react";
import handleValidateEmail from './../../Utils/emailValidation';
import { Link } from 'react-router-dom';

import hidePasswordImg from "../../assets/icons/hidePassword.svg";
import showPasswordImg from "../../assets/icons/showPassword.svg";
import hidePasswordImgRed from "../../assets/icons/redHidePassword.svg";
import showPasswordImgRed from "../../assets/icons/redShowPassword.svg";

export default function Login() {
    const [hidePassword, setHidePassword] = useState(true);
    const [emailVaildate, setEmailVaildate] = useState(true);
    const [passwordVaildate, setPasswordVaildate] = useState(true);

    return (
        <div className={styles.loginWrapper}>
           <form>
                <h2>Вход в аккаунт</h2>
                <div className={styles.email}>
                    <label style={{color: emailVaildate ? '#000' : '#F63939'}} htmlFor="email">{emailVaildate ? 'E-mail' : 'E-mail введен некорректно'}</label>
                    <input
                        type="text"
                        id="email"
                        placeholder="Введите email"
                        onChange={(e) => handleValidateEmail(e, setEmailVaildate)}
                        style={{borderColor: emailVaildate ? '#808080' : '#F63939', color: emailVaildate ? '#000' : '#F63939'}}
                        required
                    />
                </div>
                <div className={styles.password}>
                    <label style={{color: passwordVaildate ? '#000' : '#F63939'}} htmlFor="password">{passwordVaildate ? "Пароль" : "Пароль должен содержать минимум 8 символов"}</label>
                    <input
                        type={hidePassword ? "password" : "text"}
                        id="password"
                        placeholder="Введите пароль"
                        onChange={(e) => {
                            if(e.target.value.length < 8){
                                setPasswordVaildate(false);
                            } else{
                                setPasswordVaildate(true);
                            }
                        }}
                        style={{borderColor: passwordVaildate ? '#808080' : '#F63939', color: passwordVaildate ? '#000' : '#F63939'}}
                        required
                    />
                    <button
                        className={styles.passwordVisible}
                        onClick={(e) => {
                            e.preventDefault();
                            setHidePassword((prevState) => !prevState);
                        }}
                    >
                        <img
                            src={
                                hidePassword ? passwordVaildate ? showPasswordImg : showPasswordImgRed : passwordVaildate ? hidePasswordImg : hidePasswordImgRed
                            }
                        />
                    </button>
                </div>
                <button className={styles.login}>Войти</button>
                <a href="#" className={styles.forgotPassword}>
                    Забыли пароль?
                </a>
                <Link to="/authorization" className={styles.isHaveAccount}>Нет аккаунта?</Link>
            </form>
        </div>
    );
}
