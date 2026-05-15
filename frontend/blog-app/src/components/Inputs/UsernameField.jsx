import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AuthInput from './AuthInput';

const UsernameField = ({
    username,
    setUsername,
    usernameError,
    setUsernameError,
    suggestions = [],
    setSuggestions,
}) => {
    const [focused, setFocused] = useState(false);
    const [touched, setTouched] = useState(false);

    return (
        <div>
            <AuthInput
                label="Nombre de usuario"
                value={username}
                onChange={(e) => {
                    const value = e.target.value;
                    setUsername(value);

                    if (!touched) setTouched(true);

                    if (value.trim().length > 2) {
                        setUsernameError(null);
                        setSuggestions([]);
                    }
                }}
                placeholder="Elija un nombre de usuario único"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />

            <motion.div
                initial={false}
                animate={{
                    height:
                        touched && (focused || usernameError || suggestions.length > 0)
                            ? "auto"
                            : 0,
                    opacity:
                        touched && (focused || usernameError || suggestions.length > 0)
                            ? 1
                            : 0,
                    marginTop:
                        touched && (focused || usernameError || suggestions.length > 0)
                            ? "0.5rem"
                            : 0,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <AnimatePresence mode="wait">
                    {usernameError && (
                        <motion.p
                            key="username-error"
                            initial={{ opacity: 6, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.3 }}
                            className="text-red-500 text-xs mt-1"
                        >
                            {usernameError}
                        </motion.p>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {suggestions.length > 0 && (
                        <motion.div
                            key="username-suggestions"
                            initial={{ opacity: 0, y: -3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -3 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="mt-2"
                        >
                            <p className="text-xs text-gray-700">
                                Sugerencias:
                            </p>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => {
                                            setUsername(s);
                                            setUsernameError(null);
                                            setSuggestions([]);
                                        }}
                                        className="px-2 py-1 text-xs bg-emerald-100 hover:bg-emerald-200 rounded-full transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default UsernameField;