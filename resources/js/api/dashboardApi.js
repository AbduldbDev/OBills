import axios from "axios";
import api from "./axios";

export const DashboardApi = {
    getDashboard: async () => {
        try {
            const response = await api.get(`/dashboard`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
