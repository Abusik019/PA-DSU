export default function PenIcon({
    className,
    width = 20,
    height = 20,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3.782 16.31L3 21l4.69-.782a3.961 3.961 0 002.151-1.106L20.42 8.532a1.981 1.981 0 000-2.8L18.269 3.58a1.981 1.981 0 00-2.802 0L4.888 14.16a3.962 3.962 0 00-1.106 2.15zM14 6l4 4"
                stroke="#000"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
