import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ModifiedBySchema } from './common.model';

export const AppDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
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
      enum: [0, 1],
      default: 1,
    },
  },
  {
    _id: false,
  }
);

const AppDataModel = mongoose.model<any, any>('AppData', AppDataSchema);

export default AppDataModel;
