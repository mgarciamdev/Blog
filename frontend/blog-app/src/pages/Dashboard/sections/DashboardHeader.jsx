import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { LuClock3 } from 'react-icons/lu';

const DashboardHeader = ({ user }) => {
    const [currentTime, setCurrentTime] = useState(moment());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(moment());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.hour();

        if (hour < 12) return "Buenos días";
        if (hour < 18) return "Buenas tardes";

        return "Buenas noches";
    };

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 mt-5">
            <div className="flex items-center justify-between">

                {/* Izquierda */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        {getGreeting()}, {user?.username}
                    </h2>

                    <p className="text-sm text-gray-400 mt-1">
                        {currentTime.format("dddd, MMMM Do YYYY")}
                    </p>
                </div>

                {/* Derecha */}
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 text-gray-500">
                        <LuClock3 className="text-lg" />

                        <span className="text-lg font-medium">
                            {currentTime.format("HH:mm:ss")}
                        </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                        {timezone}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;