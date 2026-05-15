import { useState } from "react"
import AuthInput from "./AuthInput";
import PasswordRequirements from "./PasswordRequirements";


const PassowordField = ({ password, setPassword }) => {
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [touched, setTouched] = useState(false);

    const allValid = [
        /[A-Z]/.test(password),
        /[a-z]/.test(password),
        /[0-9]/.test(password),
        /[!@#$%^&*(),.?":{}|<>]/.test(password),
        password.length >= 8,
    ].every(Boolean);

    return (
        <div>
            <AuthInput
                value={password}
                onChange={({ target }) => {
                    setPassword(target.value);
                    if (!touched) setTouched(true);
                }}
                label="Password"
                placeholder="Min 8 caracteres"
                type="password"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
            />

            {/* Animación para mostrar/ocultar */}
            <div
                className={`transition-all duration-700 overflow-hidden ${touched && (passwordFocused || !allValid)
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                    }`}
            >
                <PasswordRequirements password={password} />
            </div>
        </div>
    );
};

export default PassowordField;