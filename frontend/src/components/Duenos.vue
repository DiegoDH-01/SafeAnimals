<template>
  <div class="duenos-bg flex flex-col gap-8 px-6 pt-10 pb-8 sm:px-20 sm:pt-16 sm:pb-12 min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl sm:text-3xl font-bold text-[var(--color2)]">Dueños registrados</h2>
      <button @click="openModal" class="btn text-xs flex items-center gap-1 w-full sm:w-auto py-3 sm:py-2">
        <img src="../assets/add.svg" alt="Agregar" width="20" height="20" class="inline-block align-middle" />
        <span class="inline-block align-middle">Agregar dueño</span>
      </button>
    </div>
    <div class="mb-8">
      <input v-model="search" type="text" placeholder="Buscar por nombre, apellido o email..." class="duenos-input" />
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
              <input v-model="nuevo.nombres" type="text" placeholder="Nombres *" class="modal-input" required />
              <input v-model="nuevo.apellidos" type="text" placeholder="Apellidos *" class="modal-input" required />
            </div>
            <input v-model="nuevo.celular" type="text" placeholder="Celular" class="modal-input" />
            <input v-model="nuevo.email" type="email" placeholder="Email" class="modal-input" />
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="modal-btn modal-btn--cancel">Cancelar</button>
              <button type="submit" class="modal-btn">{{ editando ? 'Guardar cambios' : 'Registrar dueño' }}</button>
            </div>
            <p v-if="error" class="modal-error">{{ error }}</p>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<style src="../styles/table.css"></style>
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
    // Paginación
    const currentPage = ref(1);
    const pageSize = ref(10);

    const fetchDuenos = async () => {
      duenos.value = await getDuenos();
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

    const handleSubmit = async () => {
      error.value = '';

      // Validación manual de campos requeridos
      if (!nuevo.value.nombres.trim() || !nuevo.value.apellidos.trim()) {
        error.value = 'Los campos nombres y apellidos son requeridos.';
        return;
      }

      if (nuevo.value.celular && !/^\d{10}$/.test(nuevo.value.celular)) {
        error.value = 'El celular debe contener exactamente 10 dígitos numéricos.';
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (editando.value) {
          await axios.put(`http://localhost:3000/api/duenos/${idEditando.value}`, nuevo.value, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
        } else {
          await axios.post('http://localhost:3000/api/duenos/registro', nuevo.value, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
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

    const totalPages = computed(() => {
      return Math.max(1, Math.ceil(filteredDuenos.value.length / pageSize.value));
    });

    const paginatedDuenos = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return filteredDuenos.value.slice(start, start + pageSize.value);
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
      deleteDueno
    };
  }
};
</script>