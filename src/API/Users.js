import axios from 'axios';

// Server base url
import { server } from '../Constants/Server_Base_URL';

// login for admin only
export const apiAdminSignin = (credintials) => {
  return axios.post(`${server}/api/users/signin`, credintials);
};
