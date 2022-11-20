import BaseApi from '../components/BaseApi';
import OrderAccessor from '../data-access/order-accessor';
import {
  NewCreatedOrder,
  UpdateOrderBody,
  IOrderDoc,
  IOrderService,
  IOrder,
  IGetOrderRequest,
} from '../interfaces/order.interface';
import { OrderError } from '../lib/errors';
import { convertToObjectId } from '../lib/helper';
import logger from '../lib/logger';
import Order from '../models/order.model';

const scope = `OrderService#${1}`;

export default class OrderService extends BaseApi {
  private _orderAccessor;

  // private _orderManager;

  constructor() {
    super();
    this._orderAccessor = new OrderAccessor();
  }

  /**
   * Create order
   * @param {NewCreatedOrder} orderBody
   * @returns {Promise<IOrderDoc>}
   */
  createOrder = async (orderBody: NewCreatedOrder): Promise<IOrderDoc> =>
    this._orderAccessor.createOrder(orderBody);

  /**
   * Update order by id
   * @param {string} orderId
   * @param {UpdateOrderBody} updateBody
   * @returns {Promise<IOrderDoc | null>}
   */
  updateOrderById = async (
    orderId: string,
    updateBody: UpdateOrderBody
  ): Promise<IOrderDoc | null> => {
    const order = await this.getOrderById(orderId);
    Object.assign(order, updateBody);
    await order.save();
    return order;
  };

  getOrder = async (payload: IGetOrderRequest) => {
    const order = await this._orderAccessor.getOrderById(
      convertToObjectId(payload.orderId as string)
    );
    if (!order) {
      throw OrderError.OrderNotFound;
    }
    return order;
  };

  getOrderById = async (orderId: string) => {
    const order = await this._orderAccessor.getOrderById(
      convertToObjectId(orderId)
    );
    if (!order) {
      throw OrderError.OrderNotFound;
    }
    return order;
  };

  register() {
    throw new Error('Method not implemented.');
  }
}
