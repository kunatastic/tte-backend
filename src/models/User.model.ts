import Joi from 'joi';
import { model, Schema } from 'mongoose';
import { IUser } from '../types/types';

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    employeeId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

export const User = model('User', UserSchema);

export const validateUser = (user: IUser) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    employeeId: Joi.string().required().min(5).max(255),
    password: Joi.string().required().min(5).max(1024),
    role: Joi.string().required().valid('user', 'admin'),
  });
  return schema.validate(user);
};
