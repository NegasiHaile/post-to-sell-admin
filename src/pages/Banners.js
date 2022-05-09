import { useEffect } from 'react';
import { filter } from 'lodash';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper,
} from '@mui/material';
// Source of Icons
import Iconify from '../components/Iconify';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import CustomModal from '../components/Modal';
import BannerPreview from '../components/Banner/BannerPreview';
// functions
import { fDate } from '../utils/formatTime';
// API
import { apiGetAllBanners, apiDeleteBanner } from '../API/index';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sequence', label: 'Sequence', alignRight: false },
  { id: 'title', label: 'Banner Description', alignRight: false },
  { id: 'createdAt', label: 'Created At', alignRight: false },
  { id: 'duration', label: 'Expire Date', alignRight: false },
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
    return filter(array, (_banner) => _banner.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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
export default function Banners() {
  let navigate = useNavigate();
  const [page, setPage] = useState(0); // Page of the table

  const [bannersList, setBannersList] = useState([]); // List of banners

  const [order, setOrder] = useState('asc'); // Order of the banners list

  const [selected, setSelected] = useState([]); // List of selected banners (using the checkbox)

  const [orderBy, setOrderBy] = useState('name'); // Order the list of banners by

  const [filterName, setFilterName] = useState(''); // Filter banners by titile

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openBannerDialog, setOpenBannerDialog] = useState(false); // State for banner dialog

  const [showModal, setShowModal] = useState(initialShowModal);

  useEffect(() => {
    // Calling get all banners function
    getAllBanners();
  }, []);

  // Get all list of banners
  const getAllBanners = async () => {
    try {
      const res = await apiGetAllBanners();
      setBannersList(res.data);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Select all list of banners
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = bannersList.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // Handle the click of checkbox from list of banners
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

  // Edit banner detail
  const editBannerDetail = (banner) => {
    alert('Edited successfully!');
  };

  // Delete Banner detail
  const deleteBanner = async (banner) => {
    try {
      const res = await apiDeleteBanner(banner._id);
      getAllBanners();
      setShowModal(initialShowModal);
      alert(res.data.msg);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const getBnnerDetail = (banner) => {
    alert('Test done!');
  };

  function routeChange(path) {
    navigate(path);
    //     alert('Route change to :' + path);
  }
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bannersList.length) : 0;

  const filteredBanners = applySortFilter(bannersList, getComparator(order, orderBy), filterName);

  const isBannerNotFound = filteredBanners.length === 0;

  return (
    <Page title="Banners">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Banners List
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setOpenBannerDialog(true)}
          >
            New Banner
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            table="banner"
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={bannersList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredBanners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, sequence, title, createdAt, duration } = row;
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
                        <TableCell align="left">{sequence}</TableCell>
                        <TableCell align="left">{title}</TableCell>
                        <TableCell align="left">{fDate(createdAt)}</TableCell>
                        <TableCell align="left">{fDate(duration)}</TableCell>

                        <TableCell align="right">
                          <UserMoreMenu
                            data={[
                              {
                                label: 'Edit',
                                icon: 'eva:edit-fill',
                                color: '#04AA6D',
                                onClick: () => editBannerDetail(row),
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
                                    contentText: 'Are you sure you want to delete thsis banner permanently?',
                                    onConfirm: () => deleteBanner(row),
                                    isLoading: false,
                                  }),
                              },
                              {
                                label: 'Detail',
                                icon: 'fluent:apps-list-detail-24-regular',
                                color: '#2065D1',
                                onClick: () => getBnnerDetail(row),
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

                {isBannerNotFound && (
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
            count={bannersList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        {/* Banner form dialog */}
        <Dialog
          fullScreen
          open={openBannerDialog}
          onClose={() => setOpenBannerDialog(false)}
          aria-labelledby="form-dialog-title"
        >
          {/* <DialogTitle id="form-dialog-title">Add new banner</DialogTitle> */}
          <BannerPreview />
          <DialogContent>
            <Grid container spacing={1} sx={{ mt: 3 }}>
              <Grid item xs={12} sm={11} md={6} lg={3}>
                <TextField autoFocus margin="dense" id="name" type="file" fullWidth />
              </Grid>
              <Grid item xs={12} sm={11} md={6} lg={3}>
                <TextField autoFocus margin="dense" id="name" label="Title" type="text" fullWidth />
              </Grid>
              <Grid item xs={12} sm={11} md={6} lg={3}>
                <TextField
                  InputProps={{ inputProps: { min: 0, max: 10 } }}
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Squence"
                  fullWidth
                  type="number"
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} sm={11} md={6} lg={3}>
                <TextField type="date" autoFocus margin="dense" id="name" fullWidth size="medium" />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBannerDialog(false)} color="error" variant="contained">
              Cancel
            </Button>
            <Button onClick={() => setOpenBannerDialog(false)} color="primary" variant="contained">
              Add Banner
            </Button>
          </DialogActions>
        </Dialog>
        {/* Action conformation dialog */}
        <CustomModal showModal={showModal} setShowModal={setShowModal} />
      </Container>
    </Page>
  );
}
