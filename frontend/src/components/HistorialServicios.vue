<template>
  <div class="duenos-bg flex flex-col gap-8 px-6 pt-10 pb-8 sm:px-20 sm:pt-16 sm:pb-12 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl sm:text-3xl font-bold text-[var(--color2)]">Historial de Servicios Realizados</h2>
    </div>

    <div class="mb-4">
      <input v-model="search" type="text" placeholder="Buscar por mascota, dueño, usuario o estado..." class="duenos-input" />
    </div>

    <div class="table-container overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm mb-8">
      <table class="table min-w-[800px] w-full text-sm text-left">
        <thead>
          <tr>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">Mascota</th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">Dueño</th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">Usuario</th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">Ingreso</th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">Finalización</th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">Estado</th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">Referencia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="servicio in paginatedHistorial" :key="servicio.idServicio" class="hover:bg-[var(--color2)/10] border-b last:border-0">
            <td class="px-4 py-3 font-medium whitespace-nowrap">{{ servicio.mascota?.nombre }}</td>
            <td class="px-4 py-3 whitespace-nowrap">{{ servicio.mascota?.dueno?.nombres }} {{ servicio.mascota?.dueno?.apellidos }}</td>
            <td class="px-4 py-3 whitespace-nowrap">{{ servicio.usuario?.nombres }} {{ servicio.usuario?.apellidos }}</td>
            <td class="px-4 py-3 whitespace-nowrap">{{ formatDate(servicio.fechaRegistro) }}</td>
            <td class="px-4 py-3 whitespace-nowrap">{{ formatDate(servicio.fechaFinalizacion) }}</td>
            <td class="px-4 py-3 whitespace-nowrap" :class="estadoColorClass(servicio.estado?.nombreEstado)">
              {{ servicio.estado?.nombreEstado }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap">{{ servicio.referencia || '—' }}</td>
          </tr>
          <tr v-if="paginatedHistorial.length === 0">
            <td colspan="7" class="table-empty">No se encontraron servicios.</td>
          </tr>
        </tbody>
      </table>

      <div v-if="totalPages > 1" class="table-pagination">
        <button @click="prevPage" :disabled="currentPage === 1" class="table-pagination-btn">Anterior</button>
        <span class="table-pagination-info">Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="table-pagination-btn">Siguiente</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';

const historial = ref([]);
const search = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

const fetchHistorial = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/servicios/historial');
    historial.value = res.data;
  } catch (error) {
    console.error('Error al cargar historial:', error);
  }
};

const formatDate = (fecha) => {
  if (!fecha) return '—';
  const d = new Date(fecha);
  return d.toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric' });
};

const estadoColorClass = (estado) => {
  if (!estado) return '';
  const nombre = estado.toLowerCase();
  if (nombre.includes('recibido')) return 'estado-recibido';
  if (nombre.includes('en proceso')) return 'estado-proceso';
  if (nombre.includes('finalizado')) return 'estado-finalizado';
  if (nombre.includes('entregado')) return 'estado-entregado';
  return '';
};

const filteredHistorial = computed(() => {
  if (!search.value) return historial.value;
  const s = search.value.toLowerCase();
  return historial.value.filter(svc => {
    return (
      svc.mascota?.nombre?.toLowerCase().includes(s) ||
      svc.mascota?.dueno?.nombres?.toLowerCase().includes(s) ||
      svc.mascota?.dueno?.apellidos?.toLowerCase().includes(s) ||
      svc.usuario?.nombres?.toLowerCase().includes(s) ||
      svc.usuario?.apellidos?.toLowerCase().includes(s) ||
      svc.estado?.nombreEstado?.toLowerCase().includes(s)
    );
  });
});

const totalPages = computed(() => Math.ceil(filteredHistorial.value.length / pageSize.value) || 1);

const paginatedHistorial = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredHistorial.value.slice(start, start + pageSize.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

watch(search, () => {
  currentPage.value = 1;
});

onMounted(fetchHistorial);
</script>

<style src="../styles/table.css"></style>
<style scoped>
.duenos-input {
  width: 100%;
  max-width: 400px;
  padding: 0.7rem 1rem;
  border: 1.5px solid var(--color2);
  border-radius: 0.7rem;
  background: #fff;
  outline: none;
  transition: border 0.2s;
}

/* Colores para los estados */
.estado-recibido {
  background: #e3f2fd;
  color: #1565c0;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.4rem 0.6rem;
}
.estado-proceso {
  background: #fffde7;
  color: #bfa100;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.4rem 0.6rem;
}
.estado-finalizado {
  background: #e8f5e9;
  color: #2e7d32;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.4rem 0.6rem;
}
.estado-entregado {
  background: #fce4ec;
  color: #ad1457;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.4rem 0.6rem;
}
</style>
