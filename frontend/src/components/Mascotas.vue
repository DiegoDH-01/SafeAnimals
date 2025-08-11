<template>
  <div class="mascotas mascotas-container">
    <!-- Success Notification -->
    <transition name="fade">
      <div v-if="showNotification" class="notification notification--success">
        <span>{{ notificationMessage }}</span>
        <button @click="hideNotification" class="notification-close">
          <img src="../assets/close.svg" alt="Cerrar" width="16" height="16" />
        </button>
      </div>
    </transition>

    <div class="header-section">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <svg class="title-icon" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path>
              <path fill-rule="evenodd" d="M3 8h4v4a2 2 0 002 2h6a2 2 0 002-2V8h4a2 2 0 000-4H3a2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
            Mascotas registradas
          </h1>
          <p class="page-subtitle">Administra las mascotas y sus datos</p>
        </div>
        <button @click="openModal" class="add-button text-xs flex items-center gap-2">
          <img src="../assets/add.svg" alt="Agregar" width="20" height="20" />
          <span>Agregar mascota</span>
        </button>
      </div>
    </div>



    <div class="search-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <svg class="search-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
          </svg>
          <input v-model="search" type="text" placeholder="Buscar por nombre, raza o dueño..." class="search-input" />
        </div>
      </div>
    </div>

    <div class="table-container overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm mb-8">
      <table class="table min-w-[600px] w-full text-sm text-left">
        <thead>
          <tr>
            <th class="px-4 py-3 font-semibold cursor-pointer" @click="setSort('nombre')">Nombre {{ sortIndicator('nombre') }}</th>
            <th class="px-4 py-3 font-semibold cursor-pointer" @click="setSort('raza')">Raza {{ sortIndicator('raza') }}</th>
            <th class="px-4 py-3 font-semibold">Foto</th>
            <th class="px-4 py-3 font-semibold cursor-pointer" @click="setSort('dueno')">Dueño {{ sortIndicator('dueno') }}</th>
            <th class="px-4 py-3 font-semibold cursor-pointer" @click="setSort('confirmado')">Dueño Confirmado {{ sortIndicator('confirmado') }}</th>
            <th class="px-4 py-3 text-center font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="6">
              <div class="table-loader"><span class="loader"></span> Cargando mascotas...</div>
            </td>
          </tr>
          <tr v-for="m in paginatedMascotas" :key="m.idMascota" class="hover:bg-[var(--color2)/10] border-b last:border-0">
            <td class="px-4 py-4 font-medium">{{ m.nombre }}</td>
            <td class="px-4 py-4">{{ m.raza }}</td>
            <td class="px-4 py-4">
              <img :src="`http://localhost:3000/uploads/${m.foto}`" alt="Foto" :class="mascotaImgClass" />
            </td>
            <td class="px-4 py-4">{{ m.duenoNombre || 'Sin asignar' }}</td>
            <td class="px-4 py-4 text-center">
              <span v-if="m.duenio_confirmado" class="text-green-500 font-bold">Sí</span>
              <span v-else class="text-red-500 font-bold">No</span>
            </td>
            <td class="px-4 py-4 text-center table-actions">
              <button @click="editMascota(m)" class="icon-btn" title="Editar">
                <img src="../assets/edit.svg" alt="Editar" width="28" />
              </button>
              <button @click="viewCardMascota(m)" class="icon-btn" title="Verificar dueño">
                <img src="../assets/ver.svg" alt="Verificar" width="28" />
              </button>
              <button @click="deleteMascota(m)" class="icon-btn icon-btn--delete" title="Eliminar">
                <img src="../assets/delete.svg" alt="Eliminar" width="28" />
              </button>
            </td>
          </tr>
          <tr v-if="!isLoading && paginatedMascotas.length === 0">
            <td colspan="6" class="table-empty">No se encontraron mascotas.</td>
          </tr>
        </tbody>
      </table>

      <div class="flex items-center justify-between px-2 py-2">
        <div class="text-sm text-[var(--color2)]">
          Mostrar
          <select v-model.number="pageSize" class="ml-1 border rounded px-2 py-1">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          por página
        </div>
        <div v-if="totalPages > 1" class="table-pagination">
          <button @click="prevPage" :disabled="currentPage === 1" class="table-pagination-btn">Anterior</button>
          <span class="table-pagination-info">Página {{ currentPage }} de {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="table-pagination-btn">Siguiente</button>
        </div>
      </div>
    </div>

    <!-- Modal de registro / edición -->
    <transition name="fade">
      <div v-if="showModal" class="modal-bg">
        <div class="modal">
          <button @click="closeModal" class="modal-close">
            <img src="../assets/close.svg" alt="Cerrar" width="32" />
          </button>
          <h3 class="modal-title">{{ editando ? 'Editar mascota' : 'Registrar nueva mascota' }}</h3>
          <form @submit.prevent="handleSubmit" class="modal-form" novalidate>
            <label for="mascota-nombre" class="modal-label">Nombre</label>
            <input id="mascota-nombre" v-model="mascota.nombre" type="text" placeholder="Nombre *" class="modal-input" required />
            <label for="mascota-raza" class="modal-label">Raza</label>
            <input id="mascota-raza" v-model="mascota.raza" type="text" placeholder="Raza *" class="modal-input" required />
            <label for="mascota-foto" class="modal-label">Foto</label>
            <input id="mascota-foto" type="file" accept="image/*" @change="handleFileChange" class="modal-input" :required="!editando" />
            <div v-if="imagePreview || (editando && mascota.foto)" class="flex items-center gap-3">
              <img v-if="imagePreview" :src="imagePreview" alt="Vista previa" class="modal-preview-img" />
              <img v-else-if="editando && mascota.foto" :src="`http://localhost:3000/uploads/${mascota.foto}`" alt="Actual" class="modal-preview-img" />
            </div>
            
            <label for="mascota-dueno" class="modal-label">Dueño</label>
            <!-- Autocomplete para dueño -->
            <div class="relative">
              <input 
                id="mascota-dueno"
                v-model="duenoSearch" 
                type="text" 
                placeholder="Buscar dueño *" 
                class="modal-input" 
                required
                @input="filterDuenos"
                @focus="showDuenosDropdown = true"
                @blur="handleDuenoBlur"
              />
              <div v-if="showDuenosDropdown && filteredDuenos.length > 0" class="duenos-dropdown">
                <div 
                  v-for="dueno in filteredDuenos" 
                  :key="dueno.idDueno"
                  @click="selectDueno(dueno)"
                  class="dueno-option"
                >
                  {{ dueno.nombres }} {{ dueno.apellidos }}
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="modal-btn modal-btn--cancel">Cancelar</button>
              <button type="submit" class="modal-btn">{{ editando ? 'Guardar cambios' : 'Registrar mascota' }}</button>
            </div>
            <p v-if="error" class="modal-error">{{ error }}</p>
          </form>
        </div>
      </div>
    </transition>

    <!-- Card de verificación -->
    <transition name="fade">
      <div v-if="showCard" class="modal-bg">
        <div class="modal card-modal">
          <button @click="closeCard" class="modal-close" title="Cerrar">
            <img src="../assets/close.svg" alt="Cerrar" width="32" />
          </button>
          <h3 class="modal-title">Verificación de dueño</h3>
          <div class="card-content">
            <div class="card-row"><strong>Nombre mascota:</strong> {{ mascotaCard.nombre }}</div>
            <div class="card-row"><strong>Raza:</strong> {{ mascotaCard.raza }}</div>
            <div class="card-row">
              <strong>Foto:</strong><br />
              <img :src="`http://localhost:3000/uploads/${mascotaCard.foto}`" alt="Foto" class="w-24 h-24 object-cover rounded mt-2" />
            </div>
            <div class="card-row"><strong>Dueño:</strong> {{ mascotaCard.duenoNombre }}</div>

            <!-- Mostrar combobox solo si la mascota tiene citas -->
            <div v-if="mascotaCard.tieneCitas" class="card-row">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="esDuenoVerificado" />
                Confirmo que esta persona es el dueño de la mascota
              </label>
            </div>

            <!-- Mostrar mensaje si no tiene citas -->
            <div v-else class="card-row">
              <p class="text-gray-600 italic">Esta mascota no tiene citas asignadas.</p>
            </div>

            <div class="flex justify-end pt-2">
              <button 
                v-if="mascotaCard.tieneCitas" 
                class="modal-btn" 
                :disabled="!esDuenoVerificado" 
                @click="confirmarVerificacion"
              >
                Confirmar verificación
              </button>
              <button v-else class="modal-btn" @click="closeCard">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style src="../styles/table.css"></style>
<style src="../styles/mascotas.css"></style>
<style src="../styles/modal.css"></style>

<style scoped>
.card-modal {
  min-width: 320px;
  max-width: 440px;
  padding: 2rem 1.5rem;
}
.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.card-row {
  font-size: 1.05rem;
  color: var(--color2);
  background: #f7f7fa;
  padding: 0.7rem 1rem;
  border-radius: 0.5rem;
}

/* Ajustar el tamaño de las imágenes de mascotas */
.mascota-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

/* Ajustar el tamaño de las imágenes en la card de verificación */
.card-modal img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
}

/* Tamaño uniforme de preview en modal de registro/edición */
.modal-preview-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

/* Autocomplete dropdown styles */
.duenos-dropdown {
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

.dueno-option {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
}

.dueno-option:hover {
  background-color: #f9fafb;
}

.dueno-option:last-child {
  border-bottom: none;
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
</style>

<script>
import axios from 'axios';
import { ref, onMounted, computed, watch } from 'vue';

    export default {
  name: 'Mascotas',
  setup() {
    const mascotas = ref([]);
    const isLoading = ref(true);
    const duenos = ref([]);
    const search = ref('');
    const showModal = ref(false);
    const editando = ref(false);
    const mascota = ref({ nombre: '', raza: '', foto: '', idDueno: '' });
    const idEditando = ref(null);
    const error = ref('');
    const currentPage = ref(1);
    const pageSize = ref(10);
    const selectedFile = ref(null);
    const imagePreview = ref('');

    // Autocomplete variables
    const duenoSearch = ref('');
    const showDuenosDropdown = ref(false);
    const filteredDuenos = ref([]);

    // Notifications
    const showNotification = ref(false);
    const notificationMessage = ref('');

    const showCard = ref(false);
    const mascotaCard = ref({ 
      idMascota: '', 
      nombre: '', 
      raza: '', 
      foto: '', 
      duenoNombre: '',
      tieneCitas: false,
      citas: []
    });
    const esDuenoVerificado = ref(false);

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

    // Función para filtrar dueños en el autocomplete
    const filterDuenos = () => {
      if (!duenoSearch.value.trim()) {
        filteredDuenos.value = [];
        return;
      }
      
      const searchTerm = duenoSearch.value.toLowerCase();
      filteredDuenos.value = duenos.value.filter(dueno => 
        dueno.nombres.toLowerCase().includes(searchTerm) ||
        dueno.apellidos.toLowerCase().includes(searchTerm)
      );
    };

    // Función para seleccionar un dueño del dropdown
    const selectDueno = (dueno) => {
      mascota.value.idDueno = dueno.idDueno;
      duenoSearch.value = `${dueno.nombres} ${dueno.apellidos}`;
      showDuenosDropdown.value = false;
    };

    // Función para manejar el blur del input de dueño
    const handleDuenoBlur = () => {
      setTimeout(() => {
        showDuenosDropdown.value = false;
      }, 200);
    };

    // Función para obtener las citas de una mascota específica
    const obtenerCitasMascota = async (idMascota) => {
      try {
        const res = await axios.get(`http://localhost:3000/api/servicios`);
        const citasMascota = res.data.filter(cita => cita.idMascota === idMascota);
        return citasMascota;
      } catch (error) {
        console.error('Error al obtener citas de la mascota:', error);
        return [];
      }
    };

    const viewCardMascota = async (m) => {
      // Obtener las citas de la mascota
      const citas = await obtenerCitasMascota(m.idMascota);
      
      mascotaCard.value = {
        idMascota: m.idMascota,
        nombre: m.nombre,
        raza: m.raza,
        foto: m.foto,
        duenoNombre: m.duenoNombre || 'Sin asignar',
        tieneCitas: citas.length > 0,
        citas: citas
      };
      esDuenoVerificado.value = false;
      showCard.value = true;
    };

    const closeCard = () => {
      showCard.value = false;
      mascotaCard.value = { 
        idMascota: '', 
        nombre: '', 
        raza: '', 
        foto: '', 
        duenoNombre: '',
        tieneCitas: false,
        citas: []
      };
      esDuenoVerificado.value = false;
    };

    const confirmarVerificacion = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Primero confirmar el dueño
        await axios.put(`http://localhost:3000/api/mascotas/${mascotaCard.value.idMascota}/verificar`, 
          { duenio_confirmado: true },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }
        );

        // Buscar citas con estado "Finalizado" y cambiarlas a "Entregado"
        const citasFinalizadas = mascotaCard.value.citas.filter(cita => 
          cita.estado && cita.estado.nombreEstado && 
          cita.estado.nombreEstado.toLowerCase() === 'finalizado'
        );

        if (citasFinalizadas.length > 0) {
          for (const cita of citasFinalizadas) {
            await axios.put(`http://localhost:3000/api/servicios/${cita.idServicio}/avanzar-estado`, {}, {
              headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
          }
          alert('Dueño confirmado y citas finalizadas cambiadas a entregado.');
        } else {
          alert('Dueño confirmado como correcto.');
        }
        
        closeCard();
        await fetchMascotas();
      } catch (e) {
        alert(e.response?.data?.error || e.response?.data?.mensaje || 'Error al confirmar dueño');
      }
    };

    const handleFileChange = (event) => {
      const file = event.target.files && event.target.files[0];
      selectedFile.value = file || null;
      if (file) {
        const reader = new FileReader();
        reader.onload = e => { imagePreview.value = String(e.target?.result || ''); };
        reader.readAsDataURL(file);
      } else {
        imagePreview.value = '';
      }
    };

    const fetchMascotas = async () => {
      isLoading.value = true;
      try {
        const res = await axios.get('http://localhost:3000/api/mascotas');
        mascotas.value = res.data.map(m => ({
          ...m,
          duenoNombre: m.dueno ? `${m.dueno.nombres} ${m.dueno.apellidos}` : 'Sin asignar',
          duenio_confirmado: m.duenio_confirmado || false
        }));
      } finally {
        isLoading.value = false;
      }
    };

    const fetchDuenos = async () => {
      const res = await axios.get('http://localhost:3000/api/duenos');
      duenos.value = res.data;
    };

    const openModal = () => {
      showModal.value = true;
      error.value = '';
      selectedFile.value = null;
      duenoSearch.value = '';
      filteredDuenos.value = [];
      imagePreview.value = '';
    };

    const closeModal = () => {
      showModal.value = false;
      editando.value = false;
      mascota.value = { nombre: '', raza: '', foto: '', idDueno: '' };
      error.value = '';
      selectedFile.value = null;
      duenoSearch.value = '';
      filteredDuenos.value = [];
      imagePreview.value = '';
    };

    const handleSubmit = async () => {
      error.value = '';
      if (!mascota.value.nombre || !mascota.value.raza || !mascota.value.idDueno) {
        error.value = 'Todos los campos son requeridos';
        return;
      }

      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('nombre', mascota.value.nombre);
      formData.append('raza', mascota.value.raza);
      formData.append('idDueno', mascota.value.idDueno);
      if (selectedFile.value) formData.append('foto', selectedFile.value);

      try {
        if (editando.value) {
          await axios.put(`http://localhost:3000/api/mascotas/${idEditando.value}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          showSuccessNotification('Mascota editada correctamente');
        } else {
          await axios.post('http://localhost:3000/api/mascotas/registro', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          showSuccessNotification('Mascota registrada correctamente');
        }
        closeModal();
        await fetchMascotas();
      } catch (e) {
        error.value = e.response?.data?.error || 'Error al guardar la mascota';
      }
    };

    const editMascota = (m) => {
      editando.value = true;
      idEditando.value = m.idMascota;
      mascota.value = {
        nombre: m.nombre,
        raza: m.raza,
        foto: m.foto,
        idDueno: m.idDueno
      };
      
      // Buscar el nombre del dueño para mostrarlo en el input
      const dueno = duenos.value.find(d => d.idDueno === m.idDueno);
      if (dueno) {
        duenoSearch.value = `${dueno.nombres} ${dueno.apellidos}`;
      }
      
      showModal.value = true;
      imagePreview.value = '';
    };

    const deleteMascota = async (m) => {
      if (!confirm('¿Deseas eliminar esta mascota?')) return;
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:3000/api/mascotas/${m.idMascota}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        await fetchMascotas();
        showSuccessNotification('Mascota eliminada correctamente');
      } catch (e) {
        alert(e.response?.data?.error || 'Error al eliminar mascota');
      }
    };

    const filteredMascotas = computed(() => {
      if (!search.value) return mascotas.value;
      const s = search.value.toLowerCase();
      return mascotas.value.filter(m => {
        const nombre = (m.nombre || '').toLowerCase();
        const raza = (m.raza || '').toLowerCase();
        const dueno = (m.duenoNombre || '').toLowerCase();
        return nombre.includes(s) || raza.includes(s) || dueno.includes(s);
      });
    });

    // Orden
    const sortKey = ref('nombre');
    const sortDir = ref('asc');
    const sortedMascotas = computed(() => {
      const arr = [...filteredMascotas.value];
      const dir = sortDir.value === 'asc' ? 1 : -1;
      return arr.sort((a, b) => {
        if (sortKey.value === 'nombre') return a.nombre.localeCompare(b.nombre) * dir;
        if (sortKey.value === 'raza') return a.raza.localeCompare(b.raza) * dir;
        if (sortKey.value === 'dueno') return (a.duenoNombre || '').localeCompare(b.duenoNombre || '') * dir;
        if (sortKey.value === 'confirmado') return ((a.duenio_confirmado?1:0) - (b.duenio_confirmado?1:0)) * dir;
        return 0;
      });
    });

    const totalPages = computed(() =>
      Math.max(1, Math.ceil(filteredMascotas.value.length / pageSize.value))
    );

    const paginatedMascotas = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return sortedMascotas.value.slice(start, start + pageSize.value);
    });

    const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
    const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

    watch(search, () => { currentPage.value = 1; });

    onMounted(async () => {
      await fetchMascotas();
      await fetchDuenos();
    });

      return {
      mascotas,
      duenos,
      search,
      showModal,
      mascota,
      openModal,
      closeModal,
      handleSubmit,
      editMascota,
      deleteMascota,
      error,
      editando,
      paginatedMascotas,
      currentPage,
      totalPages,
      nextPage,
      prevPage,
      handleFileChange,
      showCard,
      mascotaCard,
      esDuenoVerificado,
      viewCardMascota,
      closeCard,
      confirmarVerificacion,
       mascotaImgClass: 'mascota-img',
       isLoading,
       imagePreview,
      // Orden
      sortKey,
      sortDir,
      setSort: (key) => { sortKey.value = key; sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'; },
      sortIndicator: (key) => sortKey.value === key ? (sortDir.value === 'asc' ? '▲' : '▼') : '',
      kpiConfirmadas: computed(() => mascotas.value.filter(m => m.duenio_confirmado).length),
      kpiSinDueno: computed(() => mascotas.value.filter(m => !m.duenoNombre || m.duenoNombre === 'Sin asignar').length),
      // Autocomplete variables
      duenoSearch,
      showDuenosDropdown,
      filteredDuenos,
      filterDuenos,
      selectDueno,
      handleDuenoBlur,
      // Notifications
      showNotification,
      notificationMessage,
      hideNotification
    };
  }
};
</script>
