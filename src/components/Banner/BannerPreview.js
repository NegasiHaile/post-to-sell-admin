import React from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Paper, Typography } from '@mui/material';

// Sytyle of the image
const ImageStyel = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxHeight: 400,
  '& img': { width: '100%', maxHeight: 400 },
}));
// Image skeleton style if image not exist
const ImageSkeleton = styled(Paper)(({ theme }) => ({
  width: '100%',
  minHeight: 400,
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
function BannerPreview({ data }) {
  return (
    <>
      {data ? (
        <ImageStyel>
          <img
            src="https://www.bannerbatterien.com/upload/filecache/Banner-Batterien-Windrder2-web_06b2d8d686e91925353ddf153da5d939.webp"
            alt="banner"
          />
        </ImageStyel>
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
