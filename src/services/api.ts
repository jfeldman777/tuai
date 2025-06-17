import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Добавляем токен к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Типы данных
export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'sender' | 'client';
  personalityMap?: Record<string, number>;
}

export interface Task {
  _id: string;
  name: string;
  description?: string;
  map: Record<string, number>;
  owner: User;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Comparison {
  _id: string;
  task: Task;
  user: User;
  results: Array<{
    profession: string;
    pairs: number[];
  }>;
  status: 'pending' | 'reviewed' | 'contacted';
  createdAt: string;
  updatedAt: string;
}

// Аутентификация
export const auth = {
  register: async (data: { email: string; password: string; name: string; role: 'sender' | 'client' }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updatePersonalityMap: async (map: Record<string, number>) => {
    const response = await api.put('/auth/personality-map', { map });
    return response.data;
  }
};

// Задачи
export const tasks = {
  create: async (data: { name: string; description?: string; map: Record<string, number> }) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  getMyTasks: async () => {
    const response = await api.get('/tasks/my-tasks');
    return response.data;
  },

  getActiveTasks: async () => {
    const response = await api.get('/tasks/active');
    return response.data;
  },

  getTask: async (id: string) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  updateTask: async (id: string, data: { name?: string; description?: string; map?: Record<string, number>; status?: 'active' | 'archived' }) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

// Сравнения
export const comparisons = {
  create: async (data: { taskId: string; results: Array<{ profession: string; pairs: number[] }> }) => {
    const response = await api.post('/comparisons', data);
    return response.data;
  },

  getTaskComparisons: async (taskId: string) => {
    const response = await api.get(`/comparisons/task/${taskId}`);
    return response.data;
  },

  getMyComparisons: async () => {
    const response = await api.get('/comparisons/my-comparisons');
    return response.data;
  },

  updateStatus: async (id: string, status: 'pending' | 'reviewed' | 'contacted') => {
    const response = await api.put(`/comparisons/${id}/status`, { status });
    return response.data;
  }
};

export default api; 