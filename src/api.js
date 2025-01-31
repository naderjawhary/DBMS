import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const fetchSplitCounts = async (measurementId, threshold, subset) => {
    console.log("Sending API request with:", { measurementId, threshold, subset });

    try {
        const response = await api.post('/athletes/split', { measurementId, threshold, subset });
        return response.data;
    } catch (error) {
        console.error('Error fetching split counts:', error);
        throw error;
    }
};

export default api;