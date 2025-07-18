export default function ResetIcon({
    className,
    width = 24,
    height = 24,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M21.5 12A9.5 9.5 0 1112 2.5a9.502 9.502 0 018.71 5.7m.79-2.7l-.475 3.175L18 8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <path
                d="M10 11V9.5a2 2 0 114 0V11m-2.75 5.5h1.5c1.173 0 1.76 0 2.163-.31a1.5 1.5 0 00.277-.277c.31-.404.31-.99.31-2.163 0-1.173 0-1.76-.31-2.163a1.5 1.5 0 00-.277-.277c-.404-.31-.99-.31-2.163-.31h-1.5c-1.173 0-1.76 0-2.163.31a1.5 1.5 0 00-.277.277c-.31.404-.31.99-.31 2.163 0 1.173 0 1.76.31 2.163a1.5 1.5 0 00.277.277c.404.31.99.31 2.163.31z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    );
}
