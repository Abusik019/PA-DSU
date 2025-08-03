export default function LinkBackwardIcon({
    className,
    width = 20,
    height = 20,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11 8.5h-.5V4.696a.696.696 0 00-1.207-.473l-5.953 6.41a1.273 1.273 0 000 1.733l5.953 6.412a.696.696 0 001.207-.474V14.5c5.554 0 8.553 4.016 9.308 5.185a.676.676 0 00.564.315c.347 0 .628-.28.628-.628V18.5c0-5.523-4.477-10-10-10z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    );
}
