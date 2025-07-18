export default function SearchIcon({
    className,
    width = 24,
    height = 24,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M17.5 17.5L22 22"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <path
                d="M20 11a9 9 0 10-18 0 9 9 0 0018 0z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    );
}
