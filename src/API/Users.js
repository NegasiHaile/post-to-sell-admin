import { server } from '../Constants/Server_Base_URL';

import axios from 'axios';

// login for admin only
export const api_adminSignin = async (credintials) => {
  return await axios.post(`${server}/api/users/signin`, credintials);
};
