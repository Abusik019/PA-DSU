export default function QuizzIcon({
    className,
    width = 30,
    height = 30,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.5 3.5c-1.556.047-2.483.22-3.125.862-.879.88-.879 2.295-.879 5.126v6.506c0 2.832 0 4.247.879 5.127C5.253 22 6.668 22 9.496 22h5c2.829 0 4.243 0 5.121-.88.88-.879.88-2.294.88-5.126V9.488c0-2.83 0-4.246-.88-5.126-.641-.642-1.569-.815-3.125-.862"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M7.496 3.75c0-.966.784-1.75 1.75-1.75h5.5a1.75 1.75 0 110 3.5h-5.5a1.75 1.75 0 01-1.75-1.75z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M6.5 10h4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <path
                d="M13.5 11s.5 0 1 1c0 0 1.588-2.5 3-3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <path
                d="M6.5 16h4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <path
                d="M13.5 17s.5 0 1 1c0 0 1.588-2.5 3-3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
