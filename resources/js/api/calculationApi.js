import axios from "axios";
import api from "./axios";

export const CalculationApi = {
    // Get all bills receipts
    getCalculations: async (month) => {
        try {
            const response = await api.get(`/bills-receipts/month/${month}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getCalculationDetails: async (id, month) => {
        try {
            const response = await api.get(
                `/calculation-details/${id}/${month}`
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createComputation: async (billsData) => {
        try {
            const response = await api.post("/tenant-bills", billsData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
