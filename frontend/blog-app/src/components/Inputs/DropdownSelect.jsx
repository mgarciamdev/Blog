import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LuCheck, LuChevronDown } from 'react-icons/lu'

const DropdownSelect = ({ value, onChange, options, className = "" }) => {
    const [open, setOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0, openUpward: false, ready: false });

    const containerRef = useRef(null);
    const menuRef = useRef(null);

    const GAP = 4; // separación entre el botón y el menú, equivalente al "mt-1" original

    const updateMenuPosition = () => {
        if (!containerRef.current) return;

        const buttonRect = containerRef.current.getBoundingClientRect();
        const menuHeight = menuRef.current?.offsetHeight ?? 0;

        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        // Solo lo abrimos hacia arriba si abajo no cabe Y arriba hay más espacio
        const openUpward = spaceBelow < menuHeight + GAP && spaceAbove > spaceBelow;

        setMenuPosition({
            left: buttonRect.left,
            width: buttonRect.width,
            top: openUpward ? buttonRect.top - GAP : buttonRect.bottom + GAP,
            openUpward,
            ready: true,
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedInsideButton = containerRef.current?.contains(event.target);
            const clickedInsideMenu = menuRef.current?.contains(event.target);

            if (!clickedInsideButton && !clickedInsideMenu) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    useEffect(() => {
        if (!open) {
            setMenuPosition((prev) => ({ ...prev, ready: false }));
            return;
        }

        updateMenuPosition();

        // Si hace scroll (dentro del modal o la página) o cambia el tamaño
        // de la ventana con el menú abierto, recalculamos arriba/abajo.
        window.addEventListener("scroll", updateMenuPosition, true);
        window.addEventListener("resize", updateMenuPosition);

        return () => {
            window.removeEventListener("scroll", updateMenuPosition, true);
            window.removeEventListener("resize", updateMenuPosition);
        };

    }, [open]);

    const selectedOption = options.find((option) => option.value === value) ?? options[0];

    return (
        <div
            ref={containerRef}
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

            {open && createPortal(
                <div
                    ref={menuRef}
                    style={{
                        position: "fixed",
                        top: menuPosition.top,
                        left: menuPosition.left,
                        width: menuPosition.width,
                        // Si abre hacia arriba, "empujamos" el menú hacia atrás
                        // usando su propia altura, en vez de recalcular top con
                        // la altura medida (más simple y sin depender de reflow extra).
                        transform: menuPosition.openUpward ? "translateY(-100%)" : "none",
                        opacity: menuPosition.ready ? 1 : 0,
                    }}
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
                </div>,
                document.body
            )}
        </div>
    );
};

export default DropdownSelect;