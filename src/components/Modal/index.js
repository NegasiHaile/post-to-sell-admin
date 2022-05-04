import React from 'react';
import { Button, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';

function CustomModal({ showModal, setShowModal }) {
  return (
    <Dialog
      maxWidth={'md'}
      open={showModal.status}
      onClose={() => setShowModal({ ...showModal, status: false })}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{showModal.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{showModal.contentText}</DialogContentText>
      </DialogContent>

      {/* {deleteResult.message && deleteResult.message !== '' && (
        <Alert severity={deleteResult.state} variant="outlined">
          {deleteResult.message}
        </Alert>
      )} */}
      <DialogActions>
        <Button disabled={showModal.isLoading} onClick={() => setShowModal({ ...showModal, status: false })}>
          Cancel
        </Button>
        <LoadingButton onClick={showModal.onConfirm} loading={showModal.isLoading} autoFocus>
          Yes, {showModal.action}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default CustomModal;
