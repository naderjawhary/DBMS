import axios from 'axios';


export const fetchSplitCounts = async (measurementId, threshold, subset) => {
    console.log("Sending API request with:", { measurementId, threshold, subset });

    const response = await fetch('/api/athletes/split', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ measurementId, threshold, subset })
    });

    if (!response.ok) throw new Error('Failed to fetch split counts');

    return response.json();
};




const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export default api;