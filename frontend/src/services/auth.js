import axios from 'axios';

export async function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const res = await axios.get('http://localhost:3000/api/usuarios/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (e) {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('token');
}
