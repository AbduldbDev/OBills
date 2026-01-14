import React, { useState, useEffect } from "react";
import { CalculationApi } from "../api/calculationApi";
import BillCard from "../components/Dashboard/BillCard";
import Layout from "../components/Layout/Layout";
import PageHeader from "../components/Common/PageHeader";
import EmptyState from "../components/Common/EmptyState";

const Calculation = () => {
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [months, setMonths] = useState([]);
    const [data, setData] = useState([]);
    const [totalBill, setTotalBill] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedMonth) {
            fetchData(selectedMonth);
        }
    }, [selectedMonth]);

    useEffect(() => {
        const currentDate = new Date();
        const monthsArray = [];
        const monthNames = [
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
        ];

        for (let i = 0; i <= 5; i++) {
            const date = new Date();
            date.setMonth(currentDate.getMonth() - i);
            const year = date.getFullYear();
            const month = date.getMonth();

            monthsArray.push({
                value: `${year}-${String(month + 1).padStart(2, "0")}`,
                label: `${monthNames[month]} ${year}`,
            });
        }

        setMonths(monthsArray);
        setSelectedMonth(
            `${currentDate.getFullYear()}-${String(
                currentDate.getMonth() + 1
            ).padStart(2, "0")}`
        );
    }, []);

    const fetchData = async (month) => {
        setLoading(true);
        setError(null);
        try {
            const response = await CalculationApi.getCalculations(month);
            if (response.success) {
                setData(response.data || []);
                setTotalBill(response.total_bill);
            } else {
                setError("Failed to fetch data");
                setData([]);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "An error occurred while fetching data"
            );
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const transformDataToBills = () => {
        return data.map((unit, index) => {
            // Check if unit has bills data
            const billData =
                unit.bills && unit.bills.length > 0 ? unit.bills[0] : null;

            return {
                id: unit.unit_id || index,
                unit_id: unit.unit_id,
                submeter: `SM-${unit.submeter_no}`,
                tenant: unit.tenant_name || "No Tenant",
                status: billData?.status?.toLowerCase() || "pending",
                previousReading: billData?.previous_reading || 0,
                currentReading: billData?.current_reading || 0,
                rate: billData?.rate || totalBill?.rate || 0,
                totalConsumption: billData?.total_consumption,
                totalAmount: billData?.total_amount,
                unitNumber: unit.unit_number,

                month: selectedMonth,
                hasBill: !!billData,
            };
        });
    };

    const calculateStats = () => {
        const bills = transformDataToBills();
        const paid = bills.filter((bill) => bill.status === "paid").length;
        const pending = bills.filter(
            (bill) => bill.status === "pending"
        ).length;
        const totalUnits = bills.length;

        return { paid, pending, totalUnits };
    };

    const stats = calculateStats();

    return (
        <Layout>
            <div className="pt-2">
                <PageHeader
                    title="Calculation Page"
                    description="Select a month to view and calculate bills for that period"
                    actionButton={
                        <div className="p-1 mt-4 md:mt-0">
                            <div className="flex items-center space-x-2">
                                <i className="fas fa-calendar-alt text-gray-400"></i>
                                <select
                                    value={selectedMonth || ""}
                                    onChange={handleMonthChange}
                                    disabled={loading}
                                    className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-dark-800 border border-gray-300 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="" disabled>
                                        Select month
                                    </option>
                                    {months.map((month) => (
                                        <option
                                            key={month.value}
                                            value={month.value}
                                        >
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    }
                />

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Loading data...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <p className="text-red-600 dark:text-red-400">
                            Error: {error}
                        </p>
                        <button
                            onClick={() => fetchData(selectedMonth)}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Data Display */}
                {!loading && !error && (
                    <>
                        {transformDataToBills().length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 lg:grid-cols-3  gap-4">
                                    {transformDataToBills().map((bill) => (
                                        <BillCard
                                            key={`${bill.id}-${selectedMonth}`}
                                            bill={bill}
                                            totalBill={totalBill}
                                            selectedMonth={selectedMonth}
                                        />
                                    ))}
                                </div>
                                {selectedMonth && (
                                    <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                                        <p>
                                            Showing data for:{" "}
                                            <span className="font-medium">
                                                {selectedMonth}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <EmptyState
                                icon="fa-building"
                                title={"No apartments found"}
                                message={
                                    "Get started by adding your first apartment."
                                }
                            />
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Calculation;
