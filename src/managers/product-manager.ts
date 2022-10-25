import { IProduct, IProductDoc } from '../interfaces/product.interface';
import { ProductError } from '../lib/errors';

interface IProductManager {
  isProductInactive: (product: IProductDoc) => void;
}

class ProductManager implements IProductManager {
  isProductInactive(product: IProduct) {
    if (product.is_active === 0) {
      throw ProductError.ProductInactive;
    }
  }
}

export default ProductManager;
