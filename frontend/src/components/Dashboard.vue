<template>
  <div class="min-h-screen flex flex-col bg-[var(--color-bg)]">
    <Navbar
      class="shrink-0"
      @toggle-sidebar="toggleSidebar"
      :username="username"
      :role="role"
      @logout="handleLogout"
    >
      <template #logo>
        <img src="../assets/logo.png" alt="Logo Safe Animals" class="max-w-[120px] h-auto" />
      </template>
    </Navbar>
    <div class="flex flex-1 min-h-0 flex-row max-[900px]:flex-col">
      <Sidebar
        class="shrink-0"
        :show="sidebarOpen || !isMobile"
        :isMobile="isMobile"
        @close="sidebarOpen = false"
        @selectMenu="selectedMenu = $event"
        :selectedMenu="selectedMenu"
      />
      <main class="flex-1 flex flex-col justify-start min-w-0 min-h-[400px] bg-[var(--color-form-bg)] rounded-[18px] m-8 mr-0 p-10 shadow-[0_6px_32px_0_rgba(89,38,63,0.10)] max-[900px]:m-4 max-[900px]:rounded-[12px] max-[900px]:p-3 max-[600px]:m-2 max-[600px]:rounded-[8px] max-[600px]:p-1">
        <template v-if="selectedMenu === 'duenos'">
          <Duenos />
        </template>
        <template v-else>
          <h1 class="text-[var(--color2)] font-bold tracking-wide mb-6 text-center">Bienvenido al Dashboard de Safe Animals</h1>
          <p>Aquí irá el contenido principal del sistema.</p>
        </template>
      </main>
    </div>
    <Footer class="shrink-0" />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';
import Footer from './Footer.vue';
import Duenos from './Duenos.vue';
import { getCurrentUser, logout } from '../services/auth.js';

export default {
  name: 'Dashboard',
  components: {
    Navbar,
    Sidebar,
    Footer,
    Duenos
  },
  setup() {
    const sidebarOpen = ref(false);
    const isMobile = ref(window.innerWidth <= 900);
    const username = ref('');
    const role = ref('');
    const selectedMenu = ref('inicio');

    const handleResize = () => {
      isMobile.value = window.innerWidth <= 900;
      if (!isMobile.value) sidebarOpen.value = false;
    };

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };

    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          username.value = user.nombres || user.username || 'Usuario';
          role.value = user.rol || user.role || 'Rol';
        } else {
          window.location.href = '/';
        }
      } catch (err) {
        window.location.href = '/';
      }
    };

    const handleLogout = () => {
      logout();
      window.location.href = '/';
    };

    onMounted(() => {
      window.addEventListener('resize', handleResize);
      fetchUser();
    });
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
    });

    return { sidebarOpen, isMobile, toggleSidebar, username, role, handleLogout, selectedMenu };
  }
};
</script>

