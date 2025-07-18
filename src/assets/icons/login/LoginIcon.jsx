export default function LoginIcon({
    className,
    width = 48,
    height = 48,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10 3l-.663.234c-2.578.91-3.868 1.365-4.602 2.403C4 6.676 4 8.043 4 10.777v2.445c0 2.735 0 4.102.735 5.14.734 1.039 2.024 1.494 4.602 2.404L10 21"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <path
                d="M10 12h10m-10 0c0-.7 1.994-2.008 2.5-2.5M10 12c0 .7 1.994 2.008 2.5 2.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
