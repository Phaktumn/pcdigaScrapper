import { GlobalDataScraperService } from "./scraper/globadata-scrapper.service"
import { ScraperService } from "./scraper/scraper.service"

export enum ENTITIES_KEY {
  PRODUCTS_MODEL = 'products',
  SELLERS_MODEL = 'sellets',
  AUTO_SEARCH_MODEL = 'autosearch',
}

export enum SELLER_NAMES {
  GLOBAL_DATA = 'globaldata',
  PC_DIGA = 'pcdiga',
  VODAFONE = 'vodafone'
}

export const UpdatableProps = [
  'image',
  'name'
]

export const IgnoredProps = {
  _id: 0,
  'updatedAt': 0,
  'prices._id': 0,
  'prices.updatedAt': 0
}