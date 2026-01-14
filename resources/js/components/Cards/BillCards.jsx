import React from "react";

const BillCard = ({
    bill,
    onClick,
    onViewDetails,
    monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ],
}) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatMonthYear = (month, year) => {
        return `${monthNames[month - 1]} ${year}`;
    };

    // const handleViewDetailsClick = (e) => {
    //     e.stopPropagation();
    //     if (onViewDetails) {
    //         onViewDetails(bill);
    //     }
    // };

    const handleViewAttachment = (e) => {
        e.stopPropagation();

        if (bill?.image) {
            window.open(
                `/storage/${bill.image}`,
                "_blank",
                "noopener,noreferrer"
            );
        }
    };

    // Check if there's an image attachment
    const hasAttachment = bill.image && bill.image.trim() !== "";

    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-5 hover:shadow-md transition-shadow cursor-pointer"
        >
            {/* Header - Month and Year */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                        <span className="font-bold text-gray-700 dark:text-gray-300">
                            {bill.month}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            {formatMonthYear(bill.month, bill.year)}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Bill Information */}
            <div className="space-y-3">
                {/* Total Bill */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <i className="fas fa-money-bill-wave mr-2 text-sm"></i>
                        <span className="text-sm">Total Bill</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(bill.total_bill)}
                    </span>
                </div>

                {/* Rate per kWh */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <i className="fas fa-bolt mr-2 text-sm"></i>
                        <span className="text-sm">Rate per kWh</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                        ₱{bill.rate_per_kwh?.toFixed(2) || "0.00"}
                    </span>
                </div>

                {/* Due Date */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <i className="fas fa-calendar-day mr-2 text-sm"></i>
                        <span className="text-sm">Due Date</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {formatDate(bill.due_date)}
                    </span>
                </div>

                {/* Date Posted */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <i className="fas fa-calendar-alt mr-2 text-sm"></i>
                        <span className="text-sm">Date Posted</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {formatDate(bill.date_posted)}
                    </span>
                </div>

                {/* Attachment Status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <i className="fas fa-paperclip mr-2 text-sm"></i>
                        <span className="text-sm">Attachment</span>
                    </div>
                    <span
                        className={`text-sm font-medium ${
                            hasAttachment
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500 dark:text-gray-500"
                        }`}
                    >
                        {hasAttachment ? "Available" : "No attachment"}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-700">
                <div className="space-y-2">
                    {/* View Details Button */}
                    {/* <button
                        onClick={handleViewDetailsClick}
                        className="w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors flex items-center justify-center"
                    >
                        <i className="fas fa-eye mr-2"></i>
                        View Details
                    </button> */}

                    {/* View Attachment Button - Conditional */}
                    {hasAttachment ? (
                        <button
                            onClick={handleViewAttachment}
                            className="w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <i className="fas fa-external-link-alt mr-2"></i>
                            Open Attachment
                        </button>
                    ) : (
                        <button
                            disabled
                            className="w-full px-3 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-dark-800 rounded-lg cursor-not-allowed flex items-center justify-center"
                        >
                            <i className="fas fa-paperclip mr-2"></i>
                            No Attachment
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillCard;
