import mongoose from 'mongoose';

export const convertToObjectId = (id: string) =>
  new mongoose.Types.ObjectId(id);
