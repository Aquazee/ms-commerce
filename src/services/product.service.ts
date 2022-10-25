import MailAdapter from '../adapters/mail-adapter';
import ProductAccessor from '../data-access/product-accessor';
import {
  NewCreatedProduct,
  UpdateProductBody,
  IProductDoc,
  IProduct,
} from '../interfaces/product.interface';
import { ProductError } from '../lib/errors';
import { convertToObjectId } from '../lib/helper';
import ProductManager from '../managers/product-manager';
import Product from '../models/product.model';

const scope = `ProductService#${1}`;

export default class ProductService {
  private _productAccessor;

  private _productManager;

  constructor() {
    this._productAccessor = new ProductAccessor();
    this._productManager = new ProductManager();
  }

  /**
   * Create product
   * @param {NewCreatedProduct} productBody
   * @returns {Promise<IProductDoc>}
   */
  createProduct = async (
    productBody: NewCreatedProduct
  ): Promise<IProductDoc> => this._productAccessor.createProduct(productBody);

  /**
   * Get product by email
   * @param {string} email
   * @returns {Promise<IProductDoc | null>}
   */
  getProductBylabel = async (label: string) => {
    const regex = /`${label}`/i;
    const product = await this._productAccessor.getProductByQuery({
      custom_label: regex,
    });
    if (!product) {
      throw ProductError.ProductNotFound;
    }
    return product;
  };

  /**
   * Get product by email
   * @param {string} email
   * @returns {Promise<IProductDoc | null>}
   */
  getProductByKeywords = async (keywords: string[]) => {
    const product = await this._productAccessor.getProductByKeywords(keywords);
    if (!product) {
      throw ProductError.ProductNotFound;
    }
    return product;
  };

  /**
   * Update product by id
   * @param {string} productId
   * @param {UpdateProductBody} updateBody
   * @returns {Promise<IProductDoc | null>}
   */
  updateProductById = async (
    productId: string,
    updateBody: UpdateProductBody
  ): Promise<IProductDoc | null> => {
    const product = await this.getProductById(productId);
    await this.checkProductLabelTaken(updateBody.custom_label);
    Object.assign(product, updateBody);
    await product.save();
    return product;
  };

  /**
   * Check Email already exists for other product
   * @param {string | undefined} productId
   * @returns {Promise<IProductDoc | null>}
   */
  checkProductLabelTaken = async (label: string | undefined) => {
    if (label && (await Product.isLabelTaken(label))) {
      throw ProductError.ProductCustomLabelTaken;
    }
  };

  getProductById = async (productId: string) => {
    const convertedProductId = convertToObjectId(productId);
    const product = await this._productAccessor.getProductById(
      convertedProductId
    );
    if (!product) {
      throw ProductError.ProductNotFound;
    }
    return product;
  };

  /**
   * Get product by Facebook id
   * @param {String} id
   * @returns {Promise<IProductDoc | null>}
   */
  getProductByFbId = async (id: string): Promise<IProductDoc | null> =>
    this.getProductBySocialId('facebook_id', id);

  /**
   * Get product by Google id
   * @param {String} id
   * @returns {Promise<IProductDoc | null>}
   */
  getProductByGoogleId = async (id: string): Promise<IProductDoc | null> =>
    this.getProductBySocialId('google_id', id);

  getProductBySocialId = async (
    socialPlatformName: string,
    id: string
  ): Promise<IProductDoc | null> =>
    this._productAccessor.getProductByQuery({
      [`social.${socialPlatformName}`]: id,
    });
}
