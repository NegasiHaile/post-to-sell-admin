import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setCategory, selectedCategory } from '../Redux/Actions/CategoryActions';

//Node_Modules
import { filter } from 'lodash';

// APIs
import { apiGetAllCategories } from '../API/index'; // API
import { apiDeleteCategoryDetail, apiApproveProduct, apiArchiveProduct } from '../API/index';

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

// Developer components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import CustomModal from '../components/Modal';

// Developer utils
import { fDate } from '../utils/formatTime';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'category', label: 'Category Name', alignRight: false },
  { id: 'subCategory', label: 'Sub Cutegories', alignRight: false },
  { id: 'postFee', label: 'Normal Post Fee', alignRight: false },
  { id: 'featuredPostFee', label: 'Featured Post Fee', alignRight: false },
  { id: 'createdAt', label: 'Created At', alignRight: false },
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
    return filter(array, (_category) => _category.category.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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

export default function Categories() {
  const ctgrys = useSelector((state) => state.category);
  const dispatch = useDispatch();
  console.log(ctgrys);

  const navigate = useNavigate();

  const [page, setPage] = useState(0); // Pagenation of the table

  const [productsList, setProductsList] = useState([]); // List of products

  const [order, setOrder] = useState('asc'); // Order of the products list

  const [selected, setSelected] = useState([]); // List of selected products (using the checkbox)

  const [orderBy, setOrderBy] = useState('name'); // Order the list of products by

  const [filterKeyword, setFilterKeyword] = useState(''); // A string value to filter product

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [showModal, setShowModal] = useState(initialShowModal);

  useEffect(() => {
    // Calling get all products function
    funcGetAllCategories();
  }, []);

  // Get all list of products
  const funcGetAllCategories = async () => {
    try {
      const res = await apiGetAllCategories();
      setProductsList(res.data);
      dispatch(setCategory(res.data));
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  console.log(productsList);
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

  // Delete category detail
  const deleteCategory = async (category) => {
    try {
      const res = await apiDeleteCategoryDetail(category._id);
      funcGetAllCategories();
      setShowModal(initialShowModal);
      toast.success(res.data.msg);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  const routeToProductDetailPage = (category) => {
    navigate(`/dashboard/edit_category/${category._id}`);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productsList.length) : 0;

  const filteredUsers = applySortFilter(productsList, getComparator(order, orderBy), filterKeyword);

  const isCategoryNotFound = filteredUsers.length === 0;

  const navigateToAddCategoryPage = () => {
    navigate('/dashboard/add_category');
  };

  return (
    <Page title="Categories">
      <ToastContainer position="bottom-right" />
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Categories
          </Typography>
          <Button
            variant="contained"
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={navigateToAddCategoryPage}
          >
            Add Category
          </Button>
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
                    const { _id, category, subCategory, postFee, featuredPostFee, createdAt } = row;
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
                        <TableCell align="left">{category}</TableCell>
                        <TableCell align="left">
                          {subCategory.map((item, index) => (
                            <span key={index}>{item.sub_name} , </span>
                          ))}
                        </TableCell>
                        <TableCell align="left">{postFee ? postFee + ' ETB' : ''} </TableCell>
                        <TableCell align="left">{featuredPostFee ? featuredPostFee + ' ETB' : 'Not set'} </TableCell>
                        <TableCell align="left">{fDate(createdAt)}</TableCell>
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
                                label: 'Edit',
                                icon: 'eva:edit-fill',
                                color: '#04AA6D',
                                onClick: () => {
                                  dispatch(selectedCategory(row));
                                  routeToProductDetailPage(row);
                                },
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
                                    contentText: 'Are you sure you want to delete this category permanently?',
                                    onConfirm: () => deleteCategory(row),
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
                {isCategoryNotFound && (
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
