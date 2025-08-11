<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Variables para la notificación global
const showGlobalNotification = ref(false);
const globalNotificationMessage = ref('');
const globalNotificationType = ref('success');

// Función para mostrar notificación global
const showNotification = (mensaje, tipo = 'success') => {
  globalNotificationMessage.value = mensaje;
  globalNotificationType.value = tipo;
  showGlobalNotification.value = true;
  
  // Auto-ocultar después de 4 segundos
  setTimeout(() => {
    hideGlobalNotification();
  }, 4000);
};

// Función para ocultar notificación global
const hideGlobalNotification = () => {
  showGlobalNotification.value = false;
};

// Función para manejar notificaciones globales
const handleGlobalNotification = (event) => {
  const notificacion = event.detail;
  showNotification(notificacion.mensaje, notificacion.tipo);
};

// Función para verificar notificaciones en localStorage al cargar
const checkStoredNotifications = () => {
  const notificacionGuardada = localStorage.getItem('notificacionGlobal');
  if (notificacionGuardada) {
    try {
      const notificacion = JSON.parse(notificacionGuardada);
      // Solo mostrar si la notificación es reciente (menos de 10 segundos)
      if (Date.now() - notificacion.timestamp < 10000) {
        showNotification(notificacion.mensaje, notificacion.tipo);
      }
      // Limpiar la notificación del localStorage
      localStorage.removeItem('notificacionGlobal');
    } catch (e) {
      console.error('Error al parsear notificación guardada:', e);
    }
  }
};

onMounted(() => {
  // Escuchar eventos de notificación global
  window.addEventListener('notificacionGlobal', handleGlobalNotification);
  
  // Verificar si hay notificaciones guardadas
  checkStoredNotifications();
});

onUnmounted(() => {
  // Limpiar event listener
  window.removeEventListener('notificacionGlobal', handleGlobalNotification);
});
</script>

<template>
  <!-- Notificación Global -->
  <transition name="fade">
    <div v-if="showGlobalNotification" class="global-notification global-notification--success">
      <span>{{ globalNotificationMessage }}</span>
      <button @click="hideGlobalNotification" class="global-notification-close">
        <img src="./assets/close.svg" alt="Cerrar" width="16" height="16" />
      </button>
    </div>
  </transition>

  <router-view />
</template>

<style scoped>
/* Estilos para la notificación global */
.global-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.global-notification--success {
  background-color: #10b981;
}

.global-notification-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.global-notification-close:hover {
  opacity: 0.8;
}

/* Transiciones para la notificación */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
