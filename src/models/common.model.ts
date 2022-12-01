import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export const ModifiedBySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  admin_id: {
    type: ObjectId,
    required: true,
  },
  modified_type: {
    type: String,
    enum: ['deactivated', 'modified'],
    required: true,
  },
  modified_date: {
    type: Date,
    default: Date.now,
  },
});

export const CostSchema = new Schema({
  mrp: {
    type: String,
    default: '',
  },
  tax: {
    type: String,
    default: '',
  },
});

export const DeliveryPartnerDetailsSchema = new Schema({});

export const CartDeliveryDetailsSchema = new Schema({
  delivery_partner_details: {
    type: String,
    default: '',
  },
  expected_delivery_date: {
    type: Date,
    default: null,
  },
});

export const OrderDeliveryDetailsSchema = new Schema({
  delivery_partner_details: {
    type: String,
    default: '',
  },
  awb_no: {
    type: String,
    default: '',
  },
  expected_delivery_date: {
    type: Date,
    default: null,
  },
  delivered_date: {
    type: Date,
    default: null,
  },
});

export const ProductDetailsSchema = new Schema({
  product_id: {
    type: ObjectId,
    required: true,
  },
});
