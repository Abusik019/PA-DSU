import { CrossIcon } from '../../assets';

export const CloseButton = ({ onClick = () => {} }) => {
    return (
        <button 
            className="absolute top-4 right-4 w-6 h-6 bg-transparent" 
            onClick={onClick}
        >
            <CrossIcon width={24} height={24} />
        </button>
    );
};
