export default function ChatIcon({
    className,
    width = 28,
    height = 28,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8 13.5h8m-8-5h4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <path
                d="M6.099 19c-1.3-.128-2.274-.518-2.927-1.172C2 16.657 2 14.771 2 11v-.5c0-3.771 0-5.657 1.172-6.828C4.343 2.5 6.229 2.5 10 2.5h4c3.771 0 5.657 0 6.828 1.172C22 4.843 22 6.729 22 10.5v.5c0 3.771 0 5.657-1.172 6.828C19.657 19 17.771 19 14 19c-.56.012-1.007.055-1.445.155-1.199.276-2.309.89-3.405 1.424-1.563.762-2.344 1.143-2.834.786-.938-.698-.021-2.863.184-3.865"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
