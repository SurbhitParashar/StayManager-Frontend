import API from './api';

export const listPropertyEvents = (params = {}) => API.get('/property-events', { params });
export const createPropertyEvent = (data) => API.post('/property-events', data);
export const deletePropertyEvent = (id) => API.delete(`/property-events/${id}`);
export const updateAgreement = (reservationId, data) => API.put(`/reservations/${reservationId}/agreement`, data);
export const updateReview = (reservationId, data) => API.put(`/reservations/${reservationId}/review`, data);
export const listContacts = (params = {}) => API.get('/contacts', { params });
export const createContact = (data) => API.post('/contacts', data);
export const linkPropertyContact = (propertyId, data) => API.post(`/properties/${propertyId}/contacts`, data);
