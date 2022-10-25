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
    type: DeliveryDetailsSchema,
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

const ShoppingCarts = mongoose.model<IUserDoc, IUserModel>(
  'shopping_carts',
  ShoppingCartSchema
);

export default ShoppingCarts;
