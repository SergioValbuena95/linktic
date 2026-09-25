<template>
	<q-page class="q-pa-md q-pa-sm-lg">
		<!-- Encabezado de la Página -->
		<div class="row items-center justify-between q-mb-md">
			<div>
				<h1 class="text-h5 text-weight-bold text-grey-9 q-my-none">
					Métodos de Pago
				</h1>
			</div>
			<div>
				<q-btn
					color="primary"
					icon="add"
					no-caps
					unelevated
					class="text-weight-bold shadow-1"
					@click="openCreateModal"
				>
					<q-tooltip>Agregar Método</q-tooltip>
				</q-btn>
			</div>
		</div>

		<Filter :fields="filterFields" @search="onSearch" @reset="onReset" />

		<q-card class="shadow-1 table-card">
			<q-table
				flat
				:rows="paymentStore.items"
				:columns="columns"
				row-key="id"
				:loading="paymentStore.isLoading"
				:pagination="{ rowsPerPage: 10 }"
				:rows-per-page-options="[10, 20, 50, 100]"
				no-data-label="No se encontraron métodos de pago registrados"
			>
				<!-- Columna: Nombre -->
				<template #body-cell-name="props">
					<q-td :props="props">
						<div class="text-weight-bold text-grey-9">{{ props.row.name }}</div>
						<div v-if="props.row.description" class="text-caption text-grey-6 text-italic">
							{{ props.row.description }}
						</div>
					</q-td>
				</template>

				<!-- Columna: Tipo -->
				<template #body-cell-type="props">
					<q-td :props="props">
						<q-chip
							dense
							size="sm"
							color="blue-1"
							text-color="primary"
							class="text-weight-medium q-px-sm"
						>
							{{ getTypeLabel(props.row.type) }}
						</q-chip>
					</q-td>
				</template>

				<!-- Columna: Estado (Switch reactivo inmediato) -->
				<template #body-cell-status="props">
					<q-td :props="props">
						<div class="row items-center no-wrap">
							<q-toggle
								:model-value="props.row.status === 'ACTIVE'"
								color="positive"
								dense
								@update:model-value="(val) => onToggleStatus(props.row, val)"
							/>
						</div>
					</q-td>
				</template>

				<!-- Columna: Fecha de Creación -->
				<template #body-cell-created_at="props">
					<q-td :props="props" class="text-grey-8">
						{{ formatDate(props.row.created_at) }}
					</q-td>
				</template>

				<template #body-cell-actions="props">
					<q-td :props="props" align="right">
						<q-btn
							flat
							round
							dense
							size="sm"
							icon="edit"
							color="primary"
							class="q-mr-xs"
							@click="openEditModal(props.row)"
						>
							<q-tooltip>Editar</q-tooltip>
						</q-btn>
						<q-btn
							flat
							round
							dense
							size="sm"
							icon="delete"
							color="negative"
							@click="confirmDelete(props.row)"
						>
							<q-tooltip>Eliminar</q-tooltip>
						</q-btn>
					</q-td>
				</template>
			</q-table>
		</q-card>

		<PaymentModal
			v-model="modalOpen"
			:item-to-edit="selectedItem"
		/>
	</q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Dialog, type QTableColumn } from 'quasar';
import Filter from '@/components/filter.vue';
import PaymentModal from '@/components/payment-modal.vue';
import { usePaymentMethodsStore } from '@/stores/payment.store';
import type {
	FilterFieldConfig,
	FilterValues,
	PaymentMethodType,
	PaymentMethod,
} from '@/models';

const paymentStore = usePaymentMethodsStore();

const modalOpen = ref(false);
const selectedItem = ref<PaymentMethod | null>(null);

function openCreateModal() {
	selectedItem.value = null;
	modalOpen.value = true;
}

function openEditModal(item: PaymentMethod) {
	selectedItem.value = item;
	modalOpen.value = true;
}

function confirmDelete(item: PaymentMethod) {
	Dialog.create({
		title: 'Confirmar eliminación',
		message: `¿seguro desea eliminar el método de pago "${item.name}"?`,
		cancel: {
			flat: true,
			label: 'Cancelar',
			color: 'grey-7',
			noCaps: true,
		},
		ok: {
			unelevated: true,
			label: 'Eliminar',
			color: 'negative',
			noCaps: true,
		},
		persistent: true,
	}).onOk(() => {
		void paymentStore.deletePaymentMethod(item.id);
	});
}

const columns: QTableColumn[] = [
	{ name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
	{ name: 'type', label: 'Tipo', field: 'type', align: 'left', sortable: true },
	{ name: 'status', label: 'Estado', field: 'status', align: 'left', sortable: true },
	{ name: 'created_at', label: 'Fecha de creación', field: 'created_at', align: 'left', sortable: true },
	{ name: 'actions', label: 'Acciones', field: 'actions', align: 'right' },
];

const filterFields: FilterFieldConfig[] = [
	{
		key: 'name',
		label: 'Nombre del método',
		type: 'text',
		placeholder: 'Buscar por nombre...',
		icon: 'search',
		colClass: 'col-12 col-sm-4',
	},
	{
		key: 'type',
		label: 'Tipo de método',
		type: 'select',
		placeholder: 'Todos los tipos',
		icon: 'category',
		colClass: 'col-12 col-sm-4',
		options: [
			{ label: 'Tarjeta de Crédito', value: 'CREDIT_CARD' },
			{ label: 'Tarjeta de Débito', value: 'DEBIT_CARD' },
			{ label: 'Transferencia Bancaria', value: 'BANK_TRANSFER' },
			{ label: 'Billetera Digital', value: 'DIGITAL_WALLET' },
			{ label: 'PSE', value: 'PSE' },
			{ label: 'Efectivo', value: 'CASH' },
		],
	},
	{
		key: 'status',
		label: 'Estado',
		type: 'select',
		placeholder: 'Todos los estados',
		icon: 'toggle_on',
		colClass: 'col-12 col-sm-4',
		options: [
			{ label: 'Activo', value: 'ACTIVE' },
			{ label: 'Inactivo', value: 'INACTIVE' },
		],
	},
];

function getTypeLabel(type: PaymentMethodType): string {
	const map: Record<PaymentMethodType, string> = {
		CREDIT_CARD: 'Tarjeta de Crédito',
		DEBIT_CARD: 'Tarjeta de Débito',
		BANK_TRANSFER: 'Transferencia Bancaria',
		DIGITAL_WALLET: 'Billetera Digital',
		PSE: 'PSE',
		CASH: 'Efectivo',
	};
	return map[type] || type;
}



function formatDate(isoDate: string): string {
	if (!isoDate) return '-';
	const date = new Date(isoDate);
	return new Intl.DateTimeFormat('es-CO', {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}

function onSearch(values: FilterValues) {
	void paymentStore.applyFilters(values);
}

function onReset() {
	void paymentStore.resetFilters();
}

async function onToggleStatus(row: PaymentMethod, val: boolean) {
	const prevStatus = row.status;
	row.status = val ? 'ACTIVE' : 'INACTIVE';
	const success = await paymentStore.toggleStatus(row.id);
	if (!success) {
		row.status = prevStatus;
	}
}

onMounted(() => {
	void paymentStore.fetchPaymentMethods();
});
</script>

<style scoped>
.table-card {
	border-radius: 8px;
	border: 1px solid #e0e0e0;
}
</style>
