export default function BurgerMenuIcon({
    className,
    width = 24,
    height = 24,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect
                height="3"
                width="3"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.5"
                x="10.5"
                y="3"
            />
            <rect
                height="3"
                width="3"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.5"
                x="10.5"
                y="10.5"
            />
            <rect
                height="3"
                width="3"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.5"
                x="10.5"
                y="18"
            />
        </svg>
    );
}
