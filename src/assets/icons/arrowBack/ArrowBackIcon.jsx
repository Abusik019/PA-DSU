export default function ArrowBackIcon({
    className,
    width = 20,
    height = 20,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4 12h16M9 17s-5-3.682-5-5 5-5 5-5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
