import axios from 'axios';

const TOKEN_KEY = 'hr_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export const request = axios.create({
  baseURL: '/api',
  timeout: 8000
});

request.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

request.interceptors.response.use(
  (response) => response.data.data ?? response.data,
  (error) => {
    const status = error.response?.status ?? 0;
    const message = error.response?.data?.message ?? '接口请求失败';
    return Promise.reject(new ApiError(status, message));
  }
);
