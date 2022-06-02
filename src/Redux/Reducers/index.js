import { combineReducers } from 'redux';

import { CategoryReducer, selectedCategoryReducer } from './CategoryReducer';

const reducers = combineReducers({
  categories: CategoryReducer,
  selectedCategory: selectedCategoryReducer,
});

export default reducers;
