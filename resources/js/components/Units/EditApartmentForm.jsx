import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../common/PageHeader";
import { apartmentApi } from "../../api/apartmentApi";
import FormInput from "../../components/Form/FormInput";
import FormSelect from "../../components/Form/FormSelect";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";

const EditApartmentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        unit_number: "",
        tenant_name: "",
        submeter_number: "",
        status: "available",
    });
    const [originalData, setOriginalData] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchUnitData();
    }, [id]);

    const fetchUnitData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apartmentApi.getUnit(id);
            const unit = response.data || response;
            const newFormData = {
                unit_number: unit.unit_number || unit.unitNumber || "",
                tenant_name: unit.tenant_name || unit.tenantName || "",
                submeter_number:
                    unit.submeter_number || unit.submeterNumber || "",
                status: unit.status || "available",
            };

            setFormData(newFormData);
            setOriginalData(newFormData);
        } catch (error) {
            console.error("Error fetching unit:", error);
            setError(error.message || "Failed to load unit data");
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.unit_number.trim()) {
            newErrors.unit_number = "Unit number is required";
        }

        if (!formData.submeter_number.trim()) {
            newErrors.submeter_number = "Submeter number is required";
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // If status is changing to "available", clear tenant name
        if (name === "status" && value === "available") {
            setFormData((prev) => ({
                ...prev,
                status: value,
                tenant_name: "", // Clear tenant name when status becomes available
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

        // Clear tenant name error if status changes
        if (name === "status" && errors.tenant_name) {
            setErrors((prev) => ({ ...prev, tenant_name: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccessMessage("");
        setErrors({});

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const hasChanges =
            originalData &&
            Object.keys(formData).some(
                (key) => formData[key] !== originalData[key]
            );

        if (!hasChanges) {
            setErrors({
                submit: "No changes were made to the unit details.",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = {
                ...formData,
                unit_number: formData.unit_number.trim(),
                tenant_name: formData.tenant_name.trim(),
                submeter_number: formData.submeter_number.trim(),
            };

            const response = await apartmentApi.updateUnit(id, submitData);

            setSuccessMessage(
                `Unit ${submitData.unit_number} has been updated successfully!`
            );

            setOriginalData(submitData);

            setTimeout(() => {
                navigate("/units");
            }, 1000);
        } catch (error) {
            console.error("API Error:", error.response?.data);

            if (error.response?.data?.errors) {
                const apiErrors = error.response.data.errors;
                const mappedErrors = {};

                if (apiErrors.unit_number) {
                    mappedErrors.unit_number = apiErrors.unit_number[0];
                }

                if (apiErrors.submeter_number) {
                    mappedErrors.submeter_number = apiErrors.submeter_number[0];
                }

                if (apiErrors.tenant_name) {
                    mappedErrors.tenant_name = apiErrors.tenant_name[0];
                }

                if (apiErrors.status) {
                    mappedErrors.status = apiErrors.status[0];
                }

                if (Object.keys(mappedErrors).length === 0) {
                    mappedErrors.submit =
                        error.response?.data?.message ||
                        "Failed to update unit. Please try again.";
                }

                setErrors(mappedErrors);
            } else {
                setErrors((prev) => ({
                    ...prev,
                    submit:
                        error.message ||
                        "Failed to update unit. Please try again.",
                }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/units");
    };

    if (isLoading) {
        return (
            <div className="pt-2">
                <PageHeader title="Edit Apartment" />
                <LoadingState message="Loading unit details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-2">
                <PageHeader title="Edit Apartment" />
                <ErrorState message={error} onRetry={fetchUnitData} />
            </div>
        );
    }

    return (
        <div className="pt-2">
            <PageHeader
                title="Edit Apartment"
                description="Update the details of this apartment unit"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-5">
                    <div className="bg-white dark:bg-dark-800 rounded-lg lg:rounded-2xl border border-gray-200 dark:border-dark-700 p-6 shadow-sm">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Edit Unit Information
                                </h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Update the details below
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {successMessage && (
                                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <p className="text-sm text-green-600 dark:text-green-400">
                                        <i className="fas fa-check-circle mr-2"></i>
                                        {successMessage}
                                        <span className="block text-xs mt-1 text-green-500 dark:text-green-300">
                                            Redirecting to units list...
                                        </span>
                                    </p>
                                </div>
                            )}

                            {errors.submit && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        <i className="fas fa-exclamation-circle mr-2"></i>
                                        {errors.submit}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-5">
                                <FormInput
                                    label="Unit Number"
                                    name="unit_number"
                                    type="text"
                                    size="sm"
                                    value={formData.unit_number}
                                    onChange={handleChange}
                                    placeholder="e.g., 101, A-201"
                                    error={errors.unit_number}
                                    required={true}
                                    icon="fas fa-hashtag"
                                    disabled={isSubmitting}
                                />

                                <FormInput
                                    label="Submeter Number"
                                    name="submeter_number"
                                    type="text"
                                    size="sm"
                                    value={formData.submeter_number}
                                    onChange={handleChange}
                                    placeholder="e.g., SM-001"
                                    error={errors.submeter_number}
                                    required={true}
                                    icon="fas fa-tachometer-alt"
                                    disabled={isSubmitting}
                                />

                                <FormSelect
                                    label="Status"
                                    name="status"
                                    size="sm"
                                    value={formData.status}
                                    onChange={handleChange}
                                    options={[
                                        {
                                            value: "available",
                                            label: "Available (Vacant)",
                                        },
                                        {
                                            value: "unavailable",
                                            label: "Unavailable (Occupied)",
                                        },
                                    ]}
                                    error={errors.status}
                                    required={true}
                                    icon="fas fa-building"
                                    disabled={isSubmitting}
                                />

                                {formData.status === "available" && (
                                    <FormInput
                                        label="Tenant Name"
                                        name="tenant_name"
                                        type="text"
                                        size="sm"
                                        value={formData.tenant_name}
                                        onChange={handleChange}
                                        placeholder="Enter tenant's full name"
                                        error={errors.tenant_name}
                                        required={false}
                                        icon="fas fa-user"
                                        disabled={isSubmitting}
                                    />
                                )}

                                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
                                    {/* Back Button - Left aligned on mobile and desktop */}
                                    <div className="flex-1 sm:flex-none">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={isSubmitting}
                                            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                                        >
                                            <i className="fas fa-arrow-left mr-2"></i>
                                            Back to Units
                                        </button>
                                    </div>

                                    {/* Save Button - Full width on mobile, auto width on desktop */}
                                    <div className="flex-1 sm:flex-none">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save mr-2"></i>
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-800 rounded-lg lg:rounded-2xl border border-gray-200 dark:border-dark-700 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                        Editing Guidelines
                    </h3>

                    <div className="space-y-7">
                        <div className="flex items-start">
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                                <i className="fas fa-edit text-blue-600 dark:text-blue-400 text-xs"></i>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Update Carefully
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    Ensure unit and submeter numbers remain
                                    unique after editing
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3 mt-0.5">
                                <i className="fas fa-exclamation-triangle text-yellow-600 dark:text-yellow-400 text-xs"></i>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Tenant Information
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    Changing status will affect tenant records
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-0.5">
                                <i className="fas fa-check text-green-600 dark:text-green-400 text-xs"></i>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Validation
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    All fields are validated before saving
                                    changes
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-900/50 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            <i className="fas fa-exclamation-triangle mr-1"></i>
                            Changes will be saved immediately. You can reset to
                            original values if needed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditApartmentForm;
