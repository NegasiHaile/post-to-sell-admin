import React, { useEffect, useContext, useState } from "react";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { Link as RouterLink } from "react-router-dom";
// material
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  Chip,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { alpha, styled } from "@mui/material/styles";

// components
import Page from "../components/Page";
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import Iconify from "../components/Iconify";
import SearchNotFound from "../components/SearchNotFound";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "../sections/@dashboard/user";
// mock
// import USERLIST from '../_mock/user';

import { server as BASE_URL } from "../Constants/Server_Base_URL";
import AddEditDataForm from "../components/users/AddEditDataForm";
/* import MainCard from "../components/cards/MainCard"; */

/* import { AuthContext } from "../helpers/AuthContext"; */

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "role", label: "Role", alignRight: false },
  { id: "accountStatus", label: "Account Status", alignRight: false },
  { id: "Telegram Address", label: "Telegram Address", alignRight: false },
  { id: "Whatsup Address", label: "Whatsup Address", alignRight: false },
  { id: "registeredAt", label: "Registered At", alignRight: false },
  { id: "" },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const InfoStyle = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));
const access = localStorage.getItem("accesstoken");

const getContact = (data, field) => {
  let value = "";
  if (data && data.contacts) {
    data.contacts.map((contact) => {
      if (contact[field]) {
        value = contact[field];
      }
    });
  }
  return value;
};

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
  return order === "desc"
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
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const [USERLIST, setUSERLIST] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [viewDetail, setViewDetail] = useState(false);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isDeleting, setIsDeleting] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteResult, setDeleteResult] = useState({
    state: "success",
    message: "",
  });
  const handleClose = () => {
    setOpenDeleteModal(false);
    setSelectedMessage(null);
  };
  const onDeleteTeams = (message) => {
    setSelectedMessage(message);
    setDeleteResult({
      state: "success",
      message: "",
    });
    setIsDeleting(false);
    setOpenDeleteModal(true);
  };
  const onConfirmDelete = () => {
    setDeleteResult({
      state: "success",
      message: "",
    });
    setIsDeleting(true);
    axios
      .delete(`${BASE_URL}/api/products/${selectedMessage.id}`, {
        headers: {
          accessTokenOcr: localStorage.getItem("accessTokenOcr"),
        },
      })
      .then((res) => {
        if (!res.data.error) {
          setDeleteResult({
            state: "success",
            message: "users deleted successfully!",
          });
          setIsDeleting(false);
          setApiData({
            state: "success",
            message: "",
            data: null,
          });
          setOpenDeleteModal(false);
          loadData();
        } else {
          setDeleteResult({
            state: "error",
            message: "Something went wrong while deleting users!",
          });
          setIsDeleting(false);
        }
      })
      .catch((error) => {
        setDeleteResult({
          state: "error",
          message: "Something went wrong while deleting users!",
        });
        setIsDeleting(false);
      });
  };

  const [addResult, setAddResult] = useState({
    state: "success",
    message: "",
  });
  const [openAddModal, setOpenAddModal] = useState(false);
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setSelectedMessage(null);
  };
  const onAddTeams = (message) => {
    setSelectedMessage(message);
    setAddResult({
      state: "success",
      message: "",
    });
    setOpenAddModal(true);
  };
  const onAddTeamSuccess = () => {
    setOpenAddModal(false);
    setApiData({
      state: "success",
      message: "",
      data: null,
    });
    loadData();
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(
    USERLIST,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  const formatDate = (date) => {
    console.log("date", date);
    const classified = date.split("T", 2);
    const datePart = classified[0].split("-", 3);
    const timePart = classified[1].split(":", 3);

    const currentYear = datePart[0];
    const currentMonth = datePart[1];
    const currentDay = datePart[2];

    return `${currentDay} ${months[Number(currentMonth) - 1]} ${currentYear}`;
  };

  const dataParse = (result) => {
    const users = result.map((value, index) => ({
      id: value._id,
      name: `${value.fName} ${value.lName}`,
      fName: value.fName,
      lName: value.lName,
      email: value.email,
      role: value.role,
      accountStatus: value.accountStatus,
      telegram: getContact(value, "telegram"),
      whatsup: getContact(value, "whatsup"),
      date: value.createdAt ? formatDate(value.createdAt) : "not found",
    }));

    return users;
  };

  const onClickViewDetail = (message) => {
    setSelectedMessage(message);
    setViewDetail(true);
  };
  const onClickExitViewDetail = () => {
    setViewDetail(false);
    setSelectedMessage(null);
  };

  const [apiData, setApiData] = useState({
    state: "success",
    message: "",
    data: null,
  });

  const loadData2 = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/list`, {
        headers: {
          Authorization: access,
        },
      });
      console.log("res", res);
      setUSERLIST(dataParse(res.data));
      setApiData({
        state: "success",
        message: res.data.msg,
        data: dataParse(res.data),
      });
    } catch (error) {
      console.log("error", error);
      setApiData({
        state: "error",
        message: error.response.data.msg
          ? error.response.data.msg
          : "something went wrong while loading data",
        data: null,
      });
    }
  };

  const loadData = () => {
    axios
      .get(`${BASE_URL}/api/users/list`, {
        headers: {
          Authorization: access,
        },
      })
      .then((response) => {
        console.log("response", response);
        if (response.data.error) {
          setUSERLIST(dataParse(response.data.results.users.docs));
          setApiData({
            state: "success",
            message: response.data.message,
            data: dataParse(response.data.results.users.docs),
          });
        } else {
          setApiData({
            state: "error",
            message: response.data.message,
            data: null,
          });
        }
      })
      .catch((error) => {
        setApiData({
          state: "error",
          message: error.message,
          data: null,
        });
      });
  };

  useEffect(() => {
    loadData2();
  }, []);

  return apiData.data ? (
    <Page title="User">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => onAddTeams(null)}
          >
            New User
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const isItemSelected = selected.indexOf(row.id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={row.id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, row.id)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Avatar
                                alt={row.name}
                                src={/* avatarUrl ||  */ null}
                              />
                              <Typography variant="subtitle2" noWrap>
                                {row.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{row.email}</TableCell>
                          <TableCell align="left">{row.role}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={
                                (row.accountStatus === "unverified" &&
                                  "error") ||
                                "success"
                              }
                            >
                              {sentenceCase(row.accountStatus)}
                            </Label>
                          </TableCell>

                          <TableCell align="left">
                            {row.telegram && row.telegram !== ""
                              ? row.telegram
                              : "Not found"}
                          </TableCell>
                          <TableCell align="left">
                            {row.whatsup && row.whatsup !== ""
                              ? row.whatsup
                              : "Not found"}
                          </TableCell>
                          <TableCell align="left">{row.date}</TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1}>
                              <Chip
                                label="Products"
                                component="a"
                                color="success"
                                href="#basic-chip"
                                variant="outlined"
                                clickable
                                /* onClick={() => onAddTeams(row)} */
                              />
                              <Chip
                                label="Edit"
                                component="a"
                                color="info"
                                href="#basic-chip"
                                variant="outlined"
                                clickable
                                onClick={() => onAddTeams(row)}
                              />
                              <Chip
                                label="Delete"
                                component="a"
                                color="error"
                                href="#basic-chip"
                                variant="outlined"
                                clickable
                                onClick={() => onDeleteTeams(row)}
                              />
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <UserMoreMenu />
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
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Dialog
        open={openDeleteModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete User?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            are you sure you want to delete selected user.
          </DialogContentText>
        </DialogContent>

        {deleteResult.message && deleteResult.message !== "" && (
          <Alert severity={deleteResult.state} variant="outlined">
            {deleteResult.message}
          </Alert>
        )}
        <DialogActions>
          <Button disabled={isDeleting} onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            disabled={isDeleting}
            onClick={onConfirmDelete}
            loading={isDeleting}
            autoFocus
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <AddEditDataForm
        addResult={addResult}
        setAddResult={setAddResult}
        onAddTeamSuccess={onAddTeamSuccess}
        openModal={openAddModal}
        handleClose={handleCloseAddModal}
        teamMember={selectedMessage}
      />
    </Page>
  ) : apiData.message && apiData.message !== "" ? (
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
        {apiData.message}
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
