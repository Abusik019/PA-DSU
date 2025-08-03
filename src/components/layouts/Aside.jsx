import styles from "../style.module.scss";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyInfo } from "../../store/slices/users";
import logo from "../../assets/images/dgu.logo.png";
import FeedbackDropList from "../common/feedbackDropList";
import { checkTokenExpiration } from "../../utils";

export const Aside = () => {
    const token = localStorage.getItem('access_token');
    const isTokenValid = checkTokenExpiration();

    const   dispatch = useDispatch(),
            myInfo = useSelector((state) => state.users.list);

    useEffect(() => {
        if (isTokenValid){
            dispatch(getMyInfo());
        }
    }, [dispatch, isTokenValid])

    return (
        <div className="h-[calc(100vh-60px)] max-h-[900px] w-[100px] py-[30px] px-5 box-border border border-gray-200 bg-gray-100 rounded-3xl flex flex-col items-center justify-between fixed">
            <Link to="/">
                <img src={logo} width={60} height={60} alt="logo" />
            </Link>
            {token ? (
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
            ) : <></>}
            {token && (
                <Link to={`/user/${myInfo.id}`}>
                    <img src={myInfo.image} className="object-cover rounded-full w-12 h-12" alt="avatar" />
                </Link>
            )}
            {!token && <FeedbackDropList position="absolute" />}
        </div>
    );
};
