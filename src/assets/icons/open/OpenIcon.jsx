export default function OpenIcon({
    className,
    width = 24,
    height = 24,
}) {
    return (
        <svg className={className} width={width} height={height} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M40.96 4.98a2 2 0 00-.22.02H28a2 2 0 100 4h8.172L22.586 22.586a2 2 0 102.828 2.828L39 11.828V20a2 2 0 104 0V7.246a2 2 0 00-2.04-2.266zM12.5 8C8.383 8 5 11.383 5 15.5v20c0 4.117 3.383 7.5 7.5 7.5h20c4.117 0 7.5-3.383 7.5-7.5V26a2 2 0 10-4 0v9.5c0 1.947-1.553 3.5-3.5 3.5h-20A3.483 3.483 0 019 35.5v-20c0-1.947 1.553-3.5 3.5-3.5H22a2 2 0 100-4h-9.5z" />
        </svg>
    );
}
