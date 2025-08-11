<template>
  <div class="citas citas-container">
    <!-- Success Notification -->
    <transition name="fade">
      <div v-if="showNotification" class="notification notification--success">
        <span>{{ notificationMessage }}</span>
        <button @click="hideNotification" class="notification-close">
          <img src="../assets/close.svg" alt="Cerrar" width="16" height="16" />
        </button>
      </div>
    </transition>

    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <svg class="title-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
            </svg>
            Citas Agendadas
          </h1>
          <p class="page-subtitle">Gestiona y organiza todas las citas de mascotas</p>
        </div>
        <button @click="openModal" class="add-button">
          <svg class="add-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
          </svg>
          <span>Agregar Cita</span>
        </button>
      </div>
    </div>

    <div class="search-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <svg class="search-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
          </svg>
          <input v-model="search" type="text" placeholder="Buscar por referencia, mascota, usuario..." class="search-input" />
        </div>
        <div class="search-input-wrapper">
          <svg class="search-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
          </svg>
          <input v-model="searchFecha" type="date" class="search-input" />
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
          <tr v-for="cita in paginatedCitas" :key="cita.idServicio" class="hover:bg-[var(--color2)/10] border-b last:border-0">
            <td class="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">{{ cita.fechaRegistro }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ cita.referencia }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <div class="pet-cell">
                <div class="pet-avatar">
                  <img v-if="getMascotaFotoUrl(cita.idMascota)" :src="getMascotaFotoUrl(cita.idMascota)" alt="Foto" class="pet-avatar-img" />
                  <svg v-else fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path>
                    <path fill-rule="evenodd" d="M3 8h4v4a2 2 0 002 2h6a2 2 0 002-2V8h4a2 2 0 000-4H3a2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="pet-name">{{ cita.mascota }}</span>
              </div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <div class="user-cell">
                <div class="user-avatar">
                  <svg fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="user-name">{{ cita.usuario }}</span>
              </div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <span class="status-badge" :class="estadoColorClass(cita.estado)">
                {{ cita.estado }}
              </span>
            </td>
            <td class="px-4 sm:px-6 py-4 text-center table-actions whitespace-nowrap">
              <button @click="editCita(cita)" class="icon-btn" title="Editar">
                <img src="../assets/edit.svg" alt="Editar" width="28" height="28" />
              </button>
              <button @click="deleteCita(cita)" class="icon-btn icon-btn--delete" title="Eliminar">
                <img src="../assets/delete.svg" alt="Eliminar" width="28" height="28" />
              </button>
            </td>
          </tr>
          <tr v-if="paginatedCitas.length === 0">
            <td colspan="6" class="table-empty">No se encontraron citas.</td>
          </tr>
        </tbody>
      </table>
      <div v-if="totalPages > 1" class="table-pagination">
        <button @click="prevPage" :disabled="currentPage === 1" class="table-pagination-btn">Anterior</button>
        <span class="table-pagination-info">Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="table-pagination-btn">Siguiente</button>
      </div>
    </div>
    <transition name="fade">
      <div v-if="showModal" class="modal-bg">
        <div class="modal">
          <button @click="closeModal" class="modal-close" title="Cerrar">
            <img src="../assets/close.svg" alt="Cerrar" width="32" height="32" />
          </button>
          <h3 class="modal-title">{{ editando ? 'Editar cita' : 'Agendar nueva cita' }}</h3>
          <form @submit.prevent="handleSubmit" class="modal-form">
            <div class="modal-row">
              <div class="flex-1 min-w-0">
                <label for="cita-fecha" class="modal-label">Fecha de Cita</label>
                <input id="cita-fecha" v-model="form.fechaRegistro" type="date" placeholder="Fecha *" class="modal-input" required />
              </div>
              <div class="flex-1 min-w-0">
                <label for="cita-referencia" class="modal-label">Referencia</label>
                <input id="cita-referencia" v-model="form.referencia" type="text" placeholder="Referencia *" class="modal-input" required />
              </div>
            </div>
            
            <!-- Autocomplete para mascota -->
            <label for="cita-mascota" class="modal-label">Mascota</label>
            <div class="relative">
              <input 
                id="cita-mascota"
                v-model="mascotaSearch" 
                type="text" 
                placeholder="Buscar mascota *" 
                class="modal-input" 
                required
                @input="filterMascotas"
                @focus="showMascotasDropdown = true"
                @blur="handleMascotaBlur"
              />
              <div v-if="showMascotasDropdown && filteredMascotas.length > 0" class="mascotas-dropdown">
                <div 
                  v-for="mascota in filteredMascotas" 
                  :key="mascota.id"
                  @click="selectMascota(mascota)"
                  class="mascota-option"
                >
                  <span class="mascota-nombre">{{ mascota.nombre }}</span>
                  <span class="mascota-dueno">- {{ mascota.dueno ? `${mascota.dueno.nombres} ${mascota.dueno.apellidos}` : 'Sin dueño' }}</span>
                </div>
              </div>
            </div>

            <label for="cita-usuario" class="modal-label">Encargado</label>
            <input id="cita-usuario" class="modal-input" type="text" :value="usuarios.length ? usuarios[0].nombre : ''" readonly tabindex="-1" />
            <div v-if="!editando" class="text-xs text-gray-500 mb-2">El Recepcionista guardado será el actual de la sesión</div>
            <label for="cita-estado" class="modal-label">Estado</label>
            <select id="cita-estado" v-model="form.idEstadoActual" class="modal-input" required :disabled="!editando">
              <option v-for="e in estados" :key="e.id" :value="e.id" :selected="form.idEstadoActual === e.id">
                {{ e.nombre }}
              </option>
            </select>
            <div v-if="!editando" class="text-xs text-gray-500 mb-2">El estado inicial es <b>Recibido</b></div>
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="modal-btn modal-btn--cancel">Cancelar</button>
              <button type="submit" class="modal-btn">{{ editando ? 'Guardar cambios' : 'Agendar cita' }}</button>
            </div>
            <p v-if="error" class="modal-error">{{ error }}</p>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { getCitas } from '../services/cita';
import { getMascotas } from '../services/mascota';
import { getCurrentUser } from '../services/auth';
import { getEstados } from '../services/estado';

export default {
  name: 'Citas',
  setup() {
    const citas = ref([]);
    const search = ref('');
    const searchFecha = ref('');
    const error = ref('');
    const showModal = ref(false);
    const editando = ref(false);
    const idEditando = ref(null);
    const form = ref({ fechaRegistro: '', referencia: '', idMascota: '', idUsuario: '', idEstadoActual: '' });
    const mascotas = ref([]);
    const usuarios = ref([]);
    const currentUser = ref(null);
    const estados = ref([]);
    // Paginación
    const currentPage = ref(1);
    const pageSize = ref(10);

    // Autocomplete variables
    const mascotaSearch = ref('');
    const showMascotasDropdown = ref(false);
    const filteredMascotas = ref([]);

    // Notifications
    const showNotification = ref(false);
    const notificationMessage = ref('');

    const showSuccessNotification = (message) => {
      notificationMessage.value = message;
      showNotification.value = true;
      setTimeout(() => {
        hideNotification();
      }, 3000);
    };

    const hideNotification = () => {
      showNotification.value = false;
    };

    // Función para filtrar mascotas en el autocomplete
    const filterMascotas = () => {
      if (!mascotaSearch.value.trim()) {
        filteredMascotas.value = [];
        return;
      }
      
      const searchTerm = mascotaSearch.value.toLowerCase();
      filteredMascotas.value = mascotas.value.filter(mascota => 
        mascota.nombre.toLowerCase().includes(searchTerm) ||
        (mascota.dueno && (
          mascota.dueno.nombres.toLowerCase().includes(searchTerm) ||
          mascota.dueno.apellidos.toLowerCase().includes(searchTerm)
        ))
      );
    };

    // Función para seleccionar una mascota del dropdown
    const selectMascota = (mascota) => {
      form.value.idMascota = mascota.id;
      mascotaSearch.value = `${mascota.nombre} - ${mascota.dueno ? `${mascota.dueno.nombres} ${mascota.dueno.apellidos}` : 'Sin dueño'}`;
      showMascotasDropdown.value = false;
    };

    // Función para manejar el blur del input de mascota
    const handleMascotaBlur = () => {
      setTimeout(() => {
        showMascotasDropdown.value = false;
      }, 200);
    };

    const fetchCitas = async () => {
      citas.value = await getCitas();
    };
    const fetchMascotas = async () => {
      mascotas.value = await getMascotas();
    };
    const fetchUsuarios = async () => {
      const user = await getCurrentUser();
      if (user) {
        usuarios.value = [{ id: user.id, nombre: user.nombres || user.username || 'Usuario' }];
        currentUser.value = user;
        return usuarios.value[0];
      } else {
        usuarios.value = [];
        currentUser.value = null;
        return null;
      }
    };
    const fetchEstados = async () => {
      estados.value = await getEstados();
    };

    const getMascotaFotoUrl = (idMascota) => {
      const m = mascotas.value.find(mm => mm.id === idMascota);
      if (m && m.foto) return `http://localhost:3000/uploads/${m.foto}`;
      return '';
    };

    const estadoColorClass = (estado) => {
      if (!estado) return '';
      const nombre = String(estado).toLowerCase();
      if (nombre.includes('recibido')) return 'estado-recibido';
      if (nombre.includes('en proceso')) return 'estado-proceso';
      if (nombre.includes('finalizado')) return 'estado-finalizado';
      if (nombre.includes('entregado')) return 'estado-entregado';
      return '';
    };

    const openModal = () => {
      showModal.value = true;
      error.value = '';
      editando.value = false;
      idEditando.value = null;
      const user = currentUser.value;
      form.value = { fechaRegistro: '', referencia: '', idMascota: '', idUsuario: user && user.id ? Number(user.id) : null, idEstadoActual: 1 };
      mascotaSearch.value = '';
      filteredMascotas.value = [];
    };
    const closeModal = () => {
      showModal.value = false;
      editando.value = false;
      idEditando.value = null;
      form.value = { fechaRegistro: '', referencia: '', idMascota: '', idUsuario: '', idEstadoActual: '' };
      error.value = '';
      mascotaSearch.value = '';
      filteredMascotas.value = [];
    };

    const handleSubmit = async () => {
      error.value = '';
      try {
        // Siempre asignar el usuario actual antes de enviar
        const user = await getCurrentUser();
        form.value.idUsuario = user && (user.idUsuario || user.id) ? Number(user.idUsuario || user.id) : null;
        if (!form.value.idUsuario) {
          error.value = 'No se detectó usuario en sesión.';
          return;
        }
        if (editando.value) {
          await axios.put(`http://localhost:3000/api/servicios/${idEditando.value}`, form.value);
          showSuccessNotification('Cita editada correctamente');
        } else {
          await axios.post('http://localhost:3000/api/servicios', form.value);
          showSuccessNotification('Cita registrada correctamente');
        }
        closeModal();
        await fetchCitas();
      } catch (e) {
        error.value =
          e.response?.data?.message ||
          e.response?.data?.mensaje ||
          e.response?.data?.error ||
          (typeof e.response?.data === 'string' ? e.response.data : null) ||
          'Error al guardar cita';
      }
    };

    const editCita = (cita) => {
      editando.value = true;
      idEditando.value = cita.idServicio;
      form.value = {
        fechaRegistro: cita.fechaRegistro,
        referencia: cita.referencia,
        idMascota: cita.idMascota,
        idUsuario: cita.idUsuario,
        idEstadoActual: cita.idEstadoActual
      };
      
      // Buscar la mascota para mostrarla en el input
      const mascota = mascotas.value.find(m => m.id === cita.idMascota);
      if (mascota) {
        mascotaSearch.value = `${mascota.nombre} - ${mascota.dueno ? `${mascota.dueno.nombres} ${mascota.dueno.apellidos}` : 'Sin dueño'}`;
      }
      
      showModal.value = true;
    };

    const deleteCita = async (cita) => {
      if (!confirm('¿Seguro que deseas eliminar esta cita?')) return;
      try {
        await axios.delete(`http://localhost:3000/api/servicios/${cita.idServicio}`);
        await fetchCitas();
        showSuccessNotification('Cita eliminada correctamente');
      } catch (e) {
        alert(e.response?.data?.message || 'Error al eliminar cita');
      }
    };

    onMounted(async () => {
      await fetchUsuarios();
      fetchCitas();
      fetchMascotas();
      fetchEstados();
    });

    const filteredCitas = computed(() => {
      let arr = Array.isArray(citas.value) ? citas.value.filter(c => c && c.idServicio) : [];
      // Filtro por texto
      if (search.value) {
        const s = search.value.toLowerCase();
        arr = arr.filter(c =>
          (c.referencia && c.referencia.toLowerCase().includes(s)) ||
          (c.mascota && c.mascota.toLowerCase().includes(s)) ||
          (c.usuario && c.usuario.toLowerCase().includes(s))
        );
      }
      // Filtro por fecha
      if (searchFecha.value) {
        arr = arr.filter(c => c.fechaRegistro && c.fechaRegistro.startsWith(searchFecha.value));
      }
      
      // Ordenamiento: primero por estado, luego por fecha más actual
      return arr.sort((a, b) => {
        // Primero ordenar por estado (Recibido = 1, En proceso = 2, Finalizado = 3, Entregado = 4)
        const estadoA = estadoOrder(a?.estado || '');
        const estadoB = estadoOrder(b?.estado || '');
        
        if (estadoA !== estadoB) {
          return estadoA - estadoB; // Orden ascendente por estado
        }
        
        // Si tienen el mismo estado, ordenar por fecha más actual (descendente)
        const fechaA = new Date(a?.fechaRegistro || 0);
        const fechaB = new Date(b?.fechaRegistro || 0);
        return fechaB - fechaA; // Fecha más reciente primero
      });
    });

    // Función para ordenar estados (igual que en HistorialServicios)
    const estadoOrder = (estado) => {
      if (!estado) return 999;
      const nombre = String(estado).toLowerCase();
      if (nombre.includes('recibido')) return 1;
      if (nombre.includes('en proceso')) return 2;
      if (nombre.includes('finalizado')) return 3;
      if (nombre.includes('entregado')) return 4;
      return 999;
    };

    const totalPages = computed(() => {
      return Math.max(1, Math.ceil(filteredCitas.value.length / pageSize.value));
    });

    const paginatedCitas = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return filteredCitas.value.slice(start, start + pageSize.value);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };
    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    watch([search, searchFecha], () => {
      currentPage.value = 1;
    });

    return {
      citas,
      search,
      filteredCitas,
      searchFecha,
      paginatedCitas,
      currentPage,
      totalPages,
      nextPage,
      prevPage,
      showModal,
      openModal,
      closeModal,
      form,
      handleSubmit,
      error,
      editando,
      editCita,
      deleteCita,
      mascotas,
      usuarios,
      estados,
      // Autocomplete variables
      mascotaSearch,
      showMascotasDropdown,
      filteredMascotas,
      filterMascotas,
      selectMascota,
      handleMascotaBlur,
      // Notifications
      showNotification,
      notificationMessage,
      hideNotification,
      getMascotaFotoUrl,
      estadoColorClass
    };
  }
};
</script>

<style src="../styles/table.css"></style>
<style src="../styles/modal.css"></style>
<style src="../styles/citas.css"></style>
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

/* Autocomplete dropdown styles */
.mascotas-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.mascota-option {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mascota-option:hover {
  background-color: #f9fafb;
}

.mascota-option:last-child {
  border-bottom: none;
}

.mascota-nombre {
  font-weight: 500;
  color: var(--color2);
}

.mascota-dueno {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Notification Styles */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.notification--success {
  background-color: #10b981;
}

.notification-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  opacity: 0.8;
}

/* Fade transition for notifications */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Estilos para la tabla de citas */
.table thead th {
  background: linear-gradient(135deg, var(--color2) 0%, var(--color3) 100%);
  color: #fff;
  border-bottom-color: rgba(255,255,255,0.2);
}

/* Estilos para avatares de mascotas */
.pet-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color2) 0%, var(--color3) 100%);
  color: #fff;
  margin-right: 0.75rem;
}

.pet-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Estilos para avatares de usuarios */
.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color2) 0%, var(--color3) 100%);
  color: #fff;
  margin-right: 0.75rem;
}

/* Estilos para las celdas de mascota y usuario */
.pet-cell, .user-cell {
  display: flex;
  align-items: center;
}

.pet-name, .user-name {
  font-weight: 600;
  color: #1e293b;
}

/* Estilos para badges de estado */
.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.estado-recibido {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.status-badge.estado-proceso {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.status-badge.estado-finalizado {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.status-badge.estado-entregado {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
  color: #be185d;
}

/* Header Section Styles */
.header-section {
  background: linear-gradient(135deg, var(--color2) 0%, var(--color3) 100%);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(128, 56, 87, 0.15);
  position: relative;
  overflow: hidden;
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-icon {
  width: 2.5rem;
  height: 2.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
  font-weight: 400;
}

.add-button {
  background: var(--color-btn);
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 15px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 10px 25px rgba(128, 56, 87, 0.25);
  position: relative;
  overflow: hidden;
}

.add-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.add-button:hover::before {
  left: 100%;
}

.add-button:hover {
  transform: translateY(-2px);
  background: var(--color-btn-hover);
  box-shadow: 0 15px 35px rgba(128, 56, 87, 0.35);
}

.add-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-section {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
}

/* Contenedor principal de citas */
.citas-container {
  min-height: 100vh;
  background: var(--color-form-bg);
  color: var(--color-text);
  padding: 2rem 1.5rem;
}

/* Estilos para la sección de búsqueda */
.search-section {
  background: #fff;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(89, 38, 63, 0.08);
}

.search-container {
  display: flex;
  gap: 1.5rem;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #64748b;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-form-bg);
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color3);
  box-shadow: 0 0 0 3px rgba(180, 88, 118, 0.15);
}
</style>