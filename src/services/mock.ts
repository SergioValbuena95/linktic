import type {
	User,
	LoginCredentials,
	AuthSession,
	PaymentMethod,
	PaymentMethodFilters,
	CreatePaymentMethodItem,
	UpdatePaymentMethodItem,
	ApiResponse,
} from '@/models';

export const mock_user: User = {
	id: '1',
	username: 'sergio',
	name: 'Sergio Valbuena',
	email: 'sergio.valbuenaj@gmail.com',
	role: 'admin',
	password: 'linktic2026',
	created_at: '2026-09-24T08:00:00.000Z',
};

const initial_payment_methods: PaymentMethod[] = [
	{
		id: '1',
		name: 'Tarjeta de credito',
		type: 'CREDIT_CARD',
		description: 'Tarjeta de crédito corporativa',
		status: 'ACTIVE',
		created_at: '2026-09-24T08:00:00.000Z',
	},
	{
		id: '2',
		name: 'Tarjeta de debito',
		type: 'DEBIT_CARD',
		description: 'Tarjeta de débito empresarial',
		status: 'ACTIVE',
		created_at: '2026-09-24T08:00:00.000Z',
	},
	{
		id: '3',
		name: 'Transferencia bancaria',
		type: 'BANK_TRANSFER',
		description: 'Transferencias vía ACH / Bancos nacionales',
		status: 'ACTIVE',
		created_at: '2026-09-24T08:00:00.000Z',
	},
	{
		id: '4',
		name: 'Billetera digital',
		type: 'DIGITAL_WALLET',
		description: 'Nequi / Daviplata corporativo',
		status: 'INACTIVE',
		created_at: '2026-09-24T08:00:00.000Z',
	},
	{
		id: '5',
		name: 'PSE',
		type: 'PSE',
		description: 'Pagos en línea con débito a cuentas',
		status: 'INACTIVE',
		created_at: '2026-09-24T08:00:00.000Z',
	},
	{
		id: '6',
		name: 'Efectivo',
		type: 'CASH',
		description: 'Caja y ventanilla física',
		status: 'INACTIVE',
		created_at: '2026-09-24T08:00:00.000Z',
	},
];

const simulateLatency = (delayMs: number = 500): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, delayMs));
};

const generateId = (): string => {
	return `id_${Date.now()}`;
};

const storage_key = 'payment_methods';

const getFromStorage = (): PaymentMethod[] => {
	try {
		const data = sessionStorage.getItem(storage_key);
		if (data) {
			const parsed = JSON.parse(data);
			if (Array.isArray(parsed)) return parsed;
		}
	} catch (error) {
		console.error('Error al leer de sessionStorage:', error);
	}
  return [...initial_payment_methods];
};

const saveToStorage = (items: PaymentMethod[]): void => {
	try {
		sessionStorage.setItem(storage_key, JSON.stringify(items));
	} catch (error) {
		console.error('Error al guardar en sessionStorage:', error);
	}
};

let database: PaymentMethod[] = getFromStorage();

export class ApiMockError extends Error {
	statusCode: number;
	success: boolean;
	constructor(message: string, statusCode: number = 400) {
		super(message);
		this.name = 'ApiMockError';
		this.statusCode = statusCode;
		this.success = false;
	}
}

export const MockApiService = {
	async login(credentials: LoginCredentials): Promise<ApiResponse<AuthSession>> {
		await simulateLatency(800);

		const { username, password } = credentials;

		if (username === mock_user.username && password === mock_user.password) {
			const session: AuthSession = {
				user: mock_user,
				token: 'mock-token-123',
				expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
			};

			return {
				success: true,
				data: session,
				message: 'Inicio de sesión correcto.',
				statusCode: 200,
			};
		}

		// throw {
		// 	success: false,
		// 	statusCode: 401,
		// 	message: 'Credenciales inválidas.',
		// };

		throw new ApiMockError('Credenciales invalidas', 401);
	},

	async getPaymentMethods(filters?: PaymentMethodFilters): Promise<ApiResponse<PaymentMethod[]>> {
		await simulateLatency(400);
		let result = [...database];

		if (filters) {
			if (filters.name && filters.name.trim() !== '') {
				const query = filters.name.toLowerCase().trim();
				result = result.filter((item) => item.name.toLowerCase().includes(query));
			}
			if (filters.type) {
				result = result.filter((item) => item.type === filters.type);
			}
			if (filters.status) {
				result = result.filter((item) => item.status === filters.status);
			}
		}

		return {
			success: true,
			data: result,
			statusCode: 200,
		};
	},

	async getPaymentMethodById(id: string): Promise<ApiResponse<PaymentMethod>> {
		await simulateLatency(300);
		const found = database.find((item) => String(item.id) === String(id));

		if (!found) {
			throw new ApiMockError('Método de pago no encontrado', 404);
		}

		return {
			success: true,
			data: { ...found },
			statusCode: 200,
		};
	},

	async createPaymentMethod(data: CreatePaymentMethodItem): Promise<ApiResponse<PaymentMethod>> {
		await simulateLatency(500);

		const exists = database.some(
			(item) => item.name.trim().toLowerCase() === data.name.trim().toLowerCase()
		);

		if (exists) {
			throw new ApiMockError(
				`Ya existe un método de pago con el nombre "${data.name}".`, 
				409
			);
		}

		const newPaymentMethod: PaymentMethod = {
			id: generateId(),
			name: data.name.trim(),
			type: data.type,
			status: data.status ?? 'ACTIVE',
			created_at: new Date().toISOString(),
			...(data.description?.trim() ? { description: data.description.trim() } : {}),
		};

		database = [newPaymentMethod, ...database];
		saveToStorage(database);

		return {
			success: true,
			data: newPaymentMethod,
			message: 'Método de pago creado exitosamente.',
			statusCode: 201,
		};
	},

	async updatePaymentMethod(
		id: string,
		data: UpdatePaymentMethodItem
	): Promise<ApiResponse<PaymentMethod>> {
		await simulateLatency(500);
		const index = database.findIndex((item) => String(item.id) === String(id));
		const current = database[index];

		if (index === -1 || !current) {
			// throw {
			// 	success: false,
			// 	statusCode: 404,
			// 	message: `Método de pago con ID ${id} no encontrado.`,
			// };
			throw new ApiMockError(
				`Método de pago con ID ${id} no encontrado.`,
				404
			);
		}

		if (data.name) {
			const duplicate = database.some(
			(item) =>
				item.id !== id &&
				item.name.trim().toLowerCase() === data.name!.trim().toLowerCase()
			);
			if (duplicate) {
				// throw {
				// 	success: false,
				// 	statusCode: 409,
				// 	message: `Ya existe otro método de pago con el nombre "${data.name}".`,
				// };
				throw new ApiMockError(
					`Ya existe otro método de pago con el nombre "${data.name}".`,
					409
				);
			}
		}

		const updated: PaymentMethod = {
			...current,
			...(data.name ? { name: data.name.trim() } : {}),
			...(data.type ? { type: data.type } : {}),
			...(data.description !== undefined ? { description: data.description.trim() } : {}),
			...(data.status ? { status: data.status } : {}),
			updated_at: new Date().toISOString(),
		};

		database[index] = updated;
		saveToStorage(database);

		return {
			success: true,
			data: updated,
			message: 'Método de pago actualizado exitosamente.',
			statusCode: 200,
		};
	},

	async toggleStatus(id: string): Promise<ApiResponse<PaymentMethod>> {
		await simulateLatency(250);
		const index = database.findIndex((item) => String(item.id) === String(id));
		const current = database[index];

		if (index === -1 || !current) {
			throw new ApiMockError(
				`Método de pago no encontrado.`,
				404
			);
		}

		const newStatus = current.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
		const updated: PaymentMethod = {
			...current,
			status: newStatus,
			updated_at: new Date().toISOString(),
		};

		database[index] = updated;
		saveToStorage(database);

		return {
			success: true,
			data: updated,
			message: `Método de pago marcado como ${newStatus === 'ACTIVE' ? 'Activo' : 'Inactivo'}.`,
			statusCode: 200,
		};
	},

	async deletePaymentMethod(id: string): Promise<ApiResponse<{ id: string }>> {
		await simulateLatency(400);
		const index = database.findIndex((item) => String(item.id) === String(id));

		if (index === -1) {
			throw new ApiMockError(
				`Método de pago no encontrado.`,
				404
			);
		}

		database.splice(index, 1);
		saveToStorage(database);

		return {
			success: true,
			data: { id },
			message: 'Método de pago eliminado exitosamente.',
			statusCode: 200,
		};
	},
};