import React, { useState, useEffect } from "react";
import { CalculationApi } from "../../api/calculationApi";
import { useAuth } from "../../context/AuthContext";

const BillCard = ({ bill, totalBill, selectedMonth, onComputeSuccess }) => {
    const { user } = useAuth();
    const isReadOnly =
        user && (user.role === "viewer");

    const [previousReading, setPreviousReading] = useState(
        bill.previousReading
    );
    const [currentReading, setCurrentReading] = useState(bill.currentReading);
    const [rate, setRate] = useState(bill.rate);
    const [isComputing, setIsComputing] = useState(false);
    const [computeError, setComputeError] = useState(null);
    const [computeSuccess, setComputeSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const consumption = currentReading - previousReading;
    const totalAmount = consumption * rate;
    const canCompute = currentReading > 0;
    const canPerformCompute = canCompute && !isReadOnly && !isComputing;

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return "0";
        return parseFloat(amount).toLocaleString("en-US");
    };

    // Handle fade-out for error messages
    useEffect(() => {
        if (computeError) {
            setShowError(true);
            const timer = setTimeout(() => {
                setShowError(false);
                setTimeout(() => setComputeError(null), 300);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [computeError]);

    // Handle fade-out for success messages
    useEffect(() => {
        if (computeSuccess) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
                setTimeout(() => setComputeSuccess(false), 300);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [computeSuccess]);

    const handleCompute = async () => {
        if (!canPerformCompute || isComputing) return;

        setIsComputing(true);
        setComputeError(null);
        setComputeSuccess(false);
        setShowError(false);
        setShowSuccess(false);

        try {
            const computeData = {
                unit_id: bill.unit_id,
                month: selectedMonth,
                previous_reading: previousReading,
                current_reading: currentReading,
                rate: rate,
            };

            const response = await CalculationApi.createComputation(
                computeData
            );

            // Check what the API actually returns
            if (
                response.status === 200 ||
                response.success === true ||
                response.data?.success === true
            ) {
                setComputeSuccess(true);
                if (onComputeSuccess) {
                    onComputeSuccess();
                }
            } else {
                // Log what the API actually returns for debugging

                setComputeError(
                    response.message ||
                        response.data?.message ||
                        "Computation failed"
                );
            }
        } catch (error) {
            setComputeError(
                error.response?.data?.message ||
                    error.message ||
                    "An error occurred during computation"
            );
        } finally {
            setIsComputing(false);
        }
    };

    // Clear messages when inputs change (only if not read-only)
    const handleInputChange = (setter, value) => {
        if (isReadOnly) return; // Don't allow changes if read-only

        setter(value);
        if (computeError || computeSuccess) {
            setComputeError(null);
            setComputeSuccess(false);
            setShowError(false);
            setShowSuccess(false);
        }
    };

    return (
        <div className="bill-card bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">
                        {bill.submeter}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                        Tenant: {bill.tenant}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                        Unit: {bill.unitNumber || "N/A"}
                    </p>
                </div>

                <div className="text-right">
                    <span
                        className={`capitalize text-center px-2.5 py-1 rounded-full text-xs font-medium block mb-1.5 ${
                            bill.status === "paid"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                        }`}
                    >
                        {bill.status}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        ₱{formatCurrency(totalBill?.total_bill)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(totalBill?.due_date)}
                    </p>
                </div>
            </div>

            {/* Error Message with Fade Animation */}
            {showError && computeError && (
                <div
                    className={`mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400 transition-all duration-300 ${
                        showError ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <div className="flex items-center">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        {computeError}
                    </div>
                </div>
            )}

            {/* Success Message with Fade Animation */}
            {showSuccess && computeSuccess && (
                <div
                    className={`mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-sm text-green-600 dark:text-green-400 transition-all duration-300 ${
                        showSuccess ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <div className="flex items-center">
                        <i className="fas fa-check-circle mr-2"></i>
                        Computation successful! Bill has been calculated.
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 dark:bg-dark-900 rounded border border-gray-200 dark:border-dark-700 p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">
                        Previous Reading
                    </p>
                    <input
                        type="number"
                        step="0.1"
                        value={previousReading}
                        onChange={(e) =>
                            handleInputChange(
                                setPreviousReading,
                                parseFloat(e.target.value)
                            )
                        }
                        readOnly={isReadOnly}
                        disabled={isReadOnly}
                        className={`w-full bg-transparent border-none p-0 text-base font-bold focus:outline-none ${
                            isReadOnly
                                ? "text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "text-gray-900 dark:text-white"
                        }`}
                    />
                </div>

                <div className="bg-gray-50 dark:bg-dark-900 rounded border border-gray-200 dark:border-dark-700 p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">
                        Current Reading
                    </p>
                    <input
                        type="number"
                        step="0.1"
                        value={currentReading}
                        onChange={(e) =>
                            handleInputChange(
                                setCurrentReading,
                                parseFloat(e.target.value)
                            )
                        }
                        readOnly={isReadOnly}
                        disabled={isReadOnly}
                        className={`w-full bg-transparent border-none p-0 text-base font-bold focus:outline-none ${
                            isReadOnly
                                ? "text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "text-gray-900 dark:text-white"
                        }`}
                    />
                </div>
            </div>

            <div className="mb-4 flex items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                    Rate (₱/kWh):
                </label>
                <input
                    type="number"
                    value={rate}
                    onChange={(e) =>
                        handleInputChange(setRate, parseFloat(e.target.value))
                    }
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    className={`w-20 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 ${
                        isReadOnly
                            ? "bg-gray-100 dark:bg-dark-800 border-gray-300 dark:border-dark-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            : "bg-gray-50 dark:bg-dark-900 border-gray-300 dark:border-dark-700 text-gray-900 dark:text-white focus:ring-gray-400 dark:focus:ring-gray-200"
                    }`}
                />
            </div>

            {/* <div className="mb-4">
                <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Consumption
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {canCompute ? consumption.toFixed(1) : "0"} kWh
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-1.5">
                    <div
                        className="bg-gray-900 dark:bg-gray-200 h-1.5 rounded-full"
                        style={{
                            width: `${Math.min(
                                (consumption / 100) * 100,
                                100
                            )}%`,
                        }}
                    ></div>
                </div>
            </div> */}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-dark-700">
                <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Total Amount
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                        ₱{canCompute ? totalAmount.toFixed(2) : "0.00"}
                    </p>
                </div>
                <button
                    onClick={handleCompute}
                    disabled={!canPerformCompute || isComputing || isReadOnly}
                    className={`
                        px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                        ${
                            canPerformCompute && !isComputing
                                ? "bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-300"
                                : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        }
                    `}
                >
                    {isComputing ? (
                        <span className="flex items-center justify-center">
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Computing...
                        </span>
                    ) : isReadOnly ? (
                        <span className="flex items-center justify-center">
                            <i className="fas fa-lock mr-2"></i>
                            View Only
                        </span>
                    ) : (
                        <span className="flex items-center justify-center">
                            <i className="fas fa-calculator mr-2"></i>
                            Compute
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default BillCard;
