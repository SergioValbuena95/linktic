import type { Router } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

export function setupNavigationGuards(router: Router): void {
	router.beforeEach((to, _from, next) => {
		const authStore = useAuthStore();

		if (!authStore.isLoggedIn) {
			authStore.initSession();
		}

		const isLoginPage = to.path === '/login';

		if (!authStore.isLoggedIn && !isLoginPage) {
			next({ path: '/login' });
		} else if (authStore.isLoggedIn && isLoginPage) {
			next({ path: '/' });
		} else {
			next();
		}
	});
}
