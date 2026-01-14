import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/Common/PageHeader";
import SearchFilterBar from "../components/Common/SearchFilterBar";
import LoadingState from "../components/Common/LoadingState";
import ErrorState from "../components/Common/ErrorState";
import EmptyState from "../components/Common/EmptyState";
import FooterStats from "../components/Common/FooterStats";
import { billsApi } from "../api/billsApi";
import Layout from "../components/Layout/Layout";

const ReadingList = () => {
    const { id, year } = useParams();
    const navigate = useNavigate();
    const [bills, setBills] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");

    // Status options
    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "pending", label: "Pending" },
        { value: "paid", label: "Paid" },
    ];

    // Sort options
    const sortOptions = [
        {
            value: "submeter_number",
            label: "Submeter",
            tooltip: "Sort by Submeter Number",
        },
        { value: "created_at", label: "Date", tooltip: "Sort by Date Created" },
        { value: "status", label: "Status", tooltip: "Sort by Status" },
    ];

    useEffect(() => {
        fetchBills();
    }, []);

    useEffect(() => {
        filterAndSortBills();
    }, [bills, searchTerm, statusFilter, sortBy, sortOrder]);

    const fetchBills = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await billsApi.getReadingHistory(id, year);
            const formattedBills =
                response.data?.map((bill) => ({
                    id: bill.id,
                    unit_number: bill.unit?.unit_number || "N/A",
                    submeter_number: bill.unit?.submeter_number || "N/A",
                    previous_reading: parseFloat(bill.previous_reading) || 0,
                    current_reading: parseFloat(bill.current_reading) || 0,
                    rate: parseFloat(bill.rate) || 0,
                    total_consumption: parseFloat(bill.total_consumption) || 0,
                    total_amount: parseFloat(bill.total_amount) || 0,
                    computed_by: bill.computed_by || "N/A",
                    status: bill.status,
                    date_paid: bill.date_paid,
                    method: bill.method,
                    created_at: bill.created_at,
                    updated_at: bill.updated_at,
                    month: bill.month,
                })) || [];

            setBills(formattedBills);
        } catch (error) {
            console.error("Error fetching bills:", error);
            setError("Failed to load submeter billing data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortBills = () => {
        let result = [...bills];

        // Apply status filter
        if (statusFilter !== "all") {
            result = result.filter((bill) => bill.status === statusFilter);
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter((bill) => {
                const submeter = bill.submeter_number?.toLowerCase() || "";
                const unit = bill.unit_number?.toLowerCase() || "";
                const computedBy = bill.computed_by?.toLowerCase() || "";
                const month = bill.month?.toLowerCase() || "";

                return (
                    submeter.includes(term) ||
                    unit.includes(term) ||
                    computedBy.includes(term) ||
                    month.includes(term)
                );
            });
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case "submeter_number":
                    aValue = parseInt(a.submeter_number) || a.submeter_number;
                    bValue = parseInt(b.submeter_number) || b.submeter_number;
                    break;
                case "current_reading":
                    aValue = a.current_reading;
                    bValue = b.current_reading;
                    break;
                case "total_amount":
                    aValue = a.total_amount;
                    bValue = b.total_amount;
                    break;
                case "created_at":
                    aValue = new Date(a.created_at).getTime();
                    bValue = new Date(b.created_at).getTime();
                    break;
                case "status":
                    aValue = a.status;
                    bValue = b.status;
                    break;
                default:
                    aValue = 0;
                    bValue = 0;
            }

            if (sortOrder === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
            }
        });

        setFilteredBills(result);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatBillDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-PH", {
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-PH", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
        }
    };

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    if (loading)
        return (
            <Layout>
                <div className="pt-2">
                    <PageHeader
                        title="Reading History"
                        description="Check historical meter readings for each apartment by year."
                        showBackButton={true}
                        backButtonText="Go Back"
                    />
                    <LoadingState message="Loading reading history..." />
                </div>
            </Layout>
        );

    if (error) return <ErrorState error={error} onRetry={fetchBills} />;

    return (
        <Layout>
            <div className="pt-2">
                {/* Page Header */}
                <PageHeader
                    title="Reading History"
                    showBackButton={true}
                    backButtonText="Go Back"
                    description="Check historical meter readings for each apartment by year."
                />

                {/* Search and Filter Bar */}
                <SearchFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterValue={statusFilter}
                    setFilterValue={setStatusFilter}
                    filterOptions={statusOptions}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={toggleSort}
                    sortOptions={sortOptions}
                    searchPlaceholder="Search by submeter, unit, computed by, or month..."
                    filterLabel="Status:"
                    sortLabel="Sort:"
                />

                {/* Bills List - Mobile friendly */}
                {filteredBills.length > 0 ? (
                    <div className="space-y-4">
                        {filteredBills.map((bill) => (
                            <div
                                key={bill.id}
                                className="bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-700 p-4 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                            >
                                {/* Header Row */}
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {formatBillDate(bill.month)}
                                            </h3>
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                                                    bill.status
                                                )}`}
                                            >
                                                {bill.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    bill.status.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Computed by: {bill.computed_by}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                            SM-{bill.submeter_number}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400"></p>
                                    </div>
                                </div>

                                {/* Reading Details Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div className="space-y-1">
                                        <p className="text-xs  text-gray-500 dark:text-gray-400">
                                            Previous Reading
                                        </p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            {bill.previous_reading.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Current Reading
                                        </p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            {bill.current_reading.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Consumption
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {bill.total_consumption} kWh
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Rate per kWh
                                        </p>
                                        <p className="text-sm  text-gray-900 dark:text-white">
                                            {formatCurrency(bill.rate)}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-between items-end pt-3 border-t border-gray-200 dark:border-dark-700">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        <div>
                                            Date Computed:{" "}
                                            {formatDate(bill.created_at)}
                                        </div>
                                        <div>
                                            Time: {formatTime(bill.created_at)}
                                        </div>
                                    </div>
                                    <div className="flex text-sm lg:text-xl space-x-2 font-bold">
                                        {formatCurrency(bill.total_amount)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon="fa-file-invoice-dollar"
                        title={
                            searchTerm || statusFilter !== "all"
                                ? "No matching bills found"
                                : "No submeter bills"
                        }
                        message={
                            searchTerm || statusFilter !== "all"
                                ? "Try changing your search or filter criteria."
                                : "Get started by adding your first submeter bill."
                        }
                        showButton={!searchTerm && statusFilter === "all"}
                    />
                )}

                {/* Footer Stats */}
                {filteredBills.length > 0 && (
                    <FooterStats
                        showing={filteredBills.length}
                        total={bills.length}
                        subText={`Total amount: ${formatCurrency(
                            filteredBills.reduce(
                                (sum, bill) => sum + bill.total_amount,
                                0
                            )
                        )}`}
                        sortInfo={`Sorted by ${sortBy.replace(
                            /_/g,
                            " "
                        )} (${sortOrder})`}
                        additionalStats={
                            <>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    • Pending:{" "}
                                    {
                                        bills.filter(
                                            (b) => b.status === "pending"
                                        ).length
                                    }
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    • Paid:{" "}
                                    {
                                        bills.filter((b) => b.status === "paid")
                                            .length
                                    }
                                </span>
                            </>
                        }
                    />
                )}
            </div>
        </Layout>
    );
};

export default ReadingList;
