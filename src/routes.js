import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from './layouts/dashboard';
//
import Adverts from './pages/Adverts';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
// import Register from './pages/Register';
import Products from "./pages/Products";
import DashboardApp from "./pages/DashboardApp";
import ProductsList from "./components/users/UserProducts";

//
const access = localStorage.getItem("accesstoken");
const refresh = localStorage.getItem("refreshtoken");
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes(
    access && refresh
      ? [
          {
            path: "/dashboard",
            element: <DashboardLayout />,
            children: [
              { path: "app", element: <DashboardApp /> },
              { path: "user", element: <User /> },
              { path: "products", element: <Products /> },
              { path: "adverts", element: <Adverts /> },
              { path: "user/list-products/:id", element: <ProductsList /> },
            ],
          },
          { path: "*", element: <Navigate to="/dashboard/app" replace /> },
        ]
      : [
          {
            path: "/",
            children: [
              { path: "/", element: <Login /> },
              { path: "login", element: <Login /> },
              { path: "signin", element: <Login /> },
              { path: "404", element: <NotFound /> },
              { path: "*", element: <Navigate to="/404" /> },
            ],
          },
          { path: "*", element: <Navigate to="/404" replace /> },
        ]
  );
}
