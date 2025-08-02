<template>
    <div class="notificaciones-bg flex flex-col gap-8 px-6 pt-10 pb-20 sm:px-20 sm:pt-16 sm:pb-28 min-h-screen">
        <div class="flex justify-between items-center mt-4 mb-2">
            <h2 class="text-2xl sm:text-3xl font-bold text-[var(--color2)]">Notificaciones</h2>
        </div>

        <!-- Buscador estilizado y centrado -->
        <div class="buscador-container">
            <div class="buscador-wrapper">
                <svg class="buscador-icon" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
                    <path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                <input v-model="busqueda" type="text" placeholder="Buscar por nombre, referencia o dueño..."
                    class="buscador-input" />
            </div>
        </div>



        <div v-if="notificacionesFiltradas.length === 0" class="text-center text-gray-500">No hay notificaciones.</div>

        <div ref="scrollContainer" class="noti-scroll-container" @mousedown="startDrag" @mousemove="onDrag"
            @mouseup="stopDrag" @mouseleave="stopDrag">
            <div class="noti-cards-wrapper">
                <div v-for="n in notificacionesFiltradas" :key="n.idNotificacion" class="noti-card">
                    <div class="flex items-center gap-4 mb-2 pb-2 border-b border-[var(--color2)/10]">
                        <img v-if="n.servicio?.mascota?.foto" :src="n.servicio.mascota.foto" alt="Mascota"
                            class="noti-img" />
                        <div>
                            <div class="font-bold text-xl leading-tight">{{ n.servicio?.mascota?.nombre || 'Mascota' }}
                            </div>
                            <div class="text-xs text-gray-500 italic">{{ n.servicio?.mascota?.raza }}</div>
                        </div>
                    </div>

                    <div class="noti-msg">{{ n.mensaje }}</div>

                    <div class="flex flex-wrap justify-between items-center text-xs text-gray-500 mb-1">
                        <span><i class="fa-regular fa-clock mr-1"></i>{{ formatFecha(n.fechaEnvio) }}</span>
                        <span
                            class="px-2 py-1 rounded bg-green-100 text-green-700 font-semibold tracking-wide shadow-sm">
                            {{ n.medio }}
                        </span>
                    </div>

                    <div class="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-1">
                        <span class="font-semibold text-gray-400">Referencia:</span>
                        <span>{{ n.servicio?.referencia }}</span>
                    </div>

                    <div class="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        <span class="font-semibold text-gray-400">Dueño:</span>
                        <span>{{ n.servicio?.mascota?.dueno?.nombres }} {{ n.servicio?.mascota?.dueno?.apellidos
                        }}</span>
                    </div>
                </div>
            </div>
        </div>

        <p v-if="error" class="modal-error mt-4">{{ error }}</p>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
    name: 'Notificaciones',
    setup() {
        const notificaciones = ref([]);
        const error = ref('');
        const busqueda = ref('');

        const scrollContainer = ref(null);
        const isDragging = ref(false);
        const startX = ref(0);
        const scrollLeft = ref(0);

        const fetchNotificaciones = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/notificaciones');
                notificaciones.value = Array.isArray(res.data) ? res.data : [];
            } catch (e) {
                error.value =
                    e.response?.data?.mensaje || e.response?.data?.message || 'Error al cargar notificaciones';
            }
        };

        const formatFecha = (fecha) => {
            if (!fecha) return '';
            const d = new Date(fecha);
            return d.toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' });
        };

        const startDrag = (e) => {
            isDragging.value = true;
            startX.value = e.pageX - scrollContainer.value.offsetLeft;
            scrollLeft.value = scrollContainer.value.scrollLeft;
        };

        const onDrag = (e) => {
            if (!isDragging.value) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.value.offsetLeft;
            const walk = (x - startX.value) * 1.3;
            scrollContainer.value.scrollLeft = scrollLeft.value - walk;
        };

        const stopDrag = () => {
            isDragging.value = false;
        };

        const notificacionesFiltradas = computed(() => {
            const b = busqueda.value.toLowerCase();
            return notificaciones.value.filter((n) => {
                const nombre = n.servicio?.mascota?.nombre?.toLowerCase() || '';
                const ref = n.servicio?.referencia?.toLowerCase() || '';
                const duenio = `${n.servicio?.mascota?.dueno?.nombres || ''} ${n.servicio?.mascota?.dueno?.apellidos || ''}`.toLowerCase();
                return nombre.includes(b) || ref.includes(b) || duenio.includes(b);
            });
        });

        onMounted(fetchNotificaciones);

        return {
            notificaciones,
            notificacionesFiltradas,
            error,
            formatFecha,
            busqueda,
            scrollContainer,
            startDrag,
            onDrag,
            stopDrag
        };
    }
};
</script>

<style scoped>
.notificaciones-bg {
    background: #f8f9fb;
}

/* Input */
input:focus {
    outline: none;
}

/* Scroll contenedor */
.noti-scroll-container {
    overflow: hidden;
    cursor: grab;
    user-select: none;
    padding-top: 0.5rem;
    padding-bottom: 2rem;
    margin-top: 1.2rem;
}

.noti-scroll-container:active {
    cursor: grabbing;
}

/* Cards wrapper */
.noti-cards-wrapper {
    display: flex;
    gap: 1.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
}

/* Tarjeta */
.noti-card {
    flex: 0 0 calc(50% - 1rem);
    min-width: 320px;
    max-width: 480px;
    min-height: 360px;
    background: #f7f0f3;
    border: 1.5px solid #8b3a5e;
    border-radius: 22px;
    padding: 1.5rem;
    box-shadow: 0 2px 16px rgba(139, 58, 94, 0.13);
    transition: all 0.25s ease-in-out;
}

.noti-card:hover {
    transform: scale(1.035);
    box-shadow: 0 10px 30px rgba(139, 58, 94, 0.2);
    border-color: #a44574;
}

/* Imagen */
.noti-img {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    object-fit: cover;
    border: 2.5px solid #8b3a5e;
    background: #fff;
    box-shadow: 0 2px 8px rgba(139, 58, 94, 0.1);
}

/* Mensaje */
.noti-msg {
    font-size: 1.1rem;
    line-height: 1.5;
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid #e6d6dc;
    background: #ffffffcc;
    box-shadow: 0 1px 4px rgba(139, 58, 94, 0.05);
    margin-bottom: 0.5rem;
}

.noti-card .text-xl {
    font-size: 1.22rem;
    color: #8b3a5e;
}

.buscador-container {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
}

.buscador-wrapper {
    position: relative;
    width: 100%;
    max-width: 520px;
}

.buscador-icon {
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #8b3a5e;
    opacity: 0.75;
    pointer-events: none;
}

.buscador-input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 3rem;
    border-radius: 16px;
    background: #fffdfa;
    border: 1.5px solid #e5d2dd;
    font-size: 1.08rem;
    box-shadow: 0 2px 6px rgba(139, 58, 94, 0.06);
    transition: all 0.2s ease-in-out;
}

.buscador-input:focus {
    background: #fff;
    outline: none;
    border-color: #8b3a5e;
    box-shadow: 0 4px 12px rgba(139, 58, 94, 0.15);
}
</style>
