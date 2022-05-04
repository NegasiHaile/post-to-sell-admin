import axios from 'axios';

// Server BASE_URL
import { server } from '../Constants/Server_Base_URL';

// Token from local storage
const accesstoken = localStorage.getItem('accesstoken');
// Get all list of banners (Postcard to be showed on the top of the client app landing page)
export const apiGetAllBanners = async () => {
  return await axios.get(`${server}/api/banners/list`);
};

// Delete banner (Postcard to beexport const apiGetAllBanners = async () => {
export const apiDeleteBanner = async (id) => {
  return await axios.delete(`${server}/api/banners/delete/${id}`, {
    headers: {
      Authorization: accesstoken,
    },
  });
};
