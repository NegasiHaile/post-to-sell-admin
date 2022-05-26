// Static hirarchy category-subCategory-brand-model
const categories = [
  // vehicle category
  {
    _id: 1,
    category: 'Vehicle',
    subCategory: [
      {
        sub_name: 'car',
        brands: [
          {
            brand_name: 'tesla',
            model: ['model X', 'model 3'],
          },
          {
            brand_name: 'mercedes',
            models: ['B class', 'C class', 'CLA'],
          },
        ],
      },
      {
        sub_name: 'truck',
        brands: [
          {
            list_name: 'iveco',
            models: ['astira', 'magirus'],
          },
        ],
      },
    ],
    createdAt: '2022-04-19T11:06:49.562Z',
    description: 'All vehicle type under post to sell',
    categoryImage: 'uploads/category/9823842398hsahjk90rwey32.jpg',
  },
  {
    _id: 2,
    category: 'Fashion',
    subCategory: [
      {
        sub_name: 'car',
        brands: [
          {
            brand_name: 'tesla',
            model: ['model X', 'model 3'],
          },
          {
            brand_name: 'mercedes',
            models: ['B class', 'C class', 'CLA'],
          },
        ],
      },
      {
        sub_name: 'truck',
        brands: [
          {
            list_name: 'iveco',
            models: ['astira', 'magirus'],
          },
        ],
      },
    ],
    createdAt: '2022-04-19T11:06:49.562Z',
    description: 'All vehicle type under post to sell',
    categoryImage: 'uploads/category/9823842398hsahjk90rwey32.jpg',
  },
];
