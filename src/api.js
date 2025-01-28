import axios from 'axios';


export const fetchSplitCounts = async (measurementId, threshold) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/athletes/split?measurementId=${measurementId}&threshold=${threshold}`
    );
    return response.data; // { leftCount: Number, rightCount: Number }
  } catch (error) {
    console.error('Error fetching split counts:', error);
    throw error;
  }
};

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export default api;