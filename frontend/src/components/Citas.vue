<template>
  <div class="duenos-bg flex flex-col gap-8 px-6 pt-10 pb-8 sm:px-20 sm:pt-16 sm:pb-12 min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl sm:text-3xl font-bold text-[var(--color2)]">Citas agendadas</h2>
      <button @click="openModal" class="btn text-xs flex items-center gap-1 w-full sm:w-auto py-3 sm:py-2">
        <img src="../assets/add.svg" alt="Agregar" width="20" height="20" class="inline-block align-middle" />
        <span class="inline-block align-middle">Agregar cita</span>
      </button>
    </div>
    <div class="mb-8">
      <div class="flex flex-wrap gap-2 sm:gap-4 items-center">
        <div class="flex-1 min-w-[220px]">
          <input v-model="search" type="text" placeholder="Buscar por referencia, mascota, usuario..." class="duenos-input w-full" />
        </div>
        <div class="flex-shrink-0">
          <input v-model="searchFecha" type="date" class="duenos-input w-[170px]" />
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
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Usuario</th>
            <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Estado</th>
            <th class="px-4 sm:px-6 py-3 text-center font-semibold whitespace-nowrap">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cita in paginatedCitas" :key="cita.idServicio" class="hover:bg-[var(--color2)/10] border-b last:border-0">
            <td class="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">{{ cita.fechaRegistro }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ cita.referencia }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ cita.mascota }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ cita.usuario }}</td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ cita.estado }}</td>
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
              <input v-model="form.fechaRegistro" type="date" placeholder="Fecha *" class="modal-input" required />
              <input v-model="form.referencia" type="text" placeholder="Referencia *" class="modal-input" required />
            </div>
            <select v-model="form.idMascota" class="modal-input" required>
              <option value="" disabled>Selecciona una mascota</option>
              <option v-for="m in mascotas" :key="m.id" :value="m.id">{{ m.nombre }}</option>
            </select>
            <input
              class="modal-input"
              type="text"
              :value="usuarios.length ? usuarios[0].nombre : ''"
              readonly
              tabindex="-1"
            />
            <div v-if="!editando" class="text-xs text-gray-500 mb-2">El usuario guardado será el actual de la sesión</div>
            <select v-model="form.idEstadoActual" class="modal-input" required :disabled="!editando">
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

    const openModal = () => {
      showModal.value = true;
      error.value = '';
      editando.value = false;
      idEditando.value = null;
      const user = currentUser.value;
      form.value = { fechaRegistro: '', referencia: '', idMascota: '', idUsuario: user && user.id ? Number(user.id) : null, idEstadoActual: 1 };
    };
    const closeModal = () => {
      showModal.value = false;
      editando.value = false;
      idEditando.value = null;
      form.value = { fechaRegistro: '', referencia: '', idMascota: '', idUsuario: '', idEstadoActual: '' };
      error.value = '';
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
        } else {
          await axios.post('http://localhost:3000/api/servicios', form.value);
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
      showModal.value = true;
    };

    const deleteCita = async (cita) => {
      if (!confirm('¿Seguro que deseas eliminar esta cita?')) return;
      try {
        await axios.delete(`http://localhost:3000/api/servicios/${cita.idServicio}`);
        await fetchCitas();
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
      return arr;
    });

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
      estados
    };
  }
};
</script>

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