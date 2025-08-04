<template>
  <div class="dashboard-stats">
    <!-- Header del Dashboard -->
    <div class="header">
      <div class="header-icon">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      </div>
      <h1 class="title">Dashboard de Safe Animals</h1>
      <p class="subtitle">Estadísticas del sistema veterinario</p>
    </div>

    <!-- 4 Estadísticas Principales -->
    <div class="stats-container">
      <!-- Total Dueños -->
      <div class="stat-card">
        <div class="stat-icon blue">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Dueños</p>
          <p class="stat-number">{{ stats.totalDuenos }}</p>
        </div>
      </div>

      <!-- Total Citas -->
      <div class="stat-card">
        <div class="stat-icon green">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Citas</p>
          <p class="stat-number">{{ stats.totalCitas }}</p>
        </div>
      </div>

      <!-- Citas Pendientes -->
      <div class="stat-card">
        <div class="stat-icon orange">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Citas En Procceso</p>
          <p class="stat-number">{{ stats.citasPendientes }}</p>
        </div>
      </div>

      <!-- Citas Completadas -->
      <div class="stat-card">
        <div class="stat-icon purple">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Servicio Finalizado</p>
          <p class="stat-number">{{ stats.citasCompletadas }}</p>
        </div>
      </div>
    </div>

    <!-- Gráficas -->
    <div class="charts-container">
      <!-- Gráfica de Citas por Mes -->
      <div class="chart-card">
        <h3 class="chart-title">Citas por Mes</h3>
        <div class="chart-wrapper">
          <Line
            v-if="chartData.citasPorMes"
            :data="chartData.citasPorMes"
            :options="chartOptions.line"
          />
        </div>
      </div>

      <!-- Gráfica de Distribución de Estados -->
      <div class="chart-card">
        <h3 class="chart-title">Distribución de Estados</h3>
        <div class="chart-wrapper">
          <Doughnut
            v-if="chartData.estados"
            :data="chartData.estados"
            :options="chartOptions.doughnut"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { Line, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { getDuenos } from '../services/dueno.js';
import { getCitas } from '../services/cita.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default {
  name: 'DashboardStats',
  components: {
    Line,
    Doughnut
  },
  setup() {
    const duenos = ref([]);
    const citas = ref([]);

    const stats = computed(() => {
      const totalDuenos = duenos.value.length;
      const totalCitas = citas.value.length;
      const citasPendientes = citas.value.filter(c => c.estado === 'En proceso').length;
      const citasCompletadas = citas.value.filter(c => c.estado === 'Finalizado').length;

      return {
        totalDuenos,
        totalCitas,
        citasPendientes,
        citasCompletadas
      };
    });

    const chartData = computed(() => {
      // Datos para gráfica de citas por mes
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const citasPorMes = new Array(12).fill(0);
      
      citas.value.forEach(cita => {
        const fecha = new Date(cita.fechaRegistro);
        citasPorMes[fecha.getMonth()]++;
      });

      // Datos para gráfica de estados
      const estadosCount = {};
      citas.value.forEach(cita => {
        estadosCount[cita.estado] = (estadosCount[cita.estado] || 0) + 1;
      });

      return {
        citasPorMes: {
          labels: meses,
          datasets: [{
            label: 'Citas',
            data: citasPorMes,
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 3,
            pointBackgroundColor: '#8B5CF6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        estados: {
          labels: Object.keys(estadosCount),
          datasets: [{
            data: Object.values(estadosCount),
            backgroundColor: [
              '#10B981',
              '#F59E0B',
              '#EF4444',
              '#3B82F6',
              '#8B5CF6',
              '#EC4899'
            ],
            borderWidth: 3,
            borderColor: '#ffffff',
            hoverBorderWidth: 4
          }]
        }
      };
    });

    const chartOptions = {
      line: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#8B5CF6',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: '#ffffff',
              font: {
                size: 12
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#ffffff',
              font: {
                size: 12
              }
            }
          }
        }
      },
      doughnut: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              },
              color: '#ffffff'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#EC4899',
            borderWidth: 1,
            cornerRadius: 8
          }
        }
      }
    };

    const fetchData = async () => {
      try {
        const [duenosData, citasData] = await Promise.all([
          getDuenos(),
          getCitas()
        ]);
        duenos.value = duenosData;
        citas.value = citasData;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      stats,
      chartData,
      chartOptions
    };
  }
};
</script>

<style scoped>
.dashboard-stats {
  min-height: 100vh;
  background: linear-gradient(135deg, #3b0a22 0%, #da7a7a 50%, #7F1D1D 100%);
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.header-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.header .icon {
  width: 40px;
  height: 40px;
  color: white;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto 3rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.blue {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.stat-icon.green {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-icon.orange {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-icon.purple {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.stat-icon .icon {
  width: 28px;
  height: 28px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.chart-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.chart-title {
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.chart-wrapper {
  height: 300px;
  position: relative;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-stats {
    padding: 1rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .charts-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
  }
  
  .stat-icon .icon {
    width: 24px;
    height: 24px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .chart-wrapper {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .header-icon {
    width: 60px;
    height: 60px;
  }
  
  .header .icon {
    width: 30px;
    height: 30px;
  }
  
  .title {
    font-size: 1.75rem;
  }
  
  .chart-wrapper {
    height: 200px;
  }
}
</style> 