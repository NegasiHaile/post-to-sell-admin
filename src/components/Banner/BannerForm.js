import React, { useState } from 'react';

// Material UI components
import { Button, Dialog, DialogContent, DialogActions, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// Custome components
import BannerPreview from './BannerPreview';

const BannerForm = ({ openBannerDialog, setOpenBannerDialog, banner, setBanner }) => {
  const [isLoading, setIsLoading] = useState(false); // If on submiting button will get disabled and loading

  const onInputChange = (e) => {
    console.log(e.target.name);
    if (e.target.name !== 'banner') {
      setBanner({ ...banner, [e.target.name]: e.target.value });
      // console.log(banner);
    }
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    console.log(banner);
    alert('Done!');
  };
  return (
    <Dialog
      fullScreen
      open={openBannerDialog}
      onClose={() => setOpenBannerDialog(false)}
      aria-labelledby="form-dialog-title"
    >
      <BannerPreview />

      <form onSubmit={onSubmitForm}>
        <DialogContent>
          <Grid container spacing={1} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={11} md={6} lg={3}>
              <TextField
                type="file"
                name="banner"
                accept="image/*"
                variant="outlined"
                label="Banner"
                InputLabelProps={{
                  shrink: true,
                }}
                autoFocus
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={11} md={6} lg={3}>
              <TextField
                type="text"
                name="title"
                value={banner.title}
                label="Title"
                fullWidth
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={11} md={6} lg={3}>
              <TextField
                type="number"
                name="sequence"
                value={banner.sequence}
                label="Squence"
                fullWidth
                size="medium"
                required
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={11} md={6} lg={3}>
              <TextField
                type="date"
                label="Duration"
                variant="outlined"
                name="duration"
                value={banner?.duration}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={onInputChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBannerDialog(false)} color="error" variant="contained">
            Cancel
          </Button>
          <LoadingButton type="submit" color="primary" variant="contained" loading={isLoading}>
            Add Banner
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BannerForm;
