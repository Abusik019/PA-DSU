export default function DoneIcon({
    className,
    width = 24,
    height = 24,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109C18.717 21.5 16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391C2.5 18.717 2.5 16.479 2.5 12z"
                stroke="#59ab02"
                strokeWidth="1.5"
            />
            <path
                d="M8 13.75s1.6.912 2.4 2.25c0 0 2.4-5.25 5.6-7"
                stroke="#59ab02"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
