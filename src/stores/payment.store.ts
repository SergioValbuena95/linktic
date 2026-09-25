import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import type {
	PaymentMethod,
	PaymentMethodFilters,
	PaymentMethodsState,
	CreatePaymentMethodItem,
	UpdatePaymentMethodItem,
} from '@/models';
import { MockApiService } from '@/services/mock';

export const usePaymentMethodsStore = defineStore('payment-methods', {
	state: (): PaymentMethodsState => ({
		items: [],
		isLoading: false,
		isSubmitting: false,
		error: null,
		filters: {},
	}),

	getters: {
		paymentMethods: (state): PaymentMethod[] => state.items,
		totalCount: (state): number => state.items.length,
		activeCount: (state): number =>
			state.items.filter((item) => item.status === 'ACTIVE').length,
		inactiveCount: (state): number =>
			state.items.filter((item) => item.status === 'INACTIVE').length,
		hasActiveFilters: (state): boolean =>
			Boolean(state.filters.name || state.filters.type || state.filters.status),
	},

	actions: {
		async fetchPaymentMethods(filters?: PaymentMethodFilters): Promise<void> {
			this.isLoading = true;
			this.error = null;

			if (filters) {
				this.filters = { ...filters };
			}

			try {
				const response = await MockApiService.getPaymentMethods(this.filters);
				this.items = response.data;
			} catch (err: unknown) {
				const errorObj = err as { message?: string };
				const message = errorObj.message || 'Error al cargar los métodos de pago.';
				this.error = message;

				Notify.create({
					type: 'negative',
					message,
					position: 'top-right',
					timeout: 3500,
				});
			} finally {
				this.isLoading = false;
			}
		},

		async applyFilters(filters: PaymentMethodFilters): Promise<void> {
			this.filters = { ...filters };
			await this.fetchPaymentMethods();
		},

		async resetFilters(): Promise<void> {
			this.filters = {};
			await this.fetchPaymentMethods();
		},

		async createPaymentMethod(data: CreatePaymentMethodItem): Promise<boolean> {
			this.isSubmitting = true;
			this.error = null;

			try {
				const response = await MockApiService.createPaymentMethod(data);
				// Inserción reactiva inmediata al inicio de la lista
				this.items = [response.data, ...this.items];

				Notify.create({
					type: 'positive',
					message: response.message || 'Método de pago registrado con éxito.',
					position: 'top-right',
					timeout: 3000,
					icon: 'check_circle',
				});

				return true;
			} catch (err: unknown) {
				const errorObj = err as { message?: string };
				const message = errorObj.message || 'Error al crear el método de pago.';
				this.error = message;

				Notify.create({
					type: 'negative',
					message,
					position: 'top-right',
					timeout: 4000,
					icon: 'warning',
				});

				return false;
			} finally {
				this.isSubmitting = false;
			}
		},

		async updatePaymentMethod(
			id: string,
			data: UpdatePaymentMethodItem
		): Promise<boolean> {
			this.isSubmitting = true;
			this.error = null;

			try {
				const response = await MockApiService.updatePaymentMethod(id, data);
				const index = this.items.findIndex((item) => item.id === id);

				if (index !== -1) {
					this.items[index] = response.data;
				}

				Notify.create({
					type: 'positive',
					message: response.message || 'Método de pago actualizado con éxito.',
					position: 'top-right',
					timeout: 3000,
					icon: 'check_circle',
				});

				return true;
			} catch (err: unknown) {
				const errorObj = err as { message?: string };
				const message = errorObj.message || 'Error al actualizar el método de pago.';
				this.error = message;

				Notify.create({
					type: 'negative',
					message,
					position: 'top-right',
					timeout: 4000,
					icon: 'warning',
				});

				return false;
			} finally {
				this.isSubmitting = false;
			}
		},

		async toggleStatus(id: string): Promise<boolean> {
			const index = this.items.findIndex((item) => String(item.id) === String(id));
			const target = this.items[index];
			if (!target) return false;

			const previousStatus = target.status;
			const nextStatus = previousStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
			target.status = nextStatus;
			this.items[index] = { ...target };

			try {
				const response = await MockApiService.toggleStatus(id);
				this.items[index] = { ...response.data };

				Notify.create({
					type: 'positive',
					message: 'Estado actualizado',
					position: 'top-right',
					timeout: 2000,
				});

				return true;
			} catch (err: unknown) {
				target.status = previousStatus;
				this.items[index] = { ...target };
				const errorObj = err as { message?: string };
				const message = errorObj.message || 'No se pudo cambiar el estado.';

				Notify.create({
					type: 'negative',
					message,
					position: 'top-right',
					timeout: 3500,
				});

				return false;
			}
		},

		async deletePaymentMethod(id: string): Promise<boolean> {
			this.isLoading = true;
			this.error = null;

			try {
				const response = await MockApiService.deletePaymentMethod(id);
				this.items = this.items.filter((item) => String(item.id) !== String(id));

				Notify.create({
					type: 'positive',
					message: response.message || 'Método de pago eliminado.',
					position: 'top-right',
					timeout: 3000,
					icon: 'delete',
				});

				return true;
			} catch (err: unknown) {
				const errorObj = err as { message?: string };
				const message = errorObj.message || 'Error al eliminar el método de pago.';
				this.error = message;

				Notify.create({
					type: 'negative',
					message,
					position: 'top-right',
					timeout: 4000,
				});

				return false;
			} finally {
				this.isLoading = false;
			}
		},
	},
});
