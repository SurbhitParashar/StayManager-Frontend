import API from './api';

export const getReportKpis = (params = {}) => API.get('/reports/kpis', { params });
export const getRevenueReport = (params = {}) => API.get('/reports/revenue', { params });
export const getPropertyPerformanceReport = (params = {}) => API.get('/reports/property-performance', { params });
export const getSourceBreakdownReport = (params = {}) => API.get('/reports/source-breakdown', { params });
export const getPaymentsReport = (params = {}) => API.get('/reports/payments', { params });
