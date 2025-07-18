export default function WarningIcon({
    className,
    width = 24,
    height = 24,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5.322 9.683c2.413-4.271 3.62-6.407 5.276-6.956a4.445 4.445 0 012.804 0c1.656.55 2.863 2.685 5.276 6.956 2.414 4.27 3.62 6.406 3.259 8.146-.2.958-.69 1.826-1.402 2.48C19.241 21.5 16.827 21.5 12 21.5s-7.241 0-8.535-1.19a4.658 4.658 0 01-1.402-2.48c-.362-1.74.845-3.876 3.259-8.147z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M11.992 16h.009"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
            />
            <path
                d="M12 13V9"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
