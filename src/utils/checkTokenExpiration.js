export const checkTokenExpiration = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return false; 

    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); 
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
            localStorage.removeItem("access_token");
            return false; 
        }

        return true; 
    } catch (error) {
        console.error("Ошибка проверки токена:", error);
        localStorage.removeItem("access_token");
        return false;
    }
};
