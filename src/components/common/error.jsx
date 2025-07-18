import { StopIcon } from '../../assets';

export const Error = ({ text }) => {
    return (
        <div className="w-[400px] text-sm font-medium text-red-600 flex items-center justify-center gap-2 p-2 border-2 border-red-600 rounded-xl">
            <StopIcon />
            <h2>{text}</h2>
        </div>
    );
};
