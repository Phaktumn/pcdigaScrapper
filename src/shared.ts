export enum ENTITIES_KEY {
  PRODUCTS_MODEL = 'products',
  AUTO_SEARCH_MODEL = 'autosearch',
}

export const IgnoredProps = {
  _id: 0,
  'prices._id': 0,
  'created_at': 0,
  'updated_at': 0,
  'prices.createdAt': 0,
  'prices.updatedAt': 0,
}