import { Response, ServerError } from '@/lib/response';
import { CategoryModel } from '@/lib/schemas/category.schema';
import { checkContentAccessPermission } from '@/lib/server/auth';
import { connectToDB } from '@/lib/server/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    console.clear();
    const reqOrigin = req.headers.get('origin') || '';

    console.log(reqOrigin);

    if (!checkContentAccessPermission(reqOrigin))
      throw new ServerError('Access Denied', 400);

    await connectToDB();

    const categories = await CategoryModel.find().select(
      '-__v -createdAt -updatedAt -updatedBy -createdBy'
    );

    const response = Response.success({
      message: 'Categories Selected Successfully',
      data: {
        length: categories.length,
        categories,
      },
      statusCode: 200,
    });

    return NextResponse.json(response, { status: response.statusCode });
  } catch (err) {
    console.error(err);
    const error = Response.error(err);

    return NextResponse.json(error, { status: error.statusCode });
  }
};
