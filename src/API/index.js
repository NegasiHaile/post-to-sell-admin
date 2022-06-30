// Collecting all APIs in to this file
import { apiAdminSignin, api_getAllUserProducts } from './Users'; // users APIs
import {
  apiAddCategory,
  apiGetAllCategories,
  apiEditCategoryDetail,
  apiEditCategoryImage,
  apiDeleteCategoryDetail,
} from './Categories'; // categories
import { apiGetAllProducts, apiDeleteProduct, apiApproveProduct, apiArchiveProduct } from './Products'; // Products APIs
import { apiGetAllAdverts, apiApproveAdvert, apiArchiveAdvert, apiDeleteAdvert } from './Adverts'; // Adverts APIs
import { apiGetAllBanners, apiAddNewBanner, apiEditBanner, apiEditBannerImage, apiDeleteBanner } from './Banners'; // Banners API

// Exporting all the APIs
export { apiAdminSignin, api_getAllUserProducts }; // users
export { apiAddCategory, apiGetAllCategories, apiEditCategoryDetail, apiEditCategoryImage, apiDeleteCategoryDetail }; // categories
export { apiGetAllProducts, apiDeleteProduct, apiApproveProduct, apiArchiveProduct }; // Products
export { apiGetAllAdverts, apiApproveAdvert, apiArchiveAdvert, apiDeleteAdvert }; // Adverts
export { apiGetAllBanners, apiAddNewBanner, apiEditBanner, apiEditBannerImage, apiDeleteBanner }; // Banners
