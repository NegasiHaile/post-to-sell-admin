import axios from 'axios';

// Server BASE_URL
import { server } from '../Constants/Server_Base_URL';

// Token from local storage
const accesstoken = localStorage.getItem('accesstoken');

// Get all list of banners (Postcard to be showed on the top of the client app landing page)
export const apiGetAllBanners = async () => {
  return await axios.get(`${server}/api/banners/list`);
};

// Add new banner
export const apiAddNewBanner = async (data) => {
  return await axios.post(`${server}/api/banners/add`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: accesstoken,
    },
  });
};

// Add new banner
export const apiEditBanner = async (data) => {
  return await axios.put(
    `${server}/api/banners/edit/${data._id}`,
    { ...data },
    {
      headers: {
        Authorization: accesstoken,
      },
    }
  );
};

// Delete banner (Postcard to beexport const apiGetAllBanners = async () => {
export const apiDeleteBanner = async (id) => {
  return await axios.delete(`${server}/api/banners/delete/${id}`, {
    headers: {
      Authorization: accesstoken,
    },
  });
};
