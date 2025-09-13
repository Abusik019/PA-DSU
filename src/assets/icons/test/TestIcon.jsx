export default function SvgComponent(
    className,
    width = 48,
    height = 48,
) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11 16.5s1.5.5 2.25 2.5c0 0 3.573-5.833 6.75-7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <path
                d="M4 5h14M4 10h11M4 15h4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
