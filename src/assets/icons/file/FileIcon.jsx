export default function FileIcon({
    className,
    width = 48,
    height = 48,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8 7h8M8 11h4M13 21.5V21c0-2.828 0-4.243.879-5.121C14.757 15 16.172 15 19 15h.5m.5-1.657V10c0-3.771 0-5.657-1.172-6.828C17.657 2 15.771 2 12 2 8.229 2 6.343 2 5.172 3.172 4 4.343 4 6.229 4 10v4.544c0 3.245 0 4.868.886 5.967a4 4 0 00.603.603C6.59 22 8.211 22 11.456 22c.705 0 1.058 0 1.381-.114.067-.024.133-.051.197-.082.31-.148.559-.397 1.058-.896l4.736-4.736c.579-.579.867-.867 1.02-1.235.152-.368.152-.776.152-1.594z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
