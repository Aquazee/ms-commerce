import { Application, NextFunction, Request, Response } from 'express';
import { PaginateResult } from 'mongoose';
import {
  IProductDoc,
  IProductService,
  ISearchProductRequestParams,
} from '../interfaces/product.interface';
import { LoginType } from '../lib/constants';
import { ProductError } from '../lib/errors';
import * as responsehandler from '../lib/response-handler';
import Validator from '../middleware/validator';
import ProductService from '../services/product.service';
// import getProductValidation from '../validations/get-product.validate';
import BaseApi from './BaseApi';

/**
 * Status controller
 */
export default class ProductController extends BaseApi {
  private _productService;

  constructor(express: Application) {
    super();
    this.register(express);
    this._productService = new ProductService();
  }

  public register(express: Application): void {
    express.use('/api/product', this.router);
    this.router.post(
      '/',
      // Validator('postProductValidation'),
      this.createProduct.bind(this)
    );
    this.router.put(
      '/:productId',
      // Validator('updateProductValidation'),
      this.updateProduct.bind(this)
    );
    this.router.get(
      '/search',
      // Validator('searchProductValidation'),
      this.searchProduct.bind(this)
    );
    this.router.get(
      '/:productId',
      // Validator('getProductValidation'),
      this.getProduct.bind(this)
    );
  }

  public async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const product = await this._productService.createProduct(req.body);
      this.sendResponse(product, res);
    } catch (err) {
      next(err);
    }
  }

  public async getProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const product = await this._productService.getProductById(
        req.params.productId as string
      );
      this.sendResponse(product, res);
    } catch (err) {
      next(err);
    }
  }

  public async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const product = await this._productService.updateProductById(
        req.params.productId,
        req.body
      );
      this.sendResponse(product, res);
    } catch (err) {
      next(err);
    }
  }

  public async searchProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const product = await this._productService.searchProduct(
        req.query as unknown as ISearchProductRequestParams
      );
      this.sendResponse(product, res);
    } catch (err) {
      next(err);
    }
  }

  sendResponse(
    product: PaginateResult<IProductDoc> | IProductDoc | IProductDoc[] | null,
    res: Response
  ) {
    res.locals.data = product;
    responsehandler.send(res);
  }
}
