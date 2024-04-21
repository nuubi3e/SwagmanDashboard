import { ActionResponse, Response, ServerError } from '@/lib/response'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { OrderModel } from '@/lib/schemas/order.schema'
import { IOrderSchema, ProductOrderInfo } from '@/lib/types/schema.types'
import { Document, Types } from 'mongoose'
import { Log } from '@/lib/logs'
import { connectToDB } from '@/lib/server/db'

interface OrderPayload {
  products: ProductOrderInfo[]
  orderId: string
  totalAmount: number
}

export const GET = async (req: NextRequest) => {
  try {
    const orderId = req.nextUrl.searchParams.get('order')
    const header = req.headers.get('Authorization') || ''

    const decodedToken = jwt.verify(header, process.env.JWT_SECRET!) as {
      id: string
    }

    Log.log(orderId)

    await connectToDB()

    let response: ActionResponse<any>

    // if we get OrderID then we return the products present in that order id to show user cart
    if (orderId) {
      const order = await OrderModel.findOne({
        _id: orderId,
        status: 'inCart',
      })

      response = Response.success({
        message: order
          ? 'Cart Products Selected Successfully'
          : 'Cart is Empty',
        data: {
          items: order?.products || [],
          length: order?.products.length || 0,
        },
        statusCode: 200,
      })
    }
    // if there is no orderId then we return the list of orders that is not in cart
    else {
      const orders = await OrderModel.find({
        userId: decodedToken.id,
        status: { $ne: 'inCart' },
      }).select('-__v -userId')

      Log.log(orders)

      response = Response.success({
        message: 'Order Selected Successfully',
        data: {
          items: orders,
          length: orders.length,
        },
        statusCode: 200,
      })
    }

    return NextResponse.json(response, { status: response.statusCode })
  } catch (err) {
    const error = Response.error(err)
    return NextResponse.json(error, { status: error.statusCode })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const payload = (await req.json()) as OrderPayload
    await connectToDB()

    const isFirstTime = payload?.orderId ? false : true

    const header = req.headers.get('Authorization') || ''

    if (!payload.products || payload.products.length === 0)
      throw new ServerError('Please provide products to place a order', 404)

    const decodedToken = jwt.verify(header, process.env.JWT_SECRET!) as {
      id: string
    }

    let order

    if (isFirstTime) {
      order = await OrderModel.create({
        userId: decodedToken.id,
        products: payload.products,
        status: 'inCart',
        totalAmount: payload.totalAmount,
      })
    } else {
      order = await OrderModel.findByIdAndUpdate(payload.orderId, {
        products: payload.products,
        totalAmount: payload.totalAmount,
      })
    }

    const response = Response.success({
      message: 'Order Added Successfully',
      data: {
        id: order!._id.toString(),
      },
      statusCode: 200,
    })

    return NextResponse.json(response, { status: response.statusCode })
  } catch (err) {
    const error = Response.error(err)
    return NextResponse.json(error, { status: error.statusCode })
  }
}
