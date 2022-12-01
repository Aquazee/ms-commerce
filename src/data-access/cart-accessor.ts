import mongoose, { PaginateResult } from 'mongoose';
import BaseApi from '../components/BaseApi';

import {
  NewCreatedCart,
  UpdateCartBody,
  ICartDoc,
} from '../interfaces/cart.interface';
import Cart from '../models/order.model';

export default class CartAccessor extends BaseApi {
  // constructor() {
  //   super();
  // }

  /**
   * Register a order
   * @param {NewCreatedCart} orderBody
   * @returns {Promise<ICartDoc>}
   */
  createCart = async (orderBody: NewCreatedCart): Promise<ICartDoc> => {
    const orderDetails = orderBody;
    return Cart.create(orderDetails);
  };

  /**
   * Get order by id
   * @param {mongoose.Types.ObjectId} id
   * @returns {Promise<ICartDoc | null>}
   */
  getCartById = async (
    id: mongoose.Types.ObjectId
  ): Promise<ICartDoc | null> => Cart.findById(id);

  /**
   * Get order by email
   * @param {string} email
   * @returns {Promise<ICartDoc | null>}
   */
  getCartBySeller = async (
    sellerId: mongoose.Types.ObjectId
  ): Promise<ICartDoc[] | null> =>
    Cart.find({ 'seller_info.seller_id': sellerId });

  /**
   * Update order by id
   * @param {mongoose.Types.ObjectId} orderId
   * @param {UpdateCartBody} updateBody
   * @returns {Promise<ICartDoc | null>}
   */
  updateCartById = async (
    order: ICartDoc,
    updateBody: UpdateCartBody
  ): Promise<ICartDoc | null> => {
    Object.assign(order, updateBody);
    await order.save();
    return order;
  };

  register() {
    throw new Error('Method not implemented.');
  }
}
