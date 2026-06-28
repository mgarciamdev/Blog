import React, { useEffect, useRef, useState } from 'react'
import { LuCheck, LuChevronDown } from 'react-icons/lu'

const DropdownSelect = ({ value, onChange, options, className = "" }) => {
    const [open, setOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    const selectedOption = options.find((option) => option.value === value) ?? options[0];

    return (
        <div
            ref={dropdownRef}
            className={`relative ${className}`}
        >
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm transition-all cursor-pointer"
            >
                <span className="truncate">
                    {selectedOption.label}
                </span>

                <LuChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div
                    className="absolute left-0 mt-1 p-2 w-full bg-white rounded-2xl shadow-lg shadow-gray-200/70 border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in-95"
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                            className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-left transition-all hover:bg-gray-300/50 ${value === option.value
                                    ? "font-medium"
                                    : ""
                                }`}
                        >
                            {option.label}

                            {value === option.value && (
                                <LuCheck size={18} />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownSelect;