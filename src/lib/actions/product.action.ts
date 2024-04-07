'use server'
import { connectToDB } from '../server/db'
import { ActionResponse, Response, ServerError } from '../response'
import ProductModel from '../schemas/product.schema'
import { ProductPayload } from '../types/payload.types'
import { PERMISSIONTYPE } from '../utils/global.utils'
import { Log } from '../logs'
import { RemoveActionType } from '../types/global.types'
import { checkActionPermission, getSession } from '../server/auth'

const CUR_PERMISSION: PERMISSIONTYPE = 'products'

export const newProductAction: (
  product: ProductPayload
) => Promise<ActionResponse<{ product: string }>> = async (product) => {
  try {
    await connectToDB()

    const hasPermission = await checkActionPermission('add', CUR_PERMISSION)

    if (!hasPermission)
      throw new ServerError('You no longer have permission to add', 401)

    const user = await getSession()

    const newProduct = await ProductModel.create({
      ...product,
      createdBy: {
        id: user?.id,
        name: user?.username,
      },
      updatedBy: {
        id: user?.id,
        name: user?.username,
      },
    })

    const response = Response.success<{ product: string }>({
      message: `Product: ${newProduct.name} created Successfully.`,
      statusCode: 201,
      data: {
        product: JSON.stringify(newProduct),
      },
    })

    return response
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}

export const updateProductAction: (
  product: ProductPayload,
  id: string
) => Promise<ActionResponse<{ product: string }>> = async (product, id) => {
  try {
    await connectToDB()

    const hasPermission = await checkActionPermission('add', CUR_PERMISSION)

    if (!hasPermission)
      throw new ServerError('You no longer have permission to add', 401)

    const user = await getSession()

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        ...product,
        updatedBy: {
          id: user?.id,
          name: user?.username,
        },
      },
      { new: true }
    ).select('-__v')

    if (!updatedProduct) throw new ServerError('No data found', 404)

    const response = Response.success<{ product: string }>({
      message: `Product: ${product.name} created Successfully.`,
      statusCode: 201,
      data: {
        product: JSON.stringify(updatedProduct),
      },
    })

    return response
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}

export const removeProductAction: RemoveActionType = async (id) => {
  try {
    await connectToDB()

    const hasPermission = await checkActionPermission('remove', CUR_PERMISSION)

    if (!hasPermission)
      throw new ServerError('You no longer have permission to remove', 401)

    const product = await ProductModel.findByIdAndDelete(id)

    return Response.success({
      message: `${product?.name} Product deleted Successfully`,
      data: {
        id: product?._id.toString(),
      },
      statusCode: 200,
    })
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}
