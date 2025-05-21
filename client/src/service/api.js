import axios from 'axios';
import { environment } from '../pages/admin/constant';

const api = axios.create({
  baseURL: environment.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default api;
