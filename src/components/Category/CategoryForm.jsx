import React, { useState } from 'react';

// Material
import {
  Grid,
  FormControl,
  TextField,
  Button,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';

// Source of Icons
import Iconify from '../../components/Iconify';

const initialStateSubCategory = {
  id: 0,
  list_name: 'sub',
  nest_name: '',
  nest_list: [],
};

const initialState = {
  category: '',
  subCategory: [initialStateSubCategory],
  description: '',
};

const CategoryForm = () => {
  const [category, setCategory] = useState(initialState);
  const [categoryHirarcy, setCategoryHirarcy] = useState('category.subCategory');

  const pushSubCategory = () => {
    console.log('Tay tigebrileka abzi');
    setCategory({
      ...category,
      subCategory: [...category.subCategory, initialStateSubCategory],
    });
  };
  // const pushSubCategory = () => {
  //   setCategory((prev) => category.subCategory.push({ ...initialStateSubCategory, id: category.subCategory.length }));
  // };
  const pushNestList = (i) => {
    console.log('Abzileku ' + i);
    setCategory(() => {
      return {
        ...category,
        subCategory: [
          ...category.subCategory,
          (category.subCategory[i] = { ...category.subCategory[i], nest_list: [initialStateSubCategory] }),
        ],
      };
    });
  };

  const spliceSubCategory = (index) => {
    console.log(index);
    setCategoryHirarcy(category.subCategory.splice(index, 1));
  };
  console.log(category);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={12} md={4} lg={3}>
        <FormControl sx={{ m: 1 }}>
          <TextField
            name="category"
            value={category.category}
            onChange={(e) => setCategory({ ...category, category: e.target.value })}
            size="small"
            label="category"
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={3}>
        {category.subCategory.map((sub, index) => (
          <InputItem
            key={index}
            sub={sub}
            index={index}
            pushSubCategory={pushSubCategory}
            pushNestList={pushNestList}
            spliceSubCategory={spliceSubCategory}
          />
        ))}
        <Button variant="contained" color="secondary" sx={{ borderRadius: 8 }} onClick={() => pushSubCategory()}>
          <Iconify icon="eva:plus-fill" />
        </Button>
      </Grid>
    </Grid>
  );
};

export default CategoryForm;

const InputItem = ({ sub, index, setCategory, pushNestList, spliceSubCategory }) => (
  <FormControl key={index} size="small" sx={{ m: 1 }} variant="outlined">
    <InputLabel htmlFor={`sob_01${index}`}>{`Sub 0${index + 1}`}</InputLabel>
    <OutlinedInput
      id={`sob_01${index}`}
      type={'text'}
      name={sub.list_name}
      value={sub.list_name}
      onChange={(e) => setCategory({ ...sub, list_name: e.target.value })}
      startAdornment={
        <InputAdornment onClick={() => spliceSubCategory(index)} position="start" color="primary">
          <IconButton aria-label={`sub_01_close${index}`} edge="start">
            <Iconify size="small" icon="ci:off-close" />
          </IconButton>
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end" onClick={() => pushNestList(index)}>
          <IconButton aria-label={`sub_01_forward${index}`} edge="end">
            <Iconify size="small" icon="carbon:skip-forward-outline-filled" />
          </IconButton>
        </InputAdornment>
      }
      label={`Sub 0${index + 1}`}
    />
    &nbsp;{' '}
    {sub.nest_list.map((nest, index) => (
      <InputItem key={index} sub={nest} index={index} />
    ))}
  </FormControl>
);
