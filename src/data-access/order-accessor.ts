import mongoose, { PaginateResult } from 'mongoose';
import BaseApi from '../components/BaseApi';

import {
  NewCreatedOrder,
  UpdateOrderBody,
  IOrderDoc,
} from '../interfaces/order.interface';
import Order from '../models/order.model';

export default class OrderAccessor extends BaseApi {
  // constructor() {
  //   super();
  // }

  /**
   * Register a order
   * @param {NewCreatedOrder} orderBody
   * @returns {Promise<IOrderDoc>}
   */
  createOrder = async (orderBody: NewCreatedOrder): Promise<IOrderDoc> => {
    const orderDetails = orderBody;
    return Order.create(orderDetails);
  };

  /**
   * Get order by id
   * @param {mongoose.Types.ObjectId} id
   * @returns {Promise<IOrderDoc | null>}
   */
  getOrderById = async (
    id: mongoose.Types.ObjectId
  ): Promise<IOrderDoc | null> => Order.findById(id);

  /**
   * Get order by email
   * @param {string} email
   * @returns {Promise<IOrderDoc | null>}
   */
  getOrderBySeller = async (
    sellerId: mongoose.Types.ObjectId
  ): Promise<IOrderDoc[] | null> =>
    Order.find({ 'seller_info.seller_id': sellerId });

  /**
   * Update order by id
   * @param {mongoose.Types.ObjectId} orderId
   * @param {UpdateOrderBody} updateBody
   * @returns {Promise<IOrderDoc | null>}
   */
  updateOrderById = async (
    order: IOrderDoc,
    updateBody: UpdateOrderBody
  ): Promise<IOrderDoc | null> => {
    Object.assign(order, updateBody);
    await order.save();
    return order;
  };

  register() {
    throw new Error('Method not implemented.');
  }
}
