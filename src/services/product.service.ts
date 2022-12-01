import MailAdapter from '../adapters/mail-adapter';
import BaseApi from '../components/BaseApi';
import ProductAccessor from '../data-access/product-accessor';
import {
  NewCreatedProduct,
  UpdateProductBody,
  IProductDoc,
  IProduct,
  ISearchProductRequestParams,
} from '../interfaces/product.interface';
import { ProductError } from '../lib/errors';
import { convertToObjectId } from '../lib/helper';
import ProductManager from '../managers/product-manager';
import Product from '../models/product.model';

const scope = `ProductService#${1}`;

export default class ProductService extends BaseApi {
  private _productAccessor;

  private _productManager;

  constructor() {
    super();
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
   * search Product by query
   * @param {string} email
   * @returns {Promise<IProductDoc | null>}
   */
  searchProduct = async ({
    search,
    sort_field,
    sort_type,
  }: ISearchProductRequestParams) => {
    const regex = new RegExp(`${search}`, 'i');
    const options: { [key: string]: any } =
      this.config.server.pagination_config;
    if (sort_field) {
      options[sort_field] = sort_type;
    }
    const products = await this._productAccessor.getProductByQuery(
      {
        $or: [
          { custom_label: regex },
          { description: regex },
          { brand: regex },
        ],
      },
      options
    );
    return products || {};
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

  register() {
    throw new Error('Method not implemented.');
  }
}
