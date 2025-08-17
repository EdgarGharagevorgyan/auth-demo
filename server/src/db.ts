import mongoose from 'mongoose';
import { ENV } from './config/env';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(ENV.MONGO_URI);
  console.log('Mongo connected');
}
