import React from 'react';
// @mui
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import { Paper, Typography } from '@mui/material';

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
}));
function BannerPreview({ bannerPreview, title }) {
  const classes = useStyles();
  return (
    <>
      {bannerPreview ? (
        <div style={{ width: '100%', position: 'relative' }}>
          <ImageStyel>
            <img src={bannerPreview} alt="banner" />
          </ImageStyel>
          <h2 className={classes.title}> {title} </h2>
        </div>
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
