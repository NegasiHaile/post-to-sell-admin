import { CategoryActions } from '../Constants/ActionTypes';

// set all the categies list
export const setCategory = (categories) => {
  return {
    type: CategoryActions.SET_CATEGORIES,
    payload: categories,
  };
};

// Set the category which is selected maybe to edit or to see it's detail
export const selectedCategory = (category) => {
  return {
    type: CategoryActions.SELECTED_CATEGORY,
    payload: category,
  };
};

// Clean the selected category state
export const removeSelectedCategory = () => {
  return {
    type: CategoryActions.REMOVE_SELECTED_CATEGORY,
  };
};
