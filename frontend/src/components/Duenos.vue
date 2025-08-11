<template>
  <div class="duenos duenos-container">
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
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
            </svg>
            Dueños registrados
          </h1>
          <p class="page-subtitle">Administra la información de los dueños</p>
        </div>
        <button @click="openModal" class="add-button text-xs flex items-center gap-2">
          <img src="../assets/add.svg" alt="Agregar" width="20" height="20" />
          <span>Agregar dueño</span>
        </button>
      </div>
    </div>

    <div class="search-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <svg class="search-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
          </svg>
          <input v-model="search" type="text" placeholder="Buscar por nombre, apellido o email..." class="search-input" />
        </div>
      </div>
    </div>
    <div class="table-container overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm mb-8">
      <table class="table min-w-[600px] w-full text-sm text-left">
        <thead>
          <tr>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Nombres</th>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Apellidos</th>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Celular</th>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Email</th>
            <th class="px-4 sm:px-6 py-3 text-center font-semibold whitespace-nowrap">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dueno in paginatedDuenos" :key="dueno.idDueno"
            class="hover:bg-[var(--color2)/10] border-b last:border-0">
            <td class="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">{{ dueno.nombres }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ dueno.apellidos }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ dueno.celular }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ dueno.email }}</td>
            <td class="px-4 sm:px-6 py-4 text-center table-actions whitespace-nowrap">
              <button @click="editDueno(dueno)" class="icon-btn" title="Editar">
                <img src="../assets/edit.svg" alt="Editar" width="28" height="28" />
              </button>
              <button @click="viewDueno(dueno)" class="icon-btn" title="Ver">
                <img src="../assets/ver.svg" alt="Ver" width="28" height="28" />
              </button>
              <button @click="deleteDueno(dueno)" class="icon-btn icon-btn--delete" title="Eliminar">
                <img src="../assets/delete.svg" alt="Eliminar" width="28" height="28" />
              </button>
            </td>
          </tr>
          <tr v-if="paginatedDuenos.length === 0">
            <td colspan="5" class="table-empty">No se encontraron dueños.</td>
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
          <h3 class="modal-title">{{ editando ? 'Editar dueño' : 'Registrar nuevo dueño' }}</h3>
          <form @submit.prevent="handleSubmit" class="modal-form">
            <div class="modal-row">
              <div class="flex-1 min-w-0">
                <label for="dueno-nombres" class="modal-label">Nombres</label>
                <input id="dueno-nombres" v-model="nuevo.nombres" type="text" placeholder="Nombres *" class="modal-input" required />
              </div>
              <div class="flex-1 min-w-0">
                <label for="dueno-apellidos" class="modal-label">Apellidos</label>
                <input id="dueno-apellidos" v-model="nuevo.apellidos" type="text" placeholder="Apellidos *" class="modal-input" required />
              </div>
            </div>
            <label for="dueno-celular" class="modal-label">Celular</label>
            <input id="dueno-celular" v-model="nuevo.celular" type="tel" placeholder="Celular *" class="modal-input" required />
            <label for="dueno-email" class="modal-label">Email</label>
            <input id="dueno-email" v-model="nuevo.email" type="email" placeholder="Email *" class="modal-input" required />
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="modal-btn modal-btn--cancel">Cancelar</button>
              <button type="submit" class="modal-btn">{{ editando ? 'Guardar cambios' : 'Registrar dueño' }}</button>
            </div>
            <p v-if="error" class="modal-error">{{ error }}</p>
          </form>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showCard" class="modal-bg">
        <div class="modal card-modal">
          <button @click="closeCard" class="modal-close" title="Cerrar">
            <img src="../assets/close.svg" alt="Cerrar" width="32" height="32" />
          </button>
          <h3 class="modal-title">Datos del dueño</h3>
          <div class="card-content">
            <div class="card-row"><strong>Nombres:</strong> {{ duenoCard.nombres }}</div>
            <div class="card-row"><strong>Apellidos:</strong> {{ duenoCard.apellidos }}</div>
            <div class="card-row"><strong>Celular:</strong> {{ duenoCard.celular || 'No registrado' }}</div>
            <div class="card-row"><strong>Email:</strong> {{ duenoCard.email || 'No registrado' }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style src="../styles/table.css"></style>
<style src="../styles/duenos.css"></style>
<style src="../styles/modal.css"></style>

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

.card-modal {
  min-width: 320px;
  max-width: 400px;
  padding: 2rem 1.5rem;
}
.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.card-row {
  font-size: 1.1rem;
  color: var(--color2);
  background: #f7f7fa;
  padding: 0.7rem 1rem;
  border-radius: 0.5rem;
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
import { ref, computed, onMounted, watch } from 'vue';
import { getDuenos } from '../services/dueno';
import axios from 'axios';

export default {
  name: 'Duenos',
  setup() {
    const duenos = ref([]);
    const search = ref('');
    const error = ref('');
    const showModal = ref(false);
    const editando = ref(false);
    const idEditando = ref(null);
    const nuevo = ref({ nombres: '', apellidos: '', celular: '', email: '' });
    // Card modal
    const showCard = ref(false);
    const duenoCard = ref({ nombres: '', apellidos: '', celular: '', email: '' });
    // Paginación
    const currentPage = ref(1);
    const pageSize = ref(10);
    // Notifications
    const showNotification = ref(false);
    const notificationMessage = ref('');

    const fetchDuenos = async () => {
      duenos.value = await getDuenos();
    };

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

    const openModal = () => {
      showModal.value = true;
      error.value = '';
    };
    const closeModal = () => {
      showModal.value = false;
      editando.value = false;
      idEditando.value = null;
      nuevo.value = { nombres: '', apellidos: '', celular: '', email: '' };
      error.value = '';
    };

    const viewDueno = (dueno) => {
      duenoCard.value = { ...dueno };
      showCard.value = true;
    };
    const closeCard = () => {
      showCard.value = false;
      duenoCard.value = { nombres: '', apellidos: '', celular: '', email: '' };
    };

    const handleSubmit = async () => {
      error.value = '';

      // Validación de campos requeridos
      if (!nuevo.value.nombres.trim() || !nuevo.value.apellidos.trim()) {
        error.value = 'Los campos nombres y apellidos son requeridos.';
        return;
      }

      // Validación de celular (requerido y formato)
      if (!nuevo.value.celular.trim()) {
        error.value = 'El campo celular es requerido.';
        return;
      }

      if (!/^\d{10}$/.test(nuevo.value.celular.trim())) {
        error.value = 'El celular debe contener exactamente 10 dígitos numéricos.';
        return;
      }

      // Validación de email (requerido y formato)
      if (!nuevo.value.email.trim()) {
        error.value = 'El campo email es requerido.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(nuevo.value.email.trim())) {
        error.value = 'El formato del email no es válido.';
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (editando.value) {
          await axios.put(`http://localhost:3000/api/duenos/${idEditando.value}`, nuevo.value, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          showSuccessNotification('Dueño editado correctamente');
        } else {
          await axios.post('http://localhost:3000/api/duenos/registro', nuevo.value, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          showSuccessNotification('Dueño registrado correctamente');
        }
        closeModal();
        await fetchDuenos();
      } catch (e) {
        error.value = e.response?.data?.error || 'Error al guardar dueño';
      }
    };

    const editDueno = (dueno) => {
      editando.value = true;
      idEditando.value = dueno.idDueno;
      nuevo.value = { nombres: dueno.nombres, apellidos: dueno.apellidos, celular: dueno.celular, email: dueno.email };
      showModal.value = true;
    };

    const deleteDueno = async (dueno) => {
      if (!confirm('¿Seguro que deseas eliminar este dueño?')) return;
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/duenos/${dueno.idDueno}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        await fetchDuenos();
        showSuccessNotification('Dueño eliminado correctamente');
      } catch (e) {
        alert(e.response?.data?.error || 'Error al eliminar dueño');
      }
    };

    onMounted(fetchDuenos);

    const filteredDuenos = computed(() => {
      if (!search.value) return duenos.value;
      const s = search.value.toLowerCase();
      return duenos.value.filter(d =>
        d.nombres.toLowerCase().includes(s) ||
        d.apellidos.toLowerCase().includes(s) ||
        (d.email && d.email.toLowerCase().includes(s))
      );
    });

    const sortKey = ref('nombres');
    const sortDir = ref('asc');
    const sortedDuenos = computed(() => {
      const arr = [...filteredDuenos.value];
      const dir = sortDir.value === 'asc' ? 1 : -1;
      return arr.sort((a,b)=> (a[sortKey.value]||'').localeCompare(b[sortKey.value]||'') * dir);
    });

    const totalPages = computed(() => {
      return Math.max(1, Math.ceil(filteredDuenos.value.length / pageSize.value));
    });

    const paginatedDuenos = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return sortedDuenos.value.slice(start, start + pageSize.value);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };
    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    // Reset página al buscar
    watch(search, () => {
      currentPage.value = 1;
    });

    return {
      duenos,
      search,
      filteredDuenos,
      paginatedDuenos,
      currentPage,
      totalPages,
      nextPage,
      prevPage,
      showModal,
      openModal,
      closeModal,
      nuevo,
      handleSubmit,
      error,
      editando,
      editDueno,
      deleteDueno,
      showCard, 
      duenoCard, 
      viewDueno, 
      closeCard,
      showNotification,
      notificationMessage,
      hideNotification
    };
  }
};
</script>