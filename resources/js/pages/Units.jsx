import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/Common/PageHeader";
import SearchFilterBar from "../components/Common/SearchFilterBar";
import EmptyState from "../components/Common/EmptyState";
import FooterStats from "../components/Common/FooterStats";
import LoadingState from "../components/Common/LoadingState";
import ErrorState from "../components/Common/ErrorState";
import UnitCard from "../components/Cards/UnitCard";
import { apartmentApi } from "../api/apartmentApi";
import ConfirmationModal from "../components/Common/ConfirmationModal";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/AuthContext";

const Units = () => {
    const navigate = useNavigate();
    const [units, setUnits] = useState([]);
    const [filteredUnits, setFilteredUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const isReadOnly =
        (user && user.role === "viewer") || user.role === "admin";

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("unit_number");
    const [sortOrder, setSortOrder] = useState("asc");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);

    // Delete states
    const [unitToDelete, setUnitToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");

    // Configuration for reusable components
    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "available", label: "Available" },
        { value: "unavailable", label: "Unavailable" },
    ];

    const sortOptions = [
        { value: "unit_number", label: "Unit", tooltip: "Sort by Unit Number" },
        {
            value: "tenant_name",
            label: "Tenant",
            tooltip: "Sort by Tenant Name",
        },
        {
            value: "submeter_number",
            label: "Submeter",
            tooltip: "Sort by Submeter",
        },
    ];

    useEffect(() => {
        fetchUnitsFromAPI();
    }, []);

    // Filter and sort units when dependencies change
    useEffect(() => {
        filterAndSortUnits();
    }, [units, searchTerm, statusFilter, sortBy, sortOrder]);

    const fetchUnitsFromAPI = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await apartmentApi.getUnits();
            setUnits(response.data || response || []);
        } catch (error) {
            console.error("Error fetching units:", error);
            setError("Failed to load apartment units. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortUnits = () => {
        let result = [...units];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (unit) =>
                    unit.unit_number?.toLowerCase().includes(term) ||
                    unit.tenant_name?.toLowerCase().includes(term) ||
                    unit.submeter_number?.toLowerCase().includes(term) ||
                    unit.floor?.toLowerCase().includes(term)
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            result = result.filter((unit) => unit.status === statusFilter);
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue = a[sortBy] || "";
            let bValue = b[sortBy] || "";

            // Handle numeric sorting for unit_number
            if (sortBy === "unit_number") {
                aValue = parseInt(aValue) || 0;
                bValue = parseInt(bValue) || 0;
            }

            if (sortOrder === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
            }
        });

        setFilteredUnits(result);
    };

    const handleAddNewUnit = () => {
        navigate("/units/new");
    };

    // Handle unit deletion
    const handleDeleteUnit = async (unitId) => {
        setIsDeleting(true);
        try {
            await apartmentApi.deleteUnit(unitId);

            // Remove the unit from the list
            setUnits((prevUnits) =>
                prevUnits.filter((unit) => unit.id !== unitId)
            );

            // Show success message
            setDeleteSuccessMessage("Unit deleted successfully!");

            // Hide message after 3 seconds
            setTimeout(() => setDeleteSuccessMessage(""), 3000);
            // fetchUnitsFromAPI();
        } catch (error) {
            console.error("Delete error:", error);
            setError("Failed to delete unit. Please try again.");
        } finally {
            setIsDeleting(false);
            setUnitToDelete(null);
        }
    };

    // Handle delete success callback from UnitCard
    const handleDeleteSuccess = (deletedUnitId) => {
        // Remove the unit from the list
        setUnits((prevUnits) =>
            prevUnits.filter((unit) => unit.id !== deletedUnitId)
        );

        // Show success message
        setDeleteSuccessMessage("Unit deleted successfully!");
        setTimeout(() => setDeleteSuccessMessage(""), 3000);
    };

    const handleEdit = (unit) => {};

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
            available:
                "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            unavailable:
                "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        };
        return (
            colors[status] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
        );
    };

    const getStatusLabel = (status) => {
        const labels = {
            available: "Available",
            unavailable: "Unavailable",
        };
        return labels[status] || "Unknown";
    };

    // // Loading state
    // if (loading) return <LoadingState message="Loading apartment units..." />;

    // // Error state
    // if (error) return <ErrorState error={error} onRetry={fetchUnitsFromAPI} />;

    return (
        <Layout>
            <div className="pt-2">
                {/* Page Header */}
                <PageHeader
                    title="Apartment Units"
                    description="Manage apartment units and tenant information"
                    actionButton={
                        !isReadOnly && (
                            <button
                                onClick={() => handleAddNewUnit()}
                                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Add Unit
                            </button>
                        )
                    }
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
                    searchPlaceholder="Search by unit number, tenant name, or submeter..."
                    filterLabel="Status:"
                    sortLabel="Sort:"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredUnits.map((unit) => (
                        <UnitCard
                            key={unit.id}
                            unit={unit}
                            onEdit={handleEdit}
                            onDelete={handleDeleteUnit}
                            onDeleteSuccess={handleDeleteSuccess}
                            getStatusColor={getStatusColor}
                            getStatusLabel={getStatusLabel}
                            isReadOnly={isReadOnly}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredUnits.length === 0 && !loading && !error && (
                    <EmptyState
                        icon="fa-building"
                        title={
                            searchTerm || statusFilter !== "all"
                                ? "No matching units found"
                                : "No units found"
                        }
                        message={
                            searchTerm || statusFilter !== "all"
                                ? "Try changing your search or filter criteria."
                                : "Get started by adding your first apartment unit."
                        }
                        showButton={!searchTerm && statusFilter === "all"}
                    />
                )}

                <ConfirmationModal
                    isOpen={!!unitToDelete}
                    onClose={() => setUnitToDelete(null)}
                    onConfirm={() => handleDeleteUnit(unitToDelete)}
                    title="Delete Unit"
                    message={`Are you sure you want to delete Unit ${unitToDelete?.unit_number}? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    type="danger"
                    isLoading={isDeleting}
                />

                {/* Footer Stats */}
                {filteredUnits.length > 0 && (
                    <FooterStats
                        showing={filteredUnits.length}
                        total={units.length}
                        subText={`${
                            units.filter((u) => u.status === "available").length
                        } Available • ${
                            units.filter((u) => u.status === "unavailable")
                                .length
                        } Unavailable `}
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

export default Units;
