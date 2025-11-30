# 📱 Task Manager App

Aplicación móvil de gestión de tareas desarrollada con React Native, Expo y TypeScript. Permite crear, editar, eliminar y organizar tareas con sincronización en tiempo real mediante JSON Server.

---

## 🎯 Características Principales

### ✨ Gestión Completa de Tareas
- **Crear tareas**: Formulario con validación en tiempo real
- **Editar tareas**: Modificar título y descripción
- **Eliminar tareas**: Confirmación antes de eliminar
- **Marcar como completada**: Toggle rápido del estado
- **Ver detalles**: Pantalla completa con información detallada

### 🎨 Interfaz de Usuario
- Diseño moderno con **NativeWind (Tailwind CSS)**
- Iconos de **Lucide React Native**
- Animaciones y transiciones suaves
- Indicadores de estado (completada/pendiente)
- Estadísticas en tiempo real (total, completadas, pendientes)

### 🔄 Funcionalidades Avanzadas
- **Estado global** con Context API
- **Persistencia de datos** con JSON Server
- **Validación de formularios** con reglas personalizadas
- **Navegación dinámica** con Expo Router
- **Actualización pull-to-refresh**
- **Gestión de errores** con feedback visual

### 🤖 Integración con IA (Gemini)
- Sugerencias inteligentes para mejorar tareas
- Optimización de títulos y descripciones
- Recomendaciones de pasos sugeridos

---

## 🏗️ Arquitectura del Proyecto

```
task-manager-app/
├── app/                          # Pantallas y navegación
│   ├── _layout.tsx              # Layout principal y providers
│   ├── index.tsx                # Pantalla principal (lista)
│   └── tasks/
│       ├── new.tsx              # Crear nueva tarea
│       └── [id].tsx             # Detalles y edición
│
├── components/                   # Componentes reutilizables
│   ├── Button.tsx               # Botón personalizado
│   ├── Input.tsx                # Input con validación
│   ├── TaskCard.tsx             # Tarjeta de tarea
│   └── TaskForm.tsx             # Formulario de tarea
│
├── lib/                          # Lógica de negocio
│   ├── context/
│   │   └── TaskContext.tsx      # Estado global
│   ├── services/
│   │   ├── taskService.ts       # API de tareas
│   │   └── gemini.ts            # Integración con Gemini AI
│   ├── types/
│   │   └── task.types.ts        # Tipos TypeScript
│   └── utils/
│       └── validation.ts        # Funciones de validación
│
├── db.json                       # Base de datos JSON Server
├── tailwind.config.js           # Configuración de Tailwind
├── metro.config.js              # Configuración de Metro
└── package.json                 # Dependencias del proyecto
```

---

## 🚀 Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd task-manager-app
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_GEMINI_API_KEY=tu_api_key_de_gemini
```

> **Nota**: Obtén tu API Key de [Google AI Studio](https://makersuite.google.com/app/apikey)

### 4. Configurar JSON Server

Actualiza la URL del servidor en `lib/services/taskService.ts`:

```typescript
const API_BASE_URL = 'http://TU_IP_LOCAL:3000';
```

Para obtener tu IP local:
- **Windows**: `ipconfig` → Dirección IPv4
- **Mac/Linux**: `ifconfig` → inet

### 5. Iniciar JSON Server

En una terminal separada:

```bash
npm run json-server
```

Deberías ver:
```
Resources
http://192.168.x.x:3000/tasks
```

### 6. Iniciar la Aplicación

```bash
npx expo start
```

Luego escanea el código QR con:
- **iOS**: Cámara del iPhone
- **Android**: App Expo Go

---

## 📖 Uso de la Aplicación

### Crear una Nueva Tarea

1. Presiona el botón flotante **"+"** en la pantalla principal
2. Completa el formulario:
   - **Título**: 3-50 caracteres alfanuméricos
   - **Descripción**: 5-200 caracteres alfanuméricos
3. Presiona **"Crear Tarea"**

### Ver Detalles de una Tarea

1. Presiona sobre cualquier tarjeta de tarea
2. Visualiza:
   - Estado (Completada/Pendiente)
   - Título y descripción completos
   - Fecha de creación
   - Última modificación
   - ID de la tarea

### Editar una Tarea

1. Abre los detalles de la tarea
2. Presiona **"Editar Tarea"**
3. Modifica los campos deseados
4. Presiona **"Guardar Cambios"**

### Marcar como Completada

**Opción 1**: Presiona el checkbox en la tarjeta de la tarea

**Opción 2**: Dentro de los detalles, presiona **"Marcar como Completada"**

### Eliminar una Tarea

**Opción 1**: Presiona el ícono de basura en la tarjeta

**Opción 2**: Dentro de los detalles, presiona **"Eliminar Tarea"**

Ambas opciones mostrarán un diálogo de confirmación.

---

## 🔧 Tecnologías Utilizadas

### Core
- **React Native** - Framework de desarrollo móvil
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático

### UI/UX
- **NativeWind** - Tailwind CSS para React Native
- **Lucide React Native** - Librería de iconos

### Estado y Datos
- **Context API** - Gestión de estado global
- **JSON Server** - API REST simulada
- **Expo Router** - Sistema de navegación basado en archivos

### IA
- **Google Generative AI** - Integración con Gemini 2.5 Pro

---

## 📋 Validaciones del Formulario

### Título
- ✅ No puede estar vacío
- ✅ Solo letras, números y espacios
- ✅ Mínimo 3 caracteres
- ✅ Máximo 50 caracteres

### Descripción
- ✅ No puede estar vacía
- ✅ Solo letras, números y espacios
- ✅ Mínimo 5 caracteres
- ✅ Máximo 200 caracteres

---

## 🔄 API Endpoints (JSON Server)

### GET `/tasks`
Obtiene todas las tareas

**Respuesta:**
```json
[
  {
    "id": "1",
    "title": "Tarea de ejemplo",
    "description": "Esta es una tarea de ejemplo",
    "completed": false,
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
]
```

### GET `/tasks/:id`
Obtiene una tarea específica

### POST `/tasks`
Crea una nueva tarea

**Body:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "completed": false,
  "createdAt": "2025-01-15T10:00:00.000Z"
}
```

### PUT `/tasks/:id`
Actualiza una tarea existente

### DELETE `/tasks/:id`
Elimina una tarea

---

## 🔐 Configuración de Seguridad

### Variables de Entorno
Las API Keys y configuraciones sensibles deben estar en `.env`:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
```

### .gitignore
Asegúrate de que `.env` esté en tu `.gitignore`:

```
.env
.env.local
```

---

## 📚 Recursos Adicionales

- [Documentación de Expo](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [NativeWind](https://www.nativewind.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Lucide Icons](https://lucide.dev/)
- [Google Gemini AI](https://ai.google.dev/)

---

## 👨‍💻 Desarrollo

### Estructura de Carpetas

- **app/**: Pantallas con enrutamiento automático
- **components/**: Componentes UI reutilizables
- **lib/context/**: Estado global con Context API
- **lib/services/**: Lógica de conexión a APIs
- **lib/types/**: Definiciones de tipos TypeScript
- **lib/utils/**: Funciones utilitarias

### Flujo de Datos

```
JSON Server (db.json)
    ↓
taskService.ts (Fetch API)
    ↓
TaskContext (Estado Global)
    ↓
Componentes (useTasks hook)
    ↓
UI (Renderizado)
