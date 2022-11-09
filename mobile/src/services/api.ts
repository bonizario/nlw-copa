import { SERVER_BASE_URL } from '@env';
import axios from 'axios';

export const api = axios.create({
  baseURL: SERVER_BASE_URL,
});
