import React from 'react'

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="my-2">
            <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        aria-pressed={activeTab === tab.value}
                        className={`shrink-0 relative px-3 py-2 text-sm font-medium ${activeTab === tab.value
                            ? "text-black"
                            : "text-gray-500 hover:text-gray-900"
                            } cursor-pointer`}
                        onClick={() => setActiveTab(tab.value)}
                    >
                        <div className="flex items-center">
                            <span className="text-sm">{tab.label}</span>
                            <span
                                className={`text-xs font-medium ml-2 px-2 py-0.5 rounded-full ${activeTab === tab.value
                                    ? "bg-black text-white"
                                    : "bg-gray-200/70 text-gray-900"
                                    }`}
                            >
                                {tab.count}
                            </span>
                        </div>
                        {activeTab === tab.value && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-full" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Tabs;