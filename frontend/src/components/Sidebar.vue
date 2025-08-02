<template>
  <transition name="sidebar-slide">
    <aside v-if="show" class="sidebar" :class="{ 'sidebar-mobile': isMobile, 'sidebar-open': isMobile && show }" v-bind="$attrs">
      <nav>
        <ul>
          <li class="sidebar-item" :class="{ 'bg-[var(--color2)] text-white': selectedMenu === 'inicio' }" @click="$emit('selectMenu', 'inicio')">Panel de inicio</li>
          <li class="sidebar-item" :class="{ 'bg-[var(--color2)] text-white': selectedMenu === 'duenos' }" @click="$emit('selectMenu', 'duenos')">Dueños registrados</li>
          <li class="sidebar-item">Mascotas registradas</li>
          <li class="sidebar-item" :class="{ 'bg-[var(--color2)] text-white': selectedMenu === 'citas' }" @click="$emit('selectMenu', 'citas')">Agenda / Citas</li>
          <li class="sidebar-item" :class="{ 'bg-[var(--color2)] text-white': selectedMenu === 'estados' }" @click="$emit('selectMenu', 'estados')">Estados</li>
          <li class="sidebar-item" :class="{ 'bg-[var(--color2)] text-white': selectedMenu === 'notificaciones' }" @click="$emit('selectMenu', 'notificaciones')">Notificaciones</li>
          <li class="sidebar-item">Historial</li>
          <li class="sidebar-item">Reporte Diario</li>
        </ul>
      </nav>
      <button v-if="isMobile" class="sidebar-close" @click="$emit('close')">&times;</button>
    </aside>
  </transition>
  <div v-if="isMobile && show" class="sidebar-backdrop" @click="$emit('close')"></div>
</template>

<script>
export default {
  name: 'Sidebar',
  emits: ['close', 'selectMenu'],
  props: {
    show: {
      type: Boolean,
      default: true
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    selectedMenu: {
      type: String,
      default: 'inicio'
    }
  },
  inheritAttrs: false
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: var(--color1);
  color: #fff;
  padding: 2rem 1rem 1rem 1rem;
  box-shadow: 2px 0 8px 0 rgba(89,38,63,0.08);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1202;
  transition: left 0.3s;
}
.sidebar-mobile {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  min-height: 100vh;
  width: 220px;
  transform: translateX(-100%);
  transition: transform 0.3s;
  box-shadow: 2px 0 16px 0 rgba(0,0,0,0.18);
}
.sidebar-open.sidebar-mobile {
  transform: translateX(0);
}
.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.25);
  z-index: 1200;
}
.sidebar-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1203;
}
@media (max-width: 900px) {
  .sidebar {
    width: 220px;
    min-height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1202;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  .sidebar-open.sidebar-mobile {
    transform: translateX(0);
  }
}
.sidebar-item {
  padding: 0.8rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}
.sidebar-item:hover {
  background: var(--color2);
  color: #fff;
}
.sidebar-slide-enter-active, .sidebar-slide-leave-active {
  transition: opacity 0.3s;
}
.sidebar-slide-enter-from, .sidebar-slide-leave-to {
  opacity: 0;
}
</style>