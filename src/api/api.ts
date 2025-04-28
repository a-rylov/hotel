import type { RoomFilters } from '@/types/models';
import axios from 'axios';
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use(config => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const refreshToken = Cookies.get('refresh_token');
    
    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;
      
      try {
        if (!refreshPromise) {
          refreshPromise = api.post('/auth/refresh', { refresh_token: refreshToken })
            .then(response => {
              Cookies.set('auth_token', response.data.access_token);
              return response.data.access_token;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }
        
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Если refresh не удался, очищаем куки и перенаправляем на логин
        Cookies.remove('auth_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Добавим функцию для периодического обновления токена
function startTokenRefresh() {
  setInterval(async () => {
    const refreshToken = Cookies.get('refresh_token');
    if (refreshToken) {
      try {
        const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
        Cookies.set('auth_token', response.data.access_token);
      } catch (error) {
        Cookies.remove('auth_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
      }
    }
  }, 10000); // Обновляем каждые 10 секунд
}

// Запускаем обновление токена при загрузке
startTokenRefresh();

export default {
  async getRooms(filters?: RoomFilters) {
    const response = await api.get('/rooms', { 
      params: {
        maxPrice: filters?.maxPrice,
        minCapacity: filters?.capacity,
        bedType: filters?.bedType
      }
    })
    return response.data
  },

  async getRoom(id: number) {
    const response = await api.get(`/rooms/${id}`)
    return response.data
  },

  async getBookingsByRoom(roomId: number) {
    const response = await api.get('/bookings', {
      params: { roomId }
    })
    return response.data
  },

  async createBooking(bookingData: {
    roomId: number
    startDate: string
    endDate: string
    guests: number
    contactName: string
    contactEmail: string
  }) {
    const response = await api.post('/bookings', bookingData)
    return response.data
  },

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data?.success) {
        Cookies.set('auth_token', response.data.access_token);
        Cookies.set('refresh_token', response.data.refresh_token);
        return { success: true };
      }
      
      return { 
        success: false, 
        error: response.data?.message || 'Неверные учетные данные' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Ошибка сервера' 
      };
    }
  },

  get(url: string, params?: any) {
    return api.get(url, { params }).then(res => res.data)
  },
  
  post(url: string, data: any) {
    return api.post(url, data).then(res => res.data)
  }
}