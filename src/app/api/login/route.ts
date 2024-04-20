import { Response, ServerError } from '@/lib/response';
import { connectToDB } from '@/lib/server/db';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { CustomerModel } from '@/lib/schemas/customer.schema';
import { Log } from '@/lib/logs';

const BRAND_NAME = 'Swagman';

interface LoginPayload {
  email?: string;
}

interface OTPResponse {
  otp: number;
  email: string;
  expireTime: number;
}

class AES {
  // Secret & key stored on server
  private static key = process.env.AES_SECRET as string;
  private static iv = process.env.AES_VECTOR_STRING as string;

  constructor() {}

  static encrypt(payload: string) {
    // Creating a cipher to encrypt data using server key and iv (vector string stored on server)
    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      Buffer.from(AES.key),
      Buffer.from(AES.iv)
    );
    let encryptedData = cipher.update(payload, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');

    return encryptedData;
  }

  static decrypt(encryptedData: string) {
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Buffer.from(AES.key),
      Buffer.from(AES.iv)
    );

    return decipher.update(encryptedData, 'hex', 'utf-8');
  }
}

const generateOTP = () => {
  const min = 100000; // Minimum value (inclusive)
  const max = 999999; // Maximum value (inclusive)

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function userOTP(expireTimeInMinutes: number, email: string) {
  const otp = generateOTP();
  const expiresIn = new Date().getTime() + expireTimeInMinutes * 60 * 10000; // 5 minutes in milliseconds
  const encPayload = JSON.stringify({
    email,
    otp,
    expireTime: expiresIn,
  } as OTPResponse);
  const key = AES.encrypt(encPayload);

  return { key, otp };
}

// POST to send OTP
export const POST = async (req: NextRequest) => {
  try {
    console.clear();
    const payload = (await req.json()) as LoginPayload;

    if (!payload?.email) throw new ServerError('Invalid Request', 400);

    // Now Generating a Key and OTP for user verification
    const expireInTime = 5; // OTP Expires in 5 minutes

    const OTP = userOTP(expireInTime, payload.email);

    // Sending OTP on Mail using nodemailer
    const mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_ACC as string,
        pass: process.env.GMAIL_APP_PASSWORD as string,
      },
    });

    const mailOptions = {
      from: {
        name: BRAND_NAME,
        address: process.env.GMAIL_ACC as string,
      },
      to: payload.email,
      subject: BRAND_NAME + ' Registration',
      text: `OTP is ${OTP.otp}`,
      html: `<h1>OTP is ${OTP.otp}</h1>`,
    };

    await mailTransporter.sendMail(mailOptions);

    const response = Response.success({
      message: 'OTP sent successfully',
      data: {
        key: OTP.key,
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
    console.clear();
    await connectToDB();
    const payload = (await req.json()) as { otp?: number };
    const headers = req.headers.get('X-Key') || '';
    Log.log('Headers ', req.headers);

    const decPayload = JSON.parse(AES.decrypt(headers)) as OTPResponse;

    if (!payload?.otp) throw new ServerError('Invalid Request', 400);

    const curTime = Date.now(); // this will return the current time in milliseconds

    Log.log('CUR', curTime, 'Expires: ', decPayload.expireTime);

    // both time are in milliseconds
    if (curTime > decPayload.expireTime)
      throw new ServerError('OTP Expired', 400);

    // check for OTP mismatch
    if (decPayload.otp !== payload.otp)
      throw new ServerError('Invalid OTP', 400);

    // getting no of customers
    const customers = (await CustomerModel.find()).length;

    // getting user based on email provided
    let customer = await CustomerModel.findOne({ email: decPayload.email });

    // checking if customer is already existing or not
    if (!customer)
      customer = await CustomerModel.create({
        firstName: `swag`,
        lastName: 'user',
        email: decPayload.email,
        username: `swaguser${customers + 1}`,
      });

    const authToken = jwt.sign(
      { id: customer._id.toString() },
      process.env.JWT_SECRET!,
      {
        expiresIn: '36h',
      }
    );

    const expiresTime = Date.now() + 32 * 60 * 60 * 1000;

    // Log.log(headers);
    const response = Response.success({
      message: 'User Logged in successfully',
      data: {
        token: authToken,
        expiresTime,
      },
      statusCode: 200,
    });
    return NextResponse.json(response, { status: response.statusCode });
  } catch (err) {
    const error = Response.error(err);
    return NextResponse.json(error, { status: error.statusCode });
  }
};
