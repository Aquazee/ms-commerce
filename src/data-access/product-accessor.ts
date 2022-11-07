import mongoose, { PaginateResult } from 'mongoose';
import BaseApi from '../components/BaseApi';

import {
  NewCreatedProduct,
  UpdateProductBody,
  IProductDoc,
} from '../interfaces/product.interface';
import Product from '../models/product.model';

export default class ProductAccessor extends BaseApi {
  /**
   * Register a product
   * @param {NewCreatedProduct} productBody
   * @returns {Promise<IProductDoc>}
   */
  createProduct = async (
    productBody: NewCreatedProduct
  ): Promise<IProductDoc> => {
    const productDetails = productBody;
    productDetails.cost.currency = this.config.currency;
    return Product.create(productDetails);
  };

  /**
   * Get product by id
   * @param {mongoose.Types.ObjectId} id
   * @returns {Promise<IProductDoc | null>}
   */
  getProductById = async (
    id: mongoose.Types.ObjectId
  ): Promise<IProductDoc | null> => Product.findById(id);

  /**
   * Get product by email
   * @param {string} email
   * @returns {Promise<IProductDoc | null>}
   */
  getProductBySeller = async (
    sellerId: mongoose.Types.ObjectId
  ): Promise<IProductDoc[] | null> =>
    Product.find({ 'seller_info.seller_id': sellerId });

  /**
   * Update product by id
   * @param {mongoose.Types.ObjectId} productId
   * @param {UpdateProductBody} updateBody
   * @returns {Promise<IProductDoc | null>}
   */
  updateProductById = async (
    product: IProductDoc,
    updateBody: UpdateProductBody
  ): Promise<IProductDoc | null> => {
    Object.assign(product, updateBody);
    await product.save();
    return product;
  };

  /**
   * Update product by id
   * @param {mongoose.Types.ObjectId} productId
   * @param {UpdateProductBody} updateBody
   * @returns {Promise<IProductDoc | null>}
   */
  getProductByQuery = async (
    query: any,
    options: any
  ): Promise<PaginateResult<IProductDoc>> => Product.paginate(query, options);

  /**
   * Get product by keywords
   * @param {String[]} keywords
   * @returns {Promise<IProductDoc[] | null>}
   */
  getProductByKeywords = async (
    keywords: string[]
  ): Promise<IProductDoc | null> =>
    Product.findOne({ keywords: { $in: keywords } });

  register() {
    throw new Error('Method not implemented.');
  }
}
