// Collecting all APIs in to this file
import { apiAdminSignin, api_getAllUserProducts } from './Users'; // users APIs
import { apiGetAllProducts } from './Products'; // Products APIs
import { apiGetAllAdverts } from './Adverts'; // Adverts APIs
import { apiGetAllBanners, apiAddNewBanner, apiDeleteBanner } from './Banners'; // Banners API

// Exporting all the APIs
export { apiAdminSignin, api_getAllUserProducts }; // users
export { apiGetAllProducts }; // Products
export { apiGetAllAdverts }; // Adverts
export { apiGetAllBanners, apiAddNewBanner, apiDeleteBanner }; // Banners
