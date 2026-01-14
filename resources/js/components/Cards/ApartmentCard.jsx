import React from "react";

const ApartmentCard = ({ apartment, onClick }) => {
    const { unit_number, submeter_number, tenant_name, status, floor } =
        apartment;

    const handleClick = () => {
        if (onClick) {
            onClick(apartment);
        }
    };

    // Status colors
    const getStatusColor = () => {
        const statusMap = {
            vacant: "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400",
            occupied:
                "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
            pending:
                "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
            overdue:
                "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
        };
        return statusMap[status || (isVacant ? "vacant" : "occupied")];
    };

    const getStatusText = () => {
        const textMap = {
            vacant: "Vacant",
            occupied: "Occupied",
            pending: "Pending",
            overdue: "Overdue",
        };
        return textMap[status || (isVacant ? "vacant" : "occupied")];
    };

    // Get icon based on floor/status
    const getApartmentIcon = () => {
        if (floor) {
            if (floor.includes("1") || floor.includes("Ground"))
                return "fa-home";
            if (floor.includes("2")) return "fa-building";
            if (floor.includes("3") || floor.includes("Top"))
                return "fa-building-columns";
        }
        return "fa-house";
    };

    return (
        <div
            onClick={handleClick}
            className="group relative bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-3 hover:shadow-lg hover:border-gray-300 dark:hover:border-dark-600 transition-all duration-300 cursor-pointer active:scale-[0.98] hover:-translate-y-1 overflow-hidden"
        >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 dark:to-dark-900 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

            {/* Top Section - Status & Floor */}
            <div className="relative z-10 flex justify-between items-start mb-3">
                {/* Status Badge */}
                <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor()}`}
                >
                    {getStatusText()}
                </span>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Unit Number with Icon */}
                <div className="flex items-center justify-center mb-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-dark-900 dark:bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <i
                                className={`fas ${getApartmentIcon()} text-white dark:text-dark-900 text-lg`}
                            ></i>
                        </div>
                        {/* Pulse effect */}
                        <div className="absolute inset-0 rounded-full border-2 border-dark-900/30 dark:border-white/30 animate-ping"></div>
                    </div>
                </div>

                {/* Unit Details */}
                <div className="text-center mb-3">
                    <div className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        Unit {unit_number}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Apartment Unit
                    </div>
                </div>

                {/* Submeter Section */}
                <div className="bg-gray-50 dark:bg-dark-900/50 rounded-lg p-3 mb-3 border border-gray-100 dark:border-dark-700">
                    <div className="text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <i className="fas fa-tachometer-alt mr-1"></i>
                            Submeter No.
                        </div>
                        <div className="font-bold text-lg text-gray-900 dark:text-white">
                            SM-{submeter_number}
                        </div>
                    </div>
                </div>

                {/* Tenant Info */}
                <div className="pt-3 border-t border-gray-100 dark:border-dark-700">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="text-center">
                                <div className="font-medium truncate max-w-[120px]">
                                    {tenant_name || "No Tenant Set"}
                                </div>

                                <span
                                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium
                        ${
                            status === "available"
                                ? "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                                >
                                    {status === "available"
                                        ? "Occupied"
                                        : "Unoccupied"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-16 h-0.5 bg-gradient-to-r from-dark-900 to-dark-800 dark:from-white dark:to-gray-200 transition-all duration-300 rounded-full"></div>
        </div>
    );
};

export default ApartmentCard;
