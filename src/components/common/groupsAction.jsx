export default function ActionButton({ isHover, onClick, onMouseEnter, onMouseLeave, activeIcon, inactiveIcon, label }) {
    return (
        <button
            onClick={onClick}
            className="w-fit font-medium py-1 px-2 box-border rounded-lg flex items-center gap-1 transition-colors hover:bg-[#f3eafb] hover:text-[#8531D6]"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <img
                src={isHover ? activeIcon : inactiveIcon}
                width={20}
                height={20}
                alt={`${label} icon`}
            />
            <h2>{label}</h2>
        </button>
    );
}