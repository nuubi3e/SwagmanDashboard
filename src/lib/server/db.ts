import { connect } from 'mongoose';
import { Log } from '../logs';

let db: typeof import('mongoose') | null;

export const connectToDB = async () => {
  try {
    const URI = process.env.MONGO_URI || '';
    Log.log(URI);
    if (!URI) throw new Error('No Connection string found');

    if (!db) db = await connect(URI, { dbName: 'SwagmanDB' });

    return db;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const disconnectFromDB = async () => {
  if (!db) return;
  await db.disconnect();
  db = null;
};
