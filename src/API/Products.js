// Axios package importing
import axios from 'axios';

// Server base url
import { server } from '../Constants/Server_Base_URL';
export const apiGetAllProducts = () => {
  return axios.get(`${server}/api/products/list`);
};
