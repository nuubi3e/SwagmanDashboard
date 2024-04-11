import { Log } from '@/lib/logs';
import { Response, ServerError } from '@/lib/response';
import { CategoryModel } from '@/lib/schemas/category.schema';
import ProductModel from '@/lib/schemas/product.schema';
import { checkContentAccessPermission } from '@/lib/server/auth';
import { connectToDB } from '@/lib/server/db';
import { IProductSchema } from '@/lib/types/schema.types';
import { Document, Types } from 'mongoose';
import { NextResponse, NextRequest } from 'next/server';

type Product = IProductSchema & {
  _id: Types.ObjectId;
};

interface ProductResponse {
  length: number;
  products: Product[];
}

export const GET = async (req: NextRequest) => {
  try {
    console.clear();
    const reqOrigin = req.headers.get('origin') || '';

    console.log(reqOrigin);

    if (!checkContentAccessPermission(reqOrigin))
      throw new ServerError('Access Denied', 400);

    await connectToDB();

    const category = req.nextUrl.searchParams.get('category');
    const cat = await CategoryModel.findOne({ name: category });

    let products: (Document<unknown, {}, IProductSchema> &
      IProductSchema & {
        _id: Types.ObjectId;
      })[] = [];

    if (cat) {
      Log.log('I IF', cat);
      products = await ProductModel.find({
        categoryId: cat._id.toString(),
      })
        .sort({ createdAt: -1 })
        .select('-__v');

      Log.log('IN IF PRD', products);
    } else {
      products = await ProductModel.find()
        .sort({ createdAt: -1 })
        .select('-__v');
    }

    const response = Response.success<ProductResponse>({
      message: 'Products Selected Successfully',
      data: {
        length: products.length,
        products,
      },
      statusCode: 200,
    });

    return NextResponse.json(response, { status: response.statusCode });
  } catch (err) {
    const error = Response.error(err);
    return NextResponse.json(error, { status: error.statusCode });
  }
};
