import { Log } from '@/lib/logs';
import { Response, ServerError } from '@/lib/response';
import { CustomerModel } from '@/lib/schemas/customer.schema';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

interface UserSession {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  mobileNo: number;
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
          firstName: customer.firstName,
          lastName: customer.lastName,
          username: customer.username,
          mobileNo: customer.mobileNo,
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

export const PUT = async (req: NextRequest) => {
  try {
    const payload = (await req.json()) as UserSession;
    console.clear();

    Log.log(payload);

    const header = req.headers.get('Authorization') || '';
    const decodedToken = jwt.verify(header, process.env.JWT_SECRET!) as {
      id: string;
    };

    // we never update the email
    await CustomerModel.findByIdAndUpdate(decodedToken.id, {
      username: payload.username,
      mobileNo: payload.mobileNo,
      firstName: payload.firstName,
      lastName: payload.lastName,
    });

    const response = Response.success({
      message: 'User Data Successfully',
      data: undefined,
      statusCode: 200,
    });
    return NextResponse.json(response, { status: response.statusCode });
  } catch (err) {
    const error = Response.error(err);
    return NextResponse.json(error, { status: error.statusCode });
  }
};
