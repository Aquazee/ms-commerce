import _ from 'lodash';
import mongoose, { Schema } from 'mongoose';

import { IUserDoc, IUserModel } from '../interfaces/user.interface';
import {
  ProductDetailsSchema,
  CartDeliveryDetailsSchema,
  ModifiedBySchema,
} from './common.model';

const { ObjectId } = mongoose.Schema.Types;

const UserDetailsSchema = new Schema({});

const ShoppingCartSchema = new Schema({
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
    type: CartDeliveryDetailsSchema,
    default: null,
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

ShoppingCartSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const cart = this;
  cart.user_id = _.get(cart, 'user_details.user_id');
  next();
});

const ShoppingCarts = mongoose.model<IUserDoc, IUserModel>(
  'shopping_carts',
  ShoppingCartSchema
);

export default ShoppingCarts;
