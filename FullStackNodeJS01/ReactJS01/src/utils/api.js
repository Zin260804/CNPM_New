import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const url_API = "/v1/api/register";
    const data = {
        name,
        email,
        password
    };
    return axios.post(url_API, data);
};

const loginApi = (email, password) => {
    const url_API = "/v1/api/login";
    const data = {
        email,
        password
    };
    return axios.post(url_API, data);
};

const getUserApi = () => {
    const url_API = "/v1/api/user";
    return axios.get(url_API);
};

export {
    createUserApi,
    loginApi,
    getUserApi
};