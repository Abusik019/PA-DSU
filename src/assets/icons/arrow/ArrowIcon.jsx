export default function ArrowIcon({
    className,
    width = 24,
    height = 24,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10.397 18.586l-.76-.967c-1.234-1.565-1.851-2.348-1.57-2.984C8.348 14 9.312 14 11.24 14h1.522c1.927 0 2.89 0 3.172.635.281.636-.336 1.419-1.57 2.984l-.76.967C12.86 19.529 12.488 20 12 20c-.489 0-.86-.471-1.603-1.414zM12 14V4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
