import { Link, useNavigate } from "react-router-dom";
import NotFoundImage from '../../assets/images/NotFoundImg';

export const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="w-full max-h-full overflow-hidden flex items-center justify-center">
            <main className="h-screen w-screen bg-white flex flex-col justify-center items-center font-sans">
                <NotFoundImage />
                <p className="text-[22px] my-[14px]">По-моему вы заблудились :)</p>
                <Link 
                    className="text-xl p-3 border border-solid border-black text-black bg-transparent no-underline transition-all duration-500 ease-in-out hover:text-white hover:bg-black active:text-white active:bg-black" 
                    href="#" 
                    onClick={() => navigate(-1)}
                >
                    Вернуться назад
                </Link>
            </main>
        </div>
    );
};
