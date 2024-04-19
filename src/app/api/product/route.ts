import { Response, ServerError } from '@/lib/response';
import ProductModel from '@/lib/schemas/product.schema';
import { checkContentAccessPermission } from '@/lib/server/auth';
import { connectToDB, disconnectFromDB } from '@/lib/server/db';
import { NextResponse, NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    console.clear();
    const reqOrigin = req.headers.get('origin') || '';

    if (!checkContentAccessPermission(reqOrigin))
      throw new ServerError('Access Denied', 400);

    await connectToDB();

    const productName = req.nextUrl.searchParams.get('name');

    const product = await ProductModel.findOne({ name: productName })
      .sort({ createdAt: -1 })
      .select('-__v -createdBy -updatedBy -createdAt -updatedAt');

    if (!product) throw new ServerError('Product not Found!!', 404);

    const response = Response.success({
      message: 'Product Selected Successfully',
      data: {
        product,
      },
      statusCode: 200,
    });

    return NextResponse.json(response, { status: response.statusCode });
  } catch (err) {
    const error = Response.error(err);
    return NextResponse.json(error, { status: error.statusCode });
  }
};
