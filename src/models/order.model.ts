import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

import { IUserDoc, IUserModel } from '../interfaces/user.interface';
import convertToJSON from '../lib/convert-to-json';
import {
  ProductDetailsSchema,
  DeliveryDetailsSchema,
  ModifiedBySchema,
  OrderDeliveryDetailsSchema,
} from './common.model';

const { ObjectId } = mongoose.Schema.Types;

interface IOrderDoc {}
interface IOrderModel {}

const UserDetailsSchema = new Schema({});

const OrderStatusSchema = new Schema({
  is_shipped: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  is_delivered: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  is_return_requested: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  is_returned: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  is_replace_requested: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  is_replaced: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  is_cancel_requested: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  is_cancelled: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
});

const OrderPaymentDetailsSchema = new Schema({});

const OrderSchema = new Schema({
  user_id: {
    type: ObjectId,
    required: true,
  },
  user_details: {
    type: UserDetailsSchema,
    required: true,
  },
  product_details: {
    type: [ProductDetailsSchema],
    required: true,
  },
  delivery_details: {
    type: OrderDeliveryDetailsSchema,
    default: null,
  },
  order_status: {
    type: OrderStatusSchema,
  },
  payment_details: {
    type: OrderPaymentDetailsSchema,
  },
  modified_by: {
    type: [ModifiedBySchema],
    default: [],
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  modified_date: {
    type: Date,
    default: null,
  },
  is_active: {
    type: Number,
    default: 1,
  },
});

const Orders = mongoose.model<IOrderDoc, IOrderModel>('orders', OrderSchema);

export default Orders;
