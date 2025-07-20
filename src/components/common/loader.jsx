import { RingLoader } from "react-spinners";

export default function Loader() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <RingLoader
                color="#f3f4f6"
                loading={true}
                size={60}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
}
