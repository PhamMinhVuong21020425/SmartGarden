import axios from 'axios';

const request = axios.create({
    baseURL: process.env.AXIOS_BASE_URL,
    withCredentials: true,
});

export default request;