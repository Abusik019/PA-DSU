import { useNavigate } from "react-router-dom";

const checkTokenExpiration = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
        localStorage.removeItem("access_token");
        navigate('/login');
    }
};

export default checkTokenExpiration;