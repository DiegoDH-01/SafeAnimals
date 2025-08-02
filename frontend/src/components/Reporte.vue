<template>
    <div class="duenos-bg flex flex-col gap-8 px-6 pt-10 pb-8 sm:px-20 sm:pt-16 sm:pb-12 min-h-screen">
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl sm:text-3xl font-bold text-[var(--color2)]">Reporte Diario de Entregas</h2>
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
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 inline-block" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4m0 4h.01M5 13l4 4L19 7" />
                                </svg>
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
            alert(`Generando PDF para servicio #${cita.idServicio}`);
            const servicio = await getReporteServicioEntregado(cita.idServicio);
            if (servicio) {
                generarReportePDF(servicio);
            } else {
                alert('No se pudo generar el reporte.');
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
            generarReporte
        };
    }
};
</script>

<style src="../styles/table.css"></style>
