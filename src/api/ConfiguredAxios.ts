import axios from 'axios';

const configuredAxios = axios.create({
  headers: {
    Accept: "application/json"
  }
});

export default configuredAxios;
