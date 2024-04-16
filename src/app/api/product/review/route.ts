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

    if (!product) throw new ServerError('Product not found', 404);
    Log.log(product);

    const userReviewIndex = product!.reviews.findIndex(
      (review) => review.userId === payload.userId
    );

    const userReview = {
      userId: payload.userId,
      review: payload.review,
      rating: payload.rating,
      username: payload.username,
    };

    // if user has not reviewed the product
    if (userReviewIndex === -1) {
      product!.reviews.push(userReview); // adding new review
    }
    //  if user already reviewed the product
    else {
      product.reviews.splice(userReviewIndex, 1, userReview); // replacing new review from previous review
    }

    await product.save();

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
