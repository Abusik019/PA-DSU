export default function InfoIcon({
    className,
    width = 28,
    height = 28,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle
                cx="17.75"
                cy="6.25"
                r="4.25"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <circle
                cx="6.25"
                cy="6.25"
                r="4.25"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <circle
                cx="17.75"
                cy="17.75"
                r="4.25"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <circle
                cx="6.25"
                cy="17.75"
                r="4.25"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    );
}
