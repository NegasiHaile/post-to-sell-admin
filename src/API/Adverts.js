// Axios package importing
import axios from 'axios';

// Server base url
import { server } from '../Constants/Server_Base_URL';
export const apiGetAllAdverts = () => {
  return axios.get(`${server}/api/adverts/list`);
};
