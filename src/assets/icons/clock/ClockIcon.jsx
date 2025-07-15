export default function ClockIcon({
    className,
    width = 24,
    height = 24,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5.048 8.607l-2.51-.153C4.338 3.704 9.503 1 14.54 2.344c5.364 1.433 8.55 6.917 7.117 12.25-1.434 5.332-6.945 8.494-12.31 7.061A10.036 10.036 0 012 13.485"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <path
                d="M12 8v4l2 2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
