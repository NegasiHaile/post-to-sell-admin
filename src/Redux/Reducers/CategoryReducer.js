import { CategoryActions } from '../Constants/ActionTypes';

// Reducer of category
export const CategoryReducer = (state = [], { type, payload }) => {
  switch (type) {
    case CategoryActions.SET_CATEGORIES:
      return payload;
    default:
      return state;
  }
};

export const selectedCategoryReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case CategoryActions.SELECTED_CATEGORY:
      return payload;
    case CategoryActions.REMOVE_SELECTED_CATEGORY:
      return {};
    default:
      return state;
  }
};
