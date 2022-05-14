import { useEffect } from 'react';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import CustomModal from '../components/Modal';

// Utils
import Toast from '../components/Utils/Toast';
import { fDate } from '../utils/formatTime';

// API
import { apiGetAllProducts, apiDeleteProduct, apiApproveProduct, apiArchiveProduct } from '../API/index';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'productName', label: 'Name', alignRight: false },
  { id: 'brand', label: 'Brand', alignRight: false },
  { id: 'currentPrice', label: 'Price', alignRight: false },
  { id: 'createdAt', label: 'Created At', alignRight: false },
  { id: 'postType', label: 'Post Type', alignRight: false },
  { id: 'postPayment', label: 'Payment', alignRight: false },
  { id: '', label: 'Actions', alignRight: true },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Sorted global filotering of product
function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_product) =>
        _product.productName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _product.brand.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _product.currentPrice.toString().indexOf(query.toString()) !== -1 ||
        _product.postType.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

// Initial values for the modal
const initialShowModal = {
  action: '',
  status: false,
  title: '',
  contentText: '',
  onConfirm: null,
  isLoading: false,
};

export default function Adverts() {
  const [page, setPage] = useState(0); // Page of the table

  const [productsList, setProductsList] = useState([]); // List of products

  const [order, setOrder] = useState('asc'); // Order of the products list

  const [selected, setSelected] = useState([]); // List of selected products (using the checkbox)

  const [orderBy, setOrderBy] = useState('name'); // Order the list of products by

  const [filterKeyword, setFilterKeyword] = useState(''); // A string value to filter product

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [showModal, setShowModal] = useState(initialShowModal);

  useEffect(() => {
    // Calling get all products function
    funcGetAllProducts();
  }, []);

  // Get all list of products
  const funcGetAllProducts = async () => {
    try {
      const res = await apiGetAllProducts();
      console.log(res.data);
      setProductsList(res.data);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Select all list of products
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = productsList.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // Handle click on single row
  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  // Handle changing table page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle global filtering
  const handleValueForFilter = (event) => {
    setFilterKeyword(event.target.value);
  };

  // Approve product for post
  const approveProduct = async (product) => {
    try {
      const res = await apiApproveProduct(product._id);
      funcGetAllProducts();
      setShowModal(initialShowModal);
      Toast('sucess', res.data.msg);
    } catch (error) {
      Toast('error', error.response.data.msg);
    }
  };

  // Archive product and limited it from being seen in the public pages
  const archiveProduct = async (product) => {
    try {
      const res = await apiArchiveProduct(product);
      funcGetAllProducts();
      setShowModal(initialShowModal);
      Toast('sucess', res.data.msg);
    } catch (error) {
      Toast('error', error.response.data.msg);
    }
  };

  // Delete product detail
  const dleteProduct = async (product) => {
    try {
      const res = await apiDeleteProduct(product._id);
      funcGetAllProducts();
      setShowModal(initialShowModal);
      Toast('sucess', res.data.msg);
    } catch (error) {
      Toast('error', error.response.data.msg);
    }
  };

  const routeToProductDetailPage = (product) => {
    alert('Test done!');
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productsList.length) : 0;

  const filteredUsers = applySortFilter(productsList, getComparator(order, orderBy), filterKeyword);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Products">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Products List
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterKeyword}
            onFilterName={handleValueForFilter}
            table="product"
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={productsList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, productName, brand, currentPrice, createdAt, postType, postPayment } = row;
                    const isItemSelected = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, _id)} />
                        </TableCell>
                        <TableCell align="left">{productName}</TableCell>
                        <TableCell align="left">{brand}</TableCell>
                        <TableCell align="left">{currentPrice}</TableCell>
                        <TableCell align="left">{fDate(createdAt)}</TableCell>
                        <TableCell align="left">{postType}</TableCell>
                        <TableCell align="left">
                          {postPayment ? (
                            <Iconify
                              style={{
                                color: '#04AA6D',
                              }}
                              icon="icons8:checked"
                              width={25}
                              height={25}
                            />
                          ) : (
                            <Iconify
                              sx={{
                                color: '#FF4436',
                              }}
                              icon="bi:x-circle"
                              width={25}
                              height={25}
                            />
                          )}
                        </TableCell>

                        <TableCell align="right">
                          <UserMoreMenu
                            data={[
                              {
                                label: 'Detail',
                                icon: 'fluent:apps-list-detail-24-regular',
                                color: '#2065D1',
                                onClick: () => routeToProductDetailPage(row),
                              },
                              {
                                label: 'Owner',
                                icon: 'carbon:user-admin',
                                onClick: () => routeToProductDetailPage(row),
                              },
                              {
                                label:
                                  row?.status === 'new'
                                    ? 'Approve'
                                    : row?.status === 'archived'
                                    ? 'Unarchive'
                                    : 'Archive',
                                icon:
                                  row?.status === 'active'
                                    ? 'clarity:archive-line'
                                    : row?.status === 'archived'
                                    ? 'clarity:unarchive-line'
                                    : 'akar-icons:chat-approve',
                                color: row?.status === 'active' ? '#EF9B0F' : '#04AA6D',
                                onClick: () =>
                                  setShowModal({
                                    action:
                                      row?.status === 'active'
                                        ? 'Archive'
                                        : row?.status === 'archived'
                                        ? 'Unarchive'
                                        : 'Approve',
                                    status: true,
                                    title:
                                      (row?.status === 'active'
                                        ? 'Archive'
                                        : row?.status === 'archived'
                                        ? 'Unarchive'
                                        : 'Approve') + ' this?',
                                    contentText: `Are you sure you want to ${
                                      row?.status === 'active'
                                        ? 'archive'
                                        : row?.status === 'archived'
                                        ? 'unarchive'
                                        : 'approve'
                                    } this product?`,
                                    onConfirm: () =>
                                      row?.status === 'active' ? archiveProduct(row) : approveProduct(row),
                                    isLoading: false,
                                  }),
                              },
                              {
                                label: 'Delete',
                                icon: 'eva:trash-2-outline',
                                color: '#FF4436',
                                onClick: () =>
                                  setShowModal({
                                    action: 'Delete',
                                    status: true,
                                    title: 'Delete this?',
                                    contentText: 'Are you sure you want to delete this post permanently?',
                                    onConfirm: () => dleteProduct(row),
                                    isLoading: false,
                                  }),
                              },
                            ]}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterKeyword} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={productsList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        {/* Dialog for conformation of an action */}
        <CustomModal showModal={showModal} setShowModal={setShowModal} />
      </Container>
    </Page>
  );
}
