/**
 * Dashboard API Integration
 * JavaScript functions to communicate with the PHP backend API
 */

class DashboardAPI {
    constructor() {
        this.baseURL = '/api';
        this.token = null;
    }

    // Authentication methods
    async login(username, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            
            if (data.success) {
                this.token = data.token;
                localStorage.setItem('authToken', data.token);
                return { success: true, user: data.data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async logout() {
        try {
            await fetch(`${this.baseURL}/auth/logout`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });

            this.token = null;
            localStorage.removeItem('authToken');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async checkAuth() {
        try {
            const response = await fetch(`${this.baseURL}/auth/status`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Auth check error:', error);
            return { success: false, logged_in: false };
        }
    }

    async register(userData) {
        try {
            const response = await fetch(`${this.baseURL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    // Dashboard data methods
    async getOverviewStats() {
        try {
            const response = await fetch(`${this.baseURL}/dashboard/overview`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get overview stats error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async getSalesChartData(period = 'week') {
        try {
            const response = await fetch(`${this.baseURL}/dashboard/sales-chart?period=${period}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get sales chart data error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async getPerformanceMetrics() {
        try {
            const response = await fetch(`${this.baseURL}/dashboard/performance`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get performance metrics error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async getCustomerDemographics() {
        try {
            const response = await fetch(`${this.baseURL}/dashboard/demographics`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get customer demographics error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async getTopProducts() {
        try {
            const response = await fetch(`${this.baseURL}/dashboard/products`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get top products error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async getRecentOrders(limit = 10) {
        try {
            const response = await fetch(`${this.baseURL}/dashboard/orders?limit=${limit}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get recent orders error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async getCustomerSatisfaction() {
        try {
            const response = await fetch(`${this.baseURL}/dashboard/satisfaction`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get customer satisfaction error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async getFinancialPerformance() {
        try {
            const response = await fetch(`${this.baseURL}/dashboard/financial`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get financial performance error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async getMarketingAnalytics() {
        try {
            const response = await fetch(`${this.baseURL}/dashboard/marketing`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get marketing analytics error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async getGeographicPerformance() {
        try {
            const response = await fetch(`${this.baseURL}/dashboard/geographic`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get geographic performance error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async getInventoryStatus() {
        try {
            const response = await fetch(`${this.baseURL}/dashboard/inventory`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get inventory status error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async getRecentActivity(limit = 20) {
        try {
            const response = await fetch(`${this.baseURL}/dashboard/activity?limit=${limit}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get recent activity error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async getQuickActions() {
        try {
            const response = await fetch(`${this.baseURL}/dashboard/actions`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get quick actions error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    // Utility methods
    getAuthHeaders() {
        const token = this.token || localStorage.getItem('authToken');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    getToken() {
        return this.token || localStorage.getItem('authToken');
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }
}

// Initialize API instance
const api = new DashboardAPI();
