import mongoose, { Schema } from 'mongoose';
import { IProductDoc, IProductModel } from '../interfaces/product.interface';

import { IUserDoc, IUserModel } from '../interfaces/user.interface';
import { CartDeliveryDetailsSchema, ModifiedBySchema } from './common.model';

const { ObjectId } = mongoose.Schema.Types;

const AvailabilitySchema = new Schema({
  availability_date: {
    type: Date,
    default: null,
  },
  is_available: {
    type: Date,
    default: null,
  },
});

const CostSchema = new Schema({
  mrp: {
    type: String,
    default: '',
  },
  tax: {
    type: String,
    default: '',
  },
});

const OfferSchema = new Schema({
  type: {
    type: String,
    default: '',
  },
  condition: {
    type: [],
    default: [],
  },
  off_type: {
    type: String,
    enum: ['flat', 'flat_percent', 'upto'],
    default: '',
  },
  tnc: {
    type: String,
    enum: ['flat', 'flat_percent', 'upto'],
    default: '',
  },
});

const AttachmentSchema = new Schema({
  low_res: {
    type: String,
    default: '',
  },
  high_res: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    required: true,
  },
  sequence: {
    type: Number,
    required: true,
  },
});

const WarrantySchema = new Schema({
  covered: {
    type: String,
    default: '',
  },
  not_covered: {
    type: String,
    default: '',
  },
  unit: {
    type: String,
    default: '',
  },
  span: {
    type: Number,
    default: '',
  },
});

const DimensionsSchema = new Schema({
  size: {
    type: String,
    default: '',
  },
  size_type: {
    type: String,
    default: '',
  },
  size_unit: {
    type: String,
    default: '',
  },
});

const ProductSpecificationSchema = new Schema({
  section_name: {
    type: String,
    default: null,
  },
  values: {
    type: Object,
    default: null,
  },
});

const ProductSchema = new Schema({
  brand: {
    type: String,
    default: '',
  },
  custom_label: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: '',
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  keywords: {
    type: [String],
    default: [],
  },
  attachments: {
    type: [AttachmentSchema],
    default: [],
  },
  offers: {
    type: [OfferSchema],
    default: [],
  },
  availability: {
    type: AvailabilitySchema,
    default: null,
  },
  link: {
    type: String,
    default: '',
  },
  cost: {
    type: CostSchema,
    default: null,
  },
  product_type: {
    type: String,
    default: '',
  },
  gender: {
    type: String,
    enum: ['unisex', 'male', 'female'],
    default: 'unisex',
  },
  specifications: {
    type: ProductSpecificationSchema,
    default: null,
  },
  handling_time: {
    type: String,
    default: '',
  },
  delivery_details: {
    type: CartDeliveryDetailsSchema,
    default: null,
  },
  manufacturer_info: {
    type: {
      country_origin: {
        type: String,
        default: '',
      },
      manufacturer_id: {
        type: ObjectId,
        default: null,
      },
    },
    default: null,
  },
  seller_info: {
    type: {
      name: {
        type: String,
        required: true,
      },
      seller_id: {
        type: ObjectId,
        required: true,
      },
    },
    required: true,
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
  is_product_visible: {
    type: Number,
    enum: [0, 1],
    default: 1,
  },
  is_active: {
    type: Number,
    enum: [0, 1],
    default: 1,
  },
});

/**
 * Check if title or custom_label is taken
 * @param {string} label - The product's title or custom_label
 * @param {ObjectId} [excludeUserId] - The id of the product to be excluded
 * @returns {Promise<boolean>}
 */
ProductSchema.static(
  'isLabelTaken',
  async function (
    label: string,
    excludeProductId: mongoose.ObjectId
  ): Promise<boolean> {
    const Product = await this.findOne({
      $or: [{ custom_label: { $eq: /`${label}`/i } }],
      _id: { $ne: excludeProductId },
    });
    return !!Product;
  }
);

const Product = mongoose.model<IProductDoc, IProductModel>(
  'products',
  ProductSchema
);

export default Product;
