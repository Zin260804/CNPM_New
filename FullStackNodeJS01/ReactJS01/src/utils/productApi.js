import axios from './axios.customize';

const toggleFavorite = (id) => {
    const url_API = `/api/products/${id}/favorite`;
    return axios.post(url_API);
};

const getMyFavorites = (page, limit) => {
    const url_API = `/api/products/me/favorites?page=${page}&limit=${limit}`;
    return axios.get(url_API);
};

const postViewProduct = (id) => {
    const url_API = `/api/products/${id}/view`;
    return axios.post(url_API);
};

const getViewedProduct = () => {
    const url_API = `/api/products/me/recently-viewed`;
    return axios.get(url_API);
};

const getSimilarProducts = (id) => {
    const url_API = `/api/products/${id}/similar`;
    return axios.get(url_API);
};
export {
    getViewedProduct,
    getSimilarProducts,
    toggleFavorite,
    getMyFavorites,
    postViewProduct,
};