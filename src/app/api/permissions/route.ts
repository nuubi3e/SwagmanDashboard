import { Response, ServerError } from '@/lib/response';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { IUserSession } from '@/lib/types/global.types';
import RoleModel from '@/lib/schemas/role.schema';
import { connectToDB, disconnectFromDB } from '@/lib/server/db';
import UserModel from '@/lib/schemas/user.schema';

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const headers = req.headers.get('Authorization')?.split(' ')[1];

    const userData = jwt.verify(
      headers!,
      process.env.JWT_SECRET!
    ) as IUserSession;

    const userInDB = await UserModel.findOne({ _id: userData.id });

    if (!userInDB) throw new ServerError('User no longer exits', 404);

    const role = await RoleModel.findOne({ _id: userInDB.roleId });

    if (!role) throw new ServerError('Un Authorized', 401);

    const permissions = role.permissions.map((per) => per.name);

    const response = Response.success({
      message: 'Permission Selected successfully.',
      data: { permissions },
      statusCode: 200,
    });

    return NextResponse.json(response, { status: response.statusCode });
  } catch (err) {
    const error = Response.error(err);
    return NextResponse.json(error, { status: error.statusCode });
  }
};
