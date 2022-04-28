import React, { useEffect } from "react";
import * as Yup from "yup";
import { useState } from "react";
import { useFormik, Form, FormikProvider } from "formik";
// material
import {
  Stack,
  TextField,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Button,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { server as BASE_URL } from "../../Constants/Server_Base_URL";

// ----------------------------------------------------------------------
const formData = [
  [
    {
      name: "fName",
      type: "text",
      label: "First Name",
    },
    {
      name: "lName",
      type: "text",
      label: "Last Name",
    },
  ],
  [
    {
      name: "email",
      type: "email",
      label: "Email",
    },
    {
      name: "role",
      type: "select",
      label: "Role",
      options: [
        { label: "User", value: "user" },
        { label: "Admin", value: "admin" },
      ],
    },
  ],
  [
    {
      name: "accountStatus",
      type: "select",
      label: "Account Status",
      options: [
        { label: "On", value: "On" },
        { label: "Unverified", value: "Unverified" },
      ],
    },
  ],
  [
    {
      name: "telegram",
      type: "text",
      label: "Telegram Address",
    },
    {
      name: "whatsup",
      type: "text",
      label: "Whatsup Address",
    },
  ],
];
//fName lName email role accountStatus telegram whatsup
export default function RegisterForm({
  addResult,
  setAddResult,
  onAddTeamSuccess,
  openModal,
  handleClose,
  teamMember,
}) {
  //const [packageImg, setPackageImg] = React.useState(null);
  const [createDataResult, setCreateDataResult] = useState({
    state: "success",
    message: "",
  });
  const RegisterSchema = Yup.object().shape({
    fName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("First Name is required"),
    lName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Last Name is required"),
    email: Yup.string()
      .email("Enter valid email")
      .required("email is required"),
    role: Yup.string().required("role is required"),
    accountStatus: Yup.string().required("accountStatus is required"),
    telegram: Yup.string(),
    whatsup: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      fName: teamMember && teamMember.fName ? teamMember.fName : "",
      lName: teamMember && teamMember.lName ? teamMember.lName : "",
      email: teamMember && teamMember.email ? teamMember.email : "",
      role: teamMember && teamMember.role ? teamMember.role : "",
      accountStatus:
        teamMember && teamMember.accountStatus ? teamMember.accountStatus : "",
      telegram: teamMember && teamMember.telegram ? teamMember.telegram : "",
      whatsup: teamMember && teamMember.whatsup ? teamMember.whatsup : "",
    },
    validationSchema: RegisterSchema,
    onSubmit: (finalValues, { setSubmitting }) => {
      teamMember && teamMember.id
        ? onEditPackage(finalValues, setSubmitting)
        : onAddPackage(finalValues, setSubmitting);
    },
  });
  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setFieldValue,
    values,
  } = formik;

  const onAddPackage = (finalValues, setIsSubmitting) => {
    setAddResult({ state: "success", message: "" });
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", finalValues.name);
    formData.append("price", finalValues.price);
    formData.append("quantity", finalValues.quantity);
    formData.append("shop", finalValues.shop);

    axios
      .post(
        `${BASE_URL}/api/products/`,
        {
          name: finalValues.name,
          price: finalValues.price,
          quantity: finalValues.quantity,
          shop: finalValues.shop,
        },
        {
          headers: {
            accessTokenOcr: localStorage.getItem("accessTokenOcr"),
          },
        }
      )
      .then((res) => {
        if (!res.data.error) {
          setAddResult({
            state: "success",
            message: "products added successfully!",
          });
          setIsSubmitting(false);
          onAddTeamSuccess();
        } else {
          setAddResult({
            state: "error",
            message:
              res.data.message || "Something went wrong while adding products!",
          });
          setIsSubmitting(false);
        }
      })
      .catch((error) => {
        setAddResult({
          state: "error",
          message:
            error.response && error.response.data
              ? error.response.data.message
              : "Something went wrong while adding products!",
        });
        setIsSubmitting(false);
      });
  };
  const onEditPackage = (finalValues, setIsSubmitting) => {
    setAddResult({ state: "success", message: "" });
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", finalValues.name);
    formData.append("price", finalValues.price);
    formData.append("quantity", finalValues.quantity);
    formData.append("shop", finalValues.shop);

    axios
      .patch(
        `${BASE_URL}/api/products/${teamMember.id}`,
        {
          name: finalValues.name,
          price: finalValues.price,
          quantity: finalValues.quantity,
          shop: finalValues.shop,
        },
        {
          headers: {
            accessTokenOcr: localStorage.getItem("accessTokenOcr"),
          },
        }
      )
      .then((res) => {
        if (!res.data.error) {
          setAddResult({
            state: "success",
            message: "products editted successfully!",
          });
          setIsSubmitting(false);
          onAddTeamSuccess();
        } else {
          setAddResult({
            state: "error",
            message:
              res.data.message ||
              "Something went wrong while editted products!",
          });
          setIsSubmitting(false);
        }
      })
      .catch((error) => {
        setAddResult({
          state: "error",
          message:
            error.response && error.response.data
              ? error.response.data.message
              : "Something went wrong while editted products!",
        });
        setIsSubmitting(false);
      });
  };
  let isDisabled = isSubmitting;

  useEffect(() => {
    setFieldValue(
      "fName",
      teamMember && teamMember.fName ? teamMember.fName : ""
    );
    setFieldValue(
      "lName",
      teamMember && teamMember.lName ? teamMember.lName : ""
    );
    setFieldValue(
      "email",
      teamMember && teamMember.email ? teamMember.email : ""
    );
    setFieldValue("role", teamMember && teamMember.role ? teamMember.role : "");
    setFieldValue(
      "accountStatus",
      teamMember && teamMember.accountStatus ? teamMember.accountStatus : ""
    );
    setFieldValue(
      "telegram",
      teamMember && teamMember.telegram ? teamMember.telegram : ""
    );
    setFieldValue(
      "whatsup",
      teamMember && teamMember.whatsup ? teamMember.whatsup : ""
    );
  }, [teamMember]);

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate /* onSubmit={handleSubmit} */>
          <Dialog
            open={openModal}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {teamMember && teamMember.id ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 3 }}>
                {formData.map((outerRow) => {
                  return (
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      {outerRow.map((innerRow) => {
                        return innerRow.type === "select" ? (
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              {innerRow.label}
                            </InputLabel>
                            <Select
                              size="small"
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={values[innerRow.name]}
                              label={innerRow.label}
                              onChange={(event) =>
                                setFieldValue(innerRow.name, event.target.value)
                              }
                            >
                              {innerRow.options.map((option) => (
                                <MenuItem value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <TextField
                            size="small"
                            fullWidth
                            type={innerRow.type}
                            label={innerRow.label}
                            {...getFieldProps(innerRow.name)}
                            error={Boolean(
                              touched[innerRow.name] && errors[innerRow.name]
                            )}
                            helperText={
                              touched[innerRow.name] && errors[innerRow.name]
                            }
                            disabled={isDisabled}
                          />
                        );
                      })}
                    </Stack>
                  );
                })}

                {addResult.message && addResult.message !== "" && (
                  <Alert severity={addResult.state} variant="outlined">
                    {addResult.message}
                  </Alert>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ mr: 3, mb: 3 }}>
              <Button onClick={handleClose} disabled={isDisabled}>
                Back
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={isDisabled}
                onClick={handleSubmit}
                autoFocus
              >
                Submit
              </LoadingButton>
            </DialogActions>
          </Dialog>
        </Form>
      </FormikProvider>
    </>
  );
}
