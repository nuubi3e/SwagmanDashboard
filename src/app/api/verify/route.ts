import { Response, ServerError } from '@/lib/response';
import { CustomerModel } from '@/lib/schemas/customer.schema';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

interface UserSession {
  id: string;
  username: string;
  name: string;
  email: string;
}
export const GET = async (req: NextRequest) => {
  try {
    const header = req.headers.get('Authorization') || '';
    const decodedToken = jwt.verify(header, process.env.JWT_SECRET!) as {
      id: string;
    };

    const customer = await CustomerModel.findById(decodedToken.id);

    if (!customer) throw new ServerError('No User found', 404);

    const response = Response.success<{ user: UserSession }>({
      message: 'User Data Selected Successfully',
      data: {
        user: {
          email: customer.email,
          id: customer._id.toString(),
          name: customer.name,
          username: customer.username,
        },
      },
      statusCode: 200,
    });
    return NextResponse.json(response, { status: response.statusCode });
  } catch (err) {
    const error = Response.error(err);
    return NextResponse.json(error, { status: error.statusCode });
  }
};
