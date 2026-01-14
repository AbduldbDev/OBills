import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/Common/PageHeader";
import SearchFilterBar from "../components/Common/SearchFilterBar";
import EmptyState from "../components/Common/EmptyState";
import FooterStats from "../components/Common/FooterStats";
import BillCard from "../components/Cards/BillCards";
import { billsApi } from "../api/billsApi";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/AuthContext";

const BillReceipt = () => {
    const navigate = useNavigate();
    const [bills, setBills] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [yearFilter, setYearFilter] = useState("all");
    const [sortBy, setSortBy] = useState("month");
    const [sortOrder, setSortOrder] = useState("desc");
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
    const { user } = useAuth();
    const isReadOnly = user && user.role === "viewer";

    const yearOptions = [
        { value: "all", label: "All Years" },
        ...years.map((year) => ({
            value: year.toString(),
            label: year.toString(),
        })),
    ];

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

    const sortOptions = [
        { value: "month", label: "Month", tooltip: "Sort by Month" },
        { value: "total_bill", label: "Amount", tooltip: "Sort by Amount" },
        {
            value: "date_posted",
            label: "Posted Date",
            tooltip: "Sort by Posted Date",
        },
    ];

    useEffect(() => {
        fetchBills();
    }, []);

    useEffect(() => {
        filterAndSortBills();
    }, [bills, searchTerm, yearFilter, sortBy, sortOrder]);

    const fetchBills = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await billsApi.getBills();
            const formattedBills =
                response.data?.map((bill) => {
                    const [year, month] = bill.month.split("-").map(Number);

                    return {
                        id: bill.id,
                        month: month,
                        year: year,
                        total_bill: parseFloat(bill.total_bill) || 0,
                        rate_per_kwh: parseFloat(bill.rate) || 0,
                        due_date: bill.due_date,
                        date_posted:
                            bill.created_at ||
                            bill.updated_at ||
                            new Date().toISOString(),
                        image: bill.image,
                        posted_by: bill.posted_by,
                    };
                }) || [];

            setBills(formattedBills);
        } catch (error) {
            console.error("Error fetching bills:", error);
            setError("Failed to load billing data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortBills = () => {
        let result = [...bills];

        if (yearFilter !== "all") {
            result = result.filter(
                (bill) => bill.year.toString() === yearFilter
            );
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter((bill) => {
                const monthName = monthNames[bill.month - 1]?.toLowerCase();
                const yearStr = bill.year.toString();
                const amountStr = bill.total_bill.toString();
                const rateStr = bill.rate_per_kwh.toString();
                const postedByStr = (bill.posted_by || "").toLowerCase();

                return (
                    monthName?.includes(term) ||
                    yearStr.includes(term) ||
                    amountStr.includes(term) ||
                    rateStr.includes(term) ||
                    postedByStr.includes(term)
                );
            });
        }

        result.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case "month":
                    aValue = a.year * 100 + a.month;
                    bValue = b.year * 100 + b.month;
                    break;
                case "total_bill":
                    aValue = a.total_bill;
                    bValue = b.total_bill;
                    break;
                case "date_posted":
                    aValue = new Date(a.date_posted).getTime();
                    bValue = new Date(b.date_posted).getTime();
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

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const handleAddBill = () => {
        navigate("/bill-receipt/new");
    };

    // if (loading) return <LoadingState message="Loading billing data..." />;
    // if (error) return <ErrorState error={error} onRetry={fetchBills} />;

    return (
        <Layout>
            <div className="pt-2">
                <PageHeader
                    title="Monthly Bills"
                    description="Electricity bills and rates"
                    actionButton={
                        !isReadOnly && (
                            <button
                                onClick={handleAddBill}
                                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Add Bill
                            </button>
                        )
                    }
                />

                {/* Search and Filter Bar */}
                <SearchFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterValue={yearFilter}
                    setFilterValue={setYearFilter}
                    filterOptions={yearOptions}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={toggleSort}
                    sortOptions={sortOptions}
                    searchPlaceholder="Search by month, amount, rate, or posted by..."
                    filterLabel="Year:"
                    sortLabel="Sort:"
                />

                {/* Bills Grid using BillCard component */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBills.map((bill) => (
                        <BillCard
                            key={bill.id}
                            bill={bill}
                            monthNames={monthNames}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredBills.length === 0 && (
                    <EmptyState
                        icon="fa-file-invoice-dollar"
                        title={
                            searchTerm || yearFilter !== "all"
                                ? "No matching bills found"
                                : "No billing data"
                        }
                        message={
                            searchTerm || yearFilter !== "all"
                                ? "Try changing your search or filter criteria."
                                : "Get started by adding your first monthly bill."
                        }
                        showButton={!searchTerm && yearFilter === "all"}
                    />
                )}

                {/* Footer Stats */}
                {filteredBills.length > 0 && (
                    <FooterStats
                        showing={filteredBills.length}
                        total={bills.length}
                        subText={`Total amount: ${formatCurrency(
                            filteredBills.reduce(
                                (sum, bill) => sum + bill.total_bill,
                                0
                            )
                        )}`}
                        sortInfo={`Sorted by ${sortBy.replace(
                            "_",
                            " "
                        )} (${sortOrder})`}
                    />
                )}
            </div>
        </Layout>
    );
};

export default BillReceipt;
