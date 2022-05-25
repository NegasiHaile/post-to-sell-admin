// Static hirarchy category-subCategory-brand-model
const categories = [
  // vehicle category
  {
    _id: 1,
    category: 'Vehicle',
    subCategory: [
      {
        sub_name: 'car',
        brand: [
          {
            brand_name: 'tesla',
            model: ['model X', 'model 3'],
          },
          {
            brand_name: 'mercedes',
            model: ['B class', 'C class', 'CLA'],
          },
        ],
      },
      {
        sub_name: 'truck',
        brand: [
          {
            list_name: 'iveco',
            model: ['astira', 'magirus'],
          },
        ],
      },
    ],
    createdAt: '2022-04-19T11:06:49.562Z',
    description: 'All vehicle type under post to sell',
    categoryImage: 'uploads/category/9823842398hsahjk90rwey32.jpg',
  },
];
