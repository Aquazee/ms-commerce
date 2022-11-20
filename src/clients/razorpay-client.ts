import Razorpay from 'razorpay';
import BaseApi from '../components/BaseApi';
import {
  IOrderOptionsRazorPay,
  IRazorpayInstance,
  IUserRazorPay,
} from '../interfaces/razorpay.interface';
import logger from '../lib/logger';
import Messages from '../lib/messages';

const scope = `RazorpayClient#${1.0}`;

class RazorpayClient extends BaseApi {
  private _instance: IRazorpayInstance;

  // constructor() {
  //   super();
  // }

  init() {
    const { user, pass } =
      this.config.third_party.payment_gateway.type.razor_pay.auth;
    this._instance = new Razorpay({
      key_id: user,
      key_secret: pass,
    });
  }

  createCustomers(options: IUserRazorPay) {
    const method = 'createUser';
    try {
      const userResp = this._instance.customers.create(options);
      logger.info(scope, method, Messages.RazorpayUserCreationSuccess, {
        userResp,
      });
    } catch (ex) {
      logger.info(scope, method, Messages.RazorpayUserCreationFailed, {
        options,
        ex,
      });
    }
  }

  createOrder(options: IOrderOptionsRazorPay) {
    const method = 'createOrder';
    try {
      const orderResp = this._instance.orders.create(options);
      logger.info(scope, method, Messages.RazorpayUserCreationSuccess, {
        orderResp,
      });
    } catch (ex) {
      logger.info(scope, method, Messages.RazorpayUserCreationFailed, {
        options,
        ex,
      });
    }
  }

  public register() {
    throw new Error('Method not implemented.');
  }
}

export default RazorpayClient;
