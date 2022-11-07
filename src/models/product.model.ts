import mongoose, { PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IProductDoc, IProductModel } from '../interfaces/product.interface';

import { IUserDoc, IUserModel } from '../interfaces/user.interface';
import { CartDeliveryDetailsSchema, ModifiedBySchema } from './common.model';

const { ObjectId } = mongoose.Schema.Types;

const AvailabilitySchema = new Schema(
  {
    next_availability_date: {
      type: Date,
      default: null,
    },
    in_stock: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

const TaxSchema = new Schema(
  {
    tax_type: {
      type: String,
      default: 'IGST',
    },
    tax_amount: {
      type: Number,
      default: 0,
    },
    taxable_on_value: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

// const TaxSchema = new Schema({
//   tax_type: {
//     type: String,
//     default: '',
//   },
//   taxable_value: {
//     type: Number,
//     default: 0,
//   },
// });

const ProductConfigSchema = new Schema(
  {
    is_shipping_charges_combined_with_gross_amount: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const CostSchema = new Schema(
  {
    mrp: {
      type: Number,
      default: 0,
    },
    selling_price: {
      type: Number,
      default: 0,
    },
    gross_amount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    tax_info: {
      type: TaxSchema,
      required: true,
      // default: null,
    },
    currency: {
      type: String,
      // default: null,
    },
    // gst_info: {
    //   type: GstSchema,
    //   required: true,
    //   // default: null,
    // },
  },
  {
    _id: false,
  }
);

const OfferSchema = new Schema(
  {
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
  },
  {
    _id: false,
  }
);

const AttachmentSchema = new Schema(
  {
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
  },
  {
    _id: false,
  }
);

const ReviewAndRatingsSchema = new Schema(
  {
    review_count: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    rated_customer_count: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const ManufacturerInfoSchema = new Schema(
  {
    country_origin: {
      type: String,
      default: '',
    },
    manufacturer_id: {
      type: ObjectId,
      default: null,
    },
  },
  {
    _id: false,
  }
);

const SellerInfofSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    seller_id: {
      type: ObjectId,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const DimensionsSchema = new Schema(
  {
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
  },
  {
    _id: false,
  }
);

const WarrantySchema = new Schema(
  {
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
  },
  {
    _id: false,
  }
);

const PaymentOptionSchema = new Schema(
  {
    section_name: {
      type: String,
      default: null,
    },
    values: {
      type: Object,
      default: null,
    },
  },
  {
    _id: false,
  }
);

const ProductSpecificationSchema = new Schema(
  {
    section_name: {
      type: String,
      default: null,
    },
    values: {
      type: Object,
      default: null,
    },
  },
  {
    _id: false,
  }
);

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
  manufacturer_info: {
    type: ManufacturerInfoSchema,
    default: null,
  },
  seller_info: {
    type: SellerInfofSchema,
    required: true,
  },
  product_config: {
    type: ProductConfigSchema,
    required: true,
  },
  review_and_ratings: {
    type: ReviewAndRatingsSchema,
    default: null,
  },
  modified_by: {
    type: [ModifiedBySchema],
    default: [],
  },
  payment_options: {
    type: [PaymentOptionSchema],
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

ProductSchema.plugin(mongoosePaginate);

const Product = mongoose.model<IProductDoc, IProductModel>(
  'products',
  ProductSchema
);

export default Product;
