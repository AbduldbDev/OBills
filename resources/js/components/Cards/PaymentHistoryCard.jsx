import React, { useState } from "react";
import PaymentStatusModal from "./StatusUpdateModal";

const PaymentHistoryCard = ({
    payment,
    onUpdateStatus, // This will now receive the complete result
    onViewDetails,
    getStatusColor,
    getStatusLabel,
    isReadOnly,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleStatusUpdate = async (updateResult) => {
        // Pass the result to parent component
        if (onUpdateStatus) {
            await onUpdateStatus(updateResult);
        }
        setIsModalOpen(false);
    };

    const handleEditStatusClick = () => {
        setIsModalOpen(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch (error) {
            return "Invalid date";
        }
    };

    const formatMonth = (monthString) => {
        if (!monthString) return "N/A";
        try {
            const [year, month] = monthString.split("-");
            const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ];
            const monthName = monthNames[parseInt(month) - 1];
            return `${monthName} ${year}`;
        } catch (error) {
            return monthString;
        }
    };

    // Get status-specific message and icon
    const getStatusMessage = () => {
        switch (payment.status) {
            case "paid":
                return {
                    message: payment.payment_date
                        ? `Paid on ${formatDate(payment.payment_date)}`
                        : "Paid",
                    icon: "fa-check-circle",
                    color: "text-green-600 dark:text-green-400",
                };
            case "pending":
                return {
                    message: "Payment Pending",
                    icon: "fa-clock",
                    color: "text-amber-600 dark:text-amber-400",
                };
            case "sent":
                return {
                    message: "Bill Sent",
                    icon: "fa-paper-plane",
                    color: "text-blue-600 dark:text-blue-400",
                };
            case "skipped":
                return {
                    message: "Bill Skipped",
                    icon: "fa-ban",
                    color: "text-red-600 dark:text-red-400",
                };
            default:
                return {
                    message: "Unknown Status",
                    icon: "fa-question-circle",
                    color: "text-gray-600 dark:text-gray-400",
                };
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 transition-all duration-200 hover:shadow-md">
                {/* Card Header */}
                <div className="p-4 border-b border-gray-200 dark:border-dark-700 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-hashtag text-gray-500 dark:text-gray-400 text-sm"></i>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    SM-{payment.submeter_number || "N/A"}
                                </h3>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    payment.status,
                                )}`}
                            >
                                {getStatusLabel(payment.status)}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {formatMonth(payment.month)}
                        </p>
                        {payment.computed_by && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Computed by: {payment.computed_by}
                            </p>
                        )}
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                    {/* Grid Layout for Details */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Left Column */}
                        <div className="space-y-3">
                            {/* Due Date */}
                            <div className="flex items-start gap-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-dark-900 flex items-center justify-center mt-1">
                                    <i className="fas fa-calendar-day text-dark-900 dark:text-white text-sm"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        Billing Month
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatMonth(payment.month)}
                                    </p>
                                </div>
                            </div>

                            {/* Current Reading */}
                            <div className="flex items-start gap-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-dark-900 flex items-center justify-center mt-1">
                                    <i className="fas fa-bolt text-dark-900 dark:text-white text-sm"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        Current Reading
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {payment.current_reading.toLocaleString()}{" "}
                                        kWh
                                    </p>
                                </div>
                            </div>

                            {/* Previous Reading */}
                            <div className="flex items-start gap-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-dark-900 flex items-center justify-center mt-1">
                                    <i className="fas fa-bolt text-dark-900 dark:text-white text-sm"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        Previous Reading
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {payment.last_reading.toLocaleString()}{" "}
                                        kWh
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-3 text-end">
                            {/* Rate per kWh */}
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center justify-end gap-1">
                                    Rate per kWh
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    ₱{payment.rate || 9}.00
                                </p>
                            </div>

                            {/* Consumption */}
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center justify-end gap-1">
                                    Consumption
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {payment.consumption.toLocaleString()} kWh
                                </p>
                            </div>

                            {/* Unit */}
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center justify-end gap-1">
                                    Submeter
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    SM-{payment.submeter_number || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Final Bill Section */}
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-700">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-white mb-1 flex items-center gap-1">
                                    Total Amount Due
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(payment.final_bill)}
                                </p>
                                {/* Status-specific message */}
                                <div className="mt-1">
                                    <p
                                        className={`text-xs ${
                                            getStatusMessage().color
                                        } flex items-center justify-end gap-1`}
                                    >
                                        <i
                                            className={`fas ${
                                                getStatusMessage().icon
                                            }`}
                                        ></i>
                                        {getStatusMessage().message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Footer with Buttons */}
                {!isReadOnly && (
                    <div className="p-4 border-t border-gray-200 dark:border-dark-700 flex justify-end gap-2">
                        <button
                            onClick={() => onViewDetails(payment)}
                            className="flex-1 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-sm"
                        >
                            <i className="fas fa-eye"></i>
                            View Details
                        </button>

                        {payment.status !== "paid" &&
                            payment.status !== "skipped" && (
                                <button
                                    onClick={handleEditStatusClick}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-sm"
                                >
                                    <i className="fas fa-edit"></i>
                                    Edit Status
                                </button>
                            )}

                        {payment.status === "skipped" && (
                            <button
                                onClick={handleEditStatusClick}
                                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-sm"
                            >
                                <i className="fas fa-redo"></i>
                                Unskip
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Status Update Modal */}
            <PaymentStatusModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                payment={payment}
                onUpdateStatus={handleStatusUpdate}
            />
        </>
    );
};

export default PaymentHistoryCard;
