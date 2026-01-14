import React, { useState, useEffect } from "react";
import LoadingState from "../Common/LoadingState";
import ErrorState from "../Common/ErrorState";
import PageHeader from "../Common/PageHeader";

const CalculationDetails = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [calculation, setCalculation] = useState(null);

    // Mock data - replace with API call
    const mockCalculation = {
        id: "CALC-001",
        submeter_number: "SM-012",
        unit_number: "304",
        tenant_name: "Frank Miller",
        previous_reading: 2450.5,
        current_reading: 2580.3,
        rate_per_kwh: 8.5, // Peso rate
        total_consumption_kwh: 129.8,
        total_amount: 1103.3, // rate_per_kwh * total_consumption_kwh
        paid_date: "2024-03-15T14:30:00Z",
        date_computed: "2024-03-01T10:30:00Z",
        computed_by: "Admin User",
        computed_by_role: "Administrator",
        status: "Paid",
        billing_month: "March",
        billing_year: "2024",
        billing_period: "March 1-31, 2024",
        payment_method: "Credit Card",
        invoice_number: "INV-2024-01234",
        due_date: "2024-03-10T23:59:00Z",
        consumption_unit: "kWh",
    };

    // Mock logs data
    const mockLogs = [
        {
            id: 1,
            user_name: "Admin User",
            user_role: "Administrator",
            user_avatar: "AU",
            action: "Computed Bill",
            description: "Calculated electricity consumption for March 2024",
            timestamp: "2024-03-01T10:30:00Z",
            details: {
                consumption: "129.8 kWh",
                amount: "₱1,103.30",
            },
        },
        {
            id: 2,
            user_name: "Frank Miller",
            user_role: "Tenant",
            user_avatar: "FM",
            action: "Received Bill",
            description: "Bill notification sent via email",
            timestamp: "2024-03-02T09:15:00Z",
            details: {
                method: "Email",
                status: "Sent",
            },
        },
        {
            id: 3,
            user_name: "Frank Miller",
            user_role: "Tenant",
            user_avatar: "FM",
            action: "Viewed Bill",
            description: "Accessed bill details online",
            timestamp: "2024-03-05T14:20:00Z",
            details: {
                device: "Chrome on Windows",
            },
        },
        {
            id: 4,
            user_name: "Frank Miller",
            user_role: "Tenant",
            user_avatar: "FM",
            action: "Made Payment",
            description: "Paid bill via credit card",
            timestamp: "2024-03-12T11:45:00Z",
            details: {
                amount: "₱1,103.30",
                method: "Credit Card",
            },
        },
        {
            id: 5,
            user_name: "Accountant",
            user_role: "Finance Team",
            user_avatar: "AT",
            action: "Verified Payment",
            description: "Confirmed payment and updated status",
            timestamp: "2024-03-15T09:15:00Z",
            details: {
                status: "Pending → Paid",
                verified_by: "Accountant",
            },
        },
        {
            id: 6,
            user_name: "System",
            user_role: "Automated",
            user_avatar: "SYS",
            action: "Generated Receipt",
            description: "Automated receipt generation",
            timestamp: "2024-03-15T09:16:00Z",
            details: {
                receipt_number: "RCPT-2024-01234",
            },
        },
    ];

    useEffect(() => {
        // Simulate API call
        const fetchCalculationDetails = async () => {
            setLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 800));
                setCalculation(mockCalculation);
            } catch (err) {
                setError("Failed to load calculation details");
            } finally {
                setLoading(false);
            }
        };

        fetchCalculationDetails();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDateOnly = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) return <LoadingState message="Loading bill details..." />;
    if (error) return <ErrorState error={error} />;
    if (!calculation) return null;

    return (
        <div className="pt-2">
            {/* Page Header */}
            <PageHeader
                title={`Electricity Bill (${calculation.submeter_number})`}
                description={`Unit ${calculation.unit_number} - ${calculation.billing_month} ${calculation.billing_year}`}
                actionButton={
                    <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg text-sm font-medium transition-colors flex items-center">
                            <i className="fas fa-print mr-2"></i>
                            Print
                        </button>
                        <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center">
                            <i className="fas fa-download mr-2"></i>
                            Download
                        </button>
                    </div>
                }
            />

            {/* Summary Card */}
            <div className="bg-white dark:bg-dark-800 rounded-xl p-3 md:p-6 mb-3 md:mb-6 text-gray-900 dark:text-white border border-gray-200 dark:border-dark-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                    <div>
                        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 mb-1 md:mb-2">
                            <h2 className="text-lg md:text-2xl font-bold">
                                Amount Due
                            </h2>
                            <span
                                className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium self-start xs:self-auto w-fit ${
                                    calculation.status === "Paid"
                                        ? "dark:bg-green-500/20 bg-green-900 text-white"
                                        : "bg-yellow-500/20 text-yellow-800 dark:text-yellow-300"
                                }`}
                            >
                                {calculation.status}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">
                            January 2026
                        </p>
                    </div>
                    <div className="text-left sm:text-right mt-1 sm:mt-0">
                        <div className="text-xl md:text-3xl lg:text-4xl font-bold mb-0.5 md:mb-1">
                            {formatCurrency(calculation.total_amount)}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Due: {formatDateOnly(calculation.due_date)}
                        </p>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                {/* Right Column - Calculation Details */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 md:p-5">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center">
                            <i className="fas fa-calculator mr-2 text-gray-500 text-sm md:text-base"></i>
                            Electricity Consumption Details
                        </h3>

                        {/* Reading Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                            {/* Previous Reading */}
                            <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-3 md:p-4 border border-gray-200 dark:border-dark-700">
                                <div className="flex items-center justify-between mb-1 md:mb-2">
                                    <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Previous Reading
                                    </span>
                                    <i className="fas fa-calendar-minus text-gray-500 dark:text-gray-400 text-sm md:text-base"></i>
                                </div>
                                <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                    {calculation.previous_reading.toLocaleString()}{" "}
                                    kWh
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    End of {calculation.billing_month}{" "}
                                    {parseInt(calculation.billing_year) - 1}
                                </div>
                            </div>

                            {/* Current Reading */}
                            <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-3 md:p-4 border border-gray-200 dark:border-dark-700">
                                <div className="flex items-center justify-between mb-1 md:mb-2">
                                    <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Current Reading
                                    </span>
                                    <i className="fas fa-calendar-check text-gray-500 dark:text-gray-400 text-sm md:text-base"></i>
                                </div>
                                <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                    {calculation.current_reading.toLocaleString()}{" "}
                                    kWh
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    End of {calculation.billing_month}{" "}
                                    {calculation.billing_year}
                                </div>
                            </div>
                        </div>

                        {/* Rate and Consumption Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                            {/* Rate per kWh */}
                            <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-3 md:p-4 border border-gray-200 dark:border-dark-700">
                                <div className="flex items-center justify-between mb-1 md:mb-2">
                                    <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Rate per kWh
                                    </span>
                                    <i className="fas fa-bolt text-gray-500 dark:text-gray-400 text-sm md:text-base"></i>
                                </div>
                                <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(calculation.rate_per_kwh)}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    Current electricity rate
                                </div>
                            </div>

                            {/* Total Consumption */}
                            <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-3 md:p-4 border border-gray-200 dark:border-dark-700">
                                <div className="flex items-center justify-between mb-1 md:mb-2">
                                    <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Total Consumption
                                    </span>
                                    <i className="fas fa-chart-line text-gray-500 dark:text-gray-400 text-sm md:text-base"></i>
                                </div>
                                <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                    {calculation.total_consumption_kwh.toLocaleString()}{" "}
                                    kWh
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    Current - Previous reading
                                </div>
                            </div>
                        </div>
                        {/* Calculation Formula */}
                        <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-4 md:p-5 border border-gray-200 dark:border-dark-700">
                            <h4 className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 md:mb-3">
                                How Your Bill is Calculated
                            </h4>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                                <div className="text-gray-800 dark:text-gray-300 font-mono text-xs md:text-sm bg-white dark:bg-dark-800 p-2 md:p-3 rounded border border-gray-200 dark:border-dark-700">
                                    ({calculation.current_reading} -{" "}
                                    {calculation.previous_reading}) ×{" "}
                                    {calculation.rate_per_kwh} ={" "}
                                    {calculation.total_amount}
                                </div>
                                <div className="text-right">
                                    <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(
                                            calculation.total_amount
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        Total Bill Amount
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="mt-4 md:mt-6  border-gray-200 dark:border-dark-700">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4">
                                <div>
                                    <h4 className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Payment Information
                                    </h4>
                                    <div className="space-y-1 md:space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Method:
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {calculation.payment_method}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Date Paid:
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatDate(
                                                    calculation.paid_date
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Left Column - Unit Info */}
                <div className="lg:col-span-1 space-y-4 md:space-y-6">
                    {/* Unit Card */}
                    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 md:p-5">
                        <h3 className="text-base md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center">
                            <i className="fas fa-receipt mr-2 text-gray-500 text-sm md:text-lg"></i>
                            Bill Receipt
                        </h3>
                        <div className="space-y-2 md:space-y-4 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Month
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    Jan, 2025
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Due Date
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    Jan 25, 2026
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-xl text-gray-600 dark:text-gray-200">
                                    Total Bill
                                </span>
                                <span className="font-semibold text-xl font-medium text-gray-900 dark:text-white">
                                    {formatCurrency(5000)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Unit Card */}
                    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 md:p-5">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center">
                            <i className="fas fa-home mr-2 text-gray-500 text-sm md:text-lg"></i>
                            Unit Information
                        </h3>
                        <div className="space-y-2 md:space-y-4 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Unit Number
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {calculation.unit_number}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Submeter
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {calculation.submeter_number}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Tenant
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {calculation.tenant_name}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Computation Info */}
                    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 md:p-5">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center">
                            <i className="fas fa-user-cog mr-2 text-gray-500 text-sm md:text-lg"></i>
                            Computation Details
                        </h3>
                        <div className="space-y-2 md:space-y-4 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Date Computed
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white text-right">
                                    June 11, 2025
                                    <br />
                                    <span className="text-xs text-gray-500">
                                        14:30 PM
                                    </span>
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Computed By
                                </span>
                                <div className="text-right">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {calculation.computed_by}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {calculation.computed_by_role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Logs */}
            <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <i className="fas fa-history mr-2"></i>
                        Bill History
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Timeline of all activities related to this bill
                    </p>
                </div>

                {/* Timeline */}
                <div className="p-6">
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-dark-700"></div>

                        {/* Log items */}
                        <div className="space-y-6">
                            {mockLogs.map((log, index) => (
                                <div key={log.id} className="relative pl-12">
                                    {/* Timeline dot */}
                                    <div
                                        className={`absolute left-3 w-3 h-3 rounded-full border-2 border-white dark:border-dark-800 ${
                                            log.action === "Computed Bill"
                                                ? "bg-blue-500"
                                                : log.action === "Made Payment"
                                                ? "bg-green-500"
                                                : log.action ===
                                                  "Generated Receipt"
                                                ? "bg-purple-500"
                                                : "bg-gray-400"
                                        }`}
                                    ></div>

                                    {/* Log content */}
                                    <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-4 border border-gray-200 dark:border-dark-700">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center font-medium text-sm text-gray-700 dark:text-gray-300 mr-3">
                                                    {log.user_avatar}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {log.user_name}
                                                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                            {log.user_role}
                                                        </span>
                                                    </h4>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                                        {log.action} —{" "}
                                                        {log.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                {formatDate(log.timestamp)}
                                            </span>
                                        </div>

                                        {/* Details */}
                                        {log.details &&
                                            Object.keys(log.details).length >
                                                0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-700">
                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.entries(
                                                            log.details
                                                        ).map(
                                                            ([key, value]) => (
                                                                <span
                                                                    key={key}
                                                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300"
                                                                >
                                                                    <span className="capitalize mr-1">
                                                                        {key.replace(
                                                                            "_",
                                                                            " "
                                                                        )}
                                                                        :
                                                                    </span>
                                                                    <span className="font-semibold">
                                                                        {value}
                                                                    </span>
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {mockLogs.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mb-4">
                            <i className="fas fa-history text-2xl text-gray-400"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No history yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            No activities recorded for this bill.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalculationDetails;
