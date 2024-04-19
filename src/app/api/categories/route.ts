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

    // finding categories which have some products
    const categories = await CategoryModel.aggregate([
      {
        // converting objectId to str to easy comparison
        $addFields: { strId: { $toString: '$_id' } },
      },
      {
        // joining product table to find how many product present in particular category
        $lookup: {
          from: 'products',
          localField: 'strId',
          foreignField: 'categoryId',
          as: 'products',
        },
      },
      {
        // adding a count field to filter categories having 0 product count
        $addFields: {
          productCount: { $size: '$products' },
        },
      },
      {
        // filtering categories
        $match: {
          productCount: { $gt: 0 },
        },
      },
      {
        // sorting new to old
        $sort: {
          createdAt: -1,
        },
      },
      {
        // only returning id and name
        $project: {
          _id: 1,
          name: 1,
        },
      },
    ]);

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
