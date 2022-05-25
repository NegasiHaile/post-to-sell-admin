import { Navigate, useRoutes } from 'react-router-dom';
// layouts
// Public pages
import Login from './pages/Login';
import NotFound from './pages/Page404';

// Private pages
import DashboardLayout from './layouts/dashboard';
import Adverts from './pages/Adverts';
import User from './pages/User';
import Products from './pages/Products';
import Categories from './pages/Categories';
import AddCategory from './pages/AddCategory';
import DashboardApp from './pages/DashboardApp';
import ProductsList from './components/users/UserProducts';
import Banners from './pages/Banners';

// Data from local storage
const access = localStorage.getItem('accesstoken');
const refresh = localStorage.getItem('refreshtoken');

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes(
    access && refresh
      ? [
          {
            path: '/dashboard',
            element: <DashboardLayout />,
            children: [
              { path: 'app', element: <DashboardApp /> },
              { path: 'user', element: <User /> },
              { path: 'products', element: <Products /> },
              { path: 'categories', element: <Categories /> },
              { path: 'add_category', element: <AddCategory /> },
              { path: 'adverts', element: <Adverts /> },
              { path: 'banners', element: <Banners /> },
              { path: 'user/list-products/:id', element: <ProductsList /> },
            ],
          },
          { path: '*', element: <Navigate to="/dashboard/app" replace /> },
        ]
      : [
          {
            path: '/',
            children: [
              { path: '/', element: <Login /> },
              { path: 'login', element: <Login /> },
              { path: 'signin', element: <Login /> },
              { path: '404', element: <NotFound /> },
              { path: '*', element: <Navigate to="/404" /> },
            ],
          },
          { path: '*', element: <Navigate to="/404" replace /> },
        ]
  );
}
