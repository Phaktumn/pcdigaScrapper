/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

import { ApiProperty } from "@nestjs/swagger";

/* tslint:disable */
/* eslint-disable */
export class ProductAutoSearchInput {
  isActive: boolean;
}

export class CreateProductInput {
  ean: string;
  name: string;
  url: string;
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
  @ApiProperty({
    type: String,
    example: '61734893',
  })
  ean: string;
  @ApiProperty({
    type: String,
    example: 'RTX 3080',
  })
  name: string;
  @ApiProperty({
    type: String,
    example: 'https://pcdiga.com/products/...',
  })
  url: string;
  @ApiProperty()
  prices?: Nullable<Nullable<ProductPrice>[]>;
  @ApiProperty({
    type: String,
    example: '2021',
  })
  updatedAt: string;
  @ApiProperty({
    type: String,
    example: '2021',
  })
  createdAt: string;
}

export class ProductPrice {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  currentPrice: number;
  @ApiProperty()
  originalPrice: number;
  @ApiProperty()
  priceDifference: number;
  @ApiProperty()
  isOnDiscount?: Nullable<boolean>;
  @ApiProperty()
  discountPercentage: number;
  @ApiProperty()
  updatedAt: string;
  @ApiProperty()
  createdAt: string;
}

export class ProductFilter {
  @ApiProperty({ type: String, example: '3546498245', })
  ean: string;
  @ApiProperty({ type: String, example: 'RTX 3080', })
  name: string;
  @ApiProperty({ type: String, example: 'https://pcdiga.com/...', })
  url: string;
  @ApiProperty({ type: Number, example: '100', })
  priceMin: number;
  @ApiProperty({ type: Number, example: '250', })
  priceMax: number;
  @ApiProperty({ type: String, example: '12/6/2021', })
  updatedAt: string;
  @ApiProperty({ type: String, example: '12/4/2022', })
  createdAt: string;
}

export abstract class IQuery {
  abstract getProduct(
    url: string,
    priceDate?: Nullable<string>,
  ): Product | Promise<Product>;
}

type Nullable<T> = T | null;
