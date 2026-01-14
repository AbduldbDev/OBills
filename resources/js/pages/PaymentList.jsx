import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/Common/PageHeader";
import SearchFilterBar from "../components/Common/SearchFilterBar";
import EmptyState from "../components/Common/EmptyState";
import FooterStats from "../components/Common/FooterStats";
import LoadingState from "../components/Common/LoadingState";
import ErrorState from "../components/Common/ErrorState";
import ConfirmationModal from "../components/Common/ConfirmationModal";
import Layout from "../components/Layout/Layout";
import PaymentHistoryCard from "../components/Cards/PaymentHistoryCard";
import { billsApi } from "../api/billsApi";
import { useAuth } from "../context/AuthContext";


const PaymentHistory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const isReadOnly = user && user.role === "viewer";

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("status"); // Default sort by status
    const [sortOrder, setSortOrder] = useState("asc");

    // Status update states
    const [paymentToUpdate, setPaymentToUpdate] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccessMessage, setUpdateSuccessMessage] = useState("");

    // Configuration for reusable components
    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "pending", label: "Pending" },
        { value: "paid", label: "Paid" },
        { value: "sent", label: "Sent" },
        { value: "skipped", label: "Skipped" },
    ];

    const sortOptions = [
        { value: "status", label: "Status", tooltip: "Sort by Payment Status" },
        { value: "month", label: "Month", tooltip: "Sort by Billing Month" },
        { value: "year", label: "Year", tooltip: "Sort by Billing Year" },
    ];

    useEffect(() => {
        fetchPaymentsFromAPI();
    }, []);

    // Filter and sort payments when dependencies change
    useEffect(() => {
        filterAndSortPayments();
    }, [payments, searchTerm, statusFilter, sortBy, sortOrder]);

    const fetchPaymentsFromAPI = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await billsApi.getTenantBills(id);
            const apiData = response.data || response || [];

            // Map API data to match the expected payment structure
            const mappedPayments = apiData.map((bill) => {
                // Extract year from month string (format: "YYYY-MM")
                const monthStr = bill.month || "";
                const year = monthStr.split("-")[0] || "N/A";
                const month = monthStr || "N/A";

                return {
                    id: bill.id,
                    unit_id: bill.unit?.id,
                    unit_number: bill.unit?.unit_number || "N/A",
                    tenant_name: bill.unit?.tenant_name || "No Tenant",
                    submeter_number: bill.unit?.submeter_number || "N/A",
                    total_bill: parseFloat(bill.total_amount) || 0,
                    final_bill: parseFloat(bill.total_amount) || 0,
                    due_date: bill.created_at,
                    last_reading: parseFloat(bill.previous_reading) || 0,
                    current_reading: parseFloat(bill.current_reading) || 0,
                    consumption: parseInt(bill.total_consumption) || 0,
                    kwh: parseInt(bill.total_consumption) || 0,
                    status: bill.status || "pending",
                    payment_date: bill.date_paid || null,
                    floor: "N/A",
                    computed_by: bill.computed_by,
                    month: month,
                    year: year, // Add year field for sorting
                    rate: bill.rate || 9,
                };
            });

            setPayments(mappedPayments);
        } catch (error) {
            console.error("Error fetching payment history:", error);
            setError("Failed to load payment history. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortPayments = () => {
        let result = [...payments];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (payment) =>
                    payment.unit_number?.toLowerCase().includes(term) ||
                    payment.tenant_name?.toLowerCase().includes(term) ||
                    payment.submeter_number?.toLowerCase().includes(term) ||
                    payment.month?.toLowerCase().includes(term) ||
                    payment.computed_by?.toLowerCase().includes(term)
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            result = result.filter(
                (payment) => payment.status === statusFilter
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue, bValue;

            // Handle each sort type differently
            switch (sortBy) {
                case "status":
                    // Sort by status with custom order: pending -> paid -> sent -> skipped
                    const statusOrder = {
                        pending: 1,
                        paid: 2,
                        sent: 3,
                        skipped: 4,
                    };
                    aValue = statusOrder[a.status] || 5; // Default for unknown status
                    bValue = statusOrder[b.status] || 5;
                    break;

                case "month":
                    // Sort by month (YYYY-MM format)
                    aValue = a.month || "";
                    bValue = b.month || "";
                    break;

                case "year":
                    // Sort by year (extracted from month)
                    aValue = parseInt(a.year) || 0;
                    bValue = parseInt(b.year) || 0;
                    break;

                default:
                    // Default to sorting by status
                    const defaultStatusOrder = {
                        pending: 1,
                        paid: 2,
                        sent: 3,
                        skipped: 4,
                    };
                    aValue = defaultStatusOrder[a.status] || 5;
                    bValue = defaultStatusOrder[b.status] || 5;
            }

            // Handle string comparison for month
            if (sortBy === "month") {
                if (sortOrder === "asc") {
                    return aValue.localeCompare(bValue);
                } else {
                    return bValue.localeCompare(aValue);
                }
            }

            // Handle numeric/date comparison for other fields
            if (sortOrder === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
            }
        });

        setFilteredPayments(result);
    };

    const handleUpdateStatus = async (paymentId, newStatus) => {
        setIsUpdating(true);
        try {
            // This would be your actual API call
            // await paymentApi.updatePaymentStatus(paymentId, newStatus);

            // Update local state
            setPayments((prevPayments) =>
                prevPayments.map((payment) =>
                    payment.id === paymentId
                        ? { ...payment, status: newStatus }
                        : payment
                )
            );

            // Show success message
            setUpdateSuccessMessage(
                `Status updated to ${newStatus} successfully!`
            );
            setTimeout(() => setUpdateSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Update error:", error);
            setError("Failed to update status. Please try again.");
        } finally {
            setIsUpdating(false);
            setPaymentToUpdate(null);
        }
    };

    const handleViewDetails = (payment) => {
        // Navigate to payment details page or show modal
        navigate(`/apartments-history/${payment.unit_id}/${payment.month}`);
    };

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending:
                "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
            paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            sent: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            skipped:
                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        };
        return (
            colors[status] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
        );
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: "Pending",
            paid: "Paid",
            sent: "Sent",
            skipped: "Skipped",
        };
        return labels[status] || "Unknown";
    };

    // Loading state
    if (loading)
        return (
            <Layout>
                <div className="pt-2">
                    <PageHeader
                        title="Payment History"
                        description="Review apartment payment status, billing summaries, and transaction records."
                    />
                    <LoadingState message="Loading payment history..." />
                </div>
            </Layout>
        );

    // Error state
    if (error)
        return <ErrorState error={error} onRetry={fetchPaymentsFromAPI} />;

    return (
        <Layout>
            <div className="pt-2">
                {/* Page Header */}
                <PageHeader
                    title="Payment History"
                    description="Review apartment payment status, billing summaries, and transaction records."
                />

                {/* Success Message */}
                {updateSuccessMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-lg">
                        <i className="fas fa-check-circle mr-2"></i>
                        {updateSuccessMessage}
                    </div>
                )}

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
                    searchPlaceholder="Search by unit number, tenant name, or submeter..."
                    filterLabel="Status:"
                    sortLabel="Sort:"
                />

                {/* Payment Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredPayments.map((payment) => (
                        <PaymentHistoryCard
                            key={payment.id}
                            payment={payment}
                            onUpdateStatus={setPaymentToUpdate}
                            onViewDetails={handleViewDetails}
                            getStatusColor={getStatusColor}
                            getStatusLabel={getStatusLabel}
                            isReadOnly={isReadOnly}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredPayments.length === 0 && !loading && !error && (
                    <EmptyState
                        icon="fa-receipt"
                        title={
                            searchTerm || statusFilter !== "all"
                                ? "No matching payments found"
                                : "No payment records found"
                        }
                        message={
                            searchTerm || statusFilter !== "all"
                                ? "Try changing your search or filter criteria."
                                : "Get started by creating your first bill."
                        }
                        showButton={!searchTerm && statusFilter === "all"}
                        onButtonClick={() => navigate("/payments/new")}
                    />
                )}

                {/* Status Update Modal */}
                <ConfirmationModal
                    isOpen={!!paymentToUpdate}
                    onClose={() => setPaymentToUpdate(null)}
                    onConfirm={() =>
                        handleUpdateStatus(
                            paymentToUpdate.id,
                            paymentToUpdate.newStatus
                        )
                    }
                    title="Update Payment Status"
                    message={`Are you sure you want to update the status of payment for Unit ${paymentToUpdate?.unit_number} to ${paymentToUpdate?.newStatus}?`}
                    confirmText="Update"
                    cancelText="Cancel"
                    type="warning"
                    isLoading={isUpdating}
                />

                {/* Footer Stats */}
                {filteredPayments.length > 0 && (
                    <FooterStats
                        showing={filteredPayments.length}
                        total={payments.length}
                        subText={`${
                            payments.filter((p) => p.status === "pending")
                                .length
                        } Pending • ${
                            payments.filter((p) => p.status === "paid").length
                        } Paid • ${
                            payments.filter((p) => p.status === "sent").length
                        } Sent • ${
                            payments.filter((p) => p.status === "skipped")
                                .length
                        } Skipped`}
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

export default PaymentHistory;
