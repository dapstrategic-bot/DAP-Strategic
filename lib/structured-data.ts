export function productOffer(
  product: { salePrice?: number; originalPrice?: number },
  url: string,
) {
  // Match the existing displayed-price precedence; missing prices are not free offers.
  const price = product.salePrice || product.originalPrice;
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) return undefined;
  return {
    '@type': 'Offer',
    price,
    priceCurrency: 'THB',
    availability: 'https://schema.org/InStock',
    url,
  };
}
