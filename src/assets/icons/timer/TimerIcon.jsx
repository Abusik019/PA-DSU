export default function TimerIcon({
    className,
    width = 36,
    height = 36,
}) {
    return (
        <svg className={className} width={width} height={height} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.376 3c-.214.08-.425.167-.631.261m12.973 13.04c.102-.221.196-.447.282-.676m-2.501 3.74c.172-.16.338-.327.497-.499m-3.727 2.506c.194-.073.385-.152.573-.237m-3.686.859c-.23.008-.463.008-.694 0m-3.675-.854c.181.082.365.158.551.228m-3.665-2.447c.136.145.277.285.423.422m-2.463-3.678c.075.197.156.392.243.583m-.871-3.743a10.078 10.078 0 010-.626m.62-3.142c.074-.195.154-.388.24-.577m1.791-2.68c.145-.155.294-.304.449-.449"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
            <path
                d="M13.5 12a1.5 1.5 0 11-1.5-1.5m1.5 1.5a1.5 1.5 0 00-1.5-1.5m1.5 1.5H16m-4-1.5V6M22 12c0-5.523-4.477-10-10-10"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            />
        </svg>
    );
}
