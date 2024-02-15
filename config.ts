import { config } from 'dotenv';

config();
export const DB_CONNECTION_URL: string = process.env.DB_CONNECTION!;
