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
  Avatar,
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
// functions
import { fDate } from '../utils/formatTime';
// API
import { apiGetAllProducts } from '../API/index';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'productName', label: 'Name', alignRight: false },
  { id: 'brand', label: 'Brand', alignRight: false },
  { id: 'currentPrice', label: 'Price', alignRight: false },
  { id: 'createdAt', label: 'Created At', alignRight: false },
  { id: 'postPayment', label: 'Payment', alignRight: false },
  { id: '' },
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
      (_advert) =>
        _advert.productName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _advert.brand.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _advert.currentPrice.toString().indexOf(query.toString()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Adverts() {
  const [page, setPage] = useState(0); // Page of the table

  const [productsList, setProductsList] = useState([]); // List of products

  const [order, setOrder] = useState('asc'); // Order of the products list

  const [selected, setSelected] = useState([]); // List of selected products (using the checkbox)

  const [orderBy, setOrderBy] = useState('name'); // Order the list of products by

  const [filterName, setFilterName] = useState(''); // Filter products by titile

  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  // Handle the click of checkbox from list of products
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  // Edit product detail
  const editAdvert = (product) => {
    alert('Edited successfully!');
  };

  // Delete products detail
  const deleteAdvert = (product) => {
    alert('Deleted successfully!');
  };

  const getAdvertDetail = (product) => {
    alert('Test done!');
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productsList.length) : 0;

  const filteredUsers = applySortFilter(productsList, getComparator(order, orderBy), filterName);

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
            filterName={filterName}
            onFilterName={handleFilterByName}
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
                    const { _id, productName, brand, currentPrice, createdAt, postPayment } = row;
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
                        <TableCell align="left">{postPayment ? 'Done' : 'Unpaid'}</TableCell>

                        <TableCell align="right">
                          <UserMoreMenu
                            data={[
                              {
                                label: 'Detail',
                                icon: 'fluent:apps-list-detail-24-regular',
                                color: '#2065D1',
                                onClick: () => getAdvertDetail(row),
                              },
                              {
                                label: 'Owner',
                                icon: 'carbon:user-admin',
                                onClick: () => getAdvertDetail(row),
                              },
                              {
                                label: 'Delete',
                                icon: 'eva:trash-2-outline',
                                color: '#FF4436',
                                onClick: () => deleteAdvert(row),
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
                        <SearchNotFound searchQuery={filterName} />
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
      </Container>
    </Page>
  );
}
