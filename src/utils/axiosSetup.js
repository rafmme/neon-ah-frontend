import axios from 'axios';

export const apiInstance = axios.create({
    baseURL: 'http://127.0.0.1/api/v1'
});

const makeRequest = (url, options = { method: 'GET' }) => {
    return apiInstance({
        url,
        method: options.method,
        data: options.body,
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: localStorage.getItem('userToken') ? `Bearer ${localStorage.getItem('userToken')}` : ''
        }
    }).then(response => response.data);
};

export default makeRequest;
