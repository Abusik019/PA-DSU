import classNames from "classnames";
import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../assets";

export default function InputField({ title, name, type, value, handleChange, errors }) {
    const [hidePassword, setHidePassword] = useState(true);

    return (
        <div
            className={classNames("w-full mb-[10px] relative", {
                "w-full": name !== "firstName" && name !== "lastName",
                "w-2/4": name === "firstName" && name === "lastName",
            })}
        >
            <label className="text-sm mb-1 font-medium text-nowrap" htmlFor={name}>{title}</label>
            <input
                id={name}
                type={hidePassword ? type : "text"}
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={title}
                required
                className={classNames("w-full h-10 rounded-lg p-[10px] focus:outline-none focus:ring-2", { 
                    "focus:ring-blue-500": !errors[name] ,
                    "focus:ring-red-500": errors[name],
                    "pr-[10px]": name !== "password",
                    "pr-[40px]": name === "password",
                    'text-black': !errors.password,
                    'text-red-500': errors.password,
                })}
            />
            {name === "password" && (
                <button
                    className="absolute top-[35px] right-[12px] bg-transparent h-5 w-5 focus:outline-none"
                    onClick={(e) => {
                        e.preventDefault();
                        setHidePassword((prevState) => !prevState);
                    }}
                >
                    {hidePassword ? <EyeCloseIcon className={!errors.password ? 'text-black' : 'text-red-500'} /> : <EyeIcon className={!errors.password ? 'text-black' : 'text-red-500'} />}
                </button>
            )}
            {errors[name] && <span className="text-red-500 mt-5 h-fit text-xs leading-3 text-nowrap">{errors[name]}</span>}
        </div>
    );
}
