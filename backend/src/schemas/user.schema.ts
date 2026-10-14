import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email().trim().min(1),
  passwordHash: z.string().trim().min(1),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().min(1).optional(),
  role: z.string().trim().optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email().trim().min(1),
  password: z.string().trim().min(1),
});

export const createUserAddressSchema = z.object({
  recipient: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  address: z.string().trim().min(1),
  ward: z.string().trim().min(1),
  district: z.string().trim().min(1),
  city: z.string().trim().min(1),
  isDefault: z.boolean().optional(),
});

export const updateUserAddressSchema = z.object({
  recipient: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(1).optional(),
  address: z.string().trim().min(1).optional(),
  ward: z.string().trim().min(1).optional(),
  district: z.string().trim().min(1).optional(),
  city: z.string().trim().min(1).optional(),
  isDefault: z.boolean().optional(),
});
