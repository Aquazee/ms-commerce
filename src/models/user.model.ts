import bcrypt from 'bcryptjs';
import mongoose, { PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

import { IUserDoc, IUserModel } from '../interfaces/user.interface';
import { ModifiedBySchema } from './common.model';
import VerificationModel, { VerificationSchema } from './verification.model';

const { ObjectId } = mongoose.Schema.Types;

const CardValiditySchema = new Schema({
  year: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
});

const CardSchema = new Schema({
  c_id: {
    type: String,
    required: true,
  },
  card_no: {
    type: String,
    required: true,
  },
  name_on_card: {
    type: String,
    required: true,
  },
  validity: {
    type: CardValiditySchema,
    required: true,
  },
  is_active: {
    type: Number,
    default: 1,
  },
});

const PANCardDetailsSchema = new Schema({
  full_name: {
    type: String,
    required: true,
  },
  card_no: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});

const AddressDetailsSchema = new Schema({
  aid: {
    type: Number,
  },
  default: {
    type: Number,
  },
  line_1: {
    type: String,
  },
  line_2: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  pin_code: {
    type: String,
  },
  landmark: {
    type: String,
  },
  type: {
    type: String,
  },
});

const UserSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      default: '',
    },
    first_name: {
      type: String,
      default: '',
    },
    last_name: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    alt_mobile: {
      type: String,
      default: '',
    },
    profile_pic: {
      type: String,
      default: '',
    },
    social: {
      facebook_id: {
        type: String,
        default: '',
      },
      google_id: {
        type: String,
        default: '',
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: (value: string) => {
        if (Boolean(value) && !validator.isEmail(value)) {
          throw new Error('Email is not valid');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            'Password must contain at least one letter and one number'
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    gender: {
      type: Number,
      default: 0,
    },
    address_details: {
      type: [AddressDetailsSchema],
    },
    pan_details: {
      type: PANCardDetailsSchema,
      default: null,
      required: false,
    },
    cards: {
      type: [CardSchema],
      default: null,
    },
    verification: {
      type: VerificationSchema,
      default: new VerificationModel(),
    },
    wishList: {
      type: [ObjectId],
      default: [],
    },
    role: {
      type: [String],
      default: ['user'],
    },
    user_type: {
      type: [String],
      enum: ['manufacturer', 'seller', 'buyer'],
      default: 'buyer',
    },
    block_expires: {
      type: Date,
      select: false,
      default: null,
    },
    login_attempts: {
      type: Number,
      default: 0,
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
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

// add plugin that converts mongoose to json
// UserSchema.plugin(convertToJSON);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
UserSchema.static(
  'isEmailTaken',
  async function (
    email: string,
    excludeUserId: mongoose.ObjectId
  ): Promise<boolean> {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  }
);

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
UserSchema.method(
  'isPasswordMatch',
  async function (password: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    return bcrypt.compare(password, user.password);
  }
);

UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password as string, 8);
  }
  next();
});

UserSchema.plugin(mongoosePaginate);

const User = mongoose.model<IUserDoc, IUserModel>('User', UserSchema);

export default User;
