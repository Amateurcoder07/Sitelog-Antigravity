import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // required — sends/receives the httpOnly cookie
});

export default API;