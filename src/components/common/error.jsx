import errorImg from '../../assets/icons/error.svg';

export const Error = ({ text }) => {
    return (
        <div className="w-[400px] text-sm font-medium text-red-600 flex items-center justify-center gap-2 p-2 border-2 border-red-600 rounded-xl">
            <img src={errorImg} width={24} height={24} alt="done" />
            <h2>{text}</h2>
        </div>
    );
};