import { Application, NextFunction, Request, Response } from 'express';
import { PaginateResult } from 'mongoose';
import { ICartDoc } from '../interfaces/cart.interface';
import { CartError } from '../lib/errors';
import * as responsehandler from '../lib/response-handler';
import Validator from '../middleware/validator';
import CartService from '../services/cart.service';
// import getCartValidation from '../validations/get-cart.validate';
import BaseApi from './BaseApi';

/**
 * Status controller
 */
export default class CartController extends BaseApi {
  private _cartService;

  constructor(express: Application) {
    super();
    this.register(express);
    this._cartService = new CartService();
  }

  public register(express: Application): void {
    express.use('/api/cart', this.router);
    this.router.post(
      '/',
      // Validator('postCartValidation'),
      this.createCart.bind(this)
    );
    this.router.put(
      '/:cartId',
      // Validator('updateCartValidation'),
      this.updateCart.bind(this)
    );
    this.router.get(
      '/:cartId',
      // Validator('getCartValidation'),
      this.getCart.bind(this)
    );
  }

  public async createCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cart = await this._cartService.createCart(req.body);
      this.sendResponse(cart, res);
    } catch (err) {
      next(err);
    }
  }

  public async getCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cart = await this._cartService.getCartById(
        req.params.cartId as string
      );
      this.sendResponse(cart, res);
    } catch (err) {
      next(err);
    }
  }

  public async updateCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cart = await this._cartService.updateCartById(
        req.params.cartId,
        req.body
      );
      this.sendResponse(cart, res);
    } catch (err) {
      next(err);
    }
  }

  sendResponse(
    cart: PaginateResult<ICartDoc> | ICartDoc | ICartDoc[] | null,
    res: Response
  ) {
    res.locals.data = cart;
    responsehandler.send(res);
  }
}
