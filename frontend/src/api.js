// src/api.js
import axios from 'axios';

const api = axios.create({
  //baseURL: process.env.REACT_APP_API_BASE_URL, #Local development URL
  baseURL: process.env.REACT_APP_API_URL //Production URL
});

export default api;
