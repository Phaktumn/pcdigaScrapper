/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class ProductAutoSearchInput {
  isActive: boolean;
}

export class CreateProductInput {
  ean: string;
  name: string;
  url: string;
  image: string;
}

export class UpdateProductInput {
  name?: Nullable<string>;
  url?: Nullable<string>;
}

export class CreateProductPriceInput {
  currentPrice: number;
  originalPrice: number;
  priceDifference: number;
  isOnDiscount: boolean;
  date: string;
  discountPercentage: number;
}

export class ProductAutoSearch {
  isActive: boolean;
  url: string;
}

export abstract class IMutation {
  abstract addProductToAutoSearch(url: string): boolean | Promise<boolean>;
}

export class Product {
  _id: string;
  ean: string;
  name: string;
  url: string;
  image?: string;
  prices?: Nullable<Nullable<ProductPrice>[]>;
  updatedAt: string;
  createdAt: string;
}

export class ProductPrice {
  _id: string;

  currentPrice: number;

  originalPrice: number;

  priceDifference: number;

  isOnDiscount?: Nullable<boolean>;

  discountPercentage: number;

  date: string;

  updatedAt: string;

  createdAt: string;
}

export class ProductFilter {
  ean: string;
  name: string;
  url: string;
  priceMin: number;
  priceMax: number;
  updatedAt: string;
  createdAt: string;
}

export abstract class IQuery {
  abstract getProduct(
    url: string,
    priceDate?: Nullable<string>,
  ): Product | Promise<Product>;
}

type Nullable<T> = T | null;
