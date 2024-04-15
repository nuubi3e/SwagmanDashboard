import { Log } from '@/lib/logs';
import { Response, ServerError } from '@/lib/response';
import ProductModel from '@/lib/schemas/product.schema';
import { connectToDB } from '@/lib/server/db';
import { NextRequest, NextResponse } from 'next/server';

interface ReviewPayload {
  userId: string;
  productId: string;
  review: string;
  rating: number;
  username: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const db = await connectToDB();
    console.clear();
    const payload = (await req.json()) as ReviewPayload;

    const product = await ProductModel.findById(payload.productId);

    Log.log(product);

    const userReviewIndex = product!.reviews.findIndex(
      (review) => review.userId === payload.userId
    );
    // if user has not reviewed the product
    if (userReviewIndex === -1) {
      product!.reviews.push({
        userId: payload.userId,
        review: payload.review,
        rating: payload.rating,
        username: payload.username,
      });
    }
    //  if user already reviewed the product
    else {
    }

    await db.disconnect();
    const response = Response.success({
      message: 'working on it',
      data: undefined,
      statusCode: 200,
    });
    return NextResponse.json(response, { status: response.statusCode });
  } catch (err) {
    const error = Response.error(err);
    return NextResponse.json(error, { status: error.statusCode });
  }
};
