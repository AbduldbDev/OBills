import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountCard from "../components/Cards/AccountCard";
import { accountApi } from "../api/accountApi";

import PageHeader from "../components/Common/PageHeader";
import SearchFilterBar from "../components/Common/SearchFilterBar";
import EmptyState from "../components/Common/EmptyState";
import FooterStats from "../components/Common/FooterStats";
import LoadingState from "../components/Common/LoadingState";
import ErrorState from "../components/Common/ErrorState";
import ConfirmationModal from "../components/Common/ConfirmationModal";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/AuthContext";

const Accounts = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const isReadOnly =
        (user && user.role === "viewer") || user.role === "admin";

    // Delete states
    const [accountToDelete, setAccountToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
    const [deleteError, setDeleteError] = useState(null);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    // Configuration for reusable components
    const roleOptions = [
        { value: "all", label: "All Roles" },
        { value: "super_admin", label: "Super Admin" },
        { value: "manager", label: "Manager" },
        { value: "user", label: "User" },
    ];

    const sortOptions = [
        { value: "name", label: "Name", tooltip: "Sort by Name" },
        { value: "role", label: "Role", tooltip: "Sort by Role" },
        { value: "created_at", label: "Date", tooltip: "Sort by Date" },
    ];

    useEffect(() => {
        fetchAccountsFromAPI();
    }, []);

    useEffect(() => {
        filterAndSortAccounts();
    }, [accounts, searchTerm, roleFilter, sortBy, sortOrder]);

    const fetchAccountsFromAPI = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await accountApi.getAccounts();
            const accountsData = response.data || response || [];
            setAccounts(accountsData);
        } catch (error) {
            console.error("Error fetching accounts:", error);
            setError("Failed to load accounts. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortAccounts = () => {
        let result = [...accounts];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (account) =>
                    account.name?.toLowerCase().includes(term) ||
                    account.email?.toLowerCase().includes(term) ||
                    account.role?.toLowerCase().includes(term)
            );
        }

        // Apply role filter
        if (roleFilter !== "all") {
            result = result.filter((account) => account.role === roleFilter);
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue = a[sortBy] || "";
            let bValue = b[sortBy] || "";

            if (sortBy === "created_at") {
                aValue = new Date(aValue || 0).getTime();
                bValue = new Date(bValue || 0).getTime();
            }

            if (sortOrder === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
            }
        });

        setFilteredAccounts(result);
    };

    const getAccountAge = (createdAt) => {
        if (!createdAt) return "Unknown";

        const createdDate = new Date(createdAt);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - createdDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
        const diffMonths = Math.floor(diffDays / 30);
        return `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
    };

    // Handle edit navigation
    const handleEditAccount = (account) => {
        navigate(`/accounts/edit/${account.id}`);
    };

    // Handle delete button click
    const handleDeleteClick = (accountId) => {
        const account = accounts.find((acc) => acc.id === accountId);
        if (account) {
            setAccountToDelete({
                id: accountId,
                name: account.name,
                email: account.email,
            });
            setDeleteError(null);
        }
    };

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!accountToDelete) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await accountApi.deleteAccount(accountToDelete.id);

            // Remove the account from the list
            setAccounts((prevAccounts) =>
                prevAccounts.filter(
                    (account) => account.id !== accountToDelete.id
                )
            );

            setDeleteSuccessMessage(
                `Account ${accountToDelete.name} deleted successfully!`
            );
            setTimeout(() => setDeleteSuccessMessage(""), 3000);

            setAccountToDelete(null);
        } catch (error) {
            console.error("Error deleting account:", error);
            setDeleteError(
                error.response?.data?.message ||
                    "Failed to delete account. Please try again."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle cancel delete
    const handleDeleteCancel = () => {
        if (!isDeleting) {
            setAccountToDelete(null);
            setDeleteError(null);
        }
    };

    // Handle add new account navigation
    const handleAddNewAccount = () => {
        navigate("/accounts/new");
    };

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    // Get role label
    const getRoleLabel = (role) => {
        const labels = {
            super_admin: "Super Admin",
            manager: "Manager",
            user: "User",
        };
        return labels[role] || role;
    };

    // if (loading) return <LoadingState message="Loading accounts..." />;

    // if (error)
    //     return <ErrorState message={error} onRetry={fetchAccountsFromAPI} />;

    return (
        <Layout>
            <div className="pt-2">
                {/* Success Message */}
                {deleteSuccessMessage && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-400">
                            <i className="fas fa-check-circle mr-2"></i>
                            {deleteSuccessMessage}
                        </p>
                    </div>
                )}

                {/* Page Header */}
                <PageHeader
                    title="Accounts Management"
                    description="Manage user accounts and permissions"
                    actionButton={
                        !isReadOnly && (
                            <button
                                onClick={handleAddNewAccount}
                                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Create Account
                            </button>
                        )
                    }
                />

                {/* Search and Filter Bar */}
                <SearchFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterValue={roleFilter}
                    setFilterValue={setRoleFilter}
                    filterOptions={roleOptions}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={toggleSort}
                    sortOptions={sortOptions}
                    searchPlaceholder="Search by name, email, or role..."
                    filterLabel="Role:"
                    sortLabel="Sort:"
                />

                {/* Accounts Grid */}
                <div className="min-h-[49vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredAccounts.map((account) => (
                            <AccountCard
                                key={account.id}
                                account={account}
                                onEdit={handleEditAccount}
                                onDelete={handleDeleteClick}
                                onDeleteSuccess={() => {}} // Not used with page navigation
                                getAccountAge={getAccountAge}
                                getRoleLabel={getRoleLabel}
                                isReadOnly={isReadOnly}
                            />
                        ))}
                    </div>
                </div>

                {/* Empty State */}
                {filteredAccounts.length === 0 && (
                    <EmptyState
                        icon="fa-users"
                        title={
                            searchTerm || roleFilter !== "all"
                                ? "No matching accounts found"
                                : "No accounts found"
                        }
                        message={
                            searchTerm || roleFilter !== "all"
                                ? "Try changing your search or filter criteria."
                                : "Get started by creating your first account."
                        }
                        showButton={!searchTerm && roleFilter === "all"}
                        buttonText="Create Account"
                        onButtonClick={handleAddNewAccount}
                    />
                )}

                {/* Footer Stats */}
                {filteredAccounts.length > 0 && (
                    <FooterStats
                        showing={filteredAccounts.length}
                        total={accounts.length}
                        subText={`
                        ${
                            accounts.filter((a) => a.role === "super_admin")
                                .length
                        } Super Admin • 
                        ${
                            accounts.filter((a) => a.role === "manager").length
                        } Manager • 
                        ${accounts.filter((a) => a.role === "user").length} User
                    `}
                        sortInfo={`Sorted by ${sortBy.replace(
                            "_",
                            " "
                        )} (${sortOrder})`}
                    />
                )}

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={!!accountToDelete}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Account"
                    message={`Are you sure you want to delete the account for ${accountToDelete?.name} (${accountToDelete?.email})? This action cannot be undone.`}
                    confirmText="Delete Account"
                    cancelText="Cancel"
                    type="danger"
                    isLoading={isDeleting}
                />

                {/* Delete Error Alert */}
                {deleteError && (
                    <div className="fixed top-4 right-4 z-50 max-w-sm">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg">
                            <div className="flex items-start">
                                <div className="shrink-0">
                                    <i className="fas fa-exclamation-circle text-red-600 dark:text-red-400 text-lg"></i>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {deleteError}
                                    </p>
                                    <button
                                        onClick={() => setDeleteError(null)}
                                        className="mt-1 text-xs text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Accounts;
