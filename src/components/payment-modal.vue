<template>
	<q-dialog v-model="isOpen" persistent>
		<q-card style="min-width: 420px; max-width: 520px; width: 100%" class="q-pa-sm">
			<q-card-section class="row items-center justify-between q-pb-none">
				<div class="text-h6 text-weight-bold text-primary flex items-center">
					{{
						isEditMode
							? 'Editar Método de Pago'
							: 'Nuevo Método de Pago'
					}}
				</div>
				<q-btn v-close-popup icon="close" flat round dense />
			</q-card-section>

			<q-form ref="formRef" @submit.prevent="handleSubmit">
				<q-card-section class="q-gutter-y-md q-pt-md">
					<q-input
						v-model="form.name"
						outlined
						dense
						label="Nombre del método *"
						placeholder="Ej: Tarjeta Débito Visa"
						:rules="[
							(val) => (val && val.trim().length > 0) || 'El nombre es obligatorio',
							(val) => val.trim().length >= 3 || 'Debe tener al menos 3 caracteres',
						]"
						lazy-rules
						:disable="paymentStore.isSubmitting"
					/>

					<q-select
						v-model="form.type"
						outlined
						dense
						emit-value
						map-options
						label="Tipo de método *"
						placeholder="Selecciona un tipo"
						:options="typeOptions"
						:rules="[(val) => Boolean(val) || 'El tipo de método es obligatorio']"
						lazy-rules
						:disable="paymentStore.isSubmitting"
					/>

					<q-input
						v-model="form.description"
						outlined
						dense
						type="textarea"
						rows="3"
						label="Descripción (Opcional)"
						placeholder="Detalles adicionales sobre el método de recaudo..."
						:disable="paymentStore.isSubmitting"
					/>
				</q-card-section>

				<q-card-actions align="right" class="q-px-md q-pb-md q-pt-none">
					<q-btn
						v-close-popup
						flat
						dense
						color="grey-7"
						label="Cancelar"
						no-caps
						:disable="paymentStore.isSubmitting"
						class="q-px-sm"
					/>
					<q-btn
						type="submit"
						unelevated
						dense
						color="primary"
						:label="isEditMode ? 'Guardar' : 'Crear'"
						no-caps
						:loading="paymentStore.isSubmitting"
						class="q-px-md text-weight-bold"
					/>
				</q-card-actions>
			</q-form>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { QForm } from 'quasar';
import { usePaymentMethodsStore } from '@/stores/payment.store';
import type { PaymentMethod, PaymentMethodType } from '@/models';

interface Props {
	modelValue: boolean;
	itemToEdit?: PaymentMethod | null;
}

const props = withDefaults(defineProps<Props>(), {
	itemToEdit: null,
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'saved'): void;
}>();

const paymentStore = usePaymentMethodsStore();
const formRef = ref<QForm | null>(null);

const isOpen = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val),
});

const isEditMode = computed(() => Boolean(props.itemToEdit?.id));

const typeOptions: { label: string; value: PaymentMethodType }[] = [
	{ label: 'Tarjeta de Crédito', value: 'CREDIT_CARD' },
	{ label: 'Tarjeta de Débito', value: 'DEBIT_CARD' },
	{ label: 'Transferencia Bancaria', value: 'BANK_TRANSFER' },
	{ label: 'Billetera Digital', value: 'DIGITAL_WALLET' },
	{ label: 'PSE', value: 'PSE' },
	{ label: 'Efectivo', value: 'CASH' },
];

const form = reactive({
	name: '',
	type: null as PaymentMethodType | null,
	description: '',
});

watch(
	() => props.itemToEdit,
	(item) => {
		if (item) {
			form.name = item.name;
			form.type = item.type;
			form.description = item.description || '';
		} else {
			resetForm();
		}
	},
	{ immediate: true }
);

function resetForm() {
	form.name = '';
	form.type = null;
	form.description = '';
	formRef.value?.resetValidation();
}

async function handleSubmit() {
	if (!form.type) return;

	const success =
		isEditMode.value && props.itemToEdit
			? await paymentStore.updatePaymentMethod(props.itemToEdit.id, {
					name: form.name.trim(),
					type: form.type,
					...(form.description.trim() ? { description: form.description.trim() } : {}),
				})
			: await paymentStore.createPaymentMethod({
					name: form.name.trim(),
					type: form.type,
					...(form.description.trim() ? { description: form.description.trim() } : {}),
				});

	if (success) {
		isOpen.value = false;
		emit('saved');
	}
}
</script>
