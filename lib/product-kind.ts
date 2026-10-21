import type {SanityProduct} from '@/types';

// The existing Course category has a product-like slug; use its stable CMS ID.
const COURSE_CATEGORY_ID = 'd05c02f7-d13b-42ec-b581-4e8ddb887bdb';

export function isActiveCourse(product: Pick<SanityProduct, 'category' | 'isActive'>) {
  return product.isActive === true && product.category?._id === COURSE_CATEGORY_ID;
}
