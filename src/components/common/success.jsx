import doneImg from '../../assets/icons/done.svg';

export const Success = ({ text = "" }) => {
    return (
        <div className="w-[400px] text-sm font-medium text-green-600 flex items-center justify-center gap-2 p-2 border-2 border-green-600 rounded-xl">
            <img src={doneImg} width={24} height={24} alt="done" />
            <h2>{text}</h2>
        </div>
    );
};
