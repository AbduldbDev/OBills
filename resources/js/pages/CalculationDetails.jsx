import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingState from "../components/Common/LoadingState";
import ErrorState from "../components/Common/ErrorState";
import PageHeader from "../components/Common/PageHeader";
import Layout from "../components/Layout/Layout";
import { CalculationApi } from "../api/calculationApi";

const CalculationDetails = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [calculation, setCalculation] = useState(null);
    const [totalBill, setTotalBill] = useState(null);
    const { id, month } = useParams();

    useEffect(() => {
        const fetchCalculationDetails = async () => {
            setLoading(true);
            try {
                const data = await CalculationApi.getCalculationDetails(
                    id,
                    month
                );

                setCalculation(data.data);
                setTotalBill(data.TotalBill);
            } catch (err) {
                setError(err.message || "Failed to load calculation details");
            } finally {
                setLoading(false);
            }
        };

        fetchCalculationDetails();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return "Not Paid";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            return "N/A";
        }
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return "₱0.00";
        try {
            return new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
                minimumFractionDigits: 2,
            }).format(parseFloat(amount) || 0);
        } catch (error) {
            return "₱0.00";
        }
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            return "N/A";
        }
    };

    const getMonthName = (monthString) => {
        if (!monthString) return "N/A";
        try {
            const [year, month] = monthString.split("-");
            const date = new Date(year, month - 1);
            return date.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
            });
        } catch (error) {
            return "N/A";
        }
    };

    const getStatusColor = (status) => {
        switch ((status || "").toLowerCase()) {
            case "paid":
                return "bg-green-500/20 text-green-800 dark:text-green-300";
            case "pending":
                return "bg-yellow-500/20 text-yellow-800 dark:text-yellow-300";
            default:
                return "bg-gray-500/20 text-gray-800 dark:text-gray-300";
        }
    };

    const formatNumber = (value) => {
        if (value === null || value === undefined || value === "") return "0";
        try {
            const num = parseFloat(value);
            return isNaN(num) ? "0" : num.toLocaleString();
        } catch (error) {
            return "0";
        }
    };

    const safeGet = (obj, path, defaultValue = "N/A") => {
        if (!obj) return defaultValue;
        const keys = path.split(".");
        let result = obj;
        for (const key of keys) {
            if (result === null || result === undefined) return defaultValue;
            result = result[key];
        }
        return result === null || result === undefined ? defaultValue : result;
    };

    if (loading)
        return (
            <Layout>
                <div className="pt-2">
                    <PageHeader
                        title="Calculation Details"
                        description="Loading details..."
                    />
                    <LoadingState message="Loading bill details..." />
                </div>
            </Layout>
        );
    // if (error) return <ErrorState error={error} />;
    if (!calculation) return null;

    return (
        <Layout>
            <div className="pt-2">
                {/* Page Header */}
                <PageHeader
                    title={`Calculation Details (SM-${safeGet(
                        calculation,
                        "unit.submeter_number"
                    )})`}
                    description={`Unit ${safeGet(
                        calculation,
                        "unit.unit_number"
                    )} - ${safeGet(calculation, "unit.tenant_name")}`}
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
                            <div className="flex justify-between items-center gap-1 xs:gap-3 mb-1 md:mb-2">
                                <h2 className="text-lg md:text-2xl font-bold">
                                    Amount Due
                                </h2>
                                <span
                                    className={`px-2 md:px-3 py-1 ml-3 rounded-full text-xs font-medium  w-fit ${getStatusColor(
                                        calculation.status
                                    )}`}
                                >
                                    {(
                                        calculation.status || "UNKNOWN"
                                    ).toUpperCase()}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">
                                {getMonthName(calculation.month)}
                            </p>
                        </div>
                        <div className="text-left sm:text-right mt-1 sm:mt-0">
                            <div className="text-xl md:text-3xl lg:text-4xl font-bold mb-0.5 md:mb-1">
                                {formatCurrency(calculation.total_amount)}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">
                                Due: {formatDateOnly(totalBill?.due_date)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grind-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-6">
                    {/* Right Column - Calculation Details */}
                    <div className="xl:col-span-2">
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
                                        {formatNumber(
                                            calculation.previous_reading
                                        )}{" "}
                                        kWh
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Start of{" "}
                                        {getMonthName(calculation.month)}
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
                                        {formatNumber(
                                            calculation.current_reading
                                        )}{" "}
                                        kWh
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        End of {getMonthName(calculation.month)}
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
                                        {formatCurrency(calculation.rate)}
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
                                        {formatNumber(
                                            calculation.total_consumption
                                        )}{" "}
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
                                        (
                                        {formatNumber(
                                            calculation.current_reading
                                        )}{" "}
                                        -{" "}
                                        {formatNumber(
                                            calculation.previous_reading
                                        )}
                                        ) × {formatNumber(calculation.rate)} ={" "}
                                        {formatNumber(calculation.total_amount)}
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
                            <div className="mt-4 md:mt-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-50">
                                    <div>
                                        <h4 className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Payment Information
                                        </h4>
                                        <div className="space-y-1 md:space-y-2 text-sm">
                                            <div className="flex justify-between items-center py-0.5">
                                                <span className="text-gray-600 dark:text-gray-400 text-sm">
                                                    Payment By:
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {formatDate(
                                                        calculation.date_paid
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Date Paid:
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {formatDate(
                                                        calculation.date_paid
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
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
                                                    {calculation.method ||
                                                        "Not Paid"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-0.5">
                                                <span className="text-gray-600 dark:text-gray-400 text-sm">
                                                    Attachment:
                                                </span>
                                                <a
                                                    href=""
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1.5"
                                                >
                                                    <i className="fas fa-paperclip text-xs"></i>
                                                    View Attachment
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Left Column - Unit Info */}
                    <div className="xl:col-span-1 space-y-4 md:space-y-6">
                        {/* Bill Receipt Card */}
                        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-4 md:p-5">
                            <h3 className="text-base md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center">
                                <i className="fas fa-receipt mr-2 text-gray-500 text-sm md:text-lg"></i>
                                Building Total Bill
                            </h3>
                            <div className="space-y-2 md:space-y-4 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Month
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {getMonthName(calculation.month)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Due Date
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatDateOnly(totalBill?.due_date)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-xl text-gray-600 dark:text-gray-200">
                                        Bill Receipt
                                    </span>
                                    <span className="font-semibold text-xl font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(totalBill?.total_bill)}
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
                                        {safeGet(
                                            calculation,
                                            "unit.unit_number"
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Submeter
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        SM-
                                        {safeGet(
                                            calculation,
                                            "unit.submeter_number"
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Tenant
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {safeGet(
                                            calculation,
                                            "unit.tenant_name"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Computation Info */}
                        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 px-4 md:px-5 py-4 md:py-5.75">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center">
                                <i className="fas fa-user-cog mr-2 text-gray-500 text-sm md:text-lg"></i>
                                Computation Details
                            </h3>
                            <div className="space-y-2 md:space-y-4 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Date
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white text-right">
                                        {formatDate(calculation.created_at)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Time
                                    </span>
                                    <div className="text-right">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            aa
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Computed By
                                    </span>
                                    <div className="text-right">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {calculation.computed_by || "N/A"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CalculationDetails;
