import React from "react";

const FooterStats = ({ showing, total, subText, sortInfo }) => {
    return (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-700">
            <div className="flex lg:flex-row flex-col flex-wrap   justify-between items-center space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                        {showing}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                        {total}
                    </span>{" "}
                    items
                </div>

                <div className="flex lg:flex-row flex-col justify-center items-center space-x-4   space-y-2 lg:space-y-0">
                    {subText && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                            <i className="fas fa-info-circle mr-1"></i>
                            {subText}
                        </div>
                    )}

                    {sortInfo && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                            <i className="fas fa-sort mr-1"></i>
                            {sortInfo}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FooterStats;
