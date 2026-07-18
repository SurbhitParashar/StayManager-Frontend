import API from './api';

export const listGuests = (params = {}) => API.get('/guests', { params });
export const createGuest = (data) => API.post('/guests', data);
export const updateGuest = (id, data) => API.put(`/guests/${id}`, data);
export const deleteGuest = (id) => API.delete(`/guests/${id}`);
