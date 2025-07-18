export default function MenuIcon({
    className,
    width = 24,
    height = 24,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6.25 10.5a4.25 4.25 0 100-8.5 4.25 4.25 0 000 8.5zM17.75 22a4.25 4.25 0 100-8.5 4.25 4.25 0 000 8.5zM6.25 22a4.25 4.25 0 100-8.5 4.25 4.25 0 000 8.5z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M20.868 2.439l.692.692a1.5 1.5 0 010 2.122l-3.627 3.695a2 2 0 01-1.047.552l-2.248.488a.5.5 0 01-.595-.593l.478-2.235a2 2 0 01.552-1.047l3.674-3.674a1.5 1.5 0 012.12 0z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
