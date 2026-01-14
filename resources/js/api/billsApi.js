import axios from "axios";
import api from "./axios";

export const billsApi = {
    // Create New Bills Receipt
    createBill: async (billData) => {
        try {
            const response = await api.post("/bills-receipts", billData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getBills: async () => {
        try {
            const response = await api.get(`/bills-receipts`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getTenantBillsMonth: async (month) => {
        try {
            const response = await api.get(`/tenant-bills/month/${month}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getTenantBills: async (id) => {
        try {
            const response = await api.get(`/tenant-bills/apartment/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getReadingHistory: async (id, year) => {
        try {
            const response = await api.get(`/reading-history/${id}/${year}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getBill: async (id) => {
        try {
            const response = await api.get(`/bills-receipts/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
