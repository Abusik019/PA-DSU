import styles from "../style.module.scss";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyInfo } from "../../store/slices/users";
import logo from "../../assets/images/dgu.logo.png";
import FeedbackDropList from "../common/feedbackDropList";
import { checkTokenExpiration } from "../../utils";
import { useScreenWidth } from "../../providers/ScreenWidthProvider";

export const Aside = () => {
    const token = localStorage.getItem('access_token');
    const isTokenValid = checkTokenExpiration();
    const windowWidth = useScreenWidth();

    const   dispatch = useDispatch(),
            myInfo = useSelector((state) => state.users.list);

    useEffect(() => {
        if (isTokenValid){
            dispatch(getMyInfo());
        }
    }, [dispatch, isTokenValid]);

    if (windowWidth < 640 && !token) {
        return null;
    }

    return (
        <div className="
            h-[calc(100vh-60px)] max-h-[900px] w-[100px] py-[30px] px-5 box-border border border-gray-200 bg-gray-100 rounded-3xl flex flex-col items-center justify-between fixed
            max-sm:fixed max-sm:bottom-4 max-sm:left-0 max-sm:w-[calc(100vw-16px)] max-sm:h-14 max-sm:py-1 max-sm:px-2 max-sm:mx-2 max-sm:rounded-2xl max-sm:z-50
        ">
            <Link to="/" className="max-sm:fixed max-sm:left-4 top-4">
                <img src={logo} width={60} height={60} alt="logo" />
            </Link>
            {token ? (
                <ul className="
                    flex flex-col items-center gap-5
                    max-sm:w-full max-sm:h-full max-sm:flex-row max-sm:justify-center max-sm:gap-9
                ">
                    {(windowWidth >= 640 || !myInfo.is_teacher) && 
                        <li className="bg-white w-[50px] h-[50px] rounded-full flex justify-center items-center max-sm:bg-transparent max-sm:w-8 max-sm:h-8 max-sm:rounded-none">
                            <Link to="/" title="Главная" className={styles.homeLink}></Link>
                        </li>
                    }
                    {myInfo.is_teacher && 
                        <li className="bg-white w-[50px] h-[50px] rounded-full flex justify-center items-center max-sm:bg-transparent max-sm:w-8 max-sm:h-8 max-sm:rounded-none">
                            <Link to="/my-groups" title="Группы" className={styles.infoLink}></Link>
                        </li>
                    }
                    <li className="bg-white w-[50px] h-[50px] rounded-full flex justify-center items-center max-sm:bg-transparent max-sm:w-8 max-sm:h-8 max-sm:rounded-none">
                        <Link to="/lectures" title="Лекции" className={styles.lecturesLink}></Link>
                    </li>
                    {windowWidth < 640 && 
                        <li className="w-20 h-full"></li>
                    }
                    <li className="bg-white w-[50px] h-[50px] rounded-full flex justify-center items-center max-sm:bg-transparent max-sm:w-8 max-sm:h-8 max-sm:rounded-none">
                        <Link to="/exams" title="Экзамены" className={styles.tasksLink}></Link>
                    </li>
                    <li className="bg-white w-[50px] h-[50px] rounded-full flex justify-center items-center max-sm:bg-transparent max-sm:w-8 max-sm:h-8 max-sm:rounded-none">
                        <Link to="/chats" title="чаты" className={styles.chatLink}></Link>
                    </li>
                </ul>
            ) : <></>}
            {token && (
                <Link to={`/user/${myInfo.id}`} className="rounded-full max-sm:p-1 max-sm:bg-gray-500 max-sm:absolute max-sm:left-[calc(50%-32px)] max-sm:top-[calc(50%-36px)]">
                    <img src={myInfo.image} className="object-cover rounded-full w-12 h-12 max-sm:w-16 max-sm:h-16" alt="avatar" />
                </Link>
            )}
            {!token && <FeedbackDropList position="absolute" />}
        </div>
    );
};
