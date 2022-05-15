// Collecting all APIs in to this file
import { apiAdminSignin, api_getAllUserProducts } from './Users'; // users APIs
import { apiGetAllProducts, apiDeleteProduct, apiApproveProduct, apiArchiveProduct } from './Products'; // Products APIs
import { apiGetAllAdverts, apiApproveAdvert, apiArchiveAdvert } from './Adverts'; // Adverts APIs
import { apiGetAllBanners, apiAddNewBanner, apiEditBanner, apiEditBannerImage, apiDeleteBanner } from './Banners'; // Banners API

// Exporting all the APIs
export { apiAdminSignin, api_getAllUserProducts }; // users
export { apiGetAllProducts, apiDeleteProduct, apiApproveProduct, apiArchiveProduct }; // Products
export { apiGetAllAdverts, apiApproveAdvert, apiArchiveAdvert }; // Adverts
export { apiGetAllBanners, apiAddNewBanner, apiEditBanner, apiEditBannerImage, apiDeleteBanner }; // Banners
