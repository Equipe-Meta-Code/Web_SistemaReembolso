import axios from "axios";

const api = axios.create({
    baseURL: 'http://<ip-da-sua-maquina>:3333/'
});

export default api;