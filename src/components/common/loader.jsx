import loader from "../../assets/icons/loader.gif";

export default function Loader() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <img src={loader} width={64} height={64} alt="loader" />
        </div>
    );
}
