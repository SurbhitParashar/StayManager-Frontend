import API from './api';

export const listReservations = (params = {}) => API.get('/reservations', { params });
export const getReservation = (id) => API.get(`/reservations/${id}`);
export const createReservation = (data) => API.post('/reservations', data);
export const updateReservation = (id, data) => API.put(`/reservations/${id}`, data);
export const deleteReservation = (id) => API.delete(`/reservations/${id}`);
export const updateReservationFinancials = (id, data) => API.put(`/reservations/${id}/financials`, data);
export const replaceReservationPayments = (id, payments) => API.put(`/reservations/${id}/payments`, { payments });
