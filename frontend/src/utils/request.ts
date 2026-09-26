import axios from 'axios';

export const request = axios.create({
  baseURL: '/api',
  timeout: 8000
});

request.interceptors.response.use(
  (response) => response.data.data ?? response.data,
  (error) => Promise.reject(new Error(error.response?.data?.message ?? '接口请求失败'))
);
