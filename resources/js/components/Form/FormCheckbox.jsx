import React from "react";

const FormCheckbox = ({
    label,
    name,
    checked,
    onChange,
    error = "",
    disabled = false,
    required = false,
    className = "",
    description = "",
    ...props
}) => {
    return (
        <div className={`space-y-2 ${className} pb-3`}>
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id={name}
                        name={name}
                        type="checkbox"
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}
                        className={`
                            w-4 h-4 rounded-2xl border
                            ${
                                error
                                    ? "border-red-300 dark:border-red-700 text-red-600 focus:ring-red-500"
                                    : "border-gray-300 dark:border-dark-700 text-blue-600 focus:ring-blue-500"
                            }
                            bg-gray-50 dark:bg-dark-900 
                            focus:ring-2 focus:ring-offset-0
                            ${
                                disabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                            }
                        `}
                        {...props}
                    />
                </div>

                <div className="ml-3 -mt-0.5 ">
                    {typeof label === "string" ? (
                        <label
                            htmlFor={name}
                            className={`text-sm font-medium  ${
                                disabled
                                    ? "text-gray-400 dark:text-gray-500"
                                    : "text-gray-700 dark:text-gray-300"
                            }`}
                        >
                            {label}
                            {required && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </label>
                    ) : (
                        <label
                            htmlFor={name}
                            className={`text-sm font-medium ${
                                disabled
                                    ? "text-gray-400 dark:text-gray-500"
                                    : "text-gray-700 dark:text-gray-300"
                            }`}
                        >
                            {label}
                        </label>
                    )}

                    {description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1.5"></i>
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormCheckbox;
