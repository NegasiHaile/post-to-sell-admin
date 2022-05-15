// Axios package importing
import axios from 'axios';

// Server base url
import { server } from '../Constants/Server_Base_URL';

// Token from local storage
const accesstoken = localStorage.getItem('accesstoken');

// get all list of adverts
export const apiGetAllAdverts = () => {
  return axios.get(`${server}/api/adverts/list`);
};

// Approve advert
export const apiApproveAdvert = async (advert) => {
  return await axios.put(
    `${server}/api/adverts/approve/${advert._id}`,
    { advert },
    {
      headers: {
        Authorization: accesstoken,
      },
    }
  );
};
