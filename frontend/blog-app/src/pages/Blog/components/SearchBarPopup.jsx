import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../../../components/Modal';
import { LuSearch } from 'react-icons/lu';

const SearchBarPopup = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const handleSearch = async () => {
        const searchTerm = query.trim();

        if (!searchTerm) return;

        setQuery("");
        setIsOpen(false);

        navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }

    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} hideHeader>
            <div className="p-4 w-[90vw] sm:w-[80vw] md:w-[40vw] max-w-2xl">
                {/* Header */}
                <h2 className="text-lg font-semibold text-center">Search</h2>

                {/* Search bar */}
                <div className="relative mt-4 mb-1">
                    <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={({ target }) => setQuery(target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        placeholder="Escribe para buscar..."
                        className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg outline-emerald-100"
                    />

                    <button
                        onClick={handleSearch}
                        className="w-8 h-8 flex items-center justify-center absolute right-2 top-1/2 transform -translate-y-1/2 text-white rounded cursor-pointer"
                    >
                        <LuSearch className="w-5 h-5 text-emerald-400" />
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SearchBarPopup;