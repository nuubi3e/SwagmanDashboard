'use server';
import { connectToDB } from '../server/db';
import { ActionResponse, Response, ServerError } from '../response';
import { CategoryModel } from '../schemas/category.schema';
import { CTCategory } from '../types/client.types';
import { RemoveActionType } from '../types/global.types';
import { CategoryPayload } from '../types/payload.types';
import { PERMISSIONTYPE } from '../utils/global.utils';
import { checkActionPermission, getSession } from '../server/auth';
import ProductModel from '../schemas/product.schema';

const CUR_PERMISSION: PERMISSIONTYPE = 'categories';

export const newCategoryAction: (
  category: CategoryPayload
) => Promise<ActionResponse<{ category: CTCategory }>> = async (category) => {
  try {
    await connectToDB();

    const hasPermission = await checkActionPermission('add', CUR_PERMISSION);

    if (!hasPermission)
      throw new ServerError('You no longer have permission to add', 401);

    const user = await getSession();

    const newCategory = await CategoryModel.create({
      ...category,
      createdBy: {
        id: user?.id,
        name: user?.username,
      },
      updatedBy: {
        id: user?.id,
        name: user?.username,
      },
    });

    const response = Response.success<{ category: CTCategory }>({
      message: `Category: ${category.name} created Successfully.`,
      statusCode: 201,
      data: {
        category: {
          ...newCategory.toObject(),
          _id: newCategory._id.toString(),
          createdAt: newCategory.createdAt.toString(),
          updatedAt: newCategory.updatedAt.toString(),
        },
      },
    });

    return response;
  } catch (err) {
    const error = Response.error(err);
    return error;
  }
};

export const removeCategoryActions: RemoveActionType = async (id) => {
  try {
    await connectToDB();

    const hasPermission = await checkActionPermission('add', CUR_PERMISSION);

    if (!hasPermission)
      throw new ServerError('You no longer have permission to add', 401);

    const category = await CategoryModel.findByIdAndDelete(id); // deleting category

    // deleting products present in category
    await ProductModel.deleteMany({
      categoryId: id,
    });

    const response = Response.success({
      message: `Category: ${category?.name} removed Successfully.`,
      statusCode: 201,
      data: {
        id: category?._id.toString() || '',
      },
    });

    return response;
  } catch (err) {
    const error = Response.error(err);
    return error;
  }
};

export const updateCategoryAction: (
  category: CategoryPayload,
  id: string
) => Promise<ActionResponse<{ category: CTCategory }>> = async (
  category,
  id
) => {
  try {
    await connectToDB();

    const hasPermission = await checkActionPermission('add', CUR_PERMISSION);

    if (!hasPermission)
      throw new ServerError('You no longer have permission to add', 401);

    const user = await getSession();

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { ...category, updatedBy: { id: user?.id, name: user?.username } },
      { new: true }
    ).select('-__v');

    if (!updatedCategory) throw new ServerError('No data found', 404);

    const response = Response.success<{ category: CTCategory }>({
      message: `Category: ${category.name} created Successfully.`,
      statusCode: 201,
      data: {
        category: {
          ...updatedCategory.toObject(),
          _id: updatedCategory._id.toString(),
          createdAt: updatedCategory.createdAt.toString(),
          updatedAt: updatedCategory.updatedAt.toString(),
        },
      },
    });

    return response;
  } catch (err) {
    const error = Response.error(err);
    return error;
  }
};
