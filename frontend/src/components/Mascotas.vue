<template>
  <div class="duenos-bg flex flex-col gap-8 px-6 pt-10 pb-8 sm:px-20 sm:pt-16 sm:pb-12 min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl sm:text-3xl font-bold text-[var(--color2)]">Mascotas registradas</h2>
      <button @click="openModal" class="btn text-xs flex items-center gap-1 w-full sm:w-auto py-3 sm:py-2">
        <img src="../assets/add.svg" alt="Agregar" width="20" height="20" />
        <span>Agregar mascota</span>
      </button>
    </div>

    <div class="mb-8">
      <input v-model="search" type="text" placeholder="Buscar por nombre o raza..." class="duenos-input" />
    </div>

    <div class="table-container overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm mb-8">
      <table class="table min-w-[600px] w-full text-sm text-left">
        <thead>
          <tr>
            <th class="px-4 py-3 font-semibold">Nombre</th>
            <th class="px-4 py-3 font-semibold">Raza</th>
            <th class="px-4 py-3 font-semibold">Foto</th>
            <th class="px-4 py-3 font-semibold">Dueño</th>
            <th class="px-4 py-3 text-center font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in paginatedMascotas" :key="m.id" class="hover:bg-[var(--color2)/10] border-b last:border-0">
            <td class="px-4 py-4 font-medium">{{ m.nombre }}</td>
            <td class="px-4 py-4">{{ m.raza }}</td>
            <td class="px-4 py-4">
              <img :src="m.foto" alt="Foto" class="w-12 h-12 object-cover rounded" />
            </td>
            <td class="px-4 py-4">{{ m.duenoNombre || 'Sin asignar' }}</td>
            <td class="px-4 py-4 text-center">
              <button @click="editMascota(m)" class="icon-btn" title="Editar">
                <img src="../assets/edit.svg" alt="Editar" width="28" />
              </button>
              <button @click="deleteMascota(m)" class="icon-btn icon-btn--delete" title="Eliminar">
                <img src="../assets/delete.svg" alt="Eliminar" width="28" />
              </button>
            </td>
          </tr>
          <tr v-if="paginatedMascotas.length === 0">
            <td colspan="5" class="table-empty">No se encontraron mascotas.</td>
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
          <button @click="closeModal" class="modal-close">
            <img src="../assets/close.svg" alt="Cerrar" width="32" />
          </button>
          <h3 class="modal-title">{{ editando ? 'Editar mascota' : 'Registrar nueva mascota' }}</h3>
          <form @submit.prevent="handleSubmit" class="modal-form">
            <input v-model="mascota.nombre" type="text" placeholder="Nombre *" class="modal-input" required />
            <input v-model="mascota.raza" type="text" placeholder="Raza *" class="modal-input" required />
            <input v-model="mascota.foto" type="url" placeholder="URL de la foto *" class="modal-input" required />
            <select v-model="mascota.idDueno" class="modal-input" required>
              <option disabled value="">Seleccionar dueño</option>
              <option v-for="d in duenos" :key="d.idDueno" :value="d.idDueno">
                {{ d.nombres }} {{ d.apellidos }}
              </option>
            </select>
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="modal-btn modal-btn--cancel">Cancelar</button>
              <button type="submit" class="modal-btn">{{ editando ? 'Guardar cambios' : 'Registrar mascota' }}</button>
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

<script>
import axios from 'axios';
import { ref, onMounted, computed, watch } from 'vue';

export default {
  name: 'Mascotas',
  setup() {
    const mascotas = ref([]);
    const duenos = ref([]);
    const search = ref('');
    const showModal = ref(false);
    const editando = ref(false);
    const mascota = ref({ nombre: '', raza: '', foto: '', idDueno: '' });
    const idEditando = ref(null);
    const error = ref('');
    const currentPage = ref(1);
    const pageSize = ref(10);

    const fetchMascotas = async () => {
      const res = await axios.get('http://localhost:3000/api/mascotas');
      mascotas.value = res.data.map(m => ({
        ...m,
        duenoNombre: m.dueno ? `${m.dueno.nombres} ${m.dueno.apellidos}` : 'Sin asignar'
      }));
    };

    const fetchDuenos = async () => {
      const res = await axios.get('http://localhost:3000/api/duenos');
      duenos.value = res.data;
    };

    const openModal = () => {
      showModal.value = true;
      error.value = '';
    };

    const closeModal = () => {
      showModal.value = false;
      editando.value = false;
      mascota.value = { nombre: '', raza: '', foto: '', idDueno: '' };
      error.value = '';
    };

    const handleSubmit = async () => {
      error.value = '';
      if (!mascota.value.nombre || !mascota.value.raza || !mascota.value.foto || !mascota.value.idDueno) {
        error.value = 'Todos los campos son requeridos';
        return;
      }
      const token = localStorage.getItem('token');
      try {
        if (editando.value) {
          await axios.put(`http://localhost:3000/api/mascotas/${idEditando.value}`, mascota.value, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
        } else {
          await axios.post('http://localhost:3000/api/mascotas/registro', mascota.value, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          alert('Mascota registrada con éxito');
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
      showModal.value = true;
    };

    const deleteMascota = async (m) => {
      if (!confirm('¿Deseas eliminar esta mascota?')) return;
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:3000/api/mascotas/${m.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        await fetchMascotas();
      } catch (e) {
        alert(e.response?.data?.error || 'Error al eliminar mascota');
      }
    };

    const filteredMascotas = computed(() => {
      if (!search.value) return mascotas.value;
      const s = search.value.toLowerCase();
      return mascotas.value.filter(m =>
        m.nombre.toLowerCase().includes(s) ||
        m.raza.toLowerCase().includes(s)
      );
    });

    const totalPages = computed(() =>
      Math.max(1, Math.ceil(filteredMascotas.value.length / pageSize.value))
    );

    const paginatedMascotas = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return filteredMascotas.value.slice(start, start + pageSize.value);
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
      prevPage
    };
  }
};
</script>
