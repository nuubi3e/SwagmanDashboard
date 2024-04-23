import { ActionResponse, Response, ServerError } from '@/lib/response';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { OrderModel } from '@/lib/schemas/order.schema';
import { Log } from '@/lib/logs';
import { connectToDB } from '@/lib/server/db';
import { IProductSchema, ProductOrderInfo } from '@/lib/types/schema.types';
import ProductModel from '@/lib/schemas/product.schema';
import { Document, Types } from 'mongoose';

interface ProductPayload {
  id: string;
  size: string;
  quantity: number;
}

export const GET = async (req: NextRequest) => {
  try {
    const orderId = req.nextUrl.searchParams.get('order');
    const header = req.headers.get('Authorization') || '';

    const decodedToken = jwt.verify(header, process.env.JWT_SECRET!) as {
      id: string;
    };

    Log.log(orderId);

    await connectToDB();

    let response: ActionResponse<any>;

    // if we get OrderID then we return the products present in that order id to show user cart
    if (orderId) {
      const order = await OrderModel.findOne({
        _id: orderId,
        status: 'inCart',
      }).select('-createdAt -updatedAt -__v');

      response = Response.success({
        message: order
          ? 'Cart Products Selected Successfully'
          : 'Cart is Empty',
        data: {
          items: order?.products || [],
          length: order?.products.length || 0,
          order: order || undefined,
        },
        statusCode: 200,
      });
    }
    // if there is no orderId then we return the list of orders that is not in cart
    else {
      const orders = await OrderModel.find({
        userId: decodedToken.id,
        status: { $ne: 'inCart' },
      }).select('-__v -userId');

      Log.log(orders);

      response = Response.success({
        message: 'Order Selected Successfully',
        data: {
          items: orders,
          length: orders.length,
        },
        statusCode: 200,
      });
    }

    return NextResponse.json(response, { status: response.statusCode });
  } catch (err) {
    const error = Response.error(err);
    return NextResponse.json(error, { status: error.statusCode });
  }
};

interface OrderPayload {
  products: ProductPayload[];
  orderId: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const payload = (await req.json()) as OrderPayload;

    const isFirstTime = payload?.orderId ? false : true;

    const header = req.headers.get('Authorization') || '';

    // If there is no products or products is empty then its an invalid request
    if (!payload.products)
      throw new ServerError('Please provide products to place a order', 404);

    const decodedToken = jwt.verify(header, process.env.JWT_SECRET!) as {
      id: string;
    };

    const productsLength = payload.products.length;

    await connectToDB();

    // if products is empty then we remove the order of the user
    if (productsLength === 0 && !isFirstTime) {
      await OrderModel.findOneAndDelete({
        userId: decodedToken.id,
        status: 'inCart',
        _id: payload.orderId,
      });

      const response = Response.success({
        message: 'Order Removed Successfully',
        data: { id: null },
        statusCode: 200,
      });

      return NextResponse.json(response, { status: response.statusCode });
    }

    let order;
    let totalAmount: number = 0;
    const products: ProductOrderInfo[] = [];

    // CODE to calculate product price and total price based on quantity and product id coming from client
    for (let i = 0; i < productsLength; i++) {
      const product = payload.products[i];

      let productInDB:
        | (Document<unknown, {}, IProductSchema> &
            IProductSchema & {
              _id: Types.ObjectId;
            })
        | null;

      // try catch block to avoid error while finding products
      try {
        productInDB = await ProductModel.findById(product.id);
      } catch (err) {
        productInDB = null;
      }

      // if product doesn't exists then we simply continue
      if (!productInDB) continue;

      const productSize = productInDB.sizes.find(
        (size) => size.size === product.size
      );

      products.push({
        id: productInDB._id.toString(),
        size: productSize?.size || 'default',
        quantity: product.quantity,
        price: productSize?.price || productInDB.price,
        image: productInDB!.images?.[0] || '',
        name: productInDB!.name,
      });

      // calculating product size
      totalAmount =
        totalAmount +
        (productSize?.price || productInDB.price) * product.quantity;
    }

    if (isFirstTime) {
      order = await OrderModel.create({
        userId: decodedToken.id,
        products: products,
        status: 'inCart',
        totalAmount,
      });
    } else {
      order = await OrderModel.findByIdAndUpdate(payload.orderId, {
        products: products,
        totalAmount,
      });
    }

    const response = Response.success({
      message: 'Order Added Successfully',
      data: {
        id: order!._id.toString(),
      },
      statusCode: 200,
    });

    return NextResponse.json(response, { status: response.statusCode });
  } catch (err) {
    const error = Response.error(err);
    return NextResponse.json(error, { status: error.statusCode });
  }
};
