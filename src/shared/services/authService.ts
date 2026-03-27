import axiosInstance from './axiosConfig';

interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: string;
        username: string;
        email: string;
        nombreCompleto?: string;
        iniciales?: string;
    };
    userId?: string;
}

interface JWTPayload {
    sub: string;
    username: string;
    email: string;
    exp: number;
    iat: number;
    userId?: string;
}

class AuthService {
    private readonly TOKEN_KEY = 'token';
    private readonly USER_KEY = 'user';
    private readonly USER_ID_KEY = 'userId';

    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            console.log('[AuthService] Attempting login...');
            const response = await axiosInstance.post('/auth/login', credentials);
            const data = response.data;

            if (data.success && data.token) {
                this.setToken(data.token);

                const userId = data.userId || data.user?.id || this.extractUserIdFromToken(data.token);
                const validUserId = this.isValidUUID(userId) ? userId : this.generateUUID();

                if (validUserId) this.setUserId(validUserId);

                const userData = {
                    id: validUserId,
                    username: data.user?.username || credentials.username,
                    email: data.user?.email || '',
                    nombreCompleto: data.user?.nombreCompleto || '',
                    iniciales: data.user?.iniciales || ''
                };

                this.setUser(userData);
                data.user = userData;

                console.log('[AuthService] Login successful, user data stored:', userData);
            }

            return data;
        } catch (error: any) {
            console.error('[AuthService] Login error:', error);

            if (error.response) {
                const { status, data } = error.response;
                if (status === 401) throw new Error(data?.message || 'Credenciales inválidas');
                else if (status === 429) throw new Error('Demasiados intentos. Por favor, espere unos minutos.');
                else if (status >= 500) throw new Error('Error del servidor. Intente nuevamente más tarde.');
                throw new Error(data?.message || 'Error en la autenticación');
            } else if (error.request) throw new Error('Error de conexión. Verifique su red.');
            else throw new Error(error.message || 'Error desconocido');
        }
    }

    getToken(): string | null {
        try {
            return localStorage.getItem(this.TOKEN_KEY);
        } catch {
            return null;
        }
    }

    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getUserId(): string | null {
        return localStorage.getItem(this.USER_ID_KEY);
    }

    private setUserId(userId: string): void {
        localStorage.setItem(this.USER_ID_KEY, userId);
    }

    getUser(): any | null {
        try {
            const userStr = localStorage.getItem(this.USER_KEY);
            return userStr ? JSON.parse(userStr) : null;
        } catch {
            return null;
        }
    }

    private setUser(user: any): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    isAuthenticated(): boolean {
        try {
            const token = this.getToken();
            if (!token || token.trim() === '') return false;

            const parts = token.split('.');
            if (parts.length !== 3) {
                this.logout();
                return false;
            }

            const payload = this.decodeToken(token);
            if (!payload) {
                this.logout();
                return false;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const expirationTime = payload.exp;
            if (!expirationTime) return true;

            if (expirationTime - currentTime <= 0) {
                this.logout();
                return false;
            }

            return true;
        } catch {
            this.logout();
            return false;
        }
    }

    private decodeToken(token: string): JWTPayload | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    }

    private extractUserIdFromToken(token: string): string | null {
        const payload = this.decodeToken(token);
        return payload?.userId || payload?.sub || null;
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_ID_KEY);
        localStorage.removeItem(this.USER_KEY);
        console.log('[AuthService] Logged out');
    }

    private isValidUUID(uuid: string | null): boolean {
        if (!uuid) return false;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export default new AuthService();