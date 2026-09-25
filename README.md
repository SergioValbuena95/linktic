# Documentación Tecnica

Prueba Técnica Frontend — Desarrollador Semi-Senior
**Stack Tecnológico:** Vue 3, Pinia, Quasar, TS , Vite.

---

## 1. Instrucciones Paso a Paso para Levantar el Entorno Local

### Prerrequisitos
- **Node.js:** Versión `>= 20.x` (Recomendado v22.x o v24.x).
- **Gestor de paquetes:** `npm` (incluido con Node), `pnpm` o `yarn`.

---

### Paso 1: Clonar o posicionarse en el proyecto
Asegúrate de estar en el directorio raíz del proyecto y en la rama correspondiente:
```bash
git checkout feature/prueba-tecnica
```

---

### Paso 2: Instalación de Dependencias
Ejecuta en la terminal:
```bash
npm install
```

---

### Paso 3: Levantar el Servidor de Desarrollo
Para iniciar la aplicación con Hot Module Replacement (HMR):
```bash
npm run dev
# o con Quasar CLI directamente:
quasar dev
```

El servidor abrirá automáticamente la aplicación en tu navegador predeterminado

---

### Paso 4: Comandos de Calidad y Validación
Para verificar la integridad del código, tipado estricto y estándares de estilo:

- **Chequeo de Tipos (TypeScript estricto):**
  ```bash
  npm run typecheck
  ```

- **Compilación para Producción (Build):**
  ```bash
  npm run build
  ```

---

## 2. Credenciales de Acceso para Pruebas

La aplicación inicia obligatoriamente en la pantalla de inicio de sesión (`/login`), protegida por Navigation Guards de Vue Router.

| Parámetro | Valor de Prueba |
| :--- | :--- |
| **Usuario** | `sergio` |
| **Contraseña** | `linktic2026` |
| **Rol** | `admin` |



---

### Seguridad y Rutas (Navigation Guards)
Definido en `src/router/guards.ts`:
- **Ruta Pública:** `/login`.
- **Rutas Protegidas:** `/` (panel principal) y cualquier sub-ruta.
- **Comportamiento del Guard (`router.beforeEach`):**
  - Si un usuario no autenticado intenta ingresar a cualquier ruta protegida por URL, es redirigido de inmediato a `/login`.
  - Si un usuario con sesión activa intenta ir a `/login`, se le redirige automáticamente a la pantalla principal `/`.
  - La sesión persiste en el store al refrescar la ventana gracias a `authStore.initSession()`.

---

## 4. Estructura de Directorios del Proyecto

```text
src/
├── assets
├── boot
├── components/
│   ├── filter
│   └── payment-modal.vue
├── models/
│   ├── api
│   ├── auth
│   ├── filter
│   ├── index
│   └── payment-method.model.ts
├── pages/
│   ├── index
│   │   └── (index).vue
│   ├── index
│   └── login.vue
├── router/
│   ├── guards
│   └── index.ts
├── services/
│   └── mock.ts
└── stores/
    ├── auth.store
    └── payment.store.ts
```
