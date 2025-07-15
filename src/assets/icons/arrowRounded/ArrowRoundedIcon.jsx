export default function ArrowRoundedIcon({
    className,
    width = 20,
    height = 20,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11 6h4.5a4.5 4.5 0 110 9H4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <path
                d="M7 12s-3 2.21-3 3 3 3 3 3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
