import React from 'react';
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";


const AuthInput = ({ value, onChange, label, placeholder, type, onFocus, onBlur }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <label className="text-[13px] text-slate-800">{label}</label>

            <div className="input-box">
                <input
                    type={
                        type == "password" ? (showPassword ? "text" : "password") : type
                    }
                    placeholder={placeholder}
                    autoComplete='on'
                    className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 autofill:bg-transparent"
                    value={value}
                    onChange={(e) => onChange(e)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />

                {type === "password" && (
                    <>
                        {showPassword ? (
                            <FaRegEye
                                size={22}
                                className="text-green-800 cursor-pointer"
                                onClick={() => toggleShowPassword()}
                            />
                        ) : (
                            <FaRegEyeSlash
                                size={22}
                                className="text-emerald-800 cursor-pointer"
                                onClick={() => toggleShowPassword()}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
};

export default AuthInput;