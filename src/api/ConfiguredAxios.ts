import axios from 'axios';

const configuredAxios = axios.create({
  baseURL: '/api/v1',
});

export default configuredAxios;
