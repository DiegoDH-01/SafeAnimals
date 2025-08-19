<template>
  <div class="historial historial-container">

    <div class="header-section">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <svg class="title-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
            </svg>
            Historial de Servicios
          </h1>
          <p class="page-subtitle">Servicios realizados y su estado</p>
        </div>
      </div>
    </div>

    <div class="search-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <svg class="search-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
          </svg>
          <input v-model="search" type="text" placeholder="Buscar por mascota, dueño, usuario o estado..." class="search-input" />
        </div>
      </div>
    </div>

    <div class="table-container overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm mb-8">
      <table class="table min-w-[760px] w-full text-sm text-left">
        <thead>
          <tr>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">
              <div class="header-content">
                <svg class="header-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path>
                  <path fill-rule="evenodd" d="M3 8h4v4a2 2 0 002 2h6a2 2 0 002-2V8h4a2 2 0 000-4H3a2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
                Mascota
              </div>
            </th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">
              <div class="header-content">
                <svg class="header-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
                Dueño
              </div>
            </th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">
              <div class="header-content">
                <svg class="header-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
                Usuario
              </div>
            </th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap cursor-pointer" @click="setSort('ingreso')">
              <div class="header-content">
                <svg class="header-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                </svg>
                Ingreso {{ sortIndicator('ingreso') }}
              </div>
            </th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap cursor-pointer" @click="setSort('fin')">
              <div class="header-content">
                <svg class="header-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                </svg>
                Finalización {{ sortIndicator('fin') }}
              </div>
            </th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap cursor-pointer" @click="setSort('estado')">
              <div class="header-content">
                <svg class="header-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Estado {{ sortIndicator('estado') }}
              </div>
            </th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">
              <div class="header-content">
                <svg class="header-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                </svg>
                Referencia
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="7">
              <div class="table-loader"><span class="loader"></span> Cargando historial...</div>
            </td>
          </tr>
          <tr v-for="servicio in paginatedHistorial" :key="servicio.idServicio" class="hover:bg-[var(--color2)/10] border-b last:border-0">
            <td class="px-4 py-3 whitespace-nowrap align-top">
              <div class="pet-cell">
                <div class="pet-avatar">
                  <img v-if="getMascotaFotoUrl(servicio)" :src="getMascotaFotoUrl(servicio)" alt="Foto" class="pet-avatar-img" />
                  <svg v-else fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path><path fill-rule="evenodd" d="M3 8h4v4a2 2 0 002 2h6a2 2 0 002-2V8h4a2 2 0 000-4H3a2 2 0 000 4z" clip-rule="evenodd"></path></svg>
                </div>
                <span class="pet-name">{{ servicio.mascota?.nombre }}</span>
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap align-top">
              <div class="user-cell">
                <div class="user-avatar">
                  <svg fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                </div>
                <span class="user-name">{{ servicio.mascota?.dueno?.nombres }} {{ servicio.mascota?.dueno?.apellidos }}</span>
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap align-top">
              <div class="user-cell">
                <div class="user-avatar">
                  <svg fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                </div>
                <span class="user-name">{{ servicio.usuario?.nombres }} {{ servicio.usuario?.apellidos }}</span>
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap align-top">
              <span class="date-text">{{ formatDate(servicio.fechaRegistro) }}</span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap align-top">
              <span class="date-text">{{ formatDate(servicio.fechaFinalizacion) }}</span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <span class="estado-pill" :class="estadoColorClass(servicio.estado?.nombreEstado)">
                {{ servicio.estado?.nombreEstado }}
              </span>
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
const isLoading = ref(true);

const fetchHistorial = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get('http://localhost:3000/api/servicios/historial');
    historial.value = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error('Error al cargar historial:', error);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (fecha) => {
  if (!fecha) return '—';
  return fecha; // "2025-08-05"
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

// Foto de mascota si viene incluida en el servicio
const getMascotaFotoUrl = (servicio) => {
  const foto = servicio?.mascota?.foto;
  return foto ? `http://localhost:3000/uploads/${foto}` : '';
};

// Orden lógico de estados
const estadoOrder = (estadoNombre) => {
  if (!estadoNombre) return 999;
  const n = String(estadoNombre).toLowerCase();
  if (n.includes('recibido')) return 1;
  if (n.includes('en proceso')) return 2;
  if (n.includes('finalizado')) return 3;
  if (n.includes('entregado')) return 4;
  return 999;
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

// Ordenamiento personalizado: primero por estado (Recibido primero), luego por fecha más actual
const sortKey = ref('estado');
const sortDir = ref('asc');
const sortedHistorial = computed(() => {
  const source = Array.isArray(filteredHistorial.value) ? filteredHistorial.value : [];
  const arr = [...source];
  
  // Ordenamiento personalizado: primero por estado, luego por fecha
  return arr.sort((a, b) => {
    // Primero ordenar por estado (Recibido = 1, En proceso = 2, Finalizado = 3, Entregado = 4)
    const estadoA = estadoOrder(a?.estado?.nombreEstado);
    const estadoB = estadoOrder(b?.estado?.nombreEstado);
    
    if (estadoA !== estadoB) {
      return estadoA - estadoB; // Orden ascendente por estado
    }
    
    // Si tienen el mismo estado, ordenar por fecha más actual (descendente)
    const fechaA = new Date(a?.fechaRegistro || 0);
    const fechaB = new Date(b?.fechaRegistro || 0);
    return fechaB - fechaA; // Fecha más reciente primero
  });
});

const paginatedHistorial = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return sortedHistorial.value.slice(start, start + pageSize.value);
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

// Helpers sort UI
const setSort = (key) => { sortKey.value = key; sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'; };
const sortIndicator = (key) => sortKey.value === key ? (sortDir.value === 'asc' ? '▲' : '▼') : '';
</script>

<style src="../styles/table.css"></style>
<style src="../styles/historial.css"></style>
<style scoped>
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
