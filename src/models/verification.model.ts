import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import VerificationDetailsModel from './VerificationDetailsModel';

// eslint-disable-next-line import/prefer-default-export
export default class VerificationModel {
  public mobile: VerificationDetailsModel;

  public email: VerificationDetailsModel;
}

export const VerificationDetailsSchema = new mongoose.Schema(
  {
    is_verified: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    fcode: {
      type: String,
      default: uuidv4(),
    },
    verified_date: {
      type: Date,
      default: null,
    },
    fcode_created: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

export const VerificationSchema = new mongoose.Schema(
  {
    mobile: {
      type: VerificationDetailsSchema,
      default: new VerificationDetailsModel(),
    },
    email: {
      type: VerificationDetailsSchema,
      default: new VerificationDetailsModel(),
    },
  },
  {
    _id: false,
  }
);
