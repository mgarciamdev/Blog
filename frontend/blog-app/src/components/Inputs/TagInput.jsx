import React, { useState } from 'react'

const TagInput = ({ tags, setTags }) => {
    const [input, setInput] = useState("");

    const handleKeyDown = (e) => {
        if ((e.key === "Enter" || e.key === ",") && input.trim()) {
            e.preventDefault();

            const newTag = input.trim();

            if (newTag.length > 30) {
                return;
            }

            if (tags.length >= 10) {
                return;
            }

            if (!tags.some(tag => tag.toLowerCase() === newTag.toLowerCase())) {
                setTags([...tags, newTag]);
            }

            setInput("");

        } else if (e.key === "Backspace" && !input && tags.length) {
            setTags(tags.slice(0, -1));
        }
    };

    const handleRemove = (index) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
    };

    return (
        <div className="flex flex-wrap gap-2 items-center border border-gray-300 rounded-md p-2 min-h-12 mt-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
            {tags.map((tag, index) => (
                <div
                    key={index}
                    className="flex items-center bg-emerald-100/70 text-emerald-700 px-3 py-1 rounded text-sm font-medium"
                >
                    {tag}
                    <button
                        type="button"
                        className="ml-2 text-emerald-500 hover:text-green-700 font-bold cursor-pointer"
                        onClick={() => handleRemove(index)}
                    >
                        &times;
                    </button>
                </div>
            ))}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                    tags.length === 0
                        ? "Escribe una etiqueta (tag) y presiona Enter"
                        : "Añadir otra etiqueta (tag)..."
                }
                className="flex-1 min-w-25 border-none outline-none text-sm p-1"
            />
            <p className="text-xs text-gray-500 mt-1">
                {tags.length}/10 etiquetas
            </p>
        </div>
    );
};
export default TagInput;