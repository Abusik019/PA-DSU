export default function handleValidateEmail(e, changeState) {
    console.log(e.target.value);
    if (e.target.value !== "") {
        const value = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
        changeState(value);
    } else {
        changeState(true);
    }
}