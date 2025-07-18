import { SortIcon } from "../../assets";

export default function ActionButton({ onClick, label, disabled }) {
    return (
        <button
            onClick={onClick}
            className="w-fit font-medium py-1 px-2 box-border rounded-lg flex items-center gap-1 transition-colors hover:bg-[#f3eafb] hover:text-[#8531D6]"
            disabled={disabled}
        >
            <SortIcon />
            <h2>{label}</h2>
        </button>
    );
}