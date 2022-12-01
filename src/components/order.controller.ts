import { Application, NextFunction, Request, Response } from 'express';
import { PaginateResult } from 'mongoose';
import { IOrderDoc } from '../interfaces/order.interface';
import { OrderError } from '../lib/errors';
import * as responsehandler from '../lib/response-handler';
import Validator from '../middleware/validator';
import OrderService from '../services/order.service';
// import getOrderValidation from '../validations/get-order.validate';
import BaseApi from './BaseApi';

/**
 * Status controller
 */
export default class OrderController extends BaseApi {
  private _orderService;

  constructor(express: Application) {
    super();
    this.register(express);
    this._orderService = new OrderService();
  }

  public register(express: Application): void {
    express.use('/api/order', this.router);
    this.router.post(
      '/',
      // Validator('postOrderValidation'),
      this.createOrder.bind(this)
    );
    this.router.put(
      '/:orderId',
      // Validator('updateOrderValidation'),
      this.updateOrder.bind(this)
    );
    this.router.get(
      '/:orderId',
      // Validator('getOrderValidation'),
      this.getOrder.bind(this)
    );
  }

  public async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const order = await this._orderService.createOrder(req.body);
      this.sendResponse(order, res);
    } catch (err) {
      next(err);
    }
  }

  public async getOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const order = await this._orderService.getOrderById(
        req.params.orderId as string
      );
      this.sendResponse(order, res);
    } catch (err) {
      next(err);
    }
  }

  public async updateOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const order = await this._orderService.updateOrderById(
        req.params.orderId,
        req.body
      );
      this.sendResponse(order, res);
    } catch (err) {
      next(err);
    }
  }

  sendResponse(
    order: PaginateResult<IOrderDoc> | IOrderDoc | IOrderDoc[] | null,
    res: Response
  ) {
    res.locals.data = order;
    responsehandler.send(res);
  }
}
