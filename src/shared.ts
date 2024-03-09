export enum ENTITIES_KEY {
  PRODUCTS_MODEL = 'products',
  SELLERS_MODEL = 'sellers',
  AUTO_SEARCH_MODEL = 'autosearch',
}

export enum SELLER_NAMES {
  GLOBAL_DATA = 'globaldata',
  PC_DIGA = 'pcdiga',
  AQUARIO = 'aquario'
}

export const UpdatableProps = [
  'image',
  'name'
]

export const IgnoredProps = {
  'updatedAt': 0,
  'prices._id': 0,
  'prices.updatedAt': 0
}