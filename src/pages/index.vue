<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar>
				<q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

				<q-toolbar-title> LinkTic - Front End </q-toolbar-title>

				<div>
				<q-btn flat round dense class="q-ml-sm">
					<q-avatar size="36px" color="white" text-color="primary" class="text-weight-bold">
						SV
					</q-avatar>

					<q-menu anchor="bottom end" self="top end" class="shadow-6" style="min-width: 220px">
						<q-list>
							<q-item class="q-py-md">
								<q-item-section avatar>
									<q-avatar color="primary" text-color="white" size="42px">
										SV
									</q-avatar>
								</q-item-section>
								<q-item-section>
									<q-item-label class="text-weight-bold">
										{{ userInfo.currentUser?.name || 'Usuario' }}
									</q-item-label>
									<q-item-label caption class="text-grey-7">
										{{ userInfo.currentUser?.email || userInfo.currentUser?.username }}
									</q-item-label>
									<q-badge color="positive" class="q-mt-xs self-start" label="En línea" />
								</q-item-section>
							</q-item>

							<q-separator />

							<!-- Opción de Cerrar Sesión -->
							<q-item v-close-popup clickable class="text-negative" @click="handleLogout">
								<q-item-section avatar>
									<q-icon name="logout" color="negative" />
								</q-item-section>
								<q-item-section class="text-weight-medium">
									Cerrar Sesión
								</q-item-section>
							</q-item>
						</q-list>
					</q-menu>
				</q-btn>

				</div>
			</q-toolbar>
		</q-header>

		<q-drawer v-model="leftDrawerOpen" show-if-above bordered>
			<q-list>
				<q-item-label header> Menú </q-item-label>

				<EssentialLink
					v-for="link in linksList"
					:key="link.label"
					v-bind="link"
				/>
			</q-list>
		</q-drawer>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import EssentialLink, { type EssentialLinkProps } from '@/components/EssentialLink.vue';

const router = useRouter();
const userInfo = useAuthStore();

function handleLogout() {
	userInfo.logout();
	void router.push('/login');
}

const linksList: EssentialLinkProps[] = [
	{
		label: 'Docs',
		caption: 'quasar.dev',
		icon: 'school',
		link: 'https://quasar.dev',
	},
	{
		label: 'GitHub',
		caption: 'github.com/quasarframework',
		icon: 'code',
		link: 'https://github.com/quasarframework',
	},
	{
		label: 'Discord Chat Channel',
		caption: 'chat.quasar.dev',
		icon: 'chat',
		link: 'https://chat.quasar.dev',
	},
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
	leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
