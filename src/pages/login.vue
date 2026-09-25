<template>
	<div class="login-wrapper fullscreen flex flex-center bg-grey-2">
		<q-card class="login-card shadow-10 q-pa-lg">
			<div class="text-center q-mb-lg">
				<div class="q-mb-sm">
					<img src="/assets/linkTic.svg" alt="">
				</div>
				<h1 class="text-h5 text-weight-bold text-primary q-my-none">
					LinkTic
				</h1>
				<p class="text-caption text-grey-7 q-mt-xs">
					Metodos de Pago — Iniciar Sesión
				</p>
			</div>

			<q-form class="q-gutter-y-md" @submit.prevent="handleLogin">
				<q-input
					v-model="form.username"
					outlined
					label="Usuario *"
					placeholder="Ej: sergio"
					autocomplete="username"
					:disable="authStore.isLoading"
					:rules="[
						(val) => (val && val.trim().length > 0)
                        || 'El usuario es obligatorio',
					]"
					lazy-rules
				>
					<template #prepend>
						<q-icon name="person" color="primary" />
					</template>
				</q-input>

				<q-input
					v-model="form.password"
					outlined
					label="Contraseña *"
					placeholder="Ingresa tu contraseña"
					:type="showPassword ? 'text' : 'password'"
					autocomplete="current-password"
					:disable="authStore.isLoading"
					:rules="[
						(val) => (val && val.trim().length > 0)
                        || 'La contraseña es obligatoria',
					]"
					lazy-rules
				>
					<template #prepend>
						<q-icon name="key" color="primary" />
					</template>
					<template #append>
						<q-icon
							:name="showPassword ? 'visibility_off' : 'visibility'"
							class="cursor-pointer"
							@click="showPassword = !showPassword"
						/>
					</template>
				</q-input>

				<div class="q-mt-lg">
					<q-btn
						type="submit"
						color="primary"
						class="full-width q-py-sm text-weight-bold"
						label="Iniciar Sesión"
						:loading="authStore.isLoading"
						no-caps
						size="md"
					/>
				</div>
			</q-form>
		</q-card>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);

const form = reactive({
	username: '',
	password: '',
});


async function handleLogin() {
	const success = await authStore.login({
		username: form.username,
		password: form.password,
	});

	if (success) {
		void router.push('/');
	}
}
</script>

<style scoped>
.login-wrapper {
	min-height: 100vh;
	background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
	width: 100%;
	max-width: 420px;
	border-radius: 12px;
	background-color: #ffffff;
}
</style>
