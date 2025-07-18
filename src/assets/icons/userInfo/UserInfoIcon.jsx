export default function UserInfoIcon({
    className,
    width = 28,
    height = 28,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5.08 15.296c-1.218.738-4.412 2.243-2.466 4.126.95.92 2.009 1.578 3.34 1.578h7.593c1.33 0 2.389-.658 3.34-1.578 1.945-1.883-1.25-3.389-2.468-4.126a9.057 9.057 0 00-9.338 0z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <path
                d="M13.5 7a4 4 0 11-8 0 4 4 0 018 0z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M17 5h5M17 8h5M20 11h2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
