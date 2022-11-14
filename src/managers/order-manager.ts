import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';
import BaseApi from '../components/BaseApi';
import { IOrder, IOrderDoc } from '../interfaces/order.interface';
import { OrderError } from '../lib/errors';

interface IOrderManager {
  isOrderBlocked: (order: IOrderDoc) => void;
  isOrderInactive: (order: IOrderDoc) => void;
}

class OrderManager implements IOrderManager {
  isOrderSplitRequired(order: IOrder) {
    if ('is_active' in order) {
      return false;
    }
    return true;
  }
}

export default OrderManager;
