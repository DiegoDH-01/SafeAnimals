<template>
    <div class="duenos-bg flex flex-col gap-8 px-6 pt-10 pb-8 sm:px-20 sm:pt-16 sm:pb-12 min-h-screen">
        <!-- Success Notification -->
        <transition name="fade">
            <div v-if="showNotification" class="notification notification--success">
                <span>{{ notificationMessage }}</span>
                <button @click="hideNotification" class="notification-close">
                    <img src="../assets/close.svg" alt="Cerrar" width="16" height="16" />
                </button>
            </div>
        </transition>

        <div class="historial">
        <div class="header-section" style="border-radius: 20px;">
            <div class="header-content">
                <div class="header-left">
                    <h1 class="page-title">
                        <svg class="title-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                        </svg>
                        Reporte Diario de Entregas
                    </h1>
                    <p class="page-subtitle">Servicios finalizados y entregados</p>
                </div>
            </div>
        </div>
        </div>

        <div class="table-container overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm mb-8">
            <table class="table min-w-[600px] w-full text-sm text-left">
                <thead>
                    <tr>
                        <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Fecha de Finalizado</th>
                        <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Referencia</th>
                        <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Mascota</th>
                        <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Usuario</th>
                        <th class="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Estado</th>
                        <th class="px-4 sm:px-6 py-3 text-center font-semibold whitespace-nowrap">Reporte</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cita in paginatedCitas" :key="cita.idServicio"
                        class="hover:bg-[var(--color2)/10] border-b last:border-0">
                        <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ cita.fechaRegistro }}</td>
                        <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ cita.referencia }}</td>
                        <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ cita.mascota }}</td>
                        <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ cita.usuario }}</td>
                        <td class="px-4 sm:px-6 py-4 whitespace-nowrap">{{ cita.estado }}</td>
                        <td class="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                            <button @click="() => generarReporte(cita)" class="text-blue-600 hover:text-blue-800"
                                title="Generar Reporte">
                                <img src="../assets/logo.png" alt="Generar Reporte" class="w-6 h-6 inline-block" width="28" height="28" />
                            </button>
                        </td>
                    </tr>
                    <tr v-if="paginatedCitas.length === 0">
                        <td colspan="6" class="table-empty">No se encontraron entregas hoy.</td>
                    </tr>
                </tbody>
            </table>

            <div v-if="totalPages > 1" class="table-pagination">
                <button @click="prevPage" :disabled="currentPage === 1" class="table-pagination-btn">Anterior</button>
                <span class="table-pagination-info">Página {{ currentPage }} de {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="table-pagination-btn">Siguiente</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getCitasEntregadasHoy } from '../services/cita';
import { getReporteServicioEntregado } from '../services/cita';
import { generarReportePDF } from '../utils/pdfReporteServicio';

export default {
    created() {
    },
    name: 'ReporteEntregas',
    setup() {
        const citas = ref([]);
        const currentPage = ref(1);
        const pageSize = ref(10);

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

        const fetchCitas = async () => {
            citas.value = await getCitasEntregadasHoy();
        };

        const paginatedCitas = computed(() => {
            const start = (currentPage.value - 1) * pageSize.value;
            return citas.value.slice(start, start + pageSize.value);
        });

        const totalPages = computed(() => {
            return Math.max(1, Math.ceil(citas.value.length / pageSize.value));
        });

        const nextPage = () => {
            if (currentPage.value < totalPages.value) currentPage.value++;
        };

        const prevPage = () => {
            if (currentPage.value > 1) currentPage.value--;
        };

        const generarReporte = async (cita) => {
            try {
                const servicio = await getReporteServicioEntregado(cita.idServicio);
                if (servicio) {
                    generarReportePDF(servicio);
                    showSuccessNotification('Reporte ha sido generado');
                } else {
                    alert('No se pudo generar el reporte.');
                }
            } catch (error) {
                console.error('Error al generar reporte:', error);
                alert('Error al generar el reporte.');
            }
        };

        onMounted(fetchCitas);

        return {
            citas,
            paginatedCitas,
            currentPage,
            totalPages,
            nextPage,
            prevPage,
            generarReporte,
            // Notifications
            showNotification,
            notificationMessage,
            hideNotification
        };
    }
};
</script>

<style src="../styles/table.css"></style>
<style src="../styles/headers.css"></style>
<style scoped>
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
