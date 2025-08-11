# 🐾 SafeAnimals - Sistema de Gestión Veterinaria

<div align="center">

![SafeAnimals Logo](frontend/src/assets/logo.png)

**Sistema integral de gestión para servicios de cuidado animal**

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.13-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📋 Descripción del Proyecto

**SafeAnimals** es una aplicación web diseñada para la gestión integral de servicios de cuidado animal. El sistema permite administrar mascotas, dueños, servicios veterinarios, citas y notificaciones de manera eficiente y organizada.

### 🎯 Funcionalidades Principales

- **Gestión de Mascotas**: Registro y seguimiento de historial médico
- **Administración de Dueños**: Base de datos de propietarios y contacto
- **Servicios Veterinarios**: Control de tratamientos y estados de servicio
- **Sistema de Citas**: Programación y seguimiento de consultas
- **Notificaciones**: Sistema de alertas y recordatorios
- **Dashboard Analítico**: Estadísticas y reportes en tiempo real
- **Generación de Reportes**: Exportación de datos en PDF

---

## 🏗️ Arquitectura del Sistema

### Backend (API REST)

El backend está construido con **Node.js** y **Express.js**, implementando una arquitectura modular y escalable:

```
backend/
├── controllers/     # Lógica de negocio
├── models/         # Modelos de datos (Sequelize)
├── routes/         # Definición de endpoints
├── services/       # Servicios de aplicación
├── middleware/     # Autenticación y validación
├── config/         # Configuración de base de datos
└── utils/          # Utilidades y auditoría
```

#### 🛠️ Tecnologías Backend

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Base de Datos**: MySQL 8.0 con Sequelize ORM
- **Autenticación**: JWT + bcrypt
- **Subida de Archivos**: Multer
- **Notificaciones**: Twilio (WhatsApp)
- **Validación**: Middleware personalizado
- **Auditoría**: Sistema de logs y seguimiento

#### 📊 Modelos de Datos

- **Usuario**: Gestión de usuarios del sistema
- **Dueño**: Información de propietarios de mascotas
- **Mascota**: Registros médicos y datos de animales
- **Servicio**: Tratamientos y servicios veterinarios
- **EstadoServicio**: Control de estados de servicios
- **Notificación**: Sistema de alertas y recordatorios
- **Auditoria**: Logs de cambios y actividad

### Frontend (Aplicación Web)

El frontend desarrollado en **Vue.js 3** con **Composition API** ofrece una interfaz moderna y responsiva:

```
frontend/
├── src/
│   ├── components/     # Componentes Vue reutilizables
│   ├── services/       # Servicios de API
│   ├── router/         # Enrutamiento de la aplicación
│   ├── assets/         # Imágenes y recursos estáticos
│   └── styles/         # Hojas de estilo CSS
├── public/             # Archivos públicos
└── tests/              # Pruebas unitarias
```

#### 🎨 Tecnologías Frontend

- **Framework**: Vue.js 3.5.13 (Composition API)
- **Build Tool**: Vite 6.3.5
- **Routing**: Vue Router 4
- **Estilos**: Tailwind CSS 4.1.6
- **Gráficos**: Chart.js + Vue-Chartjs
- **HTTP Client**: Axios
- **PDF**: jsPDF para generación de reportes
- **Testing**: Vitest + Vue Test Utils

#### 🧩 Componentes Principales

- **Dashboard**: Panel principal con estadísticas
- **Login**: Sistema de autenticación
- **Mascotas**: Gestión de animales
- **Dueños**: Administración de propietarios
- **Citas**: Programación de consultas
- **Servicios**: Control de tratamientos
- **Notificaciones**: Sistema de alertas
- **Reportes**: Generación de documentos

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- MySQL 8.0
- Docker (opcional)

### 🔧 Instalación Rápida con Docker

```bash
# Clonar el repositorio
git clone <repository-url>
cd SafeAnimals

# Levantar servicios con Docker Compose
cd Docker
docker-compose up -d

# El sistema estará disponible en:
# - Backend: http://localhost:3000
# - Frontend: http://localhost:5173
# - phpMyAdmin: http://localhost:8282
```

### 📦 Instalación Manual

#### Backend
```bash
cd backend
npm install
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🗄️ Base de Datos

### Configuración
- **Motor**: MySQL 8.0
- **ORM**: Sequelize
- **Migraciones**: Sincronización automática
- **Backup**: Scripts SQL incluidos

### Estructura
La base de datos incluye tablas para:
- Usuarios y autenticación
- Dueños y mascotas
- Servicios veterinarios
- Estados de servicios
- Notificaciones
- Auditoría de cambios

---

## 🔐 Seguridad

- **Autenticación JWT** con refresh tokens
- **Encriptación** de contraseñas con bcrypt
- **Middleware de autorización** por roles
- **Validación** de entrada de datos
- **Sistema de auditoría** para cambios críticos

---

## 📱 Características Destacadas

### 🎯 Gestión Inteligente
- Dashboard con métricas en tiempo real
- Sistema de notificaciones automáticas
- Generación de reportes PDF
- Historial completo de servicios

### 🔔 Notificaciones
- Integración con WhatsApp (Twilio)
- Recordatorios de citas
- Alertas de estado de servicios
- Notificaciones en tiempo real

### 📊 Reportes y Analytics
- Estadísticas de servicios
- Gráficos interactivos
- Exportación de datos
- Historial de auditoría

---

## 🧪 Testing

El proyecto incluye pruebas unitarias para componentes críticos:

```bash
# Ejecutar tests del frontend
cd frontend
npm test

# Tests disponibles:
# - Login.spec.js
# - Mascotas.spec.js
# - Dueños.spec.js
# - EstadosServicio.spec.js
# - NotificacionWhatsApp.spec.js
```

---

## 🚀 Despliegue

### Producción
```bash
# Build del frontend
cd frontend
npm run build

# Iniciar backend
cd backend
npm start
```

### Variables de Entorno
Crear archivo `.env` en el backend:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=safe_animals_db
JWT_SECRET=your_secret_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

---

## 👥 Autores

- **Equipo SafeAnimals** - *Desarrollo inicial*

---

## 🙏 Agradecimientos

- Comunidad Vue.js
- Equipo de Sequelize
- Contribuidores de Tailwind CSS
- Comunidad de desarrolladores Node.js

---

<div align="center">

**Made with ❤️ for animal care professionals**

*SafeAnimals - Cuidando a quienes cuidan de nuestros mejores amigos*

</div>
