export default function CalendarIcon({
    className,
    width = 24,
    height = 24,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M16.5 2v3.5M7.5 2v3.5M21 12.5v-1c0-3.771 0-5.657-1.172-6.828C18.657 3.5 16.771 3.5 13 3.5h-2c-3.771 0-5.657 0-6.828 1.172C3 5.843 3 7.729 3 11.5v2c0 3.771 0 5.657 1.172 6.828C5.343 21.5 7.229 21.5 11 21.5M3.5 9h17"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <path
                d="M18 19l-1-1v-2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <circle
                cx="17"
                cy="18"
                r="4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
