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
import CustomModal from '../components/Modal';

// Utils
import Toast from '../components/Utils/Toast';
import { fDate } from '../utils/formatTime';
// API
import { apiGetAllAdverts, apiApproveAdvert, apiArchiveAdvert } from '../API/index';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Company', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'createdAt', label: 'Created At', alignRight: false },
  { id: 'advertPayment', label: 'Payment', alignRight: false },
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
    return filter(array, (_advert) => _advert.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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

  const [advertsList, setAdvertsList] = useState([]); // List of adverts

  const [order, setOrder] = useState('asc'); // Order of the adverts list

  const [selected, setSelected] = useState([]); // List of selected adverts (using the checkbox)

  const [orderBy, setOrderBy] = useState('name'); // Order the list of adverts by

  const [filterName, setFilterName] = useState(''); // Filter adverts by titile

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [showModal, setShowModal] = useState(initialShowModal);

  useEffect(() => {
    // Calling get all adverts function
    getAllAdverts();
  }, []);

  // Get all list of adverts
  const getAllAdverts = async () => {
    try {
      const res = await apiGetAllAdverts();
      console.log(res.data);
      setAdvertsList(res.data);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Select all list of adverts
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = advertsList.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // Handle the click of checkbox from list of adverts
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

  //go to advert detail
  const routeToAdvertDetailPage = (advert) => {
    alert('Test done!');
  };

  // Approve advert detail
  const approveAdvert = async (advert) => {
    try {
      const res = await apiApproveAdvert(advert);
      getAllAdverts();
      setShowModal(initialShowModal);
      Toast('sucess', res.data.msg);
    } catch (error) {
      Toast('error', error.response.data.msg);
    }
  };

  // Archive advert detail
  const archiveAdvert = async (advert) => {
    try {
      const res = await apiArchiveAdvert(advert);
      getAllAdverts();
      setShowModal(initialShowModal);
      Toast('sucess', res.data.msg);
    } catch (error) {
      Toast('error', error.response.data.msg);
    }
  };

  // Delete advert detail
  const deleteAdvert = async (advert) => {
    alert('Deleted successfully!');
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - advertsList.length) : 0;

  const filteredUsers = applySortFilter(advertsList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Adverts">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Adverts List
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            table="advert"
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={advertsList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, title, type, createdAt, advertPayment } = row;
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
                        <TableCell align="left">{title}</TableCell>
                        <TableCell align="left">{type}</TableCell>
                        <TableCell align="left">{fDate(createdAt)}</TableCell>
                        <TableCell align="left">{advertPayment ? 'Done' : 'Unpaid'}</TableCell>

                        <TableCell align="right">
                          <UserMoreMenu
                            data={[
                              {
                                label: 'Detail',
                                icon: 'fluent:apps-list-detail-24-regular',
                                color: '#2065D1',
                                onClick: () => routeToAdvertDetailPage(row),
                              },
                              {
                                label: 'Owner',
                                icon: 'carbon:user-admin',
                                onClick: () => routeToAdvertDetailPage(row),
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
                                    } this advert?`,
                                    onConfirm: () =>
                                      row?.status === 'active' ? archiveAdvert(row) : approveAdvert(row),
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
                                    contentText: 'Are you sure you want to delete this advert permanently?',
                                    onConfirm: () => deleteAdvert(row),
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
            count={advertsList.length}
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
