import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const VerificationDetailsSchema = new mongoose.Schema(
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

const VerificationDetailsModel = mongoose.model<any, any>(
  'VerificationDetails',
  VerificationDetailsSchema
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

const VerificationModel = mongoose.model<any, any>(
  'Verification',
  VerificationSchema
);

export default VerificationModel;
