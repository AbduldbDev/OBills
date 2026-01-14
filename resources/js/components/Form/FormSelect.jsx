import React from "react";

const FormSelect = ({
    label,
    name,
    value,
    onChange,
    options = [],
    error = "",
    disabled = false,
    required = false,
    className = "",
    placeholder = "Select an option",
    icon = null,
    showArrow = true,
    size = "md", // sm, md, lg
    variant = "default", // default, outlined
    ...props
}) => {
    // Size classes
    const sizeClasses = {
        sm: "px-3 py-3 text-sm",
        md: "px-4 py-3",
        lg: "px-4 py-3.5 text-lg",
    };

    // Variant classes
    const variantClasses = {
        default: "bg-gray-50 dark:bg-dark-900",
        outlined: "bg-white dark:bg-dark-800",
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Label */}
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Select Container */}
            <div className="relative">
                {/* Icon */}
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className={`${icon} text-gray-400`}></i>
                    </div>
                )}

                {/* Select Field */}
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
                        w-full ${
                            sizeClasses[size]
                        } rounded-lg border appearance-none
                        ${icon ? "pl-10" : ""}
                        ${showArrow ? "pr-10" : ""}
                        ${
                            error
                                ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-dark-700 focus:ring-dark-900 dark:focus:ring-white focus:border-red-500"
                        }
                        ${variantClasses[variant]}
                        text-gray-900 dark:text-white 
                        focus:outline-none focus:ring-1 focus:border-transparent
                        transition-colors
                        ${
                            disabled
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                        }
                    `}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Dropdown Arrow */}
                {showArrow && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <i className="fas fa-chevron-down text-gray-400"></i>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-500 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1.5"></i>
                    {error}
                </p>
            )}
        </div>
    );
};

// Default props
FormSelect.defaultProps = {
    placeholder: "Select an option",
    showArrow: true,
    size: "md",
    variant: "default",
};

export default FormSelect;
