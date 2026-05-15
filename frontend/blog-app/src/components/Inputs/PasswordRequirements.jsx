import React from 'react'
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const PasswordRequirements = ({ password }) => {

    const rules = [
        {
            label: "Letra mayúscula",
            valid: /[A-Z]/.test(password),
        },
        {
            label: "Letra minúscula",
            valid: /[a-z]/.test(password),
        },
        {
            label: "Número",
            valid: /[0-9]/.test(password),
        },
        {
            label: "Caracteres especiales (e.j. !?<>@#$%)",
            valid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        },
        {
            label: "8 caracteres o mas",
            valid: password.length >= 8,
        },
    ];

    return (
        <div className='mt-4 space-y-2'>
            {rules.map((rule, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                    {rule.valid ? (
                        <FaCheckCircle className="text-green-600" />
                    ) : (
                        <FaRegCircle className="text-gray-400" />
                    )}
                    <span className={rule.valid ? "text-green-600" : "text-gray-600"}>
                        {rule.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default PasswordRequirements;