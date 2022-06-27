import * as mongoose from 'mongoose';

export const ProductPriceSchema = new mongoose.Schema(
  {
    currentPrice: Number,
    originalPrice: Number,
    priceDifference: Number,
    isOnDiscount: Boolean,
    discountPercentage: Number,
    date: String
  },
  { timestamps: true, versionKey: false },
);

export const SellerSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
    /** Seller product URL */
    productUrl: String,
    /** Seller ean */
    productEan: String,
    productPrices: [{ type: ProductPriceSchema }]
  },
  { timestamps: true, versionKey: false },
);

export const ProductSchema = new mongoose.Schema(
  {
    /** Product SKU */
    sku: String,
    name: String,
    image: String,
    sellers: [{ type: SellerSchema }],
  },
  { timestamps: true, versionKey: false },
);
