import { DoneIcon } from '../../assets';

export const Success = ({ text = "" }) => {
    return (
        <div className="w-[400px] text-sm font-medium text-green-600 flex items-center justify-center gap-2 p-2 border-2 border-green-600 rounded-xl">
            <DoneIcon />
            <h2>{text}</h2>
        </div>
    );
};
