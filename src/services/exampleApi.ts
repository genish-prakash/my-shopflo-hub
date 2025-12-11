import { apiClient } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return await apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    apiClient.clearAuthToken();
  },

  getProfile: async (): Promise<User> => {
    return await apiClient.get<User>('/auth/profile');
  },
};

export interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
}

export const brandsApi = {
  getAll: async (): Promise<Brand[]> => {
    return await apiClient.get<Brand[]>('/brands');
  },

  getById: async (id: string): Promise<Brand> => {
    return await apiClient.get<Brand>(`/brands/${id}`);
  },

  create: async (brand: Omit<Brand, 'id'>): Promise<Brand> => {
    return await apiClient.post<Brand>('/brands', brand);
  },

  update: async (id: string, brand: Partial<Brand>): Promise<Brand> => {
    return await apiClient.put<Brand>(`/brands/${id}`, brand);
  },

  delete: async (id: string): Promise<void> => {
    return await apiClient.delete(`/brands/${id}`);
  },
};

export interface Order {
  id: string;
  userId: string;
  status: string;
  items: any[];
  total: number;
  createdAt: string;
}

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    return await apiClient.get<Order[]>('/orders');
  },

  getById: async (id: string): Promise<Order> => {
    return await apiClient.get<Order>(`/orders/${id}`);
  },

  create: async (order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    return await apiClient.post<Order>('/orders', order);
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    return await apiClient.patch<Order>(`/orders/${id}/status`, { status });
  },
};