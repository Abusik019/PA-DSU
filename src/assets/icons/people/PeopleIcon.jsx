export default function PeopleIcon({
    className,
    width = 24,
    height = 24,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15.5 11a3.5 3.5 0 10-7 0 3.5 3.5 0 007 0zM15.483 11.35a3.5 3.5 0 10-2.465-3.7M10.983 7.65a3.5 3.5 0 10-2.466 3.7M22 16.5c0-2.761-2.462-5-5.5-5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <path
                d="M17.5 19.5c0-2.761-2.462-5-5.5-5s-5.5 2.239-5.5 5M7.5 11.5c-3.038 0-5.5 2.239-5.5 5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
