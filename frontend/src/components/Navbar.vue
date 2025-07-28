<template>
<header class="navbar flex items-center justify-between px-8">
  <button class="navbar-burger" @click="$emit('toggle-sidebar')" aria-label="Abrir menú">
    <span></span>
    <span></span>
    <span></span>
  </button>
  <div class="navbar-logo flex items-center">
    <slot name="logo"></slot>
  </div>
  <div class="navbar-user flex items-center gap-5">
    <span class="navbar-username font-semibold">{{ username }}</span>
    <span class="navbar-role text-[0.95rem] bg-[var(--color2)] text-white px-3 py-1 rounded ml-2">{{ role }}</span>
    <button class="btn navbar-logout ml-6 px-5 py-2 text-base bg-[var(--color3)] rounded text-white font-semibold border-none" @click="$emit('logout')">Logout</button>
  </div>
</header>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    username: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 64px;
  background: var(--color1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: 0 2px 8px 0 rgba(89,38,63,0.08);
}
.navbar-burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
  z-index: 1201;
}
.navbar-burger span {
  display: block;
  width: 26px;
  height: 3px;
  background: #fff;
  margin: 4px 0;
  border-radius: 2px;
  transition: 0.3s;
}
@media (max-width: 900px) {
  .navbar-burger {
    display: flex;
  }
}
.navbar-logo {
  display: flex;
  align-items: center;
}
.navbar-user {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.navbar-username {
  font-weight: 600;
}
.navbar-role {
  font-size: 0.95rem;
  background: var(--color2);
  color: #fff;
  padding: 0.2rem 0.7rem;
  border-radius: 6px;
  margin-left: 0.5rem;
}
.navbar-logout {
  margin-left: 1.5rem;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  background: var(--color3);
  border-radius: 6px;
  border: none;
  color: #fff;
  font-weight: 600;

}
.navbar-logout:hover {
  background: var(--color2);
}
</style>
