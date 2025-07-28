<template>
  <div class="login-bg">
    <div class="login-container">
      <div class="logo-area">
        <img :src="logo" alt="Logo Safe Animals" class="logo-img" />
      </div>

      <h2 class="title">Iniciar sesión</h2>
      <form @submit.prevent="handleLogin">
        <input type="email" v-model="email" placeholder="Correo electrónico" required class="input" />
        <input type="password" v-model="password" placeholder="Contraseña" required class="input" />
        <div style="display: flex; justify-content: center;">
          <button type="submit" class="btn">Ingresar</button>
        </div>
      </form>
      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import logo from '../assets/logo.png'


export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      logo: logo
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:3000/api/usuarios/login', {
          email: this.email,
          password: this.password
        });

        const { token } = response.data;
        localStorage.setItem('token', token);
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = 'Credenciales incorrectas o error en el servidor';
      }
    }
  }
};
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
}

.login-container {
  width: 100%;
  max-width: 380px;
  min-width: 300px;
  margin: 0 auto;
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 18px;
  background: var(--color-form-bg);
  box-shadow: 0 6px 32px 0 rgba(89, 38, 63, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-area {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-img {
  max-width: 160px;
  height: auto;
  margin-bottom: 1rem;

}

</style>
