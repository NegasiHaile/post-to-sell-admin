import { useState, useEffect } from "react";
// material
import {
  Container,
  Stack,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
// components
import Page from "../../components/Page";
import {
  ProductSort,
  ProductList,
  ProductCartWidget,
  ProductFilterSidebar,
} from "../../sections/@dashboard/products";
// mock
import PRODUCTS from "../../_mock/products";
import { useLocation, useParams } from "react-router-dom";
import { api_getAllUserProducts } from "../../API/index";

const access = localStorage.getItem("accesstoken");

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const [openFilter, setOpenFilter] = useState(false);
  const { id } = useParams();
  console.log("state", id);
  const [productloading, setProductLoading] = useState({
    isLoading: false,
    state: "success",
    message: "",
  });
  const [products, setProducts] = useState(null);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const loadProducts = async () => {
    setProductLoading({
      isLoading: true,
      state: "success",
      message: "",
    });
    setProducts(null);
    try {
      const res = await api_getAllUserProducts(id, access);
      const responseData = res.data;
      setProducts(responseData);
      setProductLoading({
        isLoading: false,
        state: "success",
        message: "Product loaded succefully",
      });
    } catch (error) {
      console.log("error: ", error);
      setProducts(null);
      setProductLoading({
        isLoading: false,
        state: "error",
        message:
          error.response && error.response.data && error.response.data.msg
            ? error.response.data.msg
            : "something went wrong while loading products!",
      });
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);
  console.log("products", products);
  return products ? (
    <Page title="Dashboard: Products">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Products
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              isOpenFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={products} />
        <ProductCartWidget />
      </Container>
    </Page>
  ) : productloading.message && productloading.message !== "" ? (
    <div
      style={{
        width: "100%",
        display: "flex",
        height: "100%",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Alert severity="error" variant="outlined">
        {productloading.message}
      </Alert>
    </div>
  ) : (
    <div
      style={{
        width: "100%",
        display: "flex",
        height: "100%",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        variant="indeterminate"
        disableShrink
        style={{
          color: "#00AB55",
          animationDuration: "550ms",
          position: "absolute",
        }}
        size={40}
        thickness={4}
      />
    </div>
  );
}
