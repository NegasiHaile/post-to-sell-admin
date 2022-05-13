import React, { useState, useEffect } from 'react';

// APIs
import { apiAddNewBanner, apiEditBanner, apiEditBannerImage } from '../../API/index';
// Server domain names
import { server } from '../../Constants/Server_Base_URL';
// Material UI components
import { Button, Dialog, DialogContent, DialogActions, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// Custome components
import BannerPreview from './BannerPreview';
// Utils
import Toast from '../Utils/Toast';
// import { fDate } from '../utils/formatTime';

const BannerForm = ({
  openBannerDialog,
  setOpenBannerDialog,
  bannerInitailState,
  banner,
  setBanner,
  getAllBanners,
}) => {
  const [isLoading, setIsLoading] = useState(false); // If on submiting button will get disabled and loading
  const [bannerPreview, setBannerPreview] = useState(null);
  const [isBannerImageEditing, setIsIsBannerImageEditing] = useState(false);

  useEffect(() => {
    let objectUrl;
    // If there is new imported image
    if (banner.banner?.size) {
      objectUrl = URL.createObjectURL(banner.banner);
      setBannerPreview(objectUrl);
    } else if (banner.banner) {
      setBannerPreview(server + `/` + banner.banner);
    }

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [banner.banner]);

  // Oninput fields change
  const onInputChange = (e) => {
    if (e.target.name === 'banner') {
      setBanner({ ...banner, [e.target.name]: e.target.files[0] });
    } else {
      setBanner({ ...banner, [e.target.name]: e.target.value });
    }
  };

  // On Editing of banner image imput change
  const onChangeBannerImage = (e) => {
    setIsIsBannerImageEditing(true);
    setBanner({ ...banner, [e.target.name]: e.target.files[0] });
  };

  // Reseting of States
  const resetStates = (type, msg) => {
    setBannerPreview(null);
    setBanner(bannerInitailState);
    setIsIsBannerImageEditing(false);
    setOpenBannerDialog(false);
    getAllBanners();
    Toast(type, msg);
  };

  const editBannerImage = async () => {
    const formData = new FormData();
    formData.append('banner', banner.banner);
    const res2 = await apiEditBannerImage(formData, banner._id);
    console.log(res2.data);
    resetStates('success', res2.data.msg);
  };
  // On submit button add new banner or edit exiting one
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      // if there is a banner._id, it means it's existing banner
      // So it means the action is editing else the action is registering of new banner
      if (banner._id) {
        const res = await apiEditBanner({
          _id: banner._id,
          title: banner.title,
          duration: banner.duration,
          sequence: banner.sequence,
        });
        resetStates('success', res.data.msg);
      } else {
        const formData = new FormData();
        formData.append('title', banner.title);
        formData.append('duration', banner.duration);
        formData.append('sequence', banner.sequence);
        formData.append('banner', banner.banner);

        const res = await apiAddNewBanner(formData);
        resetStates('success', res.data.msg);
      }
    } catch (error) {
      Toast('error', error.response.data.msg);
    }
  };

  return (
    <Dialog
      fullScreen
      open={openBannerDialog}
      onClose={() => setOpenBannerDialog(false)}
      aria-labelledby="form-dialog-title"
    >
      <BannerPreview
        banner={banner}
        bannerPreview={bannerPreview}
        title={banner.title}
        onInputChange={onChangeBannerImage}
        isBannerImageEditing={isBannerImageEditing}
        editBannerImage={editBannerImage}
      />

      <form onSubmit={onSubmitForm}>
        <DialogContent>
          <Grid container spacing={1} sx={{ mt: 3 }}>
            {!banner._id && (
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
                  onChange={onInputChange}
                />
              </Grid>
            )}
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
          <Button
            onClick={() => {
              setBannerPreview(null);
              setIsIsBannerImageEditing(false);
              setOpenBannerDialog(false);
              setBanner(bannerInitailState);
            }}
            color="error"
            variant="contained"
          >
            Cancel
          </Button>
          <LoadingButton type="submit" color="primary" variant="contained" loading={isLoading}>
            {banner._id ? 'Save changes' : 'Add Banner'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BannerForm;
