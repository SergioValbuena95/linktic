<template>
	<q-card class="generic-filter shadow-1 q-mb-md">
		<q-card-section class="q-pb-none">
			<div class="row items-center justify-between q-mb-sm">
				<div class="text-subtitle1 text-weight-medium text-grey-8 flex items-center">
					<q-icon name="filter_list" class="q-mr-xs" size="20px" />
					Filtros
				</div>
			</div>

			<div class="row q-col-gutter-md">
				<div
					v-for="field in fields"
					:key="field.key"
					:class="field.colClass || 'col-12 col-sm-6 col-md-4'"
				>
					<q-input
						v-if="field.type === 'text'"
						v-model="model[field.key]"
						outlined
						dense
						:label="field.label + (field.required ? ' *' : '')"
						:placeholder="field.placeholder"
						:error="Boolean(errors[field.key])"
						:error-message="errors[field.key]"
						clearable
						@keydown.enter="handleSearch"
						@update:model-value="clearFieldError(field.key)"
					>
						<template v-if="field.icon" #prepend>
							<q-icon :name="field.icon" size="18px" />
						</template>
					</q-input>

					<q-select
						v-else-if="field.type === 'select'"
						v-model="model[field.key]"
						outlined
						dense
						emit-value
						map-options
						:label="field.label + (field.required ? ' *' : '')"
						:options="field.options || []"
						:error="Boolean(errors[field.key])"
						:error-message="errors[field.key]"
						clearable
						@update:model-value="clearFieldError(field.key)"
					>
						<template v-if="field.icon" #prepend>
							<q-icon :name="field.icon" size="18px" />
						</template>
					</q-select>
				</div>
			</div>
		</q-card-section>

		<q-card-actions align="right" class="q-px-md q-pb-md q-pt-none">
			<q-btn
				flat
				dense
				color="grey-7"
				icon="restart_alt"
				label="Limpiar"
				no-caps
				class="q-px-sm"
				@click="handleReset"
			/>
			<q-btn
				unelevated
				dense
				color="primary"
				icon="search"
				label="Buscar"
				no-caps
				class="q-px-md"
				@click="handleSearch"
			/>
		</q-card-actions>
	</q-card>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { FilterFieldConfig, FilterValues } from '@/models';

interface Props {
	fields: FilterFieldConfig[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
	(e: 'search', values: FilterValues): void;
	(e: 'reset'): void;
}>();

type FilterFieldValue = string | number | null | undefined;

const model = reactive<Record<string, FilterFieldValue>>({});
const errors = reactive<Record<string, string>>({});

function initializeModel() {
	props.fields.forEach((field) => {
		model[field.key] = (field.defaultValue as FilterFieldValue) ?? null;
		delete errors[field.key];
	});
}

watch(() => props.fields, initializeModel, { immediate: true, deep: true });

function clearFieldError(key: string) {
	if (errors[key]) {
		delete errors[key];
	}
}

function validate(): boolean {
	let isValid = true;
	props.fields.forEach((field) => {
		if (field.required) {
			const value = model[field.key];
			const isEmpty =
				value === null ||
				value === undefined ||
				(typeof value === 'string' && value.trim() === '');
			if (isEmpty) {
				errors[field.key] = field.requiredErrorMessage || `El campo ${field.label} es obligatorio.`;
				isValid = false;
			}
		}
	});
	return isValid;
}

function handleSearch() {
	if (!validate()) return;
	const cleanOutput: FilterValues = {};
	Object.keys(model).forEach((key) => {
		const val = model[key];
		if (val !== null && val !== undefined && val !== '') {
			cleanOutput[key] = typeof val === 'string' ? val.trim() : val;
		}
	});

	emit('search', cleanOutput);
}

function handleReset() {
	initializeModel();
	emit('reset');
}
</script>

<style scoped>
.generic-filter {
	border-radius: 8px;
	border: 1px solid #e0e0e0;
}
</style>
