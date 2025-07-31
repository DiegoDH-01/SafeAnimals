import axios from 'axios';

export async function getDuenos() {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.get('http://localhost:3000/api/duenos', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.data;
  } catch (e) {
    return [];
  }
} 