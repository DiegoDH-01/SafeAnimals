<template>
  <div class="estados estados-container">
    <div class="header-section">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <svg class="title-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
            </svg>
            Estados de Servicios
          </h1>
          <p class="page-subtitle">Gestiona el progreso de cada servicio</p>
        </div>
      </div>
    </div>

    <div class="table-container overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm mb-8">
      <table class="table min-w-[600px] w-full text-sm text-left">
        <thead>
          <tr>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Fecha</th>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Referencia</th>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Mascota</th>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Encargado</th>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Estado</th>
            <th class="px-4 sm:px-6 py-3 text-center font-semibold whitespace-nowrap">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="servicio in paginatedServicios" :key="servicio.idServicio" class="hover:bg-[var(--color2)/10] border-b last:border-0">
            <td class="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">{{ servicio.fechaRegistro }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ servicio.referencia }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <div class="pet-cell">
                <div class="pet-avatar">
                  <img v-if="getMascotaFotoUrl(servicio)" :src="getMascotaFotoUrl(servicio)" alt="Foto" class="pet-avatar-img" />
                  <svg v-else fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path>
                    <path fill-rule="evenodd" d="M3 8h4v4a2 2 0 002 2h6a2 2 0 002-2V8h4a2 2 0 000-4H3a2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="pet-name">{{ typeof servicio.mascota === 'object' && servicio.mascota !== null ? servicio.mascota.nombre : servicio.mascota }}</span>
              </div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <div class="user-cell">
                <div class="user-avatar">
                  <svg fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="user-name">{{ typeof servicio.usuario === 'object' && servicio.usuario !== null ? servicio.usuario.nombres || servicio.usuario.username || servicio.usuario.nombre : servicio.usuario }}</span>
              </div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <span class="status-badge" :class="estadoColorClass(servicio)">
                {{ typeof servicio.estado === 'object' && servicio.estado !== null ? servicio.estado.nombreEstado : servicio.estado }}
              </span>
            </td>
            <td class="px-4 sm:px-6 py-4 text-center table-actions whitespace-nowrap">
              <button @click="retrocederEstado(servicio)" class="icon-btn icon-btn--retrocede mx-1" title="Retroceder estado">
                <img src="../assets/revertir.svg" alt="Retroceder" width="26" height="26" />
              </button>
              <button @click="avanzarEstado(servicio)" class="icon-btn icon-btn--avanza mx-1" title="Avanzar estado">
                <img src="../assets/siguiente.svg" alt="Avanzar" width="26" height="26"  />
              </button>
            </td>
          </tr>
          <tr v-if="paginatedServicios.length === 0">
            <td colspan="6" class="table-empty">No se encontraron servicios.</td>
          </tr>
        </tbody>
      </table>
      <div v-if="totalPages > 1" class="table-pagination">
        <button @click="prevPage" :disabled="currentPage === 1" class="table-pagination-btn">Anterior</button>
        <span class="table-pagination-info">Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="table-pagination-btn">Siguiente</button>
      </div>
    </div>
    <p v-if="error" class="modal-error">{{ error }}</p>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'Estados',
  setup() {
    const servicios = ref([]);
    const error = ref('');
    const currentPage = ref(1);
    const pageSize = ref(10);

    const fetchServicios = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/servicios');
        servicios.value = Array.isArray(res.data) ? res.data : [];
      } catch (e) {
        error.value = e.response?.data?.mensaje || e.response?.data?.message || 'Error al cargar servicios';
      }
    };

    const avanzarEstado = async (servicio) => {
      error.value = '';
      // Validación para diferentes estados
      const estado = typeof servicio.estado === 'object' && servicio.estado !== null ? servicio.estado : {};
      const nombreEstado = estado.nombreEstado ? estado.nombreEstado.toLowerCase() : '';
      
      // Confirmación para cambiar de "En proceso" a "Finalizado"
      if (nombreEstado === 'en proceso' || estado.idEstado === 2) {
        const seguro = confirm('¿Seguro deseas finalizar el servicio?');
        if (!seguro) return;
      }
      
      // Confirmación para cambiar de "Finalizado" a "Entregado"
      if (nombreEstado === 'finalizado' || estado.idEstado === 3) {
        const seguro = confirm('¿Seguro que vas a entregar la mascota?');
        if (!seguro) return;
      }
      
      try {
        await axios.put(`http://localhost:3000/api/servicios/${servicio.idServicio}/avanzar-estado`);
        
        // Mostrar mensaje solo si se avanzó desde 'Finalizado' a 'Entregado'
        if (nombreEstado === 'finalizado' || estado.idEstado === 3) {
          alert('La mascota fue entregada con éxito.');
        }
        
        // Verificar si el nuevo estado es "Finalizado" o "Recibido" para mostrar notificación
        const nuevoEstado = await axios.get(`http://localhost:3000/api/servicios/${servicio.idServicio}`);
        const estadoActual = nuevoEstado.data.estado?.nombreEstado?.toLowerCase();
        
        if (estadoActual === 'finalizado' || estadoActual === 'entregado') {
          // Guardar notificación en localStorage para mostrarla globalmente
          const notificacion = {
            mensaje: 'Notificación ha sido enviada',
            tipo: 'success',
            timestamp: Date.now()
          };
          localStorage.setItem('notificacionGlobal', JSON.stringify(notificacion));
          
          // Disparar evento personalizado para que otros componentes se enteren
          window.dispatchEvent(new CustomEvent('notificacionGlobal', { detail: notificacion }));
        }
        
        await fetchServicios();
      } catch (e) {
        error.value = e.response?.data?.mensaje || e.response?.data?.message || 'Error al avanzar estado';
      }
    };

    const retrocederEstado = async (servicio) => {
      error.value = '';
      try {
        await axios.put(`http://localhost:3000/api/servicios/${servicio.idServicio}/retroceder-estado`);
        await fetchServicios();
      } catch (e) {
        error.value = e.response?.data?.mensaje || e.response?.data?.message || 'Error al retroceder estado';
      }
    };

    const totalPages = computed(() => {
      return Math.max(1, Math.ceil(servicios.value.length / pageSize.value));
    });

    // Función para ordenar estados (igual que en Citas e HistorialServicios)
    const estadoOrder = (estado) => {
      if (!estado) return 999;
      const nombre = String(estado).toLowerCase();
      if (nombre.includes('recibido')) return 1;
      if (nombre.includes('en proceso')) return 2;
      if (nombre.includes('finalizado')) return 3;
      if (nombre.includes('entregado')) return 4;
      return 999;
    };

    // Servicios ordenados: primero por estado, luego por fecha más actual
    const serviciosOrdenados = computed(() => {
      const arr = [...servicios.value];
      return arr.sort((a, b) => {
        // Primero ordenar por estado (Recibido = 1, En proceso = 2, Finalizado = 3, Entregado = 4)
        const estadoA = estadoOrder(typeof a.estado === 'object' && a.estado !== null ? a.estado.nombreEstado : a.estado);
        const estadoB = estadoOrder(typeof b.estado === 'object' && b.estado !== null ? b.estado.nombreEstado : b.estado);
        
        if (estadoA !== estadoB) {
          return estadoA - estadoB; // Orden ascendente por estado
        }
        
        // Si tienen el mismo estado, ordenar por fecha más actual (descendente)
        const fechaA = new Date(a?.fechaRegistro || 0);
        const fechaB = new Date(b?.fechaRegistro || 0);
        return fechaB - fechaA; // Fecha más reciente primero
      });
    });

    const paginatedServicios = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return serviciosOrdenados.value.slice(start, start + pageSize.value);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };
    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    onMounted(fetchServicios);

    // Devuelve la clase de color según el estado
    const estadoColorClass = (servicio) => {
      const estado = typeof servicio.estado === 'object' && servicio.estado !== null ? servicio.estado.nombreEstado : servicio.estado;
      if (!estado) return '';
      const nombre = estado.toLowerCase();
      if (nombre.includes('recibido')) return 'estado-recibido';
      if (nombre.includes('en proceso')) return 'estado-proceso';
      if (nombre.includes('finalizado')) return 'estado-finalizado';
      if (nombre.includes('entregado')) return 'estado-entregado';
      return '';
    };

    // Helper to get mascota photo URL
    const getMascotaFotoUrl = (servicio) => {
      if (typeof servicio.mascota === 'object' && servicio.mascota !== null && servicio.mascota.foto) {
        return `http://localhost:3000/uploads/${servicio.mascota.foto}`;
      }
      return null;
    };

    return {
      servicios,
      error,
      avanzarEstado,
      retrocederEstado,
      paginatedServicios,
      currentPage,
      totalPages,
      nextPage,
      prevPage,
      estadoColorClass,
      getMascotaFotoUrl
    };
  }
};
</script>

<style src="../styles/table.css"></style>
<style src="../styles/headers.css"></style>
<style src="../styles/estados.css"></style>
<style scoped>
/* Estilos adicionales específicos del componente si son necesarios */
</style>
