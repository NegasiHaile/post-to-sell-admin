import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { removeSelectedCategory } from '../../Redux/Actions/CategoryActions';
// APIs
import { apiAddCategory, apiEditCategoryDetail, apiEditCategoryImage } from '../../API';
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
import { borderRadius } from '@mui/system';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// initial state of sub category
const initialStateSubCategory = {
  id: uuidv4(),
  sub_name: '',
  brands: [],
};

// Initial state of category
const initialStateCategory = {
  category: '',
  subCategory: [initialStateSubCategory],
  description: '',
  categoryImage: '',
  postFee: '',
};

const CategoryForm = () => {
  const params = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);

  const [category, setCategory] = useState(initialStateCategory);
  const [categoryIdOnEdit, setCategoryIdOnEdit] = useState(null);
  const [previewModalShow, setPreviewModalShow] = useState(false);

  const [showSubList, setShowSubList] = useState(false);

  useEffect(() => {
    setCategoryIdOnEdit(params.id);
    if (params.id) {
      if (categories.length > 0) {
        categories.map((categ) => {
          if (categ._id === params.id) {
            setCategory(categ);
          }
        });
      } else {
        navigate(`/dashboard/categories`);
      }
    }
    return () => {
      dispatch(removeSelectedCategory());
    };
  }, []);

  // Push sub category to a category
  const pushSubCategory = () => {
    setCategory({
      ...category,
      subCategory: [...category.subCategory, { id: uuidv4(), sub_name: '', brands: [] }],
    });
  };

  // Push brand to a specific sub category
  const pushBrand = async (indx) => {
    category.subCategory.map((sub) => {
      if (sub.id == indx) {
        let currentBrands = sub.brands;
        sub.brands = [
          ...currentBrands,
          {
            id: uuidv4(),
            brand_name: '',
            models: [],
          },
        ];
        setCategory({ ...category, subCategory: [...category.subCategory] });
        setShowSubList(true);
      } else {
      }
    });
  };

  // Push Model to brand
  const pushModel = (sub_id, brand_indx) => {
    category.subCategory.map((sub) => {
      if (sub.id == sub_id) {
        sub.brands.map((brand, bi) => {
          if (brand_indx === bi) {
            let activeBrandModels = brand.models;
            brand.models = [...activeBrandModels, ``];
            setCategory({ ...category, subCategory: [...category.subCategory] });
          } else {
          }
        });
      } else {
      }
    });
  };

  // On change subcategory
  const onChangeSubCategory = (e, id) => {
    category.subCategory.map((sub) => {
      if (sub.id == id) {
        sub.sub_name = e.target.value;
        setCategory({ ...category, subCategory: [...category.subCategory] });
      }
    });
  };

  // On change brancd
  const onChangeBrandInput = (e, sub_id, brand_id) => {
    category.subCategory.map((sub) => {
      if (sub.id == sub_id) {
        let currentBrands = sub.brands;
        currentBrands.map((brand) => {
          if (brand.id === brand_id) {
            brand.brand_name = e.target.value;
          }
        });
        sub.brands = [...currentBrands];
        setCategory({ ...category, subCategory: [...category.subCategory] });
      } else {
      }
    });
  };

  // On change model input
  const onChangeModelInput = (e, sub_id, brand_id, model_index) => {
    category.subCategory.map((sub) => {
      if (sub.id == sub_id) {
        let currentBrands = sub.brands;
        currentBrands.map((brand) => {
          if (brand.id === brand_id) {
            brand.models.map((model, mi) => {
              if (mi === model_index) {
                brand.models.splice(model_index, 1, e.target.value);
                // brand.brand_name = e.target.value;
              }
            });
          }
        });
        sub.brands = [...currentBrands];
        setCategory({ ...category, subCategory: [...category.subCategory] });
      } else {
      }
    });
  };

  // remove sub category
  const spliceSubCategory = (sub_id) => {
    category.subCategory.map((sub, index) => {
      if (sub.id == sub_id) {
        category.subCategory.splice(index, 1);
        setCategory({ ...category, subCategory: [...category.subCategory] });
      }
    });
  };

  // Delete a brand from the array of brands
  const spliceBrand = (sub_id, brand_index) => {
    category.subCategory.map((sub) => {
      if (sub.id == sub_id) {
        sub.brands.splice(brand_index, 1);
        setCategory({ ...category, subCategory: [...category.subCategory] });
      } else {
      }
    });
  };

  // Delete model from the array of models
  const spliceModel = (sub_id, brand_id, model_index) => {
    category.subCategory.map((sub) => {
      if (sub.id == sub_id) {
        sub.brands.map((brand) => {
          if (brand.id === brand_id) {
            brand.models.splice(model_index, 1);
            setCategory({ ...category, subCategory: [...category.subCategory] });
          }
        });
      } else {
      }
    });
  };

  // Toggle hide and show of brands
  const hideAndShowBrands = (element_id) => {
    var element = document.getElementById(element_id);
    element.style.display = element.style.display != 'none' ? 'none' : 'block';
  };

  // Toggle hide and show of models
  const hideAndShowModels = (element_id) => {
    var element = document.getElementById(element_id);
    element.style.display = element.style.display != 'none' ? 'none' : 'block';
  };

  // Submit new category detail
  const onSubmitFormSaveDetail = async (e) => {
    e.preventDefault();
    try {
      if (categoryIdOnEdit) {
        // Edit category API request
        const res = await apiEditCategoryDetail(categoryIdOnEdit, category);
        toast.success(res.data.msg);
      } else {
        var formData = new FormData();
        formData.append('categoryImage', category.categoryImage);
        const res = await apiAddCategory(category);
        const categoryId = res.data.detail._id;
        const res1 = await apiEditCategoryImage(categoryId, formData);
        setCategory(initialStateCategory);
        toast.success(res.data.msg);
      }
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  return (
    <form onSubmit={onSubmitFormSaveDetail}>
      <Grid container spacing={1}>
        <ToastContainer position="bottom-right" />
        <Grid item xs={12}>
          <Button variant="outlined" color="primary" size="small" sx={{ m: 1, fontSize: '10px', float: 'right' }}>
            <Iconify icon="eva:plus-fill" /> Preview
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            sx={{ m: 1, fontSize: '10px', float: 'right' }}
            onClick={() => pushSubCategory()}
          >
            <Iconify icon="eva:plus-fill" /> Add sub
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FormControl sx={{ m: 1, width: '100%' }}>
            <TextField
              name="category"
              value={category.category}
              onChange={(e) => setCategory({ ...category, category: e.target.value })}
              size="small"
              label="category"
              required={true}
            />
          </FormControl>
        </Grid>

        {category.subCategory.map((sub, index) => (
          <Grid item xs={6} sm={6} md={4} lg={4} key={index}>
            <FormControl size="small" sx={{ m: 1 }} variant="outlined">
              <InputLabel htmlFor={`sob_${index}`}>{`Sub_${index + 1}`}</InputLabel>
              <OutlinedInput
                id={`sub_${index}`}
                type={'text'}
                name={'sub_name'}
                value={sub.sub_name}
                onChange={(e) => onChangeSubCategory(e, sub.id)}
                style={{ fontSize: '14px' }}
                startAdornment={
                  <InputAdornment
                    onClick={() => spliceSubCategory(sub.id)}
                    position="start"
                    color="primary"
                    title="Remove this"
                  >
                    <IconButton aria-label={`sub_close_${index}`} edge="start">
                      <Iconify size="small" style={{ fontSize: '15px' }} icon="bi:x-circle" />
                    </IconButton>
                  </InputAdornment>
                }
                endAdornment={
                  sub.sub_name && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={`sub_forward_${index}`}
                        edge="end"
                        title="Add brand"
                        onClick={() => pushBrand(sub.id)}
                      >
                        <Iconify size="small" style={{ fontSize: '15px' }} icon="bi:plus-circle" />
                      </IconButton>
                      &nbsp;&nbsp;
                      <IconButton
                        aria-label={`sub_01_forward${index}`}
                        edge="end"
                        onClick={() => hideAndShowBrands(`list_${index}`)}
                        title="Hide/Show"
                      >
                        <Iconify size="small" style={{ fontSize: '14px' }} icon={'ic:twotone-unfold-less'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
                label={`Sub 0${index + 1}`}
              />
              <div id={`list_${index}`} style={{ display: 'none' }}>
                {sub.brands.map((brnd, bi) => {
                  return (
                    <FormControl key={bi} size="small" sx={{ m: 1, ml: 3, width: '90%', mr: 0 }}>
                      <InputLabel htmlFor={`B_${index}.${bi}`}>{`B_${index}.${bi}`}</InputLabel>
                      <OutlinedInput
                        id={`brand_${index}.${bi}`}
                        type={'text'}
                        name={'brand_name'}
                        value={brnd.brand_name}
                        onChange={(e) => onChangeBrandInput(e, sub.id, brnd.id)}
                        label={`B_${index}.${bi}`}
                        style={{ fontSize: '12px' }}
                        startAdornment={
                          <InputAdornment
                            onClick={() => spliceBrand(sub.id, bi)}
                            position="start"
                            color="primary"
                            title="Remove this"
                          >
                            <IconButton aria-label={`b_close_${index}.${bi}`} edge="start">
                              <Iconify size="small" style={{ fontSize: '12px' }} icon="bi:x" />
                            </IconButton>
                          </InputAdornment>
                        }
                        endAdornment={
                          brnd.brand_name && (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label={`b_forward_${index}.${bi}`}
                                edge="end"
                                onClick={() => pushModel(sub.id, bi)}
                                title="Add brand"
                              >
                                <Iconify size="small" style={{ fontSize: '12px' }} icon="akar-icons:plus" />
                              </IconButton>
                              &nbsp;&nbsp;
                              <IconButton
                                aria-label={`sub_01_forward${index}`}
                                edge="end"
                                onClick={() => hideAndShowModels(`list_${index}_${bi}`)}
                                title="Hide/Show"
                              >
                                <Iconify size="small" style={{ fontSize: '14px' }} icon={'ic:twotone-unfold-less'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      />
                      <div id={`list_${index}_${bi}`} style={{ display: 'none' }}>
                        {brnd.models.map((model, mi) => {
                          return (
                            <FormControl key={mi} size="small" sx={{ m: 1, ml: 3, mr: 0, width: '90%' }}>
                              <InputLabel
                                style={{ fontSize: '14px' }}
                                htmlFor={`M_${index}.${bi}.${mi}`}
                              >{`${index}.${bi}.${mi}`}</InputLabel>
                              <OutlinedInput
                                id={`M_${index}.${bi}.${mi}`}
                                type={'text'}
                                name={'model'}
                                value={model}
                                label={`M_${index}.${bi}.${mi}`}
                                style={{ fontSize: '10px' }}
                                onChange={(e) => onChangeModelInput(e, sub.id, brnd.id, mi)}
                                startAdornment={
                                  <InputAdornment
                                    onClick={() => spliceModel(sub.id, brnd.id, mi)}
                                    position="start"
                                    color="primary"
                                    title="Remove this"
                                  >
                                    <IconButton aria-label={`m_close${index}.${bi}.${mi}`} edge="start">
                                      <Iconify size="small" style={{ fontSize: '12px' }} icon="bi:x" />
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                            </FormControl>
                          );
                        })}
                      </div>
                    </FormControl>
                  );
                })}
              </div>
            </FormControl>
          </Grid>
        ))}
        <Grid xs={12} borderBottom="1px solid #cdcdcd" marginLeft="11px"></Grid>
        <Grid container spacing={2}>
          <Grid item xs={categoryIdOnEdit ? 12 : 6} md={categoryIdOnEdit ? 12 : 6}>
            <FormControl sx={{ m: 1, width: '100%' }}>
              <TextField
                name="postFee"
                value={category.postFee}
                onChange={(e) => setCategory({ ...category, postFee: e.target.value })}
                size="small"
                label="Post Fee"
                required={true}
                placeholder="10 ETB"
              />
            </FormControl>
          </Grid>
          {!categoryIdOnEdit && (
            <Grid item xs={6} md={6}>
              <FormControl sx={{ m: 1, width: '100%' }}>
                <TextField
                  type="file"
                  accept="image/*"
                  variant="outlined"
                  label="Category image"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="categoryImage"
                  onChange={(e) => setCategory({ ...category, categoryImage: e.target.files[0] })}
                  size="small"
                  required={true}
                />
              </FormControl>
            </Grid>
          )}
        </Grid>

        <Grid item xs={12}>
          <FormControl sx={{ m: 1, width: '100%' }}>
            <TextField
              size="small"
              name="description"
              value={category.description}
              placeholder="Description about this category."
              multiline
              rows={2}
              required={true}
              onChange={(e) => setCategory({ ...category, description: e.target.value })}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" size="small">
            <Iconify icon="bi:save" sx={{ mr: 1 }} /> {categoryIdOnEdit ? 'Save Change' : 'Submit Form'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CategoryForm;

const brandItem = (brnd, bi) => {
  return (
    <FormControl key={bi} size="small" sx={{ m: 1 }} variant="outlined">
      <InputLabel htmlFor={`sob_01${bi}`}>{`Sub 0${bi + 1}`}</InputLabel>
      <OutlinedInput
        id={`sob_01${bi}`}
        type={'text'}
        name={brnd.brand_name}
        value={brnd.brand_name + bi}
        label={`brnad 0${bi + 1}`}
      />
    </FormControl>
  );
};
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
