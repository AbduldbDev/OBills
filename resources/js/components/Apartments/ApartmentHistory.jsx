import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../Common/PageHeader";
import SearchFilterBar from "../Common/SearchFilterBar";
import EmptyState from "../Common/EmptyState";
import FooterStats from "../Common/FooterStats";
import LoadingState from "../Common/LoadingState";
import ErrorState from "../Common/ErrorState";
import ApartmentCard from "../Cards/ApartmentCard";
import { apartmentApi } from "../../api/apartmentApi";

const ApartmentHistory = () => {
    const navigate = useNavigate();
    const [apartments, setApartments] = useState([]);
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("unit_number");
    const [sortOrder, setSortOrder] = useState("asc");

    // Configuration for reusable components
    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "occupied", label: "Occupied" },
        { value: "vacant", label: "Vacant" },
    ];

    const sortOptions = [
        { value: "unit_number", label: "Unit", tooltip: "Sort by Unit Number" },
        {
            value: "submeter_number",
            label: "Submeter",
            tooltip: "Sort by Submeter",
        },
        {
            value: "tenant_name",
            label: "Tenant",
            tooltip: "Sort by Tenant Name",
        },
    ];

    useEffect(() => {
        fetchApartmentsFromAPI();
    }, []);

    // Filter and sort apartments when dependencies change
    useEffect(() => {
        filterAndSortApartments();
    }, [apartments, searchTerm, statusFilter, sortBy, sortOrder]);

    const fetchApartmentsFromAPI = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await apartmentApi.getUnits();
            setApartments(response.data || response || []);
        } catch (error) {
            console.error("Error fetching apartments:", error);
            setError("Failed to load apartments. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortApartments = () => {
        let result = [...apartments];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (apartment) =>
                    apartment.unit_number?.toLowerCase().includes(term) ||
                    apartment.tenant_name?.toLowerCase().includes(term) ||
                    apartment.submeter_number?.toLowerCase().includes(term) ||
                    apartment.floor?.toLowerCase().includes(term)
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            if (statusFilter === "occupied") {
                result = result.filter(
                    (apartment) =>
                        apartment.tenant_name &&
                        apartment.tenant_name.trim() !== ""
                );
            } else if (statusFilter === "vacant") {
                result = result.filter(
                    (apartment) =>
                        !apartment.tenant_name ||
                        apartment.tenant_name.trim() === ""
                );
            }
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

            // Handle empty tenant names for sorting
            if (sortBy === "tenant_name") {
                aValue = a.tenant_name || "";
                bValue = b.tenant_name || "";
            }

            if (sortOrder === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
            }
        });

        setFilteredApartments(result);
    };

    const handleAddNewApartment = () => {
        navigate("/apartments/new");
    };

    const handleCardClick = (apartment) => {
        navigate(`/apartments/${apartment.id}`);
    };

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const getStatusColor = (tenantName) => {
        return tenantName && tenantName.trim() !== ""
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    };

    const getStatusLabel = (tenantName) => {
        return tenantName && tenantName.trim() !== "" ? "Occupied" : "Vacant";
    };

    const getStats = () => {
        const total = apartments.length;
        const occupied = apartments.filter(
            (apartment) =>
                apartment.tenant_name && apartment.tenant_name.trim() !== ""
        ).length;
        const vacant = total - occupied;

        return { total, occupied, vacant };
    };

    // Loading state
    if (loading) return <LoadingState message="Loading apartments..." />;

    // Error state
    if (error)
        return <ErrorState error={error} onRetry={fetchApartmentsFromAPI} />;

    const stats = getStats();

    return (
        <div className="pt-2">
            {/* Page Header */}
            <PageHeader
                title="Apartments"
                description="View and manage apartment units, submeters, and tenant information"
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

            {/* Apartments Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredApartments.map((apartment) => (
                    <ApartmentCard
                        key={apartment.id}
                        apartment={apartment}
                        onClick={handleCardClick}
                        getStatusColor={getStatusColor}
                        getStatusLabel={getStatusLabel}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredApartments.length === 0 && !loading && !error && (
                <EmptyState
                    icon="fa-building"
                    title={
                        searchTerm || statusFilter !== "all"
                            ? "No matching apartments found"
                            : "No apartments found"
                    }
                    message={
                        searchTerm || statusFilter !== "all"
                            ? "Try changing your search or filter criteria."
                            : "Get started by adding your first apartment."
                    }
                    showButton={!searchTerm && statusFilter === "all"}
                    buttonText="Add Apartment"
                    onButtonClick={handleAddNewApartment}
                />
            )}

            {/* Footer Stats */}
            {filteredApartments.length > 0 && (
                <FooterStats
                    showing={filteredApartments.length}
                    total={apartments.length}
                    subText={`${stats.occupied} Occupied • ${stats.vacant} Vacant`}
                    sortInfo={`Sorted by ${sortBy.replace(
                        "_",
                        " "
                    )} (${sortOrder})`}
                />
            )}
        </div>
    );
};

export default ApartmentHistory;
