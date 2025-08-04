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
            <th class="px-4 py-3 font-semibold">Dueño Confirmado</th>
            <th class="px-4 py-3 text-center font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
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
            <td class="px-4 py-4 text-center">
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
          <tr v-if="paginatedMascotas.length === 0">
            <td colspan="6" class="table-empty">No se encontraron mascotas.</td>
          </tr>
        </tbody>
      </table>

      <div v-if="totalPages > 1" class="table-pagination">
        <button @click="prevPage" :disabled="currentPage === 1" class="table-pagination-btn">Anterior</button>
        <span class="table-pagination-info">Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="table-pagination-btn">Siguiente</button>
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
          <form @submit.prevent="handleSubmit" class="modal-form">
            <input v-model="mascota.nombre" type="text" placeholder="Nombre *" class="modal-input" required />
            <input v-model="mascota.raza" type="text" placeholder="Raza *" class="modal-input" required />
            <input type="file" accept="image/*" @change="handleFileChange" class="modal-input" :required="!editando" />
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

            <div class="card-row">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="esDuenoVerificado" />
                Confirmo que esta persona es el dueño de la mascota
              </label>
            </div>

            <div class="flex justify-end pt-2">
              <button class="modal-btn" :disabled="!esDuenoVerificado" @click="confirmarVerificacion">
                Confirmar verificación
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style src="../styles/table.css"></style>
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
</style>

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
    const selectedFile = ref(null);

    const showCard = ref(false);
    const mascotaCard = ref({ idMascota: '', nombre: '', raza: '', foto: '', duenoNombre: '' });
    const esDuenoVerificado = ref(false);

    const viewCardMascota = (m) => {
      mascotaCard.value = {
        idMascota: m.idMascota,
        nombre: m.nombre,
        raza: m.raza,
        foto: m.foto,
        duenoNombre: m.duenoNombre || 'Sin asignar'
      };
      esDuenoVerificado.value = false;
      showCard.value = true;
    };

    const closeCard = () => {
      showCard.value = false;
      mascotaCard.value = { idMascota: '', nombre: '', raza: '', foto: '', duenoNombre: '' };
      esDuenoVerificado.value = false;
    };

    const confirmarVerificacion = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:3000/api/mascotas/${mascotaCard.value.idMascota}/verificar`, 
          { duenio_confirmado: true },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
        alert('Dueño confirmado como correcto.');
        closeCard();
        await fetchMascotas();
      } catch (e) {
        alert(e.response?.data?.error || 'Error al confirmar dueño');
      }
    };

    const handleFileChange = (event) => {
      selectedFile.value = event.target.files[0];
    };

    const fetchMascotas = async () => {
      const res = await axios.get('http://localhost:3000/api/mascotas');
      mascotas.value = res.data.map(m => ({
        ...m,
        duenoNombre: m.dueno ? `${m.dueno.nombres} ${m.dueno.apellidos}` : 'Sin asignar',
        duenio_confirmado: m.duenio_confirmado || false
      }));
    };

    const fetchDuenos = async () => {
      const res = await axios.get('http://localhost:3000/api/duenos');
      duenos.value = res.data;
    };

    const openModal = () => {
      showModal.value = true;
      error.value = '';
      selectedFile.value = null;
    };

    const closeModal = () => {
      showModal.value = false;
      editando.value = false;
      mascota.value = { nombre: '', raza: '', foto: '', idDueno: '' };
      error.value = '';
      selectedFile.value = null;
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
        } else {
          await axios.post('http://localhost:3000/api/mascotas/registro', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
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
        await axios.delete(`http://localhost:3000/api/mascotas/${m.idMascota}`, {
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
        m.nombre.toLowerCase().includes(s) || m.raza.toLowerCase().includes(s)
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
      prevPage,
      handleFileChange,
      showCard,
      mascotaCard,
      esDuenoVerificado,
      viewCardMascota,
      closeCard,
      confirmarVerificacion,
      mascotaImgClass: 'mascota-img',
    };
  }
};
</script>
