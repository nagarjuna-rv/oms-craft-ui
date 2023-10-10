
import axios from 'axios';

const PRODUCT_API_BASE_URL = 'http://localhost:8081/api/v1';
const ORDER_API_BASE_URL = 'http://localhost:8090/api/v1/product-order';


export const getProducts = async () => {
    try {
        const response = await axios.get(`${PRODUCT_API_BASE_URL}/products/all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPrice = async (productId, quantity) => {
    try {
        const response = await axios.get(`${PRODUCT_API_BASE_URL}/products/${productId}/quantity/${quantity}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const submitOrder = async (orderData) => {
    try {
        const orderRequest = {
            userId: '123123',
            shippingAddress: 'MUMBAI',
            billingAddress: 'BANGLORE',
            product: orderData
        }
        const response = await axios.post(`${ORDER_API_BASE_URL}/add`, orderRequest);
        return response.data;
    } catch (error) {
        throw error;
    }
};
