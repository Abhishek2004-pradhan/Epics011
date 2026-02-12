import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
    baseURL: 'http://localhost:8085/api',
});

// Helper to set the token for requests
export const setAuthToken = async () => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
