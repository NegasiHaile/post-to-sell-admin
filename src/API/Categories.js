// Axios package importing
import axios from 'axios';

// Server base url
import { server } from '../Constants/Server_Base_URL';

// Token from local storage
const accesstoken = localStorage.getItem('accesstoken');

// Get all categories
export const apiGetAllCategories = async () => {
  return await axios.get(`${server}/api/categories/list`);
};
