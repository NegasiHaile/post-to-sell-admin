// Axios package importing
import axios from 'axios';

// Server base url
import { server } from '../Constants/Server_Base_URL';

// Token from local storage
const accesstoken = localStorage.getItem('accesstoken');

// Add category
export const apiAddCategory = async (data) => {
  return await axios.post(
    `${server}/api/categories/add`,
    { ...data },
    {
      headers: {
        Authorization: accesstoken,
      },
    }
  );
};

// Get all categories
export const apiGetAllCategories = async () => {
  return await axios.get(`${server}/api/categories/list`);
};

// Edit category image
export const apiEditCategoryImage = async (categoryId, formData) => {
  return await axios.put(`${server}/api/categories/edit/image/${categoryId}`, formData, {
    headers: {
      Authorization: accesstoken,
    },
  });
};

// delete Category
export const apiDeleteCategoryDetail = async (categoryId) => {
  return await axios.delete(`${server}/api/categories/delete/${categoryId}`, {
    headers: {
      Authorization: accesstoken,
    },
  });
};
