import styles from "./style.module.scss";
import { Link } from 'react-router-dom';
import { useState } from "react";
import handleValidateEmail from '../../Utils/emailValidation';

import hidePasswordImg from "../../assets/icons/hidePassword.svg";
import showPasswordImg from "../../assets/icons/showPassword.svg";
import hidePasswordImgRed from "../../assets/icons/redHidePassword.svg";
import showPasswordImgRed from "../../assets/icons/redShowPassword.svg";

export default function Authorization() {
    const [hidePassword, setHidePassword] = useState(true);
    const [nameVaildate, setNameVaildate] = useState(true);
    const [surnameVaildate, setSurnameVaildate] = useState(true);
    const [fathersNameValidate, setFathersNameValidate] = useState(true);
    const [emailVaildate, setEmailVaildate] = useState(true);
    const [passwordVaildate, setPasswordVaildate] = useState(true);

    function handleValidateName(e, changeState){
        console.log(e.target.value);
        if(e.target.value !== ''){
            const value = /^[a-zA-Zа-яА-я]+$/.test(e.target.value);
            changeState(value);
        } else{
            changeState(true);
        }
    }

    return (
        <div className={styles.loginWrapper}>
            <form>
                <h2>Регистрация</h2>
                <div className={styles.name}>
                    <label style={{color: nameVaildate ? '#000' : '#F63939'}} htmlFor="name">{nameVaildate ? 'Имя' : 'Имя введено некорректно'}</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Введите имя"
                        onChange={(e) => handleValidateName(e, setNameVaildate)}
                        style={{borderColor: nameVaildate ? '#808080' : '#F63939', color: nameVaildate ? '#000' : '#F63939'}}
                        required
                    />
                </div>
                <div className={styles.nameData}>
                    <div className={styles.surname}>
                        <label style={{color: surnameVaildate ? '#000' : '#F63939'}} htmlFor="surname">{surnameVaildate ? 'Фамилия' : 'Фамилия введена некорректно'}</label>
                        <input
                            type="text"
                            id="surname"
                            placeholder="Введите фамилию"
                            onChange={(e) => handleValidateName(e, setSurnameVaildate)}
                            style={{borderColor: surnameVaildate ? '#808080' : '#F63939', color: surnameVaildate ? '#000' : '#F63939'}}
                            required
                        />
                    </div>
                    <div className={styles.fathersName}>
                        <label style={{color: fathersNameValidate ? '#000' : '#F63939'}} htmlFor="fathersName">{fathersNameValidate ? 'Отчество' : 'Отчество введено некорректно'}</label>
                        <input
                            type="text"
                            id="fathersName"
                            placeholder="Введите отчество"
                            onChange={(e) => handleValidateName(e, setFathersNameValidate)}
                            style={{borderColor: fathersNameValidate ? '#808080' : '#F63939', color: fathersNameValidate ? '#000' : '#F63939'}}
                            required
                        />
                    </div>
                </div>
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
                <button className={styles.login}>Создать аккаунт</button>
                <Link to="/login" className={styles.isHaveAccount}>Уже зарегистрированы?</Link>
            </form>
        </div>
    );
}
