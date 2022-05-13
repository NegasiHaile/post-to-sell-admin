import React from 'react';
// @mui
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import { Paper, Typography, Box, TextField, Button } from '@mui/material';

import Iconify from '../../components/Iconify';
// Sytyle of the image
const ImageStyel = styled(Paper)(({ theme }) => ({
  width: '100%',
  '& img': { width: '100%', maxHeight: 450 },
}));

// Image skeleton style if image not exist
const ImageSkeleton = styled(Paper)(({ theme }) => ({
  width: '100%',
  minHeight: 450,
  backgroundColor: '#EDEFF2',
  padding: '100px 0px 0px 40px',
}));

// Banner text style if image not exist
const BannerTitle = styled(Typography)(({ theme }) => ({
  width: '60%',
  padding: 15,
  borderRadius: 10,
  backgroundColor: '#F4F4F2',
}));

const useStyles = makeStyles((theme) => ({
  title: {
    width: '40%',
    position: 'absolute',
    top: '30%',
    left: '50px',
    color: '#fff',
    fontSize: '55px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    [theme.breakpoints.down('md')]: {
      fontSize: '30px',
      width: '60%',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
      width: '70%',
    },
  },
  upload_wraper: {
    position: 'absolute',
    top: 20,
    right: 80,
    backgroundColor: 'rgba(32,101,209, .6)',
    width: '40px',
    height: '33px',
    borderRadius: '50%',
    lineHeight: '36px',
    overflow: 'hidden',
    textAlign: 'center',
    border: '1px solid #fff',
  },
  upload_input: {
    position: 'absolute',
    transform: 'scale(2)',
    opacity: 0,
  },
  rounded_icon: {
    color: '#ffffff',
    // marginTop: '8px',
  },
  save_button_container: {
    position: 'absolute',
    top: 22,
    right: 10,
    backgroundColor: '#E8EEF8',
    borderRadius: '10px',
  },
}));

function BannerPreview({ banner, bannerPreview, title, onInputChange, isBannerImageEditing, editBannerImage }) {
  const classes = useStyles();

  return (
    <>
      {bannerPreview ? (
        <Box style={{ width: '100%', position: 'relative' }}>
          <ImageStyel>
            <img src={bannerPreview} alt="banner" />
          </ImageStyel>
          <Typography variant="h1" className={classes.title}>
            {' '}
            {title}{' '}
          </Typography>
          {banner._id && (
            <Box className={classes.upload_wraper}>
              <TextField type="file" name="banner" onChange={onInputChange} className={classes.upload_input} />
              <Iconify icon={'bi:camera'} className={classes.rounded_icon} />
            </Box>
          )}
          {banner._id && isBannerImageEditing && (
            <Box className={classes.save_button_container}>
              <Button size="small" onClick={editBannerImage}>
                Save
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <ImageSkeleton>
          <BannerTitle> </BannerTitle>
          <br />
          <BannerTitle> </BannerTitle>
        </ImageSkeleton>
      )}
    </>
  );
}

export default BannerPreview;
