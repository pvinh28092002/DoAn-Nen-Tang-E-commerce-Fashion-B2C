import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { UserUpdateInput } from "../generated/prisma/models.js";

const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};
//Read
export async function getUsers() {
  return prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
    select: userPublicSelect,
  });
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userPublicSelect,
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
//Create

type UpdateUserData = {
  name?: string;
  email?: string;
  passwordHash?: string;
};

//Update
export async function updateUser(id: string, data: UpdateUserData) {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });
  if (!existingUser) {
    throw new AppError(404, "User not found");
  }

  if (data.email && data.email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailExists) {
      throw new AppError(409, "A user with this email already exists");
    }
  }
  const userData: UserUpdateInput = {
    name: data.name,
    email: data.email,
    passwordHash: data.passwordHash,
  };
  return prisma.user.update({
    where: { id },
    data: userData,
  });
}

//Delete
export async function deleteUser(id: string) {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });
  if (!existingUser) {
    throw new AppError(404, "User not found");
  }

  return prisma.user.delete({
    where: { id },
    select: userPublicSelect,
  });
}

//Address

export async function getUserAddresses(userId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!existingUser) {
    throw new AppError(404, "User not found");
  }
  return prisma.address.findMany({
    where: { userId },
    orderBy: {
      isDefault: "desc",
    },
  });
}

type CreateUserAddressData = {
  recipient: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  isDefault?: boolean;
};
export async function createUserAddress(
  userId: string,
  data: CreateUserAddressData,
) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!existingUser) {
    throw new AppError(404, "User not found");
  }
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }
  return prisma.address.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function updateUserAddress(
  userId: string,
  addressId: string,
  data: Partial<CreateUserAddressData>,
) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!existingUser) {
    throw new AppError(404, "User not found");
  }

  const existingAddress = await prisma.address.findUnique({
    where: { id: addressId, userId: userId },
  });
  if (!existingAddress) {
    throw new AppError(404, "Address not found");
  }

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({
    where: { id: addressId },
    data: {
      ...data,
      userId,
    },
  });
}

export async function deleteUserAddress(userId: string, addressId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!existingUser) {
    throw new AppError(404, "User not found");
  }
  const existingAddress = await prisma.address.findUnique({
    where: { id: addressId, userId: userId },
  });
  if (!existingAddress) {
    throw new AppError(404, "Address not found");
  }
  return prisma.address.delete({
    where: { id: addressId },
  });
}
