import axios from 'axios';

// Server BASE_URL
import { server } from '../Constants/Server_Base_URL';

// Get all list of banners (Postcard to be showed on the top of the client app landing page)
export const apiGetAllBanners = async () => {
  return await axios.get(`${server}/api/banners/list`);
};
