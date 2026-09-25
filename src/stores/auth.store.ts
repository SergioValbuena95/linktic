import {defineStore} from 'pinia';
import { Notify } from 'quasar';
import type {
    User,
    LoginCredentials,
    AuthState
} from '@/models';
import { MockApiService } from '@/services/mock';

const storage_key = 'auth_session';

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    }),

    getters: {
        currentUser: (state): User | null => state.user,
        isLoggedIn: (state): boolean => state.isAuthenticated && Boolean(state.token),
    },

    actions: {
        initSession(): void {
            try {
                const rawData = sessionStorage.getItem(storage_key)
                if(rawData){
                    const storedData = JSON.parse(rawData);
                    if(storedData.token && storedData.user){
                        this.user = storedData.user;
                        this.token = storedData.token;
                        this.isAuthenticated = true;
                    }
                }
            } catch (error) {
                console.log("🚀 ~ error:", error)
                this.logout(false);
            }
        },

        async login(credentials: LoginCredentials): Promise<boolean> {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await MockApiService.login(credentials);
                const { user, token } = response.data;

                this.user = user;
                this.token = token;
                this.isAuthenticated = true;

                sessionStorage.setItem(
                    storage_key,
                    JSON.stringify({
                        user,
                        token,
                        timestamp: Date.now()
                    })
                );

                Notify.create({
                    type: 'positive',
                    message: 'Inicio de sesión exitoso',
                    position: 'top-right',
                    timeout: 2500,
                    icon: 'check_circle',
                });

                return true;
            } catch (err: unknown) {
                const errorObj = err as { message: string }
                const message = errorObj?.message || 'Error al iniciar sesión';

                this.error = message;

                Notify.create({
                    type: 'negative',
                    message,
                    position: 'top-right',
                    timeout: 2500,
                    icon: 'error',
                });

                return false;
            } finally {
                this.isLoading = false;
            }

        },

        logout(notify: boolean = true): void {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            this.error = null;
            this.isLoading = false;

            sessionStorage.removeItem(storage_key);

            if(notify){
                Notify.create({
                    type: 'info',
                    message: 'Has cerrado sesion',
                    position: 'top-right',
                    timeout: 2500,
                })
            }
        }
    }
});
