import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach JWT token from localStorage on every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('sf_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getTasks = (params) => API.get('/tasks', { params });
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, d) => API.put(`/tasks/${id}`, d);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const getSuggest = () => API.get('/tasks/suggest');
export const getInsights = () => API.get('/insights');
export const getStreak = () => API.get('/streak');
