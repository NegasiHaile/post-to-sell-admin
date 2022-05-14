// Axios package importing
import axios from 'axios';

// Server base url
import { server } from '../Constants/Server_Base_URL';

// Token from local storage
const accesstoken = localStorage.getItem('accesstoken');

// Get listof all products
export const apiGetAllProducts = () => {
  return axios.get(`${server}/api/products/list/all`);
};

// Delete product detail permanently
export const apiDeleteProduct = (id) => {
  return axios.delete(`${server}/api/products/delete/${id}`, {
    headers: {
      Authorization: accesstoken,
    },
  });
};

// Approve product
export const apiApproveProduct = async (id) => {
  return await axios.put(
    `${server}/api/products/approve/${id}`,
    { id },
    {
      headers: {
        Authorization: accesstoken,
      },
    }
  );
};
