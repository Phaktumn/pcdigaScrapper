import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const transformPricesToNumber = (price: string): number =>
  +price.replace(/(\d+),(\d+).*/, '$1.$2').replace(/[^0-9.]/g, '');

export const calculateDiscountPercentage = (
  priceDifference: number,
  originalPrice: number,
): number => +((priceDifference / (originalPrice === 0 ? 1 : originalPrice)) * 100).toFixed(2);

export const isOlderThan24Hours = (lastUpdateDate: Date): boolean => {
  return lastUpdateDate.getTime() < Date.now() - 86400000;
};

/**
 *
 * @param lastUpdateDate Last date the price was updated
 * @param hours number of hours to check
 * @param minutes number of minutes to check
 * @returns true if the last update ocurred more than hours/mins ago
 */
export const isOlderThan = (
  lastUpdateDate: Date,
  hours: number = 1,
  minutes: number = 0,
): boolean => {
  var hToMs = hours * 3600000;
  var mToMs = minutes * 60 * 1000;
  return lastUpdateDate.getTime() < Date.now() - (hToMs + mToMs);
};

export const isCurrentMonthAndYear = (lastUpdateDate: Date): boolean => {
  if (!lastUpdateDate) return false;

  return (
    lastUpdateDate.getMonth() === new Date().getMonth() &&
    lastUpdateDate.getFullYear() === new Date().getFullYear()
  );
};

export const SilentQuery = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.query[data];
    } else {
      return request.query;
    }
  },
);
