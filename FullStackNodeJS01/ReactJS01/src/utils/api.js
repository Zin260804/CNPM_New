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

const getProductsWithPaginate = (page, limit) => {
    return axios.get(`/v1/api/product?page=${page}&limit=${limit}`);
}
const getProductsByCategoryWithPaginate = (category, page, limit) => {
    return axios.get(`/v1/api/product-categoory?category=${category}page=${page}&limit=${limit}`);
}

const searchProducts = (params) => {
    const {
        q,
        category,
        page = 1,
        limit,
        minPrice,
        maxPrice,
        minPromotion,
        maxPromotion,
        sortBy,
        sortOrder,
    } = params;

    let url = `/v1/api/search?q=${encodeURIComponent(q || "")}&page=${page}&limit=${limit}`;

    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (minPrice !== undefined) url += `&minPrice=${minPrice}`;
    if (maxPrice !== undefined) url += `&maxPrice=${maxPrice}`;
    if (minPromotion !== undefined && maxPromotion !== undefined) url += `&minPromotion=${minPromotion}&maxPromotion=${maxPromotion}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    if (sortOrder) url += `&sortOrder=${sortOrder}`;

    return axios.get(url);
};
export {
    createUserApi,
    loginApi,
    searchProducts,
    getUserApi,
    getProductsWithPaginate,
    getProductsByCategoryWithPaginate,
};