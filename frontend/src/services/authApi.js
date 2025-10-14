import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Create Axios instance
const authApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Attach token automatically
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Auth methods
export const authMethods = {
    register: async (email, password) => {
        const response = await authApi.post('/auth/register', { email, password })
        return response.data
    },

    login: async (email, password) => {
        const response = await authApi.post('/auth/login', { email, password })
        return response.data
    },
}

export default authApi