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

// initial state of a sub category brand
const initialStateBrand = {
  brancd_name: '',
  models: [],
};

// initial state of sub category
const initialStateSubCategory = {
  id: null,
  sub_name: 'sub',
  brands: [],
};

// Initial state of the top level of the category
const initialStateCategory = {
  category: '',
  subCategory: [],
  description: '',
};

const CategoryForm = () => {
  const [category, setCategory] = useState(initialStateCategory);

  // Push sub category to a category
  const pushSubCategory = () => {
    console.log(category);
    setCategory({
      ...category,
      subCategory: [...category.subCategory, { ...initialStateSubCategory, id: category.subCategory.length }],
    });
  };

  // Push brand to a specific sub category
  const pushBrand = async (indx) => {
    const subs = await category.subCategory;
    console.log(subs);
    const sub = await subs[indx];
    subs.splice(indx, 1);
    console.log(sub);
    sub.brands.push(initialStateBrand);
    console.log(sub);
    subs.push(sub);
    setCategory({ ...category, subCategory: [...category.subCategory, sub] });
  };

  const spliceSubCategory = (index) => {
    console.log(index);
    let subs = category.subCategory;
    subs.splice(index, 1);
    setCategory({ ...category, subCategory: subs });
  };

  const onChangeSubCategory = (e, indx) => {
    console.log(indx);
    const sub = category.subCategory[indx];
    console.log(sub);
    sub.sub_name = e.target.value;
    console.log(sub);
    category.subCategory[indx] = sub;
    console.log(category);
    setCategory({ ...category, subCategory: category.subCategory });
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
          <FormControl key={index} size="small" sx={{ m: 1 }} variant="outlined">
            <InputLabel htmlFor={`sob_01${index}`}>{`Sub 0${index + 1}`}</InputLabel>
            <OutlinedInput
              id={`sob_01${index}`}
              type={'text'}
              name={sub.sub_name}
              value={sub.sub_name + index}
              onChange={(e) => onChangeSubCategory(e, index)}
              startAdornment={
                <InputAdornment onClick={() => spliceSubCategory(index)} position="start" color="primary">
                  <IconButton aria-label={`sub_01_close${index}`} edge="start">
                    <Iconify size="small" icon="ci:off-close" />
                  </IconButton>
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end" onClick={() => pushBrand(index)}>
                  <IconButton aria-label={`sub_01_forward${index}`} edge="end">
                    <Iconify size="small" icon="carbon:skip-forward-outline-filled" />
                  </IconButton>
                </InputAdornment>
              }
              label={`Sub 0${index + 1}`}
            />
          </FormControl>
        ))}
        <Button variant="contained" color="secondary" sx={{ borderRadius: 8 }} onClick={() => pushSubCategory()}>
          <Iconify icon="eva:plus-fill" />
        </Button>
      </Grid>
    </Grid>
  );
};

export default CategoryForm;

//  const ctgry = {
//    name: '',
//    subCategories: [
//      { id: '0', list_name: '', nest_list: [] },
//      {
//        id: '1',
//        list_name: '',
//        nest_list: [
//          {
//            id: '1.0',
//            list_name: '',
//            nest_list: [
//              { id: '1.0.0', list_name: '', nest_list: [] },
//              { id: '1.0.1', list_name: '', nest_list: [] },
//            ],
//          },
//          { id: '1.1', list_name: '', nest_list: [] },
//        ],
//      },
//    ],
//  };

//  function deepSplice(array, indices, deleteCount, ...toBeInserted) {
//    const last = indices.pop();
//    console.log('last' + last);
//    const finalItems = indices.reduce((acc, i) => acc[i].nest_list, array);
//    finalItems.push({ ...initialNestList, id: '1.1.1' });
//    console.log(ctgry);
//    return array;
//  }
//  console.log(
//    // removes "1.0.1" item and inserts a new object there
//    deepSplice(ctgry.subCategories, [1, 0, 1], 1, { id: '1.0.1', name: 'the last object' })
//  );
