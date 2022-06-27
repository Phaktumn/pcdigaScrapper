/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateProductInput {
  name: string;
  url: string;
  image?: Nullable<string>;
}

export interface UpdateProductInput {
  name?: Nullable<string>;
  url?: Nullable<string>;
}

export interface CreateProductPriceInput {
  currentPrice: number;
  originalPrice: number;
  priceDifference: number;
  isOnDiscount: boolean;
  discountPercentage: number;
  date: string;
}

export interface CreateSellerInput {
  name: string;
  productName: string;
}

export interface UpdateSellerInput {
  name?: Nullable<string>;
  url?: Nullable<string>;
  productName?: Nullable<string>;
}

export interface ProductAutoSearch {
  isActive: boolean;
  url: string;
  hash: string;
}

export interface IMutation {
  addProductToAutoSearch(url: string): boolean | Promise<boolean>;
}

export interface Seller {
  _id: string;
  name: string;
  url: string;
  productEan: string;
  productPrices?: Nullable<Nullable<ProductPrice>[]>;
  updatedAt: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  image?: Nullable<string>;
  sellers?: Nullable<Nullable<Seller>[]>;
  updatedAt: string;
  createdAt: string;
}

export interface ProductPrice {
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

export interface IQuery {
  getProduct(
    url: string,
    priceDate?: Nullable<string>,
  ): Product | Promise<Product>;
}

type Nullable<T> = T | null;
