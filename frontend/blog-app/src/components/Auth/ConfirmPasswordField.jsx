import React, { useState } from 'react'
import AuthInput from '../Inputs/AuthInput';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const ConfirmPasswordField = ({ password, confirmPassword, setConfirmPassword }) => {

    const [touched, setTouched] = useState(false);
    const isMatch = password === confirmPassword && confirmPassword.length > 0;

    return (
        <div>
            <AuthInput
                value={confirmPassword}
                onChange={({ target }) => {
                    setConfirmPassword(target.value);
                    if (!touched) setTouched(true);
                }}
                label="Confirmar contraseña"
                placeholder="Reingresa tu contraseña"
                type="password"
            />

            {/* Validación visual */}
            {touched && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                    {isMatch ? (
                        <FaCheckCircle className="text-green-600 mb-3" />
                    ) : (
                        <FaRegCircle className="text-gray-400 mb-4" />
                    )}
                    <span className={isMatch ? "text-green-600 mb-3" : "text-gray-600 mb-3"}>
                        {isMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ConfirmPasswordField;