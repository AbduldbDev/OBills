import React, { useState } from "react";
import PageHeader from "../components/Common/PageHeader";
import { apartmentApi } from "../api/apartmentApi";
import FormInput from "../components/Form/FormInput";
import FormSelect from "../components/Form/FormSelect";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const UnitAdd = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        unit_number: "",
        tenant_name: "",
        submeter_number: "",
        status: "available",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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
                tenant_name: "",
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

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

        // Clear previous messages
        setSuccessMessage("");
        setErrors({});

        // Frontend validation
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare data for submission
            const submitData = {
                ...formData,
                unit_number: formData.unit_number.trim(),
                tenant_name: formData.tenant_name.trim(),
                submeter_number: formData.submeter_number.trim(),
            };

            // Call API
            const response = await apartmentApi.createUnit(submitData);

            // Success message
            setSuccessMessage(
                `Unit ${submitData.unit_number} has been added successfully!`
            );

            // Reset form
            setFormData({
                unit_number: "",
                tenant_name: "",
                submeter_number: "",
                status: "available",
            });
            setTimeout(() => {
                navigate("/units");
            }, 1000);
        } catch (error) {
            console.error("API Error:", error.response?.data);

            // Handle API validation errors
            if (error.response?.data?.errors) {
                const apiErrors = error.response.data.errors;

                // Map API errors to form fields
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

                // If there are other errors not mapped to fields
                if (Object.keys(mappedErrors).length === 0) {
                    mappedErrors.submit =
                        error.response?.data?.message ||
                        "Failed to add unit. Please try again.";
                }

                setErrors(mappedErrors);
            } else {
                // Handle other errors (network, server, etc.)
                setErrors((prev) => ({
                    ...prev,
                    submit:
                        error.message ||
                        "Failed to add unit. Please try again.",
                }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/units");
    };

    return (
        <Layout>
            <div className="pt-2">
                <PageHeader
                    title="Add New Apartment"
                    description="Fill in the details below to add a new apartment unit to the system"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="space-y-5">
                        <div className="bg-white dark:bg-dark-800  rounded-lg lg:rounded-2xl border border-gray-200 dark:border-dark-700 p-6 shadow-sm">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Unit Information
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Enter the apartment details
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Success & Error Messages */}
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
                                    {/* Unit Number using FormInput */}
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

                                    {/* Submeter Number using FormInput */}
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

                                    {/* Status Dropdown - keep as select */}
                                    <FormSelect
                                        label="Status"
                                        name="status"
                                        size="sm"
                                        value={formData.status}
                                        onChange={handleChange}
                                        options={[
                                            {
                                                value: "available",
                                                label: "Available (Occupied)",
                                            },
                                            {
                                                value: "unavailable",
                                                label: "Unavailable (Vacant)",
                                            },
                                        ]}
                                        error={errors.status}
                                        required={true}
                                        icon="fas fa-building"
                                    />

                                    {/* Conditional Tenant Name using FormInput */}
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

                                    {/* Form Actions */}
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

                    {/* Guidelines Section */}
                    <div className="bg-white dark:bg-dark-800  rounded-lg lg:rounded-2xl border border-gray-200 dark:border-dark-700 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                            Guidelines
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                                    <i className="fas fa-1 text-blue-600 dark:text-blue-400 text-xs"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Unit Number
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Must be unique. Check existing units to
                                        avoid duplicates.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                                    <i className="fas fa-2 text-blue-600 dark:text-blue-400 text-xs"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Submeter Number
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Must be unique. Check existing submeters
                                        to avoid duplicates.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-0.5">
                                    <i className="fas fa-3 text-blue-600 dark:text-blue-400 text-xs"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Status
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        "Available" for occupied units,
                                        "Unavailable" for vacant
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                Quick Tips
                            </h4>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                <li className="flex items-start">
                                    <i className="fas fa-check text-green-500 mr-2 mt-0.5 text-xs"></i>
                                    Check for existing unit numbers before
                                    adding new ones
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-check text-green-500 mr-2 mt-0.5 text-xs"></i>
                                    Each submeter should have a unique number
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-check text-green-500 mr-2 mt-0.5 text-xs"></i>
                                    Add tenant name only when unit is occupied
                                </li>
                            </ul>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-900/50 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                <i className="fas fa-exclamation-triangle mr-1"></i>
                                All fields marked with * are required. Check for
                                duplicates before submitting.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UnitAdd;
