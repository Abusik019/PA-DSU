import classNames from "classnames";
import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../assets";

export default function InputField({ title, name, type, value, handleChange, errors }) {
    const [hidePassword, setHidePassword] = useState(true);
    
    return (
        <div
            className={classNames("w-full mb-3 relative", {
                "w-full": name !== "firstName" && name !== "lastName",
                "w-2/4": name === "firstName" && name === "lastName",
            })}
        >
            <input
                id={name}
                type={hidePassword ? type : "text"}
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={title}
                required
                className={classNames("w-full h-10 rounded-md p-2 focus:outline-none focus:ring-2", { 
                    "focus:ring-blue-500": !errors[name] ,
                    "focus:ring-red-500": errors[name],
                    "pr-2": name !== "password",
                    "pr-10": name === "password",
                    'text-black': !errors.password,
                    'text-red-500': errors.password,
                })}
            />
            {name === "password" && (
                <button
                    className={classNames("absolute right-[12px] bg-transparent h-5 w-5 focus:outline-none", {
                        'top-[calc(50%-10px)]': !errors.password,
                        'top-[10px]': errors.password
                    })}
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
