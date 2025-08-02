<template>
  <div class="duenos-bg flex flex-col gap-8 px-6 pt-10 pb-8 sm:px-20 sm:pt-16 sm:pb-12 min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl sm:text-3xl font-bold text-[var(--color2)]">Estados de Servicios</h2>
    </div>
    <div class="table-container overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm mb-8">
      <table class="table min-w-[600px] w-full text-sm text-left">
        <thead>
          <tr>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Fecha</th>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Referencia</th>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Mascota</th>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Usuario</th>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Estado</th>
            <th class="px-4 sm:px-6 py-3 text-center font-semibold whitespace-nowrap">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="servicio in paginatedServicios" :key="servicio.idServicio" class="hover:bg-[var(--color2)/10] border-b last:border-0">
            <td class="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">{{ servicio.fechaRegistro }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ servicio.referencia }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              {{ typeof servicio.mascota === 'object' && servicio.mascota !== null ? servicio.mascota.nombre : servicio.mascota }}
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              {{ typeof servicio.usuario === 'object' && servicio.usuario !== null ? servicio.usuario.nombres || servicio.usuario.username || servicio.usuario.nombre : servicio.usuario }}
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap" :class="estadoColorClass(servicio)">
              {{ typeof servicio.estado === 'object' && servicio.estado !== null ? servicio.estado.nombreEstado : servicio.estado }}
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
      // Validación sencilla: solo preguntar si el estado es 'Finalizado' (idEstado 3)
      const estado = typeof servicio.estado === 'object' && servicio.estado !== null ? servicio.estado : {};
      if (estado.idEstado === 3 || (estado.nombreEstado && estado.nombreEstado.toLowerCase() === 'finalizado')) {
        const seguro = confirm('¿Seguro que vas a entregar la mascota?');
        if (!seguro) return;
      }
      try {
        await axios.put(`http://localhost:3000/api/servicios/${servicio.idServicio}/avanzar-estado`);
        // Mostrar mensaje solo si se avanzó desde 'Finalizado' a 'Entregado'
        if (estado.idEstado === 3 || (estado.nombreEstado && estado.nombreEstado.toLowerCase() === 'finalizado')) {
          alert('La mascota fue entregada con éxito.');
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

    const paginatedServicios = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return servicios.value.slice(start, start + pageSize.value);
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
      estadoColorClass
    };
  }
};
</script>

<style src="../styles/table.css"></style>
<style scoped>
.icon-btn--avanza {
  background: #e0f7fa;
  border-radius: 50%;
  border: 1.5px solid var(--color2);
  transition: background 0.2s;
}
.icon-btn--avanza:hover {
  background: #b2ebf2;
}
.icon-btn--retrocede {
  background: #fff3e0;
  border-radius: 50%;
  border: 1.5px solid var(--color2);
  transition: background 0.2s;
}
.icon-btn--retrocede:hover {
  background: #ffe0b2;
}
</style>
<style scoped>
/* Colores para los estados */
.estado-recibido {
  background: #e3f2fd;
  color: #1565c0;
  font-weight: 600;
  border-radius: 0.5rem;
}
.estado-proceso {
  background: #fffde7;
  color: #bfa100;
  font-weight: 600;
  border-radius: 0.5rem;
}
.estado-finalizado {
  background: #e8f5e9;
  color: #2e7d32;
  font-weight: 600;
  border-radius: 0.5rem;
}
.estado-entregado {
  background: #fce4ec;
  color: #ad1457;
  font-weight: 600;
  border-radius: 0.5rem;
}
</style>
